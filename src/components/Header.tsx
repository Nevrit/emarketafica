import React, { useState, useEffect } from 'react';
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  SearchOutlined, 
  HeartOutlined, 
  MenuOutlined, 
  LogoutOutlined, 
  DownOutlined,
  CloseOutlined,
  PlusOutlined 
} from '@ant-design/icons';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Badge } from 'antd';
import '../styles/HeaderComponent.css';
import { useAuth } from '../context/AuthContext';
import logo from '../../public/logob.jpg';

const HeaderComponent = () => {
  // États
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  // Données simulées (remplacer par votre état global)
  const totalItems = 3;
  const user = { name: "Arnaud", avatar: null };
  
  const navigate = useNavigate();
  
  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion");
    navigate('/');
  };

  // Navigation avec clés uniques
  const navItems = [
    { id: 'home', name: 'Accueil', path: '/' },
    { id: 'products', name: 'Produits', path: '/products' },
    { id: 'about', name: 'Propos', path: '/about' },
    { id: 'historique', name: 'Historique', path: '/OrderHistory' },
  ];

  // Gestion des clics hors du dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownOpen && 
          !event.target.closest('.user-dropdown') && 
          !event.target.closest('.user-avatar')) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userDropdownOpen]);

  // Gestion du scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  return (
    <header className={`header-component ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        {/* Logo et navigation */}
        <div className="header-logo-nav">
          <div className="mobile-menu-button" onClick={() => setMobileMenuOpen(true)}>
            <MenuOutlined />
          </div>
          
          <div className="logo-container">
        <Link to="/" className="site-logo">
          <img src={logo} alt="TechBoutique Logo" className="logo-image" />
        </Link>
      </div>
          <nav className="desktop-navigation">
            {navItems.map((item) => (
              <NavLink 
                key={item.id}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                {item.name}
                <span className="nav-item-underline"></span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Recherche desktop */}
        <div className={`search-section ${searchFocused ? 'focused' : ''}`}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="search-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <SearchOutlined className="search-icon" />
          </div>
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Bouton ajout rapide */}
          <Link 
            to="/add-product" 
            className="action-item quick-add-button"
            title="Ajouter un produit"
          >
            <PlusOutlined />
          </Link>

          {/* Bouton recherche mobile */}
          <div 
            className="action-item mobile-search-button"
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
          >
            <SearchOutlined />
          </div>

          {/* User dropdown */}
          <div className={`action-item user-dropdown ${userDropdownOpen ? 'open' : ''}`}>
            <div className="user-avatar" onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
              {user ? (
                <>
                  <div className="avatar-circle">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="avatar-image" />
                    ) : (
                      <UserOutlined />
                    )}
                  </div>
                  <span className="user-name">{user.name}</span>
                  <DownOutlined className="dropdown-icon" />
                </>
              ) : (
                <Link to="/login"><UserOutlined /></Link>
              )}
            </div>
            
            <div className="dropdown-menu">
              <Link to="/profile" className="dropdown-item">Mon Profil</Link>
              <Link to="/orders" className="dropdown-item">Mes Commandes</Link>
              <div className="dropdown-divider"></div>
              <button className="dropdown-button" onClick={handleLogout}>
                <LogoutOutlined className="dropdown-button-icon" />
                Déconnexion
              </button>
            </div>
          </div>
          
          {/* Wishlist */}
          
          
          {/* Cart */}
          <div className="action-item">
            <Link to="/orders">
              <ShoppingCartOutlined />
              {totalItems > 0 && <span className="badge blue">{totalItems}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {mobileSearchVisible && (
        <div className="mobile-search-bar visible">
          <div className="mobile-search-container">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="mobile-search-input"
            />
            <SearchOutlined className="mobile-search-icon" />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-menu-overlay mobile-menu-open" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          <div className="mobile-menu open">
            <div className="mobile-menu-header">
              <div className="mobile-menu-title">emarketafrica</div>
              <button 
                className="mobile-menu-close" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <CloseOutlined />
              </button>
            </div>
            
            {user && (
              <div className="mobile-user-section">
                <div className="mobile-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="avatar-image" />
                  ) : (
                    <UserOutlined />
                  )}
                </div>
                <div className="mobile-user-info">
                  <div className="mobile-user-name">{user.name}</div>
                  <button className="mobile-logout-button" onClick={handleLogout}>
                    <LogoutOutlined className="mobile-logout-icon" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
            
            <nav className="mobile-navigation">
              {navItems.map((item) => (
                <NavLink 
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <NavLink 
                to="/add-product"
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusOutlined style={{ marginRight: 8 }} />
                Ajouter Produit
              </NavLink>
            </nav>
            
            <div className="mobile-actions">
              <Link to="/profile" className="mobile-action-item" onClick={() => setMobileMenuOpen(false)}>
                <UserOutlined className="mobile-action-icon" />
                <span className="mobile-action-label">Profil</span>
              </Link>
              <Link to="/wishlist" className="mobile-action-item" onClick={() => setMobileMenuOpen(false)}>
                <HeartOutlined className="mobile-action-icon" />
                <span className="mobile-action-label">Favoris</span>
              </Link>
              <Link to="/cart" className="mobile-action-item" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCartOutlined className="mobile-action-icon" />
                <span className="mobile-action-label">Panier</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default HeaderComponent;