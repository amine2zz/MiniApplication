import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../types/Property';
import { propertyApi } from '../services/api';
import PropertyForm from '../components/PropertyForm';
import './PropertyFormPage.css';

interface PropertyFormPageProps {
  language: 'fr' | 'en';
}

const PropertyFormPage: React.FC<PropertyFormPageProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const texts = {
    fr: {
      back: '← Retour à la liste',
      modification: 'Modification',
      newProperty: 'Nouvelle propriété',
      editProperty: 'Modifier la propriété',
      addProperty: 'Ajouter une nouvelle propriété',
      editDesc: 'Modifiez les informations de cette propriété',
      addDesc: 'Remplissez les informations pour ajouter une nouvelle propriété',
      loading: 'Chargement...',
      error: 'Erreur',
      backToList: 'Retour à la liste',
      saveError: 'Erreur lors de l\'enregistrement',
      notFound: 'Propriété non trouvée'
    },
    en: {
      back: '← Back to list',
      modification: 'Modification',
      newProperty: 'New property',
      editProperty: 'Edit property',
      addProperty: 'Add new property',
      editDesc: 'Edit the information of this property',
      addDesc: 'Fill in the information to add a new property',
      loading: 'Loading...',
      error: 'Error',
      backToList: 'Back to list',
      saveError: 'Error saving',
      notFound: 'Property not found'
    }
  };

  const t = texts[language];

  const isEditing = id && id !== 'new';

  useEffect(() => {
    if (isEditing) {
      loadProperty(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

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

  const handleSubmit = async (data: CreatePropertyDTO | UpdatePropertyDTO) => {
    try {
      setSubmitting(true);
      setError(null);

      if (isEditing && property) {
        await propertyApi.update(property.id, data as UpdatePropertyDTO);
      } else {
        await propertyApi.create(data as CreatePropertyDTO);
      }

      navigate('/', { state: { preserveViewMode: true } });
    } catch (err) {
      setError(t.saveError);
      console.error('Error saving property:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/', { state: { preserveViewMode: true } });
  };

  if (loading) {
    return (
      <div className="property-form-page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error && isEditing) {
    return (
      <div className="property-form-page-container">
        <div className="error">
          <div className="error-icon">❌</div>
          <h2>{t.error}</h2>
          <p>{error}</p>
          <button onClick={handleCancel} className="btn btn-primary">
            {t.backToList}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-form-page-container">
      <div className="property-form-page-header">
        <button onClick={handleCancel} className="btn-back">
          {t.back}
        </button>
      </div>

      <div className="property-form-page-content">
        <div className="form-header">
          <div className="form-badge">
            {isEditing ? t.modification : t.newProperty}
          </div>
          <h1 className="form-title">
            {isEditing ? t.editProperty : t.addProperty}
          </h1>
          <p className="form-description">
            {isEditing ? t.editDesc : t.addDesc}
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
          language={language}
        />
      </div>
    </div>
  );
};

export default PropertyFormPage;