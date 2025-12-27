// Mise à jour des produits TOP DU MOIS pour Décembre 2025
const pool = require('../backend/config/database');

// Nouveaux top du mois - produits récents de qualité
const topProducts = [
  'prod_50', // Xiaomi 15 Ultra (smartphone)
  'prod_51', // Lenovo Legion Go S (console)
  'prod_54', // Sony A7 Mark V (caméra)
  'prod_57'  // Meta Quest 4 (casque VR)
];

async function updateTopDuMois() {
  try {
    console.log('🔄 Mise à jour des TOP DU MOIS pour Décembre 2025...\n');

    // 1. Réinitialiser tous les produits
    await pool.query('UPDATE produits SET top_du_mois = false');
    console.log('✓ Anciens top du mois réinitialisés');

    // 2. Définir les nouveaux top du mois
    const placeholders = topProducts.map((_, i) => `$${i + 1}`).join(',');
    await pool.query(
      `UPDATE produits SET top_du_mois = true WHERE id IN (${placeholders})`,
      topProducts
    );
    console.log('✓ Nouveaux top du mois définis\n');

    // 3. Afficher les nouveaux top du mois
    const result = await pool.query(
      'SELECT id, nom, categorie, prix FROM produits WHERE top_du_mois = true ORDER BY id'
    );

    console.log(`⭐ TOP DU MOIS DÉCEMBRE 2025 (${result.rows.length} produits):\n`);
    result.rows.forEach(p => {
      console.log(`  ${p.id} - ${p.nom}`);
      console.log(`    Catégorie: ${p.categorie}`);
      console.log(`    Prix: ${p.prix}\n`);
    });

    console.log('✅ Mise à jour terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

updateTopDuMois();
