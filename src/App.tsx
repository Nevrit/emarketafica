import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderComponent from './components/Header';
import FooterComponent from './components/Footer';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout className="app-layout">
          <Header className="app-header">
            <HeaderComponent />
          </Header>
          <Content className="app-content">
            <Outlet /> {/* Ceci rendra les composants des routes enfants */}
          </Content>
          <Footer className="app-footer">
            <FooterComponent />
          </Footer>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;