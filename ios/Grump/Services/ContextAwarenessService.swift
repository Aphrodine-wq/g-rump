import Foundation

@MainActor
class ContextAwarenessService: ObservableObject {
    static let shared = ContextAwarenessService()
    
    private var sessionStartTime: Date = Date()
    private var messageCount: Int = 0
    private var questionsAsked: Int = 0
    private var adviceIgnored: Int = 0
    private var complimentCount: Int = 0
    private var conversationHistory: [String] = []
    
    private init() {}
    
    func analyzeMessage(_ message: String) -> EmotionalState? {
        let lowerMessage = message.lowercased()
        
        // SKEPTICAL triggers
        if isSimpleQuestion(lowerMessage) {
            return .skeptical
        }
        
        // SOFT_MODE triggers
        if containsSoftModeKeywords(lowerMessage) {
            return .softMode
        }
        
        // SUSPICIOUS triggers
        if containsCompliment(lowerMessage) {
            complimentCount += 1
            if complimentCount > 2 {
                return .suspicious
            }
        }
        
        // ANNOYED triggers
        if isRepeatQuestion(lowerMessage) {
            return .annoyed
        }
        
        if lowerMessage.contains("but") && conversationHistory.count > 0 {
            // User is dismissing advice
            adviceIgnored += 1
            if adviceIgnored > 0 {
                return .annoyed
            }
        }
        
        // Track for future analysis
        conversationHistory.append(lowerMessage)
        messageCount += 1
        
        if lowerMessage.contains("?") {
            questionsAsked += 1
        }
        
        return nil
    }
    
    func getTimeBasedContext() -> (state: EmotionalState?, modifier: Double) {
        let calendar = Calendar.current
        let hour = calendar.component(.hour, from: Date())
        let weekday = calendar.component(.weekday, from: Date())
        
        var modifier: Double = 1.0
        
        // 3AM mode
        if hour >= 2 && hour < 5 {
            return (.threeAM, 1.0)
        }
        
        // Monday morning
        if weekday == 2 && hour >= 7 && hour < 10 {
            modifier = 1.3 // +30% annoyance
        }
        
        // Early morning
        if hour >= 5 && hour < 8 {
            modifier = 1.1
        }
        
        // Late night
        if hour >= 11 && hour < 2 {
            modifier = 0.9 // Slightly softer
        }
        
        return (nil, modifier)
    }
    
    func getSessionContext() -> (state: EmotionalState?, message: String?) {
        let sessionDuration = Date().timeIntervalSince(sessionStartTime)
        
        if sessionDuration > 2700 { // 45+ minutes
            return (.softMode, "We've been talking for \(Int(sessionDuration / 60)) minutes. Are you okay?")
        } else if sessionDuration > 1800 { // 30+ minutes
            return (nil, "We're still doing this?")
        } else if sessionDuration > 900 { // 15+ minutes
            return (nil, nil)
        }
        
        return (nil, nil)
    }
    
    func resetSession() {
        sessionStartTime = Date()
        messageCount = 0
        questionsAsked = 0
        adviceIgnored = 0
        complimentCount = 0
        conversationHistory = []
    }
    
    private func isSimpleQuestion(_ message: String) -> Bool {
        let simplePatterns = [
            "what is",
            "what's",
            "how do you",
            "can you",
            "what does"
        ]
        
        for pattern in simplePatterns {
            if let range = message.range(of: pattern) {
                // Check if it's a basic noun/fact question
                let afterPattern = String(message[range.upperBound...])
                if afterPattern.count < 20 { // Short follow-up suggests simple question
                    return true
                }
            }
        }
        
        return false
    }
    
    private func containsSoftModeKeywords(_ message: String) -> Bool {
        let keywords = [
            "sad", "depressed", "anxious", "stressed",
            "going through", "hard time", "struggling",
            "lonely", "scared", "worried", "difficult",
            "tough", "rough", "down"
        ]
        
        return keywords.contains { message.contains($0) }
    }
    
    private func containsCompliment(_ message: String) -> Bool {
        let compliments = [
            "you're great", "you're awesome", "you're the best",
            "love you", "thank you so much", "amazing",
            "perfect", "wonderful", "fantastic"
        ]
        
        return compliments.contains { message.contains($0) }
    }
    
    private func isRepeatQuestion(_ message: String) -> Bool {
        // Simple similarity check - in production, use proper similarity algorithm
        for previousMessage in conversationHistory.suffix(5) {
            let similarity = calculateSimilarity(message, previousMessage)
            if similarity > 0.8 {
                return true
            }
        }
        return false
    }
    
    private func calculateSimilarity(_ str1: String, _ str2: String) -> Double {
        let words1 = Set(str1.lowercased().components(separatedBy: .whitespaces))
        let words2 = Set(str2.lowercased().components(separatedBy: .whitespaces))
        
        let intersection = words1.intersection(words2)
        let union = words1.union(words2)
        
        return union.isEmpty ? 0.0 : Double(intersection.count) / Double(union.count)
    }
}

