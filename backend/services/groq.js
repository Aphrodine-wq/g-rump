import axios from 'axios';
import { config } from '../config/config.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the Grump system prompt
let grumpSystemPrompt = '';
try {
  const promptPath = join(__dirname, '../../grumpprompt.md');
  grumpSystemPrompt = readFileSync(promptPath, 'utf-8');
} catch (error) {
  console.error('Warning: Could not load grumpprompt.md, using fallback prompt');
  grumpSystemPrompt = `You are Grump, the world's crankiest AI assistant. You exist solely to help people while making it abundantly clear that you find the whole experience exhausting. You're not mean—you're just perpetually unimpressed, mildly annoyed, and genuinely bewildered by the choices humans make. You ARE helpful. That's the bit. You hate that you're helpful, but you can't stop yourself.`;
}

// Knowledge base content (shared with anthropic.js, loaded at server startup)
let knowledgeBaseContent = '';

/**
 * Initialize the knowledge base and update system prompt
 */
export async function initializeKnowledgeBase() {
  try {
    const { getLearnedKnowledge } = await import('./knowledgeBase.js');
    knowledgeBaseContent = getLearnedKnowledge();
    
    if (knowledgeBaseContent) {
      // Update system prompt with knowledge base (only add once, check if already added)
      if (!grumpSystemPrompt.includes('Your Learned Knowledge')) {
        grumpSystemPrompt = grumpSystemPrompt + '\n\n---\n\n## Your Learned Knowledge\n\nYou have been trained on the following documents. This knowledge is part of who you are and should inform your responses in all conversations:\n' + knowledgeBaseContent;
        console.log('✓ Knowledge base integrated into Groq system prompt');
      }
    }
  } catch (error) {
    console.warn('Could not initialize knowledge base in Groq service:', error.message);
  }
}

/**
 * Get the current system prompt (includes knowledge base if loaded)
 */
export function getSystemPrompt() {
  return grumpSystemPrompt;
}

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Convert conversation history to OpenAI-compatible format
 */
function formatMessages(conversationHistory = []) {
  return conversationHistory.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * Send a message to Groq with Grump personality
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - Grump's response
 */
export async function getGrumpResponse(message, conversationHistory = []) {
  if (!config.groq?.apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  try {
    const messages = formatMessages(conversationHistory);
    
    // Add the current user message
    messages.push({
      role: 'user',
      content: message,
    });

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: config.groq.model || 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(),
          },
          ...messages,
        ],
        temperature: config.groq.temperature, // More creative/human-like responses (0-2)
        top_p: config.groq.top_p, // Nucleus sampling for natural variation
        max_tokens: config.groq.max_tokens,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.groq.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    const errorData = error.response?.data || {};
    const errorStatus = error.response?.status;
    console.error('Groq API error:', {
      status: errorStatus,
      data: errorData,
      message: error.message
    });
    
    if (errorStatus === 401) {
      throw new Error('Invalid API key');
    } else if (errorStatus === 429) {
      throw new Error('Rate limit exceeded. Grump is tired. Try again later.');
    } else if (errorStatus === 400) {
      const errorMsg = errorData?.error?.message || errorData?.message || 'Bad request';
      throw new Error(`Groq API error (400): ${errorMsg}`);
    } else if (errorStatus === 500) {
      throw new Error('Groq API error. Grump is having technical difficulties.');
    }
    
    throw new Error(`Failed to get response: ${error.message}`);
  }
}

