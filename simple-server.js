const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/api/test') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('{"success": true, "message": "Serveur fonctionne!"}');
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('<h1>Serveur fonctionne!</h1><a href="/api/test">Test API</a>');
    }
});

server.listen(3000);