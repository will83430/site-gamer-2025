require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function showSummary() {
  try {
    const result = await pool.query(`
      SELECT id, nom, titre_affiche, categorie, prix, top_du_mois 
      FROM produits 
      WHERE id IN ('prod_63', 'prod_64', 'prod_65', 'prod_66', 'prod_67', 'prod_68', 
                   'prod_69', 'prod_70', 'prod_71', 'prod_72', 'prod_73', 'prod_74')
      ORDER BY id
    `);
    
    console.log('📦 Produits ajoutés pour Janvier 2026:\n');
    console.log('═'.repeat(80));
    
    result.rows.forEach(p => {
      const star = p.top_du_mois ? '⭐' : '  ';
      console.log(`${star} ${p.id} - ${p.titre_affiche}`);
      console.log(`   Catégorie: ${p.categorie} | Prix: ${p.prix}`);
      console.log('─'.repeat(80));
    });
    
    console.log(`\n✨ Total: ${result.rows.length} nouveaux produits`);
    console.log(`⭐ Dont ${result.rows.filter(p => p.top_du_mois).length} "Top du mois"`);
    
  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

showSummary();
