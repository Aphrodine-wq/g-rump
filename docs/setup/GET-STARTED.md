# 🎭 Grump Platform - Get Started NOW

## ✅ Everything is Already Installed!

I've already:
- ✅ Installed all backend dependencies
- ✅ Installed all web dependencies  
- ✅ Created setup scripts
- ✅ Created start scripts

## 🚀 Run It Right Now

### Step 1: Add Your API Key

Edit `backend/.env` and add your API key:

**Option A: Anthropic Claude**
```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here
```

**Option B: Groq (recommended - faster & cheaper)**
```
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.1-70b-versatile
```

See [`backend/GROQ-SETUP.md`](backend/GROQ-SETUP.md) for Groq setup details.

### Step 2: Start Everything

**Option A: One Command (Windows)**
```powershell
.\start-all.ps1
```

**Option B: Manual (2 terminals)**

Terminal 1:
```bash
cd backend
npm start
```

Terminal 2:
```bash
cd web
npm run dev
```

### Step 3: Open Browser

Go to: **http://localhost:5173**

## 🎉 That's It!

You're chatting with Grump!

## 📱 iOS App

Open `ios/Grump.xcodeproj` in Xcode and run. It connects to the same backend!

## 🐛 Issues?

- **Backend won't start?** Check `backend/.env` has your API key
- **Web won't connect?** Make sure backend is running on port 3000
- **Port already in use?** Stop other services or change ports in config

## 📚 More Info

- See `INSTALL.md` for detailed setup
- See `README.md` for full documentation
- See `web/QUICKSTART.md` for web-specific help

---

**"Fine. I'm here. What do you want."** — Grump

