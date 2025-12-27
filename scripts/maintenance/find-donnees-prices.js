async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT id, nom, donnees_fiche FROM produits WHERE donnees_fiche IS NOT NULL ORDER BY id');
  
  console.log('\nDonnees_fiche avec prix contenant commentaires:\n');
  let found = [];
  
  res.rows.forEach(row => {
    if (row.donnees_fiche && row.donnees_fiche.length > 1) {
      const ligne2 = row.donnees_fiche[1];
      if (ligne2 && ligne2.includes('💰') && ligne2.includes('–')) {
        found.push({ id: row.id, nom: row.nom, ligne2 });
        console.log(`${row.id} (${row.nom})`);
        console.log(`  ${ligne2.substring(0, 150)}...\n`);
      }
    }
  });

  console.log(`Total: ${found.length} à nettoyer`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
