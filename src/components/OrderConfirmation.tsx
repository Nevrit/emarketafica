import React from 'react';
import { 
  Result, 
  Button, 
  Typography, 
  Card, 
  Space,
  Divider,
  Descriptions
} from 'antd';
import { 
  CheckCircleOutlined,
  ShoppingOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

const { Title, Text } = Typography;

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, amount, paymentMethod } = location.state || {};

  if (!orderId) {
    return (
      <div className="error-container">
        <Result
          status="error"
          title="Commande introuvable"
          subTitle="Désolé, nous n'avons pas pu trouver les détails de votre commande."
          extra={
            <Button type="primary" onClick={() => window.location.href = '/'}>
              Retour à l'accueil
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <Result
        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
        title="Commande confirmée !"
        subTitle={`Référence: ${orderId}`}
        extra={[
          <Button 
            type="primary" 
            key="shopping"
            icon={<ShoppingOutlined />}
            onClick={() => window.location.href = '/products'}
          >
            Continuer vos achats
          </Button>,
          <Button 
            key="home"
            icon={<HomeOutlined />}
            onClick={() => window.location.href = '/'}
          >
            Retour à l'accueil
          </Button>,
        ]}
      />

      <Card className="details-card">
        <Title level={4}>Détails de la commande</Title>
        <Divider />
        
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Référence">{orderId}</Descriptions.Item>
          <Descriptions.Item label="Montant total">FCFA{amount.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Méthode de paiement">{paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Statut">Confirmée</Descriptions.Item>
        </Descriptions>

        <Divider />

        <Space direction="vertical" size="middle">
          <Text strong>Prochaines étapes :</Text>
          <Text>1. Vous recevrez un email de confirmation sous peu</Text>
          <Text>2. Notre équipe prépare votre commande</Text>
          <Text>3. Vous serez notifié lors de l'expédition</Text>
        </Space>
      </Card>
    </div>
  );
};

export default OrderConfirmation;