// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { validateProduct } = productController;
const authMiddleware = require('../middleware/authMiddleware');

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Routes protégées (admin)
router.post('/', authMiddleware, validateProduct, productController.createProduct);
router.put('/:id', authMiddleware, validateProduct, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;