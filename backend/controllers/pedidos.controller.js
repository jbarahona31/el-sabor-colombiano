import pool from '../db.js';

// Obtener todos los pedidos
export const obtenerPedidos = async (req, res) => {
  try {
    const { estado } = req.query;
    
    let query = 'SELECT * FROM pedidos ORDER BY created_at DESC';
    let params = [];

    if (estado) {
      query = 'SELECT * FROM pedidos WHERE estado = $1 ORDER BY created_at DESC';
      params = [estado];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Obtener un pedido por ID
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

// Crear un nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { mesa, productos } = req.body;

    if (!mesa || !productos || productos.length === 0) {
      return res.status(400).json({ error: 'Mesa y productos son requeridos' });
    }

    // Calcular el total
    const total = productos.reduce((sum, p) => sum + (p.precio * (p.cantidad || 1)), 0);

    const result = await pool.query(
      'INSERT INTO pedidos (mesa, productos, total, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [mesa, JSON.stringify(productos), total, 'pendiente']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

// Actualizar el estado de un pedido
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ error: 'Estado es requerido' });
    }

    const estadosValidos = ['pendiente', 'preparando', 'listo', 'entregado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const result = await pool.query(
      'UPDATE pedidos SET estado = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
};

// Obtener estadísticas de ventas
export const obtenerEstadisticas = async (req, res) => {
  try {
    const estadisticas = await pool.query(`
      SELECT 
        COUNT(*) as total_pedidos,
        SUM(total) as ventas_totales,
        AVG(total) as promedio_venta,
        COUNT(CASE WHEN estado = 'entregado' THEN 1 END) as pedidos_completados,
        COUNT(CASE WHEN estado = 'pendiente' OR estado = 'preparando' THEN 1 END) as pedidos_activos
      FROM pedidos
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    res.json(estadisticas.rows[0]);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};
