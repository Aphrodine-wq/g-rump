# Get Your Local IP Address

## For Physical Device Testing

When testing on a physical device with Expo Go, you need to use your computer's local IP address instead of `localhost`.

## Windows

1. Open PowerShell or Command Prompt
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
4. Example: `192.168.1.100`

## Mac/Linux

1. Open Terminal
2. Run: `ifconfig` or `ip addr`
3. Look for `inet` address (usually starts with `192.168.` or `10.`)
4. Example: `192.168.1.100`

## Update ChatStore.tsx

1. Open `mobile/store/ChatStore.tsx`
2. Find the line: `'http://192.168.1.XXX:3000'`
3. Replace `XXX` with your actual IP address
4. Example: `'http://192.168.1.100:3000'`

## Quick Test

After updating, make sure:
- ✅ Backend is running (`cd backend && npm start`)
- ✅ Phone and computer are on same WiFi network
- ✅ Firewall allows connections on port 3000

---

**"Fine. Figure out your IP. I'll wait."** — Grump

