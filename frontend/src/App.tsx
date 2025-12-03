import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import PropertyFormPage from './pages/PropertyFormPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    setLanguage(lang);
  };

  return (
    <Router>
      <div className="App">
        <Navbar language={language} onLanguageChange={handleLanguageChange} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PropertyList language={language} />} />
            <Route path="/property/new" element={<PropertyFormPage language={language} />} />
            <Route path="/property/:id" element={<PropertyDetail language={language} />} />
            <Route path="/property/:id/edit" element={<PropertyFormPage language={language} />} />
          </Routes>
        </main>
        <Footer language={language} />
      </div>
    </Router>
  );
}

export default App;
