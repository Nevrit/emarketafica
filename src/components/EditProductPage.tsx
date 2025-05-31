import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  message,
  Upload,
  Space,
  Typography,
  Spin,
  Select,
  Switch
} from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getProduct, updateProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { uploadImage } from '../services/uploadService';
import { Category } from '../services/categoryService';
import { validateImageFile } from '../utils/imageUtils';

const { Title } = Typography;
const { Option } = Select;

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  category: string;
  images: string[];
  isNew: boolean;
  isPromo: boolean;
  specifications: Array<{
    name: string;
    value: string;
  }>;
}

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setInitialLoading(true);
        const [product, categoriesData] = await Promise.all([
          getProduct(id),
          getCategories()
        ]);

        form.setFieldsValue({
          name: product.name,
          description: product.description,
          price: product.price,
          oldPrice: product.oldPrice,
          stock: product.stock,
          category: typeof product.category === 'object' && product.category !== null ? product.category._id : product.category,
          isNew: product.isNew,
          isPromo: product.isPromo,
          specifications: product.specifications
        });

        setImageList(Array.isArray(product.image) ? product.image : product.image ? [product.image] : []);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Erreur lors du chargement des données');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, form]);

  const onFinish = async (values: ProductFormData) => {
    if (!id) return;

    try {
      setLoading(true);
      const specificationsObj: Record<string, string> = {};
      if (Array.isArray(values.specifications)) {
        values.specifications.forEach(spec => {
          if (spec.name) {
            specificationsObj[spec.name] = spec.value;
          }
        });
      }

      const productData = {
        ...values,
        images: imageList,
        specifications: specificationsObj
      };

      await updateProduct(id, productData);
      message.success('Produit mis à jour avec succès');
      navigate('/products');
    } catch (error) {
      console.error('Error updating product:', error);
      message.error('Erreur lors de la mise à jour du produit');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      validateImageFile(file);
      
      const response = await uploadImage(file);
      setImageList([...imageList, response.url]);
      return false;
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error(error instanceof Error ? error.message : 'Erreur lors du téléchargement de l\'image');
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
        <Title level={2}>Modifier le produit</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxWidth: 800 }}
        >
          <Form.Item
            name="name"
            label="Nom"
            rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Veuillez entrer la description du produit' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Catégorie"
            rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
          >
            <Select>
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Prix"
            rules={[{ required: true, message: 'Veuillez entrer le prix du produit' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
              addonAfter="XOF"
            />
          </Form.Item>

          <Form.Item
            name="oldPrice"
            label="Ancien prix"
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              addonAfter="XOF"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Veuillez entrer le stock disponible' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="isNew"
            label="Nouveau produit"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="isPromo"
            label="Produit en promotion"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Images"
            required
            tooltip="Au moins une image est requise pour le produit"
          >
            <Upload
              name="image"
              listType="picture"
              multiple
              beforeUpload={handleImageUpload}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                Ajouter une image
              </Button>
            </Upload>
            <div style={{ marginTop: 16 }}>
              {imageList.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Product ${index + 1}`}
                  style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 8 }}
                />
              ))}
            </div>
          </Form.Item>

          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Nom requis' }]}
                    >
                      <Input placeholder="Nom" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Valeur requise' }]}
                    >
                      <Input placeholder="Valeur" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Ajouter une spécification
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item>
            <Space>
              <Button onClick={() => navigate('/products')}>
                Annuler
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Mettre à jour le produit
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProductPage; 