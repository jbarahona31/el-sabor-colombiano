# 🏗️ Arquitectura del Sistema - El Sabor Colombiano

Este documento describe la arquitectura técnica del sistema.

## 📐 Arquitectura General

```
┌─────────────────────────────────────────────────┐
│                   FRONTEND                       │
│            (HTML + CSS + JavaScript)             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Public  │  │  Login   │  │  Panels  │      │
│  │   Menu   │  │   Page   │  │  (3x)    │      │
│  └──────────┘  └──────────┘  └──────────┘      │
│       │              │              │            │
│       └──────────────┴──────────────┘            │
│                      │                           │
│              ┌───────▼────────┐                  │
│              │   API Module   │                  │
│              │   (api.js)     │                  │
│              └───────┬────────┘                  │
└──────────────────────┼──────────────────────────┘
                       │
                  HTTPS/REST
                       │
┌──────────────────────▼──────────────────────────┐
│                   BACKEND                        │
│          (Node.js + Express)                     │
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │         Middlewares Layer              │     │
│  │  ┌──────────┐  ┌────────────────────┐  │     │
│  │  │   CORS   │  │  Rate Limiting     │  │     │
│  │  └──────────┘  └────────────────────┘  │     │
│  │  ┌──────────────────────────────────┐  │     │
│  │  │   JWT Authentication             │  │     │
│  │  └──────────────────────────────────┘  │     │
│  └────────────────────────────────────────┘     │
│                      │                           │
│  ┌────────────────────────────────────────┐     │
│  │           Routes Layer                 │     │
│  │  /api/auth  /api/productos  /api/pedidos│    │
│  └────────────────┬───────────────────────┘     │
│                   │                              │
│  ┌────────────────▼───────────────────────┐     │
│  │        Controllers Layer               │     │
│  │  Business Logic & Validation           │     │
│  └────────────────┬───────────────────────┘     │
│                   │                              │
│  ┌────────────────▼───────────────────────┐     │
│  │         Database Layer                 │     │
│  │     PostgreSQL Connection Pool         │     │
│  └────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│              PostgreSQL Database                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ usuarios │  │productos │  │ pedidos  │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
```

## 🗂️ Estructura de Directorios

```
el-sabor-colombiano/
│
├── backend/                          # Servidor Node.js
│   ├── controllers/                  # Lógica de negocio
│   │   ├── auth.controller.js       # Login y JWT
│   │   ├── productos.controller.js  # CRUD productos
│   │   └── pedidos.controller.js    # Gestión pedidos
│   │
│   ├── routes/                       # Definición de rutas
│   │   ├── auth.routes.js           # POST /api/auth/login
│   │   ├── productos.routes.js      # CRUD /api/productos
│   │   └── pedidos.routes.js        # CRUD /api/pedidos
│   │
│   ├── middlewares/                  # Middlewares Express
│   │   ├── auth.middleware.js       # verificarToken, verificarRol
│   │   └── rateLimiter.middleware.js # Rate limiting
│   │
│   ├── db.js                         # Pool de conexiones PostgreSQL
│   ├── index.js                      # Punto de entrada del servidor
│   ├── schema.sql                    # Schema y datos iniciales
│   ├── package.json                  # Dependencias del backend
│   └── .env.example                  # Template de variables de entorno
│
└── frontend/                         # Cliente web
    ├── index.html                    # Menú principal público
    ├── login.html                    # Página de autenticación
    ├── panel-admin.html              # Panel de administrador
    ├── panel-mesero.html             # Panel de mesero
    ├── panel-cocina.html             # Panel de cocina
    │
    ├── app.js                        # Lógica del menú principal
    ├── login.js                      # Lógica de autenticación
    ├── panel-admin.js                # Lógica del panel admin
    ├── panel-mesero.js               # Lógica del panel mesero
    ├── panel-cocina.js               # Lógica del panel cocina
    │
    ├── api.js                        # Módulo de comunicación HTTP
    ├── auth.js                       # Módulo de gestión de sesión
    ├── pedidos.js                    # Utilidades de pedidos
    │
    ├── styles.css                    # Estilos globales
    │
    ├── images/                       # Imágenes de productos
    │   └── default.jpg
    │
    └── sounds/                       # Archivos de audio
        └── .gitkeep
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → login.html
    ↓
  login.js (captura formulario)
    ↓
  api.js (POST /api/auth/login)
    ↓
  Backend: auth.routes.js
    ↓
  auth.controller.js
    ↓
  - Busca usuario en BD
  - Verifica password con bcrypt
  - Genera JWT token
    ↓
  Respuesta: { token, usuario: { rol } }
    ↓
  login.js guarda en localStorage
    ↓
  Redirige según rol → panel-{rol}.html
```

### 2. Crear Pedido
```
Mesero → panel-mesero.html
    ↓
  Selecciona productos
    ↓
  panel-mesero.js (click "Enviar")
    ↓
  pedidosAPI.crear({ mesa, productos })
    ↓
  Backend: pedidos.routes.js
    ↓
  Middleware: verificarToken, verificarRol
    ↓
  pedidos.controller.js
    ↓
  - Valida datos
  - Calcula total
  - INSERT en tabla pedidos
    ↓
  Respuesta: Pedido creado
    ↓
  Frontend actualiza lista
```

### 3. Actualización en Tiempo Real (Cocina)
```
panel-cocina.js
    ↓
  setInterval(cargarPedidos, 5000)
    ↓
  GET /api/pedidos?estado=pendiente
    ↓
  Compara con pedidos anteriores
    ↓
  Si hay nuevos: reproduce sonido
    ↓
  Renderiza tarjetas por estado
    ↓
  Usuario click "Preparar"
    ↓
  PUT /api/pedidos/:id { estado: 'preparando' }
    ↓
  Backend actualiza BD
    ↓
  Frontend recarga pedidos
```

