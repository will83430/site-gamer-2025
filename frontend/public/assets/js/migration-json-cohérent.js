// ====================================
// SCRIPT DE MIGRATION DU JSON
// À exécuter dans la console pour migrer votre ancien JSON
// ====================================

async function migrateJsonFile() {
    try {
        console.log('🔄 Migration du fichier JSON...');
        
        // 1. Charger l'ancien JSON (adaptez le chemin si nécessaire)
        const response = await fetch('data/equipements.json');
        const oldData = await response.json();
        
        console.log(`📊 ${oldData.length} produits trouvés`);
        
        // 2. Migrer chaque produit
        const newData = oldData.map((product, index) => {
            console.log(`🔄 Migration produit ${index + 1}: ${product.nom}`);
            
            return {
                // Propriétés essentielles
                nom: product.nom || `Produit ${index + 1}`,
                categorie: product.categorie ? product.categorie.toUpperCase() : 'DIVERS',
                prix: product.prix || 'Prix non renseigné',
                description: product.description || 'Description non disponible',
                
                // Nouveaux chemins optimisés
                image: migrateImagePath(product.image, product.categorie),
                lien: generateProductLink(product),
                
                // Propriété vedette (à adapter selon votre ancien format)
                top_du_mois: product.top_du_mois || 
                           product.vedette || 
                           product.featured || 
                           false,
                
                // Fonctionnalités avancées (adapter le format si nécessaire)
                fonctionnalites_avancees: migrateFonctionnalites(product)
            };
        });
        
        // 3. Télécharger le nouveau fichier
        downloadJson(newData, 'equipements-migrated.json');
        
        console.log('✅ Migration terminée!');
        console.log(`📁 Fichier téléchargé: equipements-migrated.json`);
        
        return newData;
        
    } catch (error) {
        console.error('❌ Erreur lors de la migration:', error);
    }
}

// Migration du chemin d'image
function migrateImagePath(oldPath, category) {
    if (!oldPath) return '';
    
    // Si c'est déjà le nouveau format, garder tel quel
    if (oldPath.startsWith('assets/images/')) {
        return oldPath;
    }
    
    // Mapper la catégorie vers le dossier
    const categoryFolders = {
        'PC GAMING': 'pc-gaming',
        'SERVEUR': 'serveurs', 
        'PERIPHERIQUES': 'peripheriques',
        'TABLETTE': 'tablettes',
        'SMARTPHONE': 'smartphones',
        'MONTRE CONNECTE': 'montres',
        'ECRAN TV': 'ecrans',
        'CAMERA': 'cameras',
        'VIDEO PROJECTEUR': 'projecteurs',
        'BOX INTERNET': 'box-internet',
        'CASQUE AUDIO': 'casque-audio',
        'TABLEAU INTERACTIF': 'tableaux',
        'CONSOLE': 'consoles',
        'CASQUE VR': 'casque-vr',
        'IMPRIMANTE 3D': 'imprimantes-3d',
        'DRONE': 'drones'
    };
    
    const folder = categoryFolders[category] || 'divers';
    const filename = oldPath.split('/').pop() || 'image.jpg';
    
    return `assets/images/${folder}/${filename}`;
}

// Génération du lien de produit
function generateProductLink(product) {
    if (!product.nom || !product.categorie) return '#';
    
    const categorySlug = product.categorie.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    
    const productSlug = product.nom.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    
    return `fiches-produits/${categorySlug}/${productSlug}.html`;
}

// Migration des fonctionnalités avancées
function migrateFonctionnalites(product) {
    // Si déjà au bon format
    if (Array.isArray(product.fonctionnalites_avancees)) {
        return product.fonctionnalites_avancees;
    }
    
    // Si c'est une chaîne avec du HTML
    if (typeof product.fonctionnalites_avancees === 'string') {
        return [product.fonctionnalites_avancees];
    }
    
    // Si c'est dans une autre propriété
    if (product.specifications || product.features || product.caracteristiques) {
        const features = product.specifications || product.features || product.caracteristiques;
        
        if (Array.isArray(features)) {
            const html = '<ul>' + features.map(f => `<li>${f}</li>`).join('') + '</ul>';
            return [html];
        }
        
        if (typeof features === 'string') {
            return [features];
        }
    }
    
    // Valeur par défaut
    return [];
}

// Téléchargement du JSON
function downloadJson(data, filename) {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
}

// ====================================
// FONCTIONS UTILITAIRES
// ====================================

// Analyser la structure de l'ancien JSON
async function analyzeOldJson() {
    try {
        const response = await fetch('data/equipements.json');
        const data = await response.json();
        
        console.log('📊 ANALYSE DE L\'ANCIEN JSON:');
        console.log('=====================================');
        console.log(`Total produits: ${data.length}`);
        
        // Analyser les propriétés
        const allProps = new Set();
        data.forEach(item => {
            Object.keys(item).forEach(key => allProps.add(key));
        });
        
        console.log('🔑 Propriétés trouvées:', Array.from(allProps));
        
        // Analyser les catégories
        const categories = [...new Set(data.map(item => item.categorie))];
        console.log('📁 Catégories:', categories);
        
        // Analyser les produits vedettes
        const vedettes = data.filter(item => 
            item.top_du_mois || 
            item.vedette || 
            item.featured
        );
        console.log(`⭐ Produits vedettes: ${vedettes.length}`);
        
        return { data, allProps: Array.from(allProps), categories, vedettes };
        
    } catch (error) {
        console.error('❌ Erreur analyse:', error);
    }
}

// ====================================
// INSTRUCTIONS D'UTILISATION
// ====================================

console.log('📋 MIGRATION JSON - INSTRUCTIONS:');
console.log('=====================================');
console.log('1. analyzeOldJson() - Analyser votre JSON actuel');
console.log('2. migrateJsonFile() - Migrer vers le nouveau format');
console.log('');
console.log('🚀 Commencez par: analyzeOldJson()');

// Export des fonctions
window.jsonMigration = {
    migrateJsonFile,
    analyzeOldJson,
    migrateImagePath,
    generateProductLink,
    migrateFonctionnalites,
    downloadJson
};