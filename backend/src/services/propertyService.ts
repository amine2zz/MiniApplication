import { Property, CreatePropertyDTO, UpdatePropertyDTO, PropertyType, PropertyStatus, PropertyCategory } from '../models/Property';
import { IPropertyService } from '../interfaces/IPropertyService';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

class PropertyService implements IPropertyService {
  private dataPath = path.join(__dirname, '../data/properties.json');

  private loadProperties(): Property[] {
    try {
      const data = fs.readFileSync(this.dataPath, 'utf8');
      const properties = JSON.parse(data);
      
      // Migrate properties to include images array if not present
      return properties.map((property: any) => ({
        ...property,
        images: property.images || []
      }));
    } catch {
      return [];
    }
  }

  private saveProperties(properties: Property[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(properties, null, 2));
  }

  private isTitleUnique(title: string, excludeId?: string): boolean {
    const properties = this.loadProperties();
    return !properties.some(property => 
      property.title.toLowerCase() === title.toLowerCase() && 
      property.id !== excludeId
    );
  }

  getAllProperties(): Property[] {
    return this.loadProperties();
  }


  getPropertyById(id: string): Property | undefined {
    const properties = this.loadProperties();
    return properties.find(property => property.id === id);
  }

  createProperty(propertyData: CreatePropertyDTO): Property {
    if (!this.isTitleUnique(propertyData.title)) {
      throw new Error(`Une propriété avec le titre "${propertyData.title}" existe déjà`);
    }

    const properties = this.loadProperties();
    const newProperty: Property = {
      id: uuidv4(),
      ...propertyData,
      status: PropertyStatus.AVAILABLE,
      images: propertyData.images || []
    };
    properties.push(newProperty);
    this.saveProperties(properties);
    return newProperty;
  }

  updateProperty(id: string, propertyData: UpdatePropertyDTO): Property | null {
    const properties = this.loadProperties();
    const propertyIndex = properties.findIndex(property => property.id === id);
    if (propertyIndex === -1) {
      return null;
    }

    // Vérifier l'unicité du titre si le titre est modifié
    if (propertyData.title && !this.isTitleUnique(propertyData.title, id)) {
      throw new Error(`Une propriété avec le titre "${propertyData.title}" existe déjà`);
    }

    properties[propertyIndex] = {
      ...properties[propertyIndex],
      ...propertyData
    };

    this.saveProperties(properties);
    return properties[propertyIndex];
  }

  deleteProperty(id: string): boolean {
    const properties = this.loadProperties();
    const propertyIndex = properties.findIndex(property => property.id === id);
    if (propertyIndex === -1) {
      return false;
    }

    properties.splice(propertyIndex, 1);
    this.saveProperties(properties);
    return true;
  }
}

export const propertyService = new PropertyService();