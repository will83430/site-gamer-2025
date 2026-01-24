const path = require('path');
const fs = require('fs');

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
    <img src="/assets/images/gaming.png" alt="Gaming">
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

// Générer et sauvegarder une fiche
function createFiche(product, baseDir) {
  console.log('Données produit pour génération fiche:', {
    id: product.id,
    nom: product.nom,
    titre_affiche: product.titre_affiche
  });

  // Générer le HTML
  const html = generateFicheHTML(product);

  // Créer le dossier de catégorie
  const categoryFolder = product.categorie.toLowerCase().replace(/\s+/g, '-');
  const ficheDir = path.join(baseDir, 'fiches', categoryFolder);

  if (!fs.existsSync(ficheDir)) {
    fs.mkdirSync(ficheDir, { recursive: true });
  }

  // Créer le fichier HTML
  const fileName = `${product.nom.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`;
  const filePath = path.join(ficheDir, fileName);

  fs.writeFileSync(filePath, html);

  return {
    path: `fiches/${categoryFolder}/${fileName}`,
    fullPath: filePath
  };
}

// Supprimer une fiche
function deleteFiche(fichePath, baseDir) {
  if (!fichePath) {
    return { deleted: false, message: 'Pas de fiche à supprimer' };
  }

  const absolutePath = path.join(baseDir, fichePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    return { deleted: true, message: 'Fiche supprimée' };
  } else {
    return { deleted: false, message: 'Fiche non trouvée' };
  }
}

// Lire une fiche
function readFiche(fichePath, baseDir) {
  if (!fichePath) {
    return null;
  }

  // Nettoyer le chemin
  let cleanPath = fichePath;
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }

  // Essayer plusieurs chemins possibles
  const paths = [
    path.join(baseDir, 'public', cleanPath),
    path.join(baseDir, 'public', 'fiches', path.basename(cleanPath)),
    path.join(baseDir, 'fiches', cleanPath),
    path.join(baseDir, cleanPath)
  ];

  for (const filePath of paths) {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
  }

  return null;
}

module.exports = {
  generateFicheHTML,
  createFiche,
  deleteFiche,
  readFiche
};
