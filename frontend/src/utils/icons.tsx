import React from 'react';
import { PropertyCategory, PropertyStatus } from '../types/Property';

export const getCategoryIcon = (category: PropertyCategory) => {
  const icons = {
    [PropertyCategory.APARTMENT]: <i className="fas fa-city category-icon-blue"></i>,
    [PropertyCategory.HOUSE]: <i className="fas fa-house-user category-icon-blue"></i>,
    [PropertyCategory.OFFICE]: <i className="fas fa-building category-icon-blue"></i>,
    [PropertyCategory.VILLA]: <i className="fas fa-house-chimney category-icon-blue"></i>,
    [PropertyCategory.STUDIO]: <i className="fas fa-bed category-icon-blue"></i>
  };
  return icons[category] || <i className="fas fa-city category-icon-blue"></i>;
};

export const getStatusIcon = (status: PropertyStatus) => {
  const icons = {
    [PropertyStatus.AVAILABLE]: <i className="fas fa-check-circle" style={{ color: 'white', marginRight: '4px' }}></i>,
    [PropertyStatus.SOLD]: <i className="fas fa-lock" style={{ color: 'white', marginRight: '4px' }}></i>,
    [PropertyStatus.RENTED]: <i className="fas fa-home" style={{ color: 'white', marginRight: '4px' }}></i>
  };
  return icons[status] || <i className="fas fa-check-circle" style={{ color: 'white', marginRight: '4px' }}></i>;
};

export const getCategoryIconFilter = (category: string) => {
  const icons = {
    apartment: <i className="fas fa-city category-icon-blue"></i>,
    house: <i className="fas fa-house-user category-icon-blue"></i>,
    office: <i className="fas fa-building category-icon-blue"></i>,
    villa: <i className="fas fa-house-chimney category-icon-blue"></i>,
    studio: <i className="fas fa-bed category-icon-blue"></i>
  };
  return icons[category as keyof typeof icons] || <i className="fas fa-city category-icon-blue"></i>;
};

export const getStatusIconFilter = (status: string) => {
  const icons = {
    available: <i className="fas fa-check-circle" style={{ color: 'white', marginRight: '4px' }}></i>,
    sold: <i className="fas fa-lock" style={{ color: 'white', marginRight: '4px' }}></i>,
    rented: <i className="fas fa-home" style={{ color: 'white', marginRight: '4px' }}></i>
  };
  return icons[status as keyof typeof icons] || <i className="fas fa-check-circle" style={{ color: 'white', marginRight: '4px' }}></i>;
};