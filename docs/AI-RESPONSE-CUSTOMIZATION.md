# AI Response Customization Guide

This guide explains how to make Grump's responses more human-like and customize the AI behavior.

## Current Configuration

The system now supports configurable AI parameters that affect response quality and human-likeness.

### Location
- Configuration: `backend/config/config.js`
- Services: `backend/services/groq.js` and `backend/services/anthropic.js`

---

## Understanding AI Parameters

### Temperature

Controls randomness/creativity in responses:
- **Lower (0.0-0.5)**: More focused, deterministic, consistent
- **Medium (0.6-0.8)**: Balanced creativity and consistency
- **Higher (0.9-2.0)**: More creative, varied, human-like, but less predictable

**Current Default**: 0.9 (more human-like)

### Top-P (Nucleus Sampling)

Controls diversity by considering only tokens with cumulative probability up to P:
- **Lower (0.5-0.8)**: More focused responses
- **Higher (0.9-1.0)**: More diverse, natural responses

**Current Default**: 0.95 (very natural)

**Note**: Only available for Groq, not Anthropic.

### Max Tokens

Maximum length of response:
- **Lower (256-512)**: Shorter, more concise responses
- **Medium (1024)**: Balanced length
- **Higher (2048+)**: Longer, more detailed responses

**Current Default**: 1024

---

## How to Adjust Settings

### Via Environment Variables

Create or update `.env` in the `backend/` directory:

```env
# Groq Configuration
GROQ_TEMPERATURE=0.9        # 0.0-2.0 (higher = more human-like)
GROQ_TOP_P=0.95            # 0.0-1.0 (higher = more natural variation)
GROQ_MAX_TOKENS=1024       # Response length limit

# Anthropic Configuration
ANTHROPIC_TEMPERATURE=0.9   # 0.0-1.0 (higher = more human-like)
ANTHROPIC_MAX_TOKENS=1024  # Response length limit
```

### Restart Required

After changing environment variables, restart the backend server:

```bash
cd backend
npm start
```

---

## Recommended Settings for Different Use Cases

### Maximum Human-Likeness
```env
GROQ_TEMPERATURE=1.2
GROQ_TOP_P=0.97
GROQ_MAX_TOKENS=2048

ANTHROPIC_TEMPERATURE=1.0
ANTHROPIC_MAX_TOKENS=2048
```

**Result**: Very creative, varied responses that feel more human, but less predictable.

### Balanced (Recommended)
```env
GROQ_TEMPERATURE=0.9
GROQ_TOP_P=0.95
GROQ_MAX_TOKENS=1024

ANTHROPIC_TEMPERATURE=0.9
ANTHROPIC_MAX_TOKENS=1024
```

**Result**: Good balance between human-like variety and consistency.

### More Consistent (Less Varied)
```env
GROQ_TEMPERATURE=0.7
GROQ_TOP_P=0.85
GROQ_MAX_TOKENS=512

ANTHROPIC_TEMPERATURE=0.7
ANTHROPIC_MAX_TOKENS=512
```

**Result**: More predictable responses, less variation.

---

## Advanced Customization

### Modifying the System Prompt

Edit `grumpprompt.md` to adjust Grump's personality and response style:

```markdown
## Voice & Tone Guidelines

- Add more casual language patterns
- Include more varied sentence structures
- Add more rhetorical questions
- Include more trailing thoughts...
```

### Adding Response Post-Processing

You can add post-processing in the service files to make responses feel more natural:

```javascript
// In groq.js or anthropic.js, after getting response:
function humanizeResponse(text) {
  // Add slight variations
  // Add natural pauses
  // Add conversational fillers (if appropriate for Grump)
  return text;
}

return humanizeResponse(response.data.choices[0].message.content);
```

### Dynamic Temperature Based on Context

You could adjust temperature based on conversation context:

```javascript
// Example: Higher temperature for casual conversations
const temperature = message.includes('?') && message.length < 50 
  ? 1.1  // More creative for short questions
  : 0.9; // Default for longer/complex queries
```

---

## Testing Your Changes

1. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Test with different settings**:
   - Send the same message multiple times with different temperatures
   - Compare response variety and quality
   - Adjust until you find the sweet spot

3. **Monitor logs**:
   - Check console for any errors
   - Verify temperature values are being used correctly

---

## Troubleshooting

### Responses are too random/incoherent
- **Solution**: Lower temperature (try 0.7-0.8)
- **Also check**: Ensure top_p isn't too high (try 0.9)

### Responses are too repetitive
- **Solution**: Increase temperature (try 1.0-1.2)
- **Also check**: Increase top_p (try 0.95-0.97)

### Responses are too short
- **Solution**: Increase max_tokens (try 2048)

### Responses are too long/rambling
- **Solution**: Decrease max_tokens (try 512-768)
- **Also check**: Lower temperature slightly

---

## Best Practices

1. **Start with defaults** (0.9 temperature) and adjust incrementally
2. **Test with real conversations** before deploying changes
3. **Document your settings** in your .env.example file
4. **Consider A/B testing** different settings with users
5. **Monitor response quality** over time and adjust as needed

---

## Current Implementation Details

### Groq Service
- Uses `temperature`, `top_p`, and `max_tokens`
- More granular control available
- Typically faster responses

### Anthropic Service
- Uses `temperature` and `max_tokens`
- No top_p parameter (uses its own sampling)
- Often higher quality responses

---

## Related Files

- `backend/config/config.js` - Configuration loading
- `backend/services/groq.js` - Groq implementation
- `backend/services/anthropic.js` - Anthropic implementation
- `grumpprompt.md` - Personality and style guidelines

---

## Next Steps

- Experiment with different temperature values
- Monitor user feedback on response quality
- Consider implementing dynamic temperature based on context
- Add response caching for consistency when needed
- Implement response quality metrics
