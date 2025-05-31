import client from '../api/client';
import { User } from './authService';

export interface Address {
  _id: string;
  user: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await client.get('/users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (id: string): Promise<User> => {
  try {
    const response = await client.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await client.post('/users', userData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await client.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await client.delete(`/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const response = await client.get(`/users/${userId}/orders`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  try {
    const response = await client.get(`/users/${userId}/addresses`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

export const addUserAddress = async (userId: string, addressData: Partial<Address>): Promise<Address> => {
  try {
    const response = await client.post(`/users/${userId}/addresses`, addressData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding user address:', error);
    throw error;
  }
};

export const updateUserAddress = async (
  userId: string,
  addressId: string,
  addressData: Partial<Address>
): Promise<Address> => {
  try {
    const response = await client.put(
      `/users/${userId}/addresses/${addressId}`,
      addressData
    );
    return response.data.data;
  } catch (error) {
    console.error('Error updating user address:', error);
    throw error;
  }
};

export const deleteUserAddress = async (userId: string, addressId: string): Promise<void> => {
  try {
    await client.delete(`/users/${userId}/addresses/${addressId}`);
  } catch (error) {
    console.error('Error deleting user address:', error);
    throw error;
  }
}; 