// assets/js/fiches.js - Connexion à la base de données PostgreSQL

// Configuration de l'API
const API_URL = 'http://localhost:3000/api';

// Variables globales
let produitsSelectionnes = [];
let categorieActuelle = '';
let tousLesProduits = null; // Cache pour tous les produits
let statsCache = null; // Cache pour les stats

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
    // Si déjà en cache, ne pas recharger
    if (tousLesProduits !== null) {
        return tousLesProduits;
    }
    
    try {
        console.log('📊 Chargement unique des produits depuis PostgreSQL...');
        
        const response = await fetch(`${API_URL}/produits`);
        const data = await response.json();
        
        if (data.success) {
            // Mettre en cache tous les produits
            tousLesProduits = data.data;
            console.log(`✅ ${tousLesProduits.length} produits chargés et mis en cache`);
            return tousLesProduits;
        } else {
            throw new Error(data.error || 'Erreur lors du chargement');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error);
        tousLesProduits = []; // Cache vide pour éviter de recharger
        afficherErreur('Impossible de charger les produits depuis la base de données');
        return [];
    }
}

// Afficher les produits d'une catégorie (depuis le cache)
function afficherProduitsCategorie(categorie) {
    console.log(`📂 Affichage des produits pour: ${categorie}`);
    
    // Mettre à jour le titre
    const titreElement = document.getElementById('titre-categorie');
    const descElement = document.getElementById('desc-cat');
    
    titreElement.textContent = formatCategorieName(categorie);
    
    // Description par catégorie
    const descriptions = {
        'DRONE': 'Découvrez notre gamme de drones professionnels et de loisir',
        'CONSOLE': 'Les dernières consoles de jeux vidéo',
        'TABLETTE': 'Tablettes tactiles pour tous les usages',
        'SMARTPHONE': 'Smartphones dernière génération',
        'PC GAMING': 'PC gaming haute performance',
        'SERVEUR': 'Serveurs professionnels et solutions d\'hébergement',
        'CASQUE AUDIO': 'Casques audio haute qualité',
        'MONTRE CONNECTE': 'Montres connectées et trackers d\'activité'
    };
    
    descElement.textContent = descriptions[categorie] || `Produits de la catégorie ${categorie}`;
    
    // Filtrer les produits depuis le cache (pas de nouvelle requête !)
    if (tousLesProduits && tousLesProduits.length > 0) {
        const produitsFiltres = tousLesProduits.filter(p => p.categorie === categorie);
        afficherProduits(produitsFiltres);
    } else {
        afficherProduits([]);
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

// Ancienne fonction devenue obsolète (gardée pour compatibilité)
async function chargerProduitsCategorieDepuisBDD(categorie) {
    // Rediriger vers la nouvelle fonction qui utilise le cache
    afficherProduitsCategorie(categorie);
}

// Ancienne fonction devenue obsolète (gardée pour compatibilité)
async function afficherToutesCategoriesDepuisBDD() {
    // Rediriger vers la nouvelle fonction qui utilise le cache
    afficherToutesCategories();
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
        // ✅ CORRECTION ICI - Gérer le double chemin
       let imageUrl = produit.image_data || produit.image || '';

// Nettoyer l'URL de l'image
if (imageUrl) {
    // Supprimer le "/" au début s'il existe
    if (imageUrl.startsWith('/')) {
        imageUrl = imageUrl.substring(1);
    }
    
    // Si ce n'est pas une URL complète et ne commence pas par "assets/images/"
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:') && !imageUrl.startsWith('assets/images/')) {
        imageUrl = `assets/images/${imageUrl}`;
    }
} else {
    // Si pas d'image, utiliser placeholder
    imageUrl = 'assets/images/placeholder.png';
}

console.log('🖼️ Image URL pour', produit.nom, ':', imageUrl);
        
        let ficheUrl = '#';
        if (produit.lien) {
            ficheUrl = produit.lien.startsWith('http')
                ? produit.lien
                : `http://localhost:3000/${produit.lien.replace(/^\/+/, '')}`;
        }

        return `
            <div class="fiche-produit" data-id="${produit.id}" style="position: relative;">
                ${produit.top_du_mois ? '<span class="vedette-badge" style="position: absolute; top: 10px; right: 10px; background: #ffd700; color: #333; z-index: 10;">⭐ TOP</span>' : ''}

                <input type="checkbox" class="produit-checkbox" data-id="${produit.id}" data-nom="${produit.nom}">

                <img src="${encodeURI(imageUrl)}" alt="${produit.nom}" 
                     onerror="this.onerror=null; this.src='assets/images/placeholder.png';">

                <div class="overlay-text-produit">${produit.nom}</div>

                <p class="info">${produit.description || 'Description non disponible'}</p>

                <p class="info" style="color: #667eea; font-weight: bold;">
                    ${produit.prix || 'Prix non communiqué'}
                </p>

                ${produit.fonctionnalites_avancees && produit.fonctionnalites_avancees.length > 0 ? `
                    <ul style="text-align: left; padding-left: 20px; margin: 10px 0;">
                        ${produit.fonctionnalites_avancees.slice(0, 3).map(f => `<li style="font-size: 0.9em;">✓ ${f}</li>`).join('')}
                    </ul>
                ` : ''}

                ${ficheUrl !== '#' ? `
    <a href="${ficheUrl}" class="btn btn-details">
        Voir la fiche
    </a>
` : `
    <button class="btn btn-details" onclick="afficherDetailsModal(${produit.id})">
        Voir détails
    </button>
                `}
            </div>
        `;
    }).join('');

    // Ajouter les écouteurs pour les checkboxes de comparaison
    setupComparisonCheckboxes();
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
                ${produitsDetails.map(p => `
                    <div class="fiche-comparaison">
                        <img src="${p.image || p.image_data || 'frontend/public/assets/images/placeholder.png'}" 
                             alt="${p.nom}">
                        <h4>${p.nom}</h4>
                        <p class="info"><strong>Prix:</strong> ${p.prix || 'N/C'}</p>
                        <p class="info"><strong>Catégorie:</strong> ${p.categorie || 'N/C'}</p>
                        <p class="info">${p.description || 'Description non disponible'}</p>
                        ${p.top_du_mois ? '<p class="vedette-badge" style="background: #ffd700; color: #333; display: inline-block; padding: 5px 10px; border-radius: 5px;">⭐ Top du mois</p>' : ''}
                        ${p.fonctionnalites_avancees && p.fonctionnalites_avancees.length > 0 ? `
                            <ul style="text-align: left; padding-left: 20px; margin-top: 10px;">
                                ${p.fonctionnalites_avancees.slice(0, 5).map(f => `<li style="font-size: 0.9em;">${f}</li>`).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
            <button class="btn" style="margin-top: 20px;" onclick="fermerComparaison()">Fermer la comparaison</button>
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
                    
                    ${produit.image || produit.image_data ? `
                        <img src="${produit.image || produit.image_data}" alt="${produit.nom}" style="max-width: 100%; margin: 20px 0;">
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
        'MONTRE CONNECTE': 'Montres Connectées'
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
        'MONTRE CONNECTE': '⌚'
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