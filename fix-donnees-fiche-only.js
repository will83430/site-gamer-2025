// fix-donnees-fiche-only.js
// Script pour corriger UNIQUEMENT les donnees_fiche corrompues

const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

async function fixDonneesFicheOnly() {
    try {
        console.log('🔧 Correction des donnees_fiche corrompues uniquement...\n');
        
        // Lire le fichier JSON propre
        let cleanProductsData;
        try {
            const jsonData = fs.readFileSync('produits_propres.json', 'utf8');
            cleanProductsData = JSON.parse(jsonData);
        } catch (error) {
            console.error('❌ Erreur lecture fichier produits_propres.json:', error.message);
            return;
        }
        
        // Créer un mapping nom -> donnees_fiche propres
        const cleanDataMap = {};
        cleanProductsData.forEach(product => {
            const nomClean = product.nom.toLowerCase().replace(/[^a-z0-9]/g, '-');
            cleanDataMap[nomClean] = product.donnees_fiche;
        });
        
        // Identifier les produits corrompus dans la BDD
        const corruptedResult = await pool.query(`
            SELECT id, nom, donnees_fiche[1] as sample_donnee
            FROM produits 
            WHERE donnees_fiche[1] LIKE '📝 Description détaillée%' 
            AND length(donnees_fiche[1]) < 100
        `);
        
        console.log(`🔍 ${corruptedResult.rows.length} produits corrompus détectés\n`);
        
        if (corruptedResult.rows.length === 0) {
            console.log('✅ Aucun produit corrompu trouvé !');
            return;
        }
        
        let fixedCount = 0;
        let notFoundCount = 0;
        
        for (const corruptedProduct of corruptedResult.rows) {
            // Créer une clé de recherche
            const nomKey = corruptedProduct.nom.toLowerCase().replace(/[^a-z0-9]/g, '-');
            
            // Chercher les données propres
            if (cleanDataMap[nomKey]) {
                // Nettoyer les données (convertir \\n en vrais retours à la ligne)
                const cleanDonneesFiche = cleanDataMap[nomKey]
                    .filter(fiche => fiche && fiche.trim().length > 0)
                    .map(fiche => fiche.replace(/\\n/g, '\n'));
                
                // Mettre à jour UNIQUEMENT donnees_fiche
                await pool.query(
                    'UPDATE produits SET donnees_fiche = $1 WHERE id = $2',
                    [cleanDonneesFiche, corruptedProduct.id]
                );
                
                console.log(`✅ ${corruptedProduct.nom} - ${cleanDonneesFiche.length} fiches restaurées`);
                fixedCount++;
                
            } else {
                console.log(`⚠️  ${corruptedProduct.nom} - données propres non trouvées`);
                notFoundCount++;
            }
        }
        
        console.log(`\n📊 Résumé:`);
        console.log(`   ✅ Corrigés: ${fixedCount} produits`);
        console.log(`   ⚠️  Non trouvés: ${notFoundCount} produits`);
        
        // Vérification finale
        const stillCorruptedResult = await pool.query(`
            SELECT COUNT(*) as count
            FROM produits 
            WHERE donnees_fiche[1] LIKE '📝 Description détaillée%' 
            AND length(donnees_fiche[1]) < 100
        `);
        
        const remainingCorrupted = stillCorruptedResult.rows[0].count;
        console.log(`\n🔍 Produits encore corrompus: ${remainingCorrupted}`);
        
        if (remainingCorrupted == 0) {
            console.log('🎉 Tous les produits ont été corrigés !');
            
            // Test d'un produit réparé
            const testResult = await pool.query(`
                SELECT nom, donnees_fiche[1] as sample_donnee
                FROM produits 
                WHERE donnees_fiche IS NOT NULL 
                AND array_length(donnees_fiche, 1) > 0
                ORDER BY nom
                LIMIT 1
            `);
            
            if (testResult.rows.length > 0) {
                const sample = testResult.rows[0].sample_donnee;
                console.log(`\n🧪 Test format (${testResult.rows[0].nom}):`);
                console.log(`   Premier échantillon: "${sample.substring(0, 60)}..."`);
                console.log(`   Format correct: ${sample.includes('\n') && sample.length > 50 ? '✅' : '❌'}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

// Mode test pour voir ce qui sera corrigé
async function testCorrections() {
    try {
        console.log('🧪 Test des corrections à effectuer...\n');
        
        // Lire le fichier JSON propre
        const jsonData = fs.readFileSync('produits_propres.json', 'utf8');
        const cleanProductsData = JSON.parse(jsonData);
        
        // Créer le mapping
        const cleanDataMap = {};
        cleanProductsData.forEach(product => {
            const nomClean = product.nom.toLowerCase().replace(/[^a-z0-9]/g, '-');
            cleanDataMap[nomClean] = product.donnees_fiche;
        });
        
        // Identifier les produits corrompus
        const corruptedResult = await pool.query(`
            SELECT id, nom, donnees_fiche[1] as sample_donnee
            FROM produits 
            WHERE donnees_fiche[1] LIKE '📝 Description détaillée%' 
            AND length(donnees_fiche[1]) < 100
        `);
        
        console.log(`🔍 ${corruptedResult.rows.length} produits corrompus:\n`);
        
        corruptedResult.rows.forEach((prod, index) => {
            const nomKey = prod.nom.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const hasCleanData = cleanDataMap[nomKey] ? '✅' : '❌';
            console.log(`${index + 1}. ${prod.nom} ${hasCleanData}`);
            
            if (cleanDataMap[nomKey]) {
                console.log(`   → ${cleanDataMap[nomKey].length} fiches propres disponibles`);
            }
        });
        
        console.log('\n💡 Lance "node fix-donnees-fiche-only.js" pour appliquer les corrections');
        
    } catch (error) {
        console.error('❌ Erreur test:', error.message);
    } finally {
        await pool.end();
    }
}

// Détecter le mode
const args = process.argv.slice(2);
if (args.includes('--test')) {
    testCorrections();
} else {
    fixDonneesFicheOnly();
}