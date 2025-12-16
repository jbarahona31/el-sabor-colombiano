# 🧪 Guía de Pruebas - El Sabor Colombiano

Esta guía describe cómo probar todas las funcionalidades del sistema.

## 📋 Prerrequisitos

1. Backend en ejecución en `http://localhost:3000`
2. Frontend en ejecución en `http://localhost:8000` (o similar)
3. Base de datos PostgreSQL configurada y con datos de prueba

## 🔐 Usuarios de Prueba

| Usuario | Contraseña | Rol | Panel |
|---------|-----------|-----|--------|
| admin | 123456 | Administrador | `/panel-admin.html` |
| mesero | 123456 | Mesero | `/panel-mesero.html` |
| cocina | 123456 | Cocina | `/panel-cocina.html` |

## 🧪 Plan de Pruebas

### 1. Pruebas de Autenticación

#### Login Exitoso
1. Ir a `/login.html`
2. Ingresar usuario: `admin`, contraseña: `123456`
3. Click en "Iniciar Sesión"
4. **Resultado esperado**: Redirige a `/panel-admin.html`

#### Login Fallido
1. Ir a `/login.html`
2. Ingresar usuario: `admin`, contraseña: `incorrecta`
3. Click en "Iniciar Sesión"
4. **Resultado esperado**: Mensaje de error "Credenciales inválidas"

#### Protección de Rutas
1. Cerrar sesión (o abrir navegación privada)
2. Intentar acceder directamente a `/panel-admin.html`
3. **Resultado esperado**: Redirige automáticamente a `/login.html`

#### Redireccionamiento por Rol
1. Login con usuario `mesero`
2. **Resultado esperado**: Redirige a `/panel-mesero.html`, no a admin
3. Intentar acceder a `/panel-admin.html`
4. **Resultado esperado**: Mensaje de error y redirige según rol

### 2. Pruebas del Menú Principal (index.html)

#### Visualización de Productos
1. Ir a `/index.html`
2. **Resultado esperado**: 
   - Ver grid con 10 productos
   - Ver categorías (comidas y bebidas)
   - Ver precios formateados

#### Búsqueda de Productos
1. En el buscador, escribir "empanada"
2. **Resultado esperado**: Solo muestra productos con "empanada" en el nombre
3. Limpiar búsqueda
4. **Resultado esperado**: Vuelven a aparecer todos los productos

#### Filtros por Categoría
1. Click en "Comidas"
2. **Resultado esperado**: Solo muestra productos de categoría "comidas"
3. Click en "Bebidas"
4. **Resultado esperado**: Solo muestra bebidas
5. Click en "Todos"
6. **Resultado esperado**: Muestra todos los productos

#### Detalle de Producto
1. Click en una tarjeta de producto (no en el botón)
2. **Resultado esperado**: 
   - Abre modal con detalles
   - Muestra imagen, nombre, categoría, precio
   - Botón "Agregar al Carrito"

#### Agregar al Carrito
1. Click en "Agregar al Carrito" de un producto
2. **Resultado esperado**: 
   - Notificación de éxito
   - Contador del carrito aumenta

#### Gestión del Carrito
1. Agregar varios productos al carrito
2. Click en el botón del carrito
3. **Resultado esperado**: Modal muestra productos con cantidades
4. Click en "+" y "-" para cambiar cantidades
5. **Resultado esperado**: Total se actualiza correctamente
6. Click en 🗑️ para eliminar producto
7. **Resultado esperado**: Producto se elimina del carrito

### 3. Pruebas del Panel de Mesero

#### Acceso al Panel
1. Login con usuario `mesero`
2. **Resultado esperado**: Acceso a `/panel-mesero.html`

#### Crear Pedido Nuevo
1. Ingresar número de mesa (ej: 5)
2. En la lista de productos, seleccionar cantidad y click "Agregar"
3. Agregar 2-3 productos
4. **Resultado esperado**: Productos aparecen en "Productos Seleccionados"
5. Verificar que el total se calcula correctamente
6. Click "Enviar Pedido a Cocina"
7. **Resultado esperado**: 
   - Mensaje "¡Pedido enviado a cocina!"
   - Formulario se limpia
   - Pedido aparece en la tabla

