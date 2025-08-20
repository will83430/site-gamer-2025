// server.js - Serveur PostgreSQL + gestion statique pour /assets
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Middleware CORS
app.use(cors());

// Ajoute ces lignes dans ton serveur pour débugger les images

// APRÈS app.use(cors()); et AVANT les autres routes

// Debug : Logger toutes les requêtes d'images
app.use((req, res, next) => {
    if (req.path.includes('.png') || req.path.includes('.jpg') || req.path.includes('.jpeg')) {
        console.log('🖼️ Requête image:', req.path);
        
        // Chercher l'image dans plusieurs endroits
        const possiblePaths = [
            path.join(__dirname, 'assets', 'images', path.basename(req.path)),
            path.join(__dirname, 'frontend', 'public', 'assets', 'images', path.basename(req.path)),
            path.join(__dirname, 'public', 'assets', 'images', path.basename(req.path)),
        ];
        
        console.log('📁 Recherche dans:');
        for (const p of possiblePaths) {
            const exists = require('fs').existsSync(p);
            console.log(`   ${exists ? '✅' : '❌'} ${p}`);
            
            if (exists && req.path.includes('/assets/images/')) {
                // Servir directement l'image si trouvée
                return res.sendFile(p);
            }
        }
    }
    next();
});

// Route pour servir les images depuis assets/images avec ou sans le /
app.get(['/assets/images/:filename', '/fiches/*/assets/images/:filename'], (req, res) => {
    const filename = req.params.filename;
    console.log('🎯 Demande image:', filename);
    
    // Chemins possibles où chercher l'image
    const possiblePaths = [
        path.join(__dirname, 'frontend', 'public', 'assets', 'images', filename),
        path.join(__dirname, 'assets', 'images', filename),
        path.join(__dirname, 'public', 'assets', 'images', filename),
    ];
    
    // Chercher l'image dans les différents emplacements
    for (const imagePath of possiblePaths) {
        if (fs.existsSync(imagePath)) {
            console.log('✅ Image trouvée et servie depuis:', imagePath);
            return res.sendFile(imagePath);
        }
    }
    
    console.log('❌ Image non trouvée:', filename);
    console.log('   Chemins testés:', possiblePaths);
    
    // Si pas trouvée, essayer de servir un placeholder
    const placeholderPath = path.join(__dirname, 'frontend', 'public', 'assets', 'images', 'placeholder.png');
    if (fs.existsSync(placeholderPath)) {
        console.log('📦 Envoi du placeholder à la place');
        return res.sendFile(placeholderPath);
    }
    
    res.status(404).send('Image non trouvée');
});

// Redirection automatique des chemins relatifs vers absolus
app.use((req, res, next) => {
    // Si la requête vient d'un sous-dossier de fiches et cherche assets/
    if (req.path.includes('/fiches/') && req.path.includes('/assets/')) {
        // Extraire le nom du fichier
        const match = req.path.match(/assets\/images\/(.+)/);
        if (match) {
            const newPath = `/assets/images/${match[1]}`;
            console.log(`🔄 Redirection: ${req.path} → ${newPath}`);
            return res.redirect(newPath);
        }
    }
    next();
});

// Middleware JSON
app.use(express.json());

// Sert tout ce qui est dans frontend/public/assets à l'URL /assets
app.use('/assets', express.static(path.join(__dirname, 'frontend', 'public', 'assets')));
console.log('📂 Express sert /assets depuis :', path.join(__dirname, 'frontend', 'public', 'assets'));



// Configuration PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

// Configuration des dossiers
const PROJECT_ROOT = __dirname;
const STATIC_FOLDERS = {
  frontend: path.join(PROJECT_ROOT, 'frontend'),
  frontendPublic: path.join(PROJECT_ROOT, 'frontend', 'public'),
  assets: path.join(PROJECT_ROOT, 'frontend', 'public', 'assets'),
  fiches: path.join(PROJECT_ROOT, 'fiches'),
  data: path.join(PROJECT_ROOT, 'data'),
  public: path.join(PROJECT_ROOT, 'public'),
  uploads: path.join(PROJECT_ROOT, 'public', 'uploads')
};

// Créer les dossiers s'ils n'existent pas
async function createFolders() {
  for (const [name, folderPath] of Object.entries(STATIC_FOLDERS)) {
    try {
      await fs.mkdir(folderPath, { recursive: true });
      console.log(`✅ Dossier ${name} vérifié: ${folderPath}`);
    } catch (err) {
      console.log(`⚠️ Erreur dossier ${name}:`, err.message);
    }
  }
}

// Configuration Multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, STATIC_FOLDERS.uploads);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// ========== MIDDLEWARE ==========

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ========== SERVIR LES FICHIERS STATIQUES ==========

// 1. Frontend/public et ses sous-dossiers - PRIORITÉ HAUTE
app.use('/frontend/public', express.static(STATIC_FOLDERS.frontendPublic));
app.use('/frontend', express.static(STATIC_FOLDERS.frontend));

// 2. Assets (CSS, JS, images) - pour compatibilité
app.use('/assets', express.static(STATIC_FOLDERS.assets));

