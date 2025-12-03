import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  language: 'fr' | 'en';
  onLanguageChange: (lang: 'fr' | 'en') => void;
}

const Navbar: React.FC<NavbarProps> = ({ language, onLanguageChange }) => {
  const navigate = useNavigate();

  const texts = {
    fr: {
      title: 'Cash Flow Positif',
      subtitle: 'Gestion Immobilière',
      home: 'Accueil',
      addProperty: 'Ajouter'
    },
    en: {
      title: 'Cash Flow Positive',
      subtitle: 'Real Estate Management',
      home: 'Home',
      addProperty: 'Add Property'
    }
  };

  const t = texts[language];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <h1 className="brand-title">{t.title}</h1>
          <span className="brand-subtitle">{t.subtitle}</span>
        </div>
        
        <div className="navbar-menu">
          <button 
            className="nav-link" 
            onClick={() => navigate('/')}
          >
            {t.home}
          </button>
          <button 
            className="nav-link" 
            onClick={() => navigate('/property/new')}
          >
            {t.addProperty}
          </button>
          
          <div className="language-switcher">
            <button
              className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
              onClick={() => onLanguageChange('fr')}
            >
              FR
            </button>
            <button
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => onLanguageChange('en')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;