#### Ver Lista de Pedidos
1. Verificar tabla de pedidos del día
2. **Resultado esperado**: 
   - Pedidos ordenados por más reciente
   - Ver ID, Mesa, Total, Estado, Hora
   - Botón "Ver Detalle"

#### Ver Detalle de Pedido
1. Click en "Ver Detalle" de un pedido
2. **Resultado esperado**: 
   - Modal con todos los productos
   - Cantidades y precios
   - Total correcto

#### Auto-actualización
1. Dejar el panel abierto
2. Crear un pedido desde otra sesión/navegador
3. **Resultado esperado**: El pedido aparece automáticamente en ~10 segundos

### 4. Pruebas del Panel de Cocina

#### Acceso al Panel
1. Login con usuario `cocina`
2. **Resultado esperado**: Acceso a `/panel-cocina.html`

#### Visualización de Pedidos
1. **Resultado esperado**: 
   - Pedidos agrupados por estado (Pendientes, En Preparación, Listos)
   - Tarjetas grandes con información clara
   - Tiempo transcurrido visible
   - Contadores de pedidos por estado

#### Cambiar Estado: Pendiente → Preparando
1. En un pedido pendiente, click "🔥 Comenzar a Preparar"
2. **Resultado esperado**: 
   - Mensaje de confirmación
   - Pedido se mueve a "En Preparación"
   - Contador se actualiza

#### Cambiar Estado: Preparando → Listo
1. En un pedido en preparación, click "✅ Marcar como Listo"
2. **Resultado esperado**: 
   - Mensaje "¡Pedido listo para servir!"
   - Pedido se mueve a "Listos para Servir"
   - Contador se actualiza

#### Cambiar Estado: Listo → Entregado
1. En un pedido listo, click "📦 Marcar como Entregado"
2. **Resultado esperado**: 
   - Pedido desaparece de la vista
   - Estado cambia a "entregado"

#### Notificación Sonora
1. Activar checkbox "🔔 Sonido de notificación"
2. Crear un nuevo pedido desde el panel de mesero
3. **Resultado esperado**: 
   - Panel de cocina reproduce sonido
   - Nuevo pedido aparece en "Pendientes"

#### Pedidos Urgentes
1. Esperar más de 15 minutos con un pedido pendiente
2. **Resultado esperado**: 
   - Tarjeta se marca como urgente (borde rojo)
   - Animación de pulso

#### Auto-actualización
1. Dejar el panel abierto
2. **Resultado esperado**: Se actualiza cada 5 segundos automáticamente

### 5. Pruebas del Panel de Administrador

#### Acceso al Panel
1. Login con usuario `admin`
2. **Resultado esperado**: Acceso a `/panel-admin.html`

#### Estadísticas
1. Verificar las 4 tarjetas de estadísticas
2. **Resultado esperado**: 
   - Pedidos Hoy
   - Ventas Hoy (en pesos)
   - Completados
   - Activos

#### Tab: Productos - Ver Lista
1. Click en tab "📦 Productos"
2. **Resultado esperado**: 
   - Tabla con todos los productos
   - Columnas: ID, Nombre, Categoría, Precio, Disponible
   - Botones Editar y Eliminar

#### Tab: Productos - Crear Nuevo
1. Click "Nuevo Producto"
2. Llenar formulario:
   - Nombre: "Brownie"
   - Precio: 2500
   - Categoría: comidas
   - Imagen: brownie.jpg
   - Disponible: ✓
3. Click "Guardar"
4. **Resultado esperado**: 
   - Mensaje "Producto creado correctamente"
   - Producto aparece en la tabla

#### Tab: Productos - Editar
1. Click "✏️ Editar" en un producto
2. Modificar el precio
3. Click "Guardar"
4. **Resultado esperado**: 
   - Mensaje "Producto actualizado correctamente"
   - Cambios se reflejan en la tabla

#### Tab: Productos - Eliminar
1. Click "🗑️ Eliminar" en un producto
2. Confirmar en el diálogo
3. **Resultado esperado**: 
   - Mensaje "Producto eliminado correctamente"
   - Producto desaparece de la tabla (soft delete)

