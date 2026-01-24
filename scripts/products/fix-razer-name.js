// Correction du nom Razer BlackWidow V4 Pro
const pool = require('../backend/config/database');

async function fixRazerName() {
  try {
    // Trouver le produit
    const find = await pool.query(
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
      await pool.query(
        "UPDATE produits SET titre_affiche = 'Razer BlackWidow V4 Pro' WHERE nom LIKE '%blackwidow%' OR titre_affiche LIKE '%BlackWidow%'"
      );
      
      console.log('✅ Titre corrigé en: Razer BlackWidow V4 Pro');
      
      // Vérifier
      const check = await pool.query(
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
    await pool.end();
  }
}

fixRazerName();
