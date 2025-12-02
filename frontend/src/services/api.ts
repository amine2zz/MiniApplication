import axios from 'axios';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../types/Property';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyApi = {
  // Récupérer toutes les propriétés
  getAll: async (): Promise<Property[]> => {
    const response = await api.get<Property[]>('/items');
    return response.data;
  },

  // Récupérer une propriété par ID
  getById: async (id: string): Promise<Property> => {
    const response = await api.get<Property>(`/items/${id}`);
    return response.data;
  },

  // Créer une nouvelle propriété
  create: async (property: CreatePropertyDTO): Promise<Property> => {
    const response = await api.post<Property>('/items', property);
    return response.data;
  },

  // Mettre à jour une propriété
  update: async (id: string, property: UpdatePropertyDTO): Promise<Property> => {
    const response = await api.put<Property>(`/items/${id}`, property);
    return response.data;
  },

  // Supprimer une propriété
  delete: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },
};

export default api;