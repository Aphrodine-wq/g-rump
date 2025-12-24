# 🎭 GRUMP: The Ultimate AI Animation Platform

## *The Most Expressive AI Character in Any App Store*

**Grump is not a chat interface with a character. Grump IS the interface.**

A living, breathing, grumpy AI assistant who exists in your phone, reacts to everything you do, and tolerates your existence with theatrical flair. Now with the power to create animations from natural language using advanced animation reasoning.

---

[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Web%20%7C%20Mobile-blue.svg)](https://github.com/Aphrodine-wq/g-rump)
[![Backend](https://img.shields.io/badge/backend-Node.js%20%7C%20Express-green.svg)](backend/)
[![AI Provider](https://img.shields.io/badge/AI-Groq%20%7C%20Anthropic-orange.svg)](backend/GROQ-SETUP.md)
[![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)](LICENSE)

[Quick Start](#-quick-start) • [Documentation](#-documentation) • [Deployment](#-production-deployment) • [App Store](#-app-store-submission)

---

## ✨ Core Features

<div align="center">

| 🎨 **Animation System** | 🤖 **AI Personality** | 📚 **Knowledge Base** | 🚀 **Multi-Platform** |
|:---:|:---:|:---:|:---:|
| 16 core expressions<br>15-layer face rig<br>200fps animations<br>Three-layer reasoning | Context-aware responses<br>Time-based behaviors<br>Theatrical personality | PDF learning system<br>GitHub folder support<br>Auto-discovery | iOS • Web • Mobile<br>Shared backend<br>Sync across devices |
| 💻 **G-Rump Language** | 🎬 **Animation Creation** | 🧠 **Animation AI** | 📦 **Export Formats** |
| Animation-first syntax<br>10 advanced features<br>Multi-platform compile | Natural language prompts<br>Human-trusted output<br>Personality-driven | Perceptual engineering<br>Meta-engineering layer<br>ML feedback | GIF • MP4 • Lottie<br>Sprite sheets • Code<br>After Effects • Rive |

</div>

---

## 🎯 What is Grump?

Grump Platform is a **unified multi-platform AI assistant** with a unique personality-driven interface and animation creation capabilities. It's one product that combines:

- **Animated AI Character** - G-Rump, a grumpy but helpful animated assistant
- **Chat Interface** - Natural language conversations with personality
- **Animation Creation** - Generate animations from natural language prompts
- **Game Development** - Code games in G-Rump language, compile to Phaser 3
- **Multi-Platform** - iOS, Web, and Mobile apps with shared backend

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

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Web App (Vite + TypeScript)            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │   App.tsx    │  │   Stores     │  │  Components  │   │  │
│  │  │  (Router)    │→ │  (Zustand)   │→ │  (Views)     │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/REST API
                             │ (Axios)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Node.js/Express Backend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Routes     │→ │  Services    │→ │  AI Services │         │
│  │  /api/chat   │  │  (Business   │  │  (Groq/      │         │
│  │  /api/game   │  │   Logic)     │  │  Anthropic)  │         │
│  │  /api/anim   │  └──────────────┘  └──────────────┘         │
│  └──────────────┘                                             │
└─────────────────────────────────────────────────────────────────┘
                             │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
    ┌────▼────┐          ┌──────▼──────┐          ┌────▼────┐
    │   iOS   │          │     Web     │          │  Mobile │
    │ SwiftUI │          │   React     │          │  Expo   │
    └────┬────┘          └──────┬──────┘          └────┬────┘
         │                      │                      │
         └──────────────────────┼──────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │   G-Rump Compiler   │
                     │   (Rust)            │
                     │                     │
                     │ • Lexer             │
                     │ • Parser            │
                     │ • Analyzer          │
                     │ • Animation Reasoner│
                     │ • Code Generators   │
                     └─────────────────────┘
```

### Components

| Component | Technology | Purpose |
|:---------:|:----------:|:--------|
| **Backend** | Node.js + Express | API gateway, AI integration, knowledge base |
| **iOS App** | SwiftUI + SwiftData | Native iOS with 16 expressions, 15-layer animation |
| **Web Client** | React + TypeScript | Windows-compatible web version |
| **Mobile** | React Native + Expo | Cross-platform mobile app |
| **Compiler** | Rust | G-Rump language compilation to multiple targets |

---

## 🎨 Animation System Deep Dive

### Core Philosophy

> **Animation is decision compression over time, not interpolation.**
>
> **Animation is accurate when it communicates exactly what a human expects to perceive, with just enough variation to feel alive.**

Grump is **alive**. Every animation reinforces his personality:
- **Heavy slams** = Direct, assertive
- **Eye rolls** = Judging you (lovingly)
- **Tracking eyes** = Paying attention (reluctantly)
- **Slow sighs** = Tired of this (but still here)
- **Rare almost-smiles** = Cares (won't admit it)

### Three-Layer Animation System

G-Rump uses a **three-layer animation reasoning system** that produces human-trusted animation:

#### Layer 1: Six-Layer Animation Reasoning (Structure)
1. **Narrative Intent** - What are we trying to communicate?
2. **Attention Hierarchy** - What leads the motion? (Eyes → Head → Body)
3. **Beat Structure** - Perceptual units of meaning
4. **Causal Chains** - Why do things move? (Cause → Effect)
5. **Temporal Relationships** - How do things relate in time?
6. **Settling & Residue** - How does it feel alive?

#### Layer 2: Perceptual Engineering (Cognition)
- **Signal Hierarchy** - Information flow over time (not just motion)
- **Temporal Cognition** - Human temporal expectations and anticipation
- **Cognitive Load Management** - Foreground/background signal classification
- **Social Semantics** - Gesture → meaning mappings
- **Motion Consistency** - Anatomical fidelity and energy flow
- **Multi-Modal Integration** - Voice sync, sound cues, environment

#### Layer 3: Meta-Engineering (Production)
- **G-Rump Personality Encoding** - Every frame encodes personality traits
- **Weighted Perceptual Models** - Signal clarity optimization
- **Multi-Scale Timing** - Micro-beats (10-50ms) and macro-beats (100-400ms)
- **Energy Flow & Physics-Light** - Kinematic approximation for performance
- **Cross-Platform Consistency** - Rig abstraction, frame rate normalization
- **Machine Learning Layers** - Human judgment datasets, self-play iteration
- **Niche Optimizations** - Game dev, animation language, viral content

### Face Rig (15 Layers)

1. **Face Base** - Foundation layer
2. **Eyes** - Main eye shapes
3. **Pupils** - Eye tracking, focus
4. **Eyelids** - Blinking, expressions
5. **Eyebrows** - Mood indicators
6. **Mouth** - Speech, expressions
7. **Mood Glow** - Emotional aura
8. **Accessories** - Optional elements
9. **Particles** - Effects (steam, sparkles)
10-15. **Additional layers** - Overlays, effects

### Performance Targets

| Target | Specification |
|:------:|:-------------:|
| **Frame Rate** | 120fps (ProMotion displays) / 200fps (Web) |
| **Frame Budget** | 8.33ms per frame (120fps) / 5ms (200fps) |
| **Animation Calc** | <2ms |
| **Render Time** | <4ms |
| **Max Layers** | 12 simultaneously |
| **Max Particles** | 30 on-screen |

### G-Rump's Personality States

#### Core States (16 total):
1. **Neutral** - Baseline tired state
2. **Listening** - Paying attention (reluctantly)
3. **Processing** - Thinking about your request
4. **Responding** - Actually talking
5. **Skeptical** - "Are you sure about that?"
6. **Annoyed** - "Seriously?"
7. **Maximum Grump** - Peak exasperation
8. **Impressed** - "...okay that's actually not bad"
9. **Suspicious** - "What do you want?"
10. **Soft Mode** - Rare, almost caring
11. **Sleepy** - Tired of this
12. **Error** - "You broke it. Congrats."
13. **Thinking Deep** - Actually working on something complex
14. **Smug** - "I told you so"
15. **Exasperated Sigh** - Theatrical exhaustion
16. **Reluctant Agreement** - "Fine. Whatever."

#### Animation Creation States (New):
- **Working** - "Creating animation..." (while generating)
- **Proud** - "Nailed it. Obviously." (when animation is complete)

---

## 💻 G-Rump Language: Animation-First Programming

### Overview

**G-Rump** is an animation-first programming language designed for game development and animation creation. It's the engine that powers G-Rump AI's animation generation.

### Key Features vs Other Languages

| Feature | G-Rump | Flutter/Dart | Unity/C# | SwiftUI |
|---------|--------|--------------|----------|---------|
| Animation | **Native syntax** | Library | Component | Modifier |
| Timelines | **First-class** | Manual | Editor-based | None |
| State machines | **Built-in** | Manual | Asset | None |
| Easing | **30+ built-in** | Import | Curves | Limited |
| Physics | **Native** | Plugin | Built-in | None |
| Particles | **Native syntax** | Plugin | Built-in | None |
| Sound | **Native sync** | Plugin | Built-in | AVKit |

### Language Syntax Example

```grump
@app "GameName"
@version "1.0.0"
@target [ios, android, web]
@fps 60

# Assets
assets {
    sprites: "./sprites/"
    sounds: "./audio/"
    fonts: "./fonts/"
}

# Global state
state {
    score: int = 0
    lives: int = 3
    gameState: enum(menu, playing, paused, gameover) = menu
}

# Entry point
scene Main {
    background: #1a1a2e

    # Layout
    Column(center) {
        Text("SPACE BLASTER") {
            font: "PressStart"
            size: 48
            color: #ffffff

            # Animation is INLINE
            animate(loop) {
                0% { scale: 1.0 }
                50% { scale: 1.1 }
                100% { scale: 1.0 }
            } duration: 2s, ease: sine
        }

        Spacer(40)

        Button("START GAME") {
            on tap {
                transition(GameScene, fade, 0.5s)
            }
        }
    }
}
```

### Animation System

**Inline animations:**
```grump
Sprite("hero.png") as hero {
    position: (100, 200)

    animate(loop) {
        to { y: 220 } duration: 0.5s, ease: bounce
        to { y: 200 } duration: 0.5s, ease: bounce
    }
}
```

**Timeline animations (After Effects style):**
```grump
timeline intro {
    0.0s {
        logo { opacity: 0, scale: 0.5 }
        title { opacity: 0, y: -50 }
    }
    0.5s {
        logo { opacity: 1, scale: 1.0 } ease: elastic
    }
    1.0s {
        title { opacity: 1, y: 0 } ease: smooth
    }
}
```

**State machines:**
```grump
entity Player {
    state machine {
        state idle {
            sprite: "hero_idle.png"
            animate(loop) { frames: [1,2,3,2] } fps: 8
            on input.right -> running
            on input.space -> jumping
        }

        state running {
            sprite: "hero_run.png"
            animate(loop) { frames: [1,2,3,4,5,6] } fps: 12
            on input.release -> idle
            update { self.x += 5 * input.direction }
        }
    }
}
```

### Compiler Status

- **Status**: ✅ **Foundation Complete** (~60% complete)
- **Location**: `grump-compiler/`
- **Targets**: iOS (Metal), Android (OpenGL), Web (WebGL), Flutter (Skia)
- **Output**: Swift, Kotlin, Dart, JavaScript

### Language Features (All Implemented)

#### Core Features ✅
- ✅ Lexer with full tokenization
- ✅ Parser with AST construction
- ✅ Type system with animation primitives
- ✅ Analyzer with type checking
- ✅ Code generator (stubs for all targets)
- ✅ Error handling with personality

#### Advanced Features ✅
1. ✅ **Async/Await** - Modern asynchronous programming
2. ✅ **Behavior Trees** - AI system with selectors, sequences, conditions, actions
3. ✅ **Shader System** - Custom shaders (Metal/GLSL/WebGL)
4. ✅ **Networking** - Multiplayer support with sync and RPC
5. ✅ **Macro System** - Code generation and metaprogramming
6. ✅ **Plugin System** - Extensible architecture
7. ✅ **Debugger Integration** - Built-in debugging tools
8. ✅ **Package Management** - Dependency management
9. ✅ **Hot Reload** - Live code updates
10. ✅ **Visual Scripting** - Node-based programming support

#### Animation Reasoning ✅
- ✅ Six-layer animation reasoning system
- ✅ Animation IR (intermediate representation)
- ✅ Perceptual animation engineering
- ✅ Meta-engineering layer
- ✅ G-Rump personality integration
- ✅ Human validation heuristics

---

## 📚 Knowledge Base System

### Overview

G-Rump has a comprehensive knowledge base that's automatically loaded and used by both the chat and animation creation features.

### How It Works

1. **Backend loads knowledge base at startup**
2. **Knowledge base is added to system prompt**
3. **G-Rump AI uses same AI service** (which includes knowledge base)

### Knowledge Base Content

Located in `docs/knowledge-base/`:

#### Markdown Files:
- `ANIMATION-KNOWLEDGE-BASE.md` - 12 principles of animation, physics, acting
- `G-RUMP-LANGUAGE-SPECIFICATION-V2.md` - Complete language syntax
- `GAME-DEVELOPMENT-LANGUAGES.md` - C++, Java, JavaScript, C#, Lua, Python
- `CSS-ANIMATION-LIBRARIES.md` - Top 10 CSS animation libraries
- `G-RUMP-COMPILER.md` - Compiler information

#### PDF Files (27+ documents):
- Animation textbooks
- Game development guides
- Programming language references
- Design principles
- And more...

### Remote Hosting

Knowledge base can be hosted on GitHub:
- **GitHub Folder**: `https://github.com/user/repo/tree/main/docs/knowledge-base`
- **Auto-discovery**: Backend automatically loads PDFs from GitHub
- **No local storage needed**: All content fetched remotely

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

#### Backend Setup

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

#### Web Client Setup

```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:5173`

#### iOS App Setup

1. Open `ios/Grump.xcodeproj` in Xcode
2. Set minimum iOS version to 16.0
3. Configure API URL in `APIClient.swift`
4. Build and run

### 🎬 Start Everything

```bash
# Windows
.\start-all.ps1

# macOS/Linux
./start-all.sh
```

**That's it!** Backend runs on `http://localhost:3000`, web client on `http://localhost:5173`.

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

## ⚙️ Configuration

### Backend Environment Variables

**Required Variables:**

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

**Optional Variables:**
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

**See [backend/README.md](backend/README.md) for complete configuration guide.**

---

## 📚 API Documentation

### Chat API

#### POST /api/chat

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

### Animation API

#### POST /api/animation/create

Generate animation from prompt.

**Request:**
```json
{
  "prompt": "Create a bouncing ball animation",
  "style": "cartoon",
  "format": "gif"
}
```

**Response:**
```json
{
  "animation": {
    "id": "anim_123",
    "url": "https://...",
    "format": "gif"
  },
  "usage": {
    "tokens": 150,
    "cost": 0.005
  }
}
```

### Knowledge API

#### GET /api/knowledge

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

### Health Check

#### GET /health

**Response:**
```json
{
  "status": "ok",
  "service": "grump-backend"
}
```

---

## 🎯 Business Model & Pricing

### Pricing Tiers

#### Free Tier
- **Price**: $0
- **Features**:
  - 3 animations/day (90/month)
  - Preview only (no downloads)
  - Basic exports (GIF, MP4) - watermarked
  - 720p resolution
  - G-Rump watermark
  - Standard response speed
  - Community support

#### G-Rump Pro
- **Price**: $49/month or $490/year (save 17%)
- **Features**:
  - 200 animations/day (6,000/month)
  - All export formats (Lottie, CSS, etc)
  - 4K resolution
  - No watermark
  - Priority rendering
  - Animation history
  - Custom palettes
  - API access (200 calls/day)
  - Email support
  - 14-day free trial

#### G-Rump Team
- **Price**: $199/month per seat
- **Features**:
  - All Pro features
  - 500 animations/day per seat (15,000/month)
  - Team workspace
  - Brand kit (colors, fonts, logos)
  - Collaboration tools
  - Admin controls
  - SSO integration
  - Priority support
  - Invoice billing
  - Custom integrations

#### G-Rump API
- **Price**: $0.05 per animation
- **Features**:
  - Pay per use
  - Bulk discounts
  - White-label option

### Revenue Projections

- **Year 1**: 100K users, $200K ARR
- **Year 2**: 500K users, $2.5M ARR
- **Year 3**: 2M users, $11M+ ARR

---

## 📊 Performance & Technical Specs

<div align="center">

| Target | Specification |
|:------:|:-------------:|
| **Frame Rate** | 120fps (ProMotion displays) / 200fps (Web) |
| **Frame Budget** | 8.33ms per frame (120fps) / 5ms (200fps) |
| **Animation Calc** | <2ms |
| **Render Time** | <4ms |
| **Max Layers** | 12 simultaneously |
| **Max Particles** | 30 on-screen |

</div>

### Animation Timing Dataset

**Professional Reference Guide for Accurate Motion**

#### Facial Expressions & Micro-Expressions

**Basic Expressions (Full Development)**

| Expression | Onset | Peak | Hold | Release | Total Duration | Notes |
|------------|-------|------|------|---------|----------------|-------|
| Smile (genuine) | 6-8f | 12-16f | 8-12f | 10-14f | 36-50f (1.5-2s) | Crow's feet appear at peak |
| Frown | 8-10f | 14-18f | 10-15f | 12-16f | 44-59f (1.8-2.5s) | Slower than smile |
| Surprise | 2-4f | 6-8f | 4-6f | 6-10f | 18-28f (0.75-1.2s) | Fastest expression |

**Micro-Expressions (Leakage/Suppressed)**

| Micro-Expression | Duration | Peak Frame | Detectability | Muscle Groups |
|------------------|----------|------------|---------------|---------------|
| Contempt (lip corner) | 3-8f (0.125-0.33s) | 4-5f | Single side only | Zygomatic minor |
| Fear flash | 4-6f (0.17-0.25s) | 3f | Eyes widen briefly | Frontalis, levator palpebrae |

#### Eye Movements & Blinks

**Blink Timing (Critical for Realism)**

| Blink Type | Down Phase | Closed | Up Phase | Total | Frequency |
|------------|------------|--------|----------|-------|-----------|
| Normal blink | 3-4f (0.125-0.17s) | 1-2f | 4-5f | 8-11f (0.33-0.46s) | Every 3-4 seconds at rest |
| Rapid blink (surprise) | 2-3f | 0-1f | 3-4f | 5-8f (0.2-0.33s) | Clusters of 2-3 |
| Slow blink (tired) | 5-8f | 3-6f | 6-10f | 14-24f (0.58-1s) | Every 2-3 seconds |

#### Walking & Running Cycles

**Walking Cycles (Standard Adult)**

| Walk Type | Cycle Duration | Step Length | Stride Frequency | Contact/Passing/Contact |
|-----------|----------------|-------------|------------------|-------------------------|
| Normal walk (3.5 mph) | 24-28f (1-1.17s) | 75cm | 0.85-1 Hz | 12f / 6f / 12f |
| Brisk walk (5 mph) | 18-22f (0.75-0.92s) | 85cm | 1.1-1.3 Hz | 9f / 4-5f / 9f |

---

## 🧪 Development Status

### ✅ Completed Features

- ✅ Backend API fully functional
- ✅ Chat functionality with personality
- ✅ Knowledge base integration
- ✅ iOS app (basic implementation)
- ✅ Web client complete
- ✅ Animation system (15-layer, 16 expressions)
- ✅ Personality system with 16+ states
- ✅ API endpoints connected
- ✅ Frontend UI (all 11 components)
- ✅ Backend integration complete
- ✅ G-Rump Language Compiler foundation (all 10 features implemented)
- ✅ Six-layer animation reasoning system
- ✅ Perceptual animation engineering
- ✅ Meta-engineering layer

### 🚧 In Progress

- 🚧 Animation rendering pipeline
- 🚧 Export formats (GIF, MP4, Lottie - code format works)
- 🚧 Full code generation for all targets
- 🚧 Runtime libraries

### 📋 Next Steps

1. Complete animation rendering pipeline
2. Implement full code generation
3. Add export formats (GIF, MP4, Lottie)
4. Create runtime libraries
5. Beta testing
6. Public launch

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

## 📝 Key Files & Locations

### Documentation
- `README.md` - Main README
- `PRODUCT-VISION.md` - G-Rump AI vision
- `ARCHITECTURE.md` - Technical architecture
- `GRUMP-COMPLETE-MASTER-DOCUMENT.md` - Complete master document
- `grumpprompt.md` - Personality system

### G-Rump Language Compiler
- `grump-compiler/README.md` - Compiler overview
- `grump-compiler/LANGUAGE-EXTENSIONS.md` - All 10 features
- `grump-compiler/EXAMPLES.md` - Code examples

### Animation Systems
- `grump-compiler/ANIMATION-REASONING.md` - Six-layer reasoning system
- `grump-compiler/ANIMATION-PHILOSOPHY.md` - Core philosophy
- `grump-compiler/PERCEPTUAL-ANIMATION.md` - Perceptual engineering

### Code
- `backend/` - Backend API
- `web/` - Web frontend
- `ios/` - iOS app
- `mobile/` - React Native app
- `grump-compiler/` - Language compiler
- `docs/knowledge-base/` - Knowledge base files

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Follow the [Quick Start](#-quick-start) guide
4. Create a feature branch
5. Make your changes
6. Submit a pull request

### Code Style

- **Backend**: ESLint configuration in `backend/`
- **Frontend**: Prettier configuration in `web/`
- **iOS**: SwiftLint configuration in `ios/`
- **Rust**: Standard Rust formatting

---

## 📧 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/Aphrodine-wq/g-rump/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Aphrodine-wq/g-rump/discussions)
- **Email**: [Contact Information Here]

---

## 📄 License

[ISC License](LICENSE)

---

<div align="center">

**"You want me to compile EVERYTHING into one thing? Fine. Here. It's all one product now. Happy?"**

— *Grump*

---

Made with ❤️ (and a lot of grumbling) by the Grump Development Team

[⬆ Back to Top](#-grump)

</div>