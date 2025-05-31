import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Spin,
  message,
  Button,
  Space,
  Input,
  Select
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { Product } from '../services/productService';
import { Category } from '../services/categoryService';
import ProductCard from './ProductCard';

const { Title } = Typography;
const { Option } = Select;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      (typeof product.category === 'object' && product.category !== null && '_id' in product.category
        ? (product.category as { _id: string })._id === selectedCategory
        : product.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2}>Nos produits</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/products/add')}
          >
            Ajouter un produit
          </Button>
        </div>

        <Card>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              placeholder="Filtrer par catégorie"
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
              allowClear
            >
              {categories.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Space>

          <Row gutter={[24, 24]}>
            {filteredProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product._id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </Card>
      </Space>
    </div>
  );
};

export default ProductList; 