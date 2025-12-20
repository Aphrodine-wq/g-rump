# Grump Platform

**The most expressive, memorable AI character in any app store.**

Grump is not a chat interface with a character. **Grump IS the interface.** A living, breathing, grumpy AI assistant who exists in your phone, reacts to everything you do, and tolerates your existence with theatrical flair.

---

## 🎭 Overview

Grump Platform consists of three main components:

1. **Backend Server** (Node.js/Express) - API gateway for Anthropic Claude integration with Grump's personality system
2. **iOS App** (SwiftUI) - Native iOS client with comprehensive animation system, 16+ detailed expressions, and context-aware behaviors
3. **Web Client** (React/TypeScript) - Windows-compatible web version that syncs with the same backend

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   iOS App   │ ──────> │  Backend API │ ──────> │  Anthropic  │
│  (SwiftUI)  │ <────── │  (Express)   │ <────── │   Claude    │
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        │
      v                        v
┌─────────────┐         ┌──────────────┐
│  SwiftData  │         │  Rate Limit  │
│  (Local DB) │         │   & Config   │
└─────────────┘         └──────────────┘
```

---

## 📱 App Store Submission

**Ready to submit Grump to the App Store?** 

📖 **Compliance & Submission Guides:**
- [`docs/APPLE_COMPLIANCE.md`](docs/APPLE_COMPLIANCE.md) ⭐ - Current compliance status
- [`docs/STOREKIT_SETUP.md`](docs/STOREKIT_SETUP.md) - In-App Purchase setup
- [`docs/PRIVACY_POLICY_SETUP.md`](docs/PRIVACY_POLICY_SETUP.md) - Privacy policy setup
- [`ios/APP_STORE_SUBMISSION.md`](ios/APP_STORE_SUBMISSION.md) - Complete submission guide
- [`ios/APP_STORE_CHECKLIST.md`](ios/APP_STORE_CHECKLIST.md) - Submission checklist

**Status:** 
- ✅ StoreKit implementation complete
- ✅ Privacy policy template created
- ⚠️ Needs App Store Connect configuration
- ⚠️ Privacy policy needs hosting

**Quick steps:**
1. Configure StoreKit product IDs in code
2. Create subscription products in App Store Connect
3. Customize and host privacy policy
4. Prepare assets (icon, screenshots, description)
5. Build and archive in Xcode
6. Upload to App Store Connect
7. Submit for review

---

## 🌐 Production Deployment

**Ready to deploy to g-rump.com?** We have comprehensive guides for Vercel (frontend) + Railway (backend):

**Quick Links:**
- **[Railway Quick Start](RAILWAY_QUICK_START.md)** - 5-minute deployment guide ⚡
- **[Railway Full Guide](RAILWAY_DEPLOYMENT.md)** - Complete Railway setup
- **[Vercel + Railway Setup](DEPLOYMENT.md)** - Full deployment guide
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist

**Quick Deploy:**
```bash
# 1. Push code to GitHub
git push origin main

# 2. Create Railway account at https://railway.app
# 3. Connect GitHub repo
# 4. Set environment variables (see RAILWAY_QUICK_START.md)
# 5. Get Railway URL and update Vercel
# 6. Done! Auto-deploys on future git push

./scripts/deploy-to-railway.sh  # Helper script
```

---

## 📚 Documentation

**All documentation is organized in the [`docs/`](docs/) directory:**

- **[Documentation Index](docs/README.md)** - Complete documentation index
- **[Quick Reference](docs/QUICK-REFERENCE.md)** - Fast lookup guide
- **[Apple Compliance](docs/APPLE_COMPLIANCE.md)** - App Store compliance status
- **[Knowledge Base Guide](docs/knowledge-base/README.md)** - PDF learning system
- **[PDF Analysis Guide](docs/PDF-ANALYSIS-GUIDE.md)** - Contextual PDF analysis

---

## 🚀 Quick Start

### Automated Setup (Recommended)

**Windows:**
```powershell
.\setup.ps1
```

**macOS/Linux:**
```bash
chmod +x setup.sh && ./setup.sh
```

This automatically installs all dependencies and creates config files!

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

5. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3000` (or your configured PORT).

### iOS App Setup

1. Open `ios/Grump.xcodeproj` in Xcode
2. Ensure minimum iOS version is set to 16.0
3. Configure the API base URL in `APIClient.swift` (default: `http://localhost:3000`)
4. Build and run on a simulator or device

**Note:** For physical devices, update the API URL to your local network IP address (e.g., `http://192.168.1.100:3000`).

### Web Client Setup (Windows)

