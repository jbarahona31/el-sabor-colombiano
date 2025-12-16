/**
 * API Configuration
 * Uses environment variables for API URL
 * Vite exposes env variables that start with VITE_ to the client
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    VERIFY: `${API_URL}/auth/verificar`,
  },
  // Products
  PRODUCTOS: {
    LIST: `${API_URL}/productos`,
    GET: (id) => `${API_URL}/productos/${id}`,
    CREATE: `${API_URL}/productos`,
    UPDATE: (id) => `${API_URL}/productos/${id}`,
    DELETE: (id) => `${API_URL}/productos/${id}`,
  },
  // Orders
  PEDIDOS: {
    LIST: `${API_URL}/pedidos`,
    GET: (id) => `${API_URL}/pedidos/${id}`,
    CREATE: `${API_URL}/pedidos`,
    UPDATE: (id) => `${API_URL}/pedidos/${id}`,
    STATS: `${API_URL}/pedidos/estadisticas`,
  },
};

/**
 * HTTP Client helper
 * Automatically includes JWT token from localStorage
 */
export const apiClient = {
  async request(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(url, options) {
    return this.request(url, { ...options, method: 'GET' });
  },

  post(url, body, options) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put(url, body, options) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete(url, options) {
    return this.request(url, { ...options, method: 'DELETE' });
  },
};
