# Expo Go Setup Guide

## Quick Start

1. **Install Expo Go on your iPhone:**
   - Open App Store
   - Search for "Expo Go"
   - Install the app

2. **Start Expo Dev Server:**
   ```bash
   cd mobile
   npx expo start
   ```

3. **Connect Your iPhone:**
   - Make sure your iPhone and computer are on the **same WiFi network**
   - Open Expo Go app on your iPhone
   - Scan the QR code from the terminal
   - Or tap "Enter URL manually" and enter the URL shown in terminal

4. **Update Backend API URL (IMPORTANT):**
   
   Your iPhone needs to connect to your computer's backend. Update the API URL:
   
   a. Find your computer's local IP address:
      - Windows: Open Command Prompt and run `ipconfig`
      - Look for "IPv4 Address" (e.g., `192.168.1.100`)
   
   b. Update `mobile/store/ChatStore.tsx`:
      ```typescript
      const API_BASE_URL = __DEV__ 
        ? 'http://YOUR_LOCAL_IP:3000'  // e.g., 'http://192.168.1.100:3000'
        : 'https://your-production-api.com';
      ```
   
   c. Make sure backend is running:
      ```bash
      cd backend
      npm start
      ```

5. **Test the Connection:**
   - Open Grump in Expo Go
   - Send a test message
   - If you see "Network request failed", check:
     - Backend is running
     - IP address is correct
     - Both devices on same WiFi
     - Firewall allows port 3000

## Troubleshooting

### "Network request failed"
- ✅ Check backend is running: `cd backend && npm start`
- ✅ Verify IP address in `ChatStore.tsx`
- ✅ Ensure same WiFi network
- ✅ Try restarting Expo: `npx expo start --clear`

### "Cannot connect to Expo"
- ✅ Check both devices on same WiFi
- ✅ Try using tunnel mode: `npx expo start --tunnel`
- ✅ Manually enter URL in Expo Go app

### QR Code not scanning
- ✅ Increase terminal font size
- ✅ Use "Enter URL manually" in Expo Go
- ✅ Check terminal for the connection URL

## Current Setup

- **Expo Project ID:** `fe938db1-c61c-4e4d-91f0-febccb90831d`
- **Backend Port:** `3000`
- **Expo Dev Server Port:** `8081` (or `8082` if in use)

---

**"Fine. I'm ready. Just connect your phone already."** — Grump

