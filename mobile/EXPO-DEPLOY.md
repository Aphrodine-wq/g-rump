# Deploying Grump to Expo

## Development (Current)

You're running in development mode. The app is accessible via:
- **Expo Go app** (scan QR code)
- **iOS Simulator** (press `i`)
- **Android Emulator** (press `a`)
- **Web Browser** (press `w`)

## Production Deployment

### Option 1: EAS Build (Recommended)

Build native apps for App Store/Play Store:

```bash
# Configure EAS (first time)
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

### Option 2: Expo Development Build

Create a development build you can install directly:

```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

### Option 3: Expo Updates (OTA)

Push updates without rebuilding:

```bash
# Publish update
eas update --branch production --message "Update message"

# Or use Expo CLI
npx expo publish
```

## Configuration

### Update API URL for Production

Edit `mobile/store/ChatStore.tsx`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://your-production-api.com';  // Production
```

### Environment Variables

Create `mobile/.env`:

```
EXPO_PUBLIC_API_URL=https://your-production-api.com
```

Then use in code:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
```

## App Store Submission

After building with EAS:

1. **iOS:**
   ```bash
   eas submit --platform ios
   ```

2. **Android:**
   ```bash
   eas submit --platform android
   ```

## Current Status

✅ Development server running
✅ Ready for Expo Go testing
✅ EAS project configured (ID: fe938db1-c61c-4e4d-91f0-febccb90831d)

---

**"Fine. I'm deployed. Test me."** — Grump

