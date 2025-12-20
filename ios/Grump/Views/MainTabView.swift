import SwiftUI

struct MainTabView: View {
    @Environment(\.modelContext) private var modelContext
    @StateObject private var chatService: ChatService
    @State private var selectedTab = 0
    
    init(modelContext: ModelContext) {
        _chatService = StateObject(wrappedValue: ChatService(modelContext: modelContext))
    }
    
    var body: some View {
        TabView(selection: $selectedTab) {
            ChatView()
                .environmentObject(chatService)
                .tabItem {
                    Label("Chat", systemImage: "message.fill")
                }
                .tag(0)
            
            ChatHistoryView()
                .environment(\.modelContext, modelContext)
                .tabItem {
                    Label("History", systemImage: "book.fill")
                }
                .tag(1)
            
            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gearshape.fill")
                }
                .tag(2)
        }
        .accentColor(.grumpAccent)
    }
}

