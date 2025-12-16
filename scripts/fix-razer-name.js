// Correction du nom Razer BlackWidow V4 Pro
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gamer_2025',
  password: 'Wilfried!1985',
  port: 5432,
});

async function fixRazerName() {
  try {
    await client.connect();
    
    // Trouver le produit
    const find = await client.query(
      "SELECT id, nom, titre_affiche FROM produits WHERE nom LIKE '%blackwidow%' OR titre_affiche LIKE '%BlackWidow%'"
    );
    
    console.log('Produit trouvé:');
    find.rows.forEach(p => {
      console.log(`  ID: ${p.id}`);
      console.log(`  nom: ${p.nom}`);
      console.log(`  titre_affiche: ${p.titre_affiche}\n`);
    });
    
    if (find.rows.length > 0) {
      // Corriger le titre_affiche
      await client.query(
        "UPDATE produits SET titre_affiche = 'Razer BlackWidow V4 Pro' WHERE nom LIKE '%blackwidow%' OR titre_affiche LIKE '%BlackWidow%'"
      );
      
      console.log('✅ Titre corrigé en: Razer BlackWidow V4 Pro');
      
      // Vérifier
      const check = await client.query(
        "SELECT id, nom, titre_affiche FROM produits WHERE nom LIKE '%blackwidow%'"
      );
      console.log('\nAprès correction:');
      check.rows.forEach(p => {
        console.log(`  ${p.id} - ${p.titre_affiche}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

fixRazerName();
