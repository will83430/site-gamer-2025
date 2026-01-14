// server-fixed.js - Version corrigée du serveur
require('dotenv').config();
const express = require('express');
const pool = require('./backend/config/database');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // IMPORTANT !
const compression = require('compression'); // 🔥 AJOUTE CETTE LIGNE
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./backend/config/logger');
const { errorHandler, notFoundHandler } = require('./backend/middleware/errorHandler');
const { slugToTitreAffiche } = require('./backend/utils/helpers');

// Import routes
const produitsRoutes = require('./backend/routes/produits');
const fichesRoutes = require('./backend/routes/fiches');
const fichesTendancesRoutes = require('./backend/routes/fichesTendances');
const tendancesRoutes = require('./backend/routes/tendances');
const contentRoutes = require('./backend/routes/content');
const technologiesRoutes = require('./backend/routes/technologies');
const marcheRoutes = require('./backend/routes/marche');
const insightsRoutes = require('./backend/routes/insights');
const predictionsRoutes = require('./backend/routes/predictions');
const categoriesRoutes = require('./backend/routes/categories');
const statsRoutes = require('./backend/routes/stats');

const assetsPath = path.join(__dirname, 'frontend/public/assets');

const app = express();
// Allow overriding the port via environment variable to avoid EADDRINUSE conflicts
const port = process.env.PORT || 3000;

// Sécurité: Headers HTTP avec Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval nécessaire pour onclick inline
      scriptSrcAttr: ["'unsafe-inline'"], // Permet les attributs onclick, onload, etc.
      connectSrc: ["'self'", "http://localhost:3000", "http://192.168.1.235:3000"], // API calls
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com", "https://www.youtube-nocookie.com", "https://www.dailymotion.com", "https://geo.dailymotion.com"], // Iframes vidéos
    }
  }
}));

app.use(compression()); // Compression gzip

// Logs HTTP avec Morgan (via Winston)
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logger.stream }));

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/assets/images/icons/icon-192x192.png'));
});

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
// Configuration CORS sécurisée
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'])
    : true,
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Sécurité: Rate limiting strict pour les IPs externes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite à 100 requêtes par fenêtre par IP
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
  // Fonction pour exempter localhost des limitations strictes
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
    // Skip (ne pas appliquer le limiter strict) si c'est localhost
    return isLocalhost;
  }
});

// Rate limiter plus permissif pour localhost (mode dev/tests)
const devApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // 10000 requêtes pour localhost = tests illimités
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
    return !isLocalhost; // Skip (ne pas appliquer) si ce n'est PAS localhost
  }
});

// Appliquer le rate limiting uniquement aux routes API
// 1. D'abord le limiter permissif pour localhost
app.use('/api/', devApiLimiter);
// 2. Puis le limiter strict pour les autres IPs
app.use('/api/', apiLimiter);

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
    logger.error('❌ Erreur init colonne:', error);
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

// Routes stats déplacées vers backend/routes/stats.js

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
    logger.error('❌ Erreur liste fiches:', error);
    res.json({
      success: true,
      fiches: []
    });
  }
});

// ========== ROUTES API ==========

// Routes catégories déplacées vers backend/routes/categories.js

// Utiliser les routes modulaires
app.use('/api/produits', produitsRoutes);
app.use('/api', fichesRoutes);
app.use('/api/fiche-tendance', fichesTendancesRoutes); // Routes pour les fiches tendances (génération + data)
app.use('/api/tendances', tendancesRoutes); // Table actualites (liste des cards)
app.use('/api/actualites', tendancesRoutes); // Même routes que tendances (table actualites)
app.use('/api', contentRoutes); // /:categorie/actualites, technologies, marche, insights, predictions
app.use('/api/technologies', technologiesRoutes);
app.use('/api/marche', marcheRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/categories', categoriesRoutes); // Routes catégories
app.use('/api/stats', statsRoutes); // Routes statistiques

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

// SÉCURITÉ: Endpoint LLM config désactivé - Contenait des informations sensibles
// Pour le réactiver, implémenter d'abord un système d'authentification admin
// app.get('/api/llm-config', requireAuth, (req, res) => { ... })
//
// Endpoint commenté pour sécurité - À réactiver avec authentification
// app.get('/api/llm-config', (req, res) => {
//   try {
//     const model = process.env.OPENAI_MODEL || 'gpt-5';
//     const enabled = (process.env.GPT5_ENABLED || 'false').toLowerCase() === 'true';
//     const rollout = parseInt(process.env.GPT5_ROLLOUT || '0', 10);
//
//     res.json({
//       success: true,
//       model,
//       enabled,
//       rollout_percent: isNaN(rollout) ? 0 : Math.max(0, Math.min(100, rollout))
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// Endpoint pour sauvegarder le rapport d'intégrité des liens
app.post('/api/save-report', (req, res) => {
  try {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'filename et content sont requis' 
      });
    }
    
    // Sauvegarder dans le dossier scripts/maintenance
    const reportPath = path.join(__dirname, 'frontend', 'public', 'scripts', 'maintenance', filename);
    fs.writeFileSync(reportPath, content, 'utf8');
    
    res.json({ 
      success: true, 
      message: `Rapport sauvegardé: ${filename}`,
      path: `/scripts/maintenance/${filename}`
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// ========== GESTION DES ERREURS (À LA FIN, APRÈS TOUTES LES ROUTES) ==========

// Middleware 404 - Route non trouvée
app.use(notFoundHandler);

// Middleware de gestion centralisée des erreurs
app.use(errorHandler);

app.listen(port, '0.0.0.0', async () => {
  // Test connexion PostgreSQL
  try {
    const result = await pool.query('SELECT COUNT(*) FROM produits');
  } catch (err) {
    logger.error('❌ Erreur PostgreSQL:', err.message);
  }

  // Vérifier que les images sont accessibles
  const testImagePath = path.join(assetsPath, 'images');
  if (fs.existsSync(testImagePath)) {
  } else {
  }

  // Ajoute ce message :
  logger.info(`🚀 Serveur démarré sur http://localhost:${port}`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});