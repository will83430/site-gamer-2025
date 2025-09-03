// check-current-products.js
// Script pour afficher les produits actuels dans PostgreSQL

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

async function checkCurrentProducts() {
    try {
        console.log('📋 Vérification des produits actuels dans PostgreSQL...\n');
        
        // Compter le nombre total
        const count = await pool.query('SELECT COUNT(*) FROM produits');
        console.log(`📊 Nombre total de produits: ${count.rows[0].count}\n`);
        
        if (count.rows[0].count == 0) {
            console.log('❌ Aucun produit dans la base !');
            return;
        }
        
        // Lister tous les produits avec leurs données problématiques
        const result = await pool.query(`
            SELECT 
                id, 
                nom, 
                categorie, 
                top_du_mois,
                array_length(donnees_fiche, 1) as nb_donnees,
                donnees_fiche[1] as sample_donnee
            FROM produits 
            ORDER BY categorie, nom
        `);
        
        console.log('🔍 Analyse des produits:\n');
        
        let currentCategory = '';
        let problematicCount = 0;
        
        result.rows.forEach((prod, index) => {
            if (prod.categorie !== currentCategory) {
                currentCategory = prod.categorie;
                console.log(`\n📁 ${currentCategory}:`);
            }
            
            // Analyser la première donnée_fiche pour détecter les problèmes
            let status = '✅';
            if (prod.sample_donnee) {
                const sample = prod.sample_donnee;
                if (sample.includes('📝 Description détaillée\n') && sample.length < 50) {
                    status = '❌ VIDE';
                    problematicCount++;
                } else if (!sample.includes('\n') && sample.length > 20) {
                    status = '⚠️  FORMAT';
                    problematicCount++;
                }
            } else {
                status = '❌ NULL';
                problematicCount++;
            }
            
            const topBadge = prod.top_du_mois ? ' ⭐' : '';
            console.log(`   ${status} ${prod.nom}${topBadge} (${prod.nb_donnees || 0} fiches)`);
            
            // Afficher un échantillon de la donnée problématique
            if (status.includes('❌') || status.includes('⚠️')) {
                const preview = prod.sample_donnee ? 
                    (prod.sample_donnee.length > 60 ? 
                        prod.sample_donnee.substring(0, 60) + '...' : 
                        prod.sample_donnee) : 
                    'null';
                console.log(`      → "${preview}"`);
            }
        });
        
        console.log(`\n📊 Résumé:`);
        console.log(`   Total: ${result.rows.length} produits`);
        console.log(`   Problématiques: ${problematicCount} produits`);
        console.log(`   OK: ${result.rows.length - problematicCount} produits`);
        
        if (problematicCount > 0) {
            console.log('\n💡 Solution: Utiliser le script de repopulation avec des données propres');
        }
        
        // Export JSON des produits actuels (utile pour backup)
        console.log('\n💾 Export des produits actuels...');
        const fullData = await pool.query(`
            SELECT 
                nom, categorie, description, image, lien, 
                top_du_mois, prix, fonctionnalites_avancees, 
                donnees_fiche, id
            FROM produits 
            ORDER BY categorie, nom
        `);
        
        // Sauvegarder dans un fichier JSON
        const fs = require('fs');
        const exportData = fullData.rows;
        fs.writeFileSync('export_produits_actuels.json', JSON.stringify(exportData, null, 2));
        console.log('✅ Export sauvegardé dans export_produits_actuels.json');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

checkCurrentProducts();