import SwiftUI

struct ChatView: View {
    @EnvironmentObject var chatService: ChatService
    @StateObject private var animationService = AnimationService()
    @StateObject private var easterEggService = EasterEggService.shared
    @StateObject private var contextService = ContextAwarenessService.shared
    @State private var messageText = ""
    @FocusState private var isInputFocused: Bool
    @State private var statusText = "What do you want."
    @State private var pullOffset: CGFloat = 0
    @State private var isPulling = false
    
    var body: some View {
        ZStack {
            Color.grumpBackground
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                    // Avatar section - always visible at top
                    VStack(spacing: 8) {
                        GrumpAvatarView(
                            animationState: animationService.state,
                            isBlinking: animationService.isBlinking,
                            eyeTrackingPosition: animationService.eyeTrackingPosition,
                            blinkType: animationService.blinkType
                        )
                        .frame(width: AnimationConstants.avatarSize, height: AnimationConstants.avatarSize)
                        .scaleEffect(animationService.state.breathingScale)
                        .scaleEffect(y: isPulling ? 1.0 + (pullOffset / 200) : 1.0)
                        .offset(y: isPulling ? pullOffset * 0.3 : 0)
                    
                    // Status text
                    Text(statusText)
                        .font(.caption)
                        .foregroundColor(.grumpTextSecondary)
                        .padding(.horizontal)
                }
                .padding(.vertical, 16)
                .background(Color.grumpBackground)
                
                Divider()
                    .background(Color.grumpBorder)
                
                // Messages list - scrolls beneath avatar
                ScrollViewReader { proxy in
                    ScrollView {
                        // Pull to refresh
                        GeometryReader { geometry in
                            Color.clear
                                .preference(key: ScrollOffsetPreferenceKey.self, value: geometry.frame(in: .named("scroll")).minY)
                        }
                        .frame(height: 0)
                        
                        LazyVStack(spacing: 12) {
                            if chatService.messages.isEmpty {
                                EmptyChatStateView()
                                    .id("empty")
                                    .padding(.top, 40)
                            } else {
                                ForEach(chatService.messages) { message in
                                    MessageBubbleView(message: message)
                                        .id(message.id)
                                        .transition(.asymmetric(
                                            insertion: message.sender == .grump ? .identity : .scale.combined(with: .opacity),
                                            removal: .opacity
                                        ))
                                }
                                
                                if chatService.isTyping {
                                    TypingIndicatorView()
                                        .id("typing")
                                        .transition(.opacity)
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 12)
                    }
                    .coordinateSpace(name: "scroll")
                    .onPreferenceChange(ScrollOffsetPreferenceKey.self) { offset in
                        handlePullToRefresh(offset: offset)
                    }
                    .onChange(of: chatService.messages.count) { _, _ in
                        scrollToBottom(proxy: proxy)
                    }
                    .onChange(of: chatService.isTyping) { _, newValue in
                        if newValue {
                            scrollToBottom(proxy: proxy)
                            updateAnimationForTyping()
                        }
                    }
                }
                
                // Error message
                if let errorMessage = chatService.errorMessage {
                    HStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(.grumpAccent)
                            .font(.caption)
                        Text(errorMessage)
                            .font(.caption)
                            .foregroundColor(.grumpTextPrimary)
                        Spacer()
                        Button(action: {
                            chatService.errorMessage = nil
                        }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.grumpTextSecondary)
                                .font(.caption)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(Color.grumpSurface)
                    .cornerRadius(8)
                    .padding(.horizontal, 16)
                    .padding(.bottom, 8)
                }
                
                // Upgrade prompt
                if chatService.showUpgradePrompt {
                    UpgradePromptBanner(
                        onDismiss: {
                            chatService.showUpgradePrompt = false
                        },
                        onUpgrade: {
                            // Navigate to subscription view
                            chatService.showUpgradePrompt = false
                        }
                    )
                    .padding(.horizontal, 16)
                    .padding(.bottom, 8)
                }
                
                // Remaining messages indicator (show if limited and not unlimited)
                if chatService.remainingMessages >= 0 && chatService.remainingMessages <= 100 {
                    HStack {
                        Spacer()
                        Text("\(chatService.remainingMessages) messages left")
                            .font(.system(size: 11, weight: .light))
                            .foregroundColor(chatService.remainingMessages <= 5 ? .grumpAccent : .grumpTextSecondary)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 4)
                            .background(Color.grumpSurface)
                            .cornerRadius(8)
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 4)
                }
                
                // Input bar
                InputBarView(
                    messageText: $messageText,
                    onSend: {
                        sendMessage()
                    },
                    isDisabled: chatService.isTyping || !canSendMessage(),
                    onTextChange: { text in
                        updateEyeTracking(for: text)
                    }
                )
                .focused($isInputFocused)
                .background(
                    Color.grumpBackground
                        .shadow(color: .black.opacity(0.2), radius: 8, y: -4)
                )
            }
        }
        .navigationTitle("Chat with Grump")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: {
                    HapticService.shared.sendMessage()
                    chatService.createNewSession()
                    animationService.transitionToState(.idle)
                    statusText = "What do you want."
                }) {
                    Image(systemName: "plus")
                        .foregroundColor(.grumpAccent)
                }
            }
        }
        .onAppear {
            animationService.transitionToState(.idle)
            checkEasterEggs()
            checkTimeBasedContext()
            setupContextNotifications()
        }
        .onChange(of: chatService.isTyping) { _, isTyping in
            if isTyping {
                animationService.transitionToState(.processing)
            } else {
                // Check if we have a new message to respond to
                if !chatService.messages.isEmpty {
                    animationService.transitionToState(.responding)
                } else {
                    animationService.transitionToState(.idle)
                }
            }
        }
        .onChange(of: chatService.errorMessage) { _, errorMessage in
            if errorMessage != nil {
                animationService.transitionToState(.error)
                statusText = "Something went wrong. Great."
            }
        }
        .onChange(of: easterEggService.currentEasterEgg) { _, egg in
            handleEasterEgg(egg)
        }
        .onChange(of: messageText) { _, _ in
            easterEggService.updateInteractionTime()
        }
        .onTapGesture {
            easterEggService.updateInteractionTime()
        }
    }
    
    private func canSendMessage(chatService: ChatService) -> Bool {
        return chatService.remainingMessages > 0 || chatService.remainingMessages < 0
    }
    
    private func canSendMessage() -> Bool {
        // Check if user can send message based on subscription limits
        return chatService.remainingMessages > 0 || chatService.remainingMessages < 0
    }
    
    private func updateEyeTracking(for text: String) {
        // Calculate eye tracking position based on text length
        let textLength = text.count
        let maxLength: CGFloat = 50 // Approximate max visible chars
        let trackingRange = AnimationConstants.eyeTrackingRange
        let position = min(CGFloat(textLength) / maxLength * trackingRange, trackingRange)
        
        animationService.updateEyeTracking(position: position)
        
        // Update animation state
        if text.isEmpty {
            animationService.transitionToState(.idle)
            statusText = "What do you want."
        } else {
            animationService.transitionToState(.listening)
            statusText = "You're typing. Great."
        }
    }
    
    private func updateAnimationForTyping() {
        animationService.transitionToState(.processing)
        statusText = "Ugh, let me think."
    }
    
    private func sendMessage() {
        let text = messageText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        
        // Haptic feedback
        if hapticFeedbackEnabled {
            HapticService.shared.sendMessage()
        }
        
        messageText = ""
        isInputFocused = false
        animationService.updateEyeTracking(position: 0)
        animationService.transitionToState(.processing)
        statusText = "Ugh, let me think."
        
        Task {
            await chatService.sendMessage(text)
            animationService.transitionToState(.responding)
            statusText = "Fine. Here."
            
            // Return to idle after response
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                animationService.transitionToState(.idle)
                statusText = "What do you want."
            }
        }
    }
    
    private func scrollToBottom(proxy: ScrollViewProxy) {
        withAnimation(.easeOut(duration: 0.3)) {
            if let lastMessage = chatService.messages.last {
                proxy.scrollTo(lastMessage.id, anchor: .bottom)
            } else if chatService.isTyping {
                proxy.scrollTo("typing", anchor: .bottom)
            }
        }
    }
    
    private func checkEasterEggs() {
        if let egg = easterEggService.checkTimeBasedEasterEgg() {
            handleEasterEgg(egg)
        }
    }
    
    private func handleEasterEgg(_ egg: EasterEggService.EasterEggType?) {
        guard let egg = egg else { return }
        
        switch egg {
        case .sleep:
            animationService.transitionToState(.sleep)
            statusText = "Zzz..."
            
        case .jumpscare:
            animationService.transitionToState(.jumpscare)
            statusText = "You again."
            
        case .threeAM:
            animationService.transitionToState(.threeAM)
            statusText = "Why are either of us awake right now."
            
        case .birthday:
            animationService.transitionToState(.birthday)
            statusText = "Happy birthday. I guess."
        }
    }
    
    private func handlePullToRefresh(offset: CGFloat) {
        if offset > 0 {
            isPulling = true
            pullOffset = min(offset, 100)
            
            if offset > 80 {
                statusText = "Refreshing... I guess things change."
            }
        } else {
            if isPulling {
                // Snap back
                HapticService.shared.pullToRefresh()
                withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                    pullOffset = 0
                }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
                    isPulling = false
                    statusText = "What do you want."
                }
            }
        }
    }
}

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}


