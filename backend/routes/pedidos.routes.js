import express from 'express';
import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  obtenerEstadisticas
} from '../controllers/pedidos.controller.js';
import { verificarToken, verificarRol } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas de pedidos requieren autenticación
router.use(verificarToken);

// Rutas accesibles por todos los roles autenticados
router.get('/', obtenerPedidos);
router.get('/estadisticas', verificarRol('admin'), obtenerEstadisticas);
router.get('/:id', obtenerPedidoPorId);

// Crear pedido (mesero y admin)
router.post('/', verificarRol('mesero', 'admin'), crearPedido);

// Actualizar estado (cocina y admin)
router.put('/:id', verificarRol('cocina', 'admin'), actualizarEstadoPedido);

export default router;
