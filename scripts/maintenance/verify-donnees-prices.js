async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT id, donnees_fiche FROM produits WHERE donnees_fiche IS NOT NULL ORDER BY id');
  
  let count = 0;
  
  for (const row of res.rows) {
    if (row.donnees_fiche && row.donnees_fiche.length > 1) {
      const ligne2 = row.donnees_fiche[1];
      if (ligne2 && ligne2.includes('💰') && ligne2.includes('–')) {
        count++;
        console.log(`❌ ${row.id}: ${ligne2}`);
      }
    }
  }

  if (count === 0) {
    console.log('✅ Aucun produit trouvé avec des tirets dans donnees_fiche[2]');
    console.log('✅ Tous les prix sont nettoyés !');
  } else {
    console.log(`\n❌ ${count} produits restent avec des descriptions`);
  }
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