#### Tab: Pedidos - Ver Lista
1. Click en tab "📋 Pedidos"
2. **Resultado esperado**: 
   - Tabla con todos los pedidos
   - Ver mesa, productos, total, estado, fecha

#### Tab: Ventas - Ver Reporte
1. Click en tab "💵 Ventas"
2. **Resultado esperado**: 
   - Reporte agrupado por fecha
   - Cantidad de pedidos por día
   - Total de ventas por día

#### Tab: Ventas - Exportar CSV
1. Click "📥 Exportar CSV"
2. **Resultado esperado**: 
   - Se descarga archivo CSV
   - Contiene todos los pedidos con datos correctos

### 6. Pruebas de Seguridad

#### Rate Limiting - Login
1. Intentar hacer login con contraseña incorrecta 6 veces seguidas
2. **Resultado esperado**: 
   - Después del 5to intento, mensaje de rate limit
   - Debe esperar 15 minutos

#### Rate Limiting - API General
1. Hacer más de 100 peticiones a la API en menos de 15 minutos
2. **Resultado esperado**: 
   - Después de la petición 100, respuesta 429
   - Mensaje de demasiadas peticiones

#### Token Expirado
1. Login y guardar token
2. Esperar 24 horas (o modificar token manualmente)
3. Intentar hacer una petición
4. **Resultado esperado**: 
   - Error "Token inválido o expirado"
   - Redirige a login

#### Acceso sin Token
1. Eliminar token del localStorage
2. Intentar acceder a `/api/pedidos` directamente
3. **Resultado esperado**: Error 401 "Token no proporcionado"

### 7. Pruebas de Integración Completa

#### Flujo Completo: Cliente → Mesero → Cocina
1. **Cliente**: Agregar productos al carrito en index.html
2. **Cliente**: Enviar pedido con número de mesa
3. **Mesero**: Ver pedido aparecer en panel-mesero.html
4. **Cocina**: Ver pedido en "Pendientes" en panel-cocina.html
5. **Cocina**: Escuchar notificación sonora
6. **Cocina**: Marcar como "En Preparación"
7. **Cocina**: Marcar como "Listo"
8. **Mesero**: Verificar estado actualizado
9. **Admin**: Ver pedido en estadísticas y reporte

### 8. Pruebas de Persistencia

#### LocalStorage - Carrito
1. Agregar productos al carrito
2. Recargar la página
3. **Resultado esperado**: Productos siguen en el carrito

#### LocalStorage - Sesión
1. Hacer login
2. Recargar la página
3. **Resultado esperado**: Mantiene la sesión activa

#### Base de Datos - Pedidos
1. Crear un pedido
2. Cerrar navegador
3. Abrir nuevamente y hacer login
4. **Resultado esperado**: El pedido sigue existiendo

## 🐛 Problemas Conocidos

### Limitaciones Actuales
1. No hay validación de stock de productos
2. No hay histórico de cambios de estado de pedidos
3. El sonido de notificación usa Web Audio API (no archivo MP3)
4. No hay paginación en tablas con muchos registros

## ✅ Criterios de Aceptación

Para considerar el sistema completamente funcional, todas las pruebas anteriores deben pasar exitosamente.

### Checklist de Pruebas
- [ ] Login exitoso para los 3 roles
- [ ] Protección de rutas funciona
- [ ] Productos se cargan y muestran correctamente
- [ ] Búsqueda y filtros funcionan
- [ ] Carrito permite agregar/eliminar productos
- [ ] Mesero puede crear pedidos
- [ ] Cocina puede ver y actualizar estados
- [ ] Admin puede hacer CRUD de productos
- [ ] Estadísticas se calculan correctamente
- [ ] Exportación a CSV funciona
- [ ] Rate limiting previene abuso
- [ ] Auto-actualización funciona en todos los paneles
- [ ] Notificaciones sonoras funcionan

## 📞 Soporte

Si encuentras algún error durante las pruebas, por favor documenta:
1. Pasos para reproducir
2. Resultado esperado
3. Resultado actual
4. Capturas de pantalla si es posible
5. Consola del navegador (F12)

---

✨ **¡Gracias por probar El Sabor Colombiano!** 🇨🇴
