console.log('🧪 Test Node.js basique...');
console.log('Version Node:', process.version);
console.log('Répertoire:', __dirname);

const http = require('http');

const server = http.createServer((req, res) => {
    console.log('📞 Requête reçue:', req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!\n');
});

server.listen(3000, () => {
    console.log('✅ Serveur HTTP basique sur port 3000');
    console.log('🌐 Teste: http://localhost:3000');
});

console.log('📋 Script en cours d\'exécution...');