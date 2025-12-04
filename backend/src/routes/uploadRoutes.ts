import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const pump = promisify(pipeline);

export async function uploadRoutes(fastify: FastifyInstance) {
  // POST /upload - Upload image file
  fastify.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();
      
      if (!data) {
        return reply.code(400).send({ error: 'Aucun fichier fourni' });
      }

      // Check if file is an image
      if (!data.mimetype.startsWith('image/')) {
        return reply.code(400).send({ error: 'Le fichier doit être une image' });
      }

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${data.mimetype.split('/')[1]}`;
      const filepath = path.join(__dirname, '../../uploads', filename);

      // Save file to uploads directory
      await pump(data.file, fs.createWriteStream(filepath));

      // Return the URL path for the uploaded file
      const fileUrl = `/uploads/${filename}`;
      
      return reply.code(200).send({ 
        success: true, 
        url: fileUrl,
        filename: filename
      });
      
    } catch (error: any) {
      console.error('Upload error:', error);
      return reply.code(500).send({ error: 'Erreur lors de l\'upload du fichier' });
    }
  });
}