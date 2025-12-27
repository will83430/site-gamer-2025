// server-fixed.js - Version corrigée du serveur
require('dotenv').config();
const express = require('express');
const pool = require('./backend/config/database');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // IMPORTANT !
const compression = require('compression'); // 🔥 AJOUTE CETTE LIGNE

// Import routes
const produitsRoutes = require('./backend/routes/produits');
const fichesRoutes = require('./backend/routes/fiches');
const tendancesRoutes = require('./backend/routes/tendances');
const contentRoutes = require('./backend/routes/content');
const technologiesRoutes = require('./backend/routes/technologies');
const marcheRoutes = require('./backend/routes/marche');
const insightsRoutes = require('./backend/routes/insights');
const predictionsRoutes = require('./backend/routes/predictions');

const assetsPath = path.join(__dirname, 'frontend/public/assets');

const app = express();
// Allow overriding the port via environment variable to avoid EADDRINUSE conflicts
const port = process.env.PORT || 3000;

app.use(compression()); // Compression gzip

// Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========== SERVIR LES FICHIERS STATIQUES - ORDRE IMPORTANT ! ==========

// 1. D'ABORD servir le dossier frontend/public/assets pour /assets
app.use('/assets', express.static(path.join(__dirname, 'frontend/public/assets')));

// 2. Servir aussi frontend/public pour les fichiers HTML
const frontendPath = path.join(__dirname, 'frontend', 'public');
app.use('/frontend/public', express.static(frontendPath));

// 3. Servir le dossier fiches
const fichesPath = path.join(__dirname, 'fiches');
if (fs.existsSync(fichesPath)) {
  app.use('/fiches', express.static(fichesPath));
}

// 4. Servir la racine pour index.html, etc.
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// Servir index.html à la racine
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

// ========== ROUTES API - PLACEZ TOUT CECI AVANT LES ROUTES GÉNÉRIQUES ==========

// Route pour initialiser la colonne image
app.post('/api/init-image-column', async (req, res) => {
  try {
    // Vérifier si la colonne existe déjà
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'produits' AND column_name = 'image'
    `);
    
    if (checkColumn.rows.length === 0) {
      // Ajouter la colonne si elle n'existe pas
      await pool.query('ALTER TABLE produits ADD COLUMN image VARCHAR(255)');
      res.json({ success: true, message: 'Colonne image ajoutée avec succès' });
    } else {
      res.json({ success: true, message: 'Colonne image déjà présente' });
    }
  } catch (error) {
    console.error('❌ Erreur init colonne:', error);
    res.json({ success: true, message: 'Colonne OK (erreur ignorée)' });
  }
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API PostgreSQL fonctionne!',
    timestamp: new Date().toISOString()
  });
});

// GET - Statistiques
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT id) AS total_products,
        COUNT(DISTINCT CASE WHEN categorie IS NOT NULL AND categorie != '' THEN categorie END) AS total_categories,
        COUNT(*) FILTER (WHERE top_du_mois = TRUE) AS featured_products
      FROM produits
    `);

    res.json({
      success: true,
      stats: stats.rows[0]
    });

  } catch (error) {
    console.error('❌ Erreur stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Liste des fiches
app.get('/api/fiches-list', (req, res) => {
  try {
    const fichesDir = path.join(__dirname, 'fiches');
    const fiches = [];
    
    if (fs.existsSync(fichesDir)) {
      const categories = fs.readdirSync(fichesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      categories.forEach(category => {
        const categoryPath = path.join(fichesDir, category);
        const files = fs.readdirSync(categoryPath)
          .filter(file => file.endsWith('.html'));
        
        files.forEach(file => {
          fiches.push({
            name: file,
            path: `fiches/${category}/${file}`,
            category: category
          });
        });
      });
    }
    
    res.json({
      success: true,
      fiches: fiches
    });
  } catch (error) {
    console.error('❌ Erreur liste fiches:', error);
    res.json({
      success: true,
      fiches: []
    });
  }
});

// ========== ROUTES API ==========

// Utiliser les routes modulaires
app.use('/api/produits', produitsRoutes);
app.use('/api', fichesRoutes);
app.use('/api/tendances', tendancesRoutes); // Alias: table actualites
app.use('/api/actualites', tendancesRoutes); // Même routes que tendances (table actualites)
app.use('/api', contentRoutes); // /:categorie/actualites, technologies, marche, insights, predictions
app.use('/api/technologies', technologiesRoutes);
app.use('/api/marche', marcheRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/predictions', predictionsRoutes);

// GET - Récupérer tous les produits
// DÉPLACÉ vers backend/routes/produits.js

// GET - Récupérer un produit par ID  
// DÉPLACÉ vers backend/routes/produits.js

// POST - Créer un nouveau produit
// DÉPLACÉ vers backend/routes/produits.js

// PUT - Mettre à jour un produit
// DÉPLACÉ vers backend/routes/produits.js

// ================== HELPER FUNCTIONS ==================

// ========== ROUTES G�N�RIQUES - FIN ==========

// Servir les fiches HTML g�n�r�es dynamiquement
app.get('/fiches/:category/:fiche', (req, res) => {
  const { category, fiche } = req.params;
  const filePath = path.join(__dirname, 'fiches', category, fiche);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Fiche non trouv�e');
  }
});

// Endpoint pour exposer la configuration LLM
// Endpoint pour exposer la configuration LLM (modèle / rollout)
app.get('/api/llm-config', (req, res) => {
  try {
    const model = process.env.OPENAI_MODEL || 'gpt-5';
    const enabled = (process.env.GPT5_ENABLED || 'false').toLowerCase() === 'true';
    const rollout = parseInt(process.env.GPT5_ROLLOUT || '0', 10);

    res.json({
      success: true,
      model,
      enabled,
      rollout_percent: isNaN(rollout) ? 0 : Math.max(0, Math.min(100, rollout))
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, '0.0.0.0', async () => {
  // Test connexion PostgreSQL
  try {
    const result = await pool.query('SELECT COUNT(*) FROM produits');
  } catch (err) {
    console.error('❌ Erreur PostgreSQL:', err.message);
  }

  // Vérifier que les images sont accessibles
  const testImagePath = path.join(assetsPath, 'images');
  if (fs.existsSync(testImagePath)) {
  } else {
  }

  // Ajoute ce message :
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

// ...avant INSERT ou UPDATE...
function slugToTitreAffiche(slug) {
    if (!slug) return '';
    return slug
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}