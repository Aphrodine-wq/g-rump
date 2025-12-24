# Backend Integration Guide

## How to Add G-Rump AI Routes to Existing Backend

This guide shows how to integrate G-Rump AI animation routes into the existing backend **without breaking anything**.

## Current Backend Structure

```
backend/
├── server.js              # Main Express server
├── routes/
│   ├── chat.js            # Existing: Chat API
│   └── knowledge.js        # Existing: Knowledge base API
├── services/
│   ├── anthropic.js       # Existing: AI provider
│   └── groq.js            # Existing: AI provider
└── middleware/
    ├── errorHandler.js    # Existing: Error handling
    └── rateLimit.js       # Existing: Rate limiting
```

## Integration Steps

### Step 1: Copy Animation Routes

Copy the animation routes to the existing backend:

```bash
# Copy routes
cp grump-ai/backend/routes/animation.js backend/routes/animation.js

# Copy service
cp grump-ai/backend/services/animationService.js backend/services/animationService.js
```

### Step 2: Update server.js

Add the animation routes to `backend/server.js`:

```javascript
// backend/server.js

import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import chatRoutes from './routes/chat.js';
import knowledgeRoutes from './routes/knowledge.js';
import animationRoutes from './routes/animation.js'; // NEW
import { errorHandler } from './middleware/errorHandler.js';

// ... existing code ...

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/animation', animationRoutes); // NEW - no breaking changes

// ... rest of existing code ...
```

### Step 3: Install Dependencies

Add any new dependencies to `backend/package.json`:

```json
{
  "dependencies": {
    // ... existing dependencies ...
    "uuid": "^9.0.0"  // NEW: For animation IDs
  }
}
```

Then run:
```bash
cd backend
npm install
```

## Verification

### Test Existing Endpoints (Should Still Work)

```bash
# Chat endpoint (existing)
curl http://localhost:3000/api/chat -X POST -H "Content-Type: application/json" -d '{"message": "Hello"}'

# Knowledge endpoint (existing)
curl http://localhost:3000/api/knowledge

# Health check (existing)
curl http://localhost:3000/health
```

### Test New Endpoints

```bash
# Animation creation (new)
curl http://localhost:3000/api/animation/create -X POST -H "Content-Type: application/json" -d '{"prompt": "bouncing ball", "format": "gif"}'

# Animation history (new)
curl http://localhost:3000/api/animation/history
```

## Backward Compatibility Checklist

✅ **All existing routes work**: `/api/chat`, `/api/knowledge`, `/health`  
✅ **No breaking changes**: Existing API contracts unchanged  
✅ **New routes are additive**: `/api/animation/*` added, nothing removed  
✅ **Shared middleware**: Reuses error handling, rate limiting  
✅ **Same server**: Single Express instance, no separate server needed  

## Optional: Environment Variables

Add animation-specific config to `backend/.env` (optional):

```env
# Animation settings (optional)
ANIMATION_STORAGE_PATH=./storage/animations
ANIMATION_MAX_SIZE_MB=50
ANIMATION_EXPORT_TIMEOUT_MS=30000
```

## Development Workflow

1. **Start existing backend**: `npm run start:backend`
2. **Test existing features**: Verify chat/knowledge still work
3. **Test new features**: Try animation endpoints
4. **Deploy**: Deploy as single service (both old and new routes)

## Troubleshooting

### Routes Not Found
- Check that `animationRoutes` is imported and added to `app.use()`
- Verify file paths are correct

### Service Errors
- Check that `animationService.js` is in correct location
- Verify dependencies are installed

### Compiler Not Found
- G-Rump compiler is still in development
- Animation service will work with placeholder until compiler is ready

---

**Key Point**: This is an **additive change**. Nothing is removed or modified in existing code.

