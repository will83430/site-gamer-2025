// fix-min-links.js - Corrige automatiquement tous les liens vers les fichiers .min
const fs = require('fs');
const path = require('path');

const replacements = [
    // CSS
    { from: 'assets/css/styles.css', to: 'assets/css/styles.min.css' },
    { from: '../assets/css/styles.css', to: '../assets/css/styles.min.css' },
    { from: '../../assets/css/styles.css', to: '../../assets/css/styles.min.css' },
    
    // JS
    { from: 'assets/js/fiches.js', to: 'assets/js/fiches.min.js' },
    { from: 'assets/js/admin-functions.js', to: 'assets/js/admin-functions.min.js' },
    { from: 'assets/js/fiche-produit.js', to: 'assets/js/fiche-produit.min.js' },
    { from: '../assets/js/fiches.js', to: '../assets/js/fiches.min.js' },
    { from: '../assets/js/fiche-produit.js', to: '../assets/js/fiche-produit.min.js' },
    { from: '../../assets/js/fiches.js', to: '../../assets/js/fiches.min.js' },
    { from: '../../assets/js/fiche-produit.js', to: '../../assets/js/fiche-produit.min.js' },
];

function fixHtmlFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    replacements.forEach(replacement => {
        if (content.includes(replacement.from)) {
            content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
            modified = true;
        }
    });
    
    if (modified) {
        // Créer une sauvegarde
        fs.writeFileSync(filePath + '.backup', fs.readFileSync(filePath));
        // Écrire le fichier corrigé
        fs.writeFileSync(filePath, content);
        console.log(`✅ Corrigé: ${filePath}`);
        return true;
    }
    
    return false;
}

console.log('🔧 Correction automatique des liens vers les fichiers .min...\n');

// Fichiers principaux
const mainFiles = [
    'frontend/public/index.html',
    'frontend/public/pages/fiches.html',
    'frontend/public/admin.html',
    'frontend/public/top-du-mois.html'
];

let totalFixed = 0;

mainFiles.forEach(file => {
    if (fixHtmlFile(file)) {
        totalFixed++;
    } else {
        console.log(`⚪ Aucune correction nécessaire: ${file}`);
    }
});

// Fiches dans /fiches/
const fichesDir = 'fiches';
if (fs.existsSync(fichesDir)) {
    console.log('\n🔧 Correction des fiches dans /fiches/...\n');
    
    const categories = fs.readdirSync(fichesDir);
    categories.forEach(category => {
        const categoryPath = path.join(fichesDir, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const htmlFiles = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.html'));
            
            htmlFiles.forEach(file => {
                const filePath = path.join(categoryPath, file);
                if (fixHtmlFile(filePath)) {
                    totalFixed++;
                }
            });
        }
    });
}

console.log(`\n✅ Terminé ! ${totalFixed} fichier(s) corrigé(s)`);

if (totalFixed > 0) {
    console.log('\n💡 Des sauvegardes (.backup) ont été créées');
    console.log('Pour les supprimer: node clean-backups.js');
}