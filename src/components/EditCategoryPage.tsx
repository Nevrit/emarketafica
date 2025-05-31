import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Upload,
  Space,
  Typography,
  Spin
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getCategory, updateCategory } from '../services/categoryService';
import { uploadImage } from '../services/uploadService';
import { Category } from '../services/categoryService';

const { Title } = Typography;

interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

const EditCategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;

      try {
        setInitialLoading(true);
        const category = await getCategory(id);
        form.setFieldsValue({
          name: category.name,
          description: category.description
        });
        setImageUrl(category.image);
      } catch (error) {
        console.error('Error fetching category:', error);
        message.error('Erreur lors du chargement de la catégorie');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategory();
  }, [id, form]);

  const onFinish = async (values: CategoryFormData) => {
    if (!id) return;

    try {
      setLoading(true);
      const categoryData = {
        ...values,
        image: imageUrl
      };

      await updateCategory(id, categoryData);
      message.success('Catégorie mise à jour avec succès');
      navigate('/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      message.error('Erreur lors de la mise à jour de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await uploadImage(formData);
      setImageUrl(response.url);
      return false;
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Erreur lors du téléchargement de l\'image');
      return false;
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Modifier la catégorie</Title>
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
                Mettre à jour la catégorie
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditCategoryPage; 