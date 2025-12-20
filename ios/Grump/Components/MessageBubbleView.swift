import SwiftUI

struct MessageBubbleView: View {
    let message: Message
    @State private var isAppearing = false
    @State private var displayedText: String = ""
    @State private var shakeOffset: CGFloat = 0
    @State private var isShaking = false
    @State private var textRotation: Double = 0
    @State private var textPulse: Double = 1.0
    @State private var hasTriggeredReaction = false
    
    private var isGrumpMessage: Bool {
        message.sender == .grump
    }
    
    var body: some View {
        HStack {
            if !isGrumpMessage {
                Spacer(minLength: 60)
            }
            
            VStack(alignment: isGrumpMessage ? .leading : .trailing, spacing: 4) {
                Text(isGrumpMessage ? displayedText : message.content)
                    .font(.body)
                    .foregroundColor(.grumpTextPrimary)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(
                        isGrumpMessage
                            ? Color.grumpSurface
                            : Color.grumpUserBubble
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 18)
                            .stroke(
                                isGrumpMessage ? Color.grumpAccent.opacity(0.3) : Color.clear,
                                lineWidth: 1
                            )
                    )
                    .cornerRadius(18)
                    .offset(x: isGrumpMessage && !ReducedMotion.shouldDisable(.screenShake) ? shakeOffset : 0)
                    .rotationEffect(.degrees(ReducedMotion.shouldDisable(.bounce) ? 0 : textRotation))
                    .scaleEffect((isAppearing ? 1.0 : (isGrumpMessage && !ReducedMotion.shouldDisable(.messageSlam) ? 0.8 : 0.9)) * (ReducedMotion.shouldDisable(.bounce) ? 1.0 : textPulse))
                    .opacity(isAppearing ? 1.0 : 0.0)
                
                Text(formatTimestamp(message.timestamp))
                    .font(.caption2)
                    .foregroundColor(.grumpTextSecondary)
                    .padding(.horizontal, 4)
            }
            
            if isGrumpMessage {
                Spacer(minLength: 60)
            }
        }
        .onAppear {
            if isGrumpMessage {
                // Slam animation for Grump messages
                performSlamAnimation()
            } else {
                // Standard slide-in for user messages
                withAnimation(.spring(response: AnimationConstants.springResponse, dampingFraction: AnimationConstants.springDamping)) {
                    isAppearing = true
                }
            }
        }
    }
    
    private func performSlamAnimation() {
        if ReducedMotion.shouldDisable(.messageSlam) {
            // Simple fade-in for reduced motion
            withAnimation(ReducedMotion.animation(duration: 0.2)) {
                isAppearing = true
            }
            startCharacterReveal()
        } else {
            // Initial slam from left
            withAnimation(.easeOut(duration: AnimationConstants.messageSlamDuration)) {
                isAppearing = true
            }
            
            // Shake on land
            DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.messageSlamDuration) {
                performShake()
                // Start character-by-character reveal
                startCharacterReveal()
            }
        }
    }
    
    private func performShake() {
        guard !ReducedMotion.shouldDisable(.screenShake) else { return }
        
        isShaking = true
        withAnimation(.easeInOut(duration: AnimationConstants.messageShakeDuration).repeatCount(3, autoreverses: true)) {
            shakeOffset = AnimationConstants.messageShakeAmount
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + AnimationConstants.messageShakeDuration * 3) {
            shakeOffset = 0
            isShaking = false
        }
    }
    
    private func startCharacterReveal() {
        let fullText = message.content
        let typingSpeed = determineTypingSpeed(for: fullText)
        let characters = Array(fullText)
        var index = 0
        
        Timer.scheduledTimer(withTimeInterval: 1.0 / typingSpeed, repeats: true) { [self] timer in
            if index < characters.count {
                displayedText = String(characters[0...index])
                
                // Check for text reactions
                if !hasTriggeredReaction {
                    checkForTextReactions(in: displayedText)
                }
                
                index += 1
            } else {
                timer.invalidate()
            }
        }
    }
    
    private func checkForTextReactions(in text: String) {
        let lowerText = text.lowercased()
        
        // "Fine." - Heavy landing, brief screen shake
        if lowerText.contains("fine.") && !hasTriggeredReaction {
            hasTriggeredReaction = true
            HapticService.shared.grumpMessageLands()
            withAnimation(.easeOut(duration: 0.1)) {
                shakeOffset = 5
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                shakeOffset = 0
            }
        }
        
        // "Whatever." - Dismissive tilt
        if lowerText.contains("whatever.") && textRotation == 0 {
            withAnimation(.easeInOut(duration: 0.2)) {
                textRotation = -2
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                withAnimation(.easeInOut(duration: 0.2)) {
                    textRotation = 0
                }
            }
        }
        
        // "Look." - Attention pulse
        if lowerText.contains("look.") && textPulse == 1.0 {
            withAnimation(.easeInOut(duration: 0.2)) {
                textPulse = 1.1
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                withAnimation(.easeInOut(duration: 0.2)) {
                    textPulse = 1.0
                }
            }
        }
        
        // "Incredible." (sarcastic) - Eye roll effect (visual pulse)
        if lowerText.contains("incredible.") && textPulse == 1.0 {
            withAnimation(.easeInOut(duration: 0.15).repeatCount(2, autoreverses: true)) {
                textPulse = 1.05
            }
        }
        
        // "..." - Longer pause effect
        if text.hasSuffix("...") && text.count > 3 {
            // Text already fades in slower, no additional effect needed
        }
        
        // User's name (would need to detect) - Brief highlight
        // This would require knowing the user's name from settings
    }
    
    private func determineTypingSpeed(for text: String) -> Double {
        // Analyze text to determine mood and speed
        let lowerText = text.lowercased()
        
        // Fast (annoyed)
        if lowerText.contains("fine") || lowerText.contains("whatever") || lowerText.contains("ugh") {
            return AnimationConstants.typingSpeedFast
        }
        
        // Slow (thoughtful)
        if lowerText.contains("think") || lowerText.contains("consider") || text.count > 100 {
            return AnimationConstants.typingSpeedThoughtful
        }
        
        // Normal
        return AnimationConstants.typingSpeedNormal
    }
    
    private func formatTimestamp(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
}
