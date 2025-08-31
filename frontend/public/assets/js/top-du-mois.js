// assets/js/top-du-mois.js - Connexion à PostgreSQL pour la page top-du-mois.html

// Configuration API
const API_URL = (() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = '3000';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    
    return `${protocol}//${hostname}:${port}/api`;
})();

// Variables globales
let produitsParCategorie = {};
let categoriesAvecTop = new Set();

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    // Afficher la date du mois si l'élément existe
    afficherDateMois();
    
    // Charger les produits depuis PostgreSQL
    await chargerProduitsDepuisBDD();
    
    // Mettre à jour les badges vedettes
    mettreAJourBadgesVedettes();
    
    // Configurer les liens des catégories
    configurerLiensCategories();
});

// Afficher la date du mois actuel
function afficherDateMois() {
    const dateElement = document.getElementById('date-mois');
    if (dateElement) {
        const mois = new Date().toLocaleDateString('fr-FR', { 
            month: 'long', 
            year: 'numeric' 
        });
        dateElement.textContent = `📅 ${mois.charAt(0).toUpperCase() + mois.slice(1)}`;
    }
}

// Charger tous les produits depuis PostgreSQL
async function chargerProduitsDepuisBDD() {
    try {
        const response = await fetch(`${API_URL}/produits`);
        const data = await response.json();
        
        if (data.success && data.data) {
            // Organiser les produits par catégorie
            data.data.forEach(produit => {
                if (produit.categorie) {
                    if (!produitsParCategorie[produit.categorie]) {
                        produitsParCategorie[produit.categorie] = [];
                    }
                    produitsParCategorie[produit.categorie].push(produit);
                    
                    // Marquer les catégories qui ont des produits "top du mois"
                    if (produit.top_du_mois) {
                        categoriesAvecTop.add(produit.categorie);
                    }
                }
            });
            // Afficher le nombre de produits par catégorie
            Object.keys(produitsParCategorie).forEach(cat => {
            });
            
        } else {
            console.warn('⚠️ Aucun produit trouvé dans la base');
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error);
        afficherNotification('Impossible de charger les produits. Vérifiez que le serveur est lancé.', 'error');
    }
}

