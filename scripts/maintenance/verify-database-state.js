const pool = require('../backend/config/database');

async function verifyDatabaseState() {
  try {
    console.log('📊 VÉRIFICATION DE L\'ÉTAT DE LA BASE DE DONNÉES\n');

    // Afficher quelques exemples de produits avec leurs infos
    console.log('📋 ÉCHANTILLON DE PRODUITS (10 premiers):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const samplesResult = await pool.query(`
      SELECT categorie, image, lien, nom 
      FROM produits 
      ORDER BY id 
      LIMIT 10
    `);
    
    samplesResult.rows.forEach(row => {
      console.log(`📦 ${row.categorie.padEnd(18)} | 🖼️  ${row.image.substring(0, 30).padEnd(32)} | 🔗 ${row.lien.substring(0, 40)}`);
    });

    // Statistiques par catégorie
    console.log('\n📊 RÉPARTITION PAR CATÉGORIE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const categoriesResult = await pool.query(`
      SELECT categorie, COUNT(*) as count 
      FROM produits 
      GROUP BY categorie 
      ORDER BY count DESC
    `);
    
    categoriesResult.rows.forEach(row => {
      console.log(`📂 ${row.categorie.padEnd(20)} | 🔢 ${row.count.toString().padStart(2)} produits`);
    });

    // Vérifications de cohérence
    console.log('\n🔍 VÉRIFICATIONS DE COHÉRENCE:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Liens HTTP restants
    const httpResult = await pool.query(`SELECT COUNT(*) as count FROM produits WHERE lien LIKE 'http%'`);
    console.log(`🔗 Liens HTTP externes: ${httpResult.rows[0].count} ${httpResult.rows[0].count === '0' ? '✅' : '❌'}`);

    // Images avec chemin complet
    const imagePathResult = await pool.query(`SELECT COUNT(*) as count FROM produits WHERE image LIKE '/assets/images/%'`);
    console.log(`🖼️ Images avec chemin complet: ${imagePathResult.rows[0].count} ${imagePathResult.rows[0].count === '0' ? '✅' : '❌'}`);

    // Noms de fichiers avec espaces
    const spacesResult = await pool.query(`SELECT COUNT(*) as count FROM produits WHERE lien LIKE '% %'`);
    console.log(`📄 Liens avec espaces: ${spacesResult.rows[0].count} ${spacesResult.rows[0].count === '0' ? '✅' : '❌'}`);

    // Catégories en minuscules
    const lowercaseResult = await pool.query(`SELECT COUNT(*) as count FROM produits WHERE categorie ~ '[a-z]' AND categorie !~ '^[A-Z]'`);
    console.log(`📂 Catégories en minuscules: ${lowercaseResult.rows[0].count} ${lowercaseResult.rows[0].count === '0' ? '✅' : '❌'}`);

    console.log('\n📈 RÉSUMÉ FINAL:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM produits');
    console.log(`📦 Total produits: ${totalResult.rows[0].total}`);
    
    const distinctCategoriesResult = await pool.query('SELECT COUNT(DISTINCT categorie) as categories FROM produits');
    console.log(`📂 Catégories uniques: ${distinctCategoriesResult.rows[0].categories}`);
    
    const topDuMoisResult = await pool.query('SELECT COUNT(*) as count FROM produits WHERE top_du_mois = true');
    console.log(`⭐ Produits "Top du mois": ${topDuMoisResult.rows[0].count}`);

    console.log('\n✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

verifyDatabaseState();