import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.85'), // Slightly lower for consistency in expert domains
      max_tokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '200'), // Tight limit: 200 tokens (~120 words). Grump doesn't ramble.
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
      temperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.85'), // Slightly lower for consistency
      top_p: parseFloat(process.env.GROQ_TOP_P || '0.9'), // Slightly tighter sampling for punchier responses
      max_tokens: parseInt(process.env.GROQ_MAX_TOKENS || '200'), // Tight limit: 200 tokens to keep Grump concise
    },
  // Use AI_PROVIDER env var if set, otherwise default to Groq if key exists, else Anthropic
  aiProvider: process.env.AI_PROVIDER || (process.env.GROQ_API_KEY ? 'groq' : 'anthropic'),
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  },
};

// Validate required configuration
if (config.aiProvider === 'groq' && !config.groq.apiKey) {
  console.warn('Warning: GROQ_API_KEY is not set but Groq is selected as provider.');
} else if (config.aiProvider === 'anthropic' && !config.anthropic.apiKey) {
  console.warn('Warning: ANTHROPIC_API_KEY is not set but Anthropic is selected as provider.');
}

