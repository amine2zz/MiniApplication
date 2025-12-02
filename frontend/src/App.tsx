import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import PropertyFormPage from './pages/PropertyFormPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<PropertyList />} />
          <Route path="/property/new" element={<PropertyFormPage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/property/:id/edit" element={<PropertyFormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
