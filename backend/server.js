import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import chatRoutes from './routes/chat.js';
import knowledgeRoutes from './routes/knowledge.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin === '*' ? true : config.cors.origin.split(','),
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (development only)
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'grump-backend' });
});

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Not found. Grump is not impressed.',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize knowledge base and start server
const PORT = config.port;

async function startServer() {
  // Load knowledge base and initialize in AI services before starting server
  try {
    console.log('Loading knowledge base...');
    
    // Load knowledge base content
    const knowledgeService = await import('./services/knowledgeBase.js');
    await knowledgeService.loadKnowledgeBase();
    
    // Initialize in both AI services to update their system prompts
    const anthropicService = await import('./services/anthropic.js');
    await anthropicService.initializeKnowledgeBase();
    
    const groqService = await import('./services/groq.js');
    await groqService.initializeKnowledgeBase();
    
    console.log('✓ Knowledge base initialization complete');
  } catch (error) {
    console.warn('⚠️  Could not initialize knowledge base:', error.message);
  }
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Grump backend server running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
    if (!config.anthropic.apiKey && config.aiProvider === 'anthropic') {
      console.warn('⚠️  Warning: ANTHROPIC_API_KEY is not set');
    }
    if (!config.groq?.apiKey && config.aiProvider === 'groq') {
      console.warn('⚠️  Warning: GROQ_API_KEY is not set');
    }
  });
}

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

