import React, { useState } from 'react';
import './PropertyFilter.css';

interface FilterOptions {
  cities: string[];
  minPrice: string;
  maxPrice: string;
  minSurface: string;
  maxSurface: string;
  categories: string[];
  statuses: string[];
}

interface PropertyFilterProps {
  onFilter: (filters: FilterOptions) => void;
  onReset: () => void;
  language: 'fr' | 'en';
  properties: Array<{city: string; price: number; surface: number}>;
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({ onFilter, onReset, language, properties }) => {
  const cities = Array.from(new Set(properties.map(p => p.city))).sort();
  const prices = properties.map(p => p.price).sort((a, b) => a - b);
  const surfaces = properties.map(p => p.surface).sort((a, b) => a - b);
  
  const minPrice = prices[0] || 0;
  const maxPrice = prices[prices.length - 1] || 1000000;
  const minSurface = surfaces[0] || 0;
  const maxSurface = surfaces[surfaces.length - 1] || 500;

  const [filters, setFilters] = useState<FilterOptions>({
    cities: [],
    minPrice: minPrice.toString(),
    maxPrice: maxPrice.toString(),
    minSurface: minSurface.toString(),
    maxSurface: maxSurface.toString(),
    categories: [],
    statuses: []
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [cityInput, setCityInput] = useState('');

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(cityInput.toLowerCase()) && 
    !filters.cities.includes(city)
  );

  const texts = {
    fr: {
      searchPlaceholder: 'Rechercher par ville...',
      filters: 'Plus de filtres',
      city: 'Ville',
      price: 'Prix (€)',
      surface: 'Surface (m²)',
      apply: 'Appliquer',
      reset: 'Effacer',
      minPrice: 'Prix min',
      maxPrice: 'Prix max',
      minSurface: 'Surface min',
      maxSurface: 'Surface max',
      allCities: 'Toutes les villes',
      category: 'Catégorie',
      status: 'Statut',
      apartment: 'Appartement',
      house: 'Maison',
      office: 'Bureau',
      villa: 'Villa',
      studio: 'Studio',
      available: 'Disponible',
      sold: 'Vendu',
      rented: 'Loué'
    },
    en: {
      searchPlaceholder: 'Search by city...',
      filters: 'More filters',
      city: 'City',
      price: 'Price (€)',
      surface: 'Surface (m²)',
      apply: 'Apply',
      reset: 'Clear',
      minPrice: 'Min price',
      maxPrice: 'Max price',
      minSurface: 'Min surface',
      maxSurface: 'Max surface',
      allCities: 'All cities',
      category: 'Category',
      status: 'Status',
      apartment: 'Apartment',
      house: 'House',
      office: 'Office',
      villa: 'Villa',
      studio: 'Studio',
      available: 'Available',
      sold: 'Sold',
      rented: 'Rented'
    }
  };

  const t = texts[language];

  const handleInputChange = (field: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      // Ensure min <= max for ranges
      if (field === 'minPrice' && parseInt(value) > parseInt(prev.maxPrice)) {
        newFilters.maxPrice = value;
      }
      if (field === 'maxPrice' && parseInt(value) < parseInt(prev.minPrice)) {
        newFilters.minPrice = value;
      }
      if (field === 'minSurface' && parseInt(value) > parseInt(prev.maxSurface)) {
        newFilters.maxSurface = value;
      }
      if (field === 'maxSurface' && parseInt(value) < parseInt(prev.minSurface)) {
        newFilters.minSurface = value;
      }
      return newFilters;
    });
  };

  const handleCityInputChange = (value: string) => {
    setCityInput(value);
    setShowCitySuggestions(value.length > 0);
  };

  const handleCitySelect = (city: string) => {
    setFilters(prev => ({ ...prev, cities: [...prev.cities, city] }));
    setCityInput('');
    setShowCitySuggestions(false);
  };

  const handleCityRemove = (cityToRemove: string) => {
    setFilters(prev => ({ 
      ...prev, 
      cities: prev.cities.filter(city => city !== cityToRemove) 
    }));
  };

  const handleShowAllCities = () => {
    setShowCitySuggestions(true);
    setCityInput('');
  };

