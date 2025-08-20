// test-image.js - Lance ce script pour vérifier tes images
const fs = require('fs');
const path = require('path');

console.log('🔍 Test des images\n');

// Chemin vers le dossier des images
const imagesDir = 'C:\\Users\\Utilisateur\\.vscode\\site-gamer-2025\\frontend\\public\\assets\\images';

console.log('📁 Dossier des images:', imagesDir);
console.log('');

// Vérifier si le dossier existe
if (!fs.existsSync(imagesDir)) {
    console.error('❌ Le dossier n\'existe pas !');
    process.exit(1);
}

// Lister toutes les images
const files = fs.readdirSync(imagesDir);
const imageFiles = files.filter(f => 
    f.endsWith('.png') || 
    f.endsWith('.jpg') || 
    f.endsWith('.jpeg') || 
    f.endsWith('.gif')
);

console.log(`✅ ${imageFiles.length} images trouvées:\n`);

// Afficher les images et vérifier PlayStation 5
let ps5Found = false;
imageFiles.forEach(file => {
    const size = fs.statSync(path.join(imagesDir, file)).size;
    console.log(`  📷 ${file} (${Math.round(size/1024)} KB)`);
    
    if (file.toLowerCase().includes('playstation')) {
        ps5Found = true;
        console.log(`     ⭐ Image PlayStation trouvée !`);
    }
});

console.log('\n' + '='.repeat(50));

// Recherche spécifique pour PlayStation 5 Slim
const targetFile = 'PlayStation 5 Slim.png';
const targetPath = path.join(imagesDir, targetFile);

console.log(`\n🎮 Recherche de "${targetFile}":`);
if (fs.existsSync(targetPath)) {
    const stats = fs.statSync(targetPath);
    console.log(`✅ TROUVÉE !`);
    console.log(`   Chemin: ${targetPath}`);
    console.log(`   Taille: ${Math.round(stats.size/1024)} KB`);
    console.log(`   Modifiée: ${stats.mtime}`);
} else {
    console.log(`❌ NON TROUVÉE`);
    console.log(`\n💡 Suggestions:`);
    
    // Chercher des noms similaires
    const similar = imageFiles.filter(f => 
        f.toLowerCase().includes('playstation') || 
        f.toLowerCase().includes('ps5') ||
        f.toLowerCase().includes('ps 5')
    );
    
    if (similar.length > 0) {
        console.log('   Images similaires trouvées:');
        similar.forEach(s => console.log(`     - ${s}`));
        console.log(`\n   Renommez une de ces images en "${targetFile}"`);
    } else {
        console.log('   Aucune image PlayStation trouvée');
        console.log('   Ajoutez l\'image dans le dossier avec le nom exact: "PlayStation 5 Slim.png"');
    }
}

console.log('\n' + '='.repeat(50));
console.log('\n📌 Pour corriger:');
console.log('1. Assurez-vous que l\'image existe avec le nom EXACT: "PlayStation 5 Slim.png"');
console.log('2. Ou renommez l\'image existante');
console.log('3. Ou mettez à jour le nom dans PostgreSQL pour correspondre au fichier');