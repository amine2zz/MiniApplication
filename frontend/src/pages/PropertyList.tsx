import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../types/Property';
import { propertyApi } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import './PropertyList.css';

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyApi.getAll();
      setProperties(data);
    } catch (err) {
      setError('Erreur lors du chargement des propriétés');
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

  if (loading) {
    return (
      <div className="property-list-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Chargement des propriétés...</p>
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
            Réessayer
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
            <span className="header-badge">Gestion Immobilière</span>
            <h1 className="header-title">Découvrez nos propriétés</h1>
            <p className="header-description">
              Explorez notre sélection de biens immobiliers soigneusement choisis pour vous
            </p>
          </div>
          <button onClick={handleAddNew} className="btn btn-add">
            + Ajouter une propriété
          </button>
        </div>
      </div>

      <div className="properties-grid">
        {properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <h3>Aucune propriété disponible</h3>
            <p>Commencez par ajouter votre première propriété</p>
            <button onClick={handleAddNew} className="btn btn-primary">
              Ajouter une propriété
            </button>
          </div>
        ) : (
          properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={handleView}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyList;