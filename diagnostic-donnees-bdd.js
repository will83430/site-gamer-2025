// diagnostic-donnees-bdd.js
// Script pour vérifier les données dans PostgreSQL

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

async function analyzerDonneesFiche() {
    try {
        console.log('🔍 Analyse des données donnees_fiche...\n');
        
        // Récupérer le Vibox X-215 SG spécifiquement
        const result = await pool.query(`
            SELECT nom, categorie, donnees_fiche 
            FROM produits 
            WHERE nom LIKE '%Vibox%'
        `);
        
        if (result.rows.length === 0) {
            console.log('❌ Aucun produit Vibox trouvé');
            return;
        }
        
        const produit = result.rows[0];
        console.log(`📦 Produit: ${produit.nom}`);
        console.log(`📂 Catégorie: ${produit.categorie}`);
        console.log(`📊 Nombre d'entrées donnees_fiche: ${produit.donnees_fiche?.length || 0}\n`);
        
        if (produit.donnees_fiche && produit.donnees_fiche.length > 0) {
            produit.donnees_fiche.forEach((donnee, index) => {
                console.log(`--- Index [${index}] ---`);
                console.log(`Contenu brut: "${donnee}"`);
                
                // Analyser la structure
                const contenuNettoye = donnee.replace(/\\n/g, '\n');
                
                if (contenuNettoye.includes('\n')) {
                    const parties = contenuNettoye.split('\n');
                    console.log(`✅ Format avec titre: "${parties[0]}"`);
                    console.log(`   Contenu: "${parties.slice(1).join('\\n')}"`);
                } else {
                    console.log(`⚠️  Format texte simple (sera transformé en "📝 Description")`);
                }
                
                console.log('---\n');
            });
        }
        
        // Analyser quelques autres produits pour comparaison
        console.log('\n🔍 Analyse de quelques autres produits...\n');
        
        const others = await pool.query(`
            SELECT nom, categorie, donnees_fiche 
            FROM produits 
            WHERE donnees_fiche IS NOT NULL 
            AND array_length(donnees_fiche, 1) > 0
            LIMIT 3
        `);
        
        others.rows.forEach(prod => {
            console.log(`📦 ${prod.nom}:`);
            if (prod.donnees_fiche) {
                const problemEntries = prod.donnees_fiche.filter((d, i) => {
                    const cleaned = d.replace(/\\n/g, '\n');
                    return !cleaned.includes('\n') && d.trim().length > 0;
                });
                
                if (problemEntries.length > 0) {
                    console.log(`   ⚠️  ${problemEntries.length} entrée(s) sans emoji/titre`);
                    problemEntries.forEach(entry => {
                        console.log(`      "${entry.substring(0, 50)}..."`);
                    });
                } else {
                    console.log(`   ✅ Toutes les entrées ont emoji/titre`);
                }
            }
            console.log('');
        });
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await pool.end();
    }
}

analyzerDonneesFiche();