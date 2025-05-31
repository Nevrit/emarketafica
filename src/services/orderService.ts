import client from '../api/client';
import { Product } from './productService';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'mobile_money' | 'cash';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const createOrder = async (orderData: {
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'mobile_money' | 'cash';
  notes?: string;
}): Promise<Order> => {
  try {
    const response = await client.post('/orders', orderData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await client.get('/orders');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrder = async (id: string): Promise<Order> => {
  try {
    const response = await client.get(`/orders/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
  try {
    const response = await client.patch(`/orders/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}; 