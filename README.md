# 🇨🇴 El Sabor Colombiano - Sistema Web de Cafetería

Sistema completo de gestión para cafeterías con arquitectura frontend-backend separada, desarrollado con tecnologías web modernas.

## 📋 Características

### Frontend (Vanilla JavaScript)
- **Menú Principal**: Catálogo de productos con búsqueda y filtros
- **Sistema de Carrito**: Gestión de pedidos para clientes
- **Panel de Mesero**: Creación y seguimiento de pedidos
- **Panel de Cocina**: Vista en tiempo real con notificaciones sonoras
- **Panel de Administrador**: CRUD completo de productos y reportes de ventas
- **Autenticación**: Sistema de login con roles (admin, mesero, cocina)

### Backend (Node.js + Express + PostgreSQL)
- **API RESTful**: Endpoints para productos, pedidos y autenticación
- **Autenticación JWT**: Tokens seguros con expiración
- **Control de Roles**: Middleware para protección de rutas
- **Base de Datos**: PostgreSQL con esquema completo
- **CORS**: Configurado para desarrollo y producción

## 🚀 Instalación y Configuración

### Requisitos Previos
- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### Backend

1. **Navegar a la carpeta del backend**:
```bash
cd backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
Crea un archivo `.env` basado en `.env.example`:
```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/el_sabor_colombiano
JWT_SECRET=tu_clave_secreta_super_segura_aqui
PORT=3000
```

4. **Crear la base de datos**:
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE el_sabor_colombiano;

# Salir de psql
\q
```

5. **Ejecutar el script de creación de tablas**:
```bash
psql -U postgres -d el_sabor_colombiano -f schema.sql
```

6. **Iniciar el servidor**:
```bash
npm start
# o para desarrollo con hot-reload:
npm run dev
```

El backend estará disponible en `http://localhost:3000`

### Frontend

1. **Navegar a la carpeta del frontend**:
```bash
cd frontend
```

2. **Configurar la URL del API**:
Edita `api.js` y ajusta la URL del backend si es necesario:
```javascript
const API_URL = 'http://localhost:3000/api';
```

3. **Servir los archivos** (opciones):

**Opción A: Live Server (VSCode)**
- Instala la extensión "Live Server" en VSCode
- Click derecho en `index.html` → "Open with Live Server"

**Opción B: Python SimpleHTTPServer**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Opción C: Node.js http-server**
```bash
npx http-server -p 8000
```

El frontend estará disponible en `http://localhost:8000`

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol | Acceso |
|---------|-----------|-----|--------|
| admin | 123456 | Administrador | Panel completo, CRUD productos, reportes |
| mesero | 123456 | Mesero | Crear pedidos, ver estado |
| cocina | 123456 | Cocina | Ver pedidos, actualizar estado |

## 📁 Estructura del Proyecto

```
el-sabor-colombiano/
├── backend/
│   ├── controllers/          # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── productos.controller.js
│   │   └── pedidos.controller.js
│   ├── routes/              # Rutas de la API
│   │   ├── auth.routes.js
│   │   ├── productos.routes.js
│   │   └── pedidos.routes.js
│   ├── middlewares/         # Middleware de autenticación
│   │   └── auth.middleware.js
│   ├── db.js               # Configuración de PostgreSQL
│   ├── index.js            # Punto de entrada
│   ├── schema.sql          # Esquema de base de datos
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── index.html          # Menú principal
    ├── login.html          # Página de login
    ├── panel-admin.html    # Panel de administrador
    ├── panel-mesero.html   # Panel de mesero
    ├── panel-cocina.html   # Panel de cocina
    ├── styles.css          # Estilos globales
    ├── api.js              # Módulo de comunicación con API
    ├── auth.js             # Módulo de autenticación
    ├── app.js              # Lógica del menú principal
    ├── login.js            # Lógica de login
    ├── panel-admin.js      # Lógica del panel admin
    ├── panel-mesero.js     # Lógica del panel mesero
    ├── panel-cocina.js     # Lógica del panel cocina
    ├── images/             # Imágenes de productos
    └── sounds/             # Sonido de notificación
```

## 🌐 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verificar` - Verificar token

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto (solo admin)
- `PUT /api/productos/:id` - Actualizar producto (solo admin)
- `DELETE /api/productos/:id` - Eliminar producto (solo admin)

### Pedidos
- `GET /api/pedidos` - Listar pedidos (requiere auth)
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `POST /api/pedidos` - Crear pedido (mesero/admin)
- `PUT /api/pedidos/:id` - Actualizar estado (cocina/admin)
- `GET /api/pedidos/estadisticas` - Estadísticas (solo admin)

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración de 24 horas
- Middleware de autenticación y autorización
- Validación de roles por endpoint
- CORS configurado

## 🚢 Despliegue

Este proyecto está configurado para desplegarse en:
- **Frontend**: Netlify (con React + Vite)
- **Backend**: Railway (con Node.js + PostgreSQL)

### Guía Rápida

#### Backend en Railway

1. Crear cuenta en [Railway](https://railway.app)
2. Nuevo proyecto → "Deploy from GitHub"
3. Seleccionar el repositorio con root directory: `backend`
4. Agregar PostgreSQL desde el dashboard
5. Configurar variables de entorno:
   - `DATABASE_URL` (auto-configurado por Railway)
   - `JWT_SECRET` (generar clave segura)
   - `NODE_ENV=production`
   - `FRONTEND_URL` (URL de Netlify)
   - `PORT=3000`
6. Ejecutar el schema SQL en la base de datos
7. Railway desplegará automáticamente

#### Frontend en Netlify

1. Crear cuenta en [Netlify](https://netlify.com)
2. Nuevo sitio desde Git
3. Configurar (ya incluido en `netlify.toml`):
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Configurar variable de entorno:
   - `VITE_API_URL` (URL del backend en Railway con `/api`)
5. Netlify desplegará automáticamente

### Documentación Completa

Para instrucciones detalladas paso a paso, consulta **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Esta guía incluye:
- Configuración detallada de Railway y Netlify
- Variables de entorno requeridas
- Inicialización de la base de datos
- Resolución de problemas comunes
- Verificación de despliegue
- Checklist de seguridad

## 🛠️ Tecnologías Utilizadas

### Backend
- Node.js
- Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cors

### Frontend
- React 19
- Vite (build tool)
- JavaScript (ES6+)
- Fetch API
- LocalStorage
- CSS3

## 📝 Notas Adicionales

- Las contraseñas de prueba son solo para desarrollo
- **IMPORTANTE**: Cambia el `JWT_SECRET` en producción por un valor aleatorio seguro
- Las imágenes de productos deben colocarse en `frontend/images/`
- El sonido de notificación usa Web Audio API (no requiere archivo MP3)
- Para usar un archivo MP3 personalizado, coloca `notification.mp3` en `frontend/sounds/`
- El sistema actualiza pedidos automáticamente cada 5-10 segundos

## 🤝 Contribución

Este es un proyecto educativo. Siéntete libre de hacer fork y mejorar.

## 📄 Licencia

MIT License - Libre para uso educativo y comercial.

---

Desarrollado con ❤️ para El Sabor Colombiano 🇨🇴
