// server-fixed.js - Version corrigée du serveur
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // IMPORTANT !
const compression = require('compression'); // 🔥 AJOUTE CETTE LIGNE
const assetsPath = path.join(__dirname, 'frontend/public/assets');

const app = express();
const port = 3000;

app.use(compression()); // Compression gzip

// Configuration PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Wilfried!1985',
  port: 5432,
});

// Middleware
app.use(cors());
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

// ========== ROUTES API ==========

// GET - Récupérer tous les produits
app.get('/api/produits', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, nom, categorie, description, image, lien, 
        top_du_mois, prix, fonctionnalites_avancees, donnees_fiche, titre_affiche
      FROM produits 
      ORDER BY categorie, nom
    `);

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

    // Ajouter image_url
    if (product.image) {
      product.image_url = product.image;
    } else if (product.image) {
      product.image_url = product.image.startsWith('/') ? product.image : '/assets/images/' + product.image;
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

    const query = `
      INSERT INTO produits 
      (id, nom, categorie, description, image, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche, titre_affiche)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const params = [
      nextId,
      nom, categorie || null, description || null,
      image || null, image || null, lien || null,
      top_du_mois || false, prix || null,
      fonctionnalites_avancees || [], donnees_fiche || [],
      titre_affiche || null // <-- Ajout ici
    ];

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
      titre_affiche // <-- Ajout ici
    } = req.body;
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

    // Vérifier si la colonne image existe
    const columnCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'produits' AND column_name = 'image'
    `);

    let query, params;

    if (columnCheck.rows.length > 0) {
      query = `
        UPDATE produits 
        SET nom = $1, categorie = $2, description = $3, image = $4,
            image = $5, lien = $6, top_du_mois = $7, prix = $8, 
            fonctionnalites_avancees = $9, donnees_fiche = $10, titre_affiche = $11
        WHERE id = $12
        RETURNING *
      `;
      params = [
        nom, categorie || null, description || null,
        image || null, image || null, lien || null,
        top_du_mois || false, prix || null,
        fonctionnalites_avancees || [], donnees_fiche || [],
        titre_affiche || null, // <-- Ajout ici
        id
      ];
    } else {
      query = `
        UPDATE produits 
        SET nom = $1, categorie = $2, description = $3, image = $4,
            lien = $5, top_du_mois = $6, prix = $7, 
            fonctionnalites_avancees = $8, donnees_fiche = $9, titre_affiche = $10
        WHERE id = $11
        RETURNING *
      `;
      params = [
        nom, categorie || null, description || null,
        image || image || null, lien || null,
        top_du_mois || false, prix || null,
        fonctionnalites_avancees || [], donnees_fiche || [],
        titre_affiche || null, // <-- Ajout ici
        id
      ];
    }

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
  // On met le nom du produit dans le <title> et <h1>
  // Le JS se charge de tout charger dynamiquement via l'API
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${product.nom} - Fiche Produit</title>
    <link rel="stylesheet" href="/assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope&family=Montserrat&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="entete">
    <img src="../../frontend/public/assets/images/gaming.png" alt="Gaming">
    <a href="javascript:history.back()">← Retour</a>
</div>

    <h1>${product.titre_affiche || product.nom}</h1>
    <div id="badge-top-mois"></div>
    <p class="description">Chargement de la description...</p>

    <div class="gallery">
        <img src="/assets/images/placeholder.png" alt="${product.nom}" class="img-centree" onerror="this.src='/assets/images/placeholder.png'">
    </div>
    
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
    <img src="../../frontend/public/assets/images/banniere-pied.png" alt="Bannière" class="footer-banner">
    <div class="footer-links">
        <div class="footer-item">
            <img src="../../frontend/public/assets/images/logo-blanc.png" alt="Accueil" class="footer-icon">
            <a href="../../frontend/public/index.html">Accueil</a>
        </div>
        <div class="footer-item">
            <img src="../../frontend/public/assets/images/logo-dokk-blanc.png" alt="Multibloc" class="footer-icon">
            <a href="../../frontend/public/top-du-mois.html">Vitrine</a>
        </div>
    </div>
</footer>

    <script src="/assets/js/utils.js"></script>
    <script src="/assets/js/fiche-produit.js"></script>
</body>
</html>`;
}

// GET - Statistiques
app.get('/api/stats', async (req, res) => {
  try {
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

app.post('/api/init-image-column', (req, res) => {
  res.json({ success: true, message: 'Colonne OK' });
});
app.get('/api/fiches-list', (req, res) => {
  res.json({
    success: true,
    fiches: [
      { name: "exemple.html", path: "fiches/exemple.html", category: "test" }
    ]
  });
});

app.post('/api/generate-fiche/:id', async (req, res) => {
    res.json({ success: false, error: 'Endpoint à implémenter' });
});

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

// Route de test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API PostgreSQL fonctionne!',
    timestamp: new Date().toISOString()
  });
});

// ========== DÉMARRAGE DU SERVEUR ==========

app.listen(port, async () => {
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