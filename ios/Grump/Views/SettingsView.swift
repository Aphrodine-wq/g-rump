import SwiftUI

struct SettingsView: View {
    @AppStorage("hapticFeedbackEnabled") private var hapticFeedbackEnabled = true
    @AppStorage("typingSoundsEnabled") private var typingSoundsEnabled = false
    @AppStorage("darkModeEnabled") private var darkModeEnabled = true
    @StateObject private var storeKit = StoreKitService.shared
    @State private var grumpMood: String = "Cranky"
    @State private var sarcasmLevel: String = "Maximum"
    @State private var showSubscriptionView = false
    @State private var remainingMessages: Int = 0
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color.grumpBackground
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 0) {
                        // Subscription Section
                        SettingsSection(title: "Subscription & Pricing") {
                            if storeKit.isLoading {
                                SettingsRow(
                                    title: "Loading...",
                                    trailing: {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle())
                                    }
                                )
                            } else {
                                SettingsRow(
                                    title: "Current Plan",
                                    trailing: {
                                        HStack(spacing: 8) {
                                            VStack(alignment: .trailing, spacing: 4) {
                                                Text(storeKit.subscriptionStatus.tierId.capitalized)
                                                    .font(.subheadline)
                                                    .foregroundColor(.grumpTextPrimary)
                                                Text("\(storeKit.getMessagesPerMonth()) messages/month")
                                                    .font(.caption)
                                                    .foregroundColor(.grumpTextSecondary)
                                            }
                                            Image(systemName: "chevron.right")
                                                .font(.caption)
                                                .foregroundColor(.grumpTextSecondary)
                                        }
                                    }
                                )
                                .onTapGesture {
                                    showSubscriptionView = true
                                }
                                
                                // Remaining messages this month
                                if remainingMessages >= 0 {
                                    SettingsRow(
                                        title: "Messages Remaining",
                                        trailing: {
                                            HStack(spacing: 6) {
                                                if remainingMessages <= 5 {
                                                    Image(systemName: "exclamationmark.circle.fill")
                                                        .font(.system(size: 10))
                                                        .foregroundColor(.grumpAccent)
                                                }
                                                Text(remainingMessages == -1 ? "Unlimited" : "\(remainingMessages)")
                                                    .font(.subheadline)
                                                    .foregroundColor(remainingMessages <= 5 ? .grumpAccent : .grumpTextPrimary)
                                            }
                                        }
                                    )
                                }
                            }
                        }
                        
                        // Grump Settings Section
                        SettingsSection(title: "Grump Settings") {
                            SettingsRow(
                                title: "Grump's Mood",
                                trailing: {
                                    HStack(spacing: 8) {
                                        Circle()
                                            .fill(Color.grumpAccent)
                                            .frame(width: 12, height: 12)
                                        Text(grumpMood)
                                            .font(.subheadline)
                                            .foregroundColor(.grumpTextSecondary)
                                    }
                                }
                            )
                            
                            SettingsRow(
                                title: "Sarcasm Level",
                                trailing: {
                                    HStack(spacing: 8) {
                                        Circle()
                                            .fill(Color.grumpAccent)
                                            .frame(width: 12, height: 12)
                                        Text(sarcasmLevel)
                                            .font(.subheadline)
                                            .foregroundColor(.grumpTextSecondary)
                                    }
                                }
                            )
                        }
                        
                        // App Settings Section
                        SettingsSection(title: "App Settings") {
                            SettingsRow(
                                title: "Dark Mode",
                                trailing: {
                                    Toggle("", isOn: $darkModeEnabled)
                                        .tint(.grumpAccent)
                                }
                            )
                            
                            SettingsRow(
                                title: "Haptic Feedback",
                                trailing: {
                                    Toggle("", isOn: $hapticFeedbackEnabled)
                                        .tint(.grumpAccent)
                                }
                            )
                            
                            SettingsRow(
                                title: "Typing Sounds",
                                trailing: {
                                    Toggle("", isOn: $typingSoundsEnabled)
                                        .tint(.grumpAccent)
                                }
                            )
                        }
                        
                        // About Section
                        SettingsSection(title: "About") {
                            SettingsRow(
                                title: "Version",
                                trailing: {
                                    Text("1.0.0")
                                        .font(.subheadline)
                                        .foregroundColor(.grumpTextSecondary)
                                }
                            )
                            
                            SettingsRow(
                                title: "Developer",
                                trailing: {
                                    Text("Grump Industries")
                                        .font(.subheadline)
                                        .foregroundColor(.grumpTextSecondary)
                                }
                            )
                        }
                    }
                    .padding(.vertical, 8)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.large)
            .sheet(isPresented: $showSubscriptionView) {
                SubscriptionView()
            }
        }
        .onAppear {
            Task {
                await storeKit.updateSubscriptionStatus()
                updateRemainingMessages()
            }
        }
        .onChange(of: storeKit.subscriptionStatus) { _, _ in
            updateRemainingMessages()
        }
    
    private func updateRemainingMessages() {
        let messagesPerMonth = storeKit.getMessagesPerMonth()
        let monthKey = getCurrentMonthKey()
        let usedKey = "messagesUsed_\(monthKey)"
        let used = UserDefaults.standard.integer(forKey: usedKey)
        
        if messagesPerMonth == 0 {
            remainingMessages = -1 // Unlimited
        } else {
            remainingMessages = max(0, messagesPerMonth - used)
        }
    }
    
    private func getCurrentMonthKey() -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM"
        return formatter.string(from: Date())
    }
    }
}

struct SettingsSection<Content: View>: View {
    let title: String
    @ViewBuilder let content: Content
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text(title)
                .font(.headline)
                .foregroundColor(.grumpAccent)
                .padding(.horizontal, 20)
                .padding(.vertical, 15)
            
            VStack(spacing: 0) {
                content
            }
            .background(Color.grumpSurface)
        }
        .padding(.bottom, 30)
    }
}

struct SettingsRow<Trailing: View>: View {
    let title: String
    @ViewBuilder let trailing: Trailing
    
    var body: some View {
        HStack {
            Text(title)
                .font(.body)
                .foregroundColor(.grumpTextPrimary)
            
            Spacer()
            
            trailing
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 15)
        .background(Color.grumpSurface)
        
        Divider()
            .background(Color.grumpBorder)
            .padding(.leading, 20)
    }
}

