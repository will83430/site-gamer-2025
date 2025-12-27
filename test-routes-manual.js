// Test script pour vérifier les routes modulaires
const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${path}: OK (${json.total || 0} items)`);
          resolve(json);
        } catch (e) {
          console.log(`❌ ${path}: Invalid JSON`);
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`❌ ${path}: ${e.message}`);
      reject(e);
    });

    req.on('timeout', () => {
      console.log(`⏱️ ${path}: Timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function main() {
  console.log('🧪 Test des routes modulaires...\n');
  
  try {
    await testEndpoint('/api/produits');
    await testEndpoint('/api/produits?categorie=drone');
    await testEndpoint('/api/produits/prod_1');
    
    console.log('\n✅ Tous les tests passés !');
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

main();
