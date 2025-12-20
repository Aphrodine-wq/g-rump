import SwiftUI
import StoreKit

struct SubscriptionView: View {
    @StateObject private var storeKit = StoreKitService.shared
    @Environment(\.dismiss) private var dismiss
    @State private var selectedProduct: Product?
    @State private var showPurchaseError = false
    @State private var purchaseErrorMessage = ""
    @State private var isPurchasing = false
    @State private var isRestoring = false
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 8) {
                        Text("Choose Your Plan")
                            .font(.system(size: 32, weight: .regular, design: .serif))
                            .padding(.top)
                        
                        Text("Pick the perfect plan for how much you want to chat with Grump")
                            .font(.system(size: 16, weight: .light))
                            .foregroundColor(.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    .padding(.bottom, 8)
                    
                    // Current Plan Badge
                    if storeKit.subscriptionStatus != .none && storeKit.subscriptionStatus != .free {
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("Current Plan: \(storeKit.subscriptionStatus.tierId.capitalized)")
                                .font(.system(size: 14, weight: .medium))
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .background(Color.green.opacity(0.1))
                        .cornerRadius(8)
                    }
                    
                    // Pricing Cards
                    if storeKit.isLoading && storeKit.products.isEmpty {
                        ProgressView()
                            .padding()
                    } else {
                        VStack(spacing: 16) {
                            // Free Tier (Always available)
                            SubscriptionCard(
                                tierName: "Free",
                                price: "$0",
                                    messagesPerMonth: 20,
                                features: [
                                    "20 messages per month",
                                    "Basic Grump personality",
                                    "Standard response time",
                                    "Chat history",
                                    "Basic features"
                                ],
                                isCurrent: storeKit.subscriptionStatus == .free || storeKit.subscriptionStatus == .none,
                                isPopular: false
                            ) {
                                // Free tier - no action needed
                            }
                            
                            // Paid Tiers
                            ForEach(storeKit.products, id: \.id) { product in
                                SubscriptionCard(
                                    tierName: getTierName(for: product.id),
                                    price: product.displayPrice,
                                    messagesPerMonth: getMessagesForTier(product.id),
                                    features: getFeaturesForTier(product.id),
                                    isCurrent: isCurrentTier(product.id),
                                    isPopular: product.id.contains("pro")
                                ) {
                                    selectedProduct = product
                                    isPurchasing = true
                                    await purchaseProduct(product)
                                    isPurchasing = false
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // Restore Purchases
                    Button(action: {
                        Task {
                            await storeKit.restorePurchases()
                        }
                    }) {
                        Text("Restore Purchases")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.blue)
                    }
                    .padding(.top, 8)
                    .padding(.bottom, 32)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") {
                        dismiss()
                    }
                }
            }
            .alert("Purchase Error", isPresented: $showPurchaseError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(purchaseErrorMessage)
            }
        }
    }
    
    // MARK: - Purchase
    
    @MainActor
    private func purchaseProduct(_ product: Product) async {
        isPurchasing = true
        let impactFeedback = UIImpactFeedbackGenerator(style: .medium)
        impactFeedback.impactOccurred()
        
        do {
            _ = try await storeKit.purchase(product)
            // Success - subscription status will update automatically
            await updateSubscriptionStatus()
            // Success haptic feedback
            let notificationFeedback = UINotificationFeedbackGenerator()
            notificationFeedback.notificationOccurred(.success)
            dismiss()
        } catch StoreKitError.userCancelled {
            // User cancelled - no action needed
        } catch {
            purchaseErrorMessage = error.localizedDescription
            showPurchaseError = true
            // Error haptic feedback
            let notificationFeedback = UINotificationFeedbackGenerator()
            notificationFeedback.notificationOccurred(.error)
        }
        
        isPurchasing = false
    }
    
    // MARK: - Helpers
    
    private func getTierName(for productId: String) -> String {
        if productId.contains("premium") { return "Premium" }
        if productId.contains("pro") { return "Pro" }
        if productId.contains("basic") { return "Basic" }
        return "Plan"
    }
    
    private func getMessagesForTier(_ productId: String) -> Int {
        if productId.contains("premium") { return 1000 }
        if productId.contains("pro") { return 300 }
        if productId.contains("basic") { return 100 }
        return 25
    }
    
    private func getFeaturesForTier(_ productId: String) -> [String] {
        if productId.contains("premium") {
            return [
                "1,000 messages per month",
                "Full Grump personality",
                "Full knowledge base access",
                "Fastest response time",
                "Unlimited chat history",
                "All advanced features",
                "Priority support",
                "Early access to new features"
            ]
        } else if productId.contains("pro") {
            return [
                "300 messages per month",
                "Full Grump personality",
                "Full knowledge base access",
                "Priority response time",
                "Unlimited chat history",
                "Advanced features",
                "Priority support"
            ]
        } else if productId.contains("basic") {
            return [
                "100 messages per month",
                "Full Grump personality",
                "Full knowledge base access",
                "Priority response time",
                "Unlimited chat history",
                "All features"
            ]
        }
        return []
    }
    
    private func isCurrentTier(_ productId: String) -> Bool {
        let currentTier = storeKit.subscriptionStatus.tierId
        if productId.contains("premium") { return currentTier == "premium" }
        if productId.contains("pro") { return currentTier == "pro" }
        if productId.contains("basic") { return currentTier == "basic" }
        return false
    }
}

