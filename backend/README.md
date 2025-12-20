# Grump Backend API

Backend server for the Grump iOS app, providing AI chat functionality via Anthropic Claude API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Add your Anthropic API key to `.env`:
```
ANTHROPIC_API_KEY=your_key_here
```

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

- `ANTHROPIC_API_KEY` (required) - Your Anthropic Claude API key
- `PORT` (optional) - Server port (default: 3000)
- `NODE_ENV` (optional) - Environment: development or production (default: development)
- `CORS_ORIGIN` (optional) - CORS allowed origins, comma-separated, or * for all (default: *)

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

