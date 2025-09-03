// assets/js/fiches.js - Connexion à la base de données PostgreSQL

// Configuration de l'API
const API_URL = (() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = '3000';
    // Si localhost ou 127.0.0.1, utiliser localhost explicitement
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    
    // Sinon utiliser l'IP détectée
    return `${protocol}//${hostname}:${port}/api`;
})();
// Variables globales
let produitsSelectionnes = [];
let categorieActuelle = '';
let tousLesProduits = []; // Cache pour tous les produits
let statsCache = null; // Cache pour les stats

const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    // Charger une seule fois tous les produits au démarrage
    await chargerTousLesProduits();
    
    // Récupérer la catégorie depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    categorieActuelle = urlParams.get('categorie') || '';
    
    if (categorieActuelle) {
        afficherProduitsCategorie(categorieActuelle);
    } else {
        afficherToutesCategories();
    }
    
    // Configurer les boutons
    setupEventListeners();
});

// Charger TOUS les produits UNE SEULE FOIS et les mettre en cache
async function chargerTousLesProduits() {
    console.log('🔄 Chargement des produits...');
    
    // 1. Essayer le cache en premier
    const cachedProduits = cacheManager.get('produits');
    if (cachedProduits) {
        tousLesProduits = cachedProduits;
        console.log(`✅ ${cachedProduits.length} produits chargés depuis le cache`);
        return;
    }
    
    // 2. Si pas de cache, charger depuis l'API
    try {
        const startTime = performance.now();
        const response = await fetch(`${API_URL}/produits`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const loadTime = Math.round(performance.now() - startTime);
        
        if (data.success && Array.isArray(data.data)) {
            tousLesProduits = data.data;
            
            // 3. Sauvegarder en cache
            cacheManager.set('produits', data.data);
            
            console.log(`🌐 ${data.data.length} produits chargés depuis l'API (${loadTime}ms)`);
        } else {
            throw new Error('Format de données invalide');
        }
        
    } catch (error) {
        console.error('❌ Erreur chargement produits:', error);
        
        // 4. Fallback: essayer un cache expiré en cas d'erreur réseau
        const expiredCache = localStorage.getItem(cacheManager.generateKey('produits'));
        if (expiredCache) {
            try {
                const fallbackData = JSON.parse(expiredCache);
                tousLesProduits = fallbackData.data;
                console.log('🔄 Utilisation du cache expiré comme fallback');
                return;
            } catch (e) {}
        }
        
        // 5. Si tout échoue, données par défaut
        tousLesProduits = [];
        afficherErreurChargement(error.message);
    }
}

// Afficher les produits d'une catégorie (depuis le cache)
function afficherProduitsCategorie(categorie) {
    const cacheKey = `categorie-${categorie.toLowerCase()}`;
    
    // Vérifier cache
    const cachedCategory = cacheManager.get('categories', categorie.toLowerCase());
    if (cachedCategory) {
        console.log(`📂 Catégorie "${categorie}" depuis cache`);
        
        // Utiliser la fonction d'affichage qui existe
        if (typeof afficherProduitsAvecPagination === 'function') {
            afficherProduitsAvecPagination(cachedCategory);
        } else {
            afficherProduits(cachedCategory);
        }
        
        // Mettre à jour le titre si l'élément existe
        const titreElement = document.getElementById('titre-categorie');
        if (titreElement) {
            titreElement.textContent = formatTitreCategorie(categorie);
        }
        return;
    }
    
    // Filtrer et mettre en cache
    const produitsFilters = tousLesProduits.filter(p => 
        p.categorie && p.categorie.toLowerCase() === categorie.toLowerCase()
    );
    
    cacheManager.set('categories', produitsFilters, categorie.toLowerCase());
    
    // Afficher les produits
    if (typeof afficherProduitsAvecPagination === 'function') {
        afficherProduitsAvecPagination(produitsFilters);
    } else {
        afficherProduits(produitsFilters);
    }
    
    // Mettre à jour le titre
    const titreElement = document.getElementById('titre-categorie');
    if (titreElement) {
        titreElement.textContent = formatTitreCategorie(categorie);
    }
}

// Afficher toutes les catégories disponibles (depuis le cache)
function afficherToutesCategories() {
    const titreElement = document.getElementById('titre-categorie');
    titreElement.textContent = 'Toutes les catégories';
    
    if (tousLesProduits && tousLesProduits.length > 0) {
        // Extraire les catégories depuis le cache
        const categories = [...new Set(tousLesProduits.map(p => p.categorie).filter(c => c))];
        afficherListeCategories(categories);
    } else {
        afficherListeCategories([]);
    }
}

// Afficher les produits dans la grille
// Remplacez TOUTE la fonction afficherProduits dans fiches.js par ceci :

function afficherProduits(produits) {
    const zonefiches = document.getElementById('zone-fiches');
    
    if (!produits || produits.length === 0) {
        zonefiches.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Aucun produit trouvé dans cette catégorie</p>
                <a href="index.html" class="btn">Retour à l'accueil</a>
            </div>
        `;
        return;
    }
    
    zonefiches.innerHTML = (Array.isArray(produits) ? produits : []).map(produit => {
        // Gestion de l'image avec lazy loading
        let imageUrl = produit.image || '';
        if (imageUrl) {
            if (imageUrl.startsWith('/')) {
                imageUrl = imageUrl.substring(1);
            }
            if (!imageUrl.startsWith('http') && !imageUrl.startsWith('assets/images/')) {
                imageUrl = `assets/images/${imageUrl}`;
            }
        } else {
            imageUrl = 'assets/images/placeholder.png';
        }

        // Image placeholder pendant le chargement
        const placeholderUrl = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Chargement...</text>
            </svg>
        `);

        return `
            <div class="fiche-produit" data-id="${produit.id}" 
                 style="position: relative; ${produit.top_du_mois ? 'border: 3px solid #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);' : ''}">
                
                ${produit.top_du_mois ? `
                    <span class="vedette-badge" style="
                        background: linear-gradient(45deg, #ff6b6b, #ffd700);
                        color: white; padding: 4px 8px; border-radius: 12px;
                        font-size: 12px; font-weight: bold; position: absolute;
                        top: 10px; right: 10px; z-index: 10;
                        animation: pulse 2s infinite;
                        box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
                    ">🔥 TOP</span>
                ` : ''}

                <input type="checkbox" class="produit-checkbox" data-id="${produit.id}" data-nom="${produit.nom}">

                <!-- IMAGE LAZY LOADING -->
                <img src="${placeholderUrl}" 
                     data-src="${imageUrl}" 
                     alt="${produit.nom}" 
                     class="lazy"
                     style="width: 100%; height: 200px; object-fit: cover; background: #f0f0f0;"
                     onerror="this.onerror=null; this.src='assets/images/placeholder.png';">

                <div class="overlay-text-produit">${produit.titre_affiche || produit.nom}</div>
                <p class="info">${produit.description || 'Description non disponible'}</p>
                <p class="info" style="color: #667eea; font-weight: bold;">${produit.prix || 'Prix non communiqué'}</p>

                ${produit.fonctionnalites_avancees && produit.fonctionnalites_avancees.length > 0 ? `
                    <ul style="text-align: left; padding-left: 20px; margin: 10px 0;">
                        ${produit.fonctionnalites_avancees.slice(0, 3).map(f => `<li style="font-size: 0.9em;">✓ ${f}</li>`).join('')}
                    </ul>
                ` : ''}

                <a href="${produit.lien || '#'}" class="btn btn-details">Voir la fiche</a>
            </div>
        `;
    }).join('');

    // Initialiser lazy loading après rendu
    setupComparisonCheckboxes();
    setTimeout(() => {
        initLazyLoading();
    }, 100);
}

