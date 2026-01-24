async function main() {
  const pool = require('../backend/config/database');

  console.log('=== Schéma produits ===');
  const schema1 = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'produits' 
    ORDER BY ordinal_position
  `);
  schema1.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));

  console.log('\n=== Schéma produits_backup_novembre ===');
  const schema2 = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'produits_backup_novembre' 
    ORDER BY ordinal_position
  `);
  schema2.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));

  console.log('\n=== Compte produits_backup_novembre ===');
  const count = await pool.query('SELECT COUNT(*) as count FROM produits_backup_novembre');
  console.log(`  ${count.rows[0].count} produits`);

  await pool.end();
}

main().catch(console.error);
