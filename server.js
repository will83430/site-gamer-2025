// server-fixed.js - Version corrigée du serveur
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // IMPORTANT !
const compression = require('compression'); // 🔥 AJOUTE CETTE LIGNE
const assetsPath = path.join(__dirname, 'frontend/public/assets');

const app = express();
// Allow overriding the port via environment variable to avoid EADDRINUSE conflicts
const port = process.env.PORT || 3000;

app.use(compression()); // Compression gzip

// Configuration PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gamer_2025',
  password: 'Wilfried!1985',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 2000,
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

// GET - Récupérer tous les produits
app.get('/api/produits', async (req, res) => {
  try {
    const { categorie } = req.query;
    
    let query = `
      SELECT 
        id, nom, categorie, description, image, lien, 
        top_du_mois, prix, fonctionnalites_avancees, donnees_fiche, titre_affiche
      FROM produits 
    `;
    let params = [];
    
    if (categorie) {
      query += ` WHERE categorie = $1`;
      params.push(categorie);
    }
    
    query += ` ORDER BY categorie, nom`;
    
    const result = await pool.query(query, params);
    console.log(`✅ Produits récupérés: ${result.rows.length}`);

    // Traiter les images pour ajouter image_url
    const productsWithImages = result.rows.map(product => {
      if (product.image) {
        product.image_url = `/assets/images/${product.image}`;
      } else {
        product.image_url = '/assets/images/placeholder.png';
      }
      return product;
    });
    
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
    const result = await pool.query(`
      SELECT 
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p 
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    const product = result.rows[0];

    // Correction du chemin de l'image
    if (product.image) {
      // Supprime assets/images/ s'il existe déjà dans le chemin
      const cleanImage = product.image.replace(/^assets\/images\//, '');
      product.image_url = `/assets/images/${cleanImage}`;
    } else {
      product.image_url = '/assets/images/placeholder.png';
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

// POST - Créer un nouveau produit avec ID auto-généré
app.post('/api/produits', async (req, res) => {
  try {
    const {
      nom, categorie, description, image, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche,
      titre_affiche // <-- Ajout ici
    } = req.body;
    if (!nom) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du produit est obligatoire'
      });
    }

    // Générer un nouvel ID automatiquement
    const maxIdResult = await pool.query(`
      SELECT COALESCE(
        MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 
        45
      ) + 1 as next_id 
      FROM produits 
      WHERE id LIKE 'prod_%'
    `);

    const nextId = `prod_${maxIdResult.rows[0].next_id}`;

    // Juste avant const params = [...]
    const titreAfficheFinal = titre_affiche && titre_affiche.trim() !== ''
        ? titre_affiche 
        : slugToTitreAffiche(nom);

    const params = [
      nextId,
      nom, categorie || null, description || null,
      image || null,
      lien || null,
      top_du_mois || false, prix || null,
      fonctionnalites_avancees || [], donnees_fiche || [],
      titreAfficheFinal
    ];

    const query = `
      INSERT INTO produits 
      (id, nom, categorie, description, image, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche, titre_affiche)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, params);
    console.log(result.rows[0]); // Ajoute cette ligne juste après le SELECT

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: `Produit créé avec l'ID ${nextId}`
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
      nom, categorie, description, image, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche,
      titre_affiche
    } = req.body;

    // Simplification de la requête UPDATE
    const query = `
      UPDATE produits 
      SET nom = $1, 
          categorie = $2, 
          description = $3, 
          image = $4,        /* Une seule fois */
          lien = $5, 
          top_du_mois = $6, 
          prix = $7, 
          fonctionnalites_avancees = $8, 
          donnees_fiche = $9,
          titre_affiche = $10
      WHERE id = $11
      RETURNING *
    `;

    const params = [
      nom, 
      categorie || null, 
      description || null,
      image || null,       /* Une seule fois */
      lien || null,
      top_du_mois || false, 
      prix || null,
      fonctionnalites_avancees || [], 
        donnees_fiche || [],
        titre_affiche || null,
        id
    ];

    const result = await pool.query(query, params);
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

// Route pour générer une fiche HTML
app.post('/api/generate-fiche/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Récupérer le produit depuis PostgreSQL
    const result = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }

    const product = result.rows[0];

    // Avant de générer le HTML
    console.log('Données produit pour génération fiche:', {
      id: product.id,
      nom: product.nom,
      titre_affiche: product.titre_affiche
    });

    // Générer le HTML avec votre template
    const html = generateFicheHTML(product);

    // Créer le dossier de catégorie
    const categoryFolder = product.categorie.toLowerCase().replace(/\s+/g, '-');
    const ficheDir = path.join(__dirname, 'fiches', categoryFolder);

    if (!fs.existsSync(ficheDir)) {
      fs.mkdirSync(ficheDir, { recursive: true });
    }

    // Créer le fichier HTML
    const fileName = `${product.nom.replace(/[^a-z0-9]/gi, '-')}.html`;
    const filePath = path.join(ficheDir, fileName);

    fs.writeFileSync(filePath, html);

    res.json({
      success: true,
      message: `Fiche générée avec succès`,
      path: `fiches/${categoryFolder}/${fileName}`
    });

  } catch (error) {
    console.error('❌ Erreur génération fiche:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fonction de génération du template HTML
function generateFicheHTML(product) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${product.titre_affiche || product.nom} - Fiche Produit</title>
    <link rel="stylesheet" href="/assets/css/styles.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope&family=Montserrat&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      /* Style du bouton Retour - sans fond, sans effet hover */
      .nav-back {
        background: transparent;
        border: none;
        padding: 8px 0;
        font-weight: 600;
        color: #333;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
      }
    </style>
</head>
<body>
    <div class="entete">
    <img src="../../frontend/public/assets/images/gaming.png" alt="Gaming">
    <a class="nav-back" href="javascript:history.back()">← Retour</a>
</div>

    <h1 class="product-title">${product.titre_affiche || product.nom}</h1>
    <div id="badge-top-mois"></div>
    <p class="description">Chargement de la description...</p>

    <div class="gallery">
<img src="/assets/images/${product.image || 'placeholder.png'}" alt="${product.nom}" class="img-centree" onerror="this.src='/assets/images/placeholder.png'"></div>
    
    <div class="lightbox" id="lightbox">
        <img id="lightbox-img" src="" alt="Zoom">
    </div>

    <div id="product-content">
        <p style="text-align: center; color: #666;">
            <span style="display: inline-block; width: 20px; height: 20px; border: 3px solid #ddd; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></span>
            Chargement des données...
        </p>
    </div>

    <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>

    <footer class="footer">
    <img src="/assets/images/banniere-pied.png" alt="Bannière" class="footer-banner">
    <div class="footer-links">
        <div class="footer-item">
            <img src="/assets/images/logo-blanc.png" alt="Accueil" class="footer-icon">
            <a href="/index.html">Accueil</a>
        </div>
        <div class="footer-item">
            <img src="/assets/images/logo-dokk-blanc.png" alt="Multibloc" class="footer-icon">
            <a href="/top-du-mois.html">Vitrine</a>
        </div>
    </div>
</footer>

    <script src="/assets/js/utils.js"></script>
    <script src="/assets/js/fiche-produit.min.js"></script>
</body>
</html>`;
}

// Supprimer la fiche HTML locale d'un produit
app.delete('/api/fiches/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Récupérer le chemin du fichier depuis la BDD
        const { rows } = await pool.query('SELECT lien FROM produits WHERE id = $1', [id]);
        if (!rows.length) return res.status(404).json({ success: false, error: 'Produit non trouvé' });

        const fichePath = rows[0].lien; // ex: fiches/drone/mon-produit.html
        if (!fichePath) return res.json({ success: true, message: 'Pas de fiche à supprimer' });

        // Chemin absolu correct :
        const absolutePath = path.join(__dirname, fichePath);

        // Supprimer le fichier s'il existe
        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            return res.json({ success: true, message: 'Fiche supprimée' });
        } else {
            return res.json({ success: true, message: 'Fiche non trouvée' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Erreur suppression fiche' });
    }
});

// Route pour prévisualiser une fiche générée - VERSION AMÉLIORÉE
app.get('/api/preview-fiche/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        console.log('🔍 Preview fiche pour ID:', productId);
        
        // Récupérer les infos du produit
        const result = await pool.query('SELECT * FROM produits WHERE id = $1', [productId]);
        
        if (result.rows.length === 0) {
            console.log('❌ Produit non trouvé pour ID:', productId);
            return res.json({ success: false, error: 'Produit non trouvé' });
        }
        
        const product = result.rows[0];
        console.log('📦 Produit trouvé:', product.nom);
        
        if (!product.lien) {
            console.log('❌ Aucun lien de fiche pour:', product.nom);
            return res.json({ success: false, error: 'Aucun lien de fiche défini pour ce produit' });
        }
        
        // Nettoyer le chemin
        let cleanPath = product.lien;
        if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }
        
        const fichePath = path.join(__dirname, 'public', cleanPath);
        console.log('📁 Chemin fichier:', fichePath);
        
        // Vérifier si le fichier existe
        if (fs.existsSync(fichePath)) {
            console.log('✅ Fichier trouvé, lecture...');
            const html = fs.readFileSync(fichePath, 'utf8');
            res.json({ success: true, html: html });
        } else {
            console.log('❌ Fichier non trouvé:', fichePath);
            
            // Essayer quelques variantes de chemin
            const alternatives = [
                path.join(__dirname, 'public', 'fiches', path.basename(cleanPath)),
                path.join(__dirname, 'fiches', cleanPath),
                path.join(__dirname, cleanPath)
            ];
            
            let found = false;
            for (const alt of alternatives) {
                if (fs.existsSync(alt)) {
                    console.log('✅ Fichier trouvé dans:', alt);
                    const html = fs.readFileSync(alt, 'utf8');
                    return res.json({ success: true, html: html });
                }
            }
            
            res.json({ 
                success: false, 
                error: `Fichier de fiche non trouvé: ${product.lien}. Vérifiez que le fichier existe.` 
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur preview fiche:', error);
        res.json({ success: false, error: error.message });
    }
});

// Helper pour récupérer l'id catégorie
async function getCategoryId(nom) {
  console.log(`[LOG] Recherche de l'id pour la catégorie : ${nom}`);
  const { rows } = await pool.query('SELECT id FROM categories WHERE nom = $1', [nom]);
  if (rows.length === 0) {
    console.warn(`[WARN] Catégorie non trouvée : ${nom}`);
  }
  return rows[0]?.id;
}

// ================== API TENDANCES (CRUD) ==================

// GET tendances par catégorie (ex: /api/tendances/serveur)
app.get('/api/tendances/:categorie', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
    if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const { rows } = await pool.query(
      'SELECT * FROM actualites WHERE categorie_id = $1 ORDER BY date_publication DESC', [catId]
    );
    // Pour compatibilité front : transformer tags string -> array si besoin
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// POST ajouter une tendance
app.post('/api/tendances', async (req, res) => {
  try {
    const { titre, description, image, date_publication, tags, categorie } = req.body;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [categorie.toLowerCase()]);
    if (!catRows.length) return res.status(400).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const result = await pool.query(
      `INSERT INTO actualites (titre, description, image, date_publication, tags, categorie_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, catId]
    );
    res.json({ success: true, tendance: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout tendance' });
  }
});

// PUT modifier une tendance
app.put('/api/tendances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, image, date_publication, tags } = req.body;
    await pool.query(
      `UPDATE actualites SET titre=$1, description=$2, image=$3, date_publication=$4, tags=$5 WHERE id=$6`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification tendance' });
  }
});

// DELETE supprimer une tendance
app.delete('/api/tendances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM actualites WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression tendance' });
  }
});

// ================== ROUTES SECTIONNÉES POUR AFFICHAGE DYNAMIQUE (FRONT) ==================
// Actualités
app.get('/api/:categorie/actualites', async (req, res) => {
  const cat = req.params.categorie;
  const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
  if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
  const catId = catRows[0].id;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM actualites WHERE categorie_id = $1 ORDER BY date_publication DESC', [catId]
    );
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
// Technologies
app.get('/api/:categorie/technologies', async (req, res) => {
  const cat = req.params.categorie;
  const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
  if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
  const catId = catRows[0].id;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM technologies WHERE categorie_id = $1', [catId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
// Marché
app.get('/api/:categorie/marche', async (req, res) => {
  const cat = req.params.categorie;
  const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
  if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
  const catId = catRows[0].id;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM marche WHERE categorie_id = $1', [catId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
// Insights
app.get('/api/:categorie/insights', async (req, res) => {
  const cat = req.params.categorie;
  const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
  if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
  const catId = catRows[0].id;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM insights WHERE categorie_id = $1', [catId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
// Prédictions
app.get('/api/:categorie/predictions', async (req, res) => {
  const cat = req.params.categorie;
  const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
  if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
  const catId = catRows[0].id;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM predictions WHERE categorie_id = $1 ORDER BY annee', [catId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// ========== ROUTES GÉNÉRIQUES - DOIVENT ÊTRE À LA TOUTE FIN ==========

// Servir les fiches HTML générées dynamiquement
app.get('/fiches/:category/:fiche', (req, res) => {
  const { category, fiche } = req.params;
  const filePath = path.join(__dirname, 'fiches', category, fiche);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Fiche non trouvée');
  }
});

// ================== API TECHNOLOGIES (CRUD) ==================
app.get('/api/technologies/:categorie', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
    if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const { rows } = await pool.query('SELECT * FROM technologies WHERE categorie_id = $1', [catId]);
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
app.post('/api/technologies', async (req, res) => {
  try {
    const { titre, description, image, date_publication, tags, categorie } = req.body;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [categorie.toLowerCase()]);
    if (!catRows.length) return res.status(400).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const result = await pool.query(
      `INSERT INTO technologies (titre, description, image, date_publication, tags, categorie_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, catId]
    );
    res.json({ success: true, tendance: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout technologie' });
  }
});
app.put('/api/technologies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, image, date_publication, tags } = req.body;
    await pool.query(
      `UPDATE technologies SET titre=$1, description=$2, image=$3, date_publication=$4, tags=$5 WHERE id=$6`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification technologie' });
  }
});
app.delete('/api/technologies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM technologies WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression technologie' });
  }
});

