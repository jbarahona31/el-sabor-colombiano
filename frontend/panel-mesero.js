import { productosAPI, pedidosAPI, mostrarMensaje } from './api.js';
import { protegerPagina, inicializarCerrarSesion } from './auth.js';

// Proteger la página - solo meseros y admins
if (!protegerPagina(['mesero', 'admin'])) {
  throw new Error('Acceso no autorizado');
}

// Inicializar cerrar sesión
inicializarCerrarSesion();

// Estado
let productos = [];
let productosSeleccionados = [];
let pedidos = [];

// Elementos del DOM
const productosSelect = document.getElementById('productosSelect');
const productosSeleccionadosDiv = document.getElementById('productosSeleccionados');
const totalPedidoSpan = document.getElementById('totalPedido');
const tablaPedidos = document.getElementById('tablaPedidos');
const formPedido = document.getElementById('formPedido');
const modalDetalle = document.getElementById('modalDetallePedido');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarPedidos();
  configurarEventos();
  
  // Auto-actualizar pedidos cada 10 segundos
  setInterval(cargarPedidos, 10000);
});

// Cargar productos disponibles
async function cargarProductos() {
  try {
    productos = await productosAPI.obtenerTodos();
    renderizarProductosSelect();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarMensaje('Error al cargar productos', 'error');
  }
}

// Renderizar selector de productos
function renderizarProductosSelect() {
  productosSelect.innerHTML = productos.map(producto => `
    <div class="producto-select-item">
      <div class="producto-select-info">
        <strong>${producto.nombre}</strong>
        <span class="categoria-badge">${producto.categoria}</span>
        <span class="precio">$${producto.precio.toLocaleString()}</span>
      </div>
      <div class="producto-select-actions">
        <input 
          type="number" 
          min="1" 
          value="1" 
          class="cantidad-input" 
          id="cant-${producto.id}"
        >
        <button 
          class="btn btn-primary btn-agregar-producto" 
          data-id="${producto.id}"
        >
          Agregar
        </button>
      </div>
    </div>
  `).join('');

  // Agregar eventos a los botones
  document.querySelectorAll('.btn-agregar-producto').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const cantidadInput = document.getElementById(`cant-${id}`);
      const cantidad = parseInt(cantidadInput.value) || 1;
      agregarProducto(id, cantidad);
    });
  });
}

// Agregar producto al pedido
function agregarProducto(id, cantidad) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const existente = productosSeleccionados.find(p => p.id === id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    productosSeleccionados.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
  }

  renderizarProductosSeleccionados();
  mostrarMensaje(`${producto.nombre} agregado`, 'success');
}

// Renderizar productos seleccionados
function renderizarProductosSeleccionados() {
  if (productosSeleccionados.length === 0) {
    productosSeleccionadosDiv.innerHTML = '<p class="text-muted">No hay productos seleccionados</p>';
    totalPedidoSpan.textContent = '0';
    return;
  }

  const total = productosSeleccionados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);

  productosSeleccionadosDiv.innerHTML = productosSeleccionados.map(p => `
    <div class="producto-seleccionado-item">
      <div>
        <strong>${p.nombre}</strong>
        <span>x${p.cantidad}</span>
        <span class="precio">$${(p.precio * p.cantidad).toLocaleString()}</span>
      </div>
      <button class="btn-eliminar" data-id="${p.id}">🗑️</button>
    </div>
  `).join('');

  totalPedidoSpan.textContent = total.toLocaleString();

  // Agregar eventos a botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      eliminarProducto(id);
    });
  });
}

// Eliminar producto del pedido
function eliminarProducto(id) {
  productosSeleccionados = productosSeleccionados.filter(p => p.id !== id);
  renderizarProductosSeleccionados();
}

// Enviar pedido
async function enviarPedido(e) {
  e.preventDefault();

  const mesa = parseInt(document.getElementById('numeroMesa').value);

  if (!mesa || mesa < 1) {
    mostrarMensaje('Número de mesa inválido', 'error');
    return;
  }

  if (productosSeleccionados.length === 0) {
    mostrarMensaje('Debes seleccionar al menos un producto', 'error');
    return;
  }

  try {
    const pedido = {
      mesa: mesa,
      productos: productosSeleccionados
    };

    await pedidosAPI.crear(pedido);
    mostrarMensaje('¡Pedido enviado a cocina!', 'success');

    // Limpiar formulario
    document.getElementById('numeroMesa').value = '';
    productosSeleccionados = [];
    renderizarProductosSeleccionados();

    // Recargar pedidos
    cargarPedidos();

  } catch (error) {
    console.error('Error al enviar pedido:', error);
    mostrarMensaje('Error al enviar el pedido', 'error');
  }
}

// Cargar pedidos
async function cargarPedidos() {
  try {
    pedidos = await pedidosAPI.obtenerTodos();
    renderizarPedidos();
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
}

// Renderizar tabla de pedidos
function renderizarPedidos() {
  if (pedidos.length === 0) {
    tablaPedidos.innerHTML = '<tr><td colspan="6" class="text-muted">No hay pedidos</td></tr>';
    return;
  }

  tablaPedidos.innerHTML = pedidos.map(pedido => {
    const fecha = new Date(pedido.created_at);
    return `
      <tr>
        <td>${pedido.id}</td>
        <td>Mesa ${pedido.mesa}</td>
        <td>$${pedido.total.toLocaleString()}</td>
        <td><span class="estado-badge estado-${pedido.estado}">${pedido.estado}</span></td>
        <td>${fecha.toLocaleTimeString()}</td>
        <td>
          <button class="btn btn-secondary btn-ver-detalle" data-id="${pedido.id}">
            Ver Detalle
          </button>
        </td>
      </tr>
    `;
  }).join('');

  // Agregar eventos a botones de ver detalle
  document.querySelectorAll('.btn-ver-detalle').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      mostrarDetallePedido(id);
    });
  });
}

// Mostrar detalle del pedido
function mostrarDetallePedido(id) {
  const pedido = pedidos.find(p => p.id === id);
  if (!pedido) return;

  document.getElementById('detallePedidoId').textContent = pedido.id;
  document.getElementById('detalleMesa').textContent = `Mesa ${pedido.mesa}`;
  document.getElementById('detalleEstado').innerHTML = `<span class="estado-badge estado-${pedido.estado}">${pedido.estado}</span>`;
  document.getElementById('detalleTotal').textContent = pedido.total.toLocaleString();

  const productosHTML = pedido.productos.map(p => `
    <div class="producto-detalle-item">
      <span>${p.nombre}</span>
      <span>x${p.cantidad || 1}</span>
      <span>$${(p.precio * (p.cantidad || 1)).toLocaleString()}</span>
    </div>
  `).join('');

  document.getElementById('detalleProductos').innerHTML = productosHTML;

  modalDetalle.style.display = 'flex';
}

// Configurar eventos
function configurarEventos() {
  // Enviar pedido
  formPedido.addEventListener('submit', enviarPedido);

  // Cerrar modal
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      modalDetalle.style.display = 'none';
    });
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modalDetalle) {
      modalDetalle.style.display = 'none';
    }
  });
}
