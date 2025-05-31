import React from 'react';
import { Table, Button, InputNumber, Space, Typography, Card, Divider, Popconfirm, message, Image, Badge} from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, ArrowLeftOutlined,CreditCardOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/OrderPage.css';

const { Title, Text } = Typography;

type CartProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

const OrderPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    calculateTotal,
    totalItems
  } = useCart();
  const navigate = useNavigate();

  const columns: import('antd').ColumnsType<CartProduct> = [
    {
      title: 'Produit',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, record: CartProduct) => {
        console.log("📸 Image URL :", record.image); // 👈 ICI
        return (
          <div className="product-cell">
            <Image
              src={record.image?.startsWith('http') ? record.image : `https://ecommerce-backend-2-12tl.onrender.com${record.image}`}
              alt={record.name ? String(record.name) : ''}
              width={80}
              height={80}
              fallback={record.image?.startsWith('http') ? record.image : `https://ecommerce-backend-2-12tl.onrender.com${record.image}`}
              preview={false}
              className="product-image"
            />
            <div className="product-info">
              <Text strong>{record.name}</Text>
              <Text type="secondary">#{record.id}</Text>
            </div>
          </div>
        );
      }
    },
    
    {
      title: 'Prix unitaire',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text strong>FCFA{price.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Quantité',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: CartProduct) => (
        <InputNumber
          min={1}
          max={99}
          defaultValue={quantity}
          onChange={(value) => value !== null && updateQuantity(String(record.id), value as number)}
          className="quantity-input"
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, record: CartProduct) => (
        <Text strong>FCFA{(record.price * record.quantity).toFixed(2)}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CartProduct) => (
        <Popconfirm
          title="Supprimer ce produit ?"
          onConfirm={() => {
            removeFromCart(String(record.id));
            message.success('Produit retiré du panier');
          }}
          okText="Oui"
          cancelText="Non"
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            aria-label="Supprimer"
          />
        </Popconfirm>
      ),
    },
  ];

  console.log("columns",columns);

  const handleCheckout = () => {
    navigate('/checkout');
    message.success('Redirection vers la page de paiement');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <Card className="empty-cart-card">
          <Space direction="vertical" align="center" size="large">
            <ShoppingCartOutlined className="empty-cart-icon" />
            <Title level={3}>Votre panier est vide</Title>
            <Text type="secondary">Ajoutez des produits pour continuer</Text>
            <Button 
              type="primary" 
              onClick={() => navigate('/products')}
            >
              Voir les produits
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="order-page-container">
      <div className="order-header">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Retour
        </Button>
        <Title level={2} className="page-title">
          Mon Panier
        </Title>
      </div>

      <div className="order-content">
        <div className="products-section">
          <Table
            columns={columns}
            dataSource={cartItems}
            rowKey="id"
            pagination={false}
            className="cart-table"
            footer={() => (
              <div className="table-footer">
                <Popconfirm
                  title="Vider tout le panier ?"
                  onConfirm={() => {
                    clearCart();
                    message.success('Panier vidé');
                  }}
                  okText="Oui"
                  cancelText="Non"
                >
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                  >
                    Vider le panier
                  </Button>
                </Popconfirm>
              </div>
            )}
          />
        </div>

        <div className="summary-section">
          <Card className="summary-card">
            <Title level={4} className="summary-title">
              Récapitulatif
            </Title>
            
            <Divider className="summary-divider" />
            
            <Space direction="vertical" size="middle" className="summary-details">
              <div className="summary-row">
                <Text>Articles ({totalItems})</Text>
                <Text>FCFA{calculateTotal().toFixed(2)}</Text>
              </div>
              <div className="summary-row">
                <Text>Livraison</Text>
                <Text strong>Gratuite</Text>
              </div>
              
              <Divider className="summary-divider" />
              
              <div className="summary-row total-row">
                <Text strong>Total TTC</Text>
                <Title level={4} className="total-amount">
                  FCFA{calculateTotal().toFixed(2)}
                </Title>
              </div>
            </Space>
            
            <Button
              type="primary"
              block
              size="large"
              icon={<CreditCardOutlined />}
              onClick={handleCheckout}
              className="checkout-button"
            >
              Passer la commande
            </Button>
            
            <Divider className="summary-divider" />
            
            <Text type="secondary" className="secure-payment-text">
              Paiement sécurisé avec chiffrement SSL
            </Text>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;