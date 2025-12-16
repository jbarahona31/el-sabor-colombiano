import express from 'express';
import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  obtenerEstadisticas
} from '../controllers/pedidos.controller.js';
import { verificarToken, verificarRol } from '../middlewares/auth.middleware.js';
import { generalLimiter, writeLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Todas las rutas de pedidos requieren autenticación
router.use(verificarToken);

// Rutas accesibles por todos los roles autenticados con rate limiting
router.get('/', generalLimiter, obtenerPedidos);
router.get('/estadisticas', generalLimiter, verificarRol('admin'), obtenerEstadisticas);
router.get('/:id', generalLimiter, obtenerPedidoPorId);

// Crear pedido (mesero y admin) con rate limiting para escritura
router.post('/', writeLimiter, verificarRol('mesero', 'admin'), crearPedido);

// Actualizar estado (cocina y admin) con rate limiting para escritura
router.put('/:id', writeLimiter, verificarRol('cocina', 'admin'), actualizarEstadoPedido);

export default router;
