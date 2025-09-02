// update-links.js
const fs = require('fs');
const path = require('path');

const replacements = [
  {
    from: 'assets/css/styles.css',
    to: 'assets/css/styles.min.css'
  },
  {
    from: '../assets/css/styles.css', 
    to: '../assets/css/styles.min.css'
  },
  {
    from: '../../assets/css/styles.css',
    to: '../../assets/css/styles.min.css'
  },
  {
    from: 'assets/js/fiches.js',
    to: 'assets/js/fiches.min.js'
  },
  {
    from: '../assets/js/fiches.js',
    to: '../assets/js/fiches.min.js'
  },
  {
    from: 'assets/js/admin-functions.js',
    to: 'assets/js/admin-functions.min.js'
  },
  {
    from: '../../assets/js/fiche-produit.js',
    to: '../../assets/js/fiche-produit.min.js'
  }
];

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  replacements.forEach(replacement => {
    if (content.includes(replacement.from)) {
      content = content.replace(new RegExp(replacement.from, 'g'), replacement.to);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Mis à jour: ${filePath}`);
  }
}

// Fichiers à mettre à jour
const filesToUpdate = [
  'frontend/public/index.html',
  'frontend/public/pages/fiches.html', 
  'frontend/public/admin.html',
  'frontend/public/top-du-mois.html'
];

console.log('🔄 Mise à jour des liens vers les fichiers minifiés...');

filesToUpdate.forEach(updateFile);

// Mettre à jour aussi les fiches dans /fiches/ si elles existent
const fichesDir = 'fiches';
if (fs.existsSync(fichesDir)) {
  const categories = fs.readdirSync(fichesDir);
  categories.forEach(category => {
    const categoryPath = path.join(fichesDir, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const htmlFiles = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.html'));
      htmlFiles.forEach(file => {
        updateFile(path.join(categoryPath, file));
      });
    }
  });
}

console.log('✅ Terminé !');