// Animation generation routes for G-Rump AI
// Extends existing backend without breaking changes
// NOTE: This uses CommonJS for now - will be converted to ES modules to match backend

import express from 'express';
import animationService from '../services/animationService.js';
// TODO: Import auth middleware when available
// import { authenticate } from '../../backend/middleware/auth.js';
// import rateLimit from '../../backend/middleware/rateLimit.js';

const router = express.Router();

/**
 * POST /api/animation/create
 * Create an animation from natural language description
 */
// TODO: Add authenticate and rateLimit middleware when available
router.post('/create', async (req, res) => {
  try {
    const { prompt, style, format } = req.body;
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }
    
    // TODO: Get userId from auth middleware
    const userId = req.user?.id || 'anonymous';
    
    // Generate animation using G-Rump compiler
    const animation = await animationService.createAnimation({
      prompt: prompt.trim(),
      style: style || 'default',
      format: format || 'gif',
      userId,
    });
    
    res.json({
      success: true,
      animation: {
        id: animation.id,
        preview: animation.preview?.url || animation.preview,
        code: animation.code, // G-Rump language code
        status: animation.status,
        prompt: animation.prompt,
        style: animation.style,
        format: animation.format,
        createdAt: animation.createdAt,
      },
    });
  } catch (error) {
    console.error('Animation creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create animation',
    });
  }
});

/**
 * GET /api/animation/:id
 * Get animation by ID
 */
// TODO: Add authenticate middleware
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'anonymous';
    
    const animation = await animationService.getAnimation(id, userId);
    
    if (!animation) {
      return res.status(404).json({
        success: false,
        error: 'Animation not found',
      });
    }
    
    res.json({
      success: true,
      animation,
    });
  } catch (error) {
    console.error('Get animation error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/animation/:id/export
 * Export animation to specified format
 */
// TODO: Add authenticate middleware
router.post('/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const { format, resolution, quality, loop, background, watermark } = req.body;
    const userId = req.user?.id || 'anonymous';
    
    const exportData = await animationService.exportAnimation(id, format, userId, {
      resolution,
      quality,
      loop,
      background,
      watermark,
    });
    
    res.json({
      success: true,
      export: exportData,
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/animation/history
 * Get user's animation history
 */
// TODO: Add authenticate middleware
router.get('/history', async (req, res) => {
  try {
    const userId = req.user?.id || 'anonymous';
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    const history = await animationService.getHistory(userId, limit, offset);
    
    res.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

