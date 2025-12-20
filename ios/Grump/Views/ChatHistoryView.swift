import SwiftUI
import SwiftData

struct ChatHistoryView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \ChatSession.updatedAt, order: .reverse) private var sessions: [ChatSession]
    @State private var selectedSession: ChatSession?
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.grumpBackground
                    .ignoresSafeArea()
                
                if sessions.isEmpty {
                    EmptyHistoryView()
                } else {
                    ScrollView {
                        LazyVStack(spacing: 0) {
                            ForEach(sessions) { session in
                                HistoryItemView(session: session)
                                    .onTapGesture {
                                        selectedSession = session
                                    }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Chat History")
            .navigationBarTitleDisplayMode(.large)
            .sheet(item: $selectedSession) { session in
                SessionDetailView(session: session, modelContext: modelContext)
            }
        }
    }
}

struct HistoryItemView: View {
    let session: ChatSession
    
    private var previewText: String {
        if let lastMessage = session.messages.last {
            return lastMessage.content
        }
        return "No messages"
    }
    
    private var dateString: String {
        let formatter = DateFormatter()
        if Calendar.current.isDateInToday(session.updatedAt) {
            formatter.timeStyle = .short
            return "Today, \(formatter.string(from: session.updatedAt))"
        } else if Calendar.current.isDateInYesterday(session.updatedAt) {
            formatter.timeStyle = .short
            return "Yesterday, \(formatter.string(from: session.updatedAt))"
        } else {
            formatter.dateStyle = .medium
            formatter.timeStyle = .short
            return formatter.string(from: session.updatedAt)
        }
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Conversation")
                        .font(.headline)
                        .foregroundColor(.grumpTextPrimary)
                    
                    Text(previewText)
                        .font(.subheadline)
                        .foregroundColor(.grumpTextSecondary)
                        .lineLimit(2)
                }
                
                Spacer()
                
                Text(dateString)
                    .font(.caption)
                    .foregroundColor(.grumpTextSecondary)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 15)
            
            Divider()
                .background(Color.grumpBorder)
        }
        .background(Color.grumpSurface)
    }
}

struct EmptyHistoryView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "book.closed")
                .font(.system(size: 60))
                .foregroundColor(.grumpTextSecondary)
            
            Text("No Chat History")
                .font(.title2)
                .foregroundColor(.grumpTextPrimary)
            
            Text("Start a conversation with Grump to see it here")
                .font(.subheadline)
                .foregroundColor(.grumpTextSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
    }
}

struct SessionDetailView: View {
    let session: ChatSession
    @Environment(\.dismiss) private var dismiss
    let modelContext: ModelContext
    @StateObject private var chatService: ChatService
    
    init(session: ChatSession, modelContext: ModelContext) {
        self.session = session
        self.modelContext = modelContext
        _chatService = StateObject(wrappedValue: ChatService(modelContext: modelContext))
    }
    
    var body: some View {
        NavigationStack {
            ChatView()
                .environmentObject(chatService)
                .navigationTitle("Conversation")
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .navigationBarTrailing) {
                        Button("Done") {
                            dismiss()
                        }
                        .foregroundColor(.grumpAccent)
                    }
                }
                .onAppear {
                    // Load messages from this session
                    chatService.loadSession(session)
                }
        }
    }
}

