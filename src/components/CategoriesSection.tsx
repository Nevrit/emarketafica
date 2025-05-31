import React from 'react';
import { categories } from '../data/categories';
import '../styles/CategoriesSection.css';

const CategoriesSection = () => {
  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h2 className="categories-title">Catégories Populaires</h2>
          <div className="categories-divider"></div>
          <p className="categories-subtitle">Découvrez notre sélection de produits technologiques par catégorie</p>
        </div>
        
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-card"
            >
              <div className="category-image-container">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-image"
                />
                <div className="category-overlay"></div>
              </div>
              
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <div className="category-indicator"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="categories-action">
          <button className="categories-button">
            Toutes les catégories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;