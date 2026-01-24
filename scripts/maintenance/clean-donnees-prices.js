async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT id, donnees_fiche FROM produits WHERE donnees_fiche IS NOT NULL ORDER BY id');
  
  let count = 0;
  
  for (const row of res.rows) {
    if (row.donnees_fiche && row.donnees_fiche.length > 1) {
      const ligne2 = row.donnees_fiche[1];
      if (ligne2 && ligne2.includes('💰') && ligne2.includes('–')) {
        // Extraire juste: "💰 Prix"
        const prixOnly = ligne2.split('–')[0].trim();
        const newDonnees = [...row.donnees_fiche];
        newDonnees[1] = prixOnly;
        
        await pool.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [newDonnees, row.id]);
        count++;
        console.log(`✅ ${row.id}: ${ligne2.substring(0, 80)}... → ${prixOnly}`);
      }
    }
  }

  console.log(`\n✅ Total: ${count} entrées nettoyées`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
