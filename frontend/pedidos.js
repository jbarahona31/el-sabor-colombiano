// Módulo para gestión de pedidos
// Este módulo se puede importar en cualquier página que necesite trabajar con pedidos

import { pedidosAPI } from './api.js';

// Obtener pedidos con filtro opcional
export const obtenerPedidos = async (estado = '') => {
  return await pedidosAPI.obtenerTodos(estado);
};

// Crear un nuevo pedido
export const crearPedido = async (mesa, productos) => {
  return await pedidosAPI.crear({ mesa, productos });
};

// Actualizar el estado de un pedido
export const actualizarEstadoPedido = async (id, estado) => {
  return await pedidosAPI.actualizarEstado(id, estado);
};

// Formatear pedido para mostrar
export const formatearPedido = (pedido) => {
  return {
    ...pedido,
    fecha: new Date(pedido.created_at).toLocaleString(),
    horaCreacion: new Date(pedido.created_at).toLocaleTimeString(),
    totalFormateado: `$${parseFloat(pedido.total).toLocaleString()}`
  };
};

// Calcular tiempo transcurrido desde la creación del pedido
export const calcularTiempoTranscurrido = (fechaCreacion) => {
  const ahora = new Date();
  const creacion = new Date(fechaCreacion);
  const diferencia = ahora - creacion;
  
  const minutos = Math.floor(diferencia / 60000);
  
  if (minutos < 60) {
    return `${minutos} min`;
  }
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  return `${horas}h ${minutosRestantes}min`;
};

// Estados válidos de pedidos
export const ESTADOS_PEDIDO = {
  PENDIENTE: 'pendiente',
  PREPARANDO: 'preparando',
  LISTO: 'listo',
  ENTREGADO: 'entregado'
};

// Obtener color para el estado
export const getColorEstado = (estado) => {
  const colores = {
    pendiente: '#ffc107',
    preparando: '#17a2b8',
    listo: '#28a745',
    entregado: '#6c757d'
  };
  return colores[estado] || '#999';
};
