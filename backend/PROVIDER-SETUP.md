# 🤖 AI Provider Setup Guide

This guide shows you how to safely configure and switch between **Anthropic Claude** and **Groq** providers.

## 🔐 Security First

- ✅ All API keys are stored in `backend/.env` (never committed to git)
- ✅ Keys are loaded from environment variables only
- ✅ Never hardcode API keys in source files
- ✅ Use different keys for development and production

## 📋 Quick Setup

### Step 1: Create Your `.env` File

Copy the example file:
```powershell
cd backend
Copy-Item .env.example .env
```

Or create it manually:
```powershell
cd backend
New-Item -Path .env -ItemType File
```

### Step 2: Choose Your Provider

#### Option A: Use Groq (Recommended - 95% Cheaper)

```env
# AI Provider Configuration
AI_PROVIDER=groq

# Groq API Configuration
# Get your key from: https://console.groq.com/
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

#### Option B: Use Anthropic Claude

```env
# AI Provider Configuration
AI_PROVIDER=anthropic

# Anthropic Claude API Configuration
# Get your key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional Claude Settings
ANTHROPIC_TEMPERATURE=0.9
ANTHROPIC_MAX_TOKENS=256

# Server Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

### Step 3: Get Your API Keys

**Groq:**
1. Visit: https://console.groq.com/
2. Sign in or create account
3. Go to API Keys section
4. Create a new key
5. Copy the key (starts with `gsk_`)

**Anthropic Claude:**
1. Visit: https://console.anthropic.com/
2. Sign in or create account
3. Go to API Keys section
4. Create a new key
5. Copy the key (starts with `sk-ant-api03-`)

### Step 4: Start the Server

```powershell
cd backend
npm start
```

You should see:
```
🚀 Grump backend server running on port 3000
Environment: development
✓ Knowledge base initialization complete
```

## 🔄 Switching Between Providers

To switch providers, just update your `backend/.env` file:

### Switch to Groq:
```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
```

### Switch to Anthropic:
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

**Important:** After changing providers, restart your backend server.

## ⚙️ Configuration Options

### Groq Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | Yes* | - | Your Groq API key |
| `GROQ_MODEL` | No | `llama-3.1-70b-versatile` | Model to use |
| `GROQ_TEMPERATURE` | No | `0.9` | Creativity (0-2) |
| `GROQ_TOP_P` | No | `0.95` | Nucleus sampling |
| `GROQ_MAX_TOKENS` | No | `256` | Max response length |

**Available Groq Models:**
- `llama-3.1-70b-versatile` ⭐ (Best quality)
- `llama-3.1-8b-instant` (Faster)
- `mixtral-8x7b-32768` (Good balance)
- `gemma-7b-it` (Fast, efficient)

### Anthropic Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes* | - | Your Claude API key |
| `ANTHROPIC_TEMPERATURE` | No | `0.9` | Creativity (0-1) |
| `ANTHROPIC_MAX_TOKENS` | No | `256` | Max response length |

*Required when that provider is selected

## 💰 Cost Comparison

| Provider | Cost per Message | Notes |
|----------|------------------|-------|
| **Groq** | ~$0.0002 | 95% cheaper, very fast |
| **Anthropic Claude** | ~$0.003 | Higher quality, more expensive |

**Recommendation:** Use Groq for development and testing, Claude for production if you need the highest quality.

## 🧪 Testing Your Setup

1. **Start the server:**
   ```powershell
   cd backend
   npm start
   ```

2. **Test the API:**
   ```powershell
   curl http://localhost:3000/api/chat -X POST `
     -H "Content-Type: application/json" `
     -d '{\"message\": \"Hello Grump!\"}'
   ```

3. **Check for errors:**
   - ✅ No warnings about missing API keys
   - ✅ Server starts successfully
   - ✅ API responds with Grump's message

## 🚨 Troubleshooting

### "Warning: GROQ_API_KEY is not set"
- Check your `.env` file is in the `backend/` folder
- Verify the key is on the correct line
- Make sure there are no extra spaces around `=`
- Restart the server after making changes

### "Warning: ANTHROPIC_API_KEY is not set"
- Same checks as above
- Make sure `AI_PROVIDER=anthropic` is set

### Provider Not Switching
- Make sure you restarted the server after changing `.env`
- Check that `AI_PROVIDER` is set correctly
- Verify the API key for the selected provider exists

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Keep `.env` file local only (already in `.gitignore`)
- ✅ Use different keys for dev and production
- ✅ Rotate keys if compromised
- ✅ Monitor API usage regularly
- ✅ Restrict key permissions in provider console

### ❌ DON'T:
- ❌ Commit `.env` to git
- ❌ Share API keys in screenshots or messages
- ❌ Hardcode keys in source files
- ❌ Upload `.env` files to public cloud storage
- ❌ Use the same key for multiple projects

## 📝 Complete Example `.env` File

```env
# ============================================
# AI Provider Selection
# ============================================
# Options: 'groq' or 'anthropic'
AI_PROVIDER=groq

# ============================================
# Groq Configuration (if using Groq)
# ============================================
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-70b-versatile
GROQ_TEMPERATURE=0.9
GROQ_MAX_TOKENS=256

# ============================================
# Anthropic Configuration (if using Claude)
# ============================================
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_TEMPERATURE=0.9
ANTHROPIC_MAX_TOKENS=256

# ============================================
# Server Configuration
# ============================================
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

---

**Your API keys are safe!** The `.env` file is in `.gitignore` and will never be committed to your repository.

For more details, see:
- `backend/SECURE-API-KEY-SETUP.md` - Detailed security guide
- `backend/README.md` - Backend documentation

