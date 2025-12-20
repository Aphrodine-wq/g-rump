import SwiftUI
import SwiftData

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    
    var body: some View {
        ContentViewWrapper(modelContext: modelContext)
    }
}

private struct ContentViewWrapper: View {
    let modelContext: ModelContext
    @StateObject private var chatService: ChatService
    
    init(modelContext: ModelContext) {
        self.modelContext = modelContext
        _chatService = StateObject(wrappedValue: ChatService(modelContext: modelContext))
    }
    
    var body: some View {
        Group {
            if UserDefaults.standard.bool(forKey: "hasCompletedOnboarding") {
                MainTabView(modelContext: modelContext)
            } else {
                OnboardingView()
            }
        }
    }
}

