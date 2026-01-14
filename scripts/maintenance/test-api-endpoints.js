/**
 * Script de test des endpoints API avec respect du rate limiting
 * Teste tous les endpoints de l'API avec des délais pour éviter les erreurs 429
 */

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const DELAY_BETWEEN_REQUESTS = 200; // 200ms entre chaque requête = 300 requêtes/minute max
const REQUEST_TIMEOUT = 10000; // 10 secondes de timeout

// Couleurs pour le terminal
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

// Catégories à tester
const categories = [
    'camera',
    'casque-vr',
    'console',
    'drone',
    'ecran-tv',
    'montre-connectee',
    'peripheriques',
    'smartphone',
    'tablette',
    'video-projecteur'
];

// Types d'endpoints pour les tendances
const tendanceEndpoints = [
    'actualites',
    'technologies',
    'marche',
    'insights',
    'predictions'
];

// Fonction pour faire une requête HTTP avec promesse
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Request timeout'));
        }, REQUEST_TIMEOUT);

        http.get(url, (res) => {
            clearTimeout(timeout);

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                    headers: res.headers,
                    body: data
                });
            });
        }).on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });
    });
}

// Fonction pour attendre un délai
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Fonction pour tester un endpoint
async function testEndpoint(url, description) {
    try {
        const response = await makeRequest(url);

        if (response.statusCode === 200) {
            console.log(`${colors.green}✅ ${description}${colors.reset}`);
            return { success: true, url, statusCode: response.statusCode };
        } else if (response.statusCode === 429) {
            console.log(`${colors.yellow}⚠️  ${description} - Rate limit (429)${colors.reset}`);
            return { success: false, url, statusCode: response.statusCode, error: 'Rate Limited' };
        } else {
            console.log(`${colors.red}❌ ${description} - Status ${response.statusCode}${colors.reset}`);
            return { success: false, url, statusCode: response.statusCode, error: `HTTP ${response.statusCode}` };
        }
    } catch (error) {
        console.log(`${colors.red}❌ ${description} - ${error.message}${colors.reset}`);
        return { success: false, url, error: error.message };
    }
}

