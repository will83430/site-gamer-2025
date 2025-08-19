// assets/js/utils.js - Fonctions utilitaires partagées

// Configuration globale
const CONFIG = {
    API_URL: 'http://localhost:3000/api',
    DEFAULT_IMAGE: 'assets/images/placeholder.png',
    ITEMS_PER_PAGE: 12
};

// Gestionnaire d'erreurs global
window.addEventListener('error', (event) => {
    console.error('Erreur globale:', event.error);
});

// Fonction pour formater les prix
function formatPrix(prix) {
    if (!prix) return 'Prix non communiqué';
    
    // Si le prix contient déjà le symbole €, le retourner tel quel
    if (prix.toString().includes('€')) {
        return prix;
    }
    
    // Sinon, ajouter le symbole €
    return `${prix} €`;
}

// Fonction pour charger une image avec fallback
function loadImageWithFallback(imageUrl, fallbackUrl = CONFIG.DEFAULT_IMAGE) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(imageUrl);
        img.onerror = () => resolve(fallbackUrl);
        img.src = imageUrl;
    });
}

// Fonction pour faire une requête API
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${CONFIG.API_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur API:', error);
        throw error;
    }
}

// Fonction pour créer un élément HTML
function createElement(tag, className, content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

// Fonction pour afficher un message toast
function showToast(message, type = 'info') {
    // Supprimer les toasts existants
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = createElement('div', `toast toast-${type}`, message);
    document.body.appendChild(toast);
    
    // Animation d'entrée
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Suppression automatique après 3 secondes
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fonction pour débouncer (limiter le taux d'appel)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Fonction pour parser les paramètres d'URL
function getUrlParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    return params;
}

// Fonction pour mettre à jour l'URL sans recharger la page
function updateUrl(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key]);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
}

// Fonction pour stocker dans le localStorage
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Erreur localStorage:', error);
        return false;
    }
}

// Fonction pour récupérer depuis le localStorage
function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Erreur localStorage:', error);
        return null;
    }
}

// Fonction pour formater une date
function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    return d.toLocaleDateString('fr-FR', options);
}

// Fonction pour tronquer un texte
function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Fonction pour valider une URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        // Si ce n'est pas une URL complète, vérifier si c'est un chemin relatif
        return string.startsWith('/') || string.startsWith('./') || string.startsWith('../');
    }
}

// Fonction pour créer un loader
function showLoader(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
            <p>Chargement en cours...</p>
        </div>
    `;
}

// Fonction pour masquer le loader
function hideLoader(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const loader = container.querySelector('.loader-container');
    if (loader) {
        loader.remove();
    }
}

// Fonction pour gérer le lazy loading des images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Fonction pour exporter des données en CSV
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        showToast('Aucune donnée à exporter', 'warning');
        return;
    }
    
    // Obtenir les en-têtes
    const headers = Object.keys(data[0]);
    
    // Créer le contenu CSV
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Échapper les virgules et guillemets
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csv += values.join(',') + '\n';
    });
    
    // Créer un blob et télécharger
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// Fonction pour copier dans le presse-papier
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copié dans le presse-papier!', 'success');
        return true;
    } catch (error) {
        console.error('Erreur copie:', error);
        showToast('Erreur lors de la copie', 'error');
        return false;
    }
}

// Fonction pour vérifier la connexion à l'API
async function checkApiConnection() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/test`);
        const data = await response.json();
        return data.success === true;
    } catch (error) {
        console.error('API non disponible:', error);
        return false;
    }
}

// Fonction d'initialisation à appeler au chargement
async function initializeApp() {
    // Vérifier la connexion API
    const apiConnected = await checkApiConnection();
    
    if (!apiConnected) {
        showToast('⚠️ Connexion au serveur impossible. Vérifiez que le serveur est lancé.', 'error');
        console.error('Le serveur Node.js n\'est pas accessible sur http://localhost:3000');
    }
    
    // Setup lazy loading
    setupLazyLoading();
    
    return apiConnected;
}

// Styles CSS pour les toasts (à ajouter au CSS principal)
const toastStyles = `
<style>
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 9999;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s;
    max-width: 300px;
}

.toast.show {
    opacity: 1;
    transform: translateY(0);
}

.toast-success {
    background: #28a745;
}

.toast-error {
    background: #dc3545;
}

.toast-warning {
    background: #ffc107;
    color: #333;
}

.toast-info {
    background: #17a2b8;
}

.loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.loader {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
`;

// Ajouter les styles au document
if (!document.getElementById('toast-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'toast-styles';
    styleElement.innerHTML = toastStyles;
    document.head.appendChild(styleElement.firstChild);
}

// Exporter les fonctions pour utilisation globale
window.utils = {
    CONFIG,
    formatPrix,
    loadImageWithFallback,
    apiRequest,
    createElement,
    showToast,
    debounce,
    getUrlParams,
    updateUrl,
    saveToLocalStorage,
    getFromLocalStorage,
    formatDate,
    truncateText,
    isValidUrl,
    showLoader,
    hideLoader,
    setupLazyLoading,
    exportToCSV,
    copyToClipboard,
    checkApiConnection,
    initializeApp
};