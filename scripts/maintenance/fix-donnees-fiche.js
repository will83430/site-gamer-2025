require('dotenv').config();
const { Client } = require('pg');

(async () => {
  const c = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  });
  
  try {
    await c.connect();
    console.log('🔧 Correction des donnees_fiche...\n');
    
    // Récupérer tous les produits
    const r = await c.query('SELECT id, nom, description FROM produits ORDER BY id');
    
    let fixed = 0;
    
    for (const prod of r.rows) {
      try {
        // Créer un JSON valide simplifié basé sur la description
        const desc = (prod.description || 'Produit').substring(0, 300);
        const donnees = JSON.stringify([desc]);
        
        await c.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [donnees, prod.id]);
        
        console.log(`✅ ${prod.id} - ${prod.nom}`);
        fixed++;
        
      } catch(e) {
        console.log(`❌ ${prod.id}: ${e.message}`);
      }
    }
    
    console.log(`\n✅ ${fixed}/45 produits corrigés`);
    
  } catch(e) {
    console.error('❌ Erreur:', e.message);
  } finally {
    await c.end();
  }
})();
