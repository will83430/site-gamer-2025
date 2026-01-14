/**
 * Script de génération des fiches tendances HOT uniquement
 * Utile pour regénérer rapidement les tendances populaires
 */

require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function generateHotFichesTendances() {
  try {
    console.log('🔥 Démarrage de la génération des fiches tendances HOT...\n');

    // Appeler l'endpoint de régénération HOT
    const response = await fetch(`${API_URL}/api/regenerate-hot-tendances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Génération HOT terminée!\n');
      console.log(`📊 Statistiques:`);
      console.log(`   • Total HOT: ${result.total} tendances`);
      console.log(`   • Succès: ${result.successCount}`);
      console.log(`   • Erreurs: ${result.errorCount}\n`);

      if (result.errorCount > 0) {
        console.log('❌ Tendances en erreur:');
        result.results
          .filter(r => !r.success)
          .forEach(r => {
            console.log(`   • ${r.titre} (ID: ${r.id}): ${r.error}`);
          });
      }

      console.log('\n🔥 Toutes les fiches HOT ont été générées!');
    } else {
      console.error('❌ Erreur:', result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    process.exit(1);
  }
}

// Exécution
if (require.main === module) {
  generateHotFichesTendances();
}

module.exports = { generateHotFichesTendances };
