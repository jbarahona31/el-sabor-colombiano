// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Función para obtener el token del localStorage
const getToken = () => localStorage.getItem('token');

// Función genérica para hacer peticiones
const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en la petición');
    }

    return data;
  } catch (error) {
    console.error('Error en API:', error);
    throw error;
  }
};

// API de Autenticación
export const authAPI = {
  login: async (usuario, clave) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, clave }),
    });
  },
  
  verificarSesion: async () => {
    return fetchAPI('/auth/verificar');
  },
};

// API de Productos
export const productosAPI = {
  obtenerTodos: async (categoria = '') => {
    const query = categoria ? `?categoria=${categoria}` : '';
    return fetchAPI(`/productos${query}`);
  },
  
  obtenerPorId: async (id) => {
    return fetchAPI(`/productos/${id}`);
  },
  
  crear: async (producto) => {
    return fetchAPI('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    });
  },
  
  actualizar: async (id, producto) => {
    return fetchAPI(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    });
  },
  
  eliminar: async (id) => {
    return fetchAPI(`/productos/${id}`, {
      method: 'DELETE',
    });
  },
};

// API de Pedidos
export const pedidosAPI = {
  obtenerTodos: async (estado = '') => {
    const query = estado ? `?estado=${estado}` : '';
    return fetchAPI(`/pedidos${query}`);
  },
  
  obtenerPorId: async (id) => {
    return fetchAPI(`/pedidos/${id}`);
  },
  
  crear: async (pedido) => {
    return fetchAPI('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
  },
  
  actualizarEstado: async (id, estado) => {
    return fetchAPI(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  },
  
  obtenerEstadisticas: async () => {
    return fetchAPI('/pedidos/estadisticas');
  },
};

// Función para mostrar mensajes al usuario
export const mostrarMensaje = (mensaje, tipo = 'info') => {
  const colores = {
    success: '#28a745',
    error: '#dc3545',
    info: '#17a2b8',
    warning: '#ffc107'
  };

  const div = document.createElement('div');
  div.textContent = mensaje;
  div.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${colores[tipo]};
    color: white;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-in-out;
  `;

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.animation = 'slideOut 0.3s ease-in-out';
    setTimeout(() => div.remove(), 300);
  }, 3000);
};

// Añadir estilos para las animaciones
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
