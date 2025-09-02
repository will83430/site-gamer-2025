// quick-check.js - Vérification rapide de la BDD
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

async function quickCheck() {
    try {
        console.log('🔍 Vérification rapide de la base de données...\n');
        
        // Test connexion
        const version = await pool.query('SELECT version()');
        console.log('✅ Connexion PostgreSQL OK\n');
        
        // Compter les produits
        const count = await pool.query('SELECT COUNT(*) FROM produits');
        console.log(`📊 Nombre de produits: ${count.rows[0].count}\n`);
        
        if (count.rows[0].count > 0) {
            // Lister quelques produits
            const products = await pool.query('SELECT nom FROM produits LIMIT 5');
            console.log('📋 Quelques produits trouvés:');
            products.rows.forEach((p, i) => console.log(`   ${i+1}. ${p.nom}`));
            
            console.log('\n✅ TES DONNÉES SONT ENCORE LÀ ! 🎉');
        } else {
            console.log('❌ AUCUN PRODUIT TROUVÉ - Base vide');
            console.log('\n💡 Solutions:');
            console.log('1. Réimporter: psql -U postgres -d postgres -f backend/gestion_produits.sql');
            console.log('2. Ou restaurer une sauvegarde si tu en as une');
        }
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        
        if (error.message.includes('does not exist')) {
            console.log('\n💡 La table "produits" n\'existe pas.');
            console.log('Créer la table avec: psql -U postgres -d postgres -f backend/gestion_produits.sql');
        }
    } finally {
        await pool.end();
    }
}

quickCheck();