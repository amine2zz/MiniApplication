import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property } from '../types/Property';
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
      backToList: 'Retour à la liste'
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
      backToList: 'Back to list'
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
            <h1 className="property-title">{property.title}</h1>
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