import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../models/Property';
import { v4 as uuidv4 } from 'uuid';

class PropertyService {
  private properties: Property[] = [
    {
      id: '1',
      title: 'Appartement moderne centre-ville',
      city: 'Paris',
      price: 450000,
      surface: 65
    },
    {
      id: '2',
      title: 'Maison avec jardin',
      city: 'Lyon',
      price: 320000,
      surface: 120
    },
    {
      id: '3',
      title: 'Studio lumineux',
      city: 'Marseille',
      price: 180000,
      surface: 35
    },
    {
      id: '4',
      title: 'Villa avec piscine',
      city: 'Nice',
      price: 850000,
      surface: 200
    },
    {
      id: '5',
      title: 'Loft industriel',
      city: 'Bordeaux',
      price: 280000,
      surface: 90
    },
    {
      id: '6',
      title: 'Duplex avec terrasse',
      city: 'Toulouse',
      price: 380000,
      surface: 110
    },
    {
      id: '7',
      title: 'Penthouse vue mer',
      city: 'Cannes',
      price: 1200000,
      surface: 150
    },
    {
      id: '8',
      title: 'Maison de ville',
      city: 'Lille',
      price: 250000,
      surface: 95
    }
  ];

  getAllProperties(): Property[] {
    return this.properties;
  }

  getPropertyById(id: string): Property | undefined {
    return this.properties.find(property => property.id === id);
  }

  createProperty(propertyData: CreatePropertyDTO): Property {
    const newProperty: Property = {
      id: uuidv4(),
      ...propertyData
    };
    this.properties.push(newProperty);
    return newProperty;
  }

  updateProperty(id: string, propertyData: UpdatePropertyDTO): Property | null {
    const propertyIndex = this.properties.findIndex(property => property.id === id);
    if (propertyIndex === -1) {
      return null;
    }

    this.properties[propertyIndex] = {
      ...this.properties[propertyIndex],
      ...propertyData
    };

    return this.properties[propertyIndex];
  }

  deleteProperty(id: string): boolean {
    const propertyIndex = this.properties.findIndex(property => property.id === id);
    if (propertyIndex === -1) {
      return false;
    }

    this.properties.splice(propertyIndex, 1);
    return true;
  }
}

export const propertyService = new PropertyService();