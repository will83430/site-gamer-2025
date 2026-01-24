async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query('SELECT id, nom, prix FROM produits WHERE prix IS NOT NULL ORDER BY id');
  
  console.log('\nPrix avec commentaires trouvés:\n');
  let count = 0;
  res.rows.forEach(row => {
    if (row.prix.includes('–') || row.prix.includes('Tarif') || row.prix.includes('incluant')) {
      count++;
      console.log(`${row.id} (${row.nom})`);
      console.log(`  Avant: ${JSON.stringify(row.prix)}`);
      
      // Extraire juste le prix
      let prixNettoye = row.prix;
      if (row.prix.includes('–')) {
        prixNettoye = row.prix.split('–')[0].trim();
      }
      
      console.log(`  Après: ${JSON.stringify(prixNettoye)}\n`);
    }
  });
  
  console.log(`\nTotal: ${count} prix à nettoyer`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
