import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, Product, deleteProduct } from '../services/productService';
import { useCart } from '../context/CartContext';
import { Button, InputNumber, message, Spin, Image, Tabs, Rate, Divider, Row, Col, Typography } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, ShareAltOutlined, EnvironmentOutlined, TruckOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedImage, setSelectedImage] = useState<string | undefined>('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await getProduct(id);
        setProduct(data);
        setSelectedImage(data.image);
      } catch (error) {
        message.error('Erreur lors du chargement du produit');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    message.success('Produit ajouté au panier');
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleDelete = async () => {
    if (!product) return;
    try {
      await deleteProduct(product._id);
      message.success('Produit supprimé avec succès');
      navigate('/products');
    } catch (error) {
      message.error('Erreur lors de la suppression du produit');
    }
  };

  const items = [
    {
      key: '1',
      label: 'Description',
      children: (
        <div className="prose max-w-none">
          <Paragraph>{product?.description}</Paragraph>
          {product?.longDescription && (
            <Paragraph>{product.longDescription}</Paragraph>
          )}
        </div>
      ),
    },
    {
      key: '2',
      label: 'Spécifications',
      children: product?.specifications && (
        <div className="space-y-2">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b">
              <Text strong>{key}:</Text>
              <Text>{value}</Text>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: '3',
      label: 'Livraison',
      children: (
        <div className="space-y-4">
          <div>
            <Title level={4}>Options de livraison</Title>
            <ul className="list-disc pl-6">
              <li>Livraison standard (3-5 jours ouvrables)</li>
              <li>Livraison express (1-2 jours ouvrables)</li>
              <li>Point relais disponible</li>
            </ul>
          </div>
          <div>
            <Title level={4}>Frais de livraison</Title>
            <ul className="list-disc pl-6">
              <li>Gratuit pour les commandes supérieures à 50,000 FCFA</li>
              <li>2,500 FCFA pour les commandes inférieures à 50,000 FCFA</li>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-10">
        <Title level={2}>Produit non trouvé</Title>
        <Button type="primary" onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Row gutter={[32, 32]}>
        {/* Galerie d'images */}
        <Col xs={24} md={12}>
          <div className="sticky top-4">
            <div className="mb-4">
              <Image
                src={getImageUrl(selectedImage)}
                alt={product.name}
                className="w-full h-auto rounded-lg"
                preview={false}
                onError={handleImageError}
              />
            </div>
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                <div
                  className={`cursor-pointer border-2 ${selectedImage === product.image ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(product.image)}
                >
                  <Image
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-20 object-cover rounded"
                    preview={false}
                    onError={handleImageError}
                  />
                </div>
                {product.additionalImages.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-2 ${selectedImage === image ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.name} - Image ${index + 2}`}
                      className="w-full h-20 object-cover rounded"
                      preview={false}
                      onError={handleImageError}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Informations produit */}
        <Col xs={24} md={12}>
          <div className="space-y-6">
            <div>
              <Title level={2}>{product.name}</Title>
              <div className="flex items-center space-x-4 mb-4">
                <Rate disabled defaultValue={product.rating || 0} />
                <Text type="secondary">({product.reviewCount || 0} avis)</Text>
              </div>
              <div className="flex items-center space-x-4">
                <Text className="text-2xl font-bold text-blue-600">
                  {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                </Text>
                {product.oldPrice && (
                  <Text delete type="secondary">
                    {product.oldPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                  </Text>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <EnvironmentOutlined />
                <Text>Livraison disponible dans votre région</Text>
              </div>
              <div className="flex items-center space-x-2">
                <TruckOutlined />
                <Text>Livraison gratuite à partir de 50,000 FCFA</Text>
              </div>
              <div className="flex items-center space-x-2">
                <SafetyCertificateOutlined />
                <Text>Garantie 30 jours satisfait ou remboursé</Text>
              </div>
            </div>

            <Divider />

            <div className="space-y-4">
              <div>
                <Text strong>Quantité:</Text>
                <InputNumber
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  className="ml-4"
                />
              </div>
              <div className="flex space-x-4">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  onClick={handleAddToCart}
                  className="flex-1"
                >
                  Ajouter au panier
                </Button>
                <Button
                  type="default"
                  icon={<HeartOutlined />}
                  size="large"
                  className="flex-1"
                >
                  Favoris
                </Button>
                <Button
                  type="default"
                  icon={<ShareAltOutlined />}
                  size="large"
                  className="flex-1"
                >
                  Partager
                </Button>
              </div>
              <Button
                type="primary"
                size="large"
                onClick={handleBuyNow}
                className="w-full"
              >
                Acheter maintenant
              </Button>
              {user?.role === 'admin' && (
                <Button danger type="primary" size="large" onClick={() => {
                  if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) handleDelete();
                }} className="w-full mt-2">
                  Supprimer ce produit
                </Button>
              )}
            </div>

            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetailPage;