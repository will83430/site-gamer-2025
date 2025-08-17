const fs = require('fs');

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    
    // Écrire dans un fichier log
    fs.appendFileSync('server.log', logMessage);
    
    // Essayer aussi console.log
    console.log(message);
}

log('🚀 Démarrage du serveur...');

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('frontend/public'));

app.get('/api/test', (req, res) => {
    log('📡 Route API appelée');
    res.json({ success: true, message: 'Serveur fonctionne!' });
});

app.listen(port, () => {
    log(`✅ Serveur démarré sur http://localhost:${port}`);
});

log('📋 Configuration terminée');