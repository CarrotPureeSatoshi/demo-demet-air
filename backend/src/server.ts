// Demo Demet Air - Backend Server

import Fastify from 'fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyRateLimit from '@fastify/rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/index.js';
import { connectToMongoDB } from './infrastructure/mongodb/connection.js';

// Repositories
import { ProjectRepository } from './infrastructure/repositories/ProjectRepository.js';
import { LeadRepository } from './infrastructure/repositories/LeadRepository.js';

// Services
import { ProjectService } from './application/services/ProjectService.js';
import { EstimationService } from './application/services/EstimationService.js';
import { GeminiService } from './infrastructure/ai/GeminiService.js';
import { StorageService } from './infrastructure/storage/StorageService.js';

// Routes
import { projectRoutes } from './api/routes/projectRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
  // Connect to MongoDB
  await connectToMongoDB();

  // Initialize Fastify
  const fastify = Fastify({
    logger: config.NODE_ENV === 'development' ? {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    } : true,
  });

  // Register plugins
  await fastify.register(fastifyCors, {
    origin: config.CORS_ORIGIN,
    credentials: true,
  });

  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: config.MAX_FILE_SIZE,
    },
  });

  await fastify.register(fastifyRateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW,
  });

  // Serve uploaded files if using local storage
  if (config.STORAGE_TYPE === 'local') {
    const uploadsPath = path.join(__dirname, '..', config.LOCAL_STORAGE_PATH);

    // Create uploads directory if it doesn't exist
    const fs = await import('fs/promises');
    try {
      await fs.mkdir(uploadsPath, { recursive: true });
      console.log(`✅ Uploads directory created: ${uploadsPath}`);
    } catch (err) {
      console.log(`📁 Uploads directory already exists: ${uploadsPath}`);
    }

    await fastify.register(fastifyStatic, {
      root: uploadsPath,
      prefix: '/uploads/',
    });
  }

  // Initialize services (Dependency Injection)
  const projectRepo = new ProjectRepository();
  const leadRepo = new LeadRepository();
  const geminiService = new GeminiService();
  const estimationService = new EstimationService();
  const storageService = new StorageService();

  const projectService = new ProjectService(
    projectRepo,
    leadRepo,
    geminiService,
    estimationService,
    storageService
  );

  // Register routes
  await projectRoutes(fastify, projectService);

  // Start server
  try {
    await fastify.listen({
      port: config.PORT,
      host: config.HOST,
    });

    console.log(`🚀 Server running on http://${config.HOST}:${config.PORT}`);
    console.log(`📊 Environment: ${config.NODE_ENV}`);
    console.log(`🗄️  Database: ${config.MONGODB_DB_NAME}`);
    console.log(`📦 Storage: ${config.STORAGE_TYPE}`);
    console.log(`🤖 AI: OpenRouter (Gemini 2.0 Flash)`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down gracefully...');
    await fastify.close();
    process.exit(0);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
