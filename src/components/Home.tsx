import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Carousel, Typography, Button, Space,  Rate, Empty, Spin } from 'antd';
import { ShoppingCartOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { Product, getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import '../styles/Home.css';

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

// Utilitaire pour les URLs d'images avec URL directe
const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/images/placeholder-product.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Utiliser l'URL complète du serveur backend
  return `https://ecommerce-backend-2-12tl.onrender.com${imagePath}`;
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data); // Suppression de .data car getProducts retourne déjà Product[]
        setLoading(false);
        console.log(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        setError("Une erreur est survenue lors du chargement des produits");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  
  

  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];
  const newArrivals = Array.isArray(products) ? products.slice(4, 8) : [];

    
  const heroImages = [
    '/images/banner1.jpg',
    '/images/banner2.jpg',
    '/images/banner3.jpg',
  ];

  // Affiche un message de chargement ou d'erreur si nécessaire
  const renderProductsSection = (
    productsToRender: Product[],
    title: string,
    icon: string,
    linkText: string,
    linkPath: string
  ) => {
    if (loading) {
      return (
        <div className="products-loading-container">
          <Spin size="large" />
          <p>Chargement des produits...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="products-error-container">
          <p>Erreur: {error}</p>
        </div>
      );
    }

    if (productsToRender.length === 0) {
      return <Empty description="Aucun produit trouvé" />;
    }

    return (
      <section className="products-section">
        <div className="section-header">
          <Title level={3} className="section-subtitle">
            {icon === 'fire' && <FireOutlined className="section-icon" />}
            {icon === 'star' && <StarOutlined className="section-icon" />}
            {title}
          </Title>
          <Button type="link" onClick={() => navigate(linkPath)}>
            {linkText}
          </Button>
        </div>
        <Row gutter={[16, 24]}>
          {productsToRender.map((product: Product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Link to={`/products/${product._id}`}>
                <Card
                  hoverable
                  className="product-card"
                  cover={
                    <div className="product-image-container">
                      <img 
                        alt={product.name} 
                        src={getImageUrl(product.image)} 
                        className="product-image"
                      />
                      {product.isNew && <div className="product-badge new">Nouveau</div>}
                      {product.isPromo && <div className="product-badge promo">Promo</div>}
                    </div>
                  }
                  actions={[
                    <div className="card-action" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                    }}>
                      <ShoppingCartOutlined /> Ajouter au panier
                    </div>
                  ]}
                >
                  <Meta
                    title={product.name}
                    description={
                      <div className="product-meta">
                        <div className="product-price">
                          {product.oldPrice && (
                            <span className="old-price">{product.oldPrice.toFixed(2)} FCFA</span>
                          )}
                          <span className="current-price">{product.price.toFixed(2)} FCFA</span>
                        </div>
                        <div className="product-rating">
                          <Rate disabled defaultValue={product.rating || 5} allowHalf />
                          <span className="stock-info">
                            {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </section>
    );
  };

  return (
    <div className="home-container">
      {/* Hero Carousel */}
      <Carousel autoplay className="hero-carousel">
        {heroImages.map((img, index) => (
          <div key={index} className="hero-slide">
            <div className="hero-image" style={{ backgroundImage: `url(${img})` }} />
            <div className="hero-overlay">
              <div className="hero-content">
                <Title level={1} className="hero-title">
                  {index === 0 && 'Découvrez EMarketAfrica'}
                  {index === 1 && 'Produits Africains de Qualité'}
                  {index === 2 && 'Livraison Rapide et Sécurisée'}
                </Title>
                <Button
                  type="primary"
                  size="large"
                  className="hero-button"
                  onClick={() => navigate('/products')}
                >
                  Voir nos produits
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Featured Categories */}
      <section className="categories-section">
        <Title level={2} className="section-title">
          Nos Catégories Populaires
        </Title>
       
      </section>

      {/* Featured Products */}
      {renderProductsSection(
        featuredProducts, 
        'Produits Tendances', 
        'fire', 
        'Voir tout', 
        '/products'
      )}
      

      {/* New Arrivals */}
      {renderProductsSection(
        newArrivals, 
        'Nouveaux Produits', 
        'star', 
        'Voir tout', 
        '/products?sort=newest'
      )}

      {/* Value Proposition */}
      <section className="value-proposition">
        <Row gutter={[24, 24]} justify="space-around">
          <Col xs={24} md={8}>
            <div className="value-item">
              <div className="value-icon">🚚</div>
              <Title level={4} className="value-title">Livraison Rapide</Title>
              <Text className="value-text">Livraison express dans toute l'Afrique</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="value-item">
              <div className="value-icon">🔒</div>
              <Title level={4} className="value-title">Paiement Sécurisé</Title>
              <Text className="value-text">Transactions 100% sécurisées</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="value-item">
              <div className="value-icon">👍</div>
              <Title level={4} className="value-title">Satisfaction Garantie</Title>
              <Text className="value-text">Retours faciles sous 14 jours</Text>
            </div>
          </Col>
        </Row>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <Title level={2} className="cta-title">
          Prêt à faire du shopping sur EMarketAfrica?
        </Title>
        <Paragraph className="cta-text">
          Découvrez notre large sélection de produits africains de qualité
        </Paragraph>
        <Space>
          <Button 
            type="primary" 
            size="large"
            className="cta-button"
            onClick={() => navigate('/products')}
          >
            Commencer à magasiner
          </Button>
          <Button 
            size="large"
            className="cta-button secondary"
            onClick={() => navigate('/about')}
          >
            Découvrir notre histoire
          </Button>
        </Space>
      </section>
    </div>
  );
};

export default Home;