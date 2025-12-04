import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import { propertyRoutes } from './routes/propertyRoutes';
import * as path from 'path';

const fastify = Fastify({
  logger: true
});

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    });

    // Register multipart for file uploads
    await fastify.register(multipart);

    // Register static file serving for uploads
    await fastify.register(staticFiles, {
      root: path.join(__dirname, '../uploads'),
      prefix: '/uploads/',
    });

    // Enregistrement des routes
    await fastify.register(propertyRoutes);

    // Démarrage du serveur
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();