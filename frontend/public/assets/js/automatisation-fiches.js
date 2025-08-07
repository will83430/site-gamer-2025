/**
 * AUTOMATISATION FICHES PRODUITS
 * Génère automatiquement les fiches produits à partir du JSON
 * Version: 2.0
 * Chemin: frontend/public/assets/js/automatisation-fiches.js
 */

class automatisationFiches {
    constructor() {
        this.equipements = [];
        this.baseUrl = '';
        this.init();
    }

    async init() {
        console.log('🚀 Initialisation automatisation Fiches...');
        await this.loadEquipements();
        this.setupEventListeners();
        this.detectCurrentPage();
    }

    /**
     * Charge le JSON des équipements
     */
    async loadEquipements() {
        try {
            const response = await fetch('../../data/equipements.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            this.equipements = await response.json();
            console.log(`✅ ${this.equipements.length} équipements chargés`);
            
            // Validation de la structure
            this.validateJsonStructure();
            
        } catch (error) {
            console.error('❌ Erreur chargement équipements:', error);
            this.showError('Erreur de chargement des données produits');
        }
    }

    /**
     * Valide la structure du JSON
     */
    validateJsonStructure() {
        const requiredFields = ['id', 'nom', 'description', 'prix', 'categorie'];
        const invalidItems = [];

        this.equipements.forEach((item, index) => {
            const missing = requiredFields.filter(field => !item[field]);
            if (missing.length > 0) {
                invalidItems.push({ index, missing, item: item.nom || `Item ${index}` });
            }
        });

        if (invalidItems.length > 0) {
            console.warn('⚠️ Éléments avec structure incomplète:', invalidItems);
        }
    }

    /**
     * Détecte la page actuelle et applique les actions appropriées
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        
        if (path.includes('/fiches-produits/')) {
            this.handleProductPage();
        } else if (path.includes('/index.html') || path === '/') {
            this.handleHomePage();
        } else if (path.includes('/produits.html')) {
            this.handleProductsListPage();
        }
    }

    /**
     * Gestion de la page d'accueil
     */
    handleHomePage() {
        this.displayTopProducts();
        this.displayFeaturedCategories();
    }

    /**
     * Gestion de la page liste des produits
     */
    handleProductsListPage() {
        this.displayAllProducts();
        this.setupFilters();
        this.setupSearch();
    }

    /**
     * Gestion d'une fiche produit individuelle
     */
    handleProductPage() {
        const productId = this.extractProductIdFromUrl();
        if (productId) {
            this.displayProductDetails(productId);
        } else {
            this.generateMissingProductPage();
        }
    }

    /**
     * Extrait l'ID produit de l'URL
     */
    extractProductIdFromUrl() {
        const path = window.location.pathname;
        const matches = path.match(/fiches-produits\/([^\/]+)\/([^\/]+)\.html/);
        
        if (matches) {
            const [, categorie, slug] = matches;
            
            // Recherche par slug exact
            const product = this.equipements.find(eq => 
                eq.lien && eq.lien.includes(`${categorie}/${slug}.html`)
            );
            
            if (product) return product.id;
            
            // Recherche par nom approximatif
            const normalizedSlug = slug.replace(/-/g, ' ').toLowerCase();
            const fallback = this.equipements.find(eq => 
                eq.nom.toLowerCase().includes(normalizedSlug) ||
                normalizedSlug.includes(eq.nom.toLowerCase())
            );
            
            return fallback ? fallback.id : null;
        }
        
        return null;
    }

    /**
     * Affiche les détails d'un produit
     */
    displayProductDetails(productId) {
        const produit = this.equipements.find(eq => eq.id === productId);
        
        if (!produit) {
            this.generateMissingProductPage();
            return;
        }

        console.log(`📄 Génération fiche: ${produit.nom}`);
        
        // Mise à jour du titre de la page
        document.title = `${produit.nom} - Location Équipement`;
        
        // Génération du contenu
        const container = document.getElementById('product-container') || document.body;
        
        container.innerHTML = this.generateProductHTML(produit);
        
        // Ajout des produits similaires
        this.displaySimilarProducts(produit, container);
        
        // Mise à jour des métadonnées SEO
        this.updateSEOMetadata(produit);
    }

    /**
     * Génère le HTML d'un produit
     */
    generateProductHTML(produit) {
        const badges = this.generateBadges(produit);
        const gallery = this.generateImageGallery(produit);
        const specifications = this.generateSpecifications(produit);
        
        return `
        <div class="product-page">
            <!-- En-tête produit -->
            <div class="product-header">
                <div class="product-breadcrumb">
                    <a href="/">Accueil</a> > 
                    <a href="/produits.html">Équipements</a> > 
                    <a href="/produits.html?cat=${produit.categorie.toLowerCase()}">${produit.categorie}</a> > 
                    <span>${produit.nom}</span>
                </div>
                
                <h1 class="product-title">
                    ${produit.nom}
                    ${badges}
                </h1>
                
                <div class="product-meta">
                    <span class="product-category">${produit.categorie}</span>
                    ${produit.marque ? `<span class="product-brand">${produit.marque}</span>` : ''}
                    <span class="product-stock status-${produit.stock || 'disponible'}">${this.getStockLabel(produit.stock)}</span>
                </div>
            </div>

            <!-- Corps principal -->
            <div class="product-body">
                <div class="product-gallery">
                    ${gallery}
                </div>
                
                <div class="product-info">
                    <div class="product-price">
                        <span class="price-value">${this.formatPrice(produit.prix)}</span>
                        <span class="price-period">/ jour</span>
                    </div>
                    
                    <div class="product-description">
                        <h3>Description</h3>
                        <p>${produit.description}</p>
                    </div>
                    
                    ${specifications}
                    
                    <div class="product-actions">
                        <button class="btn btn-primary btn-reserve" onclick="openReservationModal('${produit.id}')">
                            📅 Réserver maintenant
                        </button>
                        <button class="btn btn-secondary" onclick="addToWishlist('${produit.id}')">
                            ❤️ Ajouter aux favoris
                        </button>
                        <button class="btn btn-info" onclick="shareProduct('${produit.id}')">
                            📤 Partager
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Informations supplémentaires -->
            <div class="product-tabs">
                <div class="tab-navigation">
                    <button class="tab-btn active" data-tab="details">Détails techniques</button>
                    <button class="tab-btn" data-tab="conditions">Conditions de location</button>
                    <button class="tab-btn" data-tab="delivery">Livraison</button>
                </div>
                
                <div class="tab-content">
                    <div id="tab-details" class="tab-panel active">
                        ${this.generateTechnicalDetails(produit)}
                    </div>
                    <div id="tab-conditions" class="tab-panel">
                        ${this.generateRentalConditions(produit)}
                    </div>
                    <div id="tab-delivery" class="tab-panel">
                        ${this.generateDeliveryInfo(produit)}
                    </div>
                </div>
            </div>
        </div>
        
        <style>
        .product-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .product-breadcrumb {
            color: #666;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .product-breadcrumb a {
            color: #007bff;
            text-decoration: none;
        }
        
        .product-title {
            font-size: 2.5rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .product-meta {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
        }
        
        .product-category, .product-brand {
            background: #f8f9fa;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 14px;
            color: #495057;
        }
        
        .product-stock {
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 14px;
            font-weight: 600;
        }
        
        .status-disponible { background: #d4edda; color: #155724; }
        .status-loue { background: #f8d7da; color: #721c24; }
        .status-maintenance { background: #fff3cd; color: #856404; }
        
        .product-body {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .product-price {
            font-size: 2rem;
            margin-bottom: 20px;
        }
        
        .price-value {
            color: #28a745;
            font-weight: bold;
        }
        
        .price-period {
            color: #666;
            font-size: 1rem;
        }
        
        .product-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 25px;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: #007bff;
            color: white;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-info {
            background: #17a2b8;
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .product-tabs {
            border-top: 2px solid #dee2e6;
            padding-top: 30px;
        }
        
        .tab-navigation {
            display: flex;
            gap: 0;
            margin-bottom: 20px;
            border-bottom: 2px solid #dee2e6;
        }
        
        .tab-btn {
            padding: 12px 24px;
            border: none;
            background: none;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.3s ease;
        }
        
        .tab-btn.active {
            border-bottom-color: #007bff;
            color: #007bff;
            font-weight: 600;
        }
        
        .tab-panel {
            display: none;
        }
        
        .tab-panel.active {
            display: block;
        }
        
        .badge {
            background: #ff6b6b;
            color: white;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .badge.top-month {
            background: #ffd93d;
            color: #333;
        }
        
        @media (max-width: 768px) {
            .product-body {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .product-title {
                font-size: 2rem;
            }
            
            .product-actions {
                flex-direction: column;
            }
            
            .btn {
                width: 100%;
            }
        }
        </style>`;
    }

    /**
     * Génère les badges du produit
     */
    generateBadges(produit) {
        const badges = [];
        
        if (produit.top_du_mois) {
            badges.push('<span class="badge top-month">⭐ Top du mois</span>');
        }
        
        if (produit.nouveau) {
            badges.push('<span class="badge new">🆕 Nouveau</span>');
        }
        
        return badges.join(' ');
    }

    /**
     * Génère la galerie d'images
     */
    generateImageGallery(produit) {
        const images = Array.isArray(produit.images) ? produit.images : [produit.image];
        const mainImage = images[0] || 'assets/images/default.jpg';
        
        return `
        <div class="image-gallery">
            <div class="main-image">
                <img src="${mainImage}" alt="${produit.nom}" id="mainProductImage">
            </div>
            ${images.length > 1 ? `
            <div class="image-thumbnails">
                ${images.map((img, index) => `
                    <img src="${img}" alt="${produit.nom}" 
                         onclick="changeMainImage('${img}')"
                         class="${index === 0 ? 'active' : ''}">
                `).join('')}
            </div>
            ` : ''}
        </div>
        
        <style>
        .image-gallery {
            position: sticky;
            top: 20px;
        }
        
        .main-image img {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .image-thumbnails {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            overflow-x: auto;
        }
        
        .image-thumbnails img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .image-thumbnails img.active,
        .image-thumbnails img:hover {
            opacity: 1;
            border: 2px solid #007bff;
        }
        </style>`;
    }

    /**
     * Génère les spécifications
     */
    generateSpecifications(produit) {
        if (!produit.specifications && !produit.dimensions && !produit.poids) {
            return '';
        }
        
        const specs = [];
        
        if (produit.dimensions) specs.push(['Dimensions', produit.dimensions]);
        if (produit.poids) specs.push(['Poids', produit.poids]);
        if (produit.puissance) specs.push(['Puissance', produit.puissance]);
        if (produit.capacite) specs.push(['Capacité', produit.capacite]);
        
        return `
        <div class="specifications">
            <h3>Spécifications</h3>
            <div class="spec-grid">
                ${specs.map(([label, value]) => `
                    <div class="spec-item">
                        <span class="spec-label">${label}:</span>
                        <span class="spec-value">${value}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <style>
        .spec-grid {
            display: grid;
            gap: 8px;
        }
        
        .spec-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        
        .spec-label {
            font-weight: 600;
            color: #495057;
        }
        
        .spec-value {
            color: #007bff;
        }
        </style>`;
    }

    /**
     * Affiche les produits similaires
     */
    displaySimilarProducts(produit, container) {
        const similaires = this.equipements
            .filter(eq => eq.id !== produit.id && eq.categorie === produit.categorie)
            .slice(0, 4);
        
        if (similaires.length === 0) return;
        
        const similarHTML = `
        <div class="similar-products">
            <h2>Produits similaires</h2>
            <div class="similar-grid">
                ${similaires.map(eq => `
                    <div class="similar-item" onclick="window.location.href='${eq.lien}'">
                        <img src="${eq.image}" alt="${eq.nom}">
                        <h4>${eq.nom}</h4>
                        <p class="price">${this.formatPrice(eq.prix)}/jour</p>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <style>
        .similar-products {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #dee2e6;
        }
        
        .similar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .similar-item {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        
        .similar-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
        
        .similar-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
        }
        
        .similar-item h4 {
            padding: 10px 15px 5px;
            margin: 0;
            font-size: 1rem;
        }
        
        .similar-item .price {
            padding: 0 15px 15px;
            margin: 0;
            color: #28a745;
            font-weight: 600;
        }
        </style>`;
        
        container.insertAdjacentHTML('beforeend', similarHTML);
    }

    /**
     * Génère une page pour un produit manquant
     */
    generateMissingProductPage() {
        const container = document.getElementById('product-container') || document.body;
        
        container.innerHTML = `
        <div class="missing-product">
            <div class="error-content">
                <h1>😕 Produit introuvable</h1>
                <p>Le produit que vous cherchez n'existe pas ou a été supprimé.</p>
                <div class="error-actions">
                    <button onclick="window.history.back()" class="btn btn-secondary">← Retour</button>
                    <a href="/produits.html" class="btn btn-primary">Voir tous les produits</a>
                </div>
            </div>
            
            <div class="suggested-products">
                <h2>Produits populaires</h2>
                <div class="products-grid">
                    ${this.equipements.filter(eq => eq.top_du_mois).slice(0, 3).map(eq => `
                        <div class="product-card" onclick="window.location.href='${eq.lien}'">
                            <img src="${eq.image}" alt="${eq.nom}">
                            <h3>${eq.nom}</h3>
                            <p class="price">${this.formatPrice(eq.prix)}/jour</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }

    /**
     * Affiche les produits top sur la page d'accueil
     */
    displayTopProducts() {
        const topProducts = this.equipements
            .filter(eq => eq.top_du_mois)
            .slice(0, 6);
        
        const container = document.getElementById('top-products-container');
        if (!container) return;
        
        container.innerHTML = `
        <div class="top-products-grid">
            ${topProducts.map(produit => `
                <div class="product-card" onclick="window.location.href='${produit.lien}'">
                    <div class="card-image">
                        <img src="${produit.image}" alt="${produit.nom}">
                        <span class="top-badge">⭐ Top</span>
                    </div>
                    <div class="card-content">
                        <h3>${produit.nom}</h3>
                        <p>${produit.description.substring(0, 100)}...</p>
                        <div class="card-footer">
                            <span class="price">${this.formatPrice(produit.prix)}/jour</span>
                            <span class="category">${produit.categorie}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        // Navigation par onglets
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.handleTabClick(e.target);
            }
        });
        
        // Recherche en temps réel
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    /**
     * Gestion des clics sur les onglets
     */
    handleTabClick(tabBtn) {
        const tabId = tabBtn.dataset.tab;
        
        // Désactiver tous les onglets
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Activer l'onglet cliqué
        tabBtn.classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    }

    /**
     * Utilitaires
     */
    formatPrice(prix) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(prix);
    }

