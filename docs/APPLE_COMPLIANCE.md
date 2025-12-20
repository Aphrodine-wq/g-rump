# Apple Compliance Status for Grump

## Current Compliance Status

### ✅ Completed Items

1. **App Store Connect Setup**
   - Documentation exists (`ios/APP_STORE_SUBMISSION.md`)
   - Checklist exists (`ios/APP_STORE_CHECKLIST.md`)

2. **Code Configuration**
   - SwiftUI app structure
   - Info.plist exists
   - No deprecated APIs (to be verified)

3. **Basic Requirements**
   - Minimum iOS version: 16.0
   - App structure ready for submission

---

## ⚠️ Critical Missing Items

### 1. Privacy Policy (REQUIRED)
**Status:** ✅ TEMPLATE CREATED  
**Priority:** CRITICAL  
**Location:** `docs/PRIVACY_POLICY.md`  
**Required because:** Your app communicates with external APIs and may store user data

**Action Required:**
1. Create a Privacy Policy that covers:
   - Data collection (chat messages, conversation history)
   - Third-party services (Anthropic/Groq API)
   - Data storage (local storage on device)
   - Data usage (for AI responses)
   - User rights (data deletion, export)
   
2. Host the Privacy Policy at a public URL
3. Add the URL to App Store Connect

**Template sections needed:**
- What data we collect
- How we use data
- Third-party services (AI providers)
- Data storage (local only vs cloud)
- Your rights
- Contact information

---

### 2. In-App Purchase Compliance (NEW - CRITICAL)
**Status:** ✅ IMPLEMENTED - NEEDS APP STORE CONNECT CONFIG  
**Priority:** CRITICAL  
**Location:** 
- `ios/Grump/Services/StoreKitService.swift` (StoreKit service)
- `ios/Grump/Views/SubscriptionView.swift` (Subscription UI)
- `docs/STOREKIT_SETUP.md` (Setup guide)  
**Required because:** You just added subscription pricing to the web app

**Apple's Rule:** If you offer subscriptions or paid features, you MUST use Apple's In-App Purchase system for iOS apps. You cannot:
- Use your own payment processor
- Link to external payment pages
- Use web-based subscriptions that apply to iOS

**Action Required:**
1. **Implement StoreKit 2** for in-app purchases:
   ```swift
   import StoreKit
   ```
2. Set up subscription products in App Store Connect:
   - Free: 25 messages/month
   - Basic: $9.99/month (100 messages)
   - Pro: $19.99/month (300 messages)
   - Premium: $39.99/month (1000 messages)
3. Sync subscription status between web and iOS
4. Remove any links to external payment pages from iOS app

**Important:** Your web app can use Stripe/PayPal, but the iOS app MUST use Apple's In-App Purchase system.

---

### 3. Export Compliance
**Status:** ⚠️ NEEDS VERIFICATION  
**Priority:** HIGH  
**Required in:** App Store Connect

**Action Required:**
1. Answer export compliance questions in App Store Connect:
   - Does your app use encryption? (YES - HTTPS for API calls)
   - Standard encryption exemption applies (likely YES)
   - Complete the self-classification form

---

### 4. Privacy Usage Descriptions (Info.plist)
**Status:** ⚠️ NEEDS VERIFICATION  
**Priority:** HIGH  
**Required if:** App requests any permissions

**Check Info.plist for:**
- `NSCameraUsageDescription` (if using camera)
- `NSPhotoLibraryUsageDescription` (if accessing photos)
- `NSLocationWhenInUseUsageDescription` (if using location)
- `NSMicrophoneUsageDescription` (if using microphone)

**Current Status:** Unknown - needs verification

---

### 5. Terms of Service
**Status:** ❌ OPTIONAL BUT RECOMMENDED  
**Priority:** MEDIUM  

**Action Required:**
1. Create Terms of Service covering:
   - Service usage rules
   - Subscription terms
   - Refund policy
   - Limitation of liability
   - AI-generated content disclaimers
2. Host at a public URL
3. Link from app and App Store listing

---

### 6. Age Rating
**Status:** ⚠️ NEEDS CONFIRMATION  
**Priority:** HIGH  

**Recommendation:** 4+ or 12+ depending on content
- Check for any mature themes in AI responses
- Ensure content is appropriate for chosen rating

