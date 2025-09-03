// test-json.js - Teste la validité du fichier JSON
const fs = require('fs');

try {
    console.log('🔍 Test du fichier produits_propres.json...\n');
    
    // Vérifier si le fichier existe
    if (!fs.existsSync('produits_propres.json')) {
        console.log('❌ Le fichier produits_propres.json n\'existe pas !');
        console.log('💡 Crée-le et colle ton JSON dedans');
        return;
    }
    
    // Lire le contenu
    const content = fs.readFileSync('produits_propres.json', 'utf8');
    console.log(`📄 Taille du fichier: ${content.length} caractères`);
    
    if (content.trim().length === 0) {
        console.log('❌ Le fichier est vide !');
        return;
    }
    
    console.log(`📝 Premiers caractères: "${content.substring(0, 50)}..."`);
    console.log(`📝 Derniers caractères: "...${content.slice(-50)}"`);
    
    // Tenter de parser le JSON
    const data = JSON.parse(content);
    
    console.log(`✅ JSON valide !`);
    console.log(`📊 ${data.length} produits trouvés`);
    
    // Afficher quelques noms de produits
    console.log('\n🔍 Premiers produits:');
    data.slice(0, 3).forEach((prod, i) => {
        console.log(`   ${i+1}. ${prod.nom} (${prod.categorie})`);
    });
    
} catch (error) {
    console.log('❌ Erreur JSON:', error.message);
    console.log('\n💡 Solutions:');
    console.log('   1. Vérifier que le JSON commence par [ et finit par ]');
    console.log('   2. Vérifier qu\'il n\'y a pas de virgule en trop');
    console.log('   3. Vérifier que toutes les guillemets sont bien fermées');
}