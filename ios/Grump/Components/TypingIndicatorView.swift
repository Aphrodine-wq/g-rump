import SwiftUI

struct TypingIndicatorView: View {
    @State private var animationPhase = 0
    @State private var personalityText: String = ""
    @State private var miniAvatarBlink = false
    
    private let personalityTexts = [
        "Grump is typing... reluctantly",
        "Grump is composing a response... unfortunately",
        "Grump is thinking... don't get excited",
        "Grump is judging your question...",
        "...",
        "Grump has opinions...",
        "*sigh* Grump is typing",
        "Grump is awake, sadly",
        "Grump is processing... somehow",
        "Grump is formulating a response... I guess"
    ]
    
    var body: some View {
        HStack(spacing: 8) {
            // Mini avatar
            MiniGrumpAvatar(isBlinking: miniAvatarBlink)
                .frame(width: 24, height: 24)
            
            VStack(alignment: .leading, spacing: 4) {
                HStack(spacing: 4) {
                    Text(personalityText)
                        .font(.caption)
                        .foregroundColor(.grumpTextSecondary)
                    
                    if !personalityText.contains("...") {
                        HStack(spacing: 2) {
                            ForEach(0..<3) { index in
                                Circle()
                                    .fill(Color.grumpTextSecondary)
                                    .frame(width: 4, height: 4)
                                    .opacity(animationPhase == index ? 1.0 : 0.3)
                            }
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.grumpSurface)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(Color.grumpAccent.opacity(0.3), lineWidth: 1)
                )
                .cornerRadius(18)
            }
            
            Spacer(minLength: 60)
        }
        .onAppear {
            personalityText = personalityTexts.randomElement() ?? personalityTexts[0]
            startAnimation()
            startMiniAvatarAnimation()
        }
    }
    
    private func startAnimation() {
        Timer.scheduledTimer(withTimeInterval: 0.5, repeats: true) { _ in
            withAnimation(.easeInOut(duration: 0.3)) {
                animationPhase = (animationPhase + 1) % 3
            }
        }
    }
    
    private func startMiniAvatarAnimation() {
        Timer.scheduledTimer(withTimeInterval: Double.random(in: 2...3), repeats: true) { _ in
            withAnimation(.easeInOut(duration: 0.2)) {
                miniAvatarBlink = true
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.2) {
                withAnimation(.easeInOut(duration: 0.2)) {
                    miniAvatarBlink = false
                }
            }
        }
    }
}

struct MiniGrumpAvatar: View {
    let isBlinking: Bool
    
    var body: some View {
        ZStack {
            Circle()
                .fill(Color.grumpSurface)
                .frame(width: 24, height: 24)
            
            // Eyes
            HStack(spacing: 4) {
                if isBlinking {
                    Path { path in
                        path.move(to: CGPoint(x: -2, y: 0))
                        path.addLine(to: CGPoint(x: 2, y: 0))
                    }
                    .stroke(Color.grumpTextPrimary, lineWidth: 1)
                    .frame(width: 4, height: 4)
                    
                    Path { path in
                        path.move(to: CGPoint(x: -2, y: 0))
                        path.addLine(to: CGPoint(x: 2, y: 0))
                    }
                    .stroke(Color.grumpTextPrimary, lineWidth: 1)
                    .frame(width: 4, height: 4)
                } else {
                    Circle()
                        .fill(Color.grumpTextPrimary)
                        .frame(width: 3, height: 3)
                    
                    Circle()
                        .fill(Color.grumpTextPrimary)
                        .frame(width: 3, height: 3)
                }
            }
            .offset(y: -2)
            
            // Mouth
            Path { path in
                path.move(to: CGPoint(x: -3, y: 3))
                path.addQuadCurve(
                    to: CGPoint(x: 3, y: 3),
                    control: CGPoint(x: 0, y: 5)
                )
            }
            .stroke(Color.grumpTextPrimary, lineWidth: 1)
            .offset(y: 2)
        }
    }
}

