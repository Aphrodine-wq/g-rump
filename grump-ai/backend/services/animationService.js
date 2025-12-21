// Animation service for G-Rump AI
// Uses G-Rump compiler as the engine
// NOTE: Using CommonJS for now - matches Node.js patterns

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AnimationService {
  constructor() {
    this.compilerPath = path.join(__dirname, '../../grump-compiler');
    this.animationsDir = path.join(__dirname, '../../storage/animations');
    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.animationsDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create animations directory:', error);
    }
  }

  /**
   * Create animation from natural language prompt
   * Uses AI to generate G-Rump code, then compiles it
   */
  async createAnimation({ prompt, style, format, userId, tier = 'free' }) {
    const animationId = uuidv4();
    
    // Step 1: Use AI to generate G-Rump language code (with tier-based model selection)
    const grumpCode = await this.generateGrumpCode(prompt, style, userId, tier);
    
    // Step 2: Compile G-Rump code using compiler
    const compiledCode = await this.compileGrumpCode(grumpCode);
    
    // Step 3: Render animation
    const preview = await this.renderAnimation(compiledCode, format);
    
    // Step 4: Save animation
    const animation = {
      id: animationId,
      userId,
      prompt,
      style,
      format,
      code: grumpCode,
      compiledCode,
      preview,
      status: 'completed',
      createdAt: new Date(),
    };
    
    await this.saveAnimation(animation);
    
    return animation;
  }

  /**
   * Generate G-Rump language code from natural language
   * Uses existing AI service (Groq/Anthropic) with G-Rump personality
   * AND the existing knowledge base (animation principles, G-Rump language spec, etc.)
   * Includes caching and tier-based AI model selection
   */
  async generateGrumpCode(prompt, style, userId, tier = 'free') {
    try {
      // Check cache first
      const { getCachedAnimation, cacheAnimation } = await import('../../backend/services/animationCache.js');
      const cached = getCachedAnimation(prompt, style, 'gif');
      if (cached) {
        console.log(`[Cache Hit] Animation for prompt: ${prompt.substring(0, 50)}...`);
        return cached.code;
      }
      
      // Get tier-specific AI model
      const { TIERS } = await import('../../backend/services/usageService.js');
      const tierConfig = TIERS[tier.toUpperCase()] || TIERS.FREE;
      const aiModel = tierConfig.features?.aiModel || 'gemma-7b-it';
      
      // Import AI service - use Groq for cost efficiency
      const { getGrumpResponse } = await import('../../backend/services/groq.js');
      
      // Temporarily override model for this request (if Groq supports it)
      // Note: This requires updating groq.js to accept model parameter
      
      // The AI service already has:
      // 1. G-Rump personality (from grumpprompt.md)
      // 2. Knowledge base (from docs/knowledge-base/) including:
      //    - Animation principles
      //    - G-Rump language specification
      //    - Game development languages
      //    - CSS animation libraries
      //    - All other knowledge base content
      
      // Create specialized prompt for animation generation
      const animationPrompt = `The user wants to create an animation. They said: "${prompt}"

Generate G-Rump language code for this animation. Use your knowledge of:
- Animation principles (squash and stretch, anticipation, etc.)
- G-Rump language syntax
- Best practices for the requested style: ${style || 'default'}

Return ONLY valid G-Rump code wrapped in \`\`\`grump code blocks. The code should be production-ready.`;

      // Use existing AI service (which includes knowledge base)
      const response = await getGrumpResponse(animationPrompt, []);
      
      // Extract code from response (AI might add commentary)
      const codeMatch = response.match(/```grump\n([\s\S]*?)\n```/) || 
                       response.match(/```\n([\s\S]*?)\n```/);
      
      let code;
      if (codeMatch) {
        code = codeMatch[1].trim();
      } else {
        // If no code block found, try to extract any code-like content
        code = response.trim();
      }
      
      // Cache the result
      cacheAnimation(prompt, style, 'gif', { code, timestamp: Date.now() });
      
      return code;
    } catch (error) {
      console.error('Error generating G-Rump code:', error);
      // Fallback to example code
      return `
@app "Generated Animation"
@fps 60

scene Animation {
    // Generated from: "${prompt}"
    // Style: ${style || 'default'}
    
    Sprite("element.png") {
        animate {
            position: (0, 0) -> (100, 100)
            scale: 1.0 -> 1.5 -> 1.0
            rotation: 0deg -> 360deg
        } duration: 2s, ease: expo.out
    }
}
    `.trim();
  }

  /**
   * Compile G-Rump code using the compiler
   */
  async compileGrumpCode(grumpCode) {
    return new Promise((resolve, reject) => {
      // Write code to temp file
      const tempFile = path.join(this.animationsDir, `temp_${Date.now()}.grump`);
      
      fs.writeFile(tempFile, grumpCode)
        .then(() => {
          // Call G-Rump compiler
          // TODO: Once compiler is ready, use it here
          // For now, return the code as-is
          resolve(grumpCode);
        })
        .catch(reject);
    });
  }

  /**
   * Render animation to preview
   */
  async renderAnimation(compiledCode, format) {
    // TODO: Use G-Rump runtime to render animation
    // For now, return placeholder
    return {
      url: '/api/animation/preview/placeholder',
      format: format || 'gif',
    };
  }

  /**
   * Export animation to specified format
   */
  async exportAnimation(animationId, format, userId, options = {}) {
    const animation = await this.getAnimation(animationId, userId);
    
    if (!animation) {
      throw new Error('Animation not found');
    }
    
    // For code format, return the G-Rump code directly
    if (format === 'code' || format === 'grump_code') {
      return {
        format: 'code',
        code: animation.code,
        downloadUrl: `data:text/plain;charset=utf-8,${encodeURIComponent(animation.code)}`,
        size: Buffer.from(animation.code).length,
      };
    }
    
    // TODO: Implement actual export for other formats
    // - GIF: Use canvas rendering
    // - MP4: Use ffmpeg
    // - Lottie: Convert to Lottie JSON
    // - Sprite sheet: Generate sprite sheet
    
    // For now, return placeholder URLs
    const exportUrl = `/api/animation/export/${animationId}.${format}`;
    
    return {
      format,
      url: exportUrl,
      downloadUrl: exportUrl,
      size: 0, // TODO: Calculate actual size
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };
  }

  /**
   * Get animation by ID
   */
  async getAnimation(animationId, userId) {
    try {
      const filePath = path.join(this.animationsDir, `${animationId}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const animation = JSON.parse(data);
      
      // Check if user has access (for now, allow all - add auth later)
      if (userId && animation.userId !== userId && animation.userId !== 'anonymous') {
        return null;
      }
      
      return animation;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null; // File doesn't exist
      }
      console.error('Error loading animation:', error);
      return null;
    }
  }

  /**
   * Save animation
   */
  async saveAnimation(animation) {
    const filePath = path.join(this.animationsDir, `${animation.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(animation, null, 2));
  }

  /**
   * Get user's animation history
   */
  async getHistory(userId, limit = 20, offset = 0) {
    try {
      const files = await fs.readdir(this.animationsDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      // Load all animations
      const animations = await Promise.all(
        jsonFiles.map(async (file) => {
          try {
            const filePath = path.join(this.animationsDir, file);
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data);
          } catch (error) {
            console.error(`Error loading animation file ${file}:`, error);
            return null;
          }
        })
      );
      
      // Filter by userId and sort by date
      const userAnimations = animations
        .filter(anim => anim && (!userId || anim.userId === userId || anim.userId === 'anonymous'))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(offset, offset + limit);
      
      return userAnimations;
    } catch (error) {
      console.error('Error loading animation history:', error);
      return [];
    }
  }
}

export default new AnimationService();

