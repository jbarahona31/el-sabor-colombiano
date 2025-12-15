import express from 'express';
import { login, verificarSesion } from '../controllers/auth.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { authLimiter, generalLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Ruta de login con rate limiting estricto
router.post('/login', authLimiter, login);

// Ruta para verificar sesión
router.get('/verificar', generalLimiter, verificarToken, verificarSesion);

export default router;
