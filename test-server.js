console.log('🧪 Test serveur minimal...');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log('📞 Requête reçue !');
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`✅ Serveur test OK sur http://localhost:${port}`);
});

console.log('📋 Script exécuté');