    getStockLabel(stock) {
        const labels = {
            'disponible': '✅ Disponible',
            'loue': '🔒 Loué',
            'maintenance': '🔧 Maintenance',
            'reserve': '📅 Réservé'
        };
        return labels[stock] || '❓ État inconnu';
    }

    showError(message) {
        console.error('❌', message);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }

    /**
     * Génère les détails techniques
     */
    generateTechnicalDetails(produit) {
        return `
        <div class="technical-details">
            <h4>Caractéristiques techniques</h4>
            <div class="details-grid">
                ${produit.marque ? `<div class="detail-row"><span>Marque:</span> <span>${produit.marque}</span></div>` : ''}
                ${produit.dimensions ? `<div class="detail-row"><span>Dimensions:</span> <span>${produit.dimensions}</span></div>` : ''}
                ${produit.poids ? `<div class="detail-row"><span>Poids:</span> <span>${produit.poids}</span></div>` : ''}
                ${produit.puissance ? `<div class="detail-row"><span>Puissance:</span> <span>${produit.puissance}</span></div>` : ''}
                ${produit.capacite ? `<div class="detail-row"><span>Capacité:</span> <span>${produit.capacite}</span></div>` : ''}
                <div class="detail-row"><span>Référence:</span> <span>${produit.id}</span></div>
                <div class="detail-row"><span>Catégorie:</span> <span>${produit.categorie}</span></div>
            </div>
        </div>`;
    }

