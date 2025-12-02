export interface Property {
  id: string;
  title: string;
  city: string;
  price: number;
  surface: number;
}

export interface CreatePropertyDTO {
  title: string;
  city: string;
  price: number;
  surface: number;
}

export interface UpdatePropertyDTO {
  title?: string;
  city?: string;
  price?: number;
  surface?: number;
}