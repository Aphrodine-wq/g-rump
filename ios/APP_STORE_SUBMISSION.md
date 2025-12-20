# App Store Submission Guide for Grump

## 🎉 Congratulations on Your Apple Developer Account!

You're ready to submit Grump to the App Store. Follow this guide to get everything configured.

## Prerequisites Checklist

- ✅ Apple Developer Account (You have this!)
- ✅ Xcode 15.0 or later
- ✅ macOS 13.0 or later
- ✅ iOS app codebase (Ready in `ios/Grump/`)

## Step 1: Create Xcode Project (If Not Already Created)

If you don't have an Xcode project yet:

1. Open Xcode
2. File → New → Project
3. Choose "iOS" → "App"
4. Product Name: `Grump`
5. Team: Select your Apple Developer account
6. Organization Identifier: `com.yourname` (e.g., `com.walt.grump`)
7. Bundle Identifier: `com.yourname.grump` (must be unique)
8. Interface: SwiftUI
9. Language: Swift
10. Storage: SwiftData
11. Click "Next" and save to `ios/` directory

## Step 2: Configure Bundle Identifier

1. In Xcode, select your project in the navigator
2. Select the "Grump" target
3. Go to "Signing & Capabilities" tab
4. Check "Automatically manage signing"
5. Select your Team (your Apple Developer account)
6. Bundle Identifier should be: `com.yourname.grump` (replace `yourname` with your identifier)

**Important:** The Bundle Identifier must be unique and match what you'll register in App Store Connect.

## Step 3: App Store Connect Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** Grump
   - **Primary Language:** English
   - **Bundle ID:** Select or create `com.yourname.grump`
   - **SKU:** `grump-001` (any unique identifier)
   - **User Access:** Full Access
4. Click "Create"

## Step 4: App Information

In App Store Connect, fill out:

### App Information
- **Name:** Grump
- **Subtitle:** The Crankiest AI Assistant (optional, 30 chars max)
- **Category:** 
  - Primary: Productivity
  - Secondary: Utilities
- **Content Rights:** You own all content
- **Age Rating:** 4+ (or appropriate for your content)

### Pricing and Availability
- **Price:** Free (or set your price)
- **Availability:** All countries (or select specific)

## Step 5: Prepare App Store Assets

You'll need to create:

1. **App Icon:** 1024x1024px PNG (no transparency)
   - Location: `ios/Grump/Assets.xcassets/AppIcon.appiconset/`
   - Required sizes: 1024x1024

2. **Screenshots** (Required for iPhone):
   - 6.7" Display (iPhone 14 Pro Max): 1290 x 2796 pixels
   - 6.5" Display (iPhone 11 Pro Max): 1242 x 2688 pixels
   - 5.5" Display (iPhone 8 Plus): 1242 x 2208 pixels
   - Minimum: 1 screenshot per device size
   - Recommended: 3-5 screenshots showing key features

3. **App Preview Video** (Optional but recommended):
   - 30 seconds max
   - Show Grump's personality and animations

4. **Description:**
   ```
   Meet Grump. The world's crankiest AI assistant.

   Grump isn't happy to be here, but he'll help you anyway. With 100+ animations, 
   context-aware responses, and a personality that's equal parts sarcastic and 
   surprisingly helpful, Grump is the AI assistant who actually has feelings.

   Features:
   • Full animation system with 16 emotional states
   • Context-aware responses that adapt to your mood
   • Daily gripes and personality quirks
   • Beautiful minimalist design
   • Dark mode support
   • Your stats: Track roasts, sarcasm, and patience levels

   Grump remembers. Grump judges. Grump helps. Reluctantly.
   ```

5. **Keywords:** (100 characters max)
   ```
   AI assistant,chatbot,grumpy,sarcastic,personality,animated,character
   ```

6. **Support URL:** Your website or support page
7. **Marketing URL:** (Optional) Your marketing site
8. **Privacy Policy URL:** Required if you collect any data

## Step 6: Build Configuration

### Update Info.plist

Ensure your `Info.plist` has:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>your-production-api.com</key>
        <dict>
            <key>NSExceptionRequiresForwardSecrecy</key>
            <false/>
            <key>NSIncludesSubdomains</key>
            <true/>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <false/>
            <key>NSExceptionMinimumTLSVersion</key>
            <string>TLSv1.2</string>
        </dict>
    </dict>
</dict>
```

### Update API Client for Production

In `ios/Grump/Services/APIClient.swift`:

```swift
#if DEBUG
private let baseURL = "http://localhost:3000"
#else
private let baseURL = "https://api.yourdomain.com" // Your production API
#endif
```

## Step 7: Build for App Store

1. In Xcode, select "Any iOS Device" or "Generic iOS Device"
2. Product → Archive
3. Wait for archive to complete
4. Window → Organizer (or Product → Archive again)
5. Select your archive
6. Click "Distribute App"
7. Choose "App Store Connect"
8. Follow the wizard:
   - Distribution: App Store Connect
   - Distribution options: Upload
   - App Thinning: All compatible device variants
   - Re-sign: Automatically manage signing
9. Click "Upload"
10. Wait for upload to complete (can take 10-30 minutes)

## Step 8: Submit for Review

1. Go back to App Store Connect
2. Your app should appear in "TestFlight" first (processing takes ~30 minutes)
3. Once processed, go to your app → "App Store" tab
4. Click "+ Version or Platform" → iOS
5. Fill in:
   - **Version:** 1.0.0
   - **What's New in This Version:** 
     ```
     Initial release of Grump - the world's crankiest AI assistant.
     
     Features:
     • Full animation system with 16 emotional states
     • Context-aware AI responses
     • Daily gripes and personality quirks
     • Beautiful minimalist design
     • Your stats tracking
     ```
6. Upload screenshots and app preview
7. Add description and keywords
8. Answer App Review questions:
   - **Contact Information:** Your email/phone
   - **Demo Account:** (If needed) Provide test credentials
   - **Notes:** Any special instructions for reviewers
9. Click "Add for Review"
10. Click "Submit for Review"

## Step 9: App Review Process

- **Initial Review:** 24-48 hours typically
- **Status Updates:** Check App Store Connect dashboard
- **If Rejected:** Address feedback and resubmit

## Common Issues & Solutions

### Issue: "Missing Compliance"
**Solution:** Add export compliance info in App Store Connect

### Issue: "Missing Privacy Policy"
**Solution:** Add privacy policy URL (required if app uses network)

### Issue: "App Crashes on Launch"
**Solution:** Test on physical device, check crash logs

### Issue: "API Not Available"
**Solution:** Ensure production API is accessible, add demo account if needed

## Required App Store Assets Checklist

- [ ] 1024x1024 App Icon (PNG, no transparency)
- [ ] Screenshots for required device sizes (minimum 1 per size)
- [ ] App description (up to 4000 characters)
- [ ] Keywords (up to 100 characters)
- [ ] Support URL
- [ ] Privacy Policy URL (if collecting data)
- [ ] Age rating information
- [ ] App preview video (optional but recommended)

## Testing Checklist

Before submitting:

- [ ] Test on physical iPhone device
- [ ] Test all animations work smoothly
- [ ] Test chat functionality
- [ ] Test onboarding flow
- [ ] Test settings and preferences
- [ ] Test dark mode
- [ ] Test with production API endpoint
- [ ] Test offline behavior (graceful degradation)
- [ ] Verify no crashes in crash logs
- [ ] Test on multiple iOS versions (16.0+)

## Version Information

- **Current Version:** 1.0.0
- **Build Number:** 1
- **Minimum iOS:** 16.0
- **Supported Devices:** iPhone (iPad support optional)

## Next Steps After Approval

1. **Marketing:**
   - Share on social media
   - Create demo videos
   - Reach out to tech blogs
   - Submit to Product Hunt

2. **Updates:**
   - Monitor crash reports
   - Gather user feedback
   - Plan feature updates
   - Regular updates improve App Store ranking

3. **Analytics:**
   - Set up App Store Connect analytics
   - Track downloads and retention
   - Monitor user reviews

## Support Resources

- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

---

**Good luck with your submission! Grump is ready to be grumpy on the App Store.** 🍎

