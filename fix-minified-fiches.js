// fix-minified-fiches.js
// Script pour corriger le lazy loading dans fiches.min.js

const fs = require('fs');

const minFilePath = 'frontend/public/assets/js/fiches.min.js';

try {
    console.log('🔧 Correction du lazy loading dans fiches.min.js...\n');
    
    if (!fs.existsSync(minFilePath)) {
        console.log('❌ Fichier fiches.min.js non trouvé !');
        process.exit(1);
    }
    
    let content = fs.readFileSync(minFilePath, 'utf8');
    
    // Sauvegarder l'original
    fs.writeFileSync(minFilePath + '.backup', content);
    console.log('💾 Sauvegarde créée: fiches.min.js.backup');
    
    // Pattern 1: Corriger src="/assets/images/ vers data-src="/assets/images/
    const pattern1 = /src=(["'])\/assets\/images\//g;
    let corrections = 0;
    
    if (pattern1.test(content)) {
        content = content.replace(/src=(["'])\/assets\/images\//g, 'data-src=$1/assets/images/');
        corrections++;
        console.log('✅ Pattern src="/assets/images/ corrigé');
    }
    
    // Pattern 2: Ajouter src="" après data-src
    const pattern2 = /data-src=(["'][^"']*["'])\s+alt/g;
    if (pattern2.test(content)) {
        content = content.replace(/data-src=(["'][^"']*["'])\s+alt/g, 'data-src=$1 src="" alt');
        corrections++;
        console.log('✅ Attribut src="" ajouté');
    }
    
    // Pattern 3: Ajouter class="lazy"
    const pattern3 = /data-src=(["'][^"']*["'])\s+src=(["']["'])\s+alt/g;
    if (pattern3.test(content)) {
        content = content.replace(/data-src=(["'][^"']*["'])\s+src=(["']["'])\s+alt/g, 'data-src=$1 src=$2 class="lazy" alt');
        corrections++;
        console.log('✅ Classe "lazy" ajoutée');
    }
    
    // Pattern 4: Corriger les autres occurrences de src avec template literals
    const pattern4 = /src=(["'])\/assets\/images\/\$\{[^}]+\}/g;
    if (pattern4.test(content)) {
        content = content.replace(/src=(["'])\/assets\/images\/\$\{([^}]+)\}/g, 'data-src=$1/assets/images/${$2}');
        corrections++;
        console.log('✅ Template literals avec src corrigés');
    }
    
    console.log(`\n📊 ${corrections} correction(s) appliquée(s)`);
    
    if (corrections > 0) {
        fs.writeFileSync(minFilePath, content);
        console.log('✅ Fichier fiches.min.js corrigé');
        
        console.log('\n🎯 Test:');
        console.log('1. Rafraîchir la page avec Ctrl+F5');
        console.log('2. Vérifier que l\'erreur 404 a disparu');
        console.log('3. Observer le lazy loading des images au scroll');
    } else {
        console.log('⚪ Aucune correction nécessaire');
    }
    
} catch (error) {
    console.error('❌ Erreur:', error.message);
}