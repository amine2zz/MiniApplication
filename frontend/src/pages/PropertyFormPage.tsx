import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../types/Property';
import { propertyApi } from '../services/api';
import PropertyForm from '../components/PropertyForm';
import './PropertyFormPage.css';

const PropertyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      loadProperty(id);
    }
  }, [id, isEditing]);

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

  const handleSubmit = async (data: CreatePropertyDTO | UpdatePropertyDTO) => {
    try {
      setSubmitting(true);
      setError(null);

      if (isEditing && property) {
        await propertyApi.update(property.id, data as UpdatePropertyDTO);
      } else {
        await propertyApi.create(data as CreatePropertyDTO);
      }

      navigate('/');
    } catch (err) {
      setError('Erreur lors de l\'enregistrement');
      console.error('Error saving property:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="property-form-page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && isEditing) {
    return (
      <div className="property-form-page-container">
        <div className="error">
          <div className="error-icon">❌</div>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button onClick={handleCancel} className="btn btn-primary">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-form-page-container">
      <div className="property-form-page-header">
        <button onClick={handleCancel} className="btn-back">
          ← Retour à la liste
        </button>
      </div>

      <div className="property-form-page-content">
        <div className="form-header">
          <div className="form-badge">
            {isEditing ? 'Modification' : 'Nouvelle propriété'}
          </div>
          <h1 className="form-title">
            {isEditing ? 'Modifier la propriété' : 'Ajouter une nouvelle propriété'}
          </h1>
          <p className="form-description">
            {isEditing 
              ? 'Modifiez les informations de cette propriété'
              : 'Remplissez les informations pour ajouter une nouvelle propriété'
            }
          </p>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <PropertyForm
          property={property || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={submitting}
        />
      </div>
    </div>
  );
};

export default PropertyFormPage;