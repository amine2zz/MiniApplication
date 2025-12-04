import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Property } from '../types/Property';
import { propertyApi } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import PropertyListCard from '../components/PropertyListCard';
import PropertyFilter from '../components/PropertyFilter';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Pagination } from '../components/Pagination';
import './PropertyList.css';

interface PropertyListProps {
  language: 'fr' | 'en';
}

const PropertyList: React.FC<PropertyListProps> = ({ language }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [paginatedProperties, setPaginatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'list'>('gallery');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(() => {
    // Récupérer la page depuis les paramètres URL ou défaut à 1
    const pageParam = searchParams.get('page');
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const [itemsPerPage] = useState(6);
  const [currentFilters, setCurrentFilters] = useState(() => {
    // Récupérer les filtres depuis les paramètres URL
    const citiesParam = searchParams.get('cities');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');
    const minSurfaceParam = searchParams.get('minSurface');
    const maxSurfaceParam = searchParams.get('maxSurface');
    const categoriesParam = searchParams.get('categories');
    const statusesParam = searchParams.get('statuses');
    
    return {
      cities: citiesParam ? citiesParam.split(',') : [],
      minPrice: minPriceParam || '',
      maxPrice: maxPriceParam || '',
      minSurface: minSurfaceParam || '',
      maxSurface: maxSurfaceParam || '',
      categories: categoriesParam ? categoriesParam.split(',') : [],
      statuses: statusesParam ? statusesParam.split(',') : []
    };
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
      gallery: 'Galerie',
      list: 'Liste',
      deleteTitle: 'Supprimer la propriété',
      deleteMessage: 'Êtes-vous sûr de vouloir supprimer cette propriété ? Cette action est irréversible.',
      confirm: 'Supprimer',
      cancel: 'Annuler'

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
      gallery: 'Gallery',
      list: 'List',
      deleteTitle: 'Delete Property',
      deleteMessage: 'Are you sure you want to delete this property? This action cannot be undone.',
      confirm: 'Delete',
      cancel: 'Cancel'

    }
  };

  const t = texts[language];

  useEffect(() => {
    loadProperties();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Appliquer les filtres au chargement si des paramètres sont présents dans l'URL
  useEffect(() => {
    if (properties.length > 0) {
      applyFilters(currentFilters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  // Effet pour mettre à jour les propriétés paginées
  useEffect(() => {
    updatePaginatedProperties();
  }, [filteredProperties, currentPage, itemsPerPage]);

  const updatePaginatedProperties = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedProperties(filteredProperties.slice(startIndex, endIndex));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Mettre à jour l'URL avec la nouvelle page
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', page.toString());
      return newParams;
    });
    // Scroll vers le haut lors du changement de page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



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
    // Préserver la page actuelle et les filtres dans l'URL lors de la navigation
    const currentSearch = searchParams.toString();
    navigate(`/property/${id}?${currentSearch}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/property/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    setPropertyToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await propertyApi.delete(propertyToDelete);
        loadProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
    setShowDeleteDialog(false);
    setPropertyToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPropertyToDelete(null);
  };

  const handleAddNew = () => {
    navigate('/property/new');
  };

  const applyFilters = (filters: { cities: string[], minPrice: string, maxPrice: string, minSurface: string, maxSurface: string, categories: string[], statuses: string[] }) => {
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

  const handleFilter = (filters: { cities: string[], minPrice: string, maxPrice: string, minSurface: string, maxSurface: string, categories: string[], statuses: string[] }) => {
    setCurrentFilters(filters);
    applyFilters(filters);
    
    // Réinitialiser à la première page lors du filtrage et mettre à jour l'URL avec les filtres
    setCurrentPage(1);
    setSearchParams(() => {
      const newParams = new URLSearchParams();
      newParams.set('page', '1');
      
      if (filters.cities.length > 0) {
        newParams.set('cities', filters.cities.join(','));
      }
      if (filters.minPrice) {
        newParams.set('minPrice', filters.minPrice);
      }
      if (filters.maxPrice) {
        newParams.set('maxPrice', filters.maxPrice);
      }
      if (filters.minSurface) {
        newParams.set('minSurface', filters.minSurface);
      }
      if (filters.maxSurface) {
        newParams.set('maxSurface', filters.maxSurface);
      }
      if (filters.categories.length > 0) {
        newParams.set('categories', filters.categories.join(','));
      }
      if (filters.statuses.length > 0) {
        newParams.set('statuses', filters.statuses.join(','));
      }
      
      return newParams;
    });
  };

  const handleResetFilter = () => {
    const emptyFilters = {
      cities: [],
      minPrice: '',
      maxPrice: '',
      minSurface: '',
      maxSurface: '',
      categories: [],
      statuses: []
    };
    setCurrentFilters(emptyFilters);
    setFilteredProperties(properties);
    // Réinitialiser à la première page et supprimer tous les filtres de l'URL
    setCurrentPage(1);
    setSearchParams({ page: '1' });
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        initialFilters={currentFilters}
      />





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
        <div className={`properties-container ${viewMode}`}>
          {paginatedProperties.map((property) => (
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
          ))}
        </div>
      )}

      {filteredProperties.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={filteredProperties.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          language={language}
        />
      )}

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title={t.deleteTitle}
        message={t.deleteMessage}
        confirmText={t.confirm}
        cancelText={t.cancel}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        type="danger"
      />
    </div>
  );
};

export default PropertyList;