**Quick Start:**
```bash
cd web
npm install
npm run dev        # Browser version
npm run electron:dev  # Native Windows app
```

The `.env` file is auto-created by the setup script. It defaults to `http://localhost:3000`.

**Or run everything at once:**
```powershell
.\start-all.ps1    # Windows
./start-all.sh     # macOS/Linux
```

The web client syncs with the same backend as iOS, so you get the same Grump experience on Windows!

---

## 🎨 Animation System (Animation Bible v2.0)

### Core Philosophy

Grump is **alive**. Every animation reinforces his personality:
- **Heavy slams** = He's direct, assertive
- **Eye rolls** = He's judging you (lovingly)
- **Tracking eyes** = He's paying attention (reluctantly)
- **Slow sighs** = He's tired of this (but still here)
- **Rare almost-smiles** = He cares (won't admit it)

### Face Rig Specifications

**Canvas & Layout:**
- Canvas Size: 400 x 400 points (retina: 800 x 800 px)
- Safe Zone: 360 x 360 (centered)
- Face Boundary: 280 x 280 pt
- Feature Zone: 180 x 120 pt (eyes, mouth)
- Anchor Point: Center (200, 200)
- Export Sizes: 120pt, 80pt, 60pt, 40pt

**15-Layer Structure (Bottom to Top):**

1. **FACE_BASE** - Rounded rectangle (280x280pt, 48pt corner radius) with gradient fill (#2A2A2A to #1A1A1A), stroke, shadow, tech grid pattern, noise texture
2. **EYE_WHITE_LEFT** - Ellipse (36x36pt default, deformable)
3. **EYE_WHITE_RIGHT** - Ellipse (36x36pt default, deformable)
4. **PUPIL_LEFT** - Circle (12pt default, tracks independently)
5. **PUPIL_RIGHT** - Circle (12pt default, tracks independently)
6. **EYELID_BOTTOM_LEFT** - Curved shape (44x16pt, for squints)
7. **EYELID_BOTTOM_RIGHT** - Curved shape (44x16pt, for squints)
8. **EYELID_TOP_LEFT** - Curved shape (44x24pt, for blinks)
9. **EYELID_TOP_RIGHT** - Curved shape (44x24pt, for blinks)
10. **EYEBROW_LEFT** - Rounded rectangle (40x8pt, 4pt corner radius)
11. **EYEBROW_RIGHT** - Rounded rectangle (40x8pt, 4pt corner radius)
12. **MOOD_GLOW_INNER** - Rounded rectangle (288x288pt, 2pt stroke, 8pt blur)
13. **MOOD_GLOW_OUTER** - Rounded rectangle (296x296pt, 4pt stroke, 16pt blur)
14. **ACCESSORIES** - Party hat, coffee mug, etc. (conditional)
15. **PARTICLE_EFFECTS** - Sleep Zs, confetti, steam, etc. (conditional)

**Component Specifications:**

- **Tech Grid Pattern:** Diagonal lines (45°), #FF6B6B @ 8% opacity, 8pt spacing, subtle scroll animation (0.5pt/sec, speeds up when thinking)
- **Eyes:** Default 36x36pt, scale ranges: width 0.7-1.2 (25.2-43.2pt), height 0.3-1.3 (10.8-46.8pt)
- **Pupils:** Default 12pt, movement bounds ±8pt X, ±6pt Y, size states: 4pt (shock) to 16pt (dilated)
- **Eyebrows:** 40x8pt, rotation range -30° to +20°, Y offset -16pt to +12pt, X offset ±4pt
- **Mouth:** 12 core shapes (Flat, Frown Slight, Frown Deep, Smirk Left/Right, Almost Smile, Open Small/Medium/Wide, Pursed, Tight, Wavy), width range 20-56pt, height range 2-24pt
- **Mood Glow:** Dynamic color palette (9 moods), pulse rate 0.5s-4.0s, intensity 20-100%, opacity oscillation ±15%

### 16 Core Expressions

Each expression defines exact component states with precise measurements:

1. **NEUTRAL** - Default Grump, not happy, not mad, just here
2. **LISTENING** - User typing, pupils track text, eyebrows rise, eyes widen
3. **PROCESSING** - Thinking, eyes look up-left, furrowed brows, 4 randomized sequences
4. **RESPONDING** - Delivering response, mouth syncs with text, punctuation reactions
5. **SKEPTICAL** - One eyebrow dramatically raised, smirk, triggered by simple questions
6. **ANNOYED** - Both brows furrowed, eyes narrow, head shake, composing self blink
7. **MAXIMUM_GRUMP** - Peak frustration, full eye roll, screen shake, intense glow
8. **IMPRESSED** - Rare (5% max), almost-smile that fights itself, warm glow, success haptic
9. **SUSPICIOUS** - Asymmetric brows, pupils shift side-to-side, triggered by compliments
10. **SOFT_MODE** - Stops frowning, gentler for sensitive topics, warm calm glow
11. **SLEEPY** - Progressive stages (0-30s, 30-60s, 60-90s, 90-120s), eyes droop, Z particles
12. **ERROR** - Confused asymmetry, glitch effects, flickering glow, error messages
13. **THINKING_DEEP** - Extended processing, eyes up-right, color cycling glow
14. **SMUG** - One eyebrow fully raised, smirk, chin up effect
15. **EXASPERATED_SIGH** - Heavy sigh animation sequence (deflating scale)
16. **RELUCTANT_AGREEMENT** - Brief eye close, small nod, pursed to flat mouth

### Behavioral Systems

**State Machine Architecture:**
- **Idle Layer** (always running): Breathing, random micro-movements, ambient blink timer
- **Expression Layer:** Exclusive states with transitions
- **Effect Layer:** Additive effects (screen shake, glow flares, particles)

**Pupil Tracking System:**
- Real-time cursor position mapping to pupil X offset (-6pt to +6pt)
- Text length tracking, keyboard state awareness
- Smooth interpolation with 100ms latency
- Disabled during PROCESSING, SLEEPY, ERROR, SUSPICIOUS, MAXIMUM_GRUMP

**Blink System (6 Types):**
- **Standard Blink:** 150ms, every 3-6 seconds
- **Slow Blink:** 400ms, for SLEEPY/SOFT_MODE
- **Heavy Blink:** 600ms, for ANNOYED
- **Quick Double-Blink:** 250ms total, for surprise
- **Half-Blink:** 100ms, for skepticism
- **Wink:** 200ms, one eye only (extremely rare)
- Expression-specific frequency modifiers

**Breathing System:**
- Base: Scale 0.98-1.02, 3.0s cycle
- Expression-modified ranges and durations
- Sigh animation: 1.6s sequence (expand, hold, deflate)

**Micro-Movement System:**
- **Pupil drift:** ±2pt, 5s cycle, Perlin noise
- **Eyebrow micro-adjust:** ±1° rotation, ±1pt Y, 8s cycle
- **Head micro-tilt:** ±0.5°, 10s cycle
- **Mouth micro-movement:** ±1pt width, ±0.5pt depth, 6s cycle
- All use independent Perlin noise generators

### Context Awareness System

**Message Content Analysis:**
- Keyword triggers for expressions (skeptical, soft mode, suspicious, annoyed)
- Sentiment analysis for tone detection
- Pattern recognition for repeat questions

**Time-Based Context:**
- Hour windows (12am-5am: 3AM mode, Monday: +30% annoyance, etc.)
- Day of week modifiers
- Seasonal awareness (future)

**Session Context:**
- Length effects (0-5min fresh, 45+min "are you okay?")
- Interaction patterns
- Message frequency tracking

**Conversation History:**
- Track patterns (questions asked, advice followed, sentiment trajectory)
- Contextual memory for continuity

### Special Animations

**App Launch Sequence (1800ms):**
1. **Darkness (0-300ms):** Black screen, noise texture
2. **Eyes Appear (300-700ms):** Pupils fade in, grow to size
3. **Eyes Open (700-1000ms):** Eyelids lift, pupils dilate, first blink
4. **Face Reveals (1000-1400ms):** Face container fades, all elements visible, scale pop
5. **UI Slides Up (1400-1800ms):** Chat area and input slide up, settling blink

**Eye Roll Animation (1000ms):**
- Full 360° pupil path (circular within eye bounds)
- Eyelid behavior (rise, squint, relax)
- Eyebrow accompaniment (raise, furrow, settle)
- Optional head tilt (-2° during upward phase)
- Haptic: Soft double-tap at peak
- Variations: Half-roll, double-roll, slow-roll, quick-roll

**Message Entry Animations:**
- **User Message:** Slide in from right with bounce (300ms, cubic-bezier bounce)
- **Grump Message:** SLAM from left (400ms), screen shake on impact, character-by-character streaming
- **Text Streaming:** Variable speed (20-50ms per character), punctuation holds (period +100ms, ellipsis +300ms)

**Particle Effects Library:**
- **Sleep Zs:** Rise with sine wave, 8pt→14pt, spawn every 1.5s
- **Confetti:** 20 particles, gravity physics, birthday trigger
- **Coffee Steam:** Small ellipses, rise with wobble, 3AM mode
- **Anger Particles:** Impact lines, expand outward, Maximum Grump
- **Sparkle:** 4-point star, very rare (5% of impressed), 400ms
- **Glitch Rectangles:** Error state, random positions, 50ms each

### Easter Eggs

- **3AM Grump:** Coffee mug accessory, steam particles, extra tired expression
- **Birthday Grump:** Party hat (too small, elastic band visible), confetti burst, annoyed acceptance
- **Shake to Wake:** Device shake while asleep triggers startled wake animation
- **Konami Code:** 8-bit pixel eyes, retro sound, secret message (future)
- **The Stare:** 30+ second stalemate, pupils dilate, no blinking
- **Love Confession:** Suspicious expression, 2s pause, "That's concerning"
- **Heart Eyes:** 0.1% chance, brief heart shapes, immediate suspicious recovery
- **Monday Morning:** Automatic opener, heavy sigh, "My condolences"

---

## 🏗️ Architecture

### Backend Structure

```
backend/
├── server.js              # Main Express server entry point
├── routes/
│   └── chat.js           # Chat API endpoints
├── services/
│   └── anthropic.js      # Anthropic Claude API client
├── middleware/
│   ├── rateLimit.js      # Rate limiting middleware
│   └── errorHandler.js   # Error handling
├── config/
│   └── config.js         # Configuration management
├── .env.example          # Environment variables template
├── package.json          # Dependencies
└── README.md            # Backend documentation
```

**Key Features:**
- POST `/api/chat` - Send message, receive Grump response
- System prompt integration from `grumpprompt.md`
- API key security (server-side only)
- Rate limiting per session/IP (100 requests per 15 minutes)
- Request/response logging
- Error handling with appropriate HTTP status codes

### iOS App Structure

```
ios/Grump/
├── GrumpApp.swift                    # App entry point
├── App/                              # App configuration
├── Views/
│   ├── ChatView.swift                # Main chat interface (avatar at top)
│   ├── OnboardingView.swift          # First launch experience
│   └── LaunchSequenceView.swift      # Enhanced 1800ms launch animation
├── Models/
│   ├── Message.swift                 # Message model
│   ├── ChatSession.swift             # Session model
│   ├── AnimationState.swift          # Animation state model (16 expressions)
│   ├── ExpressionConfig.swift        # Expression definitions
│   └── BlinkType.swift               # Blink type enum
├── Services/
│   ├── APIClient.swift               # Backend API client
│   ├── ChatService.swift             # Chat orchestration
│   ├── AnimationService.swift        # Animation state management
│   ├── HapticService.swift           # Haptic feedback manager
│   ├── ContextAwarenessService.swift  # Message analysis, time-based triggers
│   ├── SoundService.swift            # Audio system
│   ├── EasterEggService.swift        # Easter egg detection
│   └── PerlinNoise.swift             # Perlin noise for micro-movements
├── Storage/
│   └── ChatStore.swift               # SwiftData store manager
├── Components/
│   ├── GrumpAvatarView.swift         # Advanced animated avatar (15-layer system)
│   ├── EnhancedFaceRigView.swift  # Sophisticated face rigging component
│   ├── TechGridView.swift            # Diagonal grid pattern with animation
│   ├── EyeRigView.swift              # Eye component with deformable states
│   ├── PupilTrackingView.swift       # Real-time pupil tracking
│   ├── MoodGlowView.swift            # Mood ring glow effect (inner/outer)
│   ├── EnhancedMouthView.swift       # Mouth component with 12 shapes
│   ├── PartyHatView.swift            # Accessory views
│   ├── MessageBubbleView.swift       # Enhanced with slam animation
│   ├── TypingIndicatorView.swift     # Enhanced typing indicator
│   ├── InputBarView.swift            # Message input component
│   ├── ParticleSystemView.swift      # Particle effects manager
│   └── EyeRollAnimation.swift        # Eye roll animation component
├── Resources/
│   ├── Colors.swift                  # Design system colors
│   └── AnimationConstants.swift      # Animation timing and curves
└── Utilities/
    ├── DeviceSize.swift              # Responsive avatar scaling
    ├── ReducedMotion.swift           # Accessibility support
    └── PerformanceOptimizer.swift    # Performance budgets and optimization
```

**Key Features:**
- Dark theme UI matching PRD color palette (#0A0A0A background, #FF6B6B accent)
- **Avatar always visible** at top of screen (responsive sizing)
- **15-layer face rig** with exact specifications from Animation Bible
- **16 core expressions** with precise component states
- **Advanced pupil tracking** - real-time text cursor following
- **6 blink types** with expression-specific timing
- **Breathing system** with expression-modified parameters
- **Micro-movement layer** using Perlin noise
- **Context awareness** - message analysis, time-based, session tracking
- **Particle effects library** - Sleep Zs, confetti, steam, etc.
- **Full 360° eye roll** animation
- **Enhanced launch sequence** - 1800ms detailed reveal
- **Message slam animations** with screen shake
- **Character-by-character typing** with mood-based speed
- **Easter eggs** - 3AM mode, birthday, shake to wake, etc.
- **Performance optimized** - 120fps target, GPU acceleration
- **Accessibility** - Reduced motion support, responsive scaling

### Web Client Structure

```
web/
├── src/
│   ├── components/          # React components
│   │   ├── ChatView.tsx     # Main chat interface
│   │   ├── GrumpAvatar.tsx  # Animated avatar
│   │   ├── MessageBubble.tsx
│   │   ├── InputBar.tsx
│   │   └── TypingIndicator.tsx
│   ├── store/               # State management
│   │   ├── ChatStore.tsx    # Chat state
│   │   └── AnimationStore.tsx # Animation state
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── electron/                # Electron wrapper
│   ├── main.js              # Electron main process
│   └── preload.js           # Preload script
├── package.json
├── vite.config.ts
└── README.md
```

**Key Features:**
- React 18 + TypeScript
- Framer Motion for animations
- Electron wrapper for Windows native app
- **Syncs with iOS via shared backend API**
- Responsive design
- Character-by-character message reveal
- Animated Grump avatar with expressions
- Same Grump personality as iOS

---

## ⚙️ Configuration

### Backend Environment Variables

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

### iOS Configuration

- API base URL (configurable for dev/prod)
- Bundle identifier
- Minimum iOS version: 16.0
- Animation performance mode (120fps target for ProMotion displays)
- Reduced motion detection (respects system setting)

---

## 🎯 Performance Targets

**120fps Target (ProMotion Displays):**
- Frame Budget: 8.33ms per frame
- Animation Calculation: <2ms
- Render: <4ms
- Buffer: 2.33ms
- Maximum animated layers: 12 simultaneously
- Maximum particles: 30 on-screen

**Optimization Strategies:**
- Pre-compute keyframes for complex animations
- GPU-accelerated properties (transform, opacity, scale)
- Particle pooling system
- Pause off-screen animations
- Efficient SwiftUI view updates
- Lazy loading for chat history
- Optimized drawing paths

---

## ♿ Accessibility

**Reduced Motion Support:**
- Disables: Eye rolls, screen shake, message slam, particles, bounce/spring, micro-movements, tech grid
- Simplifies: Blinks instant, expression crossfades (200ms), static glow, minimal breathing (1%)
- Keeps: Static expressions, color changes, pupil tracking, basic transitions

**Responsive Design:**
- iPhone SE: 100pt avatar
- iPhone 14: 120pt avatar
- iPhone 14 Pro Max: 140pt avatar
- iPad: 160pt avatar
- Minimum 40pt: Simplified version (removes tech grid, outer glow, eyelids)

---

## 🧪 Testing

### Backend Testing
- API endpoint testing
- Rate limit validation
- Error handling verification

### iOS Testing
- UI component testing
- Data persistence validation
- Animation performance testing
- Frame rate validation
- State transition testing
- Expression accuracy
- Haptic feedback testing
- Context awareness accuracy
- Reduced motion mode testing
- Responsive scaling validation

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

**Error Responses:**
- `400 Bad Request` - Invalid request body
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## 🎨 Design System

**Colors:**
- Background: `#0A0A0A`
- Surface: `#1A1A1A`
- Border: `#333333`
- Accent: `#FF6B6B`
- Text Primary: `#E0E0E0`
- Text Secondary: `#888888`
- User Bubble: `#2A2A2A`

**Typography:**
- System Font: SF Pro (native iOS font)

**Avatar:**
- 15-layer rigged face with exact specifications
- Mood glow ring
- Tech grid pattern
- Responsive scaling

---

## 🚧 Future Enhancements

- Chat history management UI
- Search conversations
- Export/share functionality
- Push notifications (Daily Grump)
- Premium features infrastructure
- Lock screen widget
- Home screen widget
- Voice input/output
- Advanced expression customization
- User expression preferences
- Multi-language support
- Cloud sync
- Advanced analytics

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

**"You want me to do EXPRESSIONS now? Fine. I'll be over here. Emoting. Whatever."** — Grump