  const handleSearch = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({ 
      cities: [], 
      minPrice: minPrice.toString(), 
      maxPrice: maxPrice.toString(), 
      minSurface: minSurface.toString(), 
      maxSurface: maxSurface.toString(),
      categories: [],
      statuses: []
    });
    setCityInput('');
    onReset();
    setIsExpanded(false);
  };

  const getCategoryIcon = (cat: string) => {
    const icons = { apartment: '🏢', house: '🏠', office: '🏢', villa: '🏡', studio: '🏢' };
    return icons[cat as keyof typeof icons] || '🏠';
  };

  const getCategoryText = (cat: string) => {
    const texts = { apartment: t.apartment, house: t.house, office: t.office, villa: t.villa, studio: t.studio };
    return texts[cat as keyof typeof texts] || cat;
  };

  const getStatusText = (status: string) => {
    const texts = { available: t.available, sold: t.sold, rented: t.rented };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <div className="property-filter">
      <div className="search-bar">
        <div className="search-input-container">
          {filters.cities.length > 0 && (
            <div className="selected-cities">
              {filters.cities.map((city) => (
                <span key={city} className="city-tag">
                  📍 {city}
                  <button onClick={() => handleCityRemove(city)}>×</button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            className={`search-input ${filters.cities.length > 0 ? 'with-tags' : ''}`}
            placeholder={t.searchPlaceholder}
            value={cityInput}
            onChange={(e) => handleCityInputChange(e.target.value)}
            onFocus={handleShowAllCities}
            onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
          />
          <button className="search-btn" onClick={handleSearch}>
            🔍
          </button>
          
          {showCitySuggestions && (
            <div className="city-suggestions">
              {cityInput === '' && (
                <div className="suggestion-header">{t.allCities}</div>
              )}
              {filteredCities.map((city) => (
                <div
                  key={city}
                  className="city-suggestion"
                  onClick={() => handleCitySelect(city)}
                >
                  📍 {city}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button 
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {t.filters} {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {isExpanded && (
        <div className="filter-expanded">
          <div className="filter-row">
            <div className="filter-col">
              <label>{t.price}</label>
              <div className="range-container">
                <div className="range-values">
                  <div className="range-value-group">
                    <input 
                      type="number" 
                      value={filters.minPrice}
                      onChange={(e) => handleInputChange('minPrice', e.target.value)}
                      className="range-input"
                    />
                    <span>€</span>
                  </div>
                  <div className="range-value-group">
                    <input 
                      type="number" 
                      value={filters.maxPrice}
                      onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                      className="range-input"
                    />
                    <span>€</span>
                  </div>
                </div>
                <div className="dual-range">
                  <div 
                    className="range-track"
                    style={{
                      left: `${((parseInt(filters.minPrice) - minPrice) / (maxPrice - minPrice)) * 100}%`,
                      width: `${((parseInt(filters.maxPrice) - parseInt(filters.minPrice)) / (maxPrice - minPrice)) * 100}%`
                    }}
                  ></div>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.minPrice}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    className="range-min"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={filters.maxPrice}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    className="range-max"
                  />
                </div>
              </div>
            </div>
            
            <div className="filter-col">
              <label>{t.surface}</label>
              <div className="range-container">
                <div className="range-values">
                  <div className="range-value-group">
                    <input 
                      type="number" 
                      value={filters.minSurface}
                      onChange={(e) => handleInputChange('minSurface', e.target.value)}
                      className="range-input"
                    />
                    <span>m²</span>
                  </div>
                  <div className="range-value-group">
                    <input 
                      type="number" 
                      value={filters.maxSurface}
                      onChange={(e) => handleInputChange('maxSurface', e.target.value)}
                      className="range-input"
                    />
                    <span>m²</span>
                  </div>
                </div>
                <div className="dual-range">
                  <div 
                    className="range-track"
                    style={{
                      left: `${((parseInt(filters.minSurface) - minSurface) / (maxSurface - minSurface)) * 100}%`,
                      width: `${((parseInt(filters.maxSurface) - parseInt(filters.minSurface)) / (maxSurface - minSurface)) * 100}%`
                    }}
                  ></div>
                  <input
                    type="range"
                    min={minSurface}
                    max={maxSurface}
                    value={filters.minSurface}
                    onChange={(e) => handleInputChange('minSurface', e.target.value)}
                    className="range-min"
                  />
                  <input
                    type="range"
                    min={minSurface}
                    max={maxSurface}
                    value={filters.maxSurface}
                    onChange={(e) => handleInputChange('maxSurface', e.target.value)}
                    className="range-max"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-col">
              <label>{t.category}</label>
              <div className="filter-tags">
                {filters.categories.map((category) => (
                  <span key={category} className="filter-tag">
                    {getCategoryIcon(category)} {getCategoryText(category)}
                    <button onClick={() => {
                      setFilters(prev => ({ 
                        ...prev, 
                        categories: prev.categories.filter(c => c !== category) 
                      }));
                    }}>×</button>
                  </span>
                ))}
              </div>
              <div className="filter-options">
                {['apartment', 'house', 'office', 'villa', 'studio'].filter(cat => !filters.categories.includes(cat)).map((category) => (
                  <button
                    key={category}
                    className="filter-option"
                    onClick={() => {
                      setFilters(prev => ({ 
                        ...prev, 
                        categories: [...prev.categories, category] 
                      }));
                    }}
                  >
                    {getCategoryText(category)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-col">
              <label>{t.status}</label>
              <div className="filter-tags">
                {filters.statuses.map((status) => (
                  <span key={status} className="filter-tag">
                    🏷️ {getStatusText(status)}
                    <button onClick={() => {
                      setFilters(prev => ({ 
                        ...prev, 
                        statuses: prev.statuses.filter(s => s !== status) 
                      }));
                    }}>×</button>
                  </span>
                ))}
              </div>
              <div className="filter-options">
                {['available', 'sold', 'rented'].filter(stat => !filters.statuses.includes(stat)).map((status) => (
                  <button
                    key={status}
                    className="filter-option"
                    onClick={() => {
                      setFilters(prev => ({ 
                        ...prev, 
                        statuses: [...prev.statuses, status] 
                      }));
                    }}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="filter-actions">
            <button className="btn-reset" onClick={handleReset}>
              {t.reset}
            </button>
            <button className="btn-apply" onClick={handleSearch}>
              {t.apply}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilter;