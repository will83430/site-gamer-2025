const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

console.log('🚀 Démarrage serveur sans DB...');

app.use(cors());
app.use(express.json());
app.use(express.static('frontend/public'));

// Route test sans DB
app.get('/api/test', (req, res) => {
    console.log('📡 Route test appelée');
    res.json({ success: true, message: 'Serveur fonctionne!' });
});

// Route produits avec données fake
app.get('/api/produits', (req, res) => {
    console.log('📡 Route produits appelée');
    res.json({
        success: true,
        data: [
            { id: 'test1', nom: 'Test Produit', categorie: 'TEST' }
        ],
        total: 1
    });
});

app.listen(port, () => {
    console.log(`✅ Serveur test démarré sur http://localhost:${port}`);
    console.log(`🌐 Test: http://localhost:${port}/api/test`);
});

console.log('📋 Script terminé');