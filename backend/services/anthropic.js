import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config/config.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getGrumpResponse as getGroqResponse } from './groq.js';

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

// Knowledge base content (loaded at server startup)
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
        console.log('✓ Knowledge base integrated into Anthropic system prompt');
      }
    }
  } catch (error) {
    console.warn('Could not initialize knowledge base in Anthropic service:', error.message);
  }
}

/**
 * Get the current system prompt (includes knowledge base if loaded)
 */
export function getSystemPrompt() {
  return grumpSystemPrompt;
}

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

/**
 * Convert conversation history to Anthropic message format
 */
function formatMessages(conversationHistory = []) {
  return conversationHistory.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * Send a message to Claude with Grump personality (Anthropic implementation)
 */
async function getAnthropicResponse(message, conversationHistory = []) {
  if (!config.anthropic.apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  try {
    const messages = formatMessages(conversationHistory);
    
    // Add the current user message
    messages.push({
      role: 'user',
      content: message,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: config.anthropic.max_tokens,
      temperature: config.anthropic.temperature, // More human-like variability (0-1)
      system: getSystemPrompt(),
      messages: messages,
    });

    // Extract text content from response
    const textContent = response.content.find(
      (block) => block.type === 'text'
    );

    if (!textContent || !textContent.text) {
      throw new Error('No text content in Claude response');
    }

    return textContent.text;
  } catch (error) {
    console.error('Anthropic API error:', error);
    
    if (error.status === 401) {
      throw new Error('Invalid API key');
    } else if (error.status === 429) {
      throw new Error('Rate limit exceeded. Grump is tired. Try again later.');
    } else if (error.status === 500) {
      throw new Error('Anthropic API error. Grump is having technical difficulties.');
    }
    
    throw new Error(`Failed to get response: ${error.message}`);
  }
}

/**
 * Main function that routes to the appropriate provider
 * @param {string} message - User's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - Grump's response
 */
export async function getGrumpResponse(message, conversationHistory = []) {
  // Route to the appropriate provider based on config
  if (config.aiProvider === 'groq') {
    return getGroqResponse(message, conversationHistory);
  } else {
    return getAnthropicResponse(message, conversationHistory);
  }
}

