/**
 * server-2026.js - Serveur pour le redesign HIGH-TECH 2026
 * Nouvelle homepage avec bannières dynamiques, stats en temps réel, etc.
 */
require('dotenv').config();
const express = require('express');
const pool = require('./backend/config/database');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./backend/config/logger');
const { errorHandler, notFoundHandler } = require('./backend/middleware/errorHandler');

// ========== IMPORT ROUTES ==========
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
const announcementsRoutes = require('./backend/routes/announcements');
const wikiRoutes = require('./backend/routes/wiki');
const activityLogsRoutes = require('./backend/routes/activity-logs');
const sitemapRoutes = require('./backend/routes/sitemap');
const aboutRoutes = require('./backend/routes/about');
const timelineRoutes = require('./backend/routes/timeline');
const guidesRoutes = require('./backend/routes/guides');
const priceEvolutionRoutes = require('./backend/routes/price-evolution');
const priceScraperRoutes = require('./backend/routes/price-scraper');
const nouveautesRoutes = require('./backend/routes/nouveautes');

// ========== CONFIGURATION ==========
const app = express();
const port = process.env.PORT || 3000;
const assetsPath = path.join(__dirname, 'frontend/public/assets');

// ========== SÉCURITÉ ==========
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
        scriptSrcAttr: ["'unsafe-inline'"],
        connectSrc: ["'self'", "https:", "http://localhost:3000", "http://192.168.1.235:3000"],
        frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com", "https://www.youtube-nocookie.com", "https://www.dailymotion.com", "https://geo.dailymotion.com"],
      }
    }
  }));
} else {
  app.use(helmet({ contentSecurityPolicy: false }));
}

// Compression gzip
app.use(compression());

// Logs HTTP
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logger.stream }));

// ========== MIDDLEWARES ==========
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
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'])
    : true,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========== RATE LIMITING ==========
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  }
});

const devApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    return !(ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1');
  }
});

app.use('/api/', devApiLimiter);
app.use('/api/', apiLimiter);

// ========== FICHIERS STATIQUES ==========

// Redirection des anciennes fiches tendances vers le nouveau format dynamique
app.get('/fiches/tendances/*', (req, res) => {
  res.redirect('/2026/tendances.html');
});

// Assets partagés
app.use('/assets', express.static(path.join(__dirname, 'frontend/public/assets')));

// Dossier 2026 (nouveau site)
app.use('/2026', express.static(path.join(__dirname, 'frontend/public/2026')));

// Frontend public (legacy)
const frontendPath = path.join(__dirname, 'frontend', 'public');
app.use('/frontend/public', express.static(frontendPath));

// Fiches produits
const fichesPath = path.join(__dirname, 'fiches');
if (fs.existsSync(fichesPath)) {
  app.use('/fiches', express.static(fichesPath));
}

// Favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/assets/images/icons/icon-192x192.png'));
});

// ========== HOMEPAGE 2026 ==========
// IMPORTANT: Ces routes doivent être AVANT express.static pour avoir la priorité

// Racine -> nouveau site 2026
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', '2026', 'index.html'));
});

// Route /2026/ explicite
app.get('/2026/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'public', '2026', 'index.html'));
});

// Raccourcis URLs
app.get('/admin', (req, res) => res.redirect('/2026/admin.html'));
app.get('/wiki', (req, res) => res.redirect('/2026/wiki.html'));
app.get('/produits', (req, res) => res.redirect('/2026/produits.html'));
app.get('/tendances', (req, res) => res.redirect('/2026/tendances.html'));
app.get('/apropos', (req, res) => res.redirect('/2026/apropos.html'));
app.get('/timeline', (req, res) => res.redirect('/2026/timeline.html'));
app.get('/guides', (req, res) => res.redirect('/2026/guides.html'));
app.get('/configurateur', (req, res) => res.redirect('/2026/configurateur.html'));
app.get('/evolution-prix', (req, res) => res.redirect('/2026/evolution-prix.html'));
app.get('/versus', (req, res) => res.redirect('/2026/versus.html'));
app.get('/bons-plans', (req, res) => res.redirect('/2026/bons-plans.html'));
app.get('/nouveautes', (req, res) => res.redirect('/2026/nouveautes.html'));

// Sitemap SEO dynamique (AVANT express.static pour avoir la priorité)
app.use('/sitemap.xml', sitemapRoutes);

// Autres fichiers statiques (APRÈS les routes explicites)
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// ========== ROUTES API ==========
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API HIGH-TECH 2026 fonctionne!',
    version: '2026.1.0',
    timestamp: new Date().toISOString()
  });
});

// ========== ADMIN AUTH ==========
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin2026!';

  if (password === adminPassword) {
    res.json({ success: true, message: 'Authentification reussie' });
  } else {
    res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
  }
});

