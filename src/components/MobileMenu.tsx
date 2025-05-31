import React, { useEffect } from 'react';
import { 
  UserOutlined, 
  HeartOutlined, 
  ShoppingCartOutlined, 
  LogoutOutlined,
  CloseOutlined 
} from '@ant-design/icons';
import { Link, NavLink } from 'react-router-dom';
import '../styles/HeaderComponent.css';

const MobileMenu = ({ open, onClose, navItems, user, onLogout }) => {
  // Prévenir le défilement du body quand le menu mobile est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <>
      <div 
        className={`mobile-menu-overlay ${open ? 'mobile-menu-open' : ''}`} 
        onClick={onClose}
      ></div>
      
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {/* En-tête du menu mobile */}
        <div className="mobile-menu-header">
          <div className="mobile-menu-title">Emarketafrica</div>
          <button className="mobile-menu-close" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>
        
        {/* Section utilisateur dans le menu mobile */}
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
              <button className="mobile-logout-button" onClick={onLogout}>
                <LogoutOutlined className="mobile-logout-icon" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
        
        {/* Navigation mobile */}
        <nav className="mobile-navigation">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        
        {/* Actions rapides mobile */}
        <div className="mobile-actions">
          <Link to="/profile" className="mobile-action-item" onClick={onClose}>
            <UserOutlined className="mobile-action-icon" />
            <span className="mobile-action-label">Profil</span>
          </Link>
          <Link to="/wishlist" className="mobile-action-item" onClick={onClose}>
            <HeartOutlined className="mobile-action-icon" />
            <span className="mobile-action-label">Favoris</span>
          </Link>
          <Link to="/cart" className="mobile-action-item" onClick={onClose}>
            <ShoppingCartOutlined className="mobile-action-icon" />
            <span className="mobile-action-label">Panier</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;