// ================== API MARCHE (CRUD) ==================
app.get('/api/marche/:categorie', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
    if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const { rows } = await pool.query('SELECT * FROM marche WHERE categorie_id = $1', [catId]);
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
app.post('/api/marche', async (req, res) => {
  try {
    const { titre, description, image, date_publication, tags, categorie } = req.body;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [categorie.toLowerCase()]);
    if (!catRows.length) return res.status(400).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const result = await pool.query(
      `INSERT INTO marche (titre, description, image, date_publication, tags, categorie_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, catId]
    );
    res.json({ success: true, tendance: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout marche' });
  }
});
app.put('/api/marche/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, image, date_publication, tags } = req.body;
    await pool.query(
      `UPDATE marche SET titre=$1, description=$2, image=$3, date_publication=$4, tags=$5 WHERE id=$6`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification marche' });
  }
});
app.delete('/api/marche/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM marche WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression marche' });
  }
});

// ================== API INSIGHTS (CRUD) ==================
app.get('/api/insights/:categorie', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
    if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const { rows } = await pool.query('SELECT * FROM insights WHERE categorie_id = $1', [catId]);
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
app.post('/api/insights', async (req, res) => {
  try {
    const { titre, description, image, date_publication, tags, categorie } = req.body;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [categorie.toLowerCase()]);
    if (!catRows.length) return res.status(400).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const result = await pool.query(
      `INSERT INTO insights (titre, description, image, date_publication, tags, categorie_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, catId]
    );
    res.json({ success: true, tendance: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout insight' });
  }
});
app.put('/api/insights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, image, date_publication, tags } = req.body;
    await pool.query(
      `UPDATE insights SET titre=$1, description=$2, image=$3, date_publication=$4, tags=$5 WHERE id=$6`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification insight' });
  }
});
app.delete('/api/insights/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM insights WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression insight' });
  }
});

