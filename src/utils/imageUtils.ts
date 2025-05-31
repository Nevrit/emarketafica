export const getImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return '/images/placeholder-product.jpg';
  
  // Si l'URL est déjà complète
  if (imagePath.startsWith('http')) return imagePath;
  
  // Si l'URL est relative, ajouter le domaine du backend
  return `https://ecommerce-backend-2-12tl.onrender.com${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = '/images/placeholder-product.jpg';
  e.currentTarget.onerror = null; // Empêcher les boucles infinies
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    throw new Error('Format d\'image non supporté. Utilisez JPEG, PNG ou WebP.');
  }
  
  if (file.size > maxSize) {
    throw new Error('L\'image ne doit pas dépasser 5MB.');
  }
  
  return true;
}; 