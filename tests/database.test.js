// tests/database.test.js
// Test de la connexion à la base de données
const pool = require('../backend/config/database');

describe('Database Connection', () => {
  test('Should connect to PostgreSQL successfully', async () => {
    const result = await pool.query('SELECT NOW()');
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].now).toBeDefined();
  });

  test('Should retrieve products count', async () => {
    const result = await pool.query('SELECT COUNT(*) FROM produits');
    expect(result.rows).toHaveLength(1);
    expect(parseInt(result.rows[0].count)).toBeGreaterThan(0);
  });

  test('Should retrieve categories', async () => {
    const result = await pool.query('SELECT * FROM categories');
    expect(result.rows.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await pool.end();
  });
});