**Action Required:**
1. Complete age rating questionnaire in App Store Connect
2. Review AI responses for age-appropriateness

---

### 7. App Tracking Transparency (if applicable)
**Status:** ⚠️ NEEDS VERIFICATION  
**Priority:** MEDIUM  

**Required if:** You use any analytics or tracking frameworks

**Action Required:**
1. Check if you're using any analytics SDKs
2. If yes, implement App Tracking Transparency framework
3. Add `NSUserTrackingUsageDescription` to Info.plist

---

### 8. Subscription Management
**Status:** ❌ NOT IMPLEMENTED  
**Priority:** CRITICAL (for subscriptions)

**Apple Requirements:**
1. Users must be able to manage subscriptions from Settings → App Store → Subscriptions
2. App must show subscription status
3. App must handle subscription restoration
4. App must show pricing in local currency

**Action Required:**
1. Implement StoreKit subscription management
2. Add "Restore Purchases" option in Settings
3. Display subscription status clearly
4. Handle subscription expiration gracefully

---

## Compliance Checklist

### Pre-Submission Requirements

- [x] **Privacy Policy** template created ✅
- [ ] **Privacy Policy** customized and hosted (See PRIVACY_POLICY.md)
- [ ] **Privacy Policy URL** added to App Store Connect
- [ ] **Terms of Service** created (recommended)
- [ ] **Export Compliance** completed in App Store Connect
- [ ] **Age Rating** questionnaire completed
- [x] **In-App Purchase** system implemented (if using subscriptions) ✅
- [x] **StoreKit** integration for subscriptions ✅
- [ ] **Subscription products** created in App Store Connect (See STOREKIT_SETUP.md)
- [ ] **Privacy Usage Descriptions** added to Info.plist (if needed)
- [ ] **App Tracking Transparency** implemented (if using tracking)

### Code Requirements

- [ ] Info.plist properly configured
- [ ] No deprecated APIs
- [ ] No external payment links
- [ ] All API calls use HTTPS
- [ ] Proper error handling
- [ ] Graceful offline behavior

### Content Requirements

- [ ] All content age-appropriate
- [ ] No prohibited content
- [ ] AI responses moderated appropriately
- [ ] Clear user communication

---

## Immediate Action Items (Priority Order)

### 1. URGENT - In-App Purchase Implementation
Since you've added subscriptions, you MUST implement Apple's StoreKit before submission:
- Implement StoreKit 2
- Create subscription products in App Store Connect
- Sync with your backend (if needed)

### 2. URGENT - Privacy Policy
Required for App Store submission:
- Create privacy policy document
- Host at public URL
- Add to App Store Connect

### 3. HIGH - Export Compliance
Complete in App Store Connect during submission process

### 4. HIGH - Verify Info.plist
Check all privacy usage descriptions are present if needed

### 5. MEDIUM - Terms of Service
Recommended but not strictly required

---

## Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [StoreKit Documentation](https://developer.apple.com/documentation/storekit)
- [Privacy Guidelines](https://developer.apple.com/app-store/review/guidelines/#privacy)
- [In-App Purchase Guidelines](https://developer.apple.com/app-store/review/guidelines/#in-app-purchase)

---

## Next Steps

1. **Create Privacy Policy** (1-2 hours)
2. **Implement StoreKit for subscriptions** (4-8 hours)
3. **Set up subscription products in App Store Connect** (1 hour)
4. **Verify Info.plist privacy descriptions** (30 minutes)
5. **Complete export compliance in App Store Connect** (15 minutes)
6. **Create Terms of Service** (2-4 hours, optional but recommended)

---

**Last Updated:** After StoreKit and Privacy Policy implementation  
**Status:** Code implementation complete - needs App Store Connect configuration

---

## Summary

### ✅ Code Complete
- StoreKit implementation done
- Privacy policy template created
- Subscription UI implemented
- Settings integration complete

### ⚠️ Needs Configuration
- Product IDs must be updated in `StoreKitService.swift`
- Products must be created in App Store Connect
- Privacy policy must be customized and hosted

### 📝 Next Steps
1. Update product IDs in code
2. Create products in App Store Connect
3. Customize and host privacy policy
4. Test with sandbox accounts
5. Submit for review

See individual setup guides for detailed instructions.
