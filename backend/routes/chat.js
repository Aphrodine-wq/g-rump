import express from 'express';
import { getGrumpResponse } from '../services/anthropic.js';
import { chatRateLimiter } from '../middleware/rateLimit.js';
import { getRelevantPDFContent, createPDFContextMessage, listPDFs } from '../services/pdfService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Send a message and receive Grump's response
 * 
 * Body:
 * {
 *   message: string,
 *   conversationHistory?: Array<{sender: 'user' | 'grump', content: string, timestamp?: string}>
 * }
 * 
 * Response:
 * {
 *   response: string,
 *   timestamp: string
 * }
 */
router.post('/', chatRateLimiter, async (req, res, next) => {
  try {
    const { message, conversationHistory } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: {
          message: 'Message is required and must be a non-empty string',
        },
      });
    }

    // Validate conversation history format if provided
    if (conversationHistory && !Array.isArray(conversationHistory)) {
      return res.status(400).json({
        error: {
          message: 'conversationHistory must be an array',
        },
      });
    }

    // Check if user is asking about PDFs and add PDF context
    let enhancedMessage = message;
    const pdfContent = await getRelevantPDFContent(message);
    if (pdfContent) {
      enhancedMessage = message + createPDFContextMessage(pdfContent);
    }

    // Fully optimized: Limit conversation history to last 5 messages to maximize cost savings (~40-50% reduction)
    const MAX_HISTORY_MESSAGES = parseInt(process.env.MAX_CONVERSATION_HISTORY || '5');
    const limitedHistory = (conversationHistory || []).slice(-MAX_HISTORY_MESSAGES);

    // Get Grump's response
    const response = await getGrumpResponse(enhancedMessage, limitedHistory);

    // Return response with timestamp
    res.json({
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/pdfs
 * List available PDF files
 */
router.get('/pdfs', async (req, res) => {
  try {
    const pdfs = listPDFs();
    res.json({ pdfs });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to list PDFs' } });
  }
});

export default router;

