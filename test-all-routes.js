// Test complet des routes modulaires
const http = require('http');

const tests = [
  { name: 'GET produits', path: '/api/produits' },
  { name: 'GET produits/drone', path: '/api/produits?categorie=drone' },
  { name: 'GET produits/prod_1', path: '/api/produits/prod_1' },
  { name: 'GET tendances/drone', path: '/api/tendances/drone' },
  { name: 'GET drone/actualites', path: '/api/drone/actualites' },
  { name: 'GET technologies/drone', path: '/api/technologies/drone' },
  { name: 'GET marche/drone', path: '/api/marche/drone' },
  { name: 'GET insights/drone', path: '/api/insights/drone' },
  { name: 'GET predictions/drone', path: '/api/predictions/drone' },
  { name: 'GET llm-config', path: '/api/llm-config' }
];

function testEndpoint(test) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: test.path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const count = json.total || (Array.isArray(json) ? json.length : '-');
          console.log(`✅ ${test.name.padEnd(25)} - Status ${res.statusCode} (${count} items)`);
          resolve(json);
        } catch (e) {
          console.log(`✅ ${test.name.padEnd(25)} - Status ${res.statusCode} (non-JSON)`);
          resolve(data);
        }
      });
    });

    req.on('error', (e) => {
      console.log(`❌ ${test.name.padEnd(25)} - ${e.message}`);
      reject(e);
    });

    req.on('timeout', () => {
      console.log(`⏱️ ${test.name.padEnd(25)} - Timeout`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function main() {
  console.log('🧪 Test des routes modulaires...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      await testEndpoint(test);
      passed++;
    } catch (error) {
      failed++;
    }
  }
  
  console.log(`\n✅ Tests réussis: ${passed}/${tests.length}`);
  if (failed > 0) {
    console.log(`❌ Tests échoués: ${failed}`);
  }
  
  process.exit(failed > 0 ? 1 : 0);
}

main();
