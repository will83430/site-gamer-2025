(async () => {
  const c = new Client({ 
    user: 'postgres', 
    host: 'localhost', 
    database: 'gamer_2025', 
    password: 'Wilfried!1985', 
    port: 5432 
  });
  
  try {
    await c.connect();
    console.log('🔧 Nettoyage des donnees_fiche...\n');
    
    // Récupérer tous les produits avec donnees_fiche corrompus
    const r = await c.query('SELECT id, nom, donnees_fiche FROM produits ORDER BY id');
    
    let fixed = 0;
    let errors = 0;
    
    for (const prod of r.rows) {
      try {
        // Essayer de parser le JSON actuel
        let parsed = null;
        try {
          parsed = JSON.parse(prod.donnees_fiche);
        } catch(e) {
          // Si erreur, nettoyer et créer un JSON valide simple
          let text = String(prod.donnees_fiche || '');
          
          // Enlever les caractères de contrôle et non-UTF8
          text = text.replace(/[\x00-\x1F\x7F]/g, ' ').trim();
          
          // Créer un simple tableau JSON avec la description
          parsed = [text.substring(0, 200)];
        }
        
        // Assurer que c'est un array
        if (!Array.isArray(parsed)) {
          parsed = [String(parsed).substring(0, 200)];
        }
        
        // Nettoyer chaque élément
        parsed = parsed.map(item => {
          let s = String(item || '');
          // Enlever caractères de contrôle
          s = s.replace(/[\x00-\x1F\x7F]/g, ' ').trim();
          return s.substring(0, 500);
        }).filter(s => s.length > 0);
        
        // Fallback si vide
        if (parsed.length === 0) {
          parsed = ['Produit'];
        }
        
        // Mettre à jour dans la BD
        const json = JSON.stringify(parsed);
        await c.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [json, prod.id]);
        
        console.log(`✅ ${prod.id} - ${prod.nom}`);
        fixed++;
        
      } catch(e) {
        console.log(`❌ ${prod.id} - ${prod.nom}: ${e.message}`);
        errors++;
      }
    }
    
    console.log(`\n✅ Nettoyage terminé: ${fixed} produits fixés, ${errors} erreurs`);
    
  } catch(e) {
    console.error('❌ Erreur:', e.message);
  } finally {
    await c.end();
  }
})();
