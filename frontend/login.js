import { authAPI, mostrarMensaje } from './api.js';
import { guardarSesion, redirigirSegunRol, estaAutenticado } from './auth.js';

// Si ya está autenticado, redirigir según su rol
if (estaAutenticado()) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  redirigirSegunRol(usuario.rol);
}

// Manejar el formulario de login
const loginForm = document.getElementById('loginForm');
const mensajeDiv = document.getElementById('mensaje');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usuario = document.getElementById('usuario').value.trim();
  const clave = document.getElementById('clave').value;
  
  // Validar campos
  if (!usuario || !clave) {
    mostrarMensajeLocal('Por favor completa todos los campos', 'error');
    return;
  }
  
  // Deshabilitar botón mientras se procesa
  const btnSubmit = loginForm.querySelector('button[type="submit"]');
  const textoOriginal = btnSubmit.textContent;
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Iniciando sesión...';
  
  try {
    // Llamar a la API de login
    const respuesta = await authAPI.login(usuario, clave);
    
    // Guardar sesión
    guardarSesion(respuesta.token, respuesta.usuario);
    
    // Mostrar mensaje de éxito
    mostrarMensajeLocal('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
    
    // Redirigir según el rol después de un breve delay
    setTimeout(() => {
      redirigirSegunRol(respuesta.usuario.rol);
    }, 1000);
    
  } catch (error) {
    console.error('Error en login:', error);
    mostrarMensajeLocal(error.message || 'Error al iniciar sesión', 'error');
    btnSubmit.disabled = false;
    btnSubmit.textContent = textoOriginal;
  }
});

// Función para mostrar mensajes locales en el formulario
function mostrarMensajeLocal(mensaje, tipo = 'info') {
  const clases = {
    success: 'mensaje-success',
    error: 'mensaje-error',
    info: 'mensaje-info'
  };
  
  mensajeDiv.textContent = mensaje;
  mensajeDiv.className = `mensaje ${clases[tipo]}`;
  mensajeDiv.style.display = 'block';
  
  if (tipo === 'success') {
    setTimeout(() => {
      mensajeDiv.style.display = 'none';
    }, 5000);
  }
}
