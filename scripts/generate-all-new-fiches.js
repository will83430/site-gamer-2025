// Script pour générer automatiquement les fiches des nouveaux produits
const { Client } = require('pg');
const http = require('http');

// Configuration PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gamer_2025',
  password: 'Wilfried!1985',
  port: 5432,
});

// Configuration API
const API_URL = 'http://localhost:3000/api';

// Les 12 nouveaux produits
const nouveauxProduits = [
  { nom: 'xiaomi-15-ultra', id: 'prod_50' },
  { nom: 'lenovo-legion-go-s', id: 'prod_51' },
  { nom: 'dji-neo-2', id: 'prod_52' },
  { nom: 'meta-quest-3s', id: 'prod_53' },
  { nom: 'msi-titan-18-hx', id: 'prod_54' },
  { nom: 'oneplus-pad-2', id: 'prod_55' },
  { nom: 'huawei-watch-gt-5-pro', id: 'prod_56' },
  { nom: 'sennheiser-momentum-5', id: 'prod_57' },
  { nom: 'samsung-qn900d-neo-qled-8k', id: 'prod_58' },
  { nom: 'sony-a7-v', id: 'prod_59' },
  { nom: 'bambu-lab-x1-carbon-combo', id: 'prod_60' },
  { nom: 'razer-blackwidow-v4-pro-75-', id: 'prod_61' }
];

async function genererFichesProduits() {
  try {
    await client.connect();
    console.log('✅ Connecté à PostgreSQL\n');
    
    // Vérifier que les produits existent dans la base
    const result = await client.query('SELECT id, nom FROM produits WHERE nom = ANY($1)', 
      [nouveauxProduits.map(p => p.nom)]);
    
    console.log(`📦 Produits trouvés dans la base: ${result.rows.length}`);
    
    if (result.rows.length === 0) {
      console.log('❌ Aucun nouveau produit trouvé dans la base');
      console.log('💡 Vérifiez que le script add-new-products.js a été exécuté correctement');
      return;
    }

    console.log('\n🚀 Génération des fiches HTML...\n');

    for (const produitDB of result.rows) {
      try {
        console.log(`📄 Génération fiche pour: ${produitDB.nom} (${produitDB.id})`);
        
        // Appeler l'API generate-fiche avec http natif
        const postData = '';
        const options = {
          hostname: 'localhost',
          port: 3000,
          path: `/api/generate-fiche/${produitDB.id}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const response = await new Promise((resolve, reject) => {
          const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
              try {
                resolve(JSON.parse(data));
              } catch (error) {
                reject(error);
              }
            });
          });
          
          req.on('error', reject);
          req.write(postData);
          req.end();
        });
        
        if (response.success) {
          console.log(`   ✅ Fiche générée: ${response.path}`);
        } else {
          console.log(`   ❌ Erreur: ${response.error}`);
        }
        
        // Pause entre les requêtes
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`   ❌ Erreur génération ${produitDB.nom}: ${error.message}`);
      }
    }
    
    console.log('\n✨ Génération terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await client.end();
  }
}

async function verifierEtatBase() {
  const checkClient = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'gamer_2025',
    password: 'Wilfried!1985',
    port: 5432,
  });
  
  try {
    await checkClient.connect();
    
    // Vérifier le nombre total de produits
    const countResult = await checkClient.query('SELECT COUNT(*) as total FROM produits');
    console.log(`📊 Total produits en base: ${countResult.rows[0].total}`);
    
    // Vérifier les nouveaux produits spécifiquement
    const newResult = await checkClient.query(`
      SELECT id, nom, categorie FROM produits 
      WHERE nom IN ('xiaomi-15-ultra', 'lenovo-legion-go-s', 'dji-neo-2', 'meta-quest-3s', 
                    'msi-titan-18-hx', 'oneplus-pad-2', 'huawei-watch-gt-5-pro', 
                    'sennheiser-momentum-5', 'samsung-qn900d-neo-qled-8k', 'sony-a7-v', 
                    'bambu-lab-x1-carbon-combo', 'razer-blackwidow-v4-pro-75-')
      ORDER BY id
    `);
    
    console.log(`🆕 Nouveaux produits trouvés: ${newResult.rows.length}`);
    if (newResult.rows.length > 0) {
      newResult.rows.forEach(p => {
        console.log(`   - ${p.id}: ${p.nom} (${p.categorie})`);
      });
    }
    
    await checkClient.end();
    
    return newResult.rows.length;
    
  } catch (error) {
    console.error('❌ Erreur vérification:', error.message);
    return 0;
  }
}

async function run() {
  console.log('🔍 Vérification état de la base...\n');
  
  const nouveauxCount = await verifierEtatBase();
  
  if (nouveauxCount === 0) {
    console.log('\n❌ Aucun nouveau produit trouvé !');
    console.log('💡 Exécutez d\'abord: node scripts/add-new-products.js');
    process.exit(1);
  }
  
  if (nouveauxCount < 12) {
    console.log(`\n⚠️  Seulement ${nouveauxCount}/12 nouveaux produits trouvés`);
    console.log('💡 Il manque probablement des produits');
  }
  
  console.log('\n' + '='.repeat(50));
  await genererFichesProduits();
}

// Vérifier si on veut juste vérifier l'état
if (process.argv.includes('--check')) {
  verifierEtatBase();
} else {
  run();
}