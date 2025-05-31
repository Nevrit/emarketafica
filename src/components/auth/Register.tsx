import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Auth.css';

const Register: React.FC = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await register(values.username, values.email, values.password);
      message.success("Inscription réussie !");
    } catch (error) {
      message.error("Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Créer un compte</h1>
          <p>Rejoignez-nous en quelques étapes simples</p>
        </div>
        
        <Form onFinish={onFinish} layout="vertical" className="auth-form">
          <Form.Item
            name="username"
            label="Nom d'utilisateur"
            rules={[{ required: true, message: "Nom d'utilisateur requis" }]}
          >
            <Input placeholder="Choisissez un nom d'utilisateur" className="auth-input" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Email valide requis' }]}
          >
            <Input placeholder="Entrez votre email" className="auth-input" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Mot de passe"
            rules={[
              { required: true, message: 'Mot de passe requis' },
              { min: 8, message: 'Le mot de passe doit contenir au moins 8 caractères' }
            ]}
          >
            <Input.Password placeholder="Créez un mot de passe sécurisé" className="auth-input" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirmer le mot de passe"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Veuillez confirmer votre mot de passe' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Les mots de passe ne correspondent pas'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirmez votre mot de passe" className="auth-input" />
          </Form.Item>
          
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="auth-button"
          >
            S'inscrire
          </Button>
          
          <div className="auth-redirect">
            <p>Déjà un compte? <a href="/login">Se connecter</a></p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;