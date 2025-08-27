// server-fixed.js - Version corrigée du serveur
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // IMPORTANT !
const compression = require('compression'); // 🔥 AJOUTE CETTE LIGNE

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
const assetsPath = path.join(__dirname, 'frontend', 'public', 'assets');
console.log('📁 Dossier assets configuré:', assetsPath);
app.use('/assets', express.static(assetsPath, {
  maxAge: '1d' // Cache 1 jour
}));

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
    console.log('📊 GET /api/produits');

    const result = await pool.query(`
      SELECT 
        id, nom, categorie, description, image, image_data, lien, 
        top_du_mois, prix, fonctionnalites_avancees, donnees_fiche
      FROM produits 
      ORDER BY categorie, nom
    `);

    // Traiter les images pour ajouter image_url
    const productsWithImages = result.rows.map(product => {
      // Ajouter image_url basé sur image ou image_data
      if (product.image_data) {
        product.image_url = product.image_data;
      } else if (product.image) {
        // S'assurer que le chemin commence par /
        product.image_url = product.image.startsWith('/') ? product.image : '/' + product.image;
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

    // Ajouter image_url
    if (product.image_data) {
      product.image_url = product.image_data;
    } else if (product.image) {
      product.image_url = product.image.startsWith('/') ? product.image : '/' + product.image;
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
      (id, nom, categorie, description, image, image_data, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const params = [
      nextId,
      nom, categorie || null, description || null,
      image || null, image_data || null, lien || null,
      top_du_mois || false, prix || null,
      fonctionnalites_avancees || [], donnees_fiche || []
    ];

    const result = await pool.query(query, params);

    console.log(`✅ Produit créé avec l'ID ${nextId}`);

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

// Route pour générer une fiche HTML
app.post('/api/generate-fiche/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📄 Génération fiche pour produit ID: ${id}`);

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
  let imageUrl = '/assets/images/placeholder.png';
  if (product.image_data) {
    imageUrl = product.image_data;
  } else if (product.image) {
    imageUrl = product.image.startsWith('/') ? product.image : `/assets/images/${product.image}`;
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${product.nom}</title>
    <link rel="stylesheet" href="/assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope&family=Montserrat&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="entete">
        <img src="/assets/images/gaming.png" alt="Gaming">
        <a href="javascript:history.back()">Retour à la vitrine</a>
    </div>

    <h1>${product.nom}</h1>

    <div id="badge-top-mois">${product.top_du_mois ?
      '<div style="background: linear-gradient(45deg, #ffd700, #ffed4e); padding: 10px; margin-bottom: 20px; text-align: center; border-radius: 8px; font-weight: bold;">⭐ Ce produit est en vedette ce mois-ci !</div>' : ''
    }</div>

    <p class="description">${product.description || ''}</p>

    <div class="gallery">
        <img src="${imageUrl}" alt="${product.nom}" class="img-centree">
    </div>
     
    <div class="lightbox" id="lightbox">
        <img id="lightbox-img" src="" alt="Zoom">
    </div>

    <div id="product-content">
        ${product.prix ? `<p><strong>💰 Prix :</strong> ${product.prix}</p>` : ''}
        ${product.donnees_fiche && product.donnees_fiche.length > 0 ?
      product.donnees_fiche.map(donnee => donnee ? `<p>${donnee}</p>` : '').join('') :
      '<p style="color: #666; font-style: italic;">ℹ️ Aucune donnée détaillée disponible pour ce produit.</p>'
    }
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
    <script src="/assets/js/fiche-produit.js"></script>
</body>
</html>`;
}

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
  console.log('');
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🚀 SERVEUR POSTGRESQL DÉMARRÉ            ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 API: http://localhost:${port}/api`);
  console.log(`🖥️  Site: http://localhost:${port}`);
  console.log('');
  console.log('📁 Dossiers configurés:');
  console.log(`   Assets: ${assetsPath}`);
  console.log(`   Frontend: ${frontendPath}`);
  console.log(`   Fiches: ${fichesPath}`);
  console.log('');

  // Test connexion PostgreSQL
  try {
    const result = await pool.query('SELECT COUNT(*) FROM produits');
    console.log(`✅ PostgreSQL connecté`);
    console.log(`📦 ${result.rows[0].count} produits dans la base`);
  } catch (err) {
    console.error('❌ Erreur PostgreSQL:', err.message);
  }

  // Vérifier que les images sont accessibles
  const testImagePath = path.join(assetsPath, 'images',);
  if (fs.existsSync(testImagePath)) {
    console.log('✅ Image test trouvée: ' + testImagePath);
  } else {
    console.log('⚠️ Image test non trouvée');
  }

  console.log('');
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n👋 Arrêt du serveur...');
  await pool.end();
  process.exit(0);
});