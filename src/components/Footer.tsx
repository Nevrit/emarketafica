import React from 'react';
import { Input, Button } from 'antd';
import { 
  EnvironmentOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  FacebookOutlined, 
  InstagramOutlined, 
  TwitterOutlined, 
  LinkedinOutlined,
  SendOutlined
} from '@ant-design/icons';
import '.././styles/FooterComponent.css';

const FooterComponent = () => {
  const socialIcons = [
    { icon: FacebookOutlined, color: 'facebook' },
    { icon: InstagramOutlined, color: 'instagram' },
    { icon: TwitterOutlined, color: 'twitter' },
    { icon: LinkedinOutlined, color: 'linkedin' }
  ];
  
  const quickLinks = ['Accueil', 'Produits', 'Nouveautés', 'Promotions', 'Blog'];
  const informationLinks = ['À Propos', 'Conditions Générales', 'Politique de Confidentialité', 'Livraison & Retours', 'FAQ'];
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Logo & About */}
          <div className="footer-about">
            <h3 className="footer-logo">E-MARKETAFRICA</h3>
            <p className="footer-description">
              Votre destination pour les dernières innovations technologiques. 
              Nous proposons une large gamme de produits de qualité supérieure 
              pour répondre à tous vos besoins.
            </p>
            
            <div className="social-icons">
              {socialIcons.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a 
                    key={index} 
                    href="#" 
                    className={`social-icon ${item.color}`}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
            
            <div className="newsletter">
              <h4 className="newsletter-title">Newsletter</h4>
              <div className="newsletter-form">
                <Input 
                  placeholder="Votre email" 
                  className="newsletter-input"
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  className="newsletter-button"
                />
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-heading">
              Liens Rapides
              <span className="footer-heading-line"></span>
            </h3>
            <ul className="footer-list">
              {quickLinks.map((item) => (
                <li key={item} className="footer-list-item">
                  <a href="#" className="footer-link">
                    <span className="footer-link-arrow">›</span> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Information */}
          <div className="footer-links">
            <h3 className="footer-heading">
              Informations
              <span className="footer-heading-line"></span>
            </h3>
            <ul className="footer-list">
              {informationLinks.map((item) => (
                <li key={item} className="footer-list-item">
                  <a href="#" className="footer-link">
                    <span className="footer-link-arrow">›</span> {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div className="footer-contact">
            <h3 className="footer-heading">
              Contact
              <span className="footer-heading-line"></span>
            </h3>
            <ul className="contact-list">
              <li className="contact-item">
                <EnvironmentOutlined className="contact-icon" />
                <span className="contact-text">225 Rue du Commerce</span>
              </li>
              <li className="contact-item">
                <PhoneOutlined className="contact-icon" />
                <span className="contact-text">+225 0778277697</span>
              </li>
              <li className="contact-item">
                <MailOutlined className="contact-icon" />
                <span className="contact-text">contact@emarketafrica.ci</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-container">
            <p className="copyright-text">
              © 2025 E-MARKETAFRICA. Tous droits réservés.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;