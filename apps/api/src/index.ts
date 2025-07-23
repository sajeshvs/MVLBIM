import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';

const prisma = new PrismaClient();

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  // Register plugins
  await registerPlugins(fastify);

  // Register routes
  await registerRoutes(fastify);

  // Prisma instance for dependency injection
  fastify.decorate('prisma', prisma);

  return fastify;
}

async function start() {
  try {
    const server = await buildServer();
    
    const port = Number(process.env.API_PORT) || 3001;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    
    console.log(`🚀 API Server is running on http://${host}:${port}`);
    console.log(`📚 API Documentation available at http://${host}:${port}/docs`);
    
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

if (require.main === module) {
  start();
}

export { buildServer };
