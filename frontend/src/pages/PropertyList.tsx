import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types/Property';
import { propertyApi } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyListCard from '../components/PropertyListCard';
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
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>(() => {
    return (localStorage.getItem('viewMode') as 'gallery' | 'list') || 'gallery';
  });
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
      noResultsDesc: 'Essayez de modifier vos critères de recherche',
      galleryView: 'Vue galerie',
      listView: 'Vue liste'
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
      noResultsDesc: 'Try modifying your search criteria',
      galleryView: 'Gallery view',
      listView: 'List view'
    }
  };

  const t = texts[language];

  useEffect(() => {
    loadProperties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

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

  const handleDelete = async (id: string) => {
    if (window.confirm(language === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette propriété ?' : 'Are you sure you want to delete this property?')) {
      try {
        await propertyApi.delete(id);
        loadProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleAddNew = () => {
    navigate('/property/new');
  };

  const handleFilter = (filters: { cities: string[], minPrice: string, maxPrice: string, minSurface: string, maxSurface: string, categories: string[], statuses: string[] }) => {
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

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(property => 
        filters.categories.includes(property.category)
      );
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(property => 
        filters.statuses.includes(property.status)
      );
    }

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


      <PropertyFilter 
        onFilter={handleFilter}
        onReset={handleResetFilter}
        language={language}
        properties={properties}
      />

      <div className="view-controls">
        <div className="view-switcher">
          <button 
            className={`view-btn ${viewMode === 'gallery' ? 'active' : ''}`}
            onClick={() => setViewMode('gallery')}
          >
            <i className="fas fa-th category-icon-blue"></i> {t.galleryView}
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <i className="fas fa-list category-icon-blue"></i> {t.listView}
          </button>
        </div>
      </div>

      <div className={`properties-container ${viewMode}`}>
        {properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-home category-icon-blue"></i></div>
            <h3>{t.noProperties}</h3>
            <p>{t.noPropertiesDesc}</p>
            <button onClick={handleAddNew} className="btn btn-primary">
              {t.addProperty}
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-search category-icon-blue"></i></div>
            <h3>{t.noResults}</h3>
            <p>{t.noResultsDesc}</p>
            <button onClick={handleResetFilter} className="btn btn-primary">
              {t.retry}
            </button>
          </div>
        ) : (
          filteredProperties.map((property) => (
            viewMode === 'gallery' ? (
              <PropertyCard
                key={property.id}
                property={property}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                language={language}
              />
            ) : (
              <PropertyListCard
                key={property.id}
                property={property}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                language={language}
              />
            )
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;