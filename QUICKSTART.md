# 🚀 Guía de Inicio Rápido - El Sabor Colombiano

Esta guía te ayudará a tener el sistema funcionando en menos de 10 minutos.

## 📦 Pre-requisitos

Asegúrate de tener instalado:
- Node.js (v16+) - [Descargar](https://nodejs.org/)
- PostgreSQL (v12+) - [Descargar](https://www.postgresql.org/download/)
- Un editor de código (VS Code recomendado)

## ⚡ Pasos Rápidos

### 1. Configurar Base de Datos (2 minutos)

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE el_sabor_colombiano;

# Salir
\q

# Ejecutar el schema
cd backend
psql -U postgres -d el_sabor_colombiano -f schema.sql
```

### 2. Configurar Backend (3 minutos)

```bash
# Ir a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus datos
# DATABASE_URL=postgresql://postgres:tupassword@localhost:5432/el_sabor_colombiano
# JWT_SECRET=algun_secreto_aleatorio_muy_seguro
# PORT=3000

# Iniciar servidor
npm start
```

✅ Backend corriendo en `http://localhost:3000`

### 3. Configurar Frontend (2 minutos)

```bash
# Ir a la carpeta frontend
cd ../frontend

# Opción A: Con Python 3
python -m http.server 8000

# Opción B: Con Node.js
npx http-server -p 8000

# Opción C: Con VS Code Live Server
# Click derecho en index.html -> Open with Live Server
```

✅ Frontend corriendo en `http://localhost:8000`

### 4. Probar el Sistema (3 minutos)

#### a) Login
1. Ir a `http://localhost:8000/login.html`
2. Usuario: `admin`, Contraseña: `123456`
3. Click "Iniciar Sesión"

#### b) Panel Admin
- Verás el panel de administrador
- Revisa productos en la pestaña "Productos"
- Ve estadísticas en tiempo real

#### c) Crear Pedido (como Mesero)
1. Cerrar sesión
2. Login con: `mesero` / `123456`
3. Seleccionar productos
4. Ingresar número de mesa
5. Click "Enviar Pedido a Cocina"

#### d) Ver en Cocina
1. Abrir nueva pestaña
2. Login con: `cocina` / `123456`
3. Ver el pedido en "Pendientes"
4. Click "Comenzar a Preparar"
5. Click "Marcar como Listo"

## 🎯 URLs Importantes

| Página | URL |
|--------|-----|
| Menú Principal | http://localhost:8000/index.html |
| Login | http://localhost:8000/login.html |
| Panel Admin | http://localhost:8000/panel-admin.html |
| Panel Mesero | http://localhost:8000/panel-mesero.html |
| Panel Cocina | http://localhost:8000/panel-cocina.html |
| API Backend | http://localhost:3000/api |

## 👥 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | 123456 | Administrador |
| mesero | 123456 | Mesero |
| cocina | 123456 | Cocina |

## 🔧 Comandos Útiles

### Ver logs del backend
```bash
cd backend
npm start
# Los logs aparecerán en la terminal
```

### Reiniciar la base de datos
```bash
psql -U postgres -d el_sabor_colombiano -f backend/schema.sql
```

### Ver pedidos en la base de datos
```bash
psql -U postgres -d el_sabor_colombiano
SELECT * FROM pedidos;
\q
```

## ❌ Problemas Comunes

### "Cannot find module"
```bash
cd backend
npm install
```

### "EADDRINUSE: address already in use"
```bash
# Puerto 3000 ocupado, cambiar en .env:
PORT=3001
```

### "Connection refused" en PostgreSQL
```bash
# Verificar que PostgreSQL está corriendo
# Windows: Services -> PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "CORS error" en el navegador
- Verificar que el backend está corriendo
- Verificar que el frontend usa el puerto correcto
- Verificar que `API_URL` en `frontend/api.js` apunta a `http://localhost:3000/api`

## 📚 Siguiente Paso

Lee la [Guía de Pruebas Completa](TESTING.md) para probar todas las funcionalidades.

## 💡 Tips

1. **Durante desarrollo**: Usa 2 terminales (una para backend, otra para frontend)
2. **Para debugging**: Abre DevTools (F12) en el navegador
3. **Ver requests**: Pestaña Network en DevTools
4. **Ver errores**: Pestaña Console en DevTools

## 🎉 ¡Listo!

Si llegaste hasta aquí, el sistema está funcionando. ¡Disfruta usando El Sabor Colombiano! 🇨🇴

---

**¿Necesitas ayuda?** Revisa el [README.md](README.md) para más detalles.
