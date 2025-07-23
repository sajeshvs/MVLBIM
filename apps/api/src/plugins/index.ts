import { FastifyInstance } from 'fastify';

export async function registerPlugins(fastify: FastifyInstance) {
  // CORS
  await fastify.register(require('@fastify/cors'), {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : true,
    credentials: true,
  });

  // Security headers
  await fastify.register(require('@fastify/helmet'), {
    contentSecurityPolicy: false,
  });

  // Rate limiting
  await fastify.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  // JWT
  await fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });

  // Multipart (file uploads)
  await fastify.register(require('@fastify/multipart'), {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: 50 * 1024 * 1024, // 50MB
      files: 5,
    },
  });

  // Swagger documentation
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'Construction Cost Platform API',
        description: 'API for construction cost management and project control',
        version: '1.0.0',
      },
      host: 'localhost:3001',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'projects', description: 'Project management endpoints' },
        { name: 'costs', description: 'Cost management endpoints' },
        { name: 'tasks', description: 'Task management endpoints' },
      ],
    },
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
  });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}
