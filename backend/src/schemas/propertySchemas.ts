import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  city: z.string().min(1, 'La ville est requise'),
  price: z.number().positive('Le prix doit être positif'),
  surface: z.number().positive('La surface doit être positive')
});

export const updatePropertySchema = z.object({
  title: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  surface: z.number().positive().optional()
});

export const propertyParamsSchema = z.object({
  id: z.string().min(1, 'ID requis')
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyParams = z.infer<typeof propertyParamsSchema>;