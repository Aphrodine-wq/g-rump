# G-Rump Web App Architecture & Rebuild Guide

## 📐 System Architecture Overview

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
```

## 🗂️ File Structure

```
g-rump/
├── web/                          # Frontend React App
│   ├── src/
│   │   ├── App.tsx              # Main app router & view manager
│   │   ├── main.tsx             # React entry point
│   │   ├── index.css            # Global styles
│   │   │
│   │   ├── components/          # React Components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MobileChatView.tsx
│   │   │   ├── GameDevWorkspace.tsx
│   │   │   ├── TemplateGallery.tsx
│   │   │   ├── UserDashboard.tsx
│   │   │   ├── SettingsPage.tsx
│   │   │   ├── PricingPage.tsx
│   │   │   ├── OnboardingFlow.tsx
│   │   │   ├── GrumpAvatar*.tsx
│   │   │   └── animations/      # Animation components
│   │   │
│   │   ├── store/               # State Management (Zustand)
│   │   │   ├── ChatStore.tsx    # Chat messages & sessions
│   │   │   ├── AnimationStore.tsx # Grump avatar state
│   │   │   └── WorkspaceStore.tsx  # Animation workspace
│   │   │
│   │   ├── services/            # API Clients & Services
│   │   │   ├── animationApi.ts  # Animation API client
│   │   │   ├── ContextAwareness.ts
│   │   │   ├── StatsService.ts
│   │   │   └── EasterEggs.ts
│   │   │
│   │   ├── hooks/               # Custom React Hooks
│   │   │   ├── useBlinkSystem.ts
│   │   │   ├── useMicroMovements.ts
│   │   │   └── useToast.ts
│   │   │
│   │   ├── data/                # Static Data
│   │   │   └── gameTemplates.ts
│   │   │
│   │   ├── config/              # Configuration
│   │   │   └── pricing.ts
│   │   │
│   │   └── utils/                # Utilities
│   │       ├── logger.ts
│   │       ├── qrCode.ts
│   │       └── PerlinNoise.ts
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                      # Node.js/Express Backend
│   ├── server.js                 # Express app entry point
│   ├── config/
│   │   └── config.js             # Environment config
│   │
│   ├── routes/                   # API Routes
│   │   ├── chat.js               # POST /api/chat
│   │   ├── game.js               # POST /api/game/compile
│   │   └── knowledge.js          # GET /api/knowledge
│   │
│   ├── services/                 # Business Logic
│   │   ├── anthropic.js          # Anthropic Claude API
│   │   ├── groq.js               # Groq API
│   │   ├── knowledgeBase.js      # PDF knowledge base
│   │   ├── phaserCodegen.js      # Game codegen
│   │   ├── usageService.js       # Usage tracking
│   │   └── animationCache.js     # Animation caching
│   │
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── rateLimit.js
│   │   └── usageLimiter.js
│   │
│   └── package.json
│
└── grump-ai/                    # Animation AI Service
    └── backend/
        └── routes/
            └── animation.js      # POST /api/animation/create
