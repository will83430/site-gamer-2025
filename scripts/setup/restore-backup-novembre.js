async function main() {
  const pool = require('../backend/config/database');

  // Restaure depuis le backup de novembre
  console.log('🔄 Restauration des 59 produits depuis produits_backup_novembre...');
  
  await pool.query('DELETE FROM produits');
  console.log('✅ Table vidée');
  
  await pool.query('INSERT INTO produits SELECT * FROM produits_backup_novembre');
  console.log('✅ Produits restaurés');
  
  const res = await pool.query('SELECT COUNT(*) as count FROM produits');
  console.log(`✅ Total: ${res.rows[0].count} produits restaurés`);

  await pool.end();
}

main().catch((err) => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});
