const pool = require('../backend/config/database');

async function run() {
  try {
    const result = await pool.query('SELECT id, nom, donnees_fiche FROM produits WHERE id = $1', ['prod_60']);
    
    console.log('\n=== VERIFICATION XIAOMI 15 ULTRA ===\n');
    const product = result.rows[0];
    
    console.log('Produit:', product.nom);
    console.log('\n=== DONNEES_FICHE ===\n');
    
    product.donnees_fiche.forEach((section, index) => {
      console.log(`[${index}] ========================================`);
      console.log(section);
      console.log('');
    });
    
    await pool.end();
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

run();
