async function main() {
  const pool = require('../backend/config/database');

  // Extrait les colonnes
  console.log('=== Colonne produits_backup_novembre ===');
  const res = await pool.query('SELECT * FROM produits_backup_novembre LIMIT 1');
  if (res.rows.length > 0) {
    console.log('Colonnes:', Object.keys(res.rows[0]));
    console.log('\nPremier produit:');
    console.log(JSON.stringify(res.rows[0], null, 2));
  }

  await pool.end();
}

main().catch(console.error);
