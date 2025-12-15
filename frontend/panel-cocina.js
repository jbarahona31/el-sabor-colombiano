import { pedidosAPI, mostrarMensaje } from './api.js';
import { protegerPagina, inicializarCerrarSesion } from './auth.js';

// Proteger la página - solo cocina y admins
if (!protegerPagina(['cocina', 'admin'])) {
  throw new Error('Acceso no autorizado');
}

// Inicializar cerrar sesión
inicializarCerrarSesion();

// Estado
let pedidos = [];
let ultimoConteo = 0;

// Elementos del DOM
const pedidosPendientesDiv = document.getElementById('pedidosPendientes');
const pedidosPreparandoDiv = document.getElementById('pedidosPreparando');
const pedidosListosDiv = document.getElementById('pedidosListos');
const notificacionAudio = document.getElementById('notificacionAudio');
const sonidoActivado = document.getElementById('sonidoActivado');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  cargarPedidos();
  configurarEventos();
  
  // Auto-actualizar cada 5 segundos
  setInterval(cargarPedidos, 5000);
});

// Cargar pedidos
async function cargarPedidos() {
  try {
    pedidos = await pedidosAPI.obtenerTodos();
    
    // Filtrar por estado
    const pendientes = pedidos.filter(p => p.estado === 'pendiente');
    const preparando = pedidos.filter(p => p.estado === 'preparando');
    const listos = pedidos.filter(p => p.estado === 'listo');
    
    // Verificar si hay nuevos pedidos y reproducir sonido
    if (pendientes.length > ultimoConteo && sonidoActivado.checked) {
      reproducirNotificacion();
    }
    ultimoConteo = pendientes.length;
    
    // Actualizar contadores
    document.getElementById('countPendientes').textContent = pendientes.length;
    document.getElementById('countPreparando').textContent = preparando.length;
    
    // Renderizar
    renderizarPedidos(pedidosPendientesDiv, pendientes, 'pendiente');
    renderizarPedidos(pedidosPreparandoDiv, preparando, 'preparando');
    renderizarPedidos(pedidosListosDiv, listos, 'listo');
    
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
}

// Renderizar pedidos en tarjetas grandes
function renderizarPedidos(container, pedidosLista, estado) {
  if (pedidosLista.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay pedidos en este estado</p>';
    return;
  }

  container.innerHTML = pedidosLista.map(pedido => {
    const fecha = new Date(pedido.created_at);
    const tiempoTranscurrido = calcularTiempoTranscurrido(fecha);
    
    return `
      <div class="pedido-cocina-card ${tiempoTranscurrido > 15 ? 'urgente' : ''}">
        <div class="pedido-cocina-header">
          <h3>Pedido #${pedido.id}</h3>
          <div class="mesa-badge">Mesa ${pedido.mesa}</div>
        </div>
        
        <div class="pedido-cocina-tiempo">
          <span>⏱️ ${tiempoTranscurrido} min</span>
          <span class="hora">${fecha.toLocaleTimeString()}</span>
        </div>
        
        <div class="pedido-cocina-productos">
          ${pedido.productos.map(p => `
            <div class="producto-cocina-item">
              <span class="cantidad">x${p.cantidad || 1}</span>
              <span class="nombre">${p.nombre}</span>
            </div>
          `).join('')}
        </div>
        
        <div class="pedido-cocina-total">
          <strong>Total: $${pedido.total.toLocaleString()}</strong>
        </div>
        
        <div class="pedido-cocina-acciones">
          ${estado === 'pendiente' ? `
            <button class="btn btn-primary btn-block btn-cambiar-estado" 
                    data-id="${pedido.id}" 
                    data-estado="preparando">
              🔥 Comenzar a Preparar
            </button>
          ` : ''}
          
          ${estado === 'preparando' ? `
            <button class="btn btn-primary btn-block btn-cambiar-estado" 
                    data-id="${pedido.id}" 
                    data-estado="listo">
              ✅ Marcar como Listo
            </button>
          ` : ''}
          
          ${estado === 'listo' ? `
            <button class="btn btn-secondary btn-block btn-cambiar-estado" 
                    data-id="${pedido.id}" 
                    data-estado="entregado">
              📦 Marcar como Entregado
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Agregar eventos a los botones
  container.querySelectorAll('.btn-cambiar-estado').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = parseInt(btn.dataset.id);
      const nuevoEstado = btn.dataset.estado;
      await cambiarEstadoPedido(id, nuevoEstado);
    });
  });
}

// Calcular tiempo transcurrido en minutos
function calcularTiempoTranscurrido(fecha) {
  const ahora = new Date();
  const diferencia = ahora - fecha;
  return Math.floor(diferencia / 60000); // Convertir a minutos
}

// Cambiar estado del pedido
async function cambiarEstadoPedido(id, nuevoEstado) {
  try {
    await pedidosAPI.actualizarEstado(id, nuevoEstado);
    
    const mensajes = {
      preparando: 'Pedido en preparación',
      listo: '¡Pedido listo para servir!',
      entregado: 'Pedido entregado'
    };
    
    mostrarMensaje(mensajes[nuevoEstado], 'success');
    cargarPedidos();
    
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    mostrarMensaje('Error al cambiar el estado del pedido', 'error');
  }
}

// Reproducir notificación de sonido
function reproducirNotificacion() {
  // Si no hay archivo de audio, usar sonido del sistema
  if (notificacionAudio.canPlayType('audio/mpeg')) {
    notificacionAudio.play().catch(error => {
      console.log('No se pudo reproducir el sonido:', error);
    });
  } else {
    // Fallback: usar beep del navegador
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  }
}

// Configurar eventos
function configurarEventos() {
  // Botón actualizar
  document.getElementById('btnActualizar').addEventListener('click', () => {
    cargarPedidos();
    mostrarMensaje('Actualizado', 'info');
  });

  // Toggle de sonido
  sonidoActivado.addEventListener('change', () => {
    const estado = sonidoActivado.checked ? 'activado' : 'desactivado';
    mostrarMensaje(`Sonido ${estado}`, 'info');
  });
}
