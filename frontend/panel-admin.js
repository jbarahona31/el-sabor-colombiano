import { productosAPI, pedidosAPI, mostrarMensaje } from './api.js';
import { protegerPagina, inicializarCerrarSesion } from './auth.js';

// Proteger la página - solo admins
if (!protegerPagina(['admin'])) {
  throw new Error('Acceso no autorizado');
}

// Inicializar cerrar sesión
inicializarCerrarSesion();

// Estado
let productos = [];
let pedidos = [];
let productoEditando = null;

// Elementos del DOM
const modalProducto = document.getElementById('modalProducto');
const formProducto = document.getElementById('formProducto');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  cargarEstadisticas();
  cargarProductos();
  cargarPedidos();
  configurarEventos();
  
  // Auto-actualizar cada 30 segundos
  setInterval(() => {
    cargarEstadisticas();
    cargarPedidos();
  }, 30000);
});

// Cargar estadísticas
async function cargarEstadisticas() {
  try {
    const stats = await pedidosAPI.obtenerEstadisticas();
    
    document.getElementById('statPedidos').textContent = stats.total_pedidos || 0;
    document.getElementById('statVentas').textContent = `$${parseFloat(stats.ventas_totales || 0).toLocaleString()}`;
    document.getElementById('statCompletados').textContent = stats.pedidos_completados || 0;
    document.getElementById('statActivos').textContent = stats.pedidos_activos || 0;
    
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }
}

// Cargar productos
async function cargarProductos() {
  try {
    // Obtener todos los productos sin filtro de disponibilidad
    const response = await fetch('http://localhost:3000/api/productos');
    productos = await response.json();
    renderizarProductos();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    document.getElementById('tablaProductos').innerHTML = 
      '<tr><td colspan="6" class="error">Error al cargar productos</td></tr>';
  }
}