// Route pour initialiser la colonne image
app.post('/api/init-image-column', async (req, res) => {
  try {
    const checkColumn = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'produits' AND column_name = 'image'
    `);

    if (checkColumn.rows.length === 0) {
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

    res.json({ success: true, fiches: fiches });
  } catch (error) {
    logger.error('❌ Erreur liste fiches:', error);
    res.json({ success: true, fiches: [] });
  }
});

// Routes modulaires
app.use('/api/produits', produitsRoutes);
app.use('/api', fichesRoutes);
app.use('/api/fiche-tendance', fichesTendancesRoutes);
app.use('/api/tendances', tendancesRoutes);
app.use('/api/actualites', tendancesRoutes);
app.use('/api', contentRoutes);
app.use('/api/technologies', technologiesRoutes);
app.use('/api/marche', marcheRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/wiki', wikiRoutes);
app.use('/api/activity-logs', activityLogsRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/guides', guidesRoutes);
app.use('/api/price-evolution', priceEvolutionRoutes);
app.use('/api/price-scraper', priceScraperRoutes);
app.use('/api/nouveautes', nouveautesRoutes);

// Bons plans — baisses de prix détectées via price_history
app.get('/api/bons-plans', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 0;
        const params = days > 0 ? [days] : [];
        const dateCondition = days > 0 ? `AND date_enregistrement >= NOW() - ($1 * INTERVAL '1 day')` : '';

        const result = await pool.query(`
            SELECT
                p.id, p.nom, p.categorie, p.image, p.lien,
                latest.prix_numerique AS prix_actuel,
                latest.prix AS prix_actuel_texte,
                latest.date_enregistrement AS date_actuel,
                prev.prix_numerique AS prix_precedent,
                prev.prix AS prix_precedent_texte,
                ROUND(((prev.prix_numerique - latest.prix_numerique) / prev.prix_numerique * 100)::numeric, 1) AS reduction_pct,
                ROUND((prev.prix_numerique - latest.prix_numerique)::numeric, 2) AS economie
            FROM produits p
            JOIN (
                SELECT DISTINCT ON (produit_id)
                    produit_id, prix_numerique, prix, date_enregistrement
                FROM price_history
                WHERE prix_numerique > 0 ${dateCondition}
                ORDER BY produit_id, date_enregistrement DESC
            ) latest ON latest.produit_id = p.id
            JOIN (
                SELECT produit_id, prix_numerique, prix
                FROM (
                    SELECT produit_id, prix_numerique, prix,
                        ROW_NUMBER() OVER (PARTITION BY produit_id ORDER BY date_enregistrement DESC) AS rn
                    FROM price_history WHERE prix_numerique > 0
                ) ranked WHERE rn = 2
            ) prev ON prev.produit_id = p.id
            WHERE latest.prix_numerique < prev.prix_numerique
              AND p.actif = true
            ORDER BY economie DESC
        `, params);

        res.json({ deals: result.rows });
    } catch (err) {
        console.error('Bons plans error:', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Servir les fiches HTML
app.get('/fiches/:category/:fiche', (req, res) => {
  const { category, fiche } = req.params;
  const filePath = path.join(__dirname, 'fiches', category, fiche);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Fiche non trouvée');
  }
});

// Endpoint pour sauvegarder le rapport d'intégrité
app.post('/api/save-report', (req, res) => {
  try {
    const { filename, content } = req.body;

    if (!filename || !content) {
      return res.status(400).json({
        success: false,
        error: 'filename et content sont requis'
      });
    }

    const reportPath = path.join(__dirname, 'frontend', 'public', 'scripts', 'maintenance', filename);
    fs.writeFileSync(reportPath, content, 'utf8');

    res.json({
      success: true,
      message: `Rapport sauvegardé: ${filename}`,
      path: `/scripts/maintenance/${filename}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ========== GESTION DES ERREURS ==========
app.use(notFoundHandler);
app.use(errorHandler);

// ========== CRON PRIX HEBDOMADAIRE ==========
const cron = require('node-cron');
// Tous les lundis à 3h du matin : scrape les 20 produits les plus importants
cron.schedule('0 3 * * 1', async () => {
  if (!process.env.RAPIDAPI_KEY) return;
  logger.info('⏰ Cron prix : lancement du scrape hebdomadaire...');
  try {
    const axios = require('axios');
    await axios.post(`http://localhost:${port}/api/price-scraper/scrape-all`, { limit: 20 });
    logger.info('✅ Cron prix : terminé');
  } catch (err) {
    logger.error('❌ Cron prix erreur:', err.message);
  }
});

// ========== EXPORT POUR TESTS ==========
module.exports = app;

// ========== DÉMARRAGE ==========
if (require.main === module) app.listen(port, '0.0.0.0', async () => {
  logger.info('═══════════════════════════════════════════════════');
  logger.info('   ⚡ HIGH-TECH 2026 - Serveur Redesign');
  logger.info('═══════════════════════════════════════════════════');

  // Test connexion PostgreSQL
  try {
    const result = await pool.query('SELECT COUNT(*) FROM produits');
    logger.info(`✅ PostgreSQL connecté - ${result.rows[0].count} produits`);
  } catch (err) {
    logger.error('❌ Erreur PostgreSQL:', err.message);
  }

  // Vérifier les images
  const testImagePath = path.join(assetsPath, 'images');
  if (fs.existsSync(testImagePath)) {
    logger.info('✅ Dossier images accessible');
  } else {
    logger.warn('⚠️ Dossier images introuvable');
  }

  logger.info(`🚀 Serveur démarré sur http://localhost:${port}`);
  logger.info(`📄 Homepage: /2026/index.html`);
  logger.info('═══════════════════════════════════════════════════');
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  logger.info('🛑 Arrêt du serveur...');
  await pool.end();
  process.exit(0);
});
