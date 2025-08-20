// ====================================
// SCRIPT POUR LA PAGE FICHES - VERSION CORRIGÉE
// ====================================

// Variables globales
let currentCategory = '';
let currentProducts = [];

// Éléments DOM - avec vérification d'existence
const elements = {
    get titre() { return document.getElementById("titre-categorie"); },
    get desc() { return document.getElementById("desc-cat"); },
    get zone() { return document.getElementById("zone-fiches"); },
    get btnComparer() { return document.getElementById("btn-comparer"); },
    get btnRetour() { return document.getElementById("btn-retour"); },
    get zoneComparaison() { return document.getElementById("zone-comparaison"); },
    get comparaisonContent() { return document.getElementById("comparaison-content"); }
};

// ====================================
// INITIALISATION SÉCURISÉE
// ====================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initialisation de la page Fiches');
    
    try {
        // Vérifier que utils.js est chargé
        if (typeof utils === 'undefined' || typeof dataManager === 'undefined') {
            throw new Error('utils.js n\'est pas chargé correctement');
        }

        // Vérifier les éléments DOM
        if (!elements.zone || !elements.titre) {
            throw new Error('Éléments DOM manquants');
        }

        // Configurer le bouton retour
        setupReturnButton();
        
        // Initialiser la page
        await initializePage();
        
        console.log('✅ Page Fiches initialisée avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Erreur lors du chargement de la page: ' + error.message);
    }
});

// ====================================
// GESTION SÉCURISÉE DES ERREURS
// ====================================

function showError(message) {
    const zone = elements.zone;
    if (zone) {
        zone.innerHTML = `
            <div style="
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
    }
}

function showLoader() {
    const zone = elements.zone;
    if (zone) {
        zone.innerHTML = `
            <div style="
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
    }
}

// ====================================
// NAVIGATION
// ====================================

function setupReturnButton() {
    const btnRetour = elements.btnRetour;
    if (btnRetour) {
        btnRetour.addEventListener("click", () => {
            if (document.referrer && document.referrer.includes(window.location.origin)) {
                window.history.back();
            } else {
                window.location.href = 'top-du-mois.html';
            }
        });
    }
}

// ====================================
// INITIALISATION DE LA PAGE
// ====================================

async function initializePage() {
    try {
        // Afficher le loader
        showLoader();
        
        // Vérifier que dataManager existe
        if (typeof dataManager === 'undefined') {
            throw new Error('dataManager non trouvé - vérifiez que utils.js est chargé');
        }

        // Charger les données
        const data = await dataManager.loadData();
        if (!data || !Array.isArray(data)) {
            throw new Error('Données invalides ou vides');
        }

        // Récupérer la catégorie depuis l'URL
        const category = getUrlParam("cat");
        
        if (!category) {
            // Pas de catégorie = afficher toutes les catégories
            displayAllCategories(data);
            return;
        }
        
        // Filtrer les produits par catégorie
        const filteredProducts = filterByCategory(data, category);
        
        if (filteredProducts.length === 0) {
            displayCategoryNotFound(category);
            return;
        }
        
        // Afficher les produits de la catégorie
        currentCategory = category;
        currentProducts = filteredProducts;
        displayCategoryProducts(category, filteredProducts);
        setupComparison();
        
    } catch (error) {
        console.error('Erreur initializePage:', error);
        showError('Erreur lors du chargement: ' + error.message);
    }
}

// ====================================
// UTILITAIRES SIMPLIFIÉS
// ====================================

function getUrlParam(param) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || "";
    } catch (error) {
        console.error('Erreur getUrlParam:', error);
        return "";
    }
}

function normalizeCat(str) {
    if (!str) return '';
    return str.toUpperCase().replace(/\s|_/g, "");
}

function beautifyCat(cat) {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
}

