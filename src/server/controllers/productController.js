// server/controllers/productController.js
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Validation rules
exports.validateProduct = [
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
exports.createProduct = asyncHandler(async (req, res) => {
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
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// Récupérer un produit par ID
exports.getProductById = asyncHandler(async (req, res) => {
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
exports.updateProduct = asyncHandler(async (req, res) => {
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
exports.deleteProduct = asyncHandler(async (req, res) => {
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