// Afficher la liste des catégories
function afficherListeCategories(categories) {
    const zonefiches = document.getElementById('zone-fiches');
    
    zonefiches.innerHTML = `
        <div class="categories-grid">
            ${categories.map(cat => `
                <a href="?categorie=${encodeURIComponent(cat)}" class="categorie-card">
                    <div class="categorie-icon">${getCategorieIcon(cat)}</div>
                    <h3>${formatCategorieName(cat)}</h3>
                    <p>Voir les produits →</p>
                </a>
            `).join('')}
        </div>
    `;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Bouton retour amélioré
    const btnRetour = document.getElementById('btn-retour');
    if (btnRetour) {
        btnRetour.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Si on est sur une catégorie, retourner à l'accueil
            if (categorieActuelle) {
                window.location.href = 'top-du-mois.html';
            } 
            // Sinon, utiliser l'historique du navigateur
            else if (window.history.length > 1) {
                window.history.back();
            } 
            // En dernier recours, aller à l'accueil
            else {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Bouton comparer
    const btnComparer = document.getElementById('btn-comparer');
    if (btnComparer) {
        btnComparer.addEventListener('click', comparerProduits);
    }
}

// Configurer les checkboxes de comparaison
function setupComparisonCheckboxes() {
    const checkboxes = document.querySelectorAll('.produit-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const produitId = e.target.dataset.id;
            const produitNom = e.target.dataset.nom;
            
            if (e.target.checked) {
                produitsSelectionnes.push({ id: produitId, nom: produitNom });
            } else {
                produitsSelectionnes = produitsSelectionnes.filter(p => p.id !== produitId);
            }
            
            // Afficher/masquer le bouton de comparaison
            const btnComparer = document.getElementById('btn-comparer');
            if (btnComparer) {
                btnComparer.style.display = produitsSelectionnes.length >= 2 ? 'block' : 'none';
            }
        });
    });
}

