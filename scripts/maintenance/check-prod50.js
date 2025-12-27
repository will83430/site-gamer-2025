async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT id, donnees_fiche FROM produits WHERE id = $1', ['prod_50']);
  
  if (res.rows.length > 0) {
    console.log('prod_50 donnees_fiche:');
    console.log(JSON.stringify(res.rows[0].donnees_fiche, null, 2));
  }

  await pool.end();
}

main().catch(console.error);
