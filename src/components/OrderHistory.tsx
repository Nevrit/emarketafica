import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Space, 
  Tag, 
  Button,
  Empty,
  Spin
} from 'antd';
import { 
  CheckCircleOutlined,
  HistoryOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import '../styles/OrderConfirmation.css';

const { Title, Text } = Typography;

const PaymentHistory = () => {
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      // Récupérer l'historique depuis le localStorage ou initialiser avec un tableau vide
      const storedHistory = JSON.parse(localStorage.getItem('paymentSimulations')) || [];
      setPaymentHistory(storedHistory);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const columns = [
    {
      title: 'Référence',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Montant',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `FCFA ${amount.toFixed(2)}`,
      align: 'right',
    },
    {
      title: 'Méthode',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Statut',
      key: 'status',
      render: () => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Réussi
        </Tag>
      ),
    },
  ];

  return (
    <div className="history-container">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>
          <HistoryOutlined /> Historique des simulations
        </Title>

        <Text type="secondary">
          Consultez l'historique de vos simulations de paiement réussies
        </Text>

        <Card>
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text>Chargement de l'historique...</Text>
            </div>
          ) : paymentHistory.length > 0 ? (
            <Table
              columns={columns}
              dataSource={paymentHistory}
              rowKey="orderId"
              pagination={{ pageSize: 5 }}
              bordered
            />
          ) : (
            <Empty
              description="Aucune simulation de paiement trouvée"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => window.location.href = '/'}>
                <HomeOutlined /> Retour à l'accueil
              </Button>
            </Empty>
          )}
        </Card>

        <Space>
          <Button 
            type="default" 
            onClick={() => window.location.href = '/'}
            icon={<HomeOutlined />}
          >
            Accueil
          </Button>
          <Button 
            type="primary" 
            onClick={() => window.location.href = '/checkout'}
          >
            Nouvelle simulation
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default PaymentHistory;