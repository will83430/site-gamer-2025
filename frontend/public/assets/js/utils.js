// ====================================
// UTILITAIRES JAVASCRIPT PARTAGÉS
// ====================================

// Cache global pour les données
let cachedData = null;

// Configuration globale
const CONFIG = {
    JSON_PATH: 'data/equipements.json',
    PLACEHOLDER_PREFIX: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23f0f0f0"/%3E%3Ctext x="150" y="100" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="%23999"%3E',
    PLACEHOLDER_SUFFIX: '%3C/text%3E%3C/svg%3E'
};

// ====================================
// UTILITAIRES DE BASE
// ====================================

const utils = {
    // Normalise une catégorie pour la comparaison
    normalizeCat: (str) => {
        if (!str) return '';
        return str.toUpperCase().replace(/\s|_/g, "");
    },

    // Beautifie le nom d'une catégorie
    beautifyCat: (cat) => {
        if (!cat) return '';
        return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
    },

    // Récupère un paramètre d'URL
    getUrlParam: (param) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || "";
    },

    // Sanitise un ID pour éviter les caractères problématiques
    sanitizeId: (str) => {
        if (!str) return '';
        return str.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
    },

    // Crée un placeholder SVG pour les images cassées
    createPlaceholder: (text) => {
        if (!text) text = 'Image';
        return `${CONFIG.PLACEHOLDER_PREFIX}${encodeURIComponent(text)}${CONFIG.PLACEHOLDER_SUFFIX}`;
    },

    // Gère les erreurs d'images avec fallback intelligent
    handleImageError: (img, fallbackText) => {
        // Éviter la boucle infinie en vérifiant si c'est déjà un placeholder
        if (img.src.includes('data:image/svg+xml')) {
            img.style.display = 'none';
            return;
        }
        img.src = utils.createPlaceholder(fallbackText);
    },

    // Debounce pour optimiser les performances
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Scroll fluide vers un élément
    scrollToElement: (element, offset = 0) => {
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    // Vérifie si un élément est visible dans le viewport
    isElementVisible: (element) => {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Formatage de nombres
    formatNumber: (num) => {
        if (!num) return '0';
        return new Intl.NumberFormat('fr-FR').format(num);
    },

    // Formatage de prix
    formatPrice: (price) => {
        if (!price) return 'Non disponible';
        // Si c'est déjà formaté, le retourner tel quel
        if (typeof price === 'string' && (price.includes('€') || price.includes('À partir'))) {
            return price;
        }
        // Sinon, essayer de formater comme un nombre
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return price;
        return `${utils.formatNumber(numPrice)} €`;
    }
};

// ====================================
// GESTION DES DONNÉES
// ====================================

const dataManager = {
    // Charge les données une seule fois avec cache
    async loadData() {
        if (cachedData) {
            return cachedData;
        }

        try {
            const response = await fetch(CONFIG.JSON_PATH);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            cachedData = await response.json();
            console.log(`✅ Données chargées: ${cachedData.length} équipements`);
            return cachedData;
        } catch (error) {
            console.error("❌ Erreur lors du chargement des données:", error);
            throw error;
        }
    },

    // Filtre les produits par catégorie
    filterByCategory(data, category) {
        if (!data || !category) return [];
        
        return data.filter(item => 
            utils.normalizeCat(item.categorie) === utils.normalizeCat(category)
        );
    },

    // Récupère les catégories uniques
    getCategories(data) {
        if (!data) return [];
        return [...new Set(data.map(item => item.categorie))].sort();
    },

    // Récupère les produits vedettes
    getFeaturedProducts(data) {
        if (!data) return [];
        return data.filter(item => item.top_du_mois === true);
    },

    // Récupère les catégories vedettes
    getFeaturedCategories(data) {
        const featuredProducts = this.getFeaturedProducts(data);
        return [...new Set(featuredProducts.map(item => item.categorie.trim().toUpperCase()))];
    }
};

// ====================================
// GESTION DE L'UI
// ====================================

const uiManager = {
    // Affiche un message d'erreur
    showError(container, message) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message" style="
                text-align: center;
                color: #c0392b;
                background: #ffeaa7;
                padding: 20px;
                border-radius: 8px;
                margin: 20px auto;
                max-width: 600px;
                border: 1px solid #fdcb6e;
            ">
                <strong>⚠️ Erreur</strong><br>
                ${message}
            </div>
        `;
    },

    // Affiche un loader
    showLoader(container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="loader" style="
                text-align: center;
                padding: 40px;
                color: white;
                font-size: 1.2rem;
            ">
                <div style="
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 15px;
                "></div>
                <br>Chargement en cours...
            </div>
        `;
    },

    // Animation de fondu
    fadeIn(element, duration = 300) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    // Notification toast
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const colors = {
            success: '#2ecc71',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animation d'entrée
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // Suppression automatique
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
};

// ====================================
// STYLES D'ANIMATION POUR LE LOADER
// ====================================

// Ajouter les styles d'animation si ils n'existent pas
if (!document.querySelector('#utils-styles')) {
    const style = document.createElement('style');
    style.id = 'utils-styles';
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// ====================================
// EXPORT GLOBAL
// ====================================

// Rendre les utilitaires disponibles globalement
window.utils = utils;
window.dataManager = dataManager;
window.uiManager = uiManager;
window.CONFIG = CONFIG;