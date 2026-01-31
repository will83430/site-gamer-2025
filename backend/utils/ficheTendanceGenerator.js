const path = require('path');
const fs = require('fs');

// Fonction de génération du template HTML pour les tendances (chargement dynamique + style 2026)
async function generateFicheTendanceHTML(tendance, categorie, pool = null) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tendance.titre} - HIGH-TECH 2026</title>
  <meta name="description" content="${tendance.description || tendance.titre}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Orbitron:wght@500;600;700;800&display=swap" rel="stylesheet">

  <!-- Theme CSS 2026 -->
  <link rel="stylesheet" href="/2026/css/theme.css">

  <style>
    main {
      padding-top: 100px;
      min-height: 100vh;
      position: relative;
      z-index: 1;
    }

    .article-container {
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem;
    }

    .article-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .article-title {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(1.9rem, 4vw, 2.6rem);
      background: var(--gradient-yellow-green);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.6rem;
      line-height: 1.3;
    }

    .publication-date {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 0.8rem;
    }

    .badge-hot {
      display: inline-block;
      background: linear-gradient(135deg, #ff6b6b 0%, #ff9500 50%, #ffd700 100%);
      color: white;
      padding: 0.35rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 700;
      margin: 0.4rem 0 0.8rem 0;
    }

    .article-media {
      margin: 1.5rem 0;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .article-media img {
      width: 100%;
      height: auto;
      display: block;
    }

    .article-media iframe {
      width: 100%;
      aspect-ratio: 16/9;
      border: none;
    }

    .article-content {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.28);
    }

    .article-content h2 {
      font-family: 'Orbitron', sans-serif;
      color: var(--text-primary);
      font-size: 1.4rem;
      margin: 1.8rem 0 0.9rem 0;
    }

    .article-content h2:first-child {
      margin-top: 0;
    }

    .article-content p {
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 1.2rem;
    }

    .article-content ul, .article-content ol {
      color: var(--text-secondary);
      line-height: 1.8;
      margin: 0.8rem 0 1.3rem 1.2rem;
    }

    .article-content li {
      margin-bottom: 0.4rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-secondary);
    }

    .loading-spinner {
      width: 42px;
      height: 42px;
      border: 4px solid rgba(212, 255, 0, 0.1);
      border-top-color: var(--tech-yellow);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .back-section {
      text-align: center;
      margin-top: 2.5rem;
    }
  </style>
</head>
<body data-article-id="${tendance.id}">

  <!-- Header 2026 -->
  <header class="header">
    <nav class="nav-container">
      <a href="/2026/" class="logo-section">
        <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#d4ff00;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#6bff6b;stop-opacity:1" />
            </linearGradient>
          </defs>
          <polygon points="50,15 85,35 85,65 50,85 15,65 15,35" fill="none" stroke="url(#logoBg)" stroke-width="2.5" opacity="0.9"/>
          <path d="M 50 25 L 58 45 L 48 45 L 54 70 L 38 48 L 50 48 Z" fill="url(#logoBg)" opacity="0.95"/>
          <circle cx="30" cy="40" r="2.5" fill="#4dd4ff" opacity="0.7"/>
          <circle cx="70" cy="60" r="2.5" fill="#a78bfa" opacity="0.7"/>
        </svg>
        <div class="logo-text">HIGH-TECH 2026</div>
      </a>

      <div class="nav-links">
        <a href="/2026/" class="nav-link">Accueil</a>
        <a href="/2026/#categories" class="nav-link">Categories</a>
        <a href="javascript:history.back()" class="nav-link">← Retour</a>
      </div>
    </nav>
  </header>

  <main>
    <div class="article-container">
      <div class="article-header">
        <h1 class="article-title">Chargement...</h1>
        <div id="badge-hot"></div>
        <p class="publication-date">Chargement...</p>
      </div>

      ${tendance.video_url ? `
      <div class="article-media">
        <iframe 
          src="${tendance.video_url}?enablejsapi=1&origin=${process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000'}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen>
        </iframe>
      </div>
      ` : tendance.image ? `
      <div class="article-media">
        <img src="/assets/images/${tendance.image}" alt="${tendance.titre}" onerror="this.src='/assets/images/placeholder.png'">
      </div>
      ` : ''}

      <div class="article-content" id="article-content">
        <div class="loading-state">
          <div class="loading-spinner"></div>
          <p>Chargement du contenu...</p>
        </div>
      </div>

      <div class="back-section">
        <a href="javascript:history.back()" class="btn btn-primary">
          ← Retour
        </a>
      </div>
    </div>
  </main>

  <!-- Footer 2026 -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>HIGH-TECH 2026</h3>
        <p style="color: var(--text-secondary); line-height: 1.7;">
          Votre source d'information de confiance pour la technologie de pointe.
        </p>
      </div>

      <div class="footer-section">
        <h3>Navigation</h3>
        <ul class="footer-links">
          <li><a href="/2026/">Accueil</a></li>
          <li><a href="/2026/produits.html">Produits</a></li>
          <li><a href="/top-du-mois">Top du Mois</a></li>
          <li><a href="/2026/comparatif.html">Comparatif</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Catégories</h3>
        <ul class="footer-links">
          <li><a href="/2026/produits.html?categorie=smartphone">Smartphones</a></li>
          <li><a href="/2026/produits.html?categorie=pc-gaming">PC Gaming</a></li>
          <li><a href="/2026/produits.html?categorie=console">Consoles</a></li>
          <li><a href="/2026/produits.html?categorie=casque-vr">VR/AR</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>Ressources</h3>
        <ul class="footer-links">
          <li><a href="/wiki/wiki.html">Wiki</a></li>
          <li><a href="/admin">Admin</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 HIGH-TECH 2026. Tous droits réservés.</p>
    </div>
  </footer>

  <button class="scroll-top" id="scrollTop">^</button>

  <script src="/assets/js/fiche-tendance.min.js"></script>
  <script>
    const scrollTop = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTop.classList.add('visible');
      } else {
        scrollTop.classList.remove('visible');
      }
    });
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  </script>
</body>
</html>`;
}

// Générer une fiche tendance : on ne crée plus de fichiers, on pointe vers la page dynamique 2026
async function createFicheTendance(tendance, categorie, baseDir, pool = null) {
  console.log('Génération lien fiche tendance (dynamique):', {
    id: tendance.id,
    titre: tendance.titre,
    categorie: categorie
  });

  const dynamicPath = `/2026/tendance.html?id=${tendance.id}`;

  return {
    path: dynamicPath,
    fullPath: null
  };
}

// Supprimer une fiche tendance
function deleteFicheTendance(fichePath, baseDir) {
  if (!fichePath) {
    return { deleted: false, message: 'Pas de fiche à supprimer' };
  }

  // Nouveau modèle dynamique : rien à supprimer si le lien pointe vers la page unique 2026
  if (fichePath.startsWith('/2026/tendance.html')) {
    return { deleted: false, message: 'Fiche dynamique, aucune suppression nécessaire' };
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
