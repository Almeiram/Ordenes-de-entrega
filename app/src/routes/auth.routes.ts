// src/routes/auth.routes.ts
import { Router } from 'express';
import authController from '../controllers/auth.controller';
// import { checkDuplicateUserDocument } from '../middlewares/validation.middleware'; // Optional: if you add user validation

const router = Router();

// Requisito 1a: Registro de usuarios
// router.post('/register', checkDuplicateUserDocument, authController.register); 
router.post('/register', authController.register); // Removed middleware dependency for simplicity in this file

// Requisito 1b: Inicio de sesión
router.post('/login', authController.login);

export default router;
