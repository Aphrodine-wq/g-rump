# StoreKit Setup Guide for Grump

## Overview

This guide will help you set up In-App Purchases for Grump using StoreKit 2.

## Prerequisites

- ✅ StoreKit service implemented (`ios/Grump/Services/StoreKitService.swift`)
- ✅ Subscription view implemented (`ios/Grump/Views/SubscriptionView.swift`)
- ✅ Integrated into Settings view
- ⚠️ **Need to configure products in App Store Connect**

---

## Step 1: Update Product IDs

**IMPORTANT:** You must update the product IDs in `StoreKitService.swift` to match your actual bundle identifier.

1. Open `ios/Grump/Services/StoreKitService.swift`
2. Find the `productIds` array (around line 35)
3. Replace `com.yourname.grump` with your actual bundle identifier

**Example:**
If your bundle ID is `com.walt.grump`, change:
```swift
private let productIds = [
    "com.walt.grump.basic.monthly",
    "com.walt.grump.pro.monthly",
    "com.walt.grump.premium.monthly"
]
```

---

## Step 2: Create Products in App Store Connect

1. **Log in to App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Select your app (or create it first)

2. **Navigate to In-App Purchases**
   - Go to your app → Features → In-App Purchases
   - Click the "+" button to add a new subscription

3. **Create Subscription Group**
   - Create a new subscription group (e.g., "Grump Subscriptions")
   - This groups all your subscription tiers together

4. **Create Each Subscription Product**

   For each tier, create a subscription:

   ### Basic Subscription ($9.99/month)
   - **Type:** Auto-Renewable Subscription
   - **Product ID:** `com.yourname.grump.basic.monthly` (match what you put in code)
   - **Reference Name:** Grump Basic
   - **Subscription Duration:** 1 Month
   - **Price:** $9.99 (or equivalent in other currencies)
   - **Localization:**
     - Name: "Basic Plan"
     - Description: "100 messages per month with full Grump personality"

   ### Pro Subscription ($19.99/month)
   - **Type:** Auto-Renewable Subscription
   - **Product ID:** `com.yourname.grump.pro.monthly`
   - **Reference Name:** Grump Pro
   - **Subscription Duration:** 1 Month
   - **Price:** $19.99
   - **Localization:**
     - Name: "Pro Plan"
     - Description: "300 messages per month with priority support"

   ### Premium Subscription ($39.99/month)
   - **Type:** Auto-Renewable Subscription
   - **Product ID:** `com.yourname.grump.premium.monthly`
   - **Reference Name:** Grump Premium
   - **Subscription Duration:** 1 Month
   - **Price:** $39.99
   - **Localization:**
     - Name: "Premium Plan"
     - Description: "1,000 messages per month with all features"

5. **Set Subscription Levels**
   - Arrange tiers in order: Premium > Pro > Basic
   - Premium should be the highest level

---

## Step 3: Testing with Sandbox

### Create Sandbox Test Account

1. Go to App Store Connect → Users and Access → Sandbox Testers
2. Click "+" to add a new sandbox tester
3. Fill in test account details (use a fake email)
4. Save the account

### Test on Device

1. **Sign out of your real Apple ID** on your test device
2. When the purchase dialog appears, choose "Use Existing Sandbox Account"
3. Sign in with your sandbox test account
4. Complete the purchase (it won't charge real money)

### Testing Checklist

- [ ] Products load correctly
- [ ] Purchase flow works
- [ ] Subscription status updates after purchase
- [ ] "Restore Purchases" works
- [ ] Subscription expiration is handled
- [ ] Current plan displays correctly

---

## Step 4: Handle Subscription Status in App

The `StoreKitService` automatically:
- ✅ Loads available products
- ✅ Handles purchases
- ✅ Tracks subscription status
- ✅ Handles restore purchases
- ✅ Updates subscription status automatically

### Using Subscription Status in Your App

```swift
// Get current subscription tier
let storeKit = StoreKitService.shared
let tierId = storeKit.getCurrentTierId() // "free", "basic", "pro", or "premium"

// Get message limit
let messagesPerMonth = storeKit.getMessagesPerMonth()

// Check subscription status
if storeKit.subscriptionStatus == .pro {
    // User has Pro subscription
}
```

---

## Step 5: Verify App Store Connect Configuration

Before submitting, verify:

- [ ] All product IDs match between code and App Store Connect
- [ ] Subscription group is created
- [ ] All subscriptions are in the same group
- [ ] Prices are set correctly
- [ ] Localizations are filled out
- [ ] Subscription status is "Ready to Submit"

---

## Important Notes

### Product ID Format
Product IDs must:
- Start with your bundle identifier
- Be unique across all apps
- Use lowercase letters, numbers, dots, and hyphens
- Match exactly between code and App Store Connect

### Subscription Management
Users can manage subscriptions through:
- Settings → App Store → Subscriptions (iOS)
- Your app's Settings → Subscription section

### Revenue Sharing
- Apple takes 30% of subscription revenue (first year)
- Apple takes 15% after the first year
- Adjust your pricing accordingly

### Free Tier
The free tier (25 messages/month) doesn't need a product ID - it's handled in code.

---

## Troubleshooting

### Products Not Loading
- ✅ Check product IDs match exactly
- ✅ Verify products are created in App Store Connect
- ✅ Ensure products are in "Ready to Submit" status
- ✅ Check you're using sandbox account for testing

### Purchase Not Completing
- ✅ Verify you're using a sandbox test account
- ✅ Check network connection
- ✅ Review console logs for errors

### Subscription Status Not Updating
- ✅ Call `updateSubscriptionStatus()` after purchase
- ✅ Check transaction verification is working
- ✅ Verify subscription is active in App Store Connect

---

## Next Steps

1. **Update Product IDs** in `StoreKitService.swift`
2. **Create products** in App Store Connect
3. **Test with sandbox** accounts
4. **Verify** subscription management works
5. **Submit** to App Store for review

---

## Resources

- [StoreKit 2 Documentation](https://developer.apple.com/documentation/storekit)
- [In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Subscription Best Practices](https://developer.apple.com/app-store/subscriptions/)

---

**Last Updated:** After StoreKit implementation  
**Status:** Ready for App Store Connect configuration
