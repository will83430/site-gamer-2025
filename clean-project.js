const fs = require('fs');
const path = require('path');

// Liste des fichiers à supprimer à la racine
const filesToDelete = [
  'clean-all-fiches.js',
  'clean-all-fiches.js.backup',
  'clean-image-data.js',
  'fix-display-names.js',
  'fix-html-content.js',
  'fix-js-references.js',
  'fix-js-search-ids.js',
  'fix-naming.js',
  'list-arbo.js',
  'list-images.js',
  'populate_image_data.js',
  'populate-image-column.js',
  'populate_titre_affiche_backup.js',
  'remove_console_log.js',
  'rename-images.js'
];

// Fonction pour supprimer tous les fichiers .backup dans un dossier (récursif)
function deleteBackupFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      deleteBackupFiles(fullPath);
    } else if (file.endsWith('.backup')) {
      console.log('Suppression :', fullPath);
      fs.unlinkSync(fullPath);
    }
  });
}

// Suppression des fichiers listés à la racine
filesToDelete.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log('Suppression :', fullPath);
    fs.unlinkSync(fullPath);
  }
});

// Suppression des .backup dans fiches/
const fichesDir = path.join(__dirname, 'fiches');
if (fs.existsSync(fichesDir)) {
  deleteBackupFiles(fichesDir);
}

// (Optionnel) Ajoute ici d'autres dossiers à nettoyer si besoin

console.log('\nNettoyage terminé !');