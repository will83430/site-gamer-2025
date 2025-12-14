const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gamer_2025',
  password: 'Wilfried!1985',
  port: 5432,
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API test works!' });
});

app.get('/api/produits', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as total FROM produits');
    res.json({ success: true, total: parseInt(result.rows[0].total) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Test server running on http://localhost:${port}`);
  console.log(`Server object:`, server.address());
});

server.on('error', (err) => {
  console.error('❌ SERVER ERROR:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
  process.exit(1);
});

process.on('exit', (code) => {
  console.log(`⚠️ Process exiting with code: ${code}`);
});

console.log('🔄 Server script loaded, attempting to start...');