// Renderizar tabla de productos
function renderizarProductos() {
  const tbody = document.getElementById('tablaProductos');
  
  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-muted">No hay productos</td></tr>';
    return;
  }
  
  tbody.innerHTML = productos.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td><span class="categoria-badge">${p.categoria}</span></td>
      <td>$${parseFloat(p.precio).toLocaleString()}</td>
      <td>${p.disponible ? '✅ Sí' : '❌ No'}</td>
      <td>
        <button class="btn btn-secondary btn-editar" data-id="${p.id}">✏️ Editar</button>
        <button class="btn btn-secondary btn-eliminar" data-id="${p.id}">🗑️ Eliminar</button>
      </td>
    </tr>
  `).join('');
  
  // Agregar eventos
  tbody.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => editarProducto(parseInt(btn.dataset.id)));
  });
  
  tbody.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => eliminarProducto(parseInt(btn.dataset.id)));
  });
}

// Nuevo producto
function nuevoProducto() {
  productoEditando = null;
  document.getElementById('modalTitulo').textContent = 'Nuevo Producto';
  document.getElementById('productoId').value = '';
  document.getElementById('productoNombre').value = '';
  document.getElementById('productoPrecio').value = '';
  document.getElementById('productoCategoria').value = 'comidas';
  document.getElementById('productoImagen').value = '';
  document.getElementById('productoDisponible').checked = true;
  
  modalProducto.style.display = 'flex';
}

// Editar producto
function editarProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  
  productoEditando = producto;
  document.getElementById('modalTitulo').textContent = 'Editar Producto';
  document.getElementById('productoId').value = producto.id;
  document.getElementById('productoNombre').value = producto.nombre;
  document.getElementById('productoPrecio').value = producto.precio;
  document.getElementById('productoCategoria').value = producto.categoria;
  document.getElementById('productoImagen').value = producto.imagen || '';
  document.getElementById('productoDisponible').checked = producto.disponible;
  
  modalProducto.style.display = 'flex';
}

// Guardar producto
async function guardarProducto(e) {
  e.preventDefault();
  
  const datos = {
    nombre: document.getElementById('productoNombre').value,
    precio: parseFloat(document.getElementById('productoPrecio').value),
    categoria: document.getElementById('productoCategoria').value,
    imagen: document.getElementById('productoImagen').value || 'default.jpg',
    disponible: document.getElementById('productoDisponible').checked
  };
  
  try {
    if (productoEditando) {
      await productosAPI.actualizar(productoEditando.id, datos);
      mostrarMensaje('Producto actualizado correctamente', 'success');
    } else {
      await productosAPI.crear(datos);
      mostrarMensaje('Producto creado correctamente', 'success');
    }
    
    modalProducto.style.display = 'none';
    cargarProductos();
    
  } catch (error) {
    console.error('Error al guardar producto:', error);
    mostrarMensaje('Error al guardar el producto', 'error');
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    return;
  }
  
  try {
    await productosAPI.eliminar(id);
    mostrarMensaje('Producto eliminado correctamente', 'success');
    cargarProductos();
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    mostrarMensaje('Error al eliminar el producto', 'error');
  }
}

// Cargar pedidos
async function cargarPedidos() {
  try {
    pedidos = await pedidosAPI.obtenerTodos();
    renderizarPedidos();
    renderizarReporteVentas();
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
}

// Renderizar tabla de pedidos
function renderizarPedidos() {
  const tbody = document.getElementById('tablaPedidos');
  
  if (pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-muted">No hay pedidos</td></tr>';
    return;
  }
  
  tbody.innerHTML = pedidos.map(p => {
    const fecha = new Date(p.created_at);
    const productosTexto = p.productos.map(prod => 
      `${prod.nombre} x${prod.cantidad || 1}`
    ).join(', ');
    
    return `
      <tr>
        <td>${p.id}</td>
        <td>Mesa ${p.mesa}</td>
        <td>${productosTexto}</td>
        <td>$${parseFloat(p.total).toLocaleString()}</td>
        <td><span class="estado-badge estado-${p.estado}">${p.estado}</span></td>
        <td>${fecha.toLocaleString()}</td>
      </tr>
    `;
  }).join('');
}

// Renderizar reporte de ventas
function renderizarReporteVentas() {
  const reporteDiv = document.getElementById('reporteVentas');
  
  if (pedidos.length === 0) {
    reporteDiv.innerHTML = '<p class="text-muted">No hay datos de ventas</p>';
    return;
  }
  
  // Agrupar por fecha
  const ventasPorFecha = {};
  pedidos.forEach(p => {
    const fecha = new Date(p.created_at).toLocaleDateString();
    if (!ventasPorFecha[fecha]) {
      ventasPorFecha[fecha] = { total: 0, cantidad: 0 };
    }
    ventasPorFecha[fecha].total += parseFloat(p.total);
    ventasPorFecha[fecha].cantidad++;
  });
  
  let html = '<div class="table-container"><table><thead><tr><th>Fecha</th><th>Pedidos</th><th>Total Ventas</th></tr></thead><tbody>';
  
  Object.keys(ventasPorFecha).sort().reverse().forEach(fecha => {
    const datos = ventasPorFecha[fecha];
    html += `
      <tr>
        <td>${fecha}</td>
        <td>${datos.cantidad}</td>
        <td>$${datos.total.toLocaleString()}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table></div>';
  reporteDiv.innerHTML = html;
}

// Exportar a CSV
function exportarCSV() {
  if (pedidos.length === 0) {
    mostrarMensaje('No hay datos para exportar', 'warning');
    return;
  }
  
  let csv = 'ID,Mesa,Total,Estado,Fecha\n';
  
  pedidos.forEach(p => {
    const fecha = new Date(p.created_at).toLocaleString();
    csv += `${p.id},${p.mesa},${p.total},${p.estado},"${fecha}"\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ventas-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  
  mostrarMensaje('CSV exportado correctamente', 'success');
}

// Configurar eventos
function configurarEventos() {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`tab-${tab}`).classList.add('active');
    });
  });
  
  // Nuevo producto
  document.getElementById('btnNuevoProducto').addEventListener('click', nuevoProducto);
  
  // Guardar producto
  formProducto.addEventListener('submit', guardarProducto);
  
  // Exportar CSV
  document.getElementById('btnExportarCSV').addEventListener('click', exportarCSV);
  
  // Cerrar modal
  document.querySelector('.modal-close').addEventListener('click', () => {
    modalProducto.style.display = 'none';
  });
  
  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modalProducto) {
      modalProducto.style.display = 'none';
    }
  });
}
