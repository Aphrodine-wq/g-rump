import SwiftUI

struct EmptyChatStateView: View {
    var body: some View {
        VStack(spacing: 20) {
            // Grump icon/illustration
            Image(systemName: "ellipsis.bubble")
                .font(.system(size: 48))
                .foregroundColor(.grumpTextSecondary)
                .opacity(0.5)
            
            // Main message
            VStack(spacing: 8) {
                Text("Go ahead. I'm listening.")
                    .font(.system(size: 20, weight: .medium, design: .serif))
                    .foregroundColor(.grumpTextPrimary)
                
                Text("(reluctantly)")
                    .font(.system(size: 14, weight: .light))
                    .foregroundColor(.grumpTextSecondary)
                    .italic()
            }
            
            // Subtle hint
            Text("Tap below to start chatting with Grump")
                .font(.system(size: 12, weight: .light))
                .foregroundColor(.grumpTextSecondary)
                .opacity(0.7)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 60)
    }
}

#Preview {
    EmptyChatStateView()
        .background(Color.grumpBackground)
}
