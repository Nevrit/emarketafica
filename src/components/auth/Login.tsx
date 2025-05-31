import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await login(values.email, values.password);
      message.success('Connexion réussie !');
    } catch (error) {
      message.error('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Bienvenue ! Connectez-vous pour accéder à votre compte.</p>
        </div>
        
        <Form onFinish={onFinish} layout="vertical" className="auth-form">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Email requis' }]}
          >
            <Input placeholder="Entrez votre email" className="auth-input" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[{ required: true, message: 'Mot de passe requis' }]}
          >
            <Input.Password placeholder="Entrez votre mot de passe" className="auth-input" />
          </Form.Item>
          
          <div className="auth-additional-options">
            <a href="#" className="forgot-password">Mot de passe oublié?</a>
          </div>
          
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="auth-button"
          >
            Se connecter
          </Button>
          
          <div className="auth-redirect">
            <p>Pas encore de compte? <a href="/register">S'inscrire</a></p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;