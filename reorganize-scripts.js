// Script pour réorganiser les fichiers scripts/ en sous-dossiers
const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');

// Catégorisation des scripts
const categories = {
  setup: [
    'reinit-db.js',
    'restore-backup-novembre.js',
    'restore-db.js',
    'restore-donnees.js',
    'setup-manifest.js'
  ],
  products: [
    'add-missing-products.js',
    'add-new-products.js',
    'complete-product-data.js',
    'enrich-from-seed.js',
    'match-product-images.js',
    'populate-from-fiches.js',
    'update-top-decembre.js',
    'set-top-decembre.js',
    'set-top-novembre.js',
    'fill-titre-affiche.js',
    'fix-razer-name.js'
  ],
  fiches: [
    'generate-all-new-fiches.js',
    'generate-new-products.js',
    'regenerate-all-fiches-direct.js',
    'regenerate-all-fiches.js',
    'regenerate-fiches-top.js',
    'regenerate-normalized-fiches.js'
  ],
  maintenance: [
    'check-donnees-structure.js',
    'check-duplicate-description.js',
    'check-prod1.js',
    'check-prod50.js',
    'check-schemas.js',
    'clean-donnees-fiche.js',
    'clean-donnees-prices.js',
    'clean-prices.js',
    'complete-all-donnees-fiche-backup.js',
    'complete-all-donnees-fiche.js',
    'download-camera-images.js',
    'find-donnees-prices.js',
    'find-price-marker.js',
    'fix-descriptions-and-specs.js',
    'fix-donnees-fiche.js',
    'fix-format-prices.js',
    'fix-generic-descriptions.js',
    'fix-prices-back.js',
    'inspect-backup.js',
    'inspect-category.js',
    'list-prices-to-clean.js',
    'normalize-camera.js',
    'normalize-casque-vr.js',
    'normalize-drone.js',
    'normalize-ecran-tv.js',
    'normalize-montre-connectee.js',
    'normalize-remaining-categories.js',
    'normalize-smartphone.js',
    'normalize-tablette.js',
    'normalize-video-projecteur.js',
    'quick-check-db.js',
    'reformat-donnees-prices.js',
    'tmp-list-incomplete.js',
    'verify-database-state.js',
    'verify-donnees-prices.js'
  ]
};

let moved = 0;
let errors = 0;

Object.entries(categories).forEach(([category, files]) => {
  const targetDir = path.join(scriptsDir, category);
  
  files.forEach(file => {
    const sourcePath = path.join(scriptsDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.existsSync(sourcePath)) {
      try {
        fs.renameSync(sourcePath, targetPath);
        console.log(`✅ ${file.padEnd(45)} → ${category}/`);
        moved++;
      } catch (err) {
        console.error(`❌ Erreur pour ${file}:`, err.message);
        errors++;
      }
    } else {
      console.log(`⚠️  ${file} - Introuvable`);
    }
  });
});

// Créer des fichiers README dans chaque dossier
const readmes = {
  setup: '# Scripts de configuration\n\nScripts pour initialiser ou restaurer la base de données.',
  products: '# Scripts produits\n\nScripts pour ajouter, modifier ou enrichir les produits.',
  fiches: '# Scripts de génération de fiches\n\nScripts pour générer les fiches HTML statiques.',
  maintenance: '# Scripts de maintenance\n\nScripts pour vérifier, nettoyer et normaliser les données.'
};

Object.entries(readmes).forEach(([category, content]) => {
  const readmePath = path.join(scriptsDir, category, 'README.md');
  fs.writeFileSync(readmePath, content, 'utf8');
  console.log(`📝 README créé dans ${category}/`);
});

console.log(`\n📊 Résultat:`);
console.log(`   ✅ Fichiers déplacés: ${moved}`);
if (errors > 0) console.log(`   ❌ Erreurs: ${errors}`);
