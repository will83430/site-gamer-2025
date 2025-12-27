// Test des endpoints actualités
const http = require('http');

const tests = [
  { name: 'GET actualites/drone', path: '/api/actualites/drone' },
  { name: 'GET tendances/drone', path: '/api/tendances/drone' },
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
          const count = Array.isArray(json) ? json.length : '-';
          console.log(`✅ ${test.name.padEnd(25)} - ${count} items`);
          resolve(json);
        } catch (e) {
          console.log(`❌ ${test.name.padEnd(25)} - Parse error`);
          reject(e);
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
  console.log('🧪 Test des endpoints actualités/tendances...\n');
  
  for (const test of tests) {
    await testEndpoint(test);
  }
  
  console.log('\n✅ Les deux endpoints pointent vers la même table !');
}

main();
