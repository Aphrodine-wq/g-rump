import SwiftUI

struct EmptyChatStateView: View {
    @State private var rotationAngle: Double = 0
    
    var body: some View {
        VStack(spacing: 24) {
            // Grump icon with subtle animation
            ZStack {
                Circle()
                    .fill(Color.grumpAccent.opacity(0.1))
                    .frame(width: 80, height: 80)
                
                Image(systemName: "ellipsis.bubble.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.grumpAccent)
                    .rotationEffect(.degrees(rotationAngle))
            }
            .onAppear {
                withAnimation(.easeInOut(duration: 2.0).repeatForever(autoreverses: true)) {
                    rotationAngle = 5
                }
            }
            
            // Main message with Grump personality
            VStack(spacing: 12) {
                Text("Well?")
                    .font(.system(size: 24, weight: .semibold, design: .default))
                    .foregroundColor(.grumpTextPrimary)
                
                Text("I'm here. What do you want.")
                    .font(.system(size: 16, weight: .regular))
                    .foregroundColor(.grumpTextSecondary)
                    .multilineTextAlignment(.center)
                
                Text("(I'm waiting. Reluctantly.)")
                    .font(.system(size: 13, weight: .light))
                    .foregroundColor(.grumpTextSecondary)
                    .italic()
                    .opacity(0.8)
            }
            
            // Subtle hint with Grump attitude
            VStack(spacing: 4) {
                Text("Type something below")
                    .font(.system(size: 12, weight: .light))
                    .foregroundColor(.grumpTextSecondary)
                    .opacity(0.6)
                
                Image(systemName: "arrow.down")
                    .font(.system(size: 10))
                    .foregroundColor(.grumpTextSecondary)
                    .opacity(0.4)
                    .padding(.top, 4)
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 60)
        .padding(.horizontal, 32)
    }
}

#Preview {
    EmptyChatStateView()
        .background(Color.grumpBackground)
}