// ================== API PREDICTIONS (CRUD) ==================
app.get('/api/predictions/:categorie', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [cat.toLowerCase()]);
    if (!catRows.length) return res.status(404).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const { rows } = await pool.query('SELECT * FROM predictions WHERE categorie_id = $1', [catId]);
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur BDD' });
  }
});
app.post('/api/predictions', async (req, res) => {
  try {
    const { titre, description, image, date_publication, tags, categorie } = req.body;
    const { rows: catRows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [categorie.toLowerCase()]);
    if (!catRows.length) return res.status(400).json({ error: 'Catégorie inconnue' });
    const catId = catRows[0].id;
    const result = await pool.query(
      `INSERT INTO predictions (titre, description, image, date_publication, tags, categorie_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, catId]
    );
    res.json({ success: true, tendance: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur ajout prediction' });
  }
});
app.put('/api/predictions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, image, date_publication, tags } = req.body;
    await pool.query(
      `UPDATE predictions SET titre=$1, description=$2, image=$3, date_publication=$4, tags=$5 WHERE id=$6`,
      [titre, description, image, date_publication, `{${tags.join(',')}}`, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur modification prediction' });
  }
});
app.delete('/api/predictions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM predictions WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression prediction' });
  }
});

// ========== DÉMARRAGE DU SERVEUR ==========
// Démarrage du serveur
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