import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../models/Property';

export interface IPropertyService {
  getAllProperties(): Property[];
  getPropertyById(id: string): Property | undefined;
  createProperty(propertyData: CreatePropertyDTO): Property;
  updateProperty(id: string, propertyData: UpdatePropertyDTO): Property | null;
  deleteProperty(id: string): boolean;
}