```

## 🔄 Component Hierarchy

```
App.tsx (Root)
│
├── ChatProvider (Context)
│   ├── AnimationProvider (Context)
│   │   ├── WorkspaceProvider (Context)
│   │   │   └── View Router
│   │   │       │
│   │   │       ├── OnboardingFlow
│   │   │       │
│   │   │       ├── LandingPage
│   │   │       │   ├── Header
│   │   │       │   ├── Hero Section
│   │   │       │   ├── Features
│   │   │       │   └── Footer
│   │   │       │
│   │   │       ├── ChatInterface (Desktop)
│   │   │       │   ├── GrumpAvatarWrapper
│   │   │       │   │   └── GrumpAvatar200fps
│   │   │       │   ├── MessageBubble[]
│   │   │       │   ├── TypingIndicator
│   │   │       │   └── InputBar
│   │   │       │
│   │   │       ├── MobileChatView (Mobile)
│   │   │       │   └── (Same as ChatInterface)
│   │   │       │
│   │   │       ├── GameDevWorkspace
│   │   │       │   ├── Code Editor
│   │   │       │   ├── Game Preview (iframe)
│   │   │       │   ├── Entity Browser
│   │   │       │   └── Asset Manager
│   │   │       │
│   │   │       ├── TemplateGallery
│   │   │       │   └── Template Cards[]
│   │   │       │
│   │   │       ├── UserDashboard
│   │   │       │   ├── Usage Stats
│   │   │       │   └── Recent Animations
│   │   │       │
│   │   │       ├── SettingsPage
│   │   │       │
│   │   │       └── PricingPage
│   │   │           └── Pricing Tiers[]
```

## 🔌 API Endpoints

### Backend Routes (`backend/routes/`)

**Chat API** (`/api/chat`)
- `POST /api/chat` - Send message, get Grump response
  - Request: `{ message: string, conversationHistory: Message[] }`
  - Response: `{ response: string, timestamp: string }`

**Game API** (`/api/game`)
- `POST /api/game/compile` - Compile G-Rump code to Phaser HTML
  - Request: `{ code: string, target: 'web'|'ios'|'android'|'flutter' }`
  - Response: `{ success: boolean, compiled: { code: string } }`
- `GET /api/game/templates` - Get game templates list
- `GET /api/game/templates/:id` - Get specific template

**Animation API** (`/api/animation`) - From grump-ai/backend
- `POST /api/animation/create` - Generate animation from prompt
  - Request: `{ prompt: string, style?: string, format?: string }`
  - Response: `{ animation: AnimationData, usage: {...} }`

**Knowledge API** (`/api/knowledge`)
- `GET /api/knowledge` - Get knowledge base status
- `POST /api/knowledge/reload` - Reload knowledge base

## 📊 State Management Flow

```
User Action
    │
    ▼
Component (e.g., ChatInterface)
    │
    ▼
Store Hook (useChat, useAnimation, useWorkspace)
    │
    ├─→ Local State Update (Zustand)
    │
    └─→ API Call (axios)
            │
            ▼
        Backend Service
            │
            ├─→ AI Service (Groq/Anthropic)
            │
            └─→ Response
                    │
                    ▼
                Store Update
                    │
                    ▼
                Component Re-render
```

## 🏗️ Build Process

### Frontend (Web)
```bash
cd web
npm install
npm run dev      # Development (localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

**Build Output:** `web/dist/` (static files)

### Backend
```bash
cd backend
npm install
npm start        # Development (localhost:3000)
```

**Environment Variables:**
- `ANTHROPIC_API_KEY` - Claude API key
- `GROQ_API_KEY` - Groq API key
- `NODE_ENV` - development/production
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed origins

## 🔄 Data Flow Examples

### 1. Chat Message Flow
```
User types message
    ↓
ChatInterface → InputBar
    ↓
useChat().sendMessage()
    ↓
POST /api/chat
    ↓
backend/routes/chat.js
    ↓
backend/services/groq.js (or anthropic.js)
    ↓
AI API (Groq/Anthropic)
    ↓
Response → ChatStore
    ↓
ChatInterface re-renders
    ↓
MessageBubble displays response
```

### 2. Game Compilation Flow
```
User clicks "Run" in GameDevWorkspace
    ↓
handleCompile()
    ↓
POST /api/game/compile { code, target: 'web' }
    ↓
backend/routes/game.js
    ↓
backend/services/phaserCodegen.js
    ↓
generatePhaserGame(code)
    ↓
Returns HTML string
    ↓
GameDevWorkspace sets compiledGameHtml
    ↓
iframe loads blob URL
    ↓
Game plays in preview
```

### 3. Animation Creation Flow
```
User sends animation prompt in chat
    ↓
ChatInterface → animationApi.createAnimation()
    ↓
POST /api/animation/create
    ↓
grump-ai/backend/routes/animation.js
    ↓
usageLimiter middleware (check limits)
    ↓
animationService.createAnimation()
    ↓
AI generates G-Rump code
    ↓
Compile to animation frames
    ↓
Return animation data
    ↓
WorkspaceStore updates
    ↓
GrumpWorkspace displays animation
```

