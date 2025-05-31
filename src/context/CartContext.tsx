import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { notification } from 'antd';
import { Product as ServiceProduct } from '../services/productService';

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartProduct[]; // <-- Ajouté
  cartItems: CartProduct[];
  addToCart: (product: ServiceProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  
  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);
  
  // Mettre à jour le localStorage à chaque changement du panier
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    setTotalItems(cartItems.reduce((total, item) => total + item.quantity, 0));
  }, [cartItems]);

  const addToCart = (product: ServiceProduct, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      }];
    });
    
    notification.success({
      message: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier.`,
      placement: 'bottomRight',
      duration: 2,
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    
    notification.info({
      message: 'Produit retiré',
      description: 'Le produit a été retiré de votre panier.',
      placement: 'bottomRight',
      duration: 2,
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCartItems([]);
    notification.info({
      message: 'Panier vidé',
      description: 'Tous les produits ont été retirés de votre panier.',
      placement: 'bottomRight',
      duration: 2,
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart: cartItems,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateTotal,
      totalItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};