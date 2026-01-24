/**
 * Script de génération de toutes les fiches tendances
 * Appelle l'API pour chaque tendance de la base
 */

require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function generateAllFichesTendances() {
  try {
    console.log('🚀 Démarrage de la génération de toutes les fiches tendances...\n');

    // Appeler l'endpoint de régénération globale
    const response = await fetch(`${API_URL}/api/regenerate-all-tendances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Génération terminée!\n');
      console.log(`📊 Statistiques:`);
      console.log(`   • Total: ${result.total} tendances`);
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

      console.log('\n✅ Toutes les fiches ont été générées dans fiches/tendances/');
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
  generateAllFichesTendances();
}

module.exports = { generateAllFichesTendances };