// Mettre à jour les badges vedettes sur les catégories
function mettreAJourBadgesVedettes() {
    // Pour chaque carte de catégorie
    document.querySelectorAll('.category-card').forEach(card => {
        const categorie = card.dataset.category;
        
        if (categorie && categoriesAvecTop.has(categorie)) {
            // Ajouter un badge vedette si la catégorie a des produits top
            const overlayText = card.querySelector('.overlay-text');
            if (overlayText && !overlayText.querySelector('.vedette-badge')) {
                const badge = document.createElement('span');
                badge.className = 'vedette-badge';
                badge.innerHTML = '🔥 TOP';
                badge.style.cssText = `
                    background: linear-gradient(45deg, #ff6b6b, #ffd700);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: bold;
                    display: inline-block;
                    margin-left: 8px;
                    animation: pulse 2s infinite;
                `;
                overlayText.appendChild(badge);
            }
            
            // Ajouter un effet visuel sur le bloc
            const bloc = card.querySelector('.bloc');
            if (bloc) {
                bloc.style.border = '3px solid #ffd700';
                bloc.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.5)';
            }
        }
    });
    
    // Ajouter l'animation pulse si elle n'existe pas
    if (!document.querySelector('#pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Configurer les liens des catégories
function configurerLiensCategories() {
    document.querySelectorAll('.category-card').forEach(card => {
        const categorie = card.dataset.category;
        
        if (categorie) {
            // Mettre à jour le href pour pointer vers fiches.html avec le bon paramètre
            card.href = `fiches.html?categorie=${encodeURIComponent(categorie)}`;
            
            // Ajouter un compteur de produits
            const produitsCount = produitsParCategorie[categorie]?.length || 0;
            const topCount = produitsParCategorie[categorie]?.filter(p => p.top_du_mois).length || 0;
            
            const overlayText = card.querySelector('.overlay-text');
            if (overlayText && produitsCount > 0) {
                // Créer un élément pour afficher le nombre de produits
                const countBadge = document.createElement('div');
                countBadge.className = 'product-count';
                countBadge.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: bold;
                `;
                
                if (topCount > 0) {
                    countBadge.innerHTML = `${produitsCount} produits<br><span style="color: #ffd700;">⭐ ${topCount} TOP</span>`;
                } else {
                    countBadge.textContent = `${produitsCount} produits`;
                }
                
                card.querySelector('.bloc').appendChild(countBadge);
            }
        }
        
        // Ajouter un effet hover amélioré
        card.addEventListener('mouseenter', function() {
            if (categorie && produitsParCategorie[categorie]) {
                afficherApercu(categorie, this);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            masquerApercu();
        });
    });
}

// Afficher un aperçu des produits au survol
function afficherApercu(categorie, element) {
    // Supprimer l'aperçu existant s'il y en a un
    masquerApercu();
    
    const produits = produitsParCategorie[categorie];
    if (!produits || produits.length === 0) return;
    
    // Créer l'élément d'aperçu
    const apercu = document.createElement('div');
    apercu.id = 'apercu-produits';
    apercu.className = 'apercu-produits';
    apercu.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.95);
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 1000;
        min-width: 250px;
        max-width: 350px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        animation: fadeIn 0.3s ease;
    `;
    
    // Contenu de l'aperçu
    const topProduits = produits.filter(p => p.top_du_mois).slice(0, 3);
    const autresProduits = produits.filter(p => !p.top_du_mois).slice(0, 2);
    
    let contenuHTML = `<h4 style="margin: 0 0 10px 0; color: #ffd700;">📦 ${categorie}</h4>`;
    
    if (topProduits.length > 0) {
        contenuHTML += '<div style="margin-bottom: 10px;"><strong style="color: #ffd700;">⭐ Top du mois:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
        topProduits.forEach(p => {
            contenuHTML += `<li style="margin: 3px 0;">${p.nom} ${p.prix ? '- ' + p.prix : ''}</li>`;
        });
        contenuHTML += '</ul></div>';
    }
    
    if (autresProduits.length > 0) {
        contenuHTML += '<div><strong>Autres produits:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
        autresProduits.forEach(p => {
            contenuHTML += `<li style="margin: 3px 0;">${p.nom}</li>`;
        });
        contenuHTML += '</ul></div>';
    }
    
    contenuHTML += `<div style="margin-top: 10px; font-size: 12px; color: #aaa;">Cliquez pour voir tous les ${produits.length} produits →</div>`;
    
    apercu.innerHTML = contenuHTML;
    
    // Positionner l'aperçu
    const rect = element.getBoundingClientRect();
    apercu.style.left = rect.right + 10 + 'px';
    apercu.style.top = rect.top + 'px';
    
    // Si l'aperçu dépasse à droite, le mettre à gauche
    document.body.appendChild(apercu);
    const apercuRect = apercu.getBoundingClientRect();
    if (apercuRect.right > window.innerWidth) {
        apercu.style.left = (rect.left - apercuRect.width - 10) + 'px';
    }
    
    document.body.appendChild(apercu);
}

// Masquer l'aperçu
function masquerApercu() {
    const apercu = document.getElementById('apercu-produits');
    if (apercu) {
        apercu.remove();
    }
}

// Afficher une notification
function afficherNotification(message, type = 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    // Style selon le type
    const styles = {
        'success': 'background: linear-gradient(45deg, #28a745, #20c997);',
        'error': 'background: linear-gradient(45deg, #dc3545, #c82333);',
        'info': 'background: linear-gradient(45deg, #17a2b8, #138496);',
        'warning': 'background: linear-gradient(45deg, #ffc107, #e0a800);'
    };
    
    notification.style.cssText += styles[type] || styles['info'];
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Ajouter les animations si elles n'existent pas
if (!document.querySelector('#notifications-animations')) {
    const style = document.createElement('style');
    style.id = 'notifications-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Fonction pour vérifier la connexion au serveur
async function verifierConnexionServeur() {
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        
        if (data.success) {
            afficherNotification('Connexion au serveur réussie!', 'success');
            return true;
        }
    } catch (error) {
        console.error('❌ Serveur non accessible:', error);
        afficherNotification('⚠️ Le serveur n\'est pas lancé. Lancez: node server.js', 'error');
        return false;
    }
}

// Vérifier la connexion au démarrage
verifierConnexionServeur();

// Rafraîchir les données toutes les 30 secondes
setInterval(async () => {
    await chargerProduitsDepuisBDD();
    mettreAJourBadgesVedettes();
}, 30000);

// Export pour utilisation dans d'autres scripts si nécessaire
window.topDuMois = {
    API_URL,
    produitsParCategorie,
    categoriesAvecTop,
    chargerProduitsDepuisBDD,
    afficherNotification
};