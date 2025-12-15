// Módulo de autenticación

// Guardar token y datos de usuario
export const guardarSesion = (token, usuario) => {
  localStorage.setItem('token', token);
  localStorage.setItem('usuario', JSON.stringify(usuario));
};

// Obtener token
export const obtenerToken = () => {
  return localStorage.getItem('token');
};

// Obtener datos de usuario
export const obtenerUsuario = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

// Cerrar sesión
export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/login.html';
};

// Verificar si el usuario está autenticado
export const estaAutenticado = () => {
  return obtenerToken() !== null;
};

// Verificar rol del usuario
export const tieneRol = (rolesPermitidos) => {
  const usuario = obtenerUsuario();
  if (!usuario) return false;
  
  if (Array.isArray(rolesPermitidos)) {
    return rolesPermitidos.includes(usuario.rol);
  }
  
  return usuario.rol === rolesPermitidos;
};

// Proteger página - redirigir a login si no está autenticado
export const protegerPagina = (rolesPermitidos = null) => {
  if (!estaAutenticado()) {
    window.location.href = '/login.html';
    return false;
  }

  if (rolesPermitidos && !tieneRol(rolesPermitidos)) {
    alert('No tienes permisos para acceder a esta página');
    const usuario = obtenerUsuario();
    redirigirSegunRol(usuario.rol);
    return false;
  }

  return true;
};

// Redirigir según el rol del usuario
export const redirigirSegunRol = (rol) => {
  const rutas = {
    admin: '/panel-admin.html',
    mesero: '/panel-mesero.html',
    cocina: '/panel-cocina.html'
  };

  const ruta = rutas[rol] || '/login.html';
  window.location.href = ruta;
};

// Inicializar botón de cerrar sesión si existe
export const inicializarCerrarSesion = () => {
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        cerrarSesion();
      }
    });
  }

  // Mostrar nombre de usuario si existe el elemento
  const nombreUsuario = document.getElementById('nombreUsuario');
  if (nombreUsuario) {
    const usuario = obtenerUsuario();
    if (usuario) {
      nombreUsuario.textContent = usuario.usuario;
    }
  }
};
