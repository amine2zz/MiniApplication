import React, { useState } from 'react';
import { Property, PropertyStatus, PropertyType } from '../../types/Property';
import { getCategoryIcon, getStatusIcon } from '../../utils/icons';
import './PropertyCard.css';
import '../media/ImageDots.css';

interface PropertyCardProps {
  property: Property;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  language: 'fr' | 'en';
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onView, onEdit, onDelete, language }) => {
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
    <div className="property-card">
      {property.images && property.images.length > 0 ? (
        <div className="property-image">
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.title}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {property.images.length > 1 && (
            <>
              <div className="image-count">
                <i className="fas fa-images"></i>
                {property.images.length}
              </div>
              <div className="card-image-dots">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    className={`card-dot ${index === currentImageIndex ? 'active' : ''}`}
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
        <div className="property-image no-image-placeholder">
          <div className="no-image-text">
            <i className="fas fa-image"></i>
            <span>{language === 'fr' ? 'Aucune image disponible' : 'No images available'}</span>
          </div>
        </div>
      )}
      <div className="property-card-content">
        <div className="property-header">
          <div className="property-title-row">
            <h3 className="property-title">{property.title}</h3>
          </div>
        </div>
        <div className="property-details">
          <div className="property-details-left">
            <p className="property-type">{getTypeText(property.type)}</p>
            <p className="property-city"><i className="fas fa-map-marker-alt category-icon-blue"></i> {property.city}</p>
            <p className="property-surface"><i className="fas fa-ruler-combined category-icon-blue"></i> {property.surface} m²</p>
          </div>
          <div className="property-details-right">
            <p className="property-price">{property.price.toLocaleString()} €</p>
            <span className={`status-badge ${property.status}`}>
              {getStatusIcon(property.status)}
              {getStatusText(property.status)}
            </span>
          </div>
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