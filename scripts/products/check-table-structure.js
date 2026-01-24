require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function checkStructure() {
  try {
    const result = await pool.query('SELECT * FROM produits WHERE id = $1', ['prod_1']);
    
    if (result.rows.length > 0) {
      console.log('Structure de la table produits:');
      console.log(Object.keys(result.rows[0]).join(', '));
      console.log('\nExemple de données:');
      console.log(JSON.stringify(result.rows[0], null, 2));
    }
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

checkStructure();
