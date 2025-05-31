import { useState, useEffect } from 'react';
import {  Spin } from 'antd';
import { ShoppingCartOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import client from '../api/client';
import '../styles/PromoSection.css';

interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  isPromo?: boolean;
}

const PromoSection = () => {
  const { addToCart } = useCart();
  const [promoProducts, setPromoProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        const response = await client.get('/products?isPromo=true');
        setPromoProducts(response.data);
      } catch (error) {
        console.error('Error fetching promo products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPromoProducts();
  }, []);

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  return (
    <section className="promo-section">
      <div className="decorative-shapes">
        <div className="decorative-shape shape-1"></div>
        <div className="decorative-shape shape-2"></div>
        <div className="decorative-shape shape-3"></div>
      </div>
      
      <div className="promo-container">
        <div className="promo-grid">
          <div className="promo-content">
            <span className="promo-badge">
              Offres à durée limitée
            </span>
            
            <h2 className="promo-title">
              Offres Spéciales<br />
              <span className="highlight">Jusqu'à -50%</span>
            </h2>
            
            <p className="promo-description">
              Profitez de nos réductions exceptionnelles sur une sélection de produits technologiques haut de gamme. Offre valable jusqu'à épuisement des stocks.
            </p>
            
            <div className="countdown-container">
              <div className="countdown-item">
                <div className="countdown-value">10</div>
                <div className="countdown-label">Jours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">08</div>
                <div className="countdown-label">Heures</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">35</div>
                <div className="countdown-label">Minutes</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">20</div>
                <div className="countdown-label">Secondes</div>
              </div>
            </div>
            
            
          </div>
          
          <div className="promo-products">
            <div className="promo-products-grid">
              {promoProducts.slice(0, 4).map((product, index) => {
                const discountPercentage = product.oldPrice 
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                  : 0;
                  
                return (
                  <div 
                    key={product.id} 
                    className={`promo-product-card ${index % 2 !== 0 ? 'shifted' : ''}`}
                  >
                    {product.oldPrice && (
                      <div className="discount-badge">
                        -{discountPercentage}%
                      </div>
                    )}
                    
                    <div className="promo-product-image-container">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="promo-product-image"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                        }}
                      />
                      
                      <div className="limited-time-indicator">
                        <FieldTimeOutlined className="time-icon" /> Offre limitée
                      </div>
                    </div>
                    
                    <div className="promo-product-content">
                      <h3 className="promo-product-name">{product.name}</h3>
                      
                      <div className="promo-product-footer">
                        <div className="promo-product-prices">
                          <div className="promo-current-price">{product.price.toFixed(2)} FCFA</div>
                          {product.oldPrice && (
                            <div className="promo-old-price">{product.oldPrice.toFixed(2)} FCFA</div>
                          )}
                        </div>
                        
                        <button 
                          onClick={() => addToCart({
                            ...product,
                            _id: product.id,
                            description: '', // Ajoutez une description appropriée si disponible
                            stock: 1 // Ou une valeur par défaut appropriée
                          })}
                          className="promo-cart-button"
                          aria-label="Ajouter au panier"
                        >
                          <ShoppingCartOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;