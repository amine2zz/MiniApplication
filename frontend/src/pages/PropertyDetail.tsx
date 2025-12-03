import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, PropertyCategory, PropertyStatus, PropertyType } from '../types/Property';
import { propertyApi } from '../services/api';
import './PropertyDetail.css';

interface PropertyDetailProps {
  language: 'fr' | 'en';
}

const PropertyDetail: React.FC<PropertyDetailProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const texts = {
    fr: {
      back: '← Retour à la liste',
      detail: 'Détail de la propriété',
      location: 'Localisation',
      price: 'Prix',
      surface: 'Surface',
      pricePerM2: 'Prix au m²',
      edit: 'Modifier cette propriété',
      loading: 'Chargement de la propriété...',
      notFound: 'Propriété non trouvée',
      backToList: 'Retour à la liste',
      type: 'Type',
      category: 'Catégorie',
      status: 'Statut',
      forSale: 'À vendre',
      forRent: 'À louer',
      apartment: 'Appartement',
      house: 'Maison',
      office: 'Bureau',
      villa: 'Villa',
      studio: 'Studio',
      available: 'Disponible',
      sold: 'Vendu',
      rented: 'Loué'
    },
    en: {
      back: '← Back to list',
      detail: 'Property details',
      location: 'Location',
      price: 'Price',
      surface: 'Surface',
      pricePerM2: 'Price per m²',
      edit: 'Edit this property',
      loading: 'Loading property...',
      notFound: 'Property not found',
      backToList: 'Back to list',
      type: 'Type',
      category: 'Category',
      status: 'Status',
      forSale: 'For Sale',
      forRent: 'For Rent',
      apartment: 'Apartment',
      house: 'House',
      office: 'Office',
      villa: 'Villa',
      studio: 'Studio',
      available: 'Available',
      sold: 'Sold',
      rented: 'Rented'
    }
  };

  const t = texts[language];

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyApi.getById(propertyId);
      setProperty(data);
    } catch (err) {
      setError(t.notFound);
      console.error('Error loading property:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/property/${id}/edit`);
  };

  const handleBack = () => {
    navigate('/');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

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

  const getStatusColor = (status: PropertyStatus) => {
    const colors = {
      [PropertyStatus.AVAILABLE]: '#10b981',
      [PropertyStatus.SOLD]: '#ef4444',
      [PropertyStatus.RENTED]: '#f59e0b'
    };
    return colors[status] || '#10b981';
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

  const getCategoryText = (category: PropertyCategory) => {
    const categoryMap = {
      [PropertyCategory.APARTMENT]: t.apartment,
      [PropertyCategory.HOUSE]: t.house,
      [PropertyCategory.OFFICE]: t.office,
      [PropertyCategory.VILLA]: t.villa,
      [PropertyCategory.STUDIO]: t.studio
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="property-detail-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-container">
        <div className="error">
          <div className="error-icon">❌</div>
          <h2>{t.notFound}</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="btn btn-primary">
            {t.backToList}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-container">
      <div className="property-detail-header">
        <button onClick={handleBack} className="btn-back">
          {t.back}
        </button>
      </div>

      <div className="property-detail-card">
        <div className="property-detail-content">
          <div className="property-header">
            <div className="property-badge">{t.detail}</div>
            <div className="title-section">
              <span className="category-icon">{getCategoryIcon(property.category)}</span>
              <h1 className="property-title">{property.title}</h1>
              <span 
                className="status-badge" 
                style={{ backgroundColor: getStatusColor(property.status) }}
              >
                {getStatusText(property.status)}
              </span>
            </div>
          </div>

          <div className="property-info-grid">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <span className="info-label">{t.location}</span>
                <span className="info-value">{property.city}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">🏷️</div>
              <div className="info-content">
                <span className="info-label">{t.type}</span>
                <span className="info-value">{getTypeText(property.type)}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">{getCategoryIcon(property.category)}</div>
              <div className="info-content">
                <span className="info-label">{t.category}</span>
                <span className="info-value">{getCategoryText(property.category)}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">💰</div>
              <div className="info-content">
                <span className="info-label">{t.price}</span>
                <span className="info-value price">{formatPrice(property.price)}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📐</div>
              <div className="info-content">
                <span className="info-label">{t.surface}</span>
                <span className="info-value">{property.surface} m²</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📊</div>
              <div className="info-content">
                <span className="info-label">{t.pricePerM2}</span>
                <span className="info-value">
                  {formatPrice(Math.round(property.price / property.surface))} / m²
                </span>
              </div>
            </div>
          </div>

          <div className="property-actions">
            <button onClick={handleEdit} className="btn btn-primary">
              {t.edit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;