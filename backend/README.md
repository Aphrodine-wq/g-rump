# Grump Backend API

Backend server for the Grump platform, providing AI chat functionality via Anthropic Claude or Groq API, with knowledge base integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your AI provider API key to `.env`:

**Option A: Anthropic Claude (default)**
```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_key_here
PORT=3000
NODE_ENV=development
```

**Option B: Groq (faster, cheaper - recommended)**
```
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key_here
GROQ_MODEL=llama-3.1-70b-versatile
PORT=3000
NODE_ENV=development
```

See [`GROQ-SETUP.md`](./GROQ-SETUP.md) for detailed Groq setup instructions.

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/chat

Send a message to Grump and receive a response.

**Request Body:**
```json
{
  "message": "Hello Grump!",
  "conversationHistory": [
    {
      "sender": "user",
      "content": "Previous message",
      "timestamp": "2024-01-01T00:00:00.000Z"
    },
    {
      "sender": "grump",
      "content": "Previous response",
      "timestamp": "2024-01-01T00:00:01.000Z"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Oh good. You're here. What is it.",
  "timestamp": "2024-01-01T00:00:02.000Z"
}
```

### GET /api/knowledge

Get information about the knowledge base (PDF learning system).

**Response:**
```json
{
  "totalDocuments": 5,
  "totalPages": 120,
  "lastLoaded": "2024-01-01T00:00:00.000Z",
  "documents": [
    {
      "filename": "example.pdf",
      "pages": 24,
      "size": 1024000
    }
  ]
}
```

### POST /api/knowledge/reload

Reload the knowledge base (useful after adding/removing PDFs in `docs/knowledge-base/`).

**Response:**
```json
{
  "success": true,
  "message": "Knowledge base reloaded successfully. You may need to restart the server for full effect.",
  "summary": {
    "totalDocuments": 5,
    "totalPages": 120
  }
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

## Environment Variables

**Required (choose one provider):**

- `AI_PROVIDER` (optional) - AI provider: `anthropic` or `groq` (default: `groq` if `GROQ_API_KEY` exists, else `anthropic`)
- `ANTHROPIC_API_KEY` (required if using Anthropic) - Your Anthropic Claude API key
- `GROQ_API_KEY` (required if using Groq) - Your Groq API key

**Optional:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment: development or production (default: development)
- `CORS_ORIGIN` - CORS allowed origins, comma-separated, or * for all (default: *)
- `GROQ_MODEL` - Groq model name (default: `llama-3.1-70b-versatile`)
- `ANTHROPIC_TEMPERATURE` - Claude temperature 0-1 (default: 0.9)
- `GROQ_TEMPERATURE` - Groq temperature 0-2 (default: 0.9)
- `ANTHROPIC_MAX_TOKENS` - Max tokens for Claude (default: 256)
- `GROQ_MAX_TOKENS` - Max tokens for Groq (default: 256)
- `KNOWLEDGE_BASE_URLS` - Comma-separated list of remote PDF URLs (for hosting PDFs online instead of bundling with deployment)
- `KNOWLEDGE_BASE_GITHUB_FOLDER` - GitHub folder URL to automatically discover all PDFs (e.g., `https://github.com/user/repo/tree/main/pdfs`)
- `KNOWLEDGE_BASE_MAX_TOTAL_CHARS` - Max total characters from all PDFs (default: 15000)
- `KNOWLEDGE_BASE_MAX_CHARS_PER_PDF` - Max characters per PDF (default: 750)

**Provider Switching:**

To switch between providers, set `AI_PROVIDER` in your `.env`:
- `AI_PROVIDER=anthropic` - Use Anthropic Claude
- `AI_PROVIDER=groq` - Use Groq

See [`GROQ-SETUP.md`](./GROQ-SETUP.md) for more details.

## Rate Limiting

The chat endpoint is rate-limited to 100 requests per 15 minutes per IP address.

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (invalid input)
- `429` - Too many requests (rate limited)
- `500` - Internal server error

Error responses follow this format:
```json
{
  "error": {
    "message": "Error description"
  }
}
```

