require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gamer_2025',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test de connexion au démarrage
pool.on('connect', () => {
  console.log('✅ Connexion à PostgreSQL établie');
});

pool.on('error', (err) => {
  console.error('❌ Erreur de connexion PostgreSQL:', err);
  process.exit(-1);
});

module.exports = pool;
