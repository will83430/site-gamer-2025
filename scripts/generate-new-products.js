// Script pour générer les fiches des 12 nouveaux produits
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gamer_2025',
  password: 'Wilfried!1985',
  port: 5432,
});

const newProductIds = [
  'prod_50', 'prod_51', 'prod_52', 'prod_53', 'prod_54', 'prod_55',
  'prod_56', 'prod_57', 'prod_58', 'prod_59', 'prod_60', 'prod_61'
];

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
<img src="${product.image || '/assets/images/placeholder.png'}" alt="${product.nom}" class="img-centree" onerror="this.src='/assets/images/placeholder.png'"></div>
    
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

async function run() {
  try {
    console.log('Génération des 12 nouvelles fiches...\n');
    
    for (const id of newProductIds) {
      const result = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        console.log(`❌ ${id} - Non trouvé`);
        continue;
      }
      
      const product = result.rows[0];
      const html = generateFicheHTML(product);
      
      const categoryFolder = product.categorie.toLowerCase().replace(/\s+/g, '-');
      const ficheDir = path.join(__dirname, '..', 'fiches', categoryFolder);
      
      if (!fs.existsSync(ficheDir)) {
        fs.mkdirSync(ficheDir, { recursive: true });
      }
      
      const fileName = `${product.nom.toLowerCase().replace(/[^a-z0-9]/gi, '-')}.html`;
      const filePath = path.join(ficheDir, fileName);
      
      fs.writeFileSync(filePath, html);
      console.log(`✅ ${id} - ${product.nom} -> ${categoryFolder}/${fileName}`);
    }
    
    console.log('\n✅ Génération terminée !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

run();
