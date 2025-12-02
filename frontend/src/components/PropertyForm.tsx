import React, { useState, useEffect } from 'react';
import { Property, CreatePropertyDTO, UpdatePropertyDTO } from '../types/Property';
import './PropertyForm.css';

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: CreatePropertyDTO | UpdatePropertyDTO) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  property, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
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
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    const price = parseFloat(formData.price);
    if (!formData.price || isNaN(price) || price <= 0) {
      newErrors.price = 'Le prix doit être un nombre positif';
    }

    const surface = parseFloat(formData.surface);
    if (!formData.surface || isNaN(surface) || surface <= 0) {
      newErrors.surface = 'La surface doit être un nombre positif';
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
          {property ? 'Modifier la propriété' : 'Ajouter une propriété'}
        </h2>

        <div className="form-group">
          <label htmlFor="title" className="form-label">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Ex: Appartement moderne centre-ville"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="city" className="form-label">Ville *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={`form-input ${errors.city ? 'error' : ''}`}
            placeholder="Ex: Paris"
          />
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price" className="form-label">Prix (€) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={`form-input ${errors.price ? 'error' : ''}`}
              placeholder="450000"
              min="0"
              step="1000"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="surface" className="form-label">Surface (m²) *</label>
            <input
              type="number"
              id="surface"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              className={`form-input ${errors.surface ? 'error' : ''}`}
              placeholder="65"
              min="0"
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
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : (property ? 'Modifier' : 'Ajouter')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;