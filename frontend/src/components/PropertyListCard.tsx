import React from 'react';
import { Property, PropertyCategory, PropertyStatus, PropertyType } from '../types/Property';
import './PropertyListCard.css';

interface PropertyListCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  language: 'fr' | 'en';
}

const PropertyListCard: React.FC<PropertyListCardProps> = ({ property, onView, onEdit, onDelete, language }) => {
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
      [PropertyCategory.APARTMENT]: '🏢',
      [PropertyCategory.HOUSE]: '🏠',
      [PropertyCategory.OFFICE]: '🏢',
      [PropertyCategory.VILLA]: '🏡',
      [PropertyCategory.STUDIO]: '🏢'
    };
    return icons[category] || '🏠';
  };

  const getStatusText = (status: PropertyStatus) => {
    const statusMap = {
      [PropertyStatus.AVAILABLE]: t.available,
      [PropertyStatus.SOLD]: t.sold,
      [PropertyStatus.RENTED]: t.rented
    };
    return statusMap[status] || status;
  };

  const getTypeText = (type: PropertyType) => {
    return type === PropertyType.SALE ? t.forSale : t.forRent;
  };

  return (
    <div className="property-list-card">
      <div className="list-card-icon">
        {getCategoryIcon(property.category)}
      </div>
      
      <div className="list-card-content">
        <div className="list-card-header">
          <h3 className="list-card-title">{property.title}</h3>
          <span className="list-status-badge">
            {getStatusText(property.status)}
          </span>
        </div>
        
        <div className="list-card-details">
          <span className="list-detail">📍 {property.city}</span>
          <span className="list-detail">{getTypeText(property.type)}</span>
          <span className="list-detail list-price">{property.price.toLocaleString()} €</span>
          <span className="list-detail">📐 {property.surface} m²</span>
        </div>
      </div>
      
      <div className="list-card-actions">
        <button 
          className="list-btn list-btn-primary" 
          onClick={() => onView(property.id)}
        >
          {t.view}
        </button>
        <button 
          className="list-btn list-btn-secondary" 
          onClick={() => onEdit(property.id)}
        >
          {t.edit}
        </button>
        <button 
          className="list-btn list-btn-danger" 
          onClick={() => onDelete(property.id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default PropertyListCard;