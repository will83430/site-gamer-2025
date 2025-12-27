async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT id, donnees_fiche FROM produits WHERE donnees_fiche IS NOT NULL ORDER BY id');
  
  let count = 0;
  
  for (const row of res.rows) {
    if (row.donnees_fiche && row.donnees_fiche.length > 1) {
      const ligne2 = row.donnees_fiche[1];
      
      // Si c'est du format "💰 Prix : XXX" au lieu de "💰 Prix\nXXX"
      if (ligne2 && ligne2.includes('💰') && ligne2.includes(' : ')) {
        // Extrait la valeur après le " : "
        const prixValue = ligne2.split(' : ')[1]?.trim() || ligne2;
        const newLigne2 = `💰 Prix\n${prixValue}`;
        
        const newDonnees = [...row.donnees_fiche];
        newDonnees[1] = newLigne2;
        
        await pool.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [newDonnees, row.id]);
        count++;
        console.log(`✅ ${row.id}: Reformatté`);
      }
    }
  }

  console.log(`\n✅ Total: ${count} entrées reformatées`);
  await pool.end();
}

main().catch(console.error);
