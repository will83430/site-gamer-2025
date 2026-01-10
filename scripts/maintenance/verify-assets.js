/**
 * Script de vérification des assets (images) pour tous les produits
 * Vérifie que chaque image référencée dans la base de données existe physiquement
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gamer_2025',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const imagesDir = path.join(__dirname, '../../frontend/public/assets/images');

async function verifyAssets() {
  console.log('🔍 Vérification des assets...\n');

  try {
    // Récupérer tous les produits
    const result = await pool.query(
      'SELECT id, nom, image, categorie FROM produits ORDER BY id'
    );

    const errors = [];
    const warnings = [];
    let successCount = 0;

    for (const product of result.rows) {
      const expectedImageName = `${product.nom}.png`;
      const actualImageName = product.image;

      // Vérification 1: Le nom de l'image correspond au nom du produit
      if (actualImageName !== expectedImageName && actualImageName !== `${product.nom}.jpg` && actualImageName !== `${product.nom}.webp`) {
        warnings.push({
          id: product.id,
          nom: product.nom,
          issue: `⚠️  Incohérence de nom : DB="${actualImageName}" attendu="${expectedImageName}"`,
        });
      }

      // Vérification 2: Le fichier existe physiquement
      const imagePath = path.join(imagesDir, actualImageName);
      if (!fs.existsSync(imagePath)) {
        errors.push({
          id: product.id,
          nom: product.nom,
          categorie: product.categorie,
          issue: `❌ Fichier manquant : ${actualImageName}`,
          path: imagePath,
        });
      } else {
        successCount++;
      }

      // Vérification 3: Nom de fichier avec "apple-" mais nom de produit sans
      if (actualImageName.includes('apple-') && !product.nom.includes('apple-')) {
        warnings.push({
          id: product.id,
          nom: product.nom,
          issue: `⚠️  Image contient "apple-" mais pas le nom du produit`,
        });
      }
    }

    // Afficher les résultats
    console.log(`✅ Images valides : ${successCount}/${result.rows.length}\n`);

    if (errors.length > 0) {
      console.log(`\n❌ ERREURS (${errors.length}) - Images manquantes :\n`);
      errors.forEach((err) => {
        console.log(`   ${err.id} | ${err.nom}`);
        console.log(`   Catégorie: ${err.categorie}`);
        console.log(`   ${err.issue}`);
        console.log(`   Chemin: ${err.path}\n`);
      });
    }

    if (warnings.length > 0) {
      console.log(`\n⚠️  AVERTISSEMENTS (${warnings.length}) - Incohérences :\n`);
      warnings.forEach((warn) => {
        console.log(`   ${warn.id} | ${warn.nom}`);
        console.log(`   ${warn.issue}\n`);
      });
    }

    if (errors.length === 0 && warnings.length === 0) {
      console.log('✨ Aucun problème détecté ! Tous les assets sont corrects.\n');
    }

    // Vérification bonus: Images orphelines (dans le dossier mais pas en DB)
    console.log('\n🔍 Recherche d\'images orphelines...\n');
    const dbImages = result.rows.map((p) => p.image);
    const filesInDir = fs.readdirSync(imagesDir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
    
    const orphans = filesInDir.filter((file) => {
      // Ignorer les images système (logo, bannières, catégories, etc.)
      const systemImages = ['placeholder.png', 'logo-blanc.png', 'logo-dokk-blanc.png', 'banniere-pied.png'];
      if (systemImages.includes(file)) return false;
      
      // Ignorer les images de catégories
      if (file.match(/(drone|console|tablette|smartphone|pc-gaming|serveur|casque|montre|camera|peripheriques|ecran|video-projecteur|box-internet|tableau-interactif|imprimante)\.png$/i)) {
        return false;
      }
      
      return !dbImages.includes(file);
    });

    if (orphans.length > 0) {
      console.log(`⚠️  ${orphans.length} images orphelines trouvées :\n`);
      orphans.forEach((img) => console.log(`   - ${img}`));
      console.log('\n   💡 Ces images ne sont référencées par aucun produit.\n');
    } else {
      console.log('✅ Aucune image orpheline.\n');
    }

  } catch (err) {
    console.error('❌ Erreur lors de la vérification :', err);
  } finally {
    await pool.end();
  }
}

// Exécution
verifyAssets();
