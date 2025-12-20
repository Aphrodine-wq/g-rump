# 🎭 START HERE - Grump Platform

## ✅ DONE: Everything is Installed!

- ✅ Backend dependencies installed
- ✅ Web dependencies installed  
- ✅ Config files created
- ✅ Setup scripts ready

## 🚀 3 Steps to Run:

### 1. Add API Key (30 seconds)

Open `backend/.env` and replace `your_api_key_here` with your actual Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. Start Backend

```powershell
cd backend
npm start
```

You should see: `Server running on port 3000`

### 3. Start Web Client

**New terminal:**
```powershell
cd web
npm run dev
```

You should see: `Local: http://localhost:5173`

## 🎉 Open Browser

Go to: **http://localhost:5173**

**You're chatting with Grump!**

---

## 🚀 Or Use the Auto-Start Script:

```powershell
.\start-all.ps1
```

This starts both backend and web automatically!

---

## 📱 iOS App

1. Open `ios/Grump.xcodeproj` in Xcode
2. Run on simulator or device
3. It connects to the same backend!

---

## 🆘 Quick Help

**"Cannot connect"**
→ Make sure backend is running (step 2)

**"Port 3000 in use"**
→ Stop other services or change PORT in `backend/.env`

**"API key error"**
→ Check `backend/.env` has your real API key

---

**"You're finally here. Great."** — Grump

