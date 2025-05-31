// src/services/productService.ts
import client from '../api/client';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock: number;
  category?: string;
  brand?: string;
  weight?: number;
  dimensions?: string;
  specifications?: Record<string, string>;
  longDescription?: string;
  additionalImages?: string[];
  isNew?: boolean;
  isPromo?: boolean;
  oldPrice?: number;
  rating?: number;
  reviewCount?: number;
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await client.get('/products');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  try {
    const response = await client.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData: Partial<Product> & { image?: File; additionalImages?: File[] }): Promise<Product> => {
  try {
    const formData = new FormData();
    
    // Ajouter les champs texte
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'image' && key !== 'additionalImages') {
        formData.append(key, value.toString());
      }
    });

    // Ajouter l'image principale si elle existe
    if (productData.image) {
      formData.append('image', productData.image);
    }

    // Ajouter les images supplémentaires si elles existent
    if (productData.additionalImages) {
      productData.additionalImages.forEach((image) => {
        formData.append('additionalImages', image);
      });
    }

    const response = await client.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: Partial<Product> & { image?: File; additionalImages?: File[] }): Promise<Product> => {
  try {
    const formData = new FormData();
    
    // Ajouter les champs texte
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && key !== 'image' && key !== 'additionalImages') {
        formData.append(key, value.toString());
      }
    });

    // Ajouter l'image principale si elle existe
    if (productData.image) {
      formData.append('image', productData.image);
    }

    // Ajouter les images supplémentaires si elles existent
    if (productData.additionalImages) {
      productData.additionalImages.forEach((image) => {
        formData.append('additionalImages', image);
      });
    }

    const response = await client.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await client.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};