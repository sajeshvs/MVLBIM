import { FastifyInstance } from 'fastify';

export async function registerRoutes(fastify: FastifyInstance) {
  // API prefix
  await fastify.register(async function (fastify) {
    // Auth routes
    // await fastify.register(authRoutes, { prefix: '/auth' });
    
    // Project routes
    // await fastify.register(projectRoutes, { prefix: '/projects' });
    
    // Cost routes  
    // await fastify.register(costRoutes, { prefix: '/cost-items' });
    
    // Task routes
    // await fastify.register(taskRoutes, { prefix: '/tasks' });
    
    // Dashboard routes
    // await fastify.register(dashboardRoutes, { prefix: '/dashboard' });

    // Placeholder route
    fastify.get('/', async () => {
      return { 
        message: 'Construction Cost Platform API',
        version: '1.0.0',
        docs: '/docs'
      };
    });
  }, { prefix: '/api' });
}
