// src/components/products/AddProduct.tsx
import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addProduct } from '../../services/productService';

const AddProduct: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await addProduct(values);
      message.success('Produit ajouté avec succès!');
    } catch (error) {
      message.error('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item name="price" label="Prix" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="image" label="Image URL">
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        Ajouter le produit
      </Button>
    </Form>
  );
};

export default AddProduct;