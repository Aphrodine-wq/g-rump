# EAS Build Guide for Grump

Complete guide for building the Grump mobile app with EAS Build.

---

## 📋 Prerequisites

1. **EAS CLI installed globally:**
   ```bash
   npm install -g eas-cli
   ```

2. **Expo account:**
   - Create account at https://expo.dev
   - Login: `eas login`

3. **Apple Developer Account** (for iOS builds):
   - Required for iOS device builds
   - Free for iOS Simulator builds

4. **Google Play Console Account** (for Android builds):
   - Required for Android builds
   - Free for development builds

---

## 🔧 Initial Setup

### 1. Navigate to mobile directory
```bash
cd mobile
```

### 2. Verify EAS configuration
```bash
eas build:configure
```

This will create/update `eas.json` if needed.

### 3. Check your project ID
Your project ID is in `app.config.js`:
```javascript
extra: {
  eas: {
    projectId: 'fe938db1-c61c-4e4d-91f0-febccb90831d',
  },
},
```

---

## 📱 Build Profiles

Your `eas.json` includes these build profiles:

### **development** - Development builds
- Fast iteration
- Can install on device without App Store
- Includes debugging tools

### **preview** - Preview builds
- For testing before release
- Distribute via TestFlight (iOS) or direct download (Android)

### **production** - Production builds
- For App Store/Play Store submission
- Optimized and signed for release

---

## 🚀 Building for iOS

### iOS Simulator (Fastest, No Apple Account Needed)

```bash
eas build --platform ios --profile ios-simulator
```

**Requirements:**
- ✅ No Apple Developer account needed
- ✅ Can test immediately on simulator
- ✅ Fastest build option

**After build completes:**
```bash
# Download and run on simulator
eas build:run -p ios
```

### iOS Device (Requires Apple Developer Account)

```bash
# Development build
eas build --platform ios --profile development

# Preview build (for TestFlight)
eas build --platform ios --profile preview

# Production build (for App Store)
eas build --platform ios --profile production
```

**Requirements:**
- ✅ Apple Developer account ($99/year)
- ✅ Bundle identifier configured
- ✅ Signing credentials (EAS handles this automatically)

**First-time setup:**
1. Run the build command
2. EAS will prompt for Apple credentials
3. EAS creates signing certificates automatically

---

## 🤖 Building for Android

### Android Development Build

```bash
eas build --platform android --profile development
```

### Android Preview Build

```bash
eas build --platform android --profile preview
```

### Android Production Build

```bash
eas build --platform android --profile production
```

**Requirements:**
- ✅ Google Play Console account (free)
- ✅ Package name configured: `com.grump.app`
- ✅ Keystore (EAS handles this automatically)

---

## 📦 Build Options

### Build for specific platform
```bash
eas build --platform ios
eas build --platform android
eas build --platform all  # Both platforms
```

### Local builds (faster, requires Mac for iOS)
```bash
eas build --platform ios --local
eas build --platform android --local
```

### Build with specific profile
```bash
eas build --platform ios --profile preview
```

### Build specific variant
```bash
eas build --platform android --profile production --variant release
```

---

## 🔍 Checking Build Status

### List all builds
```bash
eas build:list
```

### View build details
```bash
eas build:view [BUILD_ID]
```

### Check build logs
After starting a build, you'll get a URL to monitor progress:
```
https://expo.dev/accounts/[your-account]/projects/grump/builds/[build-id]
```

---

## 📥 Downloading Builds

### Download completed build
```bash
eas build:download [BUILD_ID]
```

### Download latest build
```bash
eas build:download --latest --platform ios
eas build:download --latest --platform android
```

---

## 🧪 Testing Builds

### iOS Simulator
```bash
# Build and run on simulator
eas build:run -p ios
```

### iOS Device
1. Download the `.ipa` file from EAS dashboard
2. Install via TestFlight (preview/production builds)
3. Or install directly via device link (development builds)

### Android Device
1. Download the `.apk` or `.aab` file
2. Enable "Install from unknown sources" on device
3. Install the APK directly

---

## 🔐 Credentials Management

EAS automatically manages credentials, but you can check them:

### View credentials
```bash
eas credentials
```

### iOS credentials
```bash
eas credentials -p ios
```

### Android credentials
```bash
eas credentials -p android
```

### Reset credentials (if needed)
```bash
eas credentials -p ios --clear-all
```

---

## ⚙️ Configuration Files

### `eas.json`
Controls build profiles, channels, and build settings.

### `app.config.js`
Contains app metadata, bundle IDs, and EAS project ID.

### Environment Variables
Add to `eas.json` under build profiles:
```json
{
  "development": {
    "env": {
      "API_URL": "http://localhost:3000"
    }
  },
  "production": {
    "env": {
      "API_URL": "https://api.grump.app"
    }
  }
}
```

---

## 🐛 Troubleshooting

### Build fails with signing error
```bash
# Clear credentials and let EAS regenerate
eas credentials -p ios --clear-all
eas build --platform ios
```

### Build is stuck
- Check build logs on Expo dashboard
- Cancel and restart: `eas build:cancel [BUILD_ID]`

### Need to update bundle identifier
1. Update `app.config.js`:
   ```javascript
   ios: {
     bundleIdentifier: 'com.yourname.grump',
   },
   ```
2. Run: `eas build:configure`

### Out of build queue
- Free tier: Limited concurrent builds
- Check your quota: `eas account:view`

---

## 💰 EAS Build Pricing

### Free Tier
- ✅ Unlimited builds
- ⚠️ Queue wait times
- ⚠️ Limited build minutes per month

### Paid Plans
- Faster builds
- Priority queue
- More build minutes
- See: https://expo.dev/pricing

---

## 📝 Pre-Build Checklist

Before building for production:

- [ ] Update version in `app.config.js`
- [ ] Update build number
- [ ] Test on device/simulator
- [ ] Verify API endpoints (production URLs)
- [ ] Check app icons and splash screens exist
- [ ] Review app permissions in `app.config.js`
- [ ] Verify bundle identifier/package name
- [ ] Check App Store/Play Store requirements

---

## 🚢 Release Workflow

### 1. Development Build
```bash
eas build --platform ios --profile development
```
- Test new features
- Share with internal team

### 2. Preview Build
```bash
eas build --platform ios --profile preview
```
- Upload to TestFlight (iOS)
- Share APK (Android)
- Beta testing

### 3. Production Build
```bash
eas build --platform ios --profile production
```
- Submit to App Store/Play Store
- Final release

---

## 🔗 Quick Commands Reference

```bash
# Login
eas login

# Configure
eas build:configure

# Build iOS Simulator
eas build --platform ios --profile ios-simulator

# Build iOS Device (Development)
eas build --platform ios --profile development

# Build iOS Device (Production)
eas build --platform ios --profile production

# Build Android
eas build --platform android --profile production

# List builds
eas build:list

# View build
eas build:view [BUILD_ID]

# Download build
eas build:download --latest --platform ios

# Run on simulator
eas build:run -p ios

# Check credentials
eas credentials -p ios

# View account
eas account:view
```

---

## 📚 Additional Resources

- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS CLI Reference](https://docs.expo.dev/eas/)
- [Expo Dashboard](https://expo.dev)
- [iOS Build Requirements](https://docs.expo.dev/build/building-on-ci/)
- [Android Build Requirements](https://docs.expo.dev/build/building-on-ci/)

---

**"Fine. You can build it now. Happy?"** — Grump

