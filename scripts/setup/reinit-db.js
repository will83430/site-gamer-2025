const fs = require('fs');

async function main() {
  const pool = require('../backend/config/database');

  // Lis le seed SQL et extrait le JSON
  const seedContent = fs.readFileSync('./backend/gestion_produits.sql', 'utf-8');
  
  // Cherche le JSON entre $$ et $$
  const jsonMatch = seedContent.match(/\$\$([\s\S]*?)\$\$/);
  if (!jsonMatch) {
    console.error('❌ Impossible de trouver le JSON dans le seed');
    await pool.end();
    return;
  }

  const jsonStr = jsonMatch[1];
  
  // Parse le JSON (le JSON dans le seed n'est pas valide car il a des virgules finales)
  const fixedJson = '[' + jsonStr.trim() + ']';
  let products;
  
  try {
    products = JSON.parse(fixedJson);
  } catch (err) {
    console.error('❌ Erreur lors du parsing JSON:', err.message);
    await pool.end();
    return;
  }

  console.log(`✅ ${products.length} produits trouvés\n`);

  let count = 0;
  for (const product of products) {
    // Transforme donnees_fiche[1] au format "💰 Prix\n[valeur]"
    if (product.donnees_fiche && product.donnees_fiche.length > 1) {
      const ligne2 = product.donnees_fiche[1];
      // Format: "💰 À partir de 3 499 € – ..." → "💰 Prix\nÀ partir de 3 499 €"
      const prixMatch = ligne2.match(/💰\s+(.+?)(?:\s*–|$)/);
      const prixValue = prixMatch ? prixMatch[1].trim() : ligne2;
      product.donnees_fiche[1] = `💰 Prix\n${prixValue}`;
    }

    // Insère dans la DB
    const query = `
      INSERT INTO produits (id, nom, categorie, description, prix, image, lien, top_du_mois, titre_affiche, fonctionnalites_avancees, donnees_fiche)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        nom = EXCLUDED.nom,
        categorie = EXCLUDED.categorie,
        description = EXCLUDED.description,
        prix = EXCLUDED.prix,
        image = EXCLUDED.image,
        lien = EXCLUDED.lien,
        top_du_mois = EXCLUDED.top_du_mois,
        titre_affiche = EXCLUDED.titre_affiche,
        fonctionnalites_avancees = EXCLUDED.fonctionnalites_avancees,
        donnees_fiche = EXCLUDED.donnees_fiche
    `;

    await pool.query(query, [
      product.id,
      product.nom,
      product.categorie,
      product.description,
      product.prix,
      product.image,
      product.lien,
      product.top_du_mois,
      product.titre_affiche,
      product.fonctionnalites_avancees,
      product.donnees_fiche
    ]);

    count++;
    if (count % 10 === 0) {
      console.log(`✅ ${count} produits insérés...`);
    }
  }

  console.log(`\n✅ Total: ${count} produits insérés avec format B (💰 Prix\\nValeur)`);
  await pool.end();
}

main().catch((err) => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});
