import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Spin,
  message,
  Typography,
  Space,
  Table
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getOrder } from '../services/orderService';
import { Order, OrderItem } from '../services/orderService';

const { Title } = Typography;

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getOrder(id);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        message.error('Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusColor = (status: Order['status']): string => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'processing';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Order['status']): string => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours de traitement';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Produit',
      dataIndex: 'product',
      key: 'product',
      render: (product: OrderItem['product']) => product.name
    },
    {
      title: 'Prix unitaire',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) =>
        price.toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'XOF'
        })
    },
    {
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: OrderItem) =>
        (record.price * record.quantity).toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'XOF'
        })
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Commande non trouvée</Title>
        <Button type="primary" onClick={() => navigate('/orders')}>
          Retour à la liste des commandes
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/orders')}
        >
          Retour à la liste des commandes
        </Button>

        <Card>
          <Title level={2}>Détails de la commande #{order._id.slice(-6).toUpperCase()}</Title>

          <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="Date de commande">
              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">
              <Tag color={getStatusColor(order.status)}>
                {getStatusText(order.status)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Total">
              {order.total.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'XOF'
              })}
            </Descriptions.Item>
          </Descriptions>

          <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>
            Adresse de livraison
          </Title>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nom complet">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {order.shippingAddress.email}
            </Descriptions.Item>
            <Descriptions.Item label="Téléphone">
              {order.shippingAddress.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Adresse">
              {order.shippingAddress.address}
            </Descriptions.Item>
            <Descriptions.Item label="Ville">
              {order.shippingAddress.city}
            </Descriptions.Item>
            <Descriptions.Item label="Pays">
              {order.shippingAddress.country}
            </Descriptions.Item>
          </Descriptions>

          <Title level={3} style={{ marginTop: 24, marginBottom: 16 }}>
            Articles commandés
          </Title>
          <Table
            columns={columns}
            dataSource={order.items}
            rowKey={(record) => record.product._id}
            pagination={false}
          />
        </Card>
      </Space>
    </div>
  );
};

export default OrderDetailPage; 