import React from 'react';
import { Property } from '../types/Property';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  language: 'fr' | 'en';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onView, onEdit, language }) => {
  const texts = {
    fr: {
      view: 'Voir',
      edit: 'Modifier'
    },
    en: {
      view: 'View',
      edit: 'Edit'
    }
  };

  const t = texts[language];
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-card">
      <div className="property-card-content">
        <h3 className="property-title">{property.title}</h3>
        <div className="property-details">
          <p className="property-city">📍 {property.city}</p>
          <p className="property-price">{formatPrice(property.price)}</p>
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
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;