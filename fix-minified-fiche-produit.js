// fix-minified-fiche-produit.js
// Script pour corriger directement le fichier minifié fiche-produit.min.js

const fs = require('fs');

const minFilePath = 'frontend/public/assets/js/fiche-produit.min.js';

try {
    console.log('🔧 Correction du fichier fiche-produit.min.js...\n');
    
    if (!fs.existsSync(minFilePath)) {
        console.log('❌ Fichier fiche-produit.min.js non trouvé !');
        process.exit(1);
    }
    
    // Lire le fichier minifié
    let content = fs.readFileSync(minFilePath, 'utf8');
    
    // Sauvegarder l'original
    fs.writeFileSync(minFilePath + '.backup', content);
    console.log('💾 Sauvegarde créée: fiche-produit.min.js.backup');
    
    console.log(`📄 Taille du fichier: ${content.length} caractères`);
    
    // Rechercher et remplacer les patterns problématiques dans le code minifié
    // Pattern 1: titre="📝 Description"
    const pattern1 = /titre\s*=\s*["']📝 Description["']/g;
    if (pattern1.test(content)) {
        content = content.replace(pattern1, 'titre=""');
        console.log('✅ Pattern 1 corrigé: titre="📝 Description" → titre=""');
    }
    
    // Pattern 2: Rechercher la logique complète dans le minifié
    const pattern2 = /titre\s*=\s*["']📝 Description["']\s*[;,]\s*texte\s*=\s*contenu\.trim\(\)/g;
    if (pattern2.test(content)) {
        content = content.replace(pattern2, 'continue');
        console.log('✅ Pattern 2 corrigé: logique problématique supprimée');
    }
    
    // Pattern 3: Plus agressif - supprimer tout ce qui force "📝 Description"
    const pattern3 = /["']📝 Description["']/g;
    const matches = content.match(pattern3);
    if (matches) {
        console.log(`🔍 Trouvé ${matches.length} occurrences de "📝 Description"`);
        content = content.replace(pattern3, '""');
        console.log('✅ Pattern 3 corrigé: toutes les occurrences "📝 Description" supprimées');
    }
    
    // Pattern 4: Rechercher spécifiquement la condition else problématique
    // Dans le minifié, cela pourrait ressembler à }else{titre="📝 Description"
    const pattern4 = /\}else\{[^}]*titre\s*=\s*["']📝 Description["'][^}]*\}/g;
    if (pattern4.test(content)) {
        content = content.replace(pattern4, '}else{continue}');
        console.log('✅ Pattern 4 corrigé: bloc else problématique');
    }
    
    // Vérification finale
    const remainingIssues = (content.match(/📝 Description/g) || []).length;
    console.log(`🔍 Occurrences restantes de "📝 Description": ${remainingIssues}`);
    
    // Écrire le fichier corrigé
    fs.writeFileSync(minFilePath, content);
    console.log('✅ Fichier fiche-produit.min.js corrigé');
    
    console.log(`📄 Nouvelle taille: ${content.length} caractères`);
    
    console.log('\n🎯 Actions à faire:');
    console.log('1. Rafraîchir une fiche produit dans le navigateur (Ctrl+F5)');
    console.log('2. Vérifier que les "📝 Description" en double ont disparu');
    console.log('3. Si problème, restaurer avec:');
    console.log('   copy fiche-produit.min.js.backup fiche-produit.min.js');
    
    if (remainingIssues === 0) {
        console.log('\n🎉 Aucune occurrence de "📝 Description" détectée - correction réussie !');
    } else {
        console.log('\n⚠️ Quelques occurrences restent - teste dans le navigateur');
    }
    
} catch (error) {
    console.error('❌ Erreur:', error.message);
}