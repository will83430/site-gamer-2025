const fs = require('fs');
async function main() {
  const pool = require('../backend/config/database');

  // Nettoie la table
  await pool.query('TRUNCATE TABLE produits RESTART IDENTITY');
  console.log('✅ Table vidée');

  // Lit le seed SQL
  const sql = fs.readFileSync('./backend/gestion_produits.sql', 'utf-8');
  
  // Exécute
  await pool.query(sql);
  console.log('✅ Seed réinséré');

  await pool.end();
}

main().catch(console.error);
