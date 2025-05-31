import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import Product, { IProduct } from '../models/Product';

// Validation rules
export const validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Le nom doit contenir au moins 3 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('image')
    .optional()
    .isURL()
    .withMessage('L\'image doit être une URL valide')
];

// Créer un produit
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = new Product(req.body);
  await product.save();
  
  res.status(201).json({
    success: true,
    data: product
  });
});

// Récupérer tous les produits
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find().sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// Récupérer un produit par ID
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produit non trouvé'
    });
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
});

// Mettre à jour un produit
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produit non trouvé'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// Supprimer un produit
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Produit non trouvé'
    });
  }

  res.status(200).json({
    success: true,
    data: {}
  });
}); 