import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import productosRoutes from './routes/productos.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow frontend from different origins
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || false) // In production, FRONTEND_URL is required
    : [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:8000'].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
};

// Validate CORS configuration in production
if (process.env.NODE_ENV === 'production' && !process.env.FRONTEND_URL) {
  console.error('⚠️  WARNING: FRONTEND_URL not set in production. CORS will block all requests.');
}

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting global
app.use('/api/', generalLimiter);

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🇨🇴 Bienvenido a El Sabor Colombiano API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      productos: '/api/productos',
      pedidos: '/api/pedidos'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - GET    /api/auth/verificar`);
  console.log(`   - GET    /api/productos`);
  console.log(`   - POST   /api/productos`);
  console.log(`   - PUT    /api/productos/:id`);
  console.log(`   - DELETE /api/productos/:id`);
  console.log(`   - GET    /api/pedidos`);
  console.log(`   - POST   /api/pedidos`);
  console.log(`   - PUT    /api/pedidos/:id`);
  console.log(`   - GET    /api/pedidos/estadisticas\n`);
});
