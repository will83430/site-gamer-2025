async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT id, donnees_fiche FROM produits WHERE donnees_fiche IS NOT NULL ORDER BY id');
  
  let count = 0;
  
  for (const row of res.rows) {
    if (row.donnees_fiche && row.donnees_fiche.length > 1) {
      const ligne2 = row.donnees_fiche[1];
      
      // Vérifie si c'est le mauvais format (💰 Prix\n999)
      if (ligne2 && ligne2.includes('💰') && ligne2.includes('\n')) {
        // Récupère la vraie valeur depuis la DB
        const parts = ligne2.split('\n');
        const prixValue = parts[1] || '';
        
        // Cherche le prix original dans le champ prix
        const prix = row.prix || prixValue;
        
        // Réconstruit: "💰 [Prix] – description" (comme à l'origine, il faut chercher une description générique)
        const newLigne2 = `💰 ${prix}`;
        
        const newDonnees = [...row.donnees_fiche];
        newDonnees[1] = newLigne2;
        
        await pool.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [newDonnees, row.id]);
        count++;
        console.log(`✅ ${row.id}: Restauré à ${newLigne2}`);
      }
    }
  }

  console.log(`\n✅ Total: ${count} entrées restaurées`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
