// assets/js/fiche-tendance.js - Chargement dynamique des articles tendances depuis PostgreSQL

// API URL - utilise l'origine actuelle (fonctionne avec tunnel localhost.run)
const API_URL = window.location.origin + '/api';

// Mapping slug -> nom de catégorie lisible
const categoryNames = {
    'smartphone': 'Smartphones',
    'pc-gaming': 'PC Gaming',
    'console': 'Consoles',
    'casque-vr': 'VR/AR',
    'drone': 'Drones',
    'montre-connectee': 'Montres Connectées',
    'camera': 'Caméras',
    'casque-audio': 'Casques Audio',
    'ecran-tv': 'Ecrans & TV',
    'tablette': 'Tablettes',
    'peripheriques': 'Périphériques',
    'imprimante-3d': 'Imprimantes 3D',
    'box-internet': 'Box Internet',
    'serveur': 'Serveurs',
    'video-projecteur': 'Vidéoprojecteurs',
    'tableau-interactif': 'Tableaux Interactifs'
};

// Convertit les URLs YouTube courantes (watch, youtu.be, shorts) vers un embed stable
function normalizeVideoUrl(url) {
    if (!url) return '';
    try {
        const parsed = new URL(url, window.location.origin);
        const host = parsed.hostname.replace(/^www\./, '');

        if (host.endsWith('youtube.com') || host === 'youtu.be') {
            let videoId = parsed.searchParams.get('v');

            if (!videoId && host === 'youtu.be') {
                videoId = parsed.pathname.split('/').filter(Boolean)[0];
            }

            if (!videoId && parsed.pathname.includes('/shorts/')) {
                videoId = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
            }

            if (videoId) {
                const startParam = parsed.searchParams.get('t') || parsed.searchParams.get('start');
                const start = startParam ? parseInt(startParam, 10) || 0 : 0;
                const startSuffix = start > 0 ? `?start=${start}` : '';
                return `https://www.youtube.com/embed/${videoId}${startSuffix}`;
            }
        }
    } catch (err) {
        console.warn('normalizeVideoUrl failed:', err);
    }
    return url;
}

// FONCTION PRINCIPALE - Charge l'article et ses sections depuis la BDD
function getArticleId() {
    // ⚠️ IMPORTANT: Toujours récupérer depuis l'URL pour permettre la navigation
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get('id') || params.get('article') || params.get('tendance');
    
    if (urlId) return urlId;
    
    // Fallback sur l'attribut du body
    return document.body.dataset.articleId;
}

