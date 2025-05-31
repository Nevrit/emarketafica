import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Table,
  InputNumber,
  Space,
  Typography,
  Empty,
  Divider
} from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';

// Define CartItem type here if not exported from CartContext
type CartItem = {
  product: {
    _id: string;
    name: string;
    image: string;
    price: number;
    stock: number;
  };
  quantity: number;
};

const { Title } = Typography;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  // Ensure cart is typed as CartItem[] if possible, or map to CartItem if needed
  const typedCart: CartItem[] = (cart as any[]).map((item) => {
    // If item already has 'product', return as is; otherwise, adapt structure
    if ('product' in item && 'quantity' in item) {
      return item as CartItem;
    }
    // If item is a CartProduct, adapt to CartItem structure (update as needed)
    return {
      product: {
        _id: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        stock: item.stock,
      },
      quantity: item.quantity ?? 1,
    };
  });

  const total = typedCart.reduce(
    (sum: number, item: CartItem) => sum + item.product.price * item.quantity,
    0
  );

  const columns = [
    {
      title: 'Produit',
      dataIndex: 'product',
      key: 'product',
      render: (product: CartItem['product']) => (
        <Space>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: 50, height: 50, objectFit: 'cover' }}
          />
          <span>{product.name}</span>
        </Space>
      )
    },
    {
      title: 'Prix',
      dataIndex: 'product',
      key: 'price',
      render: (product: CartItem['product']) =>
        product.price.toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'XOF'
        })
    },
    {
      title: 'Quantité',
      key: 'quantity',
      render: (record: CartItem) => (
        <InputNumber
          min={1}
          max={record.product.stock}
          value={record.quantity}
          onChange={(value) => updateQuantity(record.product._id, value || 1)}
        />
      )
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: CartItem) =>
        (record.product.price * record.quantity).toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'XOF'
        })
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.product._id)}
        />
      )
    }
  ];

  if (cart.length === 0) {
    return (
      <div style={{ padding: '50px 24px', textAlign: 'center' }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Button
              type="primary"
              icon={<ShoppingOutlined />}
              onClick={() => navigate('/products')}
            >
              Continuer vos achats
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Votre panier</Title>
        <Table
          columns={columns}
          dataSource={typedCart}
          rowKey={(record: CartItem) => record.product._id}
          pagination={false}
        />

        <Divider />

        <div style={{ textAlign: 'right' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>
              Total: {total.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'XOF'
              })}
            </div>
            <Space>
              <Button onClick={() => navigate('/products')}>
                Continuer vos achats
              </Button>
              <Button
                type="primary"
                onClick={() => navigate('/checkout')}
              >
                Passer la commande
              </Button>
            </Space>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default CartPage; 