function sanitizeId(str) {
    if (!str) return '';
    return str.replace(/\s/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
}

function filterByCategory(data, category) {
    if (!data || !Array.isArray(data) || !category) return [];
    
    return data.filter(item => 
        item && item.categorie && 
        normalizeCat(item.categorie) === normalizeCat(category)
    );
}

// ====================================
// AFFICHAGE DES CATÉGORIES
// ====================================

function displayAllCategories(data) {
    try {
        const categories = [...new Set(data.map(item => item.categorie))].filter(Boolean);
        
        if (elements.titre) elements.titre.textContent = "Choisis une catégorie";
        if (elements.desc) elements.desc.textContent = "Clique sur une catégorie pour découvrir ses équipements.";
        
        if (elements.zone) {
            elements.zone.innerHTML = categories.map(category => `
                <div class="fiche-produit category-selector">
                    <div class="category-link" data-category="${category}" style="cursor: pointer;">
                        <div class="overlay-text-produit">${category}</div>
                    </div>
                </div>
            `).join("");
            
            // Ajouter les événements de navigation
            setupCategoryNavigation();
        }
    } catch (error) {
        console.error('Erreur displayAllCategories:', error);
        showError('Erreur lors de l\'affichage des catégories');
    }
}

function setupCategoryNavigation() {
    const links = document.querySelectorAll('.category-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            if (category) {
                navigateToCategory(category);
            }
        });
    });
}

function navigateToCategory(category) {
    try {
        const newUrl = `${window.location.pathname}?cat=${encodeURIComponent(category)}`;
        window.history.pushState({}, '', newUrl);
        initializePage();
    } catch (error) {
        console.error('Erreur navigateToCategory:', error);
        window.location.href = `fiches.html?cat=${encodeURIComponent(category)}`;
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
// SYSTÈME DE COMPARAISON SIMPLIFIÉ
// ====================================

function setupComparison() {
    const btnComparer = elements.btnComparer;
    if (!btnComparer) return;
    
    try {
        // Supprimer les anciens event listeners
        const newBtn = btnComparer.cloneNode(true);
        btnComparer.parentNode.replaceChild(newBtn, btnComparer);
        
        // Mettre à jour la référence
        elements.btnComparer = newBtn;
        
        // Configurer le nouveau bouton
        newBtn.addEventListener('click', handleComparisonClick);
        
        // Écouter les changements de checkbox
        if (elements.zone) {
            elements.zone.addEventListener('change', function(e) {
                if (e.target && e.target.classList.contains('produit-checkbox')) {
                    updateComparisonCounter();
                }
            });
        }
        
        // Initialiser le compteur
        updateComparisonCounter();
        
    } catch (error) {
        console.error('Erreur setupComparison:', error);
    }
}

function updateComparisonCounter() {
    try {
        const btnComparer = elements.btnComparer;
        if (!btnComparer) return;
        
        const checkedBoxes = document.querySelectorAll('.produit-checkbox:checked');
        const count = checkedBoxes.length;
        
        if (count > 0) {
            btnComparer.textContent = `Comparer ${count} produit${count > 1 ? 's' : ''} sélectionné${count > 1 ? 's' : ''}`;
            btnComparer.style.background = '#007bff';
            btnComparer.disabled = false;
        } else {
            btnComparer.textContent = 'Comparer les produits sélectionnés';
            btnComparer.style.background = '#ccc';
            btnComparer.disabled = true;
        }
    } catch (error) {
        console.error('Erreur updateComparisonCounter:', error);
    }
}

function handleComparisonClick() {
    try {
        const checkboxes = document.querySelectorAll('.produit-checkbox:checked');
        
        if (checkboxes.length === 0) {
            alert("Veuillez sélectionner au moins un produit à comparer.");
            return;
        }
        
        const selectedProducts = Array.from(checkboxes)
            .map(checkbox => {
                const productName = checkbox.getAttribute('data-id');
                return currentProducts.find(item => item && item.nom === productName);
            })
            .filter(Boolean);
        
        if (selectedProducts.length > 0) {
            displayComparison(selectedProducts);
        }
        
    } catch (error) {
        console.error('Erreur handleComparisonClick:', error);
        alert('Erreur lors de la comparaison');
    }
}

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
// STYLE POUR L'ANIMATION
// ====================================

// Ajouter les styles d'animation si nécessaire
if (!document.querySelector('#fiches-styles')) {
    const style = document.createElement('style');
    style.id = 'fiches-styles';
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Script fiches.js chargé avec gestion d\'erreurs renforcée');