## 🔐 Sistema de Seguridad

### Capas de Seguridad

1. **Rate Limiting**
   - Previene ataques de fuerza bruta
   - Limita requests por IP
   - 3 niveles: general, auth, write

2. **Autenticación JWT**
   - Token firmado con secreto
   - Expira en 24 horas
   - Incluye: id, usuario, rol

3. **Autorización por Roles**
   - Middleware verificaRol
   - Controla acceso por endpoint
   - 3 roles: admin, mesero, cocina

4. **Encriptación**
   - Passwords con bcrypt (salt rounds: 10)
   - HTTPS en producción (recomendado)

5. **Validación de Datos**
   - Controllers validan input
   - PostgreSQL previene SQL injection
   - Express.json limita payload

### Matriz de Permisos

| Endpoint | Público | Admin | Mesero | Cocina |
|----------|---------|-------|--------|--------|
| POST /auth/login | ✅ | ✅ | ✅ | ✅ |
| GET /productos | ✅ | ✅ | ✅ | ✅ |
| POST /productos | ❌ | ✅ | ❌ | ❌ |
| PUT /productos | ❌ | ✅ | ❌ | ❌ |
| DELETE /productos | ❌ | ✅ | ❌ | ❌ |
| GET /pedidos | ❌ | ✅ | ✅ | ✅ |
| POST /pedidos | ❌ | ✅ | ✅ | ❌ |
| PUT /pedidos | ❌ | ✅ | ❌ | ✅ |
| GET /estadisticas | ❌ | ✅ | ❌ | ❌ |

## 💾 Base de Datos

### Esquema

```sql
usuarios
├── id (SERIAL PRIMARY KEY)
├── usuario (VARCHAR UNIQUE)
├── clave (VARCHAR) -- bcrypt hash
├── rol (VARCHAR) -- 'admin', 'mesero', 'cocina'
└── created_at (TIMESTAMP)

productos
├── id (SERIAL PRIMARY KEY)
├── nombre (VARCHAR)
├── precio (DECIMAL)
├── categoria (VARCHAR) -- 'comidas', 'bebidas'
├── imagen (VARCHAR)
├── disponible (BOOLEAN)
└── created_at (TIMESTAMP)

pedidos
├── id (SERIAL PRIMARY KEY)
├── mesa (INTEGER)
├── productos (JSONB) -- Array de productos
├── estado (VARCHAR) -- 'pendiente', 'preparando', 'listo', 'entregado'
├── total (DECIMAL)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Relaciones
- No hay FKs tradicionales
- `pedidos.productos` contiene snapshot de productos (JSONB)
- Esto permite mantener historial incluso si producto cambia/elimina

## 🎨 Frontend: Patrones de Diseño

### Module Pattern
- Cada archivo JS es un módulo ES6
- Imports/exports explícitos
- Evita contaminación del scope global

### Separation of Concerns
- **HTML**: Estructura
- **CSS**: Presentación
- **JS**: Comportamiento
- **API**: Datos

### Estado Local
- `localStorage` para cart y session
- Variables globales por módulo
- No framework state management

### Comunicación Asíncrona
- Fetch API para HTTP
- Promises con async/await
- Error handling en try/catch

## 🔌 API Design

### RESTful Principles
```
GET     /api/recursos          # Listar
GET     /api/recursos/:id      # Obtener uno
POST    /api/recursos          # Crear
PUT     /api/recursos/:id      # Actualizar
DELETE  /api/recursos/:id      # Eliminar
```

### Response Format
```json
// Success
{
  "id": 1,
  "nombre": "Producto",
  ...
}

// Error
{
  "error": "Descripción del error"
}
```

### HTTP Status Codes
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## 🚀 Performance

### Backend
- Connection pooling (PostgreSQL)
- Rate limiting previene sobrecarga
- JSON parsing limitado

### Frontend
- Vanilla JS (no framework overhead)
- CSS Grid/Flexbox (no Bootstrap)
- LocalStorage caching
- Lazy loading potencial (no implementado)

### Database
- Índices en columnas frecuentes (id, usuario)
- JSONB para productos en pedidos (rápido)
- Queries optimizados

## 🔧 Extensibilidad

### Agregar Nuevo Endpoint
1. Crear función en controller
2. Agregar ruta en routes
3. Aplicar middlewares necesarios
4. Agregar función en api.js (frontend)

### Agregar Nuevo Rol
1. Modificar enum en schema.sql
2. Agregar caso en verificarRol
3. Crear panel-{rol}.html
4. Agregar ruta en redirigirSegunRol

### Agregar Nueva Tabla
1. Agregar CREATE TABLE en schema.sql
2. Crear controller
3. Crear routes
4. Actualizar frontend

## 📊 Monitoreo y Logs

### Backend Logs
- Console.log para eventos importantes
- Errores en try/catch
- Conexión a BD
- Inicio del servidor

### Frontend Debugging
- DevTools Console (F12)
- Network tab para requests
- Application tab para localStorage

## 🌐 Deployment

### Backend (Railway)
- Detecta automáticamente Node.js
- Provee PostgreSQL managed
- Variables de entorno vía UI
- Auto-deploy desde Git

### Frontend (Netlify/Vercel)
- Deploy carpeta `frontend/`
- No build process necesario
- Actualizar API_URL a producción
- CDN global automático

---

Este documento proporciona una visión completa de la arquitectura del sistema.
Para más detalles de implementación, revisar el código fuente comentado.
