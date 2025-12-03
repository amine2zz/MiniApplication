import React from 'react';
import './Footer.css';

interface FooterProps {
  language: 'fr' | 'en';
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const texts = {
    fr: {
      title: 'Cash Flow Positif',
      description: 'Votre partenaire pour l\'investissement immobilier rentable',
      rights: 'Tous droits réservés',
      madeWith: 'Développé avec',
      by: 'par'
    },
    en: {
      title: 'Cash Flow Positive',
      description: 'Your partner for profitable real estate investment',
      rights: 'All rights reserved',
      madeWith: 'Made with',
      by: 'by'
    }
  };

  const t = texts[language];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-brand-header">
              <img src="/LogoWhite.png" alt="Logo" className="footer-logo" />
              <h3 className="footer-title">{t.title}</h3>
            </div>
            <p className="footer-description">{t.description}</p>
          </div>
          
          <div className="footer-info">
            <p className="footer-text">
              © 12/2025 {t.title}. {t.rights}.
            </p>
            <p className="footer-text">
              {t.madeWith} ❤️ {t.by} Med Amine Ghariani
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;