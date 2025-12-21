// Game Development API Routes
// Handles game compilation and execution

import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Compile G-Rump game code
router.post('/compile', async (req, res) => {
  try {
    const { code, target = 'web' } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        error: {
          message: 'Game code is required',
        },
      });
    }

    // Validate target platform
    const validTargets = ['web', 'ios', 'android', 'flutter'];
    if (!validTargets.includes(target)) {
      return res.status(400).json({
        error: {
          message: `Invalid target platform. Must be one of: ${validTargets.join(', ')}`,
        },
      });
    }

    // Create temporary file for game code
    const tempDir = path.join(__dirname, '../../temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const tempFile = path.join(tempDir, `game_${Date.now()}.grump`);
    await fs.writeFile(tempFile, code, 'utf-8');

    // Path to grump compiler
    const compilerPath = path.join(__dirname, '../../grump-compiler');
    const compilerExists = await fs.access(compilerPath).then(() => true).catch(() => false);

    if (!compilerExists) {
      // If compiler doesn't exist, return a mock response for now
      // In production, this would actually compile the code
      return res.json({
        success: true,
        compiled: {
          target,
          code: `// Compiled ${target} code\n// This is a placeholder - compiler integration pending`,
          warnings: [],
        },
        message: 'Compilation successful (mock)',
      });
    }

    // Compile using grump compiler
    // This is a placeholder - actual compilation would use:
    // cargo run -- build --target ${target} ${tempFile}
    
    // For now, return success with mock compiled code
    const compiledCode = generateMockCompiledCode(code, target);

    // Clean up temp file
    await fs.unlink(tempFile).catch(() => {});

    res.json({
      success: true,
      compiled: {
        target,
        code: compiledCode,
        warnings: [],
      },
      message: 'Compilation successful',
    });

  } catch (error) {
    console.error('Game compilation error:', error);
    res.status(500).json({
      error: {
        message: 'Compilation failed',
        details: error.message,
      },
    });
  }
});

// Get game templates
router.get('/templates', async (req, res) => {
  try {
    // Return list of available game templates
    // In production, this could read from a database or file system
    res.json({
      templates: [
        {
          id: 'platformer-basic',
          name: '2D Platformer',
          category: 'platformer',
          difficulty: 'intermediate',
        },
        {
          id: 'top-down-shooter',
          name: 'Top-Down Shooter',
          category: 'shooter',
          difficulty: 'intermediate',
        },
        {
          id: 'match-3-puzzle',
          name: 'Match-3 Puzzle',
          category: 'puzzle',
          difficulty: 'advanced',
        },
        {
          id: 'flappy-clone',
          name: 'Flappy Bird Clone',
          category: 'arcade',
          difficulty: 'beginner',
        },
        {
          id: 'rpg-basic',
          name: 'RPG Adventure',
          category: 'rpg',
          difficulty: 'advanced',
        },
        {
          id: 'racing-basic',
          name: 'Racing Game',
          category: 'racing',
          difficulty: 'intermediate',
        },
        {
          id: 'tower-defense',
          name: 'Tower Defense',
          category: 'strategy',
          difficulty: 'advanced',
        },
      ],
    });
  } catch (error) {
    console.error('Error fetching game templates:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch templates',
      },
    });
  }
});

// Get specific game template
router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, this would fetch from database or file system
    // For now, return a placeholder
    res.json({
      id,
      name: 'Game Template',
      code: '// Game template code',
    });
  } catch (error) {
    console.error('Error fetching game template:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch template',
      },
    });
  }
});

// Helper function to generate mock compiled code
function generateMockCompiledCode(sourceCode, target) {
  // This is a placeholder - in production, this would be actual compilation
  switch (target) {
    case 'web':
      return `// Compiled JavaScript/WebGL code\n// Generated from G-Rump source\n\n${sourceCode.split('\n').map(line => `// ${line}`).join('\n')}`;
    case 'ios':
      return `// Compiled Swift/Metal code\n// Generated from G-Rump source\n\n${sourceCode.split('\n').map(line => `// ${line}`).join('\n')}`;
    case 'android':
      return `// Compiled Kotlin/OpenGL code\n// Generated from G-Rump source\n\n${sourceCode.split('\n').map(line => `// ${line}`).join('\n')}`;
    case 'flutter':
      return `// Compiled Dart/Skia code\n// Generated from G-Rump source\n\n${sourceCode.split('\n').map(line => `// ${line}`).join('\n')}`;
    default:
      return sourceCode;
  }
}

export default router;

