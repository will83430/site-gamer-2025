// check-min-files.js - Vérifie quels fichiers HTML n'utilisent pas encore les .min
const fs = require('fs');
const path = require('path');

function checkHtmlFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Fichier introuvable: ${filePath}`);
        return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Vérifier CSS non minifié
    if (content.includes('assets/css/styles.css') && !content.includes('assets/css/styles.min.css')) {
        issues.push('CSS non minifié détecté');
    }
    if (content.includes('../assets/css/styles.css') && !content.includes('../assets/css/styles.min.css')) {
        issues.push('CSS non minifié détecté (../)');
    }
    if (content.includes('../../assets/css/styles.css') && !content.includes('../../assets/css/styles.min.css')) {
        issues.push('CSS non minifié détecté (../../)');
    }
    
    // Vérifier JS non minifié
    const jsPatterns = [
        'assets/js/fiches.js',
        'assets/js/admin-functions.js', 
        'assets/js/fiche-produit.js',
        '../assets/js/fiches.js',
        '../assets/js/fiche-produit.js',
        '../../assets/js/fiches.js',
        '../../assets/js/fiche-produit.js'
    ];
    
    jsPatterns.forEach(pattern => {
        if (content.includes(pattern) && !pattern.includes('.min.')) {
            issues.push(`JS non minifié: ${pattern}`);
        }
    });
    
    return issues;
}

console.log('🔍 Vérification des fichiers HTML...\n');

// Fichiers principaux à vérifier
const filesToCheck = [
    'frontend/public/index.html',
    'frontend/public/pages/fiches.html',
    'frontend/public/admin.html',
    'frontend/public/top-du-mois.html'
];

let totalIssues = 0;

filesToCheck.forEach(file => {
    const issues = checkHtmlFile(file);
    if (issues === null) return;
    
    if (issues.length > 0) {
        console.log(`❌ ${file}:`);
        issues.forEach(issue => console.log(`   → ${issue}`));
        totalIssues += issues.length;
    } else {
        console.log(`✅ ${file}: OK`);
    }
    console.log('');
});

// Vérifier aussi les fiches dans /fiches/
const fichesDir = 'fiches';
if (fs.existsSync(fichesDir)) {
    console.log('🔍 Vérification des fiches dans /fiches/...\n');
    
    const categories = fs.readdirSync(fichesDir);
    categories.forEach(category => {
        const categoryPath = path.join(fichesDir, category);
        if (fs.statSync(categoryPath).isDirectory()) {
            const htmlFiles = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.html'));
            
            htmlFiles.forEach(file => {
                const filePath = path.join(categoryPath, file);
                const issues = checkHtmlFile(filePath);
                if (issues && issues.length > 0) {
                    console.log(`❌ ${filePath}:`);
                    issues.forEach(issue => console.log(`   → ${issue}`));
                    totalIssues += issues.length;
                }
            });
        }
    });
}

console.log(`\n📊 Résumé: ${totalIssues} problème(s) trouvé(s)`);

if (totalIssues > 0) {
    console.log('\n🛠️  Correction automatique disponible avec:');
    console.log('node fix-min-links.js');
}