## 🎨 View Routing System

**Current View State:** `App.tsx` manages `currentView` state

**Views:**
- `'onboarding'` → OnboardingFlow
- `'landing'` → LandingPage
- `'chat'` → ChatInterface / MobileChatView
- `'templates'` → TemplateGallery
- `'dashboard'` → UserDashboard
- `'settings'` → SettingsPage
- `'pricing'` → PricingPage
- `'gamedev'` → GameDevWorkspace

**Navigation:** Components call `onNavigate(view)` prop to change views

## 🔐 State Management (Zustand)

**ChatStore** (`store/ChatStore.tsx`)
- `messages: Message[]` - Chat history
- `isTyping: boolean` - Loading state
- `sendMessage()` - Send chat message
- `createNewSession()` - Start new chat

**AnimationStore** (`store/AnimationStore.tsx`)
- `state: AnimationState` - Grump avatar state
- `transitionToState()` - Change avatar state
- `updateEyeTracking()` - Mouse tracking

**WorkspaceStore** (`store/WorkspaceStore.tsx`)
- `state: WorkspaceState` - Animation workspace
- `exportAnimation()` - Export animation

## 🎮 Game Dev System

**Components:**
- `GameDevWorkspace.tsx` - Main workspace
- `gameTemplates.ts` - Template definitions

**Services:**
- `phaserCodegen.js` - G-Rump → Phaser 3 HTML
- Detects game type (Flappy Bird, Platformer, Shooter, Match-3, Racing)
- Generates playable HTML5 games

**Storage:**
- Projects saved to `localStorage` (`g-rump-projects`)
- Auto-save every 30 seconds
- Share via URL parameter

## 🚀 How to Rebuild from Scratch

### 1. Frontend Setup
```bash
# Create React app
npm create vite@latest web -- --template react-ts
cd web

# Install dependencies
npm install react react-dom
npm install axios framer-motion zustand
npm install -D @types/react @types/react-dom typescript vite @vitejs/plugin-react tailwindcss autoprefixer

# Copy src/ directory structure
# Copy components, store, services, etc.
```

### 2. Backend Setup
```bash
# Create Node.js project
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express cors axios
npm install dotenv

# Create structure
mkdir routes services middleware config

# Copy files from existing backend/
```

### 3. Environment Setup
```bash
# Backend .env
ANTHROPIC_API_KEY=your_key
GROQ_API_KEY=your_key
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Frontend .env
VITE_API_URL=http://localhost:3000
```

### 4. Build Order
1. **Backend first** - Start Express server
2. **Frontend second** - Start Vite dev server
3. **Test** - Open http://localhost:5173

## 📦 Key Dependencies

**Frontend:**
- `react` + `react-dom` - UI framework
- `vite` - Build tool
- `axios` - HTTP client
- `framer-motion` - Animations
- `zustand` - State management
- `typescript` - Type safety

**Backend:**
- `express` - Web framework
- `cors` - CORS middleware
- `axios` - HTTP client (for AI APIs)
- `dotenv` - Environment variables

## 🔧 Configuration Files

**Frontend:**
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript config
- `tailwind.config.js` - Tailwind CSS config
- `postcss.config.js` - PostCSS config

**Backend:**
- `backend/config/config.js` - Environment config
- `backend.env` - Environment variables

## 🎯 Key Design Patterns

1. **Provider Pattern** - Context providers for state
2. **Hook Pattern** - Custom hooks for reusable logic
3. **Service Pattern** - API clients as services
4. **Store Pattern** - Zustand stores for global state
5. **Component Composition** - Small, reusable components

## 🐛 Debugging

**Frontend:**
- React DevTools
- Browser console
- Network tab (API calls)

**Backend:**
- Console logs
- Error middleware
- Postman/curl for API testing

## 📝 Next Steps for Improvements

See `IMPROVEMENTS.md` for planned enhancements.