// Comparer les produits sélectionnés (utilise le cache)
async function comparerProduits() {
    if (produitsSelectionnes.length < 2) {
        alert('Veuillez sélectionner au moins 2 produits à comparer');
        return;
    }
    
    try {
        const zoneComparaison = document.getElementById('zone-comparaison');
        const comparaisonContent = document.getElementById('comparaison-content');
        
        // D'abord chercher dans le cache
        let produitsDetails = [];
        const produitsNonTrouves = [];
        
        produitsSelectionnes.forEach(p => {
            if (tousLesProduits) {
                const produitCache = tousLesProduits.find(prod => prod.id == p.id);
                if (produitCache) {
                    produitsDetails.push(produitCache);
                } else {
                    produitsNonTrouves.push(p);
                }
            } else {
                produitsNonTrouves.push(p);
            }
        });
        
        // Si certains produits ne sont pas dans le cache, faire UNE SEULE requête pour les récupérer
        if (produitsNonTrouves.length > 0) {
            const detailsManquants = await Promise.all(
                produitsNonTrouves.map(async p => {
                    const response = await fetch(`${API_URL}/produits/${p.id}`);
                    const data = await response.json();
                    return data.success ? data.data : null;
                })
            );
            produitsDetails = [...produitsDetails, ...detailsManquants.filter(p => p !== null)];
        }
        
        if (produitsDetails.length === 0) {
            alert('Impossible de charger les produits pour la comparaison');
            return;
        }
        
        // Créer les cartes de comparaison en utilisant les classes CSS existantes
        comparaisonContent.innerHTML = `
    <div class="comparaison-grid">
        ${produitsDetails.map(p => {
            // Gestion du chemin d'image comme dans afficherProduits()
            let imageUrl = p.image || '';
            if (imageUrl) {
                if (imageUrl.startsWith('/')) {
                    imageUrl = imageUrl.substring(1);
                }
                if (!imageUrl.startsWith('http') && !imageUrl.startsWith('assets/images/')) {
                    imageUrl = `assets/images/${imageUrl}`;
                }
            } else {
                imageUrl = 'assets/images/placeholder.png';
            }
            
            return `
                <div class="fiche-comparaison">
                    <img src="${imageUrl}" 
                         alt="${p.titre_affiche || p.nom}" 
                         onerror="this.onerror=null;this.src='assets/images/placeholder.png';">
                    <h4>${p.titre_affiche || p.nom}</h4>
                    <p class="info"><strong>Prix:</strong> ${p.prix || 'N/C'}</p>
                    <p class="info"><strong>Catégorie:</strong> ${p.categorie || 'N/C'}</p>
                    <p class="info">${p.description || 'Description non disponible'}</p>
                    ${p.top_du_mois ? `
    <div class="vedette-badge" style="
        position: absolute;
        top: 10px;
        left: 10px; /* Changé de right à left */
        background: #c9c5aeff;
        color: #333;
        padding: 5px 10px;
        border-radius: 15px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 10;
    ">
        ⭐ Top du mois
    </div>
` : ''}
                    ${p.fonctionnalites_avancees && p.fonctionnalites_avancees.length > 0 ? `
                        <ul>
                            ${p.fonctionnalites_avancees.slice(0, 5).map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        }).join('')}
    </div>
    <button id="btn-fermer-comparaison" class="btn btn-comparer" onclick="fermerComparaison()">
        Fermer la comparaison
    </button>
`;
        
        // Afficher la zone de comparaison
        zoneComparaison.classList.remove('hidden');
        
        // Scroller vers la comparaison
        zoneComparaison.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erreur lors de la comparaison:', error);
        alert('Erreur lors de la comparaison des produits');
    }
}

// Fermer la comparaison
function fermerComparaison() {
    const zoneComparaison = document.getElementById('zone-comparaison');
    zoneComparaison.classList.add('hidden');
    
    // Décocher toutes les checkboxes
    document.querySelectorAll('.produit-checkbox').forEach(cb => cb.checked = false);
    produitsSelectionnes = [];
    
    // Masquer le bouton de comparaison
    const btnComparer = document.getElementById('btn-comparer');
    if (btnComparer) {
        btnComparer.style.display = 'none';
    }
}

// Afficher les détails dans une modal (utilise le cache pour éviter une requête)
async function afficherDetailsModal(produitId) {
    try {
        // D'abord chercher dans le cache
        let produit = null;
        if (tousLesProduits) {
            produit = tousLesProduits.find(p => p.id == produitId);
        }
        
        // Si pas trouvé dans le cache, faire UNE requête
        if (!produit) {
            const response = await fetch(`${API_URL}/produits/${produitId}`);
            const data = await response.json();
            
            if (data.success && data.data) {
                produit = data.data;
            }
        }
        
        if (produit) {
            // Créer une modal simple
            const modal = document.createElement('div');
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    <h2>${produit.nom}</h2>
                    
                    ${produit.image ? `
    <img src="/assets/images/${produit.image}" alt="${produit.titre_affiche || produit.nom}" style="max-width: 100%; margin: 20px 0;" 
         onerror="this.onerror=null;this.src='/assets/images/placeholder.png';">
` : ''}
                    
                    <p><strong>Catégorie:</strong> ${produit.categorie}</p>
                    <p><strong>Prix:</strong> ${produit.prix || 'Non communiqué'}</p>
                    <p><strong>Description:</strong> ${produit.description || 'Non disponible'}</p>
                    
                    ${produit.fonctionnalites_avancees && produit.fonctionnalites_avancees.length > 0 ? `
                        <h3>Fonctionnalités:</h3>
                        <ul>
                            ${produit.fonctionnalites_avancees.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    ${produit.donnees_fiche && produit.donnees_fiche.length > 0 ? `
                        <h3>Informations détaillées:</h3>
                        ${produit.donnees_fiche.map(info => `<p>${info}</p>`).join('')}
                    ` : ''}
                </div>
            `;
            
            document.body.appendChild(modal);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des détails:', error);
        alert('Impossible de charger les détails du produit');
    }
}

// Fonctions utilitaires
function formatCategorieName(categorie) {
    const noms = {
        'DRONE': 'Drones',
        'CONSOLE': 'Consoles de Jeux',
        'TABLETTE': 'Tablettes',
        'SMARTPHONE': 'Smartphones',
        'PC GAMING': 'PC Gaming',
        'SERVEUR': 'Serveurs',
        'CASQUE AUDIO': 'Casques Audio',
        'MONTRE CONNECTEE': 'montre-connectee'
    };
    return noms[categorie] || categorie;
}

function getCategorieIcon(categorie) {
    const icons = {
        'DRONE': '🚁',
        'CONSOLE': '🎮',
        'TABLETTE': '📱',
        'SMARTPHONE': '📱',
        'PC GAMING': '💻',
        'SERVEUR': '🖥️',
        'CASQUE AUDIO': '🎧',
        'MONTRE CONNECTEE': '⌚'
    };
    return icons[categorie] || '📦';
}

function afficherErreur(message) {
    const zonefiches = document.getElementById('zone-fiches');
    zonefiches.innerHTML = `
        <div class="message-erreur">
            <p>❌ ${message}</p>
            <a href="index.html" class="btn">Retour à l'accueil</a>
        </div>
    `;
}
// Fonction principale de chargement des produits
async function chargerProduits(categorie = null) {
    try {
        let url = `${API_URL}/produits`;
        if (categorie) url += `?categorie=${encodeURIComponent(categorie)}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            afficherProduits(data.data, categorie);
        }
    } catch (error) {
        console.error('Erreur chargement:', error);
    }
}

// Auto-lancement
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categorie = urlParams.get('categorie');
    chargerProduits(categorie);
});


// Ajouter cette fonction au début du fichier
function initLazyLoading() {
    // Vérifier support navigateur
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Charger l'image vraie
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    
                    // Animation de fondu
                    img.style.opacity = '0';
                    img.onload = () => {
                        img.style.transition = 'opacity 0.3s';
                        img.style.opacity = '1';
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            // Charger 100px avant d'arriver à l'image
            rootMargin: '100px 0px',
            threshold: 0.1
        });

        // Observer toutes les images lazy
        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback pour navigateurs anciens
        document.querySelectorAll('img.lazy').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Variables globales pour pagination
const ITEMS_PER_PAGE = 12;
let currentPage = 1;
let totalProduits = [];
let filteredProduits = [];

// Fonction principale avec pagination
function afficherProduitsAvecPagination(produits, resetPage = true) {
    if (resetPage) currentPage = 1;
    
    filteredProduits = Array.isArray(produits) ? produits : [];
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const produitsPage = filteredProduits.slice(start, end);
    
    // Afficher les produits de la page courante
    afficherProduits(produitsPage);
    
    // Afficher les contrôles de pagination
    afficherPagination(filteredProduits.length);
    
    // Scroll en haut lors du changement de page
    if (!resetPage) {
        document.getElementById('zone-fiches').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

function afficherPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    if (totalPages <= 1) {
        document.getElementById('pagination-container').innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-container">';
    
    // Bouton précédent
    if (currentPage > 1) {
        paginationHTML += `
            <button class="btn-page" onclick="changerPage(${currentPage - 1})">
                ← Précédent
            </button>
        `;
    }
    
    // Numéros de pages (affichage intelligent)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="btn-page" onclick="changerPage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += '<span class="dots">...</span>';
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="btn-page ${i === currentPage ? 'active' : ''}" 
                    onclick="changerPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="dots">...</span>';
        }
        paginationHTML += `<button class="btn-page" onclick="changerPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Bouton suivant
    if (currentPage < totalPages) {
        paginationHTML += `
            <button class="btn-page" onclick="changerPage(${currentPage + 1})">
                Suivant →
            </button>
        `;
    }
    
    // Info sur la pagination
    paginationHTML += `
        <div class="page-info">
            Page ${currentPage} sur ${totalPages} 
            (${totalItems} produit${totalItems > 1 ? 's' : ''})
        </div>
    `;
    
    paginationHTML += '</div>';
    
    document.getElementById('pagination-container').innerHTML = paginationHTML;
}

function changerPage(page) {
    currentPage = page;
    afficherProduitsAvecPagination(filteredProduits, false);
}

// Modifier les fonctions existantes pour utiliser la pagination
function afficherProduitsCategorie(categorie) {
    const cacheKey = `categorie-${categorie.toLowerCase()}`;
    
    // Vérifier cache
    const cachedCategory = cacheManager.get('categories', categorie.toLowerCase());
    if (cachedCategory) {
        console.log(`📂 Catégorie "${categorie}" depuis cache`);
        
        // Utiliser la fonction d'affichage qui existe
        if (typeof afficherProduitsAvecPagination === 'function') {
            afficherProduitsAvecPagination(cachedCategory);
        } else {
            afficherProduits(cachedCategory);
        }
        
        // Mettre à jour le titre si l'élément existe
        const titreElement = document.getElementById('titre-categorie');
        if (titreElement) {
            titreElement.textContent = formatTitreCategorie(categorie);
        }
        return;
    }
    
    // Filtrer et mettre en cache
    const produitsFilters = tousLesProduits.filter(p => 
        p.categorie && p.categorie.toLowerCase() === categorie.toLowerCase()
    );
    
    cacheManager.set('categories', produitsFilters, categorie.toLowerCase());
    
    // Afficher les produits
    if (typeof afficherProduitsAvecPagination === 'function') {
        afficherProduitsAvecPagination(produitsFilters);
    } else {
        afficherProduits(produitsFilters);
    }
    
    // Mettre à jour le titre
    const titreElement = document.getElementById('titre-categorie');
    if (titreElement) {
        titreElement.textContent = formatTitreCategorie(categorie);
    }
}

function rechercherProduits() {
    const terme = document.getElementById('search-input').value.toLowerCase().trim();
    
    if (!terme) {
        if (categorieActuelle) {
            afficherProduitsCategorie(categorieActuelle);
        } else {
            afficherProduitsAvecPagination(tousLesProduits);
        }
        return;
    }
    
    const resultats = tousLesProduits.filter(produit => 
        produit.nom.toLowerCase().includes(terme) ||
        produit.description.toLowerCase().includes(terme) ||
        produit.categorie.toLowerCase().includes(terme)
    );
    
    // Utiliser la pagination for resultats
    afficherProduitsAvecPagination(resultats);
    
    document.getElementById('titre-categorie').textContent = 
        `Résultats pour "${terme}" (${resultats.length})`;
}

// Cache intelligent pour les recherches
const searchCache = new Map();
const SEARCH_CACHE_SIZE = 50;

function rechercherProduits() {
    const terme = document.getElementById('search-input').value.toLowerCase().trim();
    const cacheKey = `search-${terme}`;
    
    if (!terme) {
        if (categorieActuelle) {
            afficherProduitsCategorie(categorieActuelle);
        } else {
            afficherProduitsAvecPagination(tousLesProduits);
        }
        return;
    }
    
    // 1. Vérifier le cache de recherche en mémoire
    if (searchCache.has(cacheKey)) {
        const cachedResults = searchCache.get(cacheKey);
        console.log(`🔍 Recherche "${terme}" depuis cache mémoire (${cachedResults.length} résultats)`);
        afficherResultatsRecherche(terme, cachedResults);
        return;
    }
    
    // 2. Vérifier le cache localStorage
    const cachedSearch = cacheManager.get('search', terme);
    if (cachedSearch) {
        console.log(`🔍 Recherche "${terme}" depuis cache localStorage`);
        // Ajouter au cache mémoire
        if (searchCache.size >= SEARCH_CACHE_SIZE) {
            const firstKey = searchCache.keys().next().value;
            searchCache.delete(firstKey);
        }
        searchCache.set(cacheKey, cachedSearch);
        
        afficherResultatsRecherche(terme, cachedSearch);
        return;
    }
    
    // 3. Effectuer la recherche
    const startTime = performance.now();
    const resultats = tousLesProduits.filter(produit => 
        produit.nom.toLowerCase().includes(terme) ||
        (produit.description && produit.description.toLowerCase().includes(terme)) ||
        (produit.categorie && produit.categorie.toLowerCase().includes(terme)) ||
        (produit.titre_affiche && produit.titre_affiche.toLowerCase().includes(terme))
    );
    
    const searchTime = Math.round(performance.now() - startTime);
    console.log(`🔍 Recherche "${terme}" effectuée (${searchTime}ms, ${resultats.length} résultats)`);
    
    // 4. Mettre en cache les résultats
    cacheManager.set('search', resultats, terme);
    
    // Cache mémoire
    if (searchCache.size >= SEARCH_CACHE_SIZE) {
        const firstKey = searchCache.keys().next().value;
        searchCache.delete(firstKey);
    }
    searchCache.set(cacheKey, resultats);
    
    afficherResultatsRecherche(terme, resultats);
}

function afficherResultatsRecherche(terme, resultats) {
    afficherProduitsAvecPagination(resultats);
    document.getElementById('titre-categorie').textContent = 
        `Résultats pour "${terme}" (${resultats.length})`;
}

// Ajouter ces fonctions de debug/gestion
function afficherStatsCache() {
    const stats = cacheManager.getStats();
    
    console.group('📊 Statistiques du Cache');
    console.log(`💾 Taille totale: ${stats.totalSize} KB`);
    console.log(`📦 Entrées: ${stats.entriesCount}`);
    console.log(`📊 Quota utilisé: ${stats.quotaUsed}%`);
    console.log('🏷️ Par type:', stats.typeStats);
    console.groupEnd();
    
    // Afficher dans l'interface si besoin
    if (document.getElementById('cache-stats')) {
        document.getElementById('cache-stats').innerHTML = `
            <div class="cache-stats">
                <h4>📊 Cache Stats</h4>
                <p>💾 ${stats.totalSize} KB utilisés</p>
                <p>📦 ${stats.entriesCount} entrées</p>
                <p>📊 ${stats.quotaUsed}% du quota</p>
                <button onclick="cacheManager.clearAll(); location.reload();">
                    🗑️ Vider le cache
                </button>
            </div>
        `;
    }
}

// Force refresh (bypass cache)
function forceRefresh() {
    console.log('🔄 Force refresh - invalidation du cache...');
    
    cacheManager.invalidate('produits');
    cacheManager.invalidate('categories');
    cacheManager.invalidate('search');
    
    // Vider aussi le cache mémoire
    searchCache.clear();
    
    location.reload();
}

// Fonction pour précharger les données importantes
async function prechargerDonnees() {
    // Précharger les catégories populaires
    const categoriesPopulaires = ['smartphones', 'pc-gaming', 'casques-audio'];
    
    for (const cat of categoriesPopulaires) {
        if (!cacheManager.get('categories', cat)) {
            const produits = tousLesProduits.filter(p => 
                p.categorie.toLowerCase() === cat
            );
            if (produits.length > 0) {
                cacheManager.set('categories', produits, cat);
                console.log(`🎯 Précache: ${cat} (${produits.length} produits)`);
            }
        }
    }
}

// Initialisation améliorée
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation avec cache intelligent...');
    
    // GARDEZ votre logique existante mais avec les améliorations cache
    await chargerTousLesProduits();
    
    const urlParams = new URLSearchParams(window.location.search);
    categorieActuelle = urlParams.get('categorie') || '';
    
    if (categorieActuelle) {
        afficherProduitsCategorie(categorieActuelle);
    } else {
        // VOTRE CODE EXISTANT (gardez ce que vous aviez)
        afficherToutesCategories(); // ou afficherProduits(tousLesProduits) selon votre code
    }
    
    setupEventListeners();
    
    // NOUVELLES LIGNES à ajouter :
    setTimeout(prechargerDonnees, 1000);
    
    setTimeout(() => {
        if (window.location.hostname === 'localhost') {
            afficherStatsCache();
        }
    }, 2000);
});

// Ajouter cette fonction manquante
function formatTitreCategorie(categorie) {
    if (!categorie) return 'Tous les produits';
    
    // Capitaliser la première lettre et remplacer les tirets
    return categorie
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}