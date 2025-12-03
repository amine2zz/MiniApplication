import React, { useState, useEffect } from 'react';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../types/Property';
import './PropertyForm.css';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: CreatePropertyDTO | UpdatePropertyDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
  language: 'fr' | 'en';
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  property, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  language 
}) => {
  const texts = {
    fr: {
      editTitle: 'Modifier la propriété',
      addTitle: 'Ajouter une propriété',
      title: 'Titre',
      titleRequired: 'Le titre est requis',
      titlePlaceholder: 'Ex: Appartement moderne centre-ville',
      city: 'Ville',
      cityRequired: 'La ville est requise',
      cityPlaceholder: 'Ex: Paris',
      price: 'Prix (€)',
      priceRequired: 'Le prix doit être un nombre positif',
      surface: 'Surface (m²)',
      surfaceRequired: 'La surface doit être un nombre positif',
      cancel: 'Annuler',
      saving: 'Enregistrement...',
      edit: 'Modifier',
      add: 'Ajouter'
    },
    en: {
      editTitle: 'Edit property',
      addTitle: 'Add property',
      title: 'Title',
      titleRequired: 'Title is required',
      titlePlaceholder: 'Ex: Modern downtown apartment',
      city: 'City',
      cityRequired: 'City is required',
      cityPlaceholder: 'Ex: Paris',
      price: 'Price (€)',
      priceRequired: 'Price must be a positive number',
      surface: 'Surface (m²)',
      surfaceRequired: 'Surface must be a positive number',
      cancel: 'Cancel',
      saving: 'Saving...',
      edit: 'Edit',
      add: 'Add'
    }
  };

  const t = texts[language];
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    price: '',
    surface: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        city: property.city,
        price: property.price.toString(),
        surface: property.surface.toString()
      });
    }
  }, [property]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t.titleRequired;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = language === 'fr' ? 'Le titre doit contenir au moins 3 caractères' : 'Title must be at least 3 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = t.cityRequired;
    } else if (formData.city.trim().length < 2) {
      newErrors.city = language === 'fr' ? 'La ville doit contenir au moins 2 caractères' : 'City must be at least 2 characters';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = t.priceRequired;
    } else if (price > 10000000) {
      newErrors.price = language === 'fr' ? 'Le prix ne peut pas dépasser 10 000 000 €' : 'Price cannot exceed €10,000,000';
    }

    const surface = parseFloat(formData.surface);
    if (!formData.surface || isNaN(surface) || surface <= 0) {
      newErrors.surface = t.surfaceRequired;
    } else if (surface > 1000) {
      newErrors.surface = language === 'fr' ? 'La surface ne peut pas dépasser 1000 m²' : 'Surface cannot exceed 1000 m²';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      title: formData.title.trim(),
      city: formData.city.trim(),
      price: parseFloat(formData.price),
      surface: parseFloat(formData.surface)
    };

    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="property-form-container">
      <form onSubmit={handleSubmit} className="property-form">
        <h2 className="form-title">
          {property ? t.editTitle : t.addTitle}
        </h2>

        <div className="form-group">
          <label htmlFor="title" className="form-label">{t.title} *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder={t.titlePlaceholder}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city" className="form-label">{t.city} *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`form-input ${errors.city ? 'error' : ''}`}
            placeholder={t.cityPlaceholder}
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price" className="form-label">{t.price} *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`form-input ${errors.price ? 'error' : ''}`}
              placeholder="450000"
              min="1000"
              max="10000000"
              step="1000"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="surface" className="form-label">{t.surface} *</label>
            <input
              type="number"
              id="surface"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              className={`form-input ${errors.surface ? 'error' : ''}`}
              placeholder="65"
              min="1"
              max="1000"
              step="1"
            />
            {errors.surface && <span className="error-message">{errors.surface}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-cancel"
            disabled={isLoading}
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="btn btn-submit"
            disabled={isLoading}
          >
            {isLoading ? t.saving : (property ? t.edit : t.add)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;