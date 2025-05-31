import React from 'react';
import { Card, Rate, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

interface ProductCardProps {
  id: string;
  name: string;
  image?: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  oldPrice,
  rating = 0,
  stock,
  isNew,
  isPromo,
  viewMode = 'grid'
}) => {
  return (
    <Link to={`/products/${id}`}>
      <Card
        hoverable
        className={viewMode === 'list' ? 'product-card-list' : 'product-card-grid'}
        cover={viewMode === 'grid' && (
          <div className="product-image-container">
            <img
              alt={name}
              src={getImageUrl(image)}
              onError={handleImageError}
              className="product-image"
            />
            {isNew && (
              <Tag color="blue" className="ant-tag absolute" style={{ position: 'absolute', top: 8, left: 8 }}>
                Nouveau
              </Tag>
            )}
            {isPromo && (
              <Tag color="red" className="ant-tag absolute" style={{ position: 'absolute', top: 8, right: 8 }}>
                Promo
              </Tag>
            )}
          </div>
        )}
      >
        <div className="product-info">
          <div className="product-name" style={{ textTransform: 'uppercase' }}>{name}</div>
          <div className="price-container">
            {oldPrice && (
              <span className="old-price">
                {oldPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
              </span>
            )}
            <span className="current-price">
              {price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Rate disabled defaultValue={rating} allowHalf className="ant-rate" />
            <span className="text-sm text-gray-500">En stock ({stock})</span>
          </div>
          <button className="view-product-btn" type="button">
            <ShoppingCartOutlined style={{ marginRight: 8 }} /> Ajouter au panier
          </button>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;