async function fillTitreAffiche() {
  const c = new Client({ user: 'postgres', host: 'localhost', database: 'gamer_2025', password: 'Wilfried!1985', port: 5432 });
  await c.connect();
  
  console.log('📊 Vérification des titre_affiche vides...\n');
  
  // Trouver tous les produits avec titre_affiche vide ou NULL
  const r = await c.query("SELECT id, nom FROM produits WHERE titre_affiche IS NULL OR titre_affiche = ''");
  console.log(`Produits à compléter: ${r.rows.length}\n`);
  
  for (const product of r.rows) {
    // Utiliser le nom du produit comme titre_affiche
    await c.query('UPDATE produits SET titre_affiche = $1 WHERE id = $2', [product.nom, product.id]);
    console.log(`✅ ${product.id} - ${product.nom}`);
  }
  
  const result = await c.query('SELECT COUNT(*) as total FROM produits WHERE titre_affiche IS NOT NULL AND titre_affiche != \'\'');
  console.log(`\n✅ Total avec titre_affiche: ${result.rows[0].total}/46`);
  
  await c.end();
}

fillTitreAffiche().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
