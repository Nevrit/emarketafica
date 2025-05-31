export interface Product {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    category: string;
    rating: number;
    isNew?: boolean;
    isPromo?: boolean;
    description: string;
  }
  
  export const products: Product[] = [
    {
      id: 1,
      name: "Smartphone Premium X12",
      price: 899.99,
      oldPrice: 999.99,
      image: "https://example.com/phone.jpg",
      category: "Électronique",
      rating: 4.7,
      isPromo: true,
      description: "Smartphone haut de gamme avec écran AMOLED"
    },
    {
      id: 2,
      name: "Casque Audio Sans Fil",
      price: 199.99,
      image: "https://example.com/headphones.jpg",
      category: "Électronique",
      rating: 4.5,
      isNew: true,
      description: "Casque avec réduction de bruit active"
    },
    // ... autres produits
  ];
  
  // Fonctions utilitaires pour filtrer les produits
  export const getPromoProducts = () => products.filter(product => product.isPromo);
  export const getNewProducts = () => products.filter(product => product.isNew);
  
  // Ou si vous préférez exporter directement les tableaux filtrés :
  export const promoProducts = products.filter(product => product.isPromo);
  export const newProducts = products.filter(product => product.isNew);
  export const electronicsProducts = products.filter(product => product.category === "Électronique");