// 3. Fiches HTML et leurs sous-dossiers → SERVIES SANS PRÉFIXE
app.use(express.static(STATIC_FOLDERS.fiches));

// 4. Data (JSON, etc.)
app.use('/data', express.static(STATIC_FOLDERS.data));

// 5. Uploads
app.use('/uploads', express.static(STATIC_FOLDERS.uploads));

// 6. Public (autres fichiers)
app.use(express.static(STATIC_FOLDERS.public));

// 7. Racine du projet (pour les fichiers HTML à la racine)
app.use(express.static(PROJECT_ROOT));

// Logger les requêtes de fichiers statiques pour debug
app.use((req, res, next) => {
  if (req.path.includes('.css') || req.path.includes('.js') || req.path.includes('.png') || req.path.includes('.jpg')) {
    console.log(`📁 Requête fichier: ${req.path}`);
  }
  next();
});

// ========== ROUTES API ==========

// GET - Liste des fichiers HTML disponibles
app.get('/api/fiches-list', async (req, res) => {
  try {
    console.log('📁 Recherche des fichiers HTML...');
    const allFiles = [];
    
    // Parcourir récursivement le dossier fiches
    async function scanDir(dir, baseDir = '') {
      try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = await fs.stat(fullPath);
          
          if (stat.isDirectory()) {
            // Récursif pour les sous-dossiers
            await scanDir(fullPath, path.join(baseDir, file));
          } else if (file.endsWith('.html') || file.endsWith('.htm')) {
            const relativePath = path.join(baseDir, file);
            allFiles.push({
              name: file,
              path: `fiches/${relativePath}`,
              folder: baseDir || 'fiches',
              url: `/fiches/${relativePath}`
            });
          }
        }
      } catch (err) {
        console.log(`⚠️ Erreur scan ${dir}:`, err.message);
      }
    }
    
    await scanDir(STATIC_FOLDERS.fiches);
    
    console.log(`✅ ${allFiles.length} fichiers HTML trouvés`);
    
    res.json({
      success: true,
      files: allFiles,
      count: allFiles.length
    });
    
  } catch (error) {
    console.error('❌ Erreur liste fiches:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Upload d'image
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucune image fournie'
      });
    }
    
    console.log(`📸 Image uploadée: ${req.file.filename}`);
    
    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
    
  } catch (error) {
    console.error('❌ Erreur upload:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer tous les produits
app.get('/api/produits', async (req, res) => {
  try {
    console.log('📊 GET /api/produits');
    
    const result = await pool.query(`
      SELECT 
        id, nom, categorie, description, image, image_data, lien, 
        top_du_mois, prix, fonctionnalites_avancees, donnees_fiche
      FROM produits 
      ORDER BY categorie, nom
    `);
    
    // Traiter les images
    const productsWithImages = result.rows.map(product => {
      if (product.image_data) {
        product.image_url = product.image_data;
      } else if (product.image) {
        product.image_url = product.image;
      }
      return product;
    });
    
    console.log(`✅ ${result.rows.length} produits récupérés`);
    
    res.json({
      success: true,
      data: productsWithImages,
      total: result.rows.length
    });
    
  } catch (error) {
    console.error('❌ Erreur GET produits:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer un produit par ID
app.get('/api/produits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/produits/${id}`);
    
    const result = await pool.query(
      'SELECT * FROM produits WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    const product = result.rows[0];
    if (product.image_data) {
      product.image_url = product.image_data;
    } else if (product.image) {
      product.image_url = product.image;
    }
    
    res.json({
      success: true,
      data: product
    });
    
  } catch (error) {
    console.error('❌ Erreur GET produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Créer un nouveau produit
app.post('/api/produits', async (req, res) => {
  try {
    const { 
      nom, categorie, description, image, image_data, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche 
    } = req.body;
    
    console.log(`➕ POST /api/produits - Création: ${nom}`);
    
    if (!nom) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du produit est obligatoire'
      });
    }
    
    // Vérifier si la colonne image_data existe
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'produits' AND column_name = 'image_data'
    `);
    
    let query, params;
    
    if (columnCheck.rows.length > 0) {
      query = `
        INSERT INTO produits 
        (nom, categorie, description, image, image_data, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      params = [
        nom, categorie || null, description || null, 
        image || null, image_data || null, lien || null,
        top_du_mois || false, prix || null, 
        fonctionnalites_avancees || [], donnees_fiche || []
      ];
    } else {
      query = `
        INSERT INTO produits 
        (nom, categorie, description, image, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      params = [
        nom, categorie || null, description || null, 
        image || image_data || null, lien || null,
        top_du_mois || false, prix || null, 
        fonctionnalites_avancees || [], donnees_fiche || []
      ];
    }
    
    const result = await pool.query(query, params);
    
    console.log(`✅ Produit créé avec l'ID ${result.rows[0].id}`);
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Produit créé avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur POST produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT - Mettre à jour un produit
app.put('/api/produits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nom, categorie, description, image, image_data, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche 
    } = req.body;
    
    console.log(`✏️ PUT /api/produits/${id}`);
    
    // Vérifier si le produit existe
    const checkResult = await pool.query(
      'SELECT id FROM produits WHERE id = $1',
      [id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    // Vérifier si la colonne image_data existe
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'produits' AND column_name = 'image_data'
    `);
    
    let query, params;
    
    if (columnCheck.rows.length > 0) {
      query = `
        UPDATE produits 
        SET nom = $1, categorie = $2, description = $3, image = $4,
            image_data = $5, lien = $6, top_du_mois = $7, prix = $8, 
            fonctionnalites_avancees = $9, donnees_fiche = $10
        WHERE id = $11
        RETURNING *
      `;
      params = [
        nom, categorie || null, description || null, 
        image || null, image_data || null, lien || null,
        top_du_mois || false, prix || null, 
        fonctionnalites_avancees || [], donnees_fiche || [],
        id
      ];
    } else {
      query = `
        UPDATE produits 
        SET nom = $1, categorie = $2, description = $3, image = $4,
            lien = $5, top_du_mois = $6, prix = $7, 
            fonctionnalites_avancees = $8, donnees_fiche = $9
        WHERE id = $10
        RETURNING *
      `;
      params = [
        nom, categorie || null, description || null, 
        image || image_data || null, lien || null,
        top_du_mois || false, prix || null, 
        fonctionnalites_avancees || [], donnees_fiche || [],
        id
      ];
    }
    
    const result = await pool.query(query, params);
    
    console.log(`✅ Produit ${id} mis à jour`);
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Produit mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('❌ Erreur PUT produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE - Supprimer un produit
app.delete('/api/produits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/produits/${id}`);
    
    const result = await pool.query(
      'DELETE FROM produits WHERE id = $1 RETURNING nom',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    
    console.log(`✅ Produit "${result.rows[0].nom}" supprimé`);
    
    res.json({
      success: true,
      message: `Produit "${result.rows[0].nom}" supprimé avec succès`
    });
    
  } catch (error) {
    console.error('❌ Erreur DELETE produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Statistiques
app.get('/api/stats', async (req, res) => {
  try {
    console.log('📈 GET /api/stats');
    
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT id) AS total_products,
        COUNT(DISTINCT categorie) AS total_categories,
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

// POST - Créer la colonne image_data si elle n'existe pas
app.post('/api/init-image-column', async (req, res) => {
  try {
    console.log('🔧 Vérification de la colonne image_data...');
    
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'produits' AND column_name = 'image_data'
    `);
    
    if (columnCheck.rows.length === 0) {
      await pool.query(`
        ALTER TABLE produits 
        ADD COLUMN IF NOT EXISTS image_data TEXT
      `);
      
      console.log('✅ Colonne image_data créée');
      
      res.json({
        success: true,
        message: 'Colonne image_data créée avec succès'
      });
    } else {
      res.json({
        success: true,
        message: 'Colonne image_data existe déjà'
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur création colonne:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API PostgreSQL fonctionne!',
    timestamp: new Date().toISOString(),
    folders: STATIC_FOLDERS
  });
});

// Route 404 pour debug
app.use((req, res) => {
  console.log(`❌ 404 - Route non trouvée: ${req.method} ${req.path}`);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head><title>404</title></head>
    <body>
      <h1>404 - Fichier non trouvé</h1>
      <p>Chemin demandé: ${req.path}</p>
      <p>Vérifiez que le fichier existe dans le bon dossier.</p>
      <hr>
      <p>Dossiers configurés:</p>
      <ul>
        ${Object.entries(STATIC_FOLDERS).map(([name, path]) => 
          `<li><strong>${name}:</strong> ${path}</li>`
        ).join('')}
      </ul>
    </body>
    </html>
  `);
});

// ========== DÉMARRAGE DU SERVEUR ==========

app.listen(port, async () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🚀 SERVEUR POSTGRESQL COMPLET DÉMARRÉ    ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 API: http://localhost:${port}/api`);
  console.log(`🖥️  Site: http://localhost:${port}`);
  console.log('');
  
  // Créer les dossiers nécessaires
  await createFolders();
  
  // Test connexion PostgreSQL
  try {
    const result = await pool.query('SELECT COUNT(*) FROM produits');
    console.log(`✅ PostgreSQL connecté`);
    console.log(`📦 ${result.rows[0].count} produits dans la base`);
  } catch (err) {
    console.error('❌ Erreur PostgreSQL:', err.message);
  }
  
  console.log('');
  console.log('📁 Structure attendue:');
  console.log('   projet/');
  console.log('   ├── assets/');
  console.log('   │   ├── css/');
  console.log('   │   ├── js/');
  console.log('   │   └── images/');
  console.log('   ├── fiches/');
  console.log('   │   └── [catégories]/[produits].html');
  console.log('   ├── data/');
  console.log('   ├── public/');
  console.log('   │   └── uploads/');
  console.log('   └── server.js');
  console.log('');
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n👋 Arrêt du serveur...');
  await pool.end();
  process.exit(0);
});