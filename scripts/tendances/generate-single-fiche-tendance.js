/**
 * Script de génération d'une fiche tendance spécifique
 * Usage: node generate-single-fiche-tendance.js <id>
 */

require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:3000';

async function generateSingleFicheTendance(tendanceId) {
  try {
    if (!tendanceId) {
      console.error('❌ Veuillez spécifier un ID de tendance');
      console.log('Usage: node generate-single-fiche-tendance.js <id>');
      process.exit(1);
    }

    console.log(`🚀 Génération de la fiche pour la tendance ID: ${tendanceId}...\n`);

    const response = await fetch(`${API_URL}/api/fiche-tendance/generate-fiche-tendance/${tendanceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Fiche générée avec succès!');
      console.log(`📁 Chemin: ${result.path}`);
    } else {
      console.error('❌ Erreur:', result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la génération:', error.message);
    process.exit(1);
  }
}

// Récupérer l'ID depuis les arguments
const tendanceId = process.argv[2];

// Exécution
if (require.main === module) {
  generateSingleFicheTendance(tendanceId);
}

module.exports = { generateSingleFicheTendance };
