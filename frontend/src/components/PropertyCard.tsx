import React from 'react';
import { Property, PropertyCategory, PropertyStatus, PropertyType } from '../types/Property';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  language: 'fr' | 'en';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onView, onEdit, onDelete, language }) => {
  const texts = {
    fr: {
      view: 'Voir',
      edit: 'Modifier',
      delete: 'Supprimer',
      available: 'Disponible',
      sold: 'Vendu',
      rented: 'Loué',
      forSale: 'À vendre',
      forRent: 'À louer'
    },
    en: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      available: 'Available',
      sold: 'Sold',
      rented: 'Rented',
      forSale: 'For Sale',
      forRent: 'For Rent'
    }
  };

  const t = texts[language];


  const getCategoryIcon = (category: PropertyCategory) => {
    const icons = {
      [PropertyCategory.APARTMENT]: <i className="fas fa-building"></i>,
      [PropertyCategory.HOUSE]: <i className="fas fa-home"></i>,
      [PropertyCategory.OFFICE]: <i className="fas fa-briefcase"></i>,
      [PropertyCategory.VILLA]: <i className="fas fa-crown"></i>,
      [PropertyCategory.STUDIO]: <i className="fas fa-door-open"></i>
    };
    return icons[category] || <i className="fas fa-building"></i>;
  };



  const getStatusText = (status: PropertyStatus) => {
    const statusMap = {
      [PropertyStatus.AVAILABLE]: t.available,
      [PropertyStatus.SOLD]: t.sold,
      [PropertyStatus.RENTED]: t.rented
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status: PropertyStatus) => {
    const iconMap = {
      [PropertyStatus.AVAILABLE]: '✅',
      [PropertyStatus.SOLD]: '🔒',
      [PropertyStatus.RENTED]: '🏠'
    };
    return iconMap[status] || '📋';
  };

  const getTypeText = (type: PropertyType) => {
    return type === PropertyType.SALE ? t.forSale : t.forRent;
  };

  return (
    <div className="property-card">
      <div className="property-card-content">
        <div className="property-header">
          <span className="category-icon">{getCategoryIcon(property.category)}</span>
          <h3 className="property-title">{property.title}</h3>
          <span className={`status-badge ${property.status}`}>
            <span>{getStatusIcon(property.status)}</span>
            {getStatusText(property.status)}
          </span>
        </div>
        <div className="property-details">
          <p className="property-city">📍 {property.city}</p>
          <p className="property-type">{getTypeText(property.type)}</p>
          <p className="property-price">{property.price.toLocaleString()} €</p>
          <p className="property-surface">📐 {property.surface} m²</p>
        </div>
        <div className="property-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => onView(property.id)}
          >
            {t.view}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onEdit(property.id)}
          >
            {t.edit}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => onDelete(property.id)}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;