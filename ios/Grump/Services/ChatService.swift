import Foundation
import SwiftData

@MainActor
class ChatService: ObservableObject {
    @Published var messages: [Message] = []
    @Published var isTyping = false
    @Published var errorMessage: String?
    @Published var remainingMessages: Int = 20 // Default to free tier
    @Published var showUpgradePrompt = false
    
    private let apiClient = APIClient.shared
    private let storeKitService = StoreKitService.shared
    private var currentSession: ChatSession?
    private let modelContext: ModelContext
    private var messageCountThisMonth: Int = 0
    
    init(modelContext: ModelContext) {
        self.modelContext = modelContext
        loadOrCreateSession()
        
        // Initialize message limits
        Task { @MainActor in
            await storeKitService.updateSubscriptionStatus()
            updateMessageLimits()
        }
    }
    
    func updateMessageLimits() {
        let messagesPerMonth = storeKitService.getMessagesPerMonth()
        let monthKey = getCurrentMonthKey()
        let usedKey = "messagesUsed_\(monthKey)"
        let used = UserDefaults.standard.integer(forKey: usedKey)
        
        // -1 represents unlimited (for future premium tier with unlimited)
        // For now, premium has 1000 messages, so we calculate normally
        if messagesPerMonth == 0 {
            remainingMessages = -1 // Unlimited
        } else {
            remainingMessages = max(0, messagesPerMonth - used)
        }
    }
    
    private func getCurrentMonthKey() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM"
        return formatter.string(from: Date())
    }
    
    private func canSendMessage() -> Bool {
        // -1 means unlimited, > 0 means messages remaining, 0 means limit reached
        return remainingMessages != 0
    }
    
    private func incrementMessageCount() {
        let monthKey = getCurrentMonthKey()
        let usedKey = "messagesUsed_\(monthKey)"
        let used = UserDefaults.standard.integer(forKey: usedKey)
        UserDefaults.standard.set(used + 1, forKey: usedKey)
        messageCountThisMonth = used + 1
        updateMessageLimits()
    }
    
    func loadOrCreateSession() {
        let descriptor = FetchDescriptor<ChatSession>(
            sortBy: [SortDescriptor(\.updatedAt, order: .reverse)]
        )
        
        do {
            if let existingSession = try modelContext.fetch(descriptor).first {
                currentSession = existingSession
                messages = existingSession.messages.sorted { $0.timestamp < $1.timestamp }
            } else {
                createNewSession()
            }
        } catch {
            print("Error loading session: \(error)")
            createNewSession()
        }
    }
    
    func createNewSession() {
        let newSession = ChatSession()
        modelContext.insert(newSession)
        currentSession = newSession
        messages = []
        
        do {
            try modelContext.save()
        } catch {
            print("Error creating session: \(error)")
        }
    }
    
    func loadSession(_ session: ChatSession) {
        currentSession = session
        messages = session.messages.sorted { $0.timestamp < $1.timestamp }
    }
    
    func sendMessage(_ content: String) async {
        guard !content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
            return
        }
        
        // Check subscription limits before sending
        await storeKitService.updateSubscriptionStatus()
        await MainActor.run {
            updateMessageLimits()
        }
        
        if !canSendMessage() {
            await MainActor.run {
                errorMessage = getMessageLimitErrorMessage()
                showUpgradePrompt = true
                // Haptic feedback for limit reached
                HapticService.shared.maximumGrump()
            }
            return
        }
        
        let userMessage = Message(
            content: content,
            sender: .user,
            timestamp: Date(),
            session: currentSession
        )
        
        messages.append(userMessage)
        currentSession?.addMessage(userMessage)
        
        do {
            try modelContext.save()
        } catch {
            print("Error saving message: \(error)")
        }
        
        isTyping = true
        errorMessage = nil
        
        // Context awareness analysis
        if let suggestedState = ContextAwarenessService.shared.analyzeMessage(content) {
            // Notify animation service of suggested state
            NotificationCenter.default.post(
                name: NSNotification.Name("SuggestedExpressionState"),
                object: suggestedState
            )
        }
        
        do {
            let response = try await apiClient.sendMessage(content, conversationHistory: messages)
            
            // Increment message count only after successful API response
            await MainActor.run {
                incrementMessageCount()
            }
            
            let grumpMessage = Message(
                content: response,
                sender: .grump,
                timestamp: Date(),
                session: currentSession
            )
            
            messages.append(grumpMessage)
            currentSession?.addMessage(grumpMessage)
            
            // Play sound for Grump message
            SoundService.shared.playSound(.messageReceived)
            
            do {
                try modelContext.save()
            } catch {
                print("Error saving response: \(error)")
            }
        } catch {
            await MainActor.run {
                errorMessage = errorMessage(for: error)
                // Haptic feedback for errors
                HapticService.shared.maximumGrump()
            }
            print("Error sending message: \(error)")
        }
        
        isTyping = false
    }
    
    private func errorMessage(for error: Error) -> String {
        if let apiError = error as? APIError {
            switch apiError {
            case .invalidURL:
                return "Oh great. The server URL is wrong. Someone messed up the configuration. Fantastic."
            case .invalidResponse:
                return "The server sent me garbage. Typical. Try again I guess."
            case .httpError(let code):
                if code == 429 {
                    return "Too many requests. I'm tired. Give me a break and try again later."
                } else if code == 500 {
                    return "Server error. I'm having technical difficulties. Surprise, surprise."
                }
                return "Server error (code: \(code)). Something broke. Try again."
            case .decodingError:
                return "Couldn't understand what the server said. Try again."
            case .networkError:
                return "Network error. Check your connection. I can't talk to the server right now."
            }
        }
        return "Something went wrong. Great. Try again."
    }
    
    private func getMessageLimitErrorMessage() -> String {
        let tier = storeKitService.subscriptionStatus.tierId.capitalized
        if tier.lowercased() == "free" {
            return "That's it. You've used all your free messages. Want more? Upgrade. (I'm not going to beg.)"
        }
        return "You've hit your \(tier) plan limit. Upgrade if you want to keep talking. (I'm fine either way.)"
    }
}

