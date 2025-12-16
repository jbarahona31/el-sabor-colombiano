import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productos.controller.js';
import { verificarToken, verificarRol } from '../middlewares/auth.middleware.js';
import { generalLimiter, writeLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Rutas públicas con rate limiting general
router.get('/', generalLimiter, obtenerProductos);
router.get('/:id', generalLimiter, obtenerProductoPorId);

// Rutas protegidas (solo admin) con rate limiting para escritura
router.post('/', writeLimiter, verificarToken, verificarRol('admin'), crearProducto);
router.put('/:id', writeLimiter, verificarToken, verificarRol('admin'), actualizarProducto);
router.delete('/:id', writeLimiter, verificarToken, verificarRol('admin'), eliminarProducto);

export default router;
