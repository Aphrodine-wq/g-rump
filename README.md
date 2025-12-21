<div align="center">

# 🎭 GRUMP

### *The Most Expressive AI Character in Any App Store*

**Grump is not a chat interface with a character. Grump IS the interface.**

A living, breathing, grumpy AI assistant who exists in your phone, reacts to everything you do, and tolerates your existence with theatrical flair.

---

[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Web%20%7C%20Mobile-blue.svg)](https://github.com/Aphrodine-wq/g-rump)
[![Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20Express-green.svg)](backend/)
[![AI Provider](https://img.shields.io/badge/AI-Groq%20%7C%20Anthropic-orange.svg)](backend/GROQ-SETUP.md)
[![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)](LICENSE)

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-production-deployment) • [App Store](#-app-store-submission)

</div>

---

## ✨ Features

<div align="center">

| 🎨 **Animation System** | 🤖 **AI Personality** | 📚 **Knowledge Base** | 🚀 **Multi-Platform** |
|:---:|:---:|:---:|:---:|
| 16 core expressions<br>15-layer face rig<br>200fps animations<br>Three-layer reasoning | Context-aware responses<br>Time-based behaviors<br>Theatrical personality | PDF learning system<br>GitHub folder support<br>Auto-discovery | iOS • Web • Mobile<br>Shared backend<br>Sync across devices |
| 💻 **G-Rump Language** | 🎬 **Animation Creation** | 🧠 **Animation AI** | 📦 **Export Formats** |
| Animation-first syntax<br>10 advanced features<br>Multi-platform compile | Natural language prompts<br>Human-trusted output<br>Personality-driven | Perceptual engineering<br>Meta-engineering layer<br>ML feedback | GIF • MP4 • Lottie<br>Sprite sheets • Code<br>After Effects • Rive |

</div>

---

## 🎯 Overview

Grump Platform is a **multi-platform AI assistant** with a unique personality-driven interface. Built with a sophisticated animation system, context-aware AI, and comprehensive knowledge base integration.

### 🆕 G-Rump AI: Animation Creation + Language

**G-Rump AI** is the same animated G-Rump character you already have, now with:
- ✅ **Animation Creation** - Generate animations (GIF, MP4, Lottie, sprite sheets) from natural language
- ✅ **G-Rump Language** - Animation-first programming language with 10 advanced features
- ✅ **Animation Reasoning** - Three-layer system that produces human-trusted animation
- ✅ **Full Knowledge Base** - Uses all existing knowledge base content
- ✅ **Same Personality** - Same grumpy but helpful G-Rump

**Key Innovation**: G-Rump uses a **three-layer animation reasoning system**:
1. **Structure** - Six-layer reasoning (intent, hierarchy, beats, causality, timing, settling)
2. **Cognition** - Perceptual engineering (signals, temporal expectations, social semantics)
3. **Meta-Engineering** - Production-ready (personality encoding, cross-platform, ML feedback)

**Result**: Animation that humans **trust**, not just tolerate.

See [PRODUCT-VISION.md](PRODUCT-VISION.md) for details and [GRUMP-COMPLETE-MASTER-DOCUMENT.md](GRUMP-COMPLETE-MASTER-DOCUMENT.md) for complete documentation.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        GRUMP PLATFORM                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │   iOS   │          │   Web   │          │  Mobile │
   │ SwiftUI │          │  React  │          │  Expo   │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   Backend API      │
                    │   (Express.js)     │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │  Groq   │          │Anthropic│          │Knowledge│
   │   LLM   │          │ Claude  │          │  Base   │
   └─────────┘          └─────────┘          └─────────┘
```

### Components

| Component | Technology | Purpose |
|:---------:|:----------:|:--------|
| **Backend** | Node.js + Express | API gateway, AI integration, knowledge base |
| **iOS App** | SwiftUI + SwiftData | Native iOS with 16 expressions, 15-layer animation |
| **Web Client** | React + TypeScript | Windows-compatible web version |
| **Mobile** | React Native + Expo | Cross-platform mobile app |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- iOS: Xcode 14+ (for iOS development)
- API Key: [Groq](https://console.groq.com) or [Anthropic](https://console.anthropic.com)

### Installation

**Option 1: Automated Setup (Recommended)**

```bash
# Windows
.\setup.ps1

# macOS/Linux
chmod +x setup.sh && ./setup.sh
```

**Option 2: Manual Setup**

<details>
<summary><b>Backend Setup</b></summary>

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
PORT=3000
NODE_ENV=development
EOF

npm start
```

</details>

<details>
<summary><b>Web Client Setup</b></summary>

```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:5173`

</details>

<details>
<summary><b>iOS App Setup</b></summary>

1. Open `ios/Grump.xcodeproj` in Xcode
2. Set minimum iOS version to 16.0
3. Configure API URL in `APIClient.swift`
4. Build and run

</details>

### 🎬 Start Everything

```bash
# Windows
.\start-all.ps1

# macOS/Linux
./start-all.sh
```

**That's it!** Backend runs on `http://localhost:3000`, web client on `http://localhost:5173`.

---

## 📚 Documentation

<div align="center">

**[📖 Complete Documentation Index](DOCUMENTATION.md)** — Master hub for all guides

</div>

### Quick Links

| Category | Links |
|:--------:|:-----|
| **Getting Started** | [START HERE](START-HERE.md) • [GET STARTED](GET-STARTED.md) • [Install Guide](INSTALL.md) |
| **Deployment** | [Railway Quick Start](RAILWAY_QUICK_START.md) • [Deployment Guide](DEPLOYMENT-GUIDE.md) • [Checklist](DEPLOYMENT_CHECKLIST.md) |
| **Knowledge Base** | [GitHub Folder Setup](SETUP-GITHUB-FOLDER.md) • [Remote Hosting](backend/KNOWLEDGE-BASE-REMOTE-HOSTING.md) |
| **App Store** | [Compliance](docs/APPLE_COMPLIANCE.md) • [Submission](ios/APP_STORE_SUBMISSION.md) • [Checklist](ios/APP_STORE_CHECKLIST.md) |
| **Reference** | [Quick Reference](docs/QUICK-REFERENCE.md) • [API Docs](#-api-documentation) • [Architecture](#-architecture) |

---

## 🌐 Production Deployment

<div align="center">

**Ready to deploy?** Choose your path:

| Platform | Guide | Time |
|:--------:|:-----:|:----:|
| **Railway** | [Quick Start](RAILWAY_QUICK_START.md) | 5 min |
| **Railway** | [Full Guide](RAILWAY_DEPLOYMENT.md) | 15 min |
| **All Platforms** | [Deployment Guide](DEPLOYMENT-GUIDE.md) | 30 min |

</div>

### Quick Deploy Steps

```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy Backend (Railway)
# - Connect GitHub repo
# - Set root directory: backend
# - Add environment variables (see RAILWAY_QUICK_START.md)

# 3. Deploy Frontend (Vercel)
# - Connect GitHub repo
# - Set root directory: web
# - Add VITE_API_URL environment variable

# 4. Done! Auto-deploys on future pushes
```

**See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for complete instructions.**

---

## 📱 App Store Submission

<div align="center">

**Status:** Ready for submission

| Component | Status |
|:---------:|:-----:|
| StoreKit | ✅ Complete |
| Privacy Policy | ✅ Template ready |
| Compliance | ⚠️ Needs App Store Connect config |
| Assets | ⚠️ Needs preparation |

</div>

**Guides:**
- [📋 Compliance Status](docs/APPLE_COMPLIANCE.md) — Current status
- [📱 Submission Guide](ios/APP_STORE_SUBMISSION.md) — Complete walkthrough
- [✅ Checklist](ios/APP_STORE_CHECKLIST.md) — Pre-submission checklist
- [💰 StoreKit Setup](docs/STOREKIT_SETUP.md) — In-App Purchase setup

---

## 🎨 Animation System

<div align="center">

### *Animation Bible v2.0*

**16 Core Expressions • 15-Layer Face Rig • 120fps Performance**

</div>

### Core Philosophy

> Grump is **alive**. Every animation reinforces his personality:
> - **Heavy slams** = Direct, assertive
> - **Eye rolls** = Judging you (lovingly)
> - **Tracking eyes** = Paying attention (reluctantly)
> - **Slow sighs** = Tired of this (but still here)
> - **Rare almost-smiles** = Cares (won't admit it)

### Key Features

| Feature | Details |
|:-------:|:--------|
| **Expressions** | 16 core states (Neutral, Listening, Processing, Responding, Skeptical, Annoyed, Maximum Grump, Impressed, Suspicious, Soft Mode, Sleepy, Error, Thinking Deep, Smug, Exasperated Sigh, Reluctant Agreement) |
| **Face Rig** | 15-layer system (Face Base, Eyes, Pupils, Eyelids, Eyebrows, Mood Glow, Accessories, Particles) |
| **Animations** | 6 blink types, breathing system, micro-movements, pupil tracking, particle effects |
| **Performance** | 120fps target, GPU-accelerated, optimized for ProMotion displays |
| **Accessibility** | Reduced motion support, responsive scaling (40pt-160pt) |

**Full documentation:** See [Animation System](README.md#-animation-system) section below.

---

## 🏗️ Architecture

### Backend

```
backend/
├── server.js              # Express server
├── routes/
│   ├── chat.js           # Chat API
│   └── knowledge.js      # Knowledge base API
├── services/
│   ├── anthropic.js      # Anthropic Claude client
│   ├── groq.js          # Groq LLM client
│   ├── knowledgeBase.js  # PDF learning system
│   └── pdfService.js    # PDF analysis
├── middleware/
│   ├── rateLimit.js     # Rate limiting
│   └── errorHandler.js  # Error handling
└── config/
    └── config.js        # Configuration
```

**API Endpoints:**
- `POST /api/chat` — Send message, get Grump response
- `GET /api/knowledge` — Knowledge base info
- `POST /api/knowledge/reload` — Reload knowledge base
- `GET /health` — Health check

### iOS App

```
ios/Grump/
├── GrumpApp.swift              # App entry
├── Views/                       # UI views
│   ├── ChatView.swift
│   ├── OnboardingView.swift
│   └── LaunchSequenceView.swift
├── Components/                  # Reusable components
│   ├── GrumpAvatarView.swift   # 15-layer avatar
│   ├── EnhancedFaceRigView.swift
│   └── [12 more components]
├── Services/                    # Business logic
│   ├── APIClient.swift
│   ├── AnimationService.swift
│   └── [9 more services]
├── Models/                      # Data models
└── Storage/                      # SwiftData
```

### Web Client

```
web/
├── src/
│   ├── components/         # React components
│   ├── store/             # State management
│   ├── services/          # API clients
│   └── App.tsx           # Root component
├── electron/              # Electron wrapper
└── vite.config.ts        # Build config
```

---

## ⚙️ Configuration

### Backend Environment Variables

<details>
<summary><b>Required Variables</b></summary>

**Groq (Recommended):**
```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
```

**Anthropic Claude:**
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_api_key_here
```

</details>

<details>
<summary><b>Optional Variables</b></summary>

```env
# Server
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*

# Knowledge Base
KNOWLEDGE_BASE_GITHUB_FOLDER=https://github.com/user/repo/tree/main/docs/knowledge-base
KNOWLEDGE_BASE_MAX_TOTAL_CHARS=15000
KNOWLEDGE_BASE_MAX_CHARS_PER_PDF=750

# AI Provider Settings
GROQ_TEMPERATURE=0.9
GROQ_MAX_TOKENS=256
ANTHROPIC_TEMPERATURE=0.9
ANTHROPIC_MAX_TOKENS=256
```

</details>

**See [backend/README.md](backend/README.md) for complete configuration guide.**

---

## 📚 API Documentation

### POST /api/chat

Send a message to Grump and receive a response.

**Request:**
```json
{
  "message": "Hello Grump",
  "conversationHistory": [
    {
      "content": "Previous message",
      "sender": "user",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Oh. It's you. Great.",
  "timestamp": "2024-01-01T00:00:01Z"
}
```

### GET /api/knowledge

Get knowledge base information.

**Response:**
```json
{
  "localPDFCount": 0,
  "remotePDFCount": 27,
  "totalPDFCount": 27,
  "hasKnowledge": true,
  "githubFolder": "https://github.com/user/repo/tree/main/docs/knowledge-base"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "grump-backend"
}
```

**Full API docs:** See [API Documentation](#-api-documentation) section.

---

## 🎯 Performance

<div align="center">

| Target | Specification |
|:------:|:-------------:|
| **Frame Rate** | 120fps (ProMotion displays) |
| **Frame Budget** | 8.33ms per frame |
| **Animation Calc** | <2ms |
| **Render Time** | <4ms |
| **Max Layers** | 12 simultaneously |
| **Max Particles** | 30 on-screen |

</div>

**Optimization strategies:** GPU acceleration, particle pooling, lazy loading, pre-computed keyframes.

---

## 🎨 Design System

<div align="center">

| Element | Specification |
|:-------:|:-------------:|
| **Background** | `#0A0A0A` |
| **Surface** | `#1A1A1A` |
| **Accent** | `#FF6B6B` |
| **Text Primary** | `#E0E0E0` |
| **Font** | SF Pro (iOS) / System |

</div>

---

## 🧪 Testing

- ✅ Backend API testing
- ✅ Rate limit validation
- ✅ Error handling verification
- ✅ iOS UI component testing
- ✅ Animation performance testing
- ✅ Frame rate validation
- ✅ Accessibility testing

---

## 🚧 Roadmap

- [ ] Chat history management UI
- [ ] Search conversations
- [ ] Export/share functionality
- [ ] Push notifications
- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Cloud sync
- [ ] Advanced analytics

---

## 📝 License

[Your License Here]

---

## 🤝 Contributing

[Your Contributing Guidelines Here]

---

## 📧 Contact

[Your Contact Information Here]

---

<div align="center">

**"You want me to do EXPRESSIONS now? Fine. I'll be over here. Emoting. Whatever."**

— *Grump*

---

Made with ❤️ (and a lot of grumbling) by the Grump Development Team

[⬆ Back to Top](#-grump)

</div>
