import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Form, Input, Upload, message, Avatar, Tabs } from 'antd';
import { UserOutlined, CameraOutlined, ShoppingOutlined, HeartOutlined } from '@ant-design/icons';
import '../styles/Profile.css';

const { TabPane } = Tabs;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await updateUser(values);
      message.success('Profil mis à jour avec succès');
    } catch (error) {
      message.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="profile-tabs">
        <TabPane tab={<span><UserOutlined /> Profil</span>} key="profile">
          <Card className="profile-card">
            <div className="avatar-section">
              <Avatar 
                size={128} 
                icon={<UserOutlined />} 
                src={user?.avatar} 
                className="profile-avatar"
              />
              <Upload 
                showUploadList={false}
                beforeUpload={() => false}
                onChange={(info) => {
                  if (info.file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === 'string') {
                        updateUser({ avatar: reader.result });
                      }
                    };
                    reader.readAsDataURL(info.file as any);
                  }
                }}
              >
                <Button icon={<CameraOutlined />} className="avatar-upload-btn">
                  Changer la photo
                </Button>
              </Upload>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item name="name" label="Nom complet" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input disabled={!!user?.provider} />
              </Form.Item>

              <Form.Item name="password" label="Nouveau mot de passe" rules={[{ min: 6 }]}>
                <Input.Password placeholder="Laisser vide pour ne pas changer" />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Mettre à jour
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane tab={<span><ShoppingOutlined /> Commandes</span>} key="orders">
          <Card className="orders-card">
            <div className="empty-orders">
              <ShoppingOutlined className="empty-icon" />
              <p>Vous n'avez pas encore passé de commande</p>
              <Button type="primary" href="/products">
                Voir nos produits
              </Button>
            </div>
          </Card>
        </TabPane>

        <TabPane tab={<span><HeartOutlined /> Favoris</span>} key="wishlist">
          <Card className="wishlist-card">
            <div className="empty-wishlist">
              <HeartOutlined className="empty-icon" />
              <p>Votre liste de favoris est vide</p>
              <Button type="primary" href="/products">
                Découvrir nos produits
              </Button>
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfilePage;