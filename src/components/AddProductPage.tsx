import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Button, Upload, Select, message, Space, Card } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { createProduct } from '../services/productService';
import { Product } from '../services/productService';

const { TextArea } = Input;
const { Option } = Select;

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      
      // Préparer les données du produit
      const productData: Partial<Product> & { image?: File; additionalImages?: File[] } = {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        category: values.category,
        brand: values.brand,
        weight: values.weight,
        dimensions: values.dimensions,
        specifications: values.specifications,
        longDescription: values.longDescription,
        isNew: values.isNew || false,
        isPromo: values.isPromo || false,
        oldPrice: values.oldPrice,
        rating: values.rating || 0,
        reviewCount: values.reviewCount || 0,
        image: values.image?.[0]?.originFileObj,
        additionalImages: values.additionalImages?.map((file: any) => file.originFileObj)
      };

      // Créer le produit
      const response = await createProduct(productData);
      
      message.success('Produit créé avec succès');
      navigate(`/products/${response._id}`);
    } catch (error) {
      message.error('Erreur lors de la création du produit');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card title="Ajouter un nouveau produit" className="max-w-4xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isNew: false,
            isPromo: false,
            rating: 0,
            reviewCount: 0
          }}
        >
          <Form.Item
            name="name"
            label="Nom du produit"
            rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description courte"
            rules={[{ required: true, message: 'Veuillez entrer une description' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="longDescription"
            label="Description détaillée"
          >
            <TextArea rows={6} />
          </Form.Item>

          <Space className="w-full" size="large">
            <Form.Item
              name="price"
              label="Prix"
              rules={[{ required: true, message: 'Veuillez entrer le prix' }]}
            >
              <InputNumber
                min={0}
                step={100}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser removed to fix type error
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Form.Item
              name="oldPrice"
              label="Ancien prix"
            >
              <InputNumber
                min={0}
                step={100}
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Space>

          <Space className="w-full" size="large">
            <Form.Item
              name="stock"
              label="Stock"
              rules={[{ required: true, message: 'Veuillez entrer le stock' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Catégorie"
              rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
            >
              <Select>
                <Option value="electronics">Électronique</Option>
                <Option value="clothing">Vêtements</Option>
                <Option value="home">Maison</Option>
                <Option value="beauty">Beauté</Option>
                <Option value="sports">Sports</Option>
              </Select>
            </Form.Item>
          </Space>

          <Space className="w-full" size="large">
            <Form.Item
              name="brand"
              label="Marque"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="weight"
              label="Poids (kg)"
            >
              <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item
            name="dimensions"
            label="Dimensions"
          >
            <Input placeholder="ex: 10x20x30 cm" />
          </Form.Item>

          <Form.List name="specifications">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      rules={[{ required: true, message: 'Clé manquante' }]}
                    >
                      <Input placeholder="Clé" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: 'Valeur manquante' }]}
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

          <Form.Item
            name="image"
            label="Image principale"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Veuillez télécharger une image' }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="additionalImages"
            label="Images supplémentaires"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              listType="picture"
              multiple
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

          <Space className="w-full" size="large">
            <Form.Item
              name="isNew"
              valuePropName="checked"
            >
              <Select>
                <Option value={true}>Nouveau</Option>
                <Option value={false}>Non nouveau</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="isPromo"
              valuePropName="checked"
            >
              <Select>
                <Option value={true}>Promo</Option>
                <Option value={false}>Non promo</Option>
              </Select>
            </Form.Item>
          </Space>

          <Space className="w-full" size="large">
            <Form.Item
              name="rating"
              label="Note"
            >
              <InputNumber min={0} max={5} step={0.1} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="reviewCount"
              label="Nombre d'avis"
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Créer le produit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddProductPage;