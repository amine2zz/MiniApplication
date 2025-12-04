import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IPropertyService } from '../interfaces/IPropertyService';
import { propertyService } from '../services/propertyService';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { 
  createPropertySchema, 
  updatePropertySchema, 
  propertyParamsSchema,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyParams
} from '../schemas/propertySchemas';

const pump = promisify(pipeline);

export async function propertyRoutes(fastify: FastifyInstance) {
  // GET /items - Récupérer toutes les propriétés
  fastify.get('/items', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const properties = propertyService.getAllProperties();
      return reply.code(200).send(properties);
    } catch (error: any) {
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

  // GET /items/:id - Récupérer une propriété par ID
  fastify.get<{ Params: PropertyParams }>('/items/:id', async (request: FastifyRequest<{ Params: PropertyParams }>, reply: FastifyReply) => {
    try {
      const { id } = propertyParamsSchema.parse(request.params);
      const property = propertyService.getPropertyById(id);
      
      if (!property) {
        return reply.code(404).send({ error: 'Propriété non trouvée' });
      }
      
      return reply.code(200).send(property);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Données invalides', details: error.errors });
      }
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

  // POST /items - Créer une nouvelle propriété
  fastify.post<{ Body: CreatePropertyInput }>('/items', async (request: FastifyRequest<{ Body: CreatePropertyInput }>, reply: FastifyReply) => {
    try {
      const propertyData = createPropertySchema.parse(request.body);
      const newProperty = propertyService.createProperty(propertyData);
      return reply.code(201).send(newProperty);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Données invalides', details: error.errors });
      }
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

  // PUT /items/:id - Mettre à jour une propriété
  fastify.put<{ Params: PropertyParams; Body: UpdatePropertyInput }>('/items/:id', async (request: FastifyRequest<{ Params: PropertyParams; Body: UpdatePropertyInput }>, reply: FastifyReply) => {
    try {
      const { id } = propertyParamsSchema.parse(request.params);
      const propertyData = updatePropertySchema.parse(request.body);
      
      const updatedProperty = propertyService.updateProperty(id, propertyData);
      
      if (!updatedProperty) {
        return reply.code(404).send({ error: 'Propriété non trouvée' });
      }
      
      return reply.code(200).send(updatedProperty);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Données invalides', details: error.errors });
      }
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

  // DELETE /items/:id - Supprimer une propriété
  fastify.delete<{ Params: PropertyParams }>('/items/:id', async (request: FastifyRequest<{ Params: PropertyParams }>, reply: FastifyReply) => {
    try {
      const { id } = propertyParamsSchema.parse(request.params);
      const deleted = propertyService.deleteProperty(id);
      
      if (!deleted) {
        return reply.code(404).send({ error: 'Propriété non trouvée' });
      }
      
      return reply.code(204).send();
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Données invalides', details: error.errors });
      }
      return reply.code(500).send({ error: 'Erreur serveur' });
    }
  });

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