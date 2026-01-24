// assets/js/fiche-tendance.js - Chargement dynamique des articles tendances depuis PostgreSQL

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : `http://${window.location.hostname}:3000/api`;

// FONCTION PRINCIPALE - Charge l'article et ses sections depuis la BDD
async function chargerDonneesTendance() {
    // 1. Récupérer l'ID de l'article depuis l'URL (via data-attribute)
    const articleId = document.body.dataset.articleId;
    
    if (!articleId) {
        console.error('❌ ID de l\'article non trouvé');
        afficherErreurArticle('Article non identifié');
        return;
    }
    
    try {
        // 2. Charger l'article depuis la BDD
        const response = await fetch(`${API_URL}/fiche-tendance/data/${articleId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const article = data.data;
            afficherDonneesArticle(article);
        } else {
            console.error('❌ Erreur API:', data.message);
            afficherErreurArticle('Article non trouvé');
        }
    } catch (error) {
        console.error('❌ Erreur connexion:', error);
        afficherErreurArticle('Erreur de connexion à la base de données');
    }
}

// FONCTION D'AFFICHAGE - Affiche l'article et ses sections
function afficherDonneesArticle(article) {
    // 1. Titre
    const titleEl = document.querySelector('.article-title');
    if (titleEl) {
        titleEl.textContent = article.titre;
    }
    
    // 2. Badge HOT
    const hotBadge = document.getElementById('badge-hot');
    if (hotBadge && article.hot) {
        hotBadge.innerHTML = `
            <div style="background: linear-gradient(45deg, #ff6b6b, #ff8e53); 
                        padding: 10px; margin-bottom: 20px; text-align: center; 
                        border-radius: 8px; font-weight: bold; color: white;">
                🔥 Tendance HOT en ce moment !
            </div>
        `;
    }
    
    // 3. Date de publication
    const dateEl = document.querySelector('.publication-date');
    if (dateEl && article.date_publication) {
        const dateObj = new Date(article.date_publication);
        const dateFormatee = dateObj.toLocaleDateString('fr-FR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        dateEl.textContent = `Publié le ${dateFormatee}`;
    }
    
    // 4. Image d'en-tête (catégorie)
    const headerImg = document.querySelector('.entete img');
    if (headerImg && article.categorie) {
        // Adapter l'image selon la catégorie
        const categoryImages = {
            'PC Gaming': 'gaming.png',
            'Console': 'gaming.png',
            'Smartphone': 'mobile.png',
            'Tablette': 'mobile.png',
            'Camera': 'camera.png',
            'Casque VR': 'vr.png'
        };
        const imageName = categoryImages[article.categorie] || 'gaming.png';
        headerImg.src = `../../../frontend/public/assets/images/${imageName}`;
    }
    
    // 5. Contenu de l'article - SECTIONS DEPUIS LA BDD
    const contentDiv = document.getElementById('article-content');
    if (contentDiv) {
        if (article.sections && article.sections.length > 0) {
            // Afficher les sections depuis actualites_sections
            let html = '';
            article.sections.forEach(section => {
                html += `
                    <h2 style="color: #667eea; margin-top: 30px; margin-bottom: 15px;">${section.titre}</h2>
                    <p style="line-height: 1.8; white-space: pre-line;">${section.contenu}</p>
                `;
            });
            contentDiv.innerHTML = html;
        } else {
            // Fallback: afficher le résumé si pas de sections
            contentDiv.innerHTML = `
                <p style="line-height: 1.8; margin-bottom: 20px;">${article.resume || 'Contenu en cours de rédaction...'}</p>
            `;
        }
    }
    
    console.log('✅ Article chargé:', article.titre);
}

// FONCTION D'ERREUR
function afficherErreurArticle(message) {
    const contentDiv = document.getElementById('article-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div style="background: #fee; border: 2px solid #fcc; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="color: #c00; font-weight: bold;">⚠️ ${message}</p>
            </div>
        `;
    }
}

// LANCEMENT AU CHARGEMENT DE LA PAGE
document.addEventListener('DOMContentLoaded', chargerDonneesTendance);