    /**
     * Génère les conditions de location
     */
    generateRentalConditions(produit) {
        return `
        <div class="rental-conditions">
            <h4>Conditions de location</h4>
            <ul>
                <li><strong>Tarif:</strong> ${this.formatPrice(produit.prix)} par jour</li>
                <li><strong>Caution:</strong> ${this.formatPrice(produit.prix * 2)} (restituée à la fin de la location)</li>
                <li><strong>Durée minimum:</strong> 1 jour</li>
                <li><strong>Réductions:</strong> -10% à partir de 7 jours, -15% à partir de 15 jours</li>
                <li><strong>État requis:</strong> Retour dans l'état de départ</li>
                <li><strong>Assurance:</strong> Incluse dans le prix</li>
            </ul>
            
            <h4>Documents requis</h4>
            <ul>
                <li>Pièce d'identité valide</li>
                <li>Justificatif de domicile récent</li>
                <li>Moyen de paiement pour la caution</li>
            </ul>
        </div>`;
    }

    /**
     * Génère les informations de livraison
     */
    generateDeliveryInfo(produit) {
        return `
        <div class="delivery-info">
            <h4>Options de livraison</h4>
            
            <div class="delivery-option">
                <h5>🏪 Retrait en magasin</h5>
                <p><strong>Gratuit</strong> - Du lundi au samedi, 8h-18h</p>
                <p>Adresse: 123 Rue de l'Équipement, 13000 Marseille</p>
            </div>
            
            <div class="delivery-option">
                <h5>🚚 Livraison standard</h5>
                <p><strong>15€</strong> - Livraison sous 24-48h</p>
                <p>Zone de livraison: Marseille et alentours (20km)</p>
            </div>
            
            <div class="delivery-option">
                <h5>⚡ Livraison express</h5>
                <p><strong>25€</strong> - Livraison le jour même</p>
                <p>Commande avant 12h pour livraison l'après-midi</p>
            </div>
            
            <div class="delivery-note">
                <p><em>💡 Livraison gratuite pour les commandes supérieures à 200€/jour</em></p>
            </div>
        </div>`;
    }

