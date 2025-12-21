import Foundation
import StoreKit
import Combine

@MainActor
class StoreKitService: ObservableObject {
    static let shared = StoreKitService()
    
    @Published var products: [Product] = []
    @Published var purchasedSubscriptions: [Product] = []
    @Published var subscriptionStatus: SubscriptionStatus = .none
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    enum SubscriptionStatus {
        case none
        case free
        case basic
        case pro
        case premium
        
        var tierId: String {
            switch self {
            case .none, .free: return "free"
            case .basic: return "basic"
            case .pro: return "pro"
            case .premium: return "premium"
            }
        }
    }
    
    // Product IDs - MUST match what you configure in App Store Connect
    // IMPORTANT: Replace "yourname" with your actual bundle identifier prefix before submitting to App Store
    // 
    // Steps to configure:
    // 1. In Xcode, check your Bundle Identifier (e.g., com.walt.grump)
    // 2. In App Store Connect, create subscription products with matching IDs
    // 3. Update these productIds to match your Bundle Identifier prefix
    // 
    // Example: If your bundle ID is com.walt.grump, use:
    // "com.walt.grump.basic.monthly"
    // "com.walt.grump.pro.monthly"
    // "com.walt.grump.premium.monthly"
    private let productIds = [
        "com.yourname.grump.basic.monthly",      // Basic subscription - $9.99/month
        "com.yourname.grump.pro.monthly",        // Pro subscription - $19.99/month
        "com.yourname.grump.premium.monthly"     // Premium subscription - $39.99/month
    ]
    
    private var updateListenerTask: Task<Void, Error>?
    
    private init() {
        // Start listening for transaction updates
        updateListenerTask = listenForTransactions()
        Task {
            await loadProducts()
            await updateSubscriptionStatus()
        }
    }
    
    deinit {
        updateListenerTask?.cancel()
    }
    
    // MARK: - Product Loading
    
    func loadProducts() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let storeProducts = try await Product.products(for: productIds)
            products = storeProducts.sorted { $0.displayPrice < $1.displayPrice }
            isLoading = false
        } catch {
            errorMessage = "Failed to load products: \(error.localizedDescription)"
            isLoading = false
            print("Failed to load products: \(error)")
        }
    }
    
    // MARK: - Purchase
    
    func purchase(_ product: Product) async throws -> Transaction? {
        let result = try await product.purchase()
        
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await transaction.finish()
            await updateSubscriptionStatus()
            return transaction
            
        case .userCancelled:
            throw StoreKitError.userCancelled
            
        case .pending:
            throw StoreKitError.pending
            
        @unknown default:
            throw StoreKitError.unknown
        }
    }
    
    // MARK: - Restore Purchases
    
    func restorePurchases() async {
        isLoading = true
        errorMessage = nil
        
        do {
            try await AppStore.sync()
            await updateSubscriptionStatus()
            isLoading = false
        } catch {
            errorMessage = "Failed to restore purchases: \(error.localizedDescription)"
            isLoading = false
            print("Failed to restore purchases: \(error)")
        }
    }
    
    // MARK: - Subscription Status
    
    func updateSubscriptionStatus() async {
        var statuses: [Product.SubscriptionInfo.Status] = []
        
        // Check all subscription products
        for productId in productIds {
            guard let product = products.first(where: { $0.id == productId }),
                  let subscription = product.subscription else {
                continue
            }
            
            // Get subscription status
            do {
                let statusesForProduct = try await subscription.status
                statuses.append(contentsOf: statusesForProduct)
            } catch {
                print("Failed to get subscription status for \(productId): \(error)")
                continue
            }
        }
        
        // Find the highest active subscription
        var highestStatus: SubscriptionStatus = .free
        
        for status in statuses {
            switch status.state {
            case .subscribed, .inGracePeriod, .inBillingRetryPeriod:
                // Get product ID from status
                let transaction = status.transaction
                
                // Determine tier from product ID
                do {
                    let verifiedTransaction = try checkVerified(transaction)
                    let productId = verifiedTransaction.productID
                    
                    if productId.contains("premium") {
                        highestStatus = .premium
                    } else if productId.contains("pro") {
                        if highestStatus != .premium {
                            highestStatus = .pro
                        }
                    } else if productId.contains("basic") {
                        if highestStatus != .premium && highestStatus != .pro {
                            highestStatus = .basic
                        }
                    }
                } catch {
                    print("Failed to verify transaction: \(error)")
                    continue
                }
                
            case .expired, .revoked:
                continue
                
            @unknown default:
                continue
            }
        }
        
        subscriptionStatus = highestStatus
        
        // Save to UserDefaults for quick access
        UserDefaults.standard.set(highestStatus.tierId, forKey: "subscriptionTier")
    }
    
    // MARK: - Transaction Listener
    
    private func listenForTransactions() -> Task<Void, Error> {
        return Task.detached {
            for await result in Transaction.updates {
                do {
                    let transaction = try self.checkVerified(result)
                    await transaction.finish()
                    await self.updateSubscriptionStatus()
                } catch {
                    print("Transaction verification failed: \(error)")
                }
            }
        }
    }
    
    // MARK: - Helpers
    
    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw StoreKitError.failedVerification
        case .verified(let safe):
            return safe
        }
    }
    
    func getCurrentTierId() -> String {
        return subscriptionStatus.tierId
    }
    
    func getMessagesPerMonth() -> Int {
        switch subscriptionStatus {
        case .none, .free: return 20
        case .basic: return 100
        case .pro: return 300
        case .premium: return 1000
        }
    }
}

// MARK: - StoreKit Errors

enum StoreKitError: LocalizedError {
    case userCancelled
    case pending
    case failedVerification
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .userCancelled:
            return "Purchase was cancelled"
        case .pending:
            return "Purchase is pending approval"
        case .failedVerification:
            return "Failed to verify purchase"
        case .unknown:
            return "Unknown error occurred"
        }
    }
}
