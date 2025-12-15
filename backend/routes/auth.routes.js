import express from 'express';
import { login, verificarSesion } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta de login
router.post('/login', login);

// Ruta para verificar sesión
router.get('/verificar', verificarToken, verificarSesion);

export default router;
