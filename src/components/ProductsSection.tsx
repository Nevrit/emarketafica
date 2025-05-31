// ProductsSection.jsx 
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag, Spin, Empty, Rate, Pagination, Input, Button, Space, Dropdown, Menu, message, Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { 
  SearchOutlined, 
  ShoppingCartOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  HeartOutlined,
  ShareAltOutlined,
  EyeOutlined
} from '@ant-design/icons';
import client from '../api/client';
import '../styles/ProductsPage.css';
import { getProducts, Product, deleteProduct } from '../services/productService';
import ProductCard from './ProductCard';
import { getImageUrl, handleImageError } from '../utils/imageUtils';
import { useAuth } from '../context/AuthContext';

const { Meta } = Card;

interface ProductsSectionProps {
  title: string;
  category?: string;
  limit?: number;
  showPagination?: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  title,
  category,
  limit = 8,
  showPagination = false
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        let filteredProducts = data;

        if (category) {
          filteredProducts = data.filter(product => product.category === category);
        }

        // Trier les produits
        filteredProducts.sort((a, b) => {
          if (sortOrder === 'asc') {
            return a.price - b.price;
          }
          return b.price - a.price;
        });

        setTotalProducts(filteredProducts.length);
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        setProducts(filteredProducts.slice(startIndex, endIndex));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, currentPage, limit, sortOrder]);

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      message.success('Produit supprimé avec succès');
    } catch (error) {
      message.error('Erreur lors de la suppression du produit');
    }
  };

  const productMenu = (productId: string) => (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => navigate(`/admin/products/edit/${productId}`)}>
        Modifier
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDeleteProduct(productId)}>
        Supprimer
      </Menu.Item>
    </Menu>
  );

  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Récupérer toutes les catégories uniques
  const categories = [...new Set(products.map(product => product.category).filter((cat): cat is string => typeof cat === 'string'))];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error-container">
        <p>Erreur: {error}</p>
        <button onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {title}
            </h2>
            {user?.role === 'admin' && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin/products/new')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Ajouter un produit
              </Button>
            )}
          </div>
          {category && (
            <Button 
              type="link" 
              onClick={() => navigate(`/category/${category}`)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir tout
            </Button>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="w-full md:w-1/3">
              <Input
                placeholder="Rechercher un produit..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input rounded-full border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                size="large"
              />
            </div>
            
            <Space size="middle">
              <Button 
                icon={<FilterOutlined />} 
                onClick={() => setShowFilters(!showFilters)}
                className={`${showFilters ? 'bg-blue-100 text-blue-600' : ''} rounded-full transition-all duration-300`}
              >
                Filtres
              </Button>
              <Button 
                icon={<SortAscendingOutlined />} 
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="rounded-full transition-all duration-300"
              >
                {sortOrder === 'asc' ? 'Prix croissant' : 'Prix décroissant'}
              </Button>
              <Space>
                <Tooltip title="Vue grille">
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => setViewMode('grid')}
                    className={`${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : ''} rounded-full`}
                  />
                </Tooltip>
                <Tooltip title="Vue liste">
                  <Button 
                    icon={<EyeOutlined rotate={90} />} 
                    onClick={() => setViewMode('list')}
                    className={`${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : ''} rounded-full`}
                  />
                </Tooltip>
              </Space>
            </Space>
          </div>

          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl">
              <div className="category-filters">
                <span className="category-label font-medium text-gray-700 mb-3 block">Catégories:</span>
                <div className="flex flex-wrap gap-2">
                  <Tag 
                    color={selectedCategory === null ? "blue" : "default"}
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className="category-tag cursor-pointer hover:opacity-80 transition-all duration-300 px-4 py-1 rounded-full"
                  >
                    Toutes
                  </Tag>
                  {categories.map(category => (
                    <Tag
                      key={category}
                      color={selectedCategory === category ? "blue" : "default"}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className="category-tag cursor-pointer hover:opacity-80 transition-all duration-300 px-4 py-1 rounded-full"
                    >
                      {category}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <div 
              key={product._id} 
              className={`relative group ${viewMode === 'list' ? 'bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300' : ''}`}
            >
              <ProductCard
                id={product._id}
                name={product.name}
                image={product.image}
                price={product.price}
                oldPrice={product.oldPrice}
                rating={product.rating}
                stock={product.stock}
                isNew={product.isNew}
                isPromo={product.isPromo}
                viewMode={viewMode}
              />
              {user?.role === 'admin' && (
                <div style={{ marginTop: 8, textAlign: 'center' }}>
                  <Button danger size="small" onClick={() => handleDeleteProduct(product._id)}>
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {showPagination && totalProducts > limit && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={totalProducts}
              pageSize={limit}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="bg-white p-4 rounded-xl shadow-md"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;