// MARK: - Subscription Card

struct SubscriptionCard: View {
    let tierName: String
    let price: String
    let messagesPerMonth: Int
    let features: [String]
    let isCurrent: Bool
    let isPopular: Bool
    let action: () async -> Void
    
    @State private var isProcessing = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(tierName)
                        .font(.system(size: 24, weight: .regular, design: .serif))
                    
                    if isPopular {
                        Text("Most Popular")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.blue)
                            .cornerRadius(4)
                    }
                }
                
                Spacer()
                
                VStack(alignment: .trailing) {
                    Text(price)
                        .font(.system(size: 32, weight: .regular, design: .serif))
                    
                    if price != "$0" {
                        Text("/month")
                            .font(.system(size: 12, weight: .light))
                            .foregroundColor(.secondary)
                    }
                }
            }
            
            // Messages
            HStack {
                Text("\(messagesPerMonth)")
                    .font(.system(size: 28, weight: .regular, design: .serif))
                Text("messages/month")
                    .font(.system(size: 14, weight: .light))
                    .foregroundColor(.secondary)
            }
            .padding()
            .frame(maxWidth: .infinity)
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
            
            // Features
            VStack(alignment: .leading, spacing: 12) {
                ForEach(features, id: \.self) { feature in
                    HStack(alignment: .top, spacing: 12) {
                        Image(systemName: "checkmark")
                            .foregroundColor(.green)
                            .font(.system(size: 14, weight: .semibold))
                            .padding(.top, 2)
                        Text(feature)
                            .font(.system(size: 14))
                            .foregroundColor(.primary)
                    }
                }
            }
            
            // Button
            Button(action: {
                Task {
                    isProcessing = true
                    await action()
                    isProcessing = false
                }
            }) {
                HStack {
                    if isProcessing {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Text(isCurrent ? "Current Plan" : (price == "$0" ? "Get Started" : "Subscribe"))
                            .font(.system(size: 16, weight: .semibold))
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(isCurrent ? Color.gray.opacity(0.2) : Color.primary)
                .foregroundColor(isCurrent ? .primary : .white)
                .cornerRadius(12)
            }
            .disabled(isCurrent || isProcessing)
        }
        .padding(24)
        .background(Color(.systemBackground))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(isCurrent ? Color.blue : Color.gray.opacity(0.2), lineWidth: isCurrent ? 2 : 1)
        )
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 2)
    }
}

// MARK: - Preview

#Preview {
    SubscriptionView()
}
