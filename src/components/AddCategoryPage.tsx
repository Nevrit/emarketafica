import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Upload,
  Space,
  Typography
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createCategory } from '../services/categoryService';
import { uploadImage } from '../services/uploadService';

const { Title } = Typography;

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

const AddCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const onFinish = async (values: CategoryFormData) => {
    try {
      setLoading(true);
      const categoryData = {
        ...values,
        image: imageUrl
      };

      await createCategory(categoryData);
      message.success('Catégorie créée avec succès');
      navigate('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      message.error('Erreur lors de la création de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadImage(file);
      setImageUrl(response.url);
      return false;
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Erreur lors du téléchargement de l\'image');
      return false;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Ajouter une catégorie</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom de la catégorie' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez entrer la description de la catégorie' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Image"
            required
            tooltip="L'image est requise pour la catégorie"
          >
            <Upload
              name="image"
              listType="picture"
              maxCount={1}
              beforeUpload={handleImageUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                {imageUrl ? 'Changer l\'image' : 'Télécharger une image'}
              </Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 16 }}>
                <img
                  src={imageUrl}
                  alt="Category preview"
                  style={{ maxWidth: 200, maxHeight: 200 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => navigate('/categories')}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Créer la catégorie
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCategoryPage; 