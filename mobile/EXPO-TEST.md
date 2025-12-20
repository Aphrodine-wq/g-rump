# Testing Grump on Expo

## Quick Start

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Start Expo:**
   ```bash
   npm start
   ```

3. **Test on your device:**
   - Install "Expo Go" app on your phone
   - Scan the QR code from terminal
   - App loads instantly!

## Backend Connection

**IMPORTANT:** For physical devices, you need to update the API URL.

1. Find your computer's local IP:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig`

2. Update `mobile/store/ChatStore.tsx`:
   ```typescript
   const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000';
   // Example: 'http://192.168.1.100:3000'
   ```

3. Make sure:
   - Backend is running (`cd backend && npm start`)
   - Phone and computer are on same WiFi
   - Firewall allows port 3000

## Features Ready

- ✅ Pissed-off face (matching BUDDY.md design)
- ✅ Dark theme (optimized for dark backgrounds)
- ✅ Chat interface
- ✅ Backend API integration
- ✅ Onboarding flow
- ✅ Smooth animations

## Troubleshooting

**"Network request failed"**
- Check your local IP address
- Ensure backend is running
- Verify same WiFi network

**"Cannot find module"**
- Run `npm install` in `mobile/` directory
- Clear cache: `npx expo start --clear`

**"Expo Go can't connect"**
- Make sure you're in `mobile/` directory
- Try `npx expo start --tunnel` for better connectivity

---

**"Fine. I'm ready. Test me."** — Grump

