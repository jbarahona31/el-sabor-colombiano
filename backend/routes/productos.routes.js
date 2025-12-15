import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productos.controller.js';
import { verificarToken, verificarRol } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, verificarRol('admin'), crearProducto);
router.put('/:id', verificarToken, verificarRol('admin'), actualizarProducto);
router.delete('/:id', verificarToken, verificarRol('admin'), eliminarProducto);

export default router;
