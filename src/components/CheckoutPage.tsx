import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Row, Col, Typography, Divider, message, Radio, Space } from 'antd';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';

const { Title, Text } = Typography;

interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: 'card' | 'mobile_money' | 'cash';
  notes?: string;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, calculateTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: OrderFormData) => {
    try {
      setLoading(true);

      const orderData = {
        items: cartItems,
        total: calculateTotal(),
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          city: values.city,
          country: values.country
        },
        paymentMethod: values.paymentMethod,
        notes: values.notes
      };

      const response = await createOrder(orderData);
      
      message.success('Commande passée avec succès');
      clearCart();
      navigate(`/order-confirmation/${response._id}`);
    } catch (error) {
      message.error('Erreur lors de la création de la commande');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-10">
        <Title level={2}>Votre panier est vide</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Continuer vos achats
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">Finaliser votre commande</Title>
      
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={16}>
          <Card title="Informations de livraison">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                email: user?.email,
                country: 'Sénégal',
                paymentMethod: 'mobile_money'
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="Prénom"
                    rules={[{ required: true, message: 'Veuillez entrer votre prénom' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Nom"
                    rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Veuillez entrer votre email' },
                      { type: 'email', message: 'Email invalide' }
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="phone"
                    label="Téléphone"
                    rules={[{ required: true, message: 'Veuillez entrer votre numéro de téléphone' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="address"
                label="Adresse"
                rules={[{ required: true, message: 'Veuillez entrer votre adresse' }]}
              >
                <Input.TextArea rows={3} />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="city"
                    label="Ville"
                    rules={[{ required: true, message: 'Veuillez entrer votre ville' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="country"
                    label="Pays"
                    rules={[{ required: true, message: 'Veuillez entrer votre pays' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item
                name="paymentMethod"
                label="Méthode de paiement"
                rules={[{ required: true, message: 'Veuillez sélectionner une méthode de paiement' }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="mobile_money">Mobile Money</Radio>
                    <Radio value="card">Carte bancaire</Radio>
                    <Radio value="cash">Paiement à la livraison</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="notes"
                label="Notes (optionnel)"
              >
                <Input.TextArea rows={4} placeholder="Instructions spéciales pour la livraison, etc." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                  Passer la commande
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Récapitulatif de la commande">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <Text strong>{item.name}</Text>
                    <br />
                    <Text type="secondary">Quantité: {item.quantity}</Text>
                  </div>
                  <Text>
                    {(item.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </Text>
                </div>
              ))}

              <Divider />

              <div className="flex justify-between items-center">
                <Text strong>Sous-total</Text>
                <Text>{calculateTotal().toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</Text>
              </div>

              <div className="flex justify-between items-center">
                <Text strong>Livraison</Text>
                <Text>Gratuite</Text>
              </div>

              <Divider />

              <div className="flex justify-between items-center">
                <Text strong>Total</Text>
                <Text strong className="text-lg">
                  {calculateTotal().toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;