async function chargerDonneesTendance() {
    // 1. Récupérer l'ID de l'article depuis l'URL (data-attribute ou query string)
    const articleId = getArticleId();
    console.log('🔍 ID de l\'article trouvé:', articleId);
    if (articleId && !document.body.dataset.articleId) {
        document.body.dataset.articleId = articleId;
    }
    
    if (!articleId) {
        console.error('❌ ID de l\'article non trouvé (data-id ou paramètre ?id= manquant)');
        afficherErreurArticle('Article non identifié');
        return;
    }
    
    try {
        // 2. Charger l'article depuis la BDD
        const response = await fetch(`${API_URL}/fiche-tendance/data/${articleId}`);
        const data = await response.json();
        console.log('📡 Réponse API:', data);
        
        if (data.success && data.data) {
            const article = data.data;
            console.log('✅ Article trouvé:', article.titre);
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
    // Montrer le contenu, masquer le loading
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const wrapper = document.getElementById('article-wrapper');
    if (loadingState) loadingState.classList.add('hidden');
    if (errorState) errorState.classList.add('hidden');
    if (wrapper) wrapper.classList.remove('hidden');

    // Mettre à jour meta titre/description
    const pageTitle = document.getElementById('page-title');
    const pageDesc = document.getElementById('page-description');
    const titleText = article.titre || 'Tendance';
    if (pageTitle) pageTitle.textContent = `${titleText} - HIGH-TECH 2026`;
    if (pageDesc) pageDesc.content = article.description || titleText;

    // Breadcrumb catégorie et titre
    const breadcrumbCat = document.getElementById('breadcrumb-category');
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    const breadcrumbTendances = document.getElementById('breadcrumb-tendances');
    
    if (breadcrumbTitle) {
        breadcrumbTitle.textContent = 'Articles';
    }
    
    if (breadcrumbCat && article.categorie) {
        const slug = article.categorie.toLowerCase().replace(/\s+/g, '-');
        const categoryName = categoryNames[slug] || article.categorie;
        breadcrumbCat.textContent = categoryName;
        breadcrumbCat.href = `/2026/produits.html?categorie=${slug}`;
    }
    
    // Mettre à jour le lien tendances pour pointer vers la catégorie
    if (breadcrumbTendances && article.categorie) {
        const slug = article.categorie.toLowerCase().replace(/\s+/g, '-');
        breadcrumbTendances.href = `/2026/tendances.html?categorie=${slug}`;
    }

    // Mettre à jour les boutons "Tendances" (nav et footer)
    if (article.categorie) {
        const slug = article.categorie.toLowerCase().replace(/\s+/g, '-');
        const tendancesUrl = `/2026/tendances.html?categorie=${slug}`;

        const navTendances = document.getElementById('nav-tendances');
        if (navTendances) navTendances.href = tendancesUrl;

        const btnTendances = document.getElementById('btn-tendances');
        if (btnTendances) btnTendances.href = tendancesUrl;
    }

    // 1. Titre
    const titleEl = document.querySelector('.article-title');
    if (titleEl) {
        titleEl.textContent = article.titre || 'Tendance';
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

    // 4. Visuel (vidéo ou image)
    const mediaEl = document.getElementById('article-visual');
    if (mediaEl) {
        if (article.video_url) {
            const embedUrl = normalizeVideoUrl(article.video_url);
            mediaEl.classList.remove('hidden');
            mediaEl.innerHTML = `
                <iframe
                    src="${embedUrl}?enablejsapi=1&origin=${window.location.origin}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            `;
        } else if (article.image) {
            mediaEl.classList.remove('hidden');
            mediaEl.innerHTML = `
                <img src="/assets/images/${article.image}" alt="${titleText}" onerror="this.src='/assets/images/placeholder.png'">
            `;
        } else {
            mediaEl.classList.add('hidden');
        }
    }

    // 5. Résumé
    const resumeEl = document.getElementById('article-resume');
    if (resumeEl) {
        const resumeText = article.resume || article.description;
        if (resumeText) {
            resumeEl.textContent = resumeText;
            resumeEl.classList.remove('hidden');
        } else {
            resumeEl.classList.add('hidden');
        }
    }
    
    // Image d'en-tête (ancienne maquette) — ignorée dans la nouvelle page, mais conservée si présente
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
    
    // 6. Contenu de l'article - SECTIONS DEPUIS LA BDD
    const contentDiv = document.getElementById('article-content');
    if (contentDiv) {
        console.log('🔍 DEBUG sections:', article.sections);
        console.log('🔍 DEBUG sections length:', article.sections?.length);
        if (article.sections && article.sections.length > 0) {
            // Afficher les sections depuis actualites_sections
            let html = '';
            article.sections.forEach(section => {
                html += `
                    <h2>${section.titre}</h2>
                    <p>${section.contenu}</p>
                `;
            });
            contentDiv.innerHTML = html;
        } else {
            // Fallback: afficher le résumé si pas de sections
            contentDiv.innerHTML = `
                <p>${article.resume || 'Contenu en cours de rédaction...'}</p>
            `;
        }
    }
    
    // Update Open Graph meta tags
    const ogTitle = document.getElementById('og-title');
    const ogDesc = document.getElementById('og-description');
    const ogImage = document.getElementById('og-image');
    const ogUrl = document.getElementById('og-url');
    const ogPublished = document.getElementById('og-published');

    if (ogTitle) ogTitle.setAttribute('content', `${titleText} - HIGH-TECH 2026`);
    if (ogDesc) ogDesc.setAttribute('content', article.description || titleText);
    if (ogImage && article.image) ogImage.setAttribute('content', `/assets/images/${article.image}`);
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);
    if (ogPublished && article.date_publication) ogPublished.setAttribute('content', article.date_publication);

    // Add Schema.org Article structured data
    injectArticleSchema(article, titleText);

    console.log('✅ Article chargé:', article.titre);
}

// SCHEMA.ORG STRUCTURED DATA FOR ARTICLES
function injectArticleSchema(article, titleText) {
    // Remove existing schema if any
    const existingSchema = document.getElementById('schema-article');
    if (existingSchema) existingSchema.remove();

    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": titleText,
        "description": article.description || article.resume || '',
        "author": {
            "@type": "Organization",
            "name": "HIGH-TECH 2026"
        },
        "publisher": {
            "@type": "Organization",
            "name": "HIGH-TECH 2026",
            "logo": {
                "@type": "ImageObject",
                "url": window.location.origin + "/assets/images/logo.png"
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": window.location.href
        }
    };

    // Add image if available
    if (article.image) {
        schema.image = window.location.origin + "/assets/images/" + article.image;
    }

    // Add dates
    if (article.date_publication) {
        schema.datePublished = article.date_publication;
        schema.dateModified = article.date_publication;
    }

    // Add category as articleSection
    if (article.categorie) {
        schema.articleSection = article.categorie;
    }

    // Add keywords from tags
    if (article.tags && Array.isArray(article.tags)) {
        schema.keywords = article.tags.join(', ');
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-article';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

// FONCTION D'ERREUR
function afficherErreurArticle(message) {
    const loadingState = document.getElementById('loading-state');
    const wrapper = document.getElementById('article-wrapper');
    const errorState = document.getElementById('error-state');
    if (loadingState) loadingState.classList.add('hidden');
    if (wrapper) wrapper.classList.add('hidden');
    if (errorState) {
        errorState.classList.remove('hidden');
        errorState.querySelector('p').textContent = message;
    }
}

// LANCEMENT AU CHARGEMENT DE LA PAGE ET AU CHANGEMENT D'URL
if (document.readyState === 'loading') {
    // Si le DOM n'est pas encore chargé, attendre DOMContentLoaded
    document.addEventListener('DOMContentLoaded', chargerDonneesTendance);
} else {
    // Si le DOM est déjà chargé (navigation rapide), charger directement
    chargerDonneesTendance();
}

// Écouter les changements de paramètres (bouton back/forward)
window.addEventListener('popstate', chargerDonneesTendance);
