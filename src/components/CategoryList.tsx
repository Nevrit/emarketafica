import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Spin, message } from 'antd';
import { getCategories } from '../services/categoryService';
import { Category } from '../services/categoryService';

const { Title } = Typography;

const CategoryList: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        message.error('Erreur lors du chargement des catégories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Nos catégories
      </Title>
      <Row gutter={[24, 24]}>
        {categories.map((category) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category._id}>
            <Card
              hoverable
              cover={
                <img
                  alt={category.name}
                  src={category.image}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
              onClick={() => navigate(`/categories/${category._id}`)}
            >
              <Card.Meta
                title={category.name}
                description={category.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CategoryList; 