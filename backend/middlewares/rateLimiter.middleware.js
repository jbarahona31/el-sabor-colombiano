import rateLimit from 'express-rate-limit';

// Limitador general para todas las rutas de la API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Limitador estricto para rutas de autenticación (prevenir ataques de fuerza bruta)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login
  message: 'Demasiados intentos de inicio de sesión, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar peticiones exitosas
});

// Limitador para operaciones de escritura (POST, PUT, DELETE)
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Máximo 50 operaciones de escritura
  message: 'Demasiadas operaciones de escritura, por favor intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});
