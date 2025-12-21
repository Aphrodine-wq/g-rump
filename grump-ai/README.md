# 🐸 G-Rump AI - The Animated AI Character

**"The Grumpy AI That Animates Your Ideas"**

This is the main product - an animated AI chatbot that creates animations from natural language.

## Architecture

```
grump-ai/
├── frontend/          # React/Next.js web app
│   ├── components/
│   │   ├── GrumpCharacter/    # Animated G-Rump character
│   │   ├── ChatInterface/     # Chat UI
│   │   ├── AnimationPreview/  # Preview canvas
│   │   └── ExportTools/       # Export buttons
│   ├── pages/
│   └── lib/
│
├── backend/           # Node.js/Python API
│   ├── api/          # REST endpoints
│   ├── ai/           # LLM integration + personality
│   ├── animation/    # Animation generation
│   ├── export/       # Export pipeline
│   └── billing/      # Stripe integration
│
├── grump-compiler/   # The language compiler (used as engine)
│
└── infrastructure/   # Deployment configs
    ├── docker/
    └── k8s/
```

## Quick Start

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev

# The G-Rump character will come alive! 🐸
```

## Features

- ✅ **Same Animated Character**: Uses the exact same G-Rump character already on the page
- ✅ **Full Knowledge Base**: Automatically uses all knowledge base content (animation principles, language spec, etc.)
- ✅ Natural language animation creation
- ✅ Multiple export formats (GIF, MP4, Lottie, sprite sheets, code)
- ✅ G-Rump's grumpy personality (same as chat)
- 🚧 User authentication
- 🚧 Billing integration
- 🚧 Animation history
- 🚧 Team collaboration

## Important Notes

### Same Character
G-Rump AI uses **the exact same animated character** that's already on your page:
- Web: `web/src/components/GrumpAvatar.tsx`
- iOS: `ios/Grump/Components/GrumpAvatarView.swift`
- Same 15-layer face rig, 16 expressions, all animations

### Full Knowledge Base Access
G-Rump AI automatically has access to the entire knowledge base:
- Animation principles (12 principles of animation)
- G-Rump language specification
- Game development languages
- CSS animation libraries
- All documents in `docs/knowledge-base/`

See [KNOWLEDGE-BASE-INTEGRATION.md](KNOWLEDGE-BASE-INTEGRATION.md) for details.

## Development Status

**Phase**: MVP Development
**Timeline**: 2-3 months to beta

---

*G-Rump says: "We're building something that doesn't suck. Finally."*

