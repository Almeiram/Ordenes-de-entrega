// src/routes/warehouse.routes.ts
import { Router } from 'express';
import warehouseController from '../controllers/warehouse.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Requisito 3b: Listar Bodegas Activas (Admin/Analista)
router.get(
  '/',
  authMiddleware(['administrador', 'analista']),
  warehouseController.listActiveWarehouses
);

// CRUD de Bodegas - Crear (Admin only)
router.post(
    '/',
    authMiddleware(['administrador']),
    warehouseController.createWarehouse
);

// Requisito 3a: Activar/Inactivar Bodega (Admin only) - Usa PUT para actualizar estado
router.put(
  '/:id/status',
  authMiddleware(['administrador']),
  warehouseController.updateWarehouseStatus
);


export default router;