    /**
     * Met à jour les métadonnées SEO
     */
    updateSEOMetadata(produit) {
        // Meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', 
                `Location ${produit.nom} - ${produit.description.substring(0, 150)} | À partir de ${this.formatPrice(produit.prix)}/jour`
            );
        }
        
        // Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDesc = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');
        
        if (ogTitle) ogTitle.setAttribute('content', `${produit.nom} - Location`);
        if (ogDesc) ogDesc.setAttribute('content', produit.description);
        if (ogImage) ogImage.setAttribute('content', produit.image);
    }
}

/**
 * Fonctions globales pour l'interaction
 */
window.changeMainImage = function(imageSrc) {
    const mainImg = document.getElementById('mainProductImage');
    if (mainImg) {
        mainImg.src = imageSrc;
        
        // Mise à jour des miniatures actives
        document.querySelectorAll('.image-thumbnails img').forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.src === imageSrc) {
                thumb.classList.add('active');
            }
        });
    }
};

window.openReservationModal = function(productId) {
    const automatisation = window.automatisationFiches;
    const produit = automatisation.equipements.find(eq => eq.id === productId);
    
    if (!produit) {
        alert('Erreur: Produit introuvable');
        return;
    }
    
    // Création du modal de réservation
    const modal = document.createElement('div');
    modal.className = 'reservation-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeReservationModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>📅 Réserver ${produit.nom}</h3>
                <button class="modal-close" onclick="closeReservationModal()">×</button>
            </div>
            
            <div class="modal-body">
                <div class="product-summary">
                    <img src="${produit.image}" alt="${produit.nom}">
                    <div>
                        <h4>${produit.nom}</h4>
                        <p class="price">${automatisation.formatPrice(produit.prix)}/jour</p>
                    </div>
                </div>
                
                <form id="reservationForm" class="reservation-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="dateDebut">Date de début *</label>
                            <input type="date" id="dateDebut" required min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label for="dateFin">Date de fin *</label>
                            <input type="date" id="dateFin" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="clientNom">Nom complet *</label>
                        <input type="text" id="clientNom" required placeholder="Jean Dupont">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="clientEmail">Email *</label>
                            <input type="email" id="clientEmail" required placeholder="jean@example.com">
                        </div>
                        <div class="form-group">
                            <label for="clientTel">Téléphone *</label>
                            <input type="tel" id="clientTel" required placeholder="06 12 34 56 78">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="livraison">Mode de récupération</label>
                        <select id="livraison">
                            <option value="retrait">Retrait en magasin (gratuit)</option>
                            <option value="livraison">Livraison (+15€)</option>
                            <option value="express">Livraison express (+25€)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="commentaires">Commentaires</label>
                        <textarea id="commentaires" rows="3" placeholder="Informations supplémentaires..."></textarea>
                    </div>
                    
                    <div class="price-summary">
                        <div class="price-line">
                            <span>Durée:</span>
                            <span id="durationDisplay">- jours</span>
                        </div>
                        <div class="price-line">
                            <span>Prix/jour:</span>
                            <span>${automatisation.formatPrice(produit.prix)}</span>
                        </div>
                        <div class="price-line">
                            <span>Livraison:</span>
                            <span id="deliveryPrice">Gratuit</span>
                        </div>
                        <div class="price-line total">
                            <span>Total TTC:</span>
                            <span id="totalPrice">${automatisation.formatPrice(produit.prix)}</span>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" onclick="closeReservationModal()" class="btn btn-secondary">Annuler</button>
                        <button type="submit" class="btn btn-primary">Confirmer la réservation</button>
                    </div>
                </form>
            </div>
        </div>
        
        <style>
        .reservation-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
        }
        
        .modal-content {
            position: relative;
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 25px;
            border-bottom: 1px solid #eee;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
        }
        
        .modal-body {
            padding: 25px;
        }
        
        .product-summary {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .product-summary img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 6px;
        }
        
        .reservation-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .form-group label {
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 10px 12px;
            border: 2px solid #dee2e6;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #007bff;
        }
        
        .price-summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 10px;
        }
        
        .price-line {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .price-line.total {
            border-top: 2px solid #dee2e6;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 1.1em;
            color: #007bff;
        }
        
        .form-actions {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-top: 25px;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .form-actions {
                flex-direction: column;
            }
        }
        </style>
    `;
    
    document.body.appendChild(modal);
    
    // Configuration des événements du formulaire
    setupReservationForm(produit);
};

window.closeReservationModal = function() {
    const modal = document.querySelector('.reservation-modal');
    if (modal) {
        modal.remove();
    }
};

window.addToWishlist = function(productId) {
    const automatisation = window.automatisationFiches;
    const produit = automatisation.equipements.find(eq => eq.id === productId);
    
    // Récupération de la wishlist depuis localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (wishlist.includes(productId)) {
        // Retirer de la wishlist
        wishlist = wishlist.filter(id => id !== productId);
        automatisation.showNotification(`❤️ ${produit.nom} retiré des favoris`, 'info');
    } else {
        // Ajouter à la wishlist
        wishlist.push(productId);
        automatisation.showNotification(`❤️ ${produit.nom} ajouté aux favoris`, 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Mise à jour de l'interface
    updateWishlistUI();
};

window.shareProduct = function(productId) {
    const automatisation = window.automatisationFiches;
    const produit = automatisation.equipements.find(eq => eq.id === productId);
    
    if (navigator.share) {
        // API Web Share native
        navigator.share({
            title: `${produit.nom} - Location`,
            text: `${produit.description}`,
            url: window.location.href
        });
    } else {
        // Fallback: copier le lien
        navigator.clipboard.writeText(window.location.href).then(() => {
            automatisation.showNotification('🔗 Lien copié dans le presse-papier!', 'success');
        });
    }
};

function setupReservationForm(produit) {
    const form = document.getElementById('reservationForm');
    const dateDebut = document.getElementById('dateDebut');
    const dateFin = document.getElementById('dateFin');
    const livraison = document.getElementById('livraison');
    const durationDisplay = document.getElementById('durationDisplay');
    const deliveryPrice = document.getElementById('deliveryPrice');
    const totalPrice = document.getElementById('totalPrice');
    
    function calculatePrice() {
        const debut = new Date(dateDebut.value);
        const fin = new Date(dateFin.value);
        
        if (debut && fin && fin > debut) {
            const days = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));
            durationDisplay.textContent = `${days} jour${days > 1 ? 's' : ''}`;
            
            let dailyPrice = produit.prix;
            let total = dailyPrice * days;
            
            // Réductions pour location longue
            if (days >= 15) {
                total *= 0.85; // -15%
            } else if (days >= 7) {
                total *= 0.90; // -10%
            }
            
            // Frais de livraison
            let deliveryCost = 0;
            const deliveryOption = livraison.value;
            
            if (deliveryOption === 'livraison') {
                deliveryCost = total >= 200 ? 0 : 15;
            } else if (deliveryOption === 'express') {
                deliveryCost = total >= 200 ? 0 : 25;
            }
            
            deliveryPrice.textContent = deliveryCost === 0 ? 'Gratuit' : `${deliveryCost}€`;
            totalPrice.textContent = window.automatisationFiches.formatPrice(total + deliveryCost);
        }
    }
    
    // Événements pour recalculer le prix
    dateDebut.addEventListener('change', calculatePrice);
    dateFin.addEventListener('change', calculatePrice);
    livraison.addEventListener('change', calculatePrice);
    
    // Validation des dates
    dateDebut.addEventListener('change', function() {
        if (dateFin.value && new Date(dateFin.value) <= new Date(this.value)) {
            const nextDay = new Date(this.value);
            nextDay.setDate(nextDay.getDate() + 1);
            dateFin.value = nextDay.toISOString().split('T')[0];
        }
        dateFin.min = this.value;
        calculatePrice();
    });
    
    // Soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const reservationData = {
            produit: produit,
            dateDebut: dateDebut.value,
            dateFin: dateFin.value,
            client: {
                nom: document.getElementById('clientNom').value,
                email: document.getElementById('clientEmail').value,
                telephone: document.getElementById('clientTel').value
            },
            livraison: livraison.value,
            commentaires: document.getElementById('commentaires').value,
            total: totalPrice.textContent,
            timestamp: new Date().toISOString()
        };
        
        // Simulation d'envoi de la réservation
        processReservation(reservationData);
    });
}

function processReservation(data) {
    // Simulation d'une requête AJAX
    const loadingBtn = document.querySelector('.reservation-modal .btn-primary');
    const originalText = loadingBtn.textContent;
    
    loadingBtn.textContent = '⏳ Traitement...';
    loadingBtn.disabled = true;
    
    setTimeout(() => {
        // Sauvegarde locale de la réservation
        let reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        data.id = `RES_${Date.now()}`;
        reservations.push(data);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        
        // Message de confirmation
        window.automatisationFiches.showNotification(
            `✅ Réservation confirmée! Référence: ${data.id}`, 
            'success'
        );
        
        // Fermeture du modal
        closeReservationModal();
        
        // Redirection vers une page de confirmation (optionnel)
        // window.location.href = `/confirmation.html?ref=${data.id}`;
        
    }, 2000);
}

function updateWishlistUI() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const wishlistBtns = document.querySelectorAll('[onclick*="addToWishlist"]');
    
    wishlistBtns.forEach(btn => {
        const productId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (wishlist.includes(productId)) {
            btn.innerHTML = '💔 Retirer des favoris';
            btn.classList.add('in-wishlist');
        } else {
            btn.innerHTML = '❤️ Ajouter aux favoris';
            btn.classList.remove('in-wishlist');
        }
    });
}

// Extension de la classe automatisationFiches avec des méthodes supplémentaires
automatisationFiches.prototype.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        
        <style>
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            min-width: 300px;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success { border-left: 4px solid #28a745; }
        .notification-error { border-left: 4px solid #dc3545; }
        .notification-info { border-left: 4px solid #17a2b8; }
        .notification-warning { border-left: 4px solid #ffc107; }
        
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #666;
            margin-left: 15px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        </style>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
};

automatisationFiches.prototype.handleSearch = function(query) {
    if (query.length < 2) return;
    
    const results = this.equipements.filter(eq => 
        eq.nom.toLowerCase().includes(query.toLowerCase()) ||
        eq.description.toLowerCase().includes(query.toLowerCase()) ||
        eq.categorie.toLowerCase().includes(query.toLowerCase()) ||
        (eq.marque && eq.marque.toLowerCase().includes(query.toLowerCase()))
    );
    
    this.displaySearchResults(results, query);
};

automatisationFiches.prototype.displaySearchResults = function(results, query) {
    const container = document.getElementById('search-results') || document.getElementById('products-container');
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = `
        <div class="no-results">
            <h3>Aucun résultat pour "${query}"</h3>
            <p>Essayez avec d'autres mots-clés ou parcourez nos catégories.</p>
        </div>`;
        return;
    }
    
    container.innerHTML = `
    <div class="search-header">
        <h3>${results.length} résultat${results.length > 1 ? 's' : ''} pour "${query}"</h3>
    </div>
    <div class="products-grid">
        ${results.map(produit => `
            <div class="product-card" onclick="window.location.href='${produit.lien}'">
                <div class="card-image">
                    <img src="${produit.image}" alt="${produit.nom}">
                    ${produit.top_du_mois ? '<span class="top-badge">⭐ Top</span>' : ''}
                </div>
                <div class="card-content">
                    <h3>${produit.nom}</h3>
                    <p class="card-description">${produit.description.substring(0, 100)}...</p>
                    <div class="card-footer">
                        <span class="price">${this.formatPrice(produit.prix)}/jour</span>
                        <span class="category">${produit.categorie}</span>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>`;
};

automatisationFiches.prototype.setupFilters = function() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    if (categoryFilter) {
        // Peupler les catégories
        const categories = [...new Set(this.equipements.map(eq => eq.categorie))];
        categoryFilter.innerHTML = `
            <option value="">Toutes les catégories</option>
            ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        `;
        
        categoryFilter.addEventListener('change', () => this.applyFilters());
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', () => this.applyFilters());
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', () => this.applyFilters());
    }
};

automatisationFiches.prototype.applyFilters = function() {
    const categoryFilter = document.getElementById('category-filter')?.value;
    const priceFilter = document.getElementById('price-filter')?.value;
    const sortFilter = document.getElementById('sort-filter')?.value;
    
    let filtered = [...this.equipements];
    
    // Filtre par catégorie
    if (categoryFilter) {
        filtered = filtered.filter(eq => eq.categorie === categoryFilter);
    }
    
    // Filtre par prix
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(Number);
        filtered = filtered.filter(eq => {
            if (max) return eq.prix >= min && eq.prix <= max;
            return eq.prix >= min;
        });
    }
    
    // Tri
    if (sortFilter) {
        switch (sortFilter) {
            case 'price-asc':
                filtered.sort((a, b) => a.prix - b.prix);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.prix - a.prix);
                break;
            case 'name':
                filtered.sort((a, b) => a.nom.localeCompare(b.nom));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.top_du_mois ? 1 : 0) - (a.top_du_mois ? 1 : 0));
                break;
        }
    }
    
    this.displayFilteredProducts(filtered);
};

automatisationFiches.prototype.displayFilteredProducts = function(products) {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = `
    <div class="products-grid">
        ${products.map(produit => `
            <div class="product-card" onclick="window.location.href='${produit.lien}'">
                <div class="card-image">
                    <img src="${produit.image}" alt="${produit.nom}">
                    ${produit.top_du_mois ? '<span class="top-badge">⭐ Top</span>' : ''}
                </div>
                <div class="card-content">
                    <h3>${produit.nom}</h3>
                    <p class="card-description">${produit.description.substring(0, 100)}...</p>
                    <div class="card-footer">
                        <span class="price">${this.formatPrice(produit.prix)}/jour</span>
                        <span class="category">${produit.categorie}</span>
                    </div>
                </div>
            </div>
        `).join('')}
    </div>`;
};

automatisationFiches.prototype.displayAllProducts = function() {
    this.displayFilteredProducts(this.equipements);
};

// Initialisation automatique quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Démarrage automatisation Fiches...');
    window.automatisationFiches = new automatisationFiches();
});

// Export pour utilisation en module (optionnel)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = automatisationFiches;
}