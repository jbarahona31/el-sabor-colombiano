import pool from '../db.js';

// Obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let query = 'SELECT * FROM productos WHERE disponible = true ORDER BY categoria, nombre';
    let params = [];

    if (categoria) {
      query = 'SELECT * FROM productos WHERE categoria = $1 AND disponible = true ORDER BY nombre';
      params = [categoria];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

// Obtener un producto por ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Crear un nuevo producto
export const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, categoria, imagen } = req.body;

    if (!nombre || !precio || !categoria) {
      return res.status(400).json({ error: 'Nombre, precio y categoría son requeridos' });
    }

    const result = await pool.query(
      'INSERT INTO productos (nombre, precio, categoria, imagen) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, precio, categoria, imagen || 'default.jpg']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Actualizar un producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, categoria, imagen, disponible } = req.body;

    const result = await pool.query(
      'UPDATE productos SET nombre = COALESCE($1, nombre), precio = COALESCE($2, precio), categoria = COALESCE($3, categoria), imagen = COALESCE($4, imagen), disponible = COALESCE($5, disponible) WHERE id = $6 RETURNING *',
      [nombre, precio, categoria, imagen, disponible, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar un producto (soft delete)
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'UPDATE productos SET disponible = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
