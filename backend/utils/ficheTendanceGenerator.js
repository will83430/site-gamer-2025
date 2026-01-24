const path = require('path');
const fs = require('fs');

// Fonction de génération du template HTML MINIMAL pour les tendances (chargement dynamique)
async function generateFicheTendanceHTML(tendance, categorie, pool = null) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${tendance.titre} - Tendance Gaming</title>
    <link rel="stylesheet" href="/assets/css/styles.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope&family=Montserrat&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
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
<body data-article-id="${tendance.id}">
    <div class="entete">
        <img src="../../../frontend/public/assets/images/gaming.png" alt="Gaming">
        <a class="nav-back" href="javascript:history.back()">← Retour</a>
    </div>

    <h1 class="article-title">Chargement...</h1>
    <div id="badge-hot"></div>
    <p class="publication-date" style="text-align: center; color: #666; margin-bottom: 30px;">Chargement...</p>

    ${tendance.video_url ? `
    <div class="gallery" style="background: #000; max-width: 700px; margin: 30px auto;">
        <iframe 
            style="width: 100%; aspect-ratio: 16/9; border: none; border-radius: 12px;"
            src="${tendance.video_url}?enablejsapi=1&origin=${process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen>
        </iframe>
    </div>
    ` : tendance.image ? `<div class="gallery"><img src="/assets/images/${tendance.image}" alt="${tendance.titre}" class="img-centree" onerror="this.src='/assets/images/placeholder.png'"></div>` : ''}

    <div id="article-content">
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
    <script src="/assets/js/fiche-tendance.min.js"></script>
</body>
</html>`;
}

// Générer et sauvegarder une fiche tendance (HTML minimal)
async function createFicheTendance(tendance, categorie, baseDir, pool = null) {
  console.log('Génération fiche tendance:', {
    id: tendance.id,
    titre: tendance.titre,
    categorie: categorie
  });

  // Générer le HTML minimal
  const html = await generateFicheTendanceHTML(tendance, categorie, pool);

  // Créer le dossier de catégorie
  const categorySlug = categorie.toLowerCase().replace(/\s+/g, '-');
  const ficheDir = path.join(baseDir, 'fiches', 'tendances', categorySlug);

  if (!fs.existsSync(ficheDir)) {
    fs.mkdirSync(ficheDir, { recursive: true });
  }

  // Créer le fichier HTML (slug depuis le titre)
  const slug = tendance.titre
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const fileName = `${slug}.html`;
  const filePath = path.join(ficheDir, fileName);

  fs.writeFileSync(filePath, html, 'utf8');

  return {
    path: `fiches/tendances/${categorySlug}/${fileName}`,
    fullPath: filePath
  };
}

// Supprimer une fiche tendance
function deleteFicheTendance(fichePath, baseDir) {
  if (!fichePath) {
    return { deleted: false, message: 'Pas de fiche à supprimer' };
  }

  const absolutePath = path.join(baseDir, fichePath);

  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    return { deleted: true, message: 'Fiche tendance supprimée' };
  } else {
    return { deleted: false, message: 'Fiche tendance non trouvée' };
  }
}

module.exports = {
  generateFicheTendanceHTML,
  createFicheTendance,
  deleteFicheTendance
};
