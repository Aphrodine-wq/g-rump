# G-Rump AI Integration Guide

## How G-Rump AI Integrates with Existing Platform

G-Rump AI is built **on top of** the existing Grump Platform, reusing infrastructure and extending capabilities.

## Shared Components

### 1. Backend API (`backend/`)
- **Reuses**: Express server, authentication, rate limiting, error handling
- **Extends**: New routes for animation generation
- **Location**: Routes added to existing `backend/routes/`

### 2. Character System
- **Reuses**: Existing Grump character animations (15-layer face rig)
- **Extends**: Additional emotional states for animation creation
- **Location**: Uses existing `ios/Grump/Components/` and `web/src/components/`

### 3. AI Service (SAME KNOWLEDGE BASE)
- **Reuses**: Existing Groq/Anthropic integration
- **Reuses**: **THE EXACT SAME** knowledge base system
- **How it works**: 
  - Animation service calls `getGrumpResponse()` from existing AI service
  - That service already includes knowledge base in system prompt
  - G-Rump AI automatically has access to ALL knowledge base content:
    - Animation principles (12 principles of animation)
    - G-Rump language specification
    - Game development languages
    - CSS animation libraries
    - All other knowledge base documents
- **Location**: Uses existing `backend/services/anthropic.js` or `backend/services/groq.js`

### 4. Knowledge Base (FULLY INTEGRATED)
- **Reuses**: **THE EXACT SAME** knowledge base system
- **No changes needed**: G-Rump AI automatically uses all knowledge base content
- **Location**: Uses existing `docs/knowledge-base/` and `backend/services/knowledgeBase.js`
- **How it works**: Knowledge base is loaded into AI system prompt at startup, so G-Rump AI has full access

## New Components

### 1. G-Rump Language Compiler (`grump-compiler/`)
- **Purpose**: Powers animation generation
- **Status**: In development (~35% complete)
- **Integration**: Backend calls compiler to generate animations

### 2. G-Rump AI Frontend (`grump-ai/frontend/`)
- **Purpose**: Web interface for animation creation
- **Tech**: Next.js, React
- **Integration**: Calls extended backend API

### 3. Animation Export Pipeline
- **Purpose**: Export animations to various formats
- **Location**: `backend/services/export/`
- **Formats**: GIF, MP4, Lottie, sprite sheets, code

## API Endpoints (Extended)

### Existing Endpoints (Unchanged)
- `POST /api/chat` - Chat with Grump
- `GET /api/knowledge` - Knowledge base info
- `POST /api/knowledge/reload` - Reload knowledge base

### New Endpoints (Added)
- `POST /api/animation/create` - Create animation from natural language
- `GET /api/animation/:id` - Get animation by ID
- `POST /api/animation/:id/export` - Export animation
- `GET /api/animation/history` - Get user's animation history

## Development Workflow

### Running Both Products

```bash
# Start existing Grump Platform
npm run start:all

# Start G-Rump AI (separate)
cd grump-ai/frontend
npm run dev
```

### Backend Extension

```javascript
// backend/routes/animation.js (NEW)
const express = require('express');
const router = express.Router();
const animationService = require('../services/animationService');

router.post('/create', async (req, res) => {
  // Uses existing auth middleware
  // Calls G-Rump compiler
  // Returns animation
});

module.exports = router;
```

### Frontend Integration

```typescript
// grump-ai/frontend/src/components/GrumpCharacter.tsx
// Uses THE SAME character component that's already on the page
import { GrumpAvatar } from '../../../web/src/components/GrumpAvatar';

// Same character, just with additional context states
const states = {
  ...existingStates, // All existing states (idle, thinking, annoyed, etc.)
  creating: 'Creating animation...', // New state for animation creation
  proud: 'Nailed it. Obviously.', // New state when animation is complete
};
```

## Testing Strategy

1. **Existing tests**: All pass (backward compatibility)
2. **New tests**: Test new endpoints in isolation
3. **Integration tests**: Test new features with existing features

## Deployment

- **Existing platform**: Deploy as before
- **G-Rump AI**: Deploy as separate service (can share infrastructure)
- **Backend**: Single deployment with both sets of routes

---

**Key Principle**: Extend, don't replace. Everything that works continues to work.

