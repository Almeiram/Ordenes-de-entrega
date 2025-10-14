// src/routes/client.routes.ts
import { Router } from 'express';
import clientController from '../controllers/customer.controller';
import { authMiddleware } from '../middleware/validation.middleware';
import { checkDuplicateCustomerDocument } from '../middleware/validation.middleware';

const router = Router();

// Requisito 2a: Listar Clientes (Admin/Analista)
router.get(
  '/',
  authMiddleware(['administrador', 'analista']),
  clientController.listAllClients
);

// Requisito 2b: Buscar Cliente por Cédula (Admin/Analista) - POST para body parameter
router.post(
  '/search',
  authMiddleware(['administrador', 'analista']),
  clientController.searchClientByDocument
);

// CRUD Completo de Clientes - Crear (Admin only)
router.post(
    '/',
    authMiddleware(['administrador']),
    checkDuplicateCustomerDocument, // Requisito 6b
    clientController.createClient
);

// CRUD Completo de Clientes - Actualizar y Eliminar (Admin only)
router.put(
    '/:id',
    authMiddleware(['administrador']),
    clientController.updateClient
);

router.delete(
    '/:id',
    authMiddleware(['administrador']),
    clientController.deleteClient
);

export default router;
