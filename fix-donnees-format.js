// fix-donnees-format.js
// Corrige le format des données dans PostgreSQL

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

function fixFormat(texte) {
    // Si le texte commence par un emoji suivi directement du texte
    const emojiRegex = /^([🔥💰🧩🌐🎮🖥️🕹️🎥📸🎧⌚📝🚁📱💻🖨️🎯⚡🔧🎨🏠🚗🎪📊]+)\s*(.+)/;
    const match = texte.match(emojiRegex);
    
    if (match) {
        const emoji = match[1];
        let contenu = match[2];
        
        // Détecter le titre et nettoyer le contenu
        let titre = '';
        if (contenu.includes('Prix')) {
            titre = 'Prix';
            contenu = contenu.replace(/^Prix\s*[::-]?\s*/, ''); // Enlever "Prix :" du début
        } else if (contenu.includes('Spécifications')) {
            titre = 'Spécifications';
            contenu = contenu.replace(/^Spécifications\s*[-:]?\s*/, ''); // Enlever "Spécifications-" du début
        } else if (contenu.includes('Fonctionnalités')) {
            titre = 'Fonctionnalités';
            contenu = contenu.replace(/^Fonctionnalités\s*[-:]?\s*/, '');
        } else if (contenu.includes('Usage')) {
            titre = 'Usage recommandé';
            contenu = contenu.replace(/^Usage recommandé\s*[-:]?\s*/, '');
        } else if (contenu.includes('Écran')) {
            titre = 'Écran et affichage';
            contenu = contenu.replace(/^Écran.*?[-:]?\s*/, '');
        } else if (contenu.includes('Connectivité')) {
            titre = 'Connectivité';
            contenu = contenu.replace(/^Connectivité\s*[-:]?\s*/, '');
        } else if (contenu.includes('gaming')) {
            titre = 'Fonctions gaming';
        } else if (contenu.includes('vidéo')) {
            titre = 'Fonctions vidéo';
        } else if (contenu.includes('audio')) {
            titre = 'Fonctions audio';
        } else if (contenu.includes('sport') || contenu.includes('santé')) {
            titre = 'Sport et santé';
        } else {
            titre = 'Description détaillée';
        }
        
        return `${emoji} ${titre}\n${contenu}`;
    }
    
    // Si pas d'emoji au début, ajouter Description
    if (texte.trim().length > 0 && !texte.match(/^[🔥💰🧩🌐🎮🖥️🕹️🎥📸🎧⌚📝🚁📱💻🖨️🎯⚡🔧🎨🏠🚗🎪📊]/)) {
        return `📝 Description détaillée\n${texte}`;
    }
    
    return texte;
}

async function fixAllProducts() {
    try {
        console.log('🔧 Correction du format des données...\n');
        
        // Récupérer tous les produits avec des donnees_fiche
        const result = await pool.query(`
            SELECT id, nom, donnees_fiche 
            FROM produits 
            WHERE donnees_fiche IS NOT NULL 
            AND array_length(donnees_fiche, 1) > 0
        `);
        
        console.log(`📊 ${result.rows.length} produits à traiter\n`);
        
        for (const produit of result.rows) {
            console.log(`🔧 Traitement: ${produit.nom}`);
            
            const nouvellesDonnees = produit.donnees_fiche
                .filter(d => d && d.trim().length > 0) // Enlever les entrées vides
                .map(donnee => fixFormat(donnee));
            
            // Mettre à jour en base
            await pool.query(
                'UPDATE produits SET donnees_fiche = $1 WHERE id = $2',
                [nouvellesDonnees, produit.id]
            );
            
            console.log(`   ✅ ${nouvellesDonnees.length} entrées corrigées`);
        }
        
        console.log('\n🎉 Correction terminée !');
        console.log('💡 Teste maintenant une fiche produit dans le navigateur');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

// Test de la fonction de correction sur le Vibox
async function testVibox() {
    try {
        console.log('🧪 Test de correction sur le Vibox...\n');
        
        const testData = [
            "PC gaming haut de gamme avec éclairage RGB, conçu pour les performances en 4K et la réalité virtuelle.",
            "💰 Prix : 1549,99 €",
            "🧩 Spécifications- Processeur : Intel Core i9-12900K- RAM : 32 Go DDR5- Stockage : 2 To SSD NVMe- Carte Graphique : NVIDIA GeForce RTX 4080- Connectivité : Wi-Fi 6, Bluetooth 5.2- Boîtier : Tour ATX avec refroidissement liquide RGB",
            "🌐 Fonctionnalités- Optimisation thermique avancée- Support multi-écrans- Mode streaming haute performance- Compatible VR avec Oculus et HTC Vive",
            "🎮 Usage recommandé- Idéal pour le gaming AAA, le montage vidéo 4K, la modélisation 3D et les expériences immersives multi-écrans."
        ];
        
        testData.forEach((data, index) => {
            console.log(`--- Test ${index} ---`);
            console.log(`Avant: "${data}"`);
            const corrigee = fixFormat(data);
            console.log(`Après: "${corrigee}"`);
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Erreur test:', error.message);
    }
}

// Choix: test ou correction complète
const args = process.argv.slice(2);
if (args.includes('--test')) {
    testVibox();
} else {
    fixAllProducts();
}