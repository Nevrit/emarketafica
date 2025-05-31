import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button, Typography } from 'antd';
import { CheckCircleOutlined, ShoppingOutlined, HomeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '50px 24px' }}>
      <Result
        status="success"
        icon={<CheckCircleOutlined style={{ fontSize: 64 }} />}
        title="Commande confirmée !"
        subTitle={
          <Text type="secondary">
            Merci pour votre commande. Nous vous enverrons un email de confirmation avec les détails de votre commande.
          </Text>
        }
        extra={[
          <Button
            key="orders"
            type="primary"
            icon={<ShoppingOutlined />}
            onClick={() => navigate('/orders')}
          >
            Voir mes commandes
          </Button>,
          <Button
            key="home"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
          >
            Retour à l'accueil
          </Button>
        ]}
      />
    </div>
  );
};

export default OrderSuccess; 