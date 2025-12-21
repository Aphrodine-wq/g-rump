# 🚀 START HERE - G-Rump Platform

Welcome to **G-Rump**! This guide will get you oriented and up to speed quickly.

## What is G-Rump?

**G-Rump** is a multi-platform AI assistant with a unique personality-driven interface and animation creation capabilities. It combines:

- **Animated AI Character** - Grump 2.0 with 800+ idle animations, emotional states, and autonomous chat
- **Chat Interface** - Natural language conversations with personality
- **Animation Creation** - Generate animations from natural language prompts
- **Game Development** - Code games in G-Rump language, compile to Phaser 3
- **Multi-Platform** - iOS, Web, and Mobile apps

## 🎯 Quick Navigation

### For New Users
1. **[GET-STARTED.md](GET-STARTED.md)** - Quick setup
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Understand the system
3. **[GRUMP-COMPLETE-MASTER-DOCUMENT.md](GRUMP-COMPLETE-MASTER-DOCUMENT.md)** - Everything in one place

### For Developers
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & rebuild guide
2. **[IMPROVEMENTS.md](IMPROVEMENTS.md)** - Planned improvements
3. **[grump-compiler/README.md](grump-compiler/README.md)** - Compiler documentation

### For Business/Product
1. **[PROFITABLE-MODEL.md](PROFITABLE-MODEL.md)** - Revenue model & pricing
2. **[PRODUCT-VISION.md](PRODUCT-VISION.md)** - Product vision
3. **[GRUMP-COMPLETE-MASTER-DOCUMENT.md](GRUMP-COMPLETE-MASTER-DOCUMENT.md)** - Complete overview

### For Deployment
1. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide
2. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Deployment checklist

## 🏗️ Project Structure

```
g-rump/
├── web/              # React web app (Vite + TypeScript)
├── ios/              # iOS app (SwiftUI)
├── mobile/           # React Native app (Expo)
├── backend/          # Node.js/Express backend
├── grump-compiler/   # G-Rump language compiler (Rust)
├── grump-ai/         # AI service for animations
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Rust (for compiler)
- iOS: Xcode 14+ (for iOS app)

### Setup
```bash
# Install dependencies
npm install

# Start backend
cd backend && npm start

# Start web app
cd web && npm run dev

# Build compiler
cd grump-compiler && cargo build
```

See **[GET-STARTED.md](GET-STARTED.md)** for detailed setup.

## 📚 Key Features

### Grump 2.0 Character
- **800+ idle animations** - Breathing, blinking, micro-movements
- **10 emotional states** - Grumpy, angry, sad, bored, annoyed, sarcastic, tired, glitchy, manic, depressed
- **Autonomous chat** - Grump chats on his own
- **Mouse tracking** - Eyes follow cursor
- **Mood system** - Dynamic emotional states

### Animation Creation
- Natural language prompts
- Multiple export formats (GIF, MP4, Lottie, sprite sheets)
- Knowledge base integration
- Tier-based AI models

### Game Development
- G-Rump language for games
- Compile to Phaser 3 (web)
- Game templates
- Live preview
- Save/load projects

### Multi-Platform
- **Web** - React + TypeScript + Vite
- **iOS** - SwiftUI + SwiftData
- **Mobile** - React Native + Expo

## 💰 Pricing Tiers

- **Free** - 1 animation/day, preview only
- **Pro** - $49/month, 200 animations/day, all exports
- **Team** - $199/month, 500 animations/day, best AI model

See **[PROFITABLE-MODEL.md](PROFITABLE-MODEL.md)** for details.

## 🛠️ Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (web)
- Zustand (state management)
- Framer Motion (animations)

### Backend
- Node.js + Express
- Groq API (AI)
- Anthropic Claude (AI)

### Compiler
- Rust
- Targets: Swift, Kotlin, JavaScript, Dart

### Game Engine
- Phaser 3 (web compilation target)

## 📖 Documentation

All documentation is organized in the `docs/` folder. See **[docs/README.md](docs/README.md)** for the full index.

### Most Important Docs
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Complete architecture & rebuild guide
- **[GRUMP-COMPLETE-MASTER-DOCUMENT.md](GRUMP-COMPLETE-MASTER-DOCUMENT.md)** - Everything in one place
- **[PROFITABLE-MODEL.md](PROFITABLE-MODEL.md)** - Business model

## 🎯 Next Steps

1. **Read [ARCHITECTURE.md](ARCHITECTURE.md)** to understand the system
2. **Check [IMPROVEMENTS.md](IMPROVEMENTS.md)** to see what's planned
3. **Review [PROFITABLE-MODEL.md](PROFITABLE-MODEL.md)** for business context
4. **Explore the codebase** starting with `web/src/App.tsx`

## 🤝 Contributing

See **[IMPROVEMENTS.md](IMPROVEMENTS.md)** for planned improvements and areas where help is needed.

## 📞 Support

- Check **[docs/README.md](docs/README.md)** for documentation
- Review **[ARCHITECTURE.md](ARCHITECTURE.md)** for technical details
- See **[DEPLOYMENT.md](DEPLOYMENT.md)** for deployment help

---

**Ready to dive in?** Start with **[ARCHITECTURE.md](ARCHITECTURE.md)** or **[GET-STARTED.md](GET-STARTED.md)**!
