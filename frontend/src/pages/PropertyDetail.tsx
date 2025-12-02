import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property } from '../types/Property';
import { propertyApi } from '../services/api';
import './PropertyDetail.css';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyApi.getById(propertyId);
      setProperty(data);
    } catch (err) {
      setError('Propriété non trouvée');
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
          <p>Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-container">
        <div className="error">
          <div className="error-icon">❌</div>
          <h2>Propriété non trouvée</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="btn btn-primary">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-container">
      <div className="property-detail-header">
        <button onClick={handleBack} className="btn-back">
          ← Retour à la liste
        </button>
      </div>

      <div className="property-detail-card">
        <div className="property-detail-content">
          <div className="property-header">
            <div className="property-badge">Détail de la propriété</div>
            <h1 className="property-title">{property.title}</h1>
          </div>

          <div className="property-info-grid">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <span className="info-label">Localisation</span>
                <span className="info-value">{property.city}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">💰</div>
              <div className="info-content">
                <span className="info-label">Prix</span>
                <span className="info-value price">{formatPrice(property.price)}</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📐</div>
              <div className="info-content">
                <span className="info-label">Surface</span>
                <span className="info-value">{property.surface} m²</span>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">📊</div>
              <div className="info-content">
                <span className="info-label">Prix au m²</span>
                <span className="info-value">
                  {formatPrice(Math.round(property.price / property.surface))} / m²
                </span>
              </div>
            </div>
          </div>

          <div className="property-actions">
            <button onClick={handleEdit} className="btn btn-primary">
              Modifier cette propriété
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;