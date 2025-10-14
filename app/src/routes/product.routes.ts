// src/routes/product.routes.ts
import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// CRUD de Productos - Crear (Admin only)
router.post(
    '/',
    authMiddleware(['administrador']),
    productController.createProduct
);

// Requisito 4a: Retornar info completa por código (Admin/Analista)
router.get(
  '/:code',
  authMiddleware(['administrador', 'analista']),
  productController.getProductByCode
);

// Requisito 4b: Eliminar lógicamente (Admin only) - Usa DELETE
router.delete(
    '/:id',
    authMiddleware(['administrador']),
    productController.deleteProduct
);


export default router;
