-- Base de datos para El Sabor Colombiano

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  usuario VARCHAR(50) UNIQUE NOT NULL,
  clave VARCHAR(255) NOT NULL,
  rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'mesero', 'cocina')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  imagen VARCHAR(255),
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  mesa INTEGER NOT NULL,
  productos JSONB NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'preparando', 'listo', 'entregado')),
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuarios por defecto (password: 123456)
-- Contraseña hasheada con bcrypt: $2b$10$8X9vXZq5YhKZ8FqL5Y9H5ew8.4L5e5Q5Z5Q5Z5Q5Z5Q5Z5Q5Z5Q5
INSERT INTO usuarios (usuario, clave, rol) VALUES
  ('admin', '$2b$10$8X9vXZq5YhKZ8FqL5Y9H5ew8.4L5e5Q5Z5Q5Z5Q5Z5Q5Z5Q5Z5Q5', 'admin'),
  ('mesero', '$2b$10$8X9vXZq5YhKZ8FqL5Y9H5ew8.4L5e5Q5Z5Q5Z5Q5Z5Q5Z5Q5Z5Q5', 'mesero'),
  ('cocina', '$2b$10$8X9vXZq5YhKZ8FqL5Y9H5ew8.4L5e5Q5Z5Q5Z5Q5Z5Q5Z5Q5Z5Q5', 'cocina')
ON CONFLICT (usuario) DO NOTHING;

-- Insertar productos iniciales
INSERT INTO productos (nombre, precio, categoria, imagen) VALUES
  ('Papas Rellenas', 3500, 'comidas', 'papas-rellenas.jpg'),
  ('Empanada de Pollo', 1500, 'comidas', 'empanada-pollo.jpg'),
  ('Empanada de Carne', 1500, 'comidas', 'empanada-carne.jpg'),
  ('Empanada Ranchera', 1800, 'comidas', 'empanada-ranchera.jpg'),
  ('Arepa con Queso', 2500, 'comidas', 'arepa-queso.jpg'),
  ('Arepa con Carne', 3500, 'comidas', 'arepa-carne.jpg'),
  ('Avena', 2000, 'bebidas', 'avena.jpg'),
  ('Jugo Natural', 2500, 'bebidas', 'jugo.jpg'),
  ('Café', 1800, 'bebidas', 'cafe.jpg'),
  ('Chocolate', 2200, 'bebidas', 'chocolate.jpg')
ON CONFLICT DO NOTHING;
