import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      temperature: parseFloat(process.env.ANTHROPIC_TEMPERATURE || '0.9'), // Claude temperature (0-1), higher = more creative/human-like
      max_tokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '256'), // Fully optimized: reduced to 256 tokens to save ~40% on output costs
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.1-70b-versatile',
      temperature: parseFloat(process.env.GROQ_TEMPERATURE || '0.9'), // Higher = more creative/human-like (0-2)
      top_p: parseFloat(process.env.GROQ_TOP_P || '0.95'), // Nucleus sampling for more natural responses
      max_tokens: parseInt(process.env.GROQ_MAX_TOKENS || '256'), // Fully optimized: reduced to 256 tokens to save output costs
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

