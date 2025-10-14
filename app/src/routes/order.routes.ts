// src/routes/order.routes.ts
import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateStockForOrder, validateOrderStatus } from '../middlewares/validation.middleware';

const router = Router();

// Requisito 5a: Creación de Órdenes (Admin only)
router.post(
    '/',
    authMiddleware(['administrador']),
    validateStockForOrder, // Requisito 6a: Middleware de stock
    orderController.createOrder
);

// Requisito 5b: Cambiar Estado de una Orden (Admin/Analista)
router.put(
    '/:id/status',
    authMiddleware(['administrador', 'analista']),
    validateOrderStatus, // Middleware para validar el nuevo estado (Requisito 3a)
    orderController.updateOrderStatus
);

// Requisito 5c: Historial de todas las Órdenes (Admin/Analista)
router.get(
  '/history',
  authMiddleware(['administrador', 'analista']),
  orderController.listAllOrdersHistory
);

// Requisito 1b: Consultar historial por cliente
router.get(
    '/customer/:customerId',
    authMiddleware(['administrador', 'analista']),
    orderController.listCustomerOrders
);

export default router;
