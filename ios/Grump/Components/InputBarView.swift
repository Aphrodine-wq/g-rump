import SwiftUI

struct InputBarView: View {
    @Binding var messageText: String
    let onSend: () -> Void
    let isDisabled: Bool
    var onTextChange: ((String) -> Void)? = nil
    
    private let MAX_MESSAGE_LENGTH = 2000
    
    var body: some View {
        HStack(spacing: 12) {
            TextField("Say something. I guess.", text: $messageText)
                .textFieldStyle(.plain)
                .font(.body)
                .foregroundColor(.grumpTextPrimary)
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.grumpSurface)
                .cornerRadius(24)
                .disabled(isDisabled)
                .onChange(of: messageText) { _, newValue in
                    // Enforce max length
                    if newValue.count > MAX_MESSAGE_LENGTH {
                        messageText = String(newValue.prefix(MAX_MESSAGE_LENGTH))
                        // Haptic feedback for limit reached
                        let notificationFeedback = UINotificationFeedbackGenerator()
                        notificationFeedback.notificationOccurred(.warning)
                    } else {
                        onTextChange?(newValue)
                    }
                }
                .onSubmit {
                    if !messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        onSend()
                    }
                }
            
            Button(action: {
                let text = messageText.trimmingCharacters(in: .whitespacesAndNewlines)
                guard !text.isEmpty else { return }
                
                // Haptic feedback on send
                let impactFeedback = UIImpactFeedbackGenerator(style: .medium)
                impactFeedback.impactOccurred()
                onSend()
            }) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.system(size: 32))
                    .foregroundColor(
                        messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isDisabled
                            ? .grumpTextSecondary
                            : .grumpAccent
                    )
                    .scaleEffect(messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isDisabled ? 1.0 : 1.1)
            }
            .disabled(messageText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isDisabled)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: messageText.isEmpty)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color.grumpBackground)
    }
}

