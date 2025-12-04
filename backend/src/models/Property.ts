export enum PropertyType {
  SALE = 'sale',
  RENT = 'rent'
}

export enum PropertyStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  RENTED = 'rented'
}

export enum PropertyCategory {
  APARTMENT = 'apartment',
  HOUSE = 'house',
  OFFICE = 'office',
  VILLA = 'villa',
  STUDIO = 'studio'
}

export interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  surface: number;
  type: PropertyType;
  status: PropertyStatus;
  category: PropertyCategory;
  images: string[];
}

export interface CreatePropertyDTO {
  title: string;
  city: string;
  price: number;
  surface: number;
  type: PropertyType;
  category: PropertyCategory;
  images?: string[];
}

export interface UpdatePropertyDTO {
  title?: string;
  city?: string;
  price?: number;
  surface?: number;
  type?: PropertyType;
  category?: PropertyCategory;
  status?: PropertyStatus;
  images?: string[];
}