import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Spin,
  message,
  Button,
  Space,
  Row,
  Col,
  Image,
  Descriptions,
  Tag,
  Rate,
  Divider
} from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProduct } from '../services/productService';
import { Product } from '../services/productService';
import DeleteProductModal from './DeleteProductModal';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const { Title, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        message.error('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3}>Produit non trouvé</Title>
        <Button type="primary" onClick={() => navigate('/products')}>
          Retour à la liste des produits
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/products')}
        >
          Retour à la liste des produits
        </Button>

        <Card>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Image.PreviewGroup>
                <Space wrap>
                    <Image
                      width={200}
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      onError={handleImageError}
                    />
                </Space>
              </Image.PreviewGroup>
            </Col>
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={2}>{product.name}</Title>
                  <Space>
                    {product.isNew && <Tag color="blue">Nouveau</Tag>}
                    {product.isPromo && <Tag color="red">Promotion</Tag>}
                  </Space>
                </div>

                <div>
                  <Title level={3}>
                    {product.price.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'XOF'
                    })}
                  </Title>
                  {product.oldPrice && (
                    <Paragraph delete type="secondary">
                      {product.oldPrice.toLocaleString('fr-FR', {
                        style: 'currency',
                        currency: 'XOF'
                      })}
                    </Paragraph>
                  )}
                </div>

                <Paragraph>{product.description}</Paragraph>

                <Descriptions title="Détails du produit" bordered>
                  <Descriptions.Item label="Catégorie">
                    {product.category}
                  </Descriptions.Item>
                  <Descriptions.Item label="Stock">
                    {product.stock} unités
                  </Descriptions.Item>
                  <Descriptions.Item label="Note">
                    <Rate disabled defaultValue={product.rating} />
                  </Descriptions.Item>
                </Descriptions>

                {Array.isArray(product.specifications) && product.specifications.length > 0 && (
                  <>
                    <Divider />
                    <Title level={4}>Spécifications</Title>
                    <Descriptions bordered>
                      {product.specifications.map((spec, index) => (
                        <Descriptions.Item key={index} label={spec.name}>
                          {spec.value}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </>
                )}

                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/products/edit/${product._id}`)}
                  >
                    Modifier
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setDeleteModalVisible(true)}
                  >
                    Supprimer
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>
      </Space>

      <DeleteProductModal
        productId={product._id}
        productName={product.name}
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onSuccess={() => navigate('/products')}
      />
    </div>
  );
};

export default ProductDetail; 