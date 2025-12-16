import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

// Login de usuario
export const login = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    // Validar que se envíen los datos
    if (!usuario || !clave) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario en la base de datos
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = $1',
      [usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuarioDb = result.rows[0];

    // Verificar contraseña
    const claveValida = await bcrypt.compare(clave, usuarioDb.clave);

    if (!claveValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuarioDb.id, 
        usuario: usuarioDb.usuario, 
        rol: usuarioDb.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Enviar respuesta
    res.json({
      token,
      usuario: {
        id: usuarioDb.id,
        usuario: usuarioDb.usuario,
        rol: usuarioDb.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Verificar token (para validar sesión)
export const verificarSesion = async (req, res) => {
  res.json({
    valido: true,
    usuario: req.usuario
  });
};
