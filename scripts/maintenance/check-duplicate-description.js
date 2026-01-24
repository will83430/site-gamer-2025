async function main() {
  const pool = require('../backend/config/database');

  const ids = ['prod_11', 'prod_46', 'prod_22', 'prod_24', 'prod_4', 'prod_20'];
  
  for (const productId of ids) {
    const res = await pool.query(
      'SELECT id, nom, donnees_fiche FROM produits WHERE id = $1',
      [productId]
    );
  
    if (res.rows.length === 0) continue;
    
    const product = res.rows[0];
    const descriptions = product.donnees_fiche.filter(item => item.includes('Description'));
    if (descriptions.length > 1) {
      console.log(`\n⚠️ ${product.id} - ${product.nom}: ${descriptions.length} "Description" trouvées`);
      descriptions.forEach((desc, idx) => console.log(`  [${idx}] ${desc.substring(0, 100)}`));
    }
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
