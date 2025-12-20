import express from 'express';
import { getKnowledgeBaseSummary, loadKnowledgeBase } from '../services/knowledgeBase.js';

const router = express.Router();

/**
 * GET /api/knowledge
 * Get information about the knowledge base
 */
router.get('/', async (req, res) => {
  try {
    const summary = getKnowledgeBaseSummary();
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to get knowledge base info' } });
  }
});

/**
 * POST /api/knowledge/reload
 * Reload the knowledge base (useful after adding/removing PDFs)
 * Note: Requires server restart for full effect
 */
router.post('/reload', async (req, res) => {
  try {
    await loadKnowledgeBase();
    
    // Reinitialize in both AI services
    const anthropicService = await import('../services/anthropic.js');
    await anthropicService.initializeKnowledgeBase();
    
    const groqService = await import('../services/groq.js');
    await groqService.initializeKnowledgeBase();
    
    res.json({ 
      success: true, 
      message: 'Knowledge base reloaded successfully. You may need to restart the server for full effect.',
      summary: getKnowledgeBaseSummary()
    });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to reload knowledge base: ' + error.message } });
  }
});

export default router;
