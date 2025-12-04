import React, { useState } from 'react';
import { Property, PropertyStatus, PropertyType } from '../types/Property';
import { getCategoryIcon, getStatusIcon } from '../utils/icons';
import './PropertyListCard.css';
import './ImageDots.css';

interface PropertyListCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  language: 'fr' | 'en';
}

const PropertyListCard: React.FC<PropertyListCardProps> = ({ property, onView, onEdit, onDelete, language }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
      {property.images && property.images.length > 0 ? (
        <div className="list-card-image">
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.title}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="list-card-icon">${getCategoryIcon(property.category)}</div>`;
              }
            }}
          />
          {property.images.length > 1 && (
            <>
              <div className="list-image-count">
                <i className="fas fa-images"></i>
                {property.images.length}
              </div>
              <div className="list-card-image-dots">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    className={`list-card-dot ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="list-card-image no-image-placeholder">
          <div className="no-image-text">
            <i className="fas fa-image"></i>
            <span>{language === 'fr' ? 'Aucune image disponible' : 'No images available'}</span>
          </div>
        </div>
      )}
      
      <div className="list-card-content">
        <div className="list-card-header">
          <h3 className="list-card-title">{property.title}</h3>
          <span className={`list-status-badge ${property.status}`}>
            {getStatusIcon(property.status)}
            {getStatusText(property.status)}
          </span>
        </div>
        
        <div className="list-card-details">
          <span className="list-detail">{getTypeText(property.type)}</span>
          <span className="list-detail"><i className="fas fa-map-marker-alt category-icon-blue"></i> {property.city}</span>
          <span className="list-detail"><i className="fas fa-ruler-combined category-icon-blue"></i> {property.surface} m²</span>
          <span className="list-detail list-price">{property.price.toLocaleString()} €</span>
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