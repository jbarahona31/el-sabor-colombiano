import { productosAPI, pedidosAPI, mostrarMensaje } from './api.js';

// Estado de la aplicación
let productos = [];
let carrito = [];
let categoriaActual = '';

// Elementos del DOM
const productosGrid = document.getElementById('productosGrid');
const buscador = document.getElementById('buscador');
const modalProducto = document.getElementById('modalProducto');
const modalCarrito = document.getElementById('modalCarrito');
const cantidadCarrito = document.getElementById('cantidadCarrito');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  configurarEventos();
  cargarCarritoDesdeStorage();
});

// Cargar productos desde la API
async function cargarProductos(categoria = '') {
  try {
    productosGrid.innerHTML = '<div class="loading">Cargando productos...</div>';
    productos = await productosAPI.obtenerTodos(categoria);
    renderizarProductos(productos);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    productosGrid.innerHTML = '<div class="error">Error al cargar productos</div>';
  }
}

// Renderizar productos en el grid
function renderizarProductos(productosARenderizar) {
  if (productosARenderizar.length === 0) {
    productosGrid.innerHTML = '<div class="no-productos">No se encontraron productos</div>';
    return;
  }

  productosGrid.innerHTML = productosARenderizar.map(producto => `
    <div class="producto-card" data-id="${producto.id}">
      <div class="producto-imagen">
        <img src="images/${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/default.jpg'">
      </div>
      <div class="producto-info">
        <h3>${producto.nombre}</h3>
        <span class="categoria-badge">${producto.categoria}</span>
        <p class="precio">$${producto.precio.toLocaleString()}</p>
        <button class="btn btn-primary btn-agregar" data-id="${producto.id}">
          Agregar al Carrito
        </button>
      </div>
    </div>
  `).join('');

  // Agregar eventos a las tarjetas
  document.querySelectorAll('.producto-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn-agregar')) {
        const id = parseInt(card.dataset.id);
        mostrarDetalleProducto(id);
      }
    });
  });

  // Agregar eventos a los botones de agregar
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      agregarAlCarrito(id);
    });
  });
}

// Mostrar detalles del producto en modal
function mostrarDetalleProducto(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  document.getElementById('modalNombre').textContent = producto.nombre;
  document.getElementById('modalCategoria').textContent = producto.categoria;
  document.getElementById('modalPrecio').textContent = `$${producto.precio.toLocaleString()}`;
  document.getElementById('modalImagen').src = `images/${producto.imagen}`;
  document.getElementById('modalImagen').onerror = function() {
    this.src = 'images/default.jpg';
  };

  const btnAgregar = document.getElementById('modalAgregar');
  btnAgregar.onclick = () => {
    agregarAlCarrito(id);
    modalProducto.style.display = 'none';
  };

  modalProducto.style.display = 'flex';
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  const itemExistente = carrito.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  actualizarCarrito();
  mostrarMensaje(`${producto.nombre} agregado al carrito`, 'success');
  guardarCarritoEnStorage();
}

// Quitar producto del carrito
function quitarDelCarrito(id) {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarrito();
  guardarCarritoEnStorage();
}

// Cambiar cantidad de un producto
function cambiarCantidad(id, delta) {
  const item = carrito.find(item => item.id === id);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    quitarDelCarrito(id);
  } else {
    actualizarCarrito();
    guardarCarritoEnStorage();
  }
}

// Actualizar visualización del carrito
function actualizarCarrito() {
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  cantidadCarrito.textContent = totalItems;

  const listaCarrito = document.getElementById('listaCarrito');
  const totalCarrito = document.getElementById('totalCarrito');

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
    totalCarrito.textContent = '0';
    return;
  }

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  listaCarrito.innerHTML = carrito.map(item => `
    <div class="carrito-item">
      <div class="carrito-item-info">
        <h4>${item.nombre}</h4>
        <p class="precio">$${item.precio.toLocaleString()}</p>
      </div>
      <div class="carrito-item-cantidad">
        <button class="btn-cantidad" data-id="${item.id}" data-delta="-1">-</button>
        <span>${item.cantidad}</span>
        <button class="btn-cantidad" data-id="${item.id}" data-delta="1">+</button>
        <button class="btn-eliminar" data-id="${item.id}">🗑️</button>
      </div>
    </div>
  `).join('');

  totalCarrito.textContent = total.toLocaleString();

  // Agregar eventos a los botones del carrito
  document.querySelectorAll('.btn-cantidad').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const delta = parseInt(btn.dataset.delta);
      cambiarCantidad(id, delta);
    });
  });

  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      quitarDelCarrito(id);
    });
  });
}

// Enviar pedido
async function enviarPedido() {
  const numeroMesa = document.getElementById('numeroMesa').value;

  if (!numeroMesa || numeroMesa < 1) {
    mostrarMensaje('Por favor ingresa un número de mesa válido', 'error');
    return;
  }

  if (carrito.length === 0) {
    mostrarMensaje('El carrito está vacío', 'error');
    return;
  }

  try {
    const pedido = {
      mesa: parseInt(numeroMesa),
      productos: carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      }))
    };

    await pedidosAPI.crear(pedido);
    mostrarMensaje('¡Pedido enviado exitosamente!', 'success');
    
    // Limpiar carrito
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnStorage();
    document.getElementById('numeroMesa').value = '';
    modalCarrito.style.display = 'none';

  } catch (error) {
    console.error('Error al enviar pedido:', error);
    mostrarMensaje('Error al enviar el pedido. Por favor, inicia sesión como mesero.', 'error');
  }
}

// Configurar eventos
function configurarEventos() {
  // Búsqueda
  buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const productosFiltrados = productos.filter(p => 
      p.nombre.toLowerCase().includes(texto)
    );
    renderizarProductos(productosFiltrados);
  });

  // Filtros de categoría
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      categoriaActual = btn.dataset.categoria;
      cargarProductos(categoriaActual);
    });
  });

  // Botón ver carrito
  document.getElementById('btnVerCarrito').addEventListener('click', (e) => {
    e.preventDefault();
    modalCarrito.style.display = 'flex';
  });

  // Cerrar modales
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      modalProducto.style.display = 'none';
      modalCarrito.style.display = 'none';
    });
  });

  // Cerrar modal al hacer clic fuera
  window.addEventListener('click', (e) => {
    if (e.target === modalProducto) {
      modalProducto.style.display = 'none';
    }
    if (e.target === modalCarrito) {
      modalCarrito.style.display = 'none';
    }
  });

  // Enviar pedido
  document.getElementById('btnEnviarPedido').addEventListener('click', enviarPedido);
}

// Guardar carrito en localStorage
function guardarCarritoEnStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function cargarCarritoDesdeStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}