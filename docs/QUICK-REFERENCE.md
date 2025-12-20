# Quick Reference Guide

Quick lookup for common tasks, commands, and configurations in the Grump platform.

---

## 🚀 Common Commands

### Backend
```bash
# Start backend server
cd backend
npm start

# Start with auto-reload (development)
npm run dev

# Install dependencies
npm install
```

### Web Client
```bash
# Start development server
cd web
npm run dev

# Build for production
npm run build
```

### iOS
```bash
# Open in Xcode
open ios/Grump.xcodeproj

# Build for device (in Xcode)
Product → Archive
```

---

## 🔑 Configuration Files

### Backend Environment Variables
**File:** `backend/.env`
```env
# AI Provider
AI_PROVIDER=groq  # or 'anthropic'

# API Keys
ANTHROPIC_API_KEY=your_key_here
GROQ_API_KEY=your_key_here

# Server
PORT=3000
NODE_ENV=development

# Limits (optional)
KNOWLEDGE_BASE_MAX_TOTAL_CHARS=25000
KNOWLEDGE_BASE_MAX_CHARS_PER_PDF=1000
MAX_CONVERSATION_HISTORY=8
ANTHROPIC_MAX_TOKENS=384
GROQ_MAX_TOKENS=384
```

### Web Client Environment Variables
**File:** `web/.env`
```env
VITE_API_URL=http://localhost:3000
```

---

## 📍 Key File Locations

### Backend
- **Main server:** `backend/server.js`
- **API routes:** `backend/routes/chat.js`
- **AI services:** `backend/services/anthropic.js`, `backend/services/groq.js`
- **PDF services:** `backend/services/pdfService.js`
- **Knowledge base:** `backend/services/knowledgeBase.js`
- **Config:** `backend/config/config.js`

### Web Client
- **Main app:** `web/src/App.tsx`
- **Chat view:** `web/src/components/ChatView.tsx`
- **Settings:** `web/src/components/SettingsView.tsx`
- **Pricing:** `web/src/components/PricingView.tsx`
- **Payment:** `web/src/components/PaymentView.tsx`
- **Pricing config:** `web/src/config/pricing.ts`

### iOS
- **Main app:** `ios/Grump/GrumpApp.swift`
- **Chat view:** `ios/Grump/Views/ChatView.swift`
- **Settings:** `ios/Grump/Views/SettingsView.swift`
- **Subscriptions:** `ios/Grump/Views/SubscriptionView.swift`
- **StoreKit service:** `ios/Grump/Services/StoreKitService.swift`
- **Config:** `ios/Grump/Info.plist`

---

## 💰 Pricing Tiers

| Tier | Price | Messages/Month | Features |
|------|-------|----------------|----------|
| Free | $0 | 25 | Basic features |
| Basic | $9.99 | 100 | Full knowledge base |
| Pro | $19.99 | 300 | Priority support |
| Premium | $39.99 | 1,000 | All features + Early access |

---

## 🔧 API Endpoints

### Chat
- **POST** `/api/chat` - Send message and get response
  ```json
  {
    "message": "Hello Grump!",
    "conversationHistory": [...]
  }
  ```

### Knowledge Base
- **GET** `/api/knowledge` - Get knowledge base status
- **POST** `/api/knowledge/reload` - Reload knowledge base

### PDFs
- **GET** `/api/pdfs` - List available PDFs

---

## 📄 PDF Systems

### Knowledge Base (Permanent Learning)
- **Location:** `docs/knowledge-base/`
- **Purpose:** AI learns from these PDFs permanently
- **Reload:** `POST /api/knowledge/reload` or restart server
- **Limit:** 25,000 total chars, 1,000 per PDF (configurable)

### PDF Analysis (Contextual)
- **Location:** `docs/pdfs/`
- **Purpose:** PDFs analyzed when mentioned in conversation
- **Auto-detection:** Mentions PDF names automatically
- **Limit:** None (analyzed on-demand)

---

## 🛠️ Troubleshooting

### Backend won't start
- Check if port 3000 is in use
- Verify `.env` file exists and has API keys
- Check Node.js version (18+ required)

### Products not loading (iOS)
- Verify product IDs match App Store Connect
- Check bundle identifier is correct
- Use sandbox test account for testing

### Knowledge base not loading
- Check PDF files exist in `docs/knowledge-base/`
- Verify file permissions
- Check console logs for errors
- Adjust `KNOWLEDGE_BASE_MAX_TOTAL_CHARS` if needed

---

## 📱 App Store Connect

### Product IDs Format
```
com.yourname.grump.basic.monthly
com.yourname.grump.pro.monthly
com.yourname.grump.premium.monthly
```

### Required Items
- Privacy Policy URL
- Subscription products configured
- App icons (1024x1024)
- Screenshots for required sizes
- Export compliance information

---

## 🎨 Customization

### AI Personality
**File:** `grumpprompt.md`
- Edit system prompt
- Adjust personality traits
- Add custom instructions

### Pricing
**Web:** `web/src/config/pricing.ts`
**iOS:** `ios/Grump/Services/StoreKitService.swift`

### Knowledge Base Limits
**Environment Variables:**
- `KNOWLEDGE_BASE_MAX_TOTAL_CHARS` - Total character limit
- `KNOWLEDGE_BASE_MAX_CHARS_PER_PDF` - Per-PDF limit

---

## 📚 Documentation Links

- [Full Documentation Index](README.md)
- [Apple Compliance](APPLE_COMPLIANCE.md)
- [StoreKit Setup](STOREKIT_SETUP.md)
- [Privacy Policy Setup](PRIVACY_POLICY_SETUP.md)
- [Knowledge Base Guide](knowledge-base/README.md)
- [PDF Analysis Guide](PDF-ANALYSIS-GUIDE.md)

---

**Last Updated:** Current as of latest implementation
