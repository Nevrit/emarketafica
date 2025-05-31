import express, { Router } from 'express';
import * as productController from '../controllers/productController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Routes protégées (admin)
router.post('/', authMiddleware, productController.validateProduct, productController.createProduct);
router.put('/:id', authMiddleware, productController.validateProduct, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

export default router; 