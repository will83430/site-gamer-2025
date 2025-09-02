// fix-format-products-direct.js
// Script pour corriger directement les 15 produits identifiés avec problème FORMAT

const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

// Liste des produits identifiés avec problème FORMAT depuis le diagnostic
const problematicProducts = [
    'canon-eos-r6-mark-ii',
    'insta360-x5', 
    'bose-quietcomfort-45',
    'sony-wh-1000xm5',
    'meta-quest-3',
    'asus-rog-ally-x',
    'nintendo-switch-2-pro',
    'playstation-5-slim',
    'autel-evo-max-5g',
    'autel-nano-plus',
    'dji-air-3s',
    'lg-oled65-g5',
    'asus-rog-strix-g18',
    'corsair-one-i500',
    'samsung-galaxy-s25-ultra'
];

async function fixFormatProductsDirectly() {
    try {
        console.log('🔧 Correction directe des produits FORMAT...\n');
        
        // Lire le fichier JSON propre
        const jsonData = fs.readFileSync('produits_propres.json', 'utf8');
        const cleanProductsData = JSON.parse(jsonData);
        
        // Créer un mapping nom -> donnees_fiche propres
        const cleanDataMap = {};
        cleanProductsData.forEach(product => {
            const nomClean = product.nom.toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/--+/g, '-')
                .replace(/^-|-$/g, '');
            cleanDataMap[nomClean] = product.donnees_fiche;
        });
        
        console.log(`📋 ${problematicProducts.length} produits à corriger`);
        console.log(`📊 ${cleanProductsData.length} produits propres disponibles\n`);
        
        let fixedCount = 0;
        let notFoundCount = 0;
        
        for (const productName of problematicProducts) {
            console.log(`🔍 Traitement de: ${productName}`);
            
            // Trouver le produit dans la BDD par nom
            const dbResult = await pool.query(
                'SELECT id, nom FROM produits WHERE nom ILIKE $1',
                [`%${productName.replace(/-/g, '%')}%`]
            );
            
            if (dbResult.rows.length === 0) {
                console.log(`   ❌ Produit non trouvé dans la BDD`);
                notFoundCount++;
                continue;
            }
            
            const dbProduct = dbResult.rows[0];
            
            // Chercher les données propres correspondantes
            let cleanData = null;
            const possibleKeys = [
                productName,
                productName.replace(/-/g, ''),
                dbProduct.nom.toLowerCase().replace(/[^a-z0-9]/g, '-')
            ];
            
            for (const key of possibleKeys) {
                if (cleanDataMap[key]) {
                    cleanData = cleanDataMap[key];
                    break;
                }
            }
            
            // Recherche par nom exact dans le JSON
            if (!cleanData) {
                const exactMatch = cleanProductsData.find(p => 
                    p.nom.toLowerCase().includes(productName.replace(/-/g, ' ')) ||
                    productName.includes(p.nom.toLowerCase().replace(/[^a-z0-9]/g, ''))
                );
                if (exactMatch) {
                    cleanData = exactMatch.donnees_fiche;
                }
            }
            
            if (cleanData) {
                // Nettoyer les données
                const cleanDonneesFiche = cleanData
                    .filter(fiche => fiche && fiche.trim().length > 0)
                    .map(fiche => fiche.replace(/\\n/g, '\n'));
                
                // Mettre à jour
                await pool.query(
                    'UPDATE produits SET donnees_fiche = $1 WHERE id = $2',
                    [cleanDonneesFiche, dbProduct.id]
                );
                
                console.log(`   ✅ Corrigé - ${cleanDonneesFiche.length} fiches restaurées`);
                fixedCount++;
            } else {
                console.log(`   ⚠️  Données propres non trouvées`);
                notFoundCount++;
            }
        }
        
        console.log(`\n📊 Résumé:`);
        console.log(`   ✅ Corrigés: ${fixedCount} produits`);
        console.log(`   ⚠️  Non trouvés: ${notFoundCount} produits`);
        
        // Vérification finale
        const stillProblematicResult = await pool.query(`
            SELECT COUNT(*) as count, nom
            FROM produits 
            WHERE (
                (donnees_fiche[1] LIKE '📝 Description détaillée%' AND length(donnees_fiche[1]) < 100)
                OR 
                (donnees_fiche[1] IS NOT NULL AND donnees_fiche[1] NOT LIKE '%\n%' AND length(donnees_fiche[1]) > 50)
            )
            GROUP BY nom
        `);
        
        console.log(`\n🔍 Produits encore problématiques: ${stillProblematicResult.rows.length}`);
        
        if (stillProblematicResult.rows.length === 0) {
            console.log('🎉 Tous les produits ont été corrigés !');
        } else {
            console.log('⚠️  Produits restants:');
            stillProblematicResult.rows.forEach(row => {
                console.log(`   - ${row.nom}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

fixFormatProductsDirectly();