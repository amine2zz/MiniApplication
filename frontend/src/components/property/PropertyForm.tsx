import React, { useState, useEffect } from 'react';
import { Property, CreatePropertyDTO, UpdatePropertyDTO, PropertyType, PropertyCategory, PropertyStatus, FRENCH_CITIES_LIST } from '../../types/Property';
import { ImageGallery } from '../media';
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
      add: 'Ajouter',
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
      rented: 'Loué',
      images: 'Images'
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
      priceRequired: 'Price must be positive',
      surface: 'Surface (m²)',
      surfaceRequired: 'Surface must be positive',
      cancel: 'Cancel',
      saving: 'Saving...',
      edit: 'Edit',
      add: 'Add',
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
      rented: 'Rented',
      images: 'Images'
    }
  };

  const t = texts[language];
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    price: '',
    surface: '',
    type: PropertyType.SALE,
    category: PropertyCategory.APARTMENT,
    status: PropertyStatus.AVAILABLE,
    images: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        city: property.city,
        price: property.price.toString(),
        surface: property.surface.toString(),
        type: property.type,
        category: property.category,
        status: property.status,
        images: property.images || []
      });
    }
  }, [property]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t.titleRequired;
    } else if (formData.title.trim().length < 3) {
      newErrors.title = language === 'fr' ? 'Le titre doit contenir au moins 3 caractères' : 'Title must be at least 3 characters';
    } else if (/^\d+$/.test(formData.title.trim())) {
      newErrors.title = language === 'fr' ? 'Le titre ne peut pas contenir uniquement des chiffres' : 'Title cannot contain only numbers';
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
      surface: parseFloat(formData.surface),
      type: formData.type,
      category: formData.category,
      images: formData.images,
      ...(property && { status: formData.status })
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

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
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
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className={`form-input ${errors.city ? 'error' : ''}`}
          >
            <option value="">{language === 'fr' ? 'Sélectionner une ville' : 'Select a city'}</option>
            {FRENCH_CITIES_LIST.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
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
              step="100"
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

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="type" className="form-label">{t.type} *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as PropertyType }))}
              className="form-input"
            >
              <option value={PropertyType.SALE}>{t.forSale}</option>
              <option value={PropertyType.RENT}>{t.forRent}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">{t.category} *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as PropertyCategory }))}
              className="form-input"
            >
              <option value={PropertyCategory.APARTMENT}>{t.apartment}</option>
              <option value={PropertyCategory.HOUSE}>{t.house}</option>
              <option value={PropertyCategory.OFFICE}>{t.office}</option>
              <option value={PropertyCategory.VILLA}>{t.villa}</option>
              <option value={PropertyCategory.STUDIO}>{t.studio}</option>
            </select>
          </div>
        </div>

        {property && (
          <div className="form-group">
            <label htmlFor="status" className="form-label">{t.status} *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PropertyStatus }))}
              className="form-input"
            >
              <option value={PropertyStatus.AVAILABLE}>{t.available}</option>
              <option value={PropertyStatus.SOLD}>{t.sold}</option>
              <option value={PropertyStatus.RENTED}>{t.rented}</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{t.images}</label>
          <ImageGallery 
            images={formData.images}
            canEdit={true}
            onImagesChange={handleImagesChange}
            language={language}
          />
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