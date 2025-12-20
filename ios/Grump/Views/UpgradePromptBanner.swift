import SwiftUI

struct UpgradePromptBanner: View {
    let onDismiss: () -> Void
    let onUpgrade: () -> Void
    @State private var showSubscriptionView = false
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "star.fill")
                .foregroundColor(.yellow)
                .font(.caption)
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Message limit reached")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(.grumpTextPrimary)
                
                Text("Upgrade to send more messages")
                    .font(.system(size: 12, weight: .regular))
                    .foregroundColor(.grumpTextSecondary)
            }
            
            Spacer()
            
            Button(action: {
                onUpgrade()
                showSubscriptionView = true
            }) {
                Text("Upgrade")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.grumpAccent)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.grumpAccent.opacity(0.1))
                    .cornerRadius(6)
            }
            .sheet(isPresented: $showSubscriptionView) {
                SubscriptionView()
            }
            
            Button(action: onDismiss) {
                Image(systemName: "xmark")
                    .foregroundColor(.grumpTextSecondary)
                    .font(.caption)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.grumpSurface)
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.grumpAccent.opacity(0.3), lineWidth: 1)
        )
    }
}

#Preview {
    UpgradePromptBanner(
        onDismiss: {},
        onUpgrade: {}
    )
    .padding()
    .background(Color.grumpBackground)
}
