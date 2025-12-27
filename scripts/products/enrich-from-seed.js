const fs = require('fs');

async function main() {
  const pool = require('../backend/config/database');

  // Lis le seed SQL et extrait le JSON
  const seedContent = fs.readFileSync('./backend/gestion_produits.sql', 'utf-8');
  const jsonMatch = seedContent.match(/\$\$([\s\S]*?)\$\$/);
  
  if (!jsonMatch) {
    console.error('❌ JSON non trouvé');
    await pool.end();
    return;
  }

  const fixedJson = '[' + jsonMatch[1].trim() + ']';
  let seedProducts;
  
  try {
    seedProducts = JSON.parse(fixedJson);
  } catch (err) {
    console.error('❌ Parse JSON échoué');
    await pool.end();
    return;
  }

  console.log(`📊 ${seedProducts.length} produits du seed\n`);

  let updated = 0;
  
  // Pour chaque produit du seed
  for (const seedProd of seedProducts) {
    // Cherche le produit correspondant dans la DB (par nom)
    const res = await pool.query(
      'SELECT id FROM produits WHERE LOWER(nom) = LOWER($1)',
      [seedProd.nom]
    );

    if (res.rows.length > 0) {
      const dbProd = res.rows[0];
      
      // Met à jour avec les données du seed
      await pool.query(
        `UPDATE produits 
         SET prix = $1, image = $2, lien = $3, top_du_mois = $4, 
             titre_affiche = $5, fonctionnalites_avancees = $6, donnees_fiche = $7
         WHERE id = $8`,
        [
          seedProd.prix,
          seedProd.image,
          seedProd.lien,
          seedProd.top_du_mois || false,
          seedProd.titre_affiche || null,
          seedProd.fonctionnalites_avancees || [],
          seedProd.donnees_fiche || [],
          dbProd.id
        ]
      );
      
      updated++;
      console.log(`✅ ${dbProd.id}: ${seedProd.nom} enrichi`);
    }
  }

  console.log(`\n✅ ${updated} produits enrichis du seed`);
  
  // Affiche le total
  const count = await pool.query('SELECT COUNT(*) as count FROM produits');
  console.log(`📊 Total: ${count.rows[0].count} produits`);

  await pool.end();
}

main().catch(console.error);