// Fonction principale
async function testAllEndpoints() {
    console.log(`${colors.cyan}${colors.bold}🧪 Test des endpoints API avec rate limiting respecté${colors.reset}`);
    console.log(`${colors.cyan}📡 Base URL: ${BASE_URL}${colors.reset}`);
    console.log(`${colors.cyan}⏱️  Délai entre requêtes: ${DELAY_BETWEEN_REQUESTS}ms${colors.reset}\n`);

    const startTime = Date.now();
    const results = [];
    let totalTests = 0;
    let successTests = 0;
    let failedTests = 0;
    let rateLimitedTests = 0;

    // 1. Test des endpoints de base
    console.log(`${colors.magenta}${colors.bold}📦 Test des endpoints de base${colors.reset}\n`);

    const baseEndpoints = [
        { url: `${BASE_URL}/`, description: 'Page d\'accueil' },
        { url: `${BASE_URL}/api/test`, description: 'API Test endpoint' },
        { url: `${BASE_URL}/api/produits`, description: 'Liste des produits' },
        { url: `${BASE_URL}/api/categories`, description: 'Liste des catégories' }
    ];

    for (const endpoint of baseEndpoints) {
        const result = await testEndpoint(endpoint.url, endpoint.description);
        results.push(result);
        totalTests++;

        if (result.success) {
            successTests++;
        } else if (result.statusCode === 429) {
            rateLimitedTests++;
        } else {
            failedTests++;
        }

        await sleep(DELAY_BETWEEN_REQUESTS);
    }

    console.log('');

    // 2. Test des endpoints par catégorie
    console.log(`${colors.magenta}${colors.bold}📱 Test des endpoints de produits par catégorie${colors.reset}\n`);

    for (const categorie of categories) {
        const url = `${BASE_URL}/api/produits?categorie=${categorie}`;
        const description = `Produits: ${categorie}`;

        const result = await testEndpoint(url, description);
        results.push(result);
        totalTests++;

        if (result.success) {
            successTests++;
        } else if (result.statusCode === 429) {
            rateLimitedTests++;
        } else {
            failedTests++;
        }

        await sleep(DELAY_BETWEEN_REQUESTS);
    }

    console.log('');

    // 3. Test des endpoints de tendances
    console.log(`${colors.magenta}${colors.bold}📊 Test des endpoints de tendances${colors.reset}\n`);

    for (const categorie of categories) {
        console.log(`${colors.cyan}Catégorie: ${categorie}${colors.reset}`);

        for (const endpoint of tendanceEndpoints) {
            const url = `${BASE_URL}/api/${categorie}/${endpoint}`;
            const description = `  ${categorie}/${endpoint}`;

            const result = await testEndpoint(url, description);
            results.push(result);
            totalTests++;

            if (result.success) {
                successTests++;
            } else if (result.statusCode === 429) {
                rateLimitedTests++;
            } else {
                failedTests++;
            }

            await sleep(DELAY_BETWEEN_REQUESTS);
        }

        console.log('');
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Rapport final
    console.log(`${colors.bold}${colors.cyan}📊 RAPPORT FINAL${colors.reset}\n`);
    console.log(`${colors.cyan}Durée totale: ${duration}s${colors.reset}`);
    console.log(`${colors.cyan}Total de tests: ${totalTests}${colors.reset}`);
    console.log(`${colors.green}✅ Succès: ${successTests} (${((successTests/totalTests)*100).toFixed(1)}%)${colors.reset}`);
    console.log(`${colors.red}❌ Échecs: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Rate Limited: ${rateLimitedTests} (${((rateLimitedTests/totalTests)*100).toFixed(1)}%)${colors.reset}\n`);

    // Détails des échecs
    const failures = results.filter(r => !r.success && r.statusCode !== 429);
    if (failures.length > 0) {
        console.log(`${colors.red}${colors.bold}🚨 DÉTAILS DES ÉCHECS:${colors.reset}\n`);
        failures.forEach(failure => {
            console.log(`${colors.red}❌ ${failure.url}${colors.reset}`);
            console.log(`   Erreur: ${failure.error || `HTTP ${failure.statusCode}`}\n`);
        });
    }

    // Endpoints rate limited
    const rateLimited = results.filter(r => r.statusCode === 429);
    if (rateLimited.length > 0) {
        console.log(`${colors.yellow}${colors.bold}⚠️  ENDPOINTS RATE LIMITED (429):${colors.reset}\n`);
        rateLimited.forEach(rl => {
            console.log(`${colors.yellow}⚠️  ${rl.url}${colors.reset}`);
        });
        console.log('');
        console.log(`${colors.yellow}💡 Conseil: Augmenter le délai entre les requêtes (DELAY_BETWEEN_REQUESTS)${colors.reset}\n`);
    }

    // Statut final
    if (successTests === totalTests) {
        console.log(`${colors.green}${colors.bold}🎉 Tous les tests ont réussi !${colors.reset}`);
        process.exit(0);
    } else if (rateLimitedTests > 0 && failedTests === 0) {
        console.log(`${colors.yellow}${colors.bold}⚠️  Tests partiellement réussis (rate limiting détecté)${colors.reset}`);
        process.exit(1);
    } else {
        console.log(`${colors.red}${colors.bold}❌ Des tests ont échoué${colors.reset}`);
        process.exit(1);
    }
}

// Vérifier que le serveur est démarré
console.log(`${colors.cyan}🔍 Vérification que le serveur est démarré...${colors.reset}\n`);

makeRequest(`${BASE_URL}/api/test`)
    .then(() => {
        console.log(`${colors.green}✅ Serveur détecté, début des tests\n${colors.reset}`);
        return testAllEndpoints();
    })
    .catch((error) => {
        console.log(`${colors.red}❌ Erreur: Le serveur n'est pas démarré sur ${BASE_URL}${colors.reset}`);
        console.log(`${colors.yellow}💡 Démarrez le serveur avec: npm start${colors.reset}\n`);
        process.exit(1);
    });
