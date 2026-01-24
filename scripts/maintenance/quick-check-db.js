async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT COUNT(*) as count FROM produits');
  console.log(`📊 Produits dans la DB: ${res.rows[0].count}`);
  
  if (res.rows[0].count > 0) {
    const products = await pool.query('SELECT id, nom, prix FROM produits LIMIT 5');
    console.log('\n📋 Premiers produits:');
    products.rows.forEach(p => console.log(`  ${p.id}: ${p.nom} - ${p.prix}`));
  } else {
    console.log('❌ Table vide!');
  }

  await pool.end();
}

main().catch(console.error);
