// server-postgres-images.js - Serveur avec gestion d'images et fichiers locaux
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Configuration PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

// Configuration des dossiers de fiches produits
const FICHES_FOLDERS = [
  'fiches',           // Dossier principal
  'fiches/drone',
  'fiches/console',
  'fiches/tablette',
  'fiches/smartphone',
  'fiches/pc-gaming',
  'fiches/serveur',
  'fiches/casque-audio',
  'fiches/montre-connecte',
  'fiches/ecran-tv',
  'fiches/camera',
  'fiches/video-projecteur',
  'fiches/box-internet',
  'fiches/casque-vr',
  'fiches/imprimante-3d',
  'fiches/peripheriques',
  'fiches/tableau-interactif',
];

// Configuration Multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'public/uploads';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Erreur création dossier:', err);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite à 10MB
  },
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

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('public/uploads'));
app.use(express.static('public'));

// Servir les fichiers de fiches depuis plusieurs dossiers
FICHES_FOLDERS.forEach(folder => {
  app.use(`/${folder}`, express.static(folder));
});

// ========== ROUTES API ==========

// GET - Liste des fichiers HTML disponibles
app.get('/api/fiches-list', async (req, res) => {
  try {
    console.log('📁 Recherche des fichiers HTML...');
    const allFiles = [];
    
    for (const folder of FICHES_FOLDERS) {
      try {
        const files = await fs.readdir(folder);
        const htmlFiles = files.filter(f => f.endsWith('.html') || f.endsWith('.htm'));
        
        for (const file of htmlFiles) {
          allFiles.push({
            name: file,
            path: `${folder}/${file}`,
            folder: folder,
            url: `/${folder}/${file}`
          });
        }
      } catch (err) {
        // Le dossier n'existe peut-être pas
        console.log(`⚠️ Dossier ${folder} non trouvé`);
      }
    }
    
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
    
    // Retourner le chemin de l'image
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      url: imageUrl,
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

// POST - Upload Base64 (pour stocker directement dans la BDD)
app.post('/api/upload-base64', async (req, res) => {
  try {
    const { image, filename } = req.body;
    
    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'Aucune image fournie'
      });
    }
    
    // Extraire le type MIME et les données
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'Format d\'image invalide'
      });
    }
    
    const imageBuffer = Buffer.from(matches[2], 'base64');
    const mimeType = matches[1];
    
    // Générer un nom de fichier unique
    const uniqueFilename = Date.now() + '-' + (filename || 'image.jpg');
    const uploadPath = path.join('public', 'uploads', uniqueFilename);
    
    // Sauvegarder le fichier
    await fs.writeFile(uploadPath, imageBuffer);
    
    console.log(`📸 Image Base64 sauvegardée: ${uniqueFilename}`);
    
    res.json({
      success: true,
      url: `/uploads/${uniqueFilename}`,
      filename: uniqueFilename,
      size: imageBuffer.length,
      mimeType: mimeType
    });
    
  } catch (error) {
    console.error('❌ Erreur upload Base64:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer tous les produits
app.get('/api/produits', async (req, res) => {
  try {
    console.log('📊 GET /api/produits - Récupération des produits...');
    
    const result = await pool.query(`
      SELECT 
        id, nom, categorie, description, image, image_data, lien, 
        top_du_mois, prix, fonctionnalites_avancees, donnees_fiche
      FROM produits 
      ORDER BY categorie, nom
    `);
    
    // Traiter les images pour chaque produit
    const productsWithImages = result.rows.map(product => {
      if (product.image_data) {
        // Si on a une image en base64 dans la BDD
        product.image_url = product.image_data;
      } else if (product.image) {
        // Si on a un chemin d'image
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
    console.log(`🔍 GET /api/produits/${id} - Recherche du produit...`);
    
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
    
    // Gérer l'image
    if (product.image_data) {
      product.image_url = product.image_data;
    } else if (product.image) {
      product.image_url = product.image;
    }
    
    console.log(`✅ Produit ${id} trouvé`);
    
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
    
    console.log(`➕ POST /api/produits - Création d'un nouveau produit: ${nom}`);
    
    // Validation basique
    if (!nom) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du produit est obligatoire'
      });
    }
    
    // Vérifier d'abord si la colonne image_data existe
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'produits' AND column_name = 'image_data'
    `);
    
    let query, params;
    
    if (columnCheck.rows.length > 0) {
      // La colonne existe, on peut l'utiliser
      query = `
        INSERT INTO produits 
        (nom, categorie, description, image, image_data, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      params = [
        nom, 
        categorie || null, 
        description || null, 
        image || null,
        image_data || null,
        lien || null,
        top_du_mois || false, 
        prix || null, 
        fonctionnalites_avancees || [], 
        donnees_fiche || []
      ];
    } else {
      // La colonne n'existe pas, on utilise seulement 'image'
      query = `
        INSERT INTO produits 
        (nom, categorie, description, image, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      params = [
        nom, 
        categorie || null, 
        description || null, 
        image || image_data || null, // Utiliser image_data dans le champ image si pas de colonne dédiée
        lien || null,
        top_du_mois || false, 
        prix || null, 
        fonctionnalites_avancees || [], 
        donnees_fiche || []
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
    
    console.log(`✏️ PUT /api/produits/${id} - Mise à jour du produit...`);
    
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
      // La colonne existe
      query = `
        UPDATE produits 
        SET 
          nom = $1, 
          categorie = $2, 
          description = $3, 
          image = $4,
          image_data = $5,
          lien = $6,
          top_du_mois = $7, 
          prix = $8, 
          fonctionnalites_avancees = $9,
          donnees_fiche = $10
        WHERE id = $11
        RETURNING *
      `;
      params = [
        nom, 
        categorie || null, 
        description || null, 
        image || null,
        image_data || null,
        lien || null,
        top_du_mois || false, 
        prix || null, 
        fonctionnalites_avancees || [], 
        donnees_fiche || [],
        id
      ];
    } else {
      // La colonne n'existe pas
      query = `
        UPDATE produits 
        SET 
          nom = $1, 
          categorie = $2, 
          description = $3, 
          image = $4,
          lien = $5,
          top_du_mois = $6, 
          prix = $7, 
          fonctionnalites_avancees = $8,
          donnees_fiche = $9
        WHERE id = $10
        RETURNING *
      `;
      params = [
        nom, 
        categorie || null, 
        description || null, 
        image || image_data || null,
        lien || null,
        top_du_mois || false, 
        prix || null, 
        fonctionnalites_avancees || [], 
        donnees_fiche || [],
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
    console.log(`🗑️ DELETE /api/produits/${id} - Suppression du produit...`);
    
    // Récupérer d'abord l'image pour la supprimer du serveur
    const productResult = await pool.query(
      'SELECT image FROM produits WHERE id = $1',
      [id]
    );
    
    if (productResult.rows.length > 0 && productResult.rows[0].image) {
      const imagePath = productResult.rows[0].image;
      if (imagePath && imagePath.startsWith('/uploads/')) {
        const fullPath = path.join('public', imagePath);
        try {
          await fs.unlink(fullPath);
          console.log(`🗑️ Image supprimée: ${imagePath}`);
        } catch (err) {
          console.log(`⚠️ Impossible de supprimer l'image: ${err.message}`);
        }
      }
    }
    
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
    console.log('📈 GET /api/stats - Calcul des statistiques...');
    
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT id) AS total_products,
        COUNT(DISTINCT categorie) AS total_categories,
        COUNT(*) FILTER (WHERE top_du_mois = TRUE) AS featured_products
      FROM produits
    `);
    
    console.log('✅ Statistiques calculées');
    
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
    
    // Vérifier si la colonne existe
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'produits' AND column_name = 'image_data'
    `);
    
    if (columnCheck.rows.length === 0) {
      // Créer la colonne
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
    message: 'API PostgreSQL avec gestion d\'images fonctionne!',
    timestamp: new Date().toISOString()
  });
});

// Servir l'interface admin
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ========== DÉMARRAGE DU SERVEUR ==========

app.listen(port, async () => {
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🚀 SERVEUR AVEC GESTION D\'IMAGES        ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 API: http://localhost:${port}/api`);
  console.log(`🖥️  Interface: http://localhost:${port}`);
  console.log('');
  
  // Créer le dossier uploads s'il n'existe pas
  try {
    await fs.mkdir('public/uploads', { recursive: true });
    console.log('✅ Dossier uploads créé/vérifié');
  } catch (err) {
    console.error('❌ Erreur dossier uploads:', err);
  }
  
  // Test connexion PostgreSQL
  try {
    const result = await pool.query('SELECT COUNT(*) FROM produits');
    console.log(`✅ PostgreSQL connecté`);
    console.log(`📦 ${result.rows[0].count} produits dans la base`);
  } catch (err) {
    console.error('❌ Erreur PostgreSQL:', err.message);
  }
  
  console.log('');
});