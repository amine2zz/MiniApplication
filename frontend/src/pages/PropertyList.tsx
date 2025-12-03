import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types/Property';
import { propertyApi } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import './PropertyList.css';

interface PropertyListProps {
  language: 'fr' | 'en';
}

const PropertyList: React.FC<PropertyListProps> = ({ language }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const texts = {
    fr: {
      management: 'Gestion Immobilière',
      title: 'Découvrez nos propriétés',
      description: 'Explorez notre sélection de biens immobiliers soigneusement choisis pour vous',
      addProperty: '+ Ajouter une propriété',
      loading: 'Chargement des propriétés...',
      error: 'Erreur lors du chargement des propriétés',
      retry: 'Réessayer',
      noProperties: 'Aucune propriété disponible',
      noPropertiesDesc: 'Commencez par ajouter votre première propriété',
      noResults: 'Aucun résultat trouvé',
      noResultsDesc: 'Essayez de modifier vos critères de recherche'
    },
    en: {
      management: 'Real Estate Management',
      title: 'Discover our properties',
      description: 'Explore our selection of carefully chosen real estate properties for you',
      addProperty: '+ Add Property',
      loading: 'Loading properties...',
      error: 'Error loading properties',
      retry: 'Retry',
      noProperties: 'No properties available',
      noPropertiesDesc: 'Start by adding your first property',
      noResults: 'No results found',
      noResultsDesc: 'Try modifying your search criteria'
    }
  };

  const t = texts[language];

  useEffect(() => {
    loadProperties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyApi.getAll();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      setError(t.error);
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/property/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/property/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate('/property/new');
  };

  const handleFilter = (filters: { cities: string[], minPrice: string, maxPrice: string, minSurface: string, maxSurface: string }) => {
    let filtered = [...properties];

    // Cities filter
    if (filters.cities && filters.cities.length > 0) {
      filtered = filtered.filter(property => 
        filters.cities.some(city => 
          property.city.toLowerCase().includes(city.toLowerCase())
        )
      );
    }

    // Price range filter
    const minPrice = parseInt(filters.minPrice) || 0;
    const maxPrice = parseInt(filters.maxPrice) || Infinity;
    filtered = filtered.filter(property => 
      property.price >= minPrice && property.price <= maxPrice
    );

    // Surface range filter
    const minSurface = parseInt(filters.minSurface) || 0;
    const maxSurface = parseInt(filters.maxSurface) || Infinity;
    filtered = filtered.filter(property => 
      property.surface >= minSurface && property.surface <= maxSurface
    );

    setFilteredProperties(filtered);
  };

  const handleResetFilter = () => {
    setFilteredProperties(properties);
  };

  if (loading) {
    return (
      <div className="property-list-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="property-list-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadProperties} className="btn btn-primary">
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-list-container">
      <div className="property-list-header">
        <div className="header-content">
          <div className="header-text">
            <span className="header-badge">{t.management}</span>
            <h1 className="header-title">{t.title}</h1>
            <p className="header-description">
              {t.description}
            </p>
          </div>
          <button onClick={handleAddNew} className="btn btn-add">
            {t.addProperty}
          </button>
        </div>
      </div>

      <PropertyFilter 
        onFilter={handleFilter}
        onReset={handleResetFilter}
        language={language}
        properties={properties}
      />

      <div className="properties-grid">
        {properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3>{t.noProperties}</h3>
            <p>{t.noPropertiesDesc}</p>
            <button onClick={handleAddNew} className="btn btn-primary">
              {t.addProperty}
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>{t.noResults}</h3>
            <p>{t.noResultsDesc}</p>
            <button onClick={handleResetFilter} className="btn btn-primary">
              {t.retry}
            </button>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={handleView}
              onEdit={handleEdit}
              language={language}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;