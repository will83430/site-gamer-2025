// ====================================
// SYSTÈME D'AFFICHAGE DES FICHES COMPLÈTES
// ====================================

// Ajout dans utils.js - Gestion des fiches complètes
const ficheManager = {
    // Construit l'URL correcte vers une fiche produit
    buildFicheUrl(product) {
        if (!product || !product.nom || !product.categorie) {
            console.warn('Produit invalide pour buildFicheUrl:', product);
            return '#';
        }

        // Mapping des catégories vers leurs dossiers
        const categoryFolders = {
            'PC GAMING': 'pc-gaming',
            'SERVEUR': 'serveur',
            'PERIPHERIQUES': 'peripheriques',
            'TABLETTE': 'tablette',
            'SMARTPHONE': 'smartphone',
            'MONTRE CONNECTE': 'montre-connecte',
            'ECRAN TV': 'ecran-tv',
            'CAMERA': 'camera',
            'VIDEO PROJECTEUR': 'video-projecteur',
            'BOX INTERNET': 'box-internet',
            'CASQUE AUDIO': 'casque-audio',
            'TABLEAU INTERACTIF': 'tableau-interactif',
            'CONSOLE': 'console',
            'CASQUE VR': 'casque-vr',
            'IMPRIMANTE 3D': 'imprimante-3d',
            'DRONE': 'drone'
        };

        const folder = categoryFolders[product.categorie.toUpperCase()];
        if (!folder) {
            console.warn('Dossier non trouvé pour la catégorie:', product.categorie);
            return '#';
        }

        // Nettoyer le nom du produit pour créer le fichier HTML
        const fileName = this.sanitizeFileName(product.nom);
        
        return `fiches-produits/${folder}/${fileName}.html`;
    },

    // Nettoie un nom de produit pour en faire un nom de fichier
    sanitizeFileName(productName) {
        return productName
            .replace(/\s+/g, ' ')           // Normaliser les espaces
            .replace(/[\/\\:*?"<>|]/g, '')  // Supprimer caractères interdits
            .trim();
    },

    // Vérifie si une fiche existe (optionnel - pour validation)
    async checkFicheExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    // Ouvre une fiche dans une nouvelle fenêtre/onglet
    openFiche(product, target = '_blank') {
        const url = this.buildFicheUrl(product);
        
        if (url === '#') {
            uiManager.showToast('Fiche non disponible pour ce produit', 'warning');
            return;
        }

        // Ouvrir dans nouvel onglet ou même fenêtre
        if (target === '_blank') {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            window.location.href = url;
        }
    },

    // Crée un modal pour afficher la fiche (alternative)
    async showFicheModal(product) {
        const url = this.buildFicheUrl(product);
        
        if (url === '#') {
            uiManager.showToast('Fiche non disponible', 'warning');
            return;
        }

        // Créer le modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.cssText = `
            width: 90%;
            height: 90%;
            max-width: 1000px;
            border: none;
            border-radius: 10px;
            background: white;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            z-index: 10001;
        `;

        closeBtn.onclick = () => document.body.removeChild(modal);
        modal.onclick = (e) => {
            if (e.target === modal) document.body.removeChild(modal);
        };

        modal.appendChild(iframe);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);
    }
};

// ====================================
// MISE À JOUR DE LA FONCTION displayComparison
// ====================================

// Dans fiches.js - Remplacer la fonction displayComparison existante
function displayComparison(products) {
    try {
        const zoneComparaison = elements.zoneComparaison;
        const comparaisonContent = elements.comparaisonContent;
        
        if (!zoneComparaison || !comparaisonContent) return;
        
        zoneComparaison.classList.remove('hidden');
        
        comparaisonContent.innerHTML = products.map(product => {
            const features = [];
            
            if (product.prix) {
                features.push(`💰 Prix : ${product.prix}`);
            }
            
            if (Array.isArray(product.fonctionnalites_avancees) && product.fonctionnalites_avancees.length > 0) {
                const functionsHTML = product.fonctionnalites_avancees.join('');
                features.push(`⚙️ Fonctionnalités avancées : ${functionsHTML}`);
            }
            
            return `
                <div class="fiche-comparaison">
                    <h4>${product.nom || 'Produit'}</h4>
                    <img src="${product.image || ''}" 
                         alt="${product.nom || 'Produit'}"
                         onerror="this.style.display='none';" />
                    ${features.map(feature => `<p class="info">${feature}</p>`).join("")}
                    <button class="btn-details" 
                            onclick="ficheManager.openFiche(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        Voir la fiche complète
                    </button>
                </div>
            `;
        }).join("");
        
        // Scroll vers la zone de comparaison
        zoneComparaison.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erreur displayComparison:', error);
        alert('Erreur lors de l\'affichage de la comparaison');
    }
}

// ====================================
// AJOUT DES LIENS DANS LES FICHES PRODUITS
// ====================================

// Dans fiches.js - Modifier displayCategoryProducts pour ajouter les liens
function displayCategoryProducts(category, products) {
    try {
        if (elements.titre) {
            elements.titre.textContent = `Catégorie : ${beautifyCat(category)}`;
        }
        if (elements.desc) {
            elements.desc.textContent = `${products.length} produit(s) disponible(s)`;
        }
        
        if (elements.zone) {
            elements.zone.innerHTML = products.map(product => {
                const productId = sanitizeId(product.nom || 'produit');
                const productName = product.nom || 'Produit sans nom';
                const productPrice = product.prix || 'Non disponible';
                const productDesc = product.description || 'Aucune description';
                const productImage = product.image || '';
                
                return `
                    <div class="fiche-produit" data-product-id="${productId}">
                        <input type="checkbox" 
                               class="produit-checkbox" 
                               id="produit-${productId}" 
                               data-id="${productName}">
                        <div class="product-content" onclick="ficheManager.openFiche(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <img src="${productImage}" 
                                 alt="${productName}"
                                 loading="lazy"
                                 onerror="this.style.display='none';" />
                            <div class="overlay-text-produit">
                                ${productName}
                                ${product.top_du_mois ? `<span class="vedette-badge">⭐</span>` : ""}
                            </div>
                        </div>
                        <p class="info">Prix : ${productPrice}</p>
                        <p class="info">${productDesc}</p>
                        <button class="btn-fiche-complete" 
                                onclick="ficheManager.openFiche(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            Voir la fiche
                        </button>
                    </div>
                `;
            }).join("");
        }
        
    } catch (error) {
        console.error('Erreur displayCategoryProducts:', error);
        showError('Erreur lors de l\'affichage des produits');
    }
}

// ====================================
// STYLES CSS À AJOUTER
// ====================================

// À ajouter dans styles.css
const additionalCSS = `
.product-content {
    cursor: pointer;
    transition: transform 0.2s ease;
}

.product-content:hover {
    transform: scale(1.02);
}

.btn-fiche-complete {
    margin-top: 10px;
    padding: 8px 16px;
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    width: 100%;
}

.btn-fiche-complete:hover {
    background: linear-gradient(45deg, #0056b3, #004494);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-details {
    display: inline-block;
    margin-top: 10px;
    padding: 8px 12px;
    background: linear-gradient(45deg, #007bff, #0056b3);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn-details:hover {
    background: linear-gradient(45deg, #0056b3, #004494);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}
`;

// ====================================
// INITIALISATION
// ====================================

// Ajouter ficheManager aux utilitaires globaux
window.ficheManager = ficheManager;

// Ajouter les styles au chargement
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les styles si pas déjà présents
    if (!document.querySelector('#fiche-complete-styles')) {
        const style = document.createElement('style');
        style.id = 'fiche-complete-styles';
        style.textContent = additionalCSS;
        document.head.appendChild(style);
    }
});

console.log('✅ Système de fiches complètes initialisé');