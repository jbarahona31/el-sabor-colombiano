import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Función para verificar la conexión
pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en la base de datos:', err);
  process.exit(-1);
});

export default pool;
