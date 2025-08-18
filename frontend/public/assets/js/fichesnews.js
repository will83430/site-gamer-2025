// assets/js/fiches.js - Connexion à la base de données PostgreSQL

// Configuration de l'API
const API_URL = 'http://localhost:3000/api';

// Variables globales
let produitsSelectionnes = [];
let categorieActuelle = '';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer la catégorie depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    categorieActuelle = urlParams.get('categorie') || '';
    
    if (categorieActuelle) {
        chargerProduitsCategorieDepuisBDD(categorieActuelle);
    } else {
        afficherToutesCategoriesDepuisBDD();
    }
    
    // Configurer les boutons
    setupEventListeners();
});

// Charger les produits d'une catégorie depuis PostgreSQL
async function chargerProduitsCategorieDepuisBDD(categorie) {
    try {
        console.log(`Chargement des produits pour la catégorie: ${categorie}`);
        
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
        
        // Charger les produits depuis l'API
        const response = await fetch(`${API_URL}/produits`);
        const data = await response.json();
        
        if (data.success) {
            // Filtrer par catégorie
            const produitsFiltres = data.data.filter(p => p.categorie === categorie);
            afficherProduits(produitsFiltres);
        } else {
            throw new Error(data.error || 'Erreur lors du chargement');
        }
        
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        afficherErreur('Impossible de charger les produits depuis la base de données');
    }
}

// Afficher toutes les catégories disponibles
async function afficherToutesCategoriesDepuisBDD() {
    try {
        const titreElement = document.getElementById('titre-categorie');
        titreElement.textContent = 'Toutes les catégories';
        
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();
        
        if (data.success && data.stats.categories_detail) {
            afficherCategoriesDisponibles(data.stats.categories_detail);
        } else {
            // Charger tous les produits et extraire les catégories
            const produitsResponse = await fetch(`${API_URL}/produits`);
            const produitsData = await produitsResponse.json();
            
            if (produitsData.success) {
                const categories = [...new Set(produitsData.data.map(p => p.categorie).filter(c => c))];
                afficherListeCategories(categories);
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        afficherErreur('Impossible de charger les catégories');
    }
}

// Afficher les produits dans la grille
function afficherProduits(produits) {
    const zonefiches = document.getElementById('zone-fiches');
    
    if (!produits || produits.length === 0) {
        zonefiches.innerHTML = `
            <div class="message-vide">
                <p>Aucun produit trouvé dans cette catégorie</p>
                <a href="index.html" class="btn">Retour à l'accueil</a>
            </div>
        `;
        return;
    }
    
    zonefiches.innerHTML = produits.map(produit => {
        // Gérer l'image (base64, URL ou placeholder)
        let imageUrl = produit.image_url || produit.image || produit.image_data || '';
        
        // Si pas d'image, utiliser un placeholder
        if (!imageUrl) {
            imageUrl = 'assets/images/placeholder.png';
        }
        
        // Construire l'URL de la fiche
        let ficheUrl = '#';
        if (produit.lien) {
            // Si c'est un chemin relatif local
            if (!produit.lien.startsWith('http')) {
                ficheUrl = `http://localhost:3000/${produit.lien}`;
            } else {
                ficheUrl = produit.lien;
            }
        }
        
        return `
            <div class="produit-card" data-id="${produit.id}">
                <div class="produit-header">
                    ${produit.top_du_mois ? '<span class="badge-top">⭐ Top du mois</span>' : ''}
                    <input type="checkbox" class="checkbox-compare" data-id="${produit.id}" data-nom="${produit.nom}">
                </div>
                
                <div class="produit-image">
                    <img src="${imageUrl}" alt="${produit.nom}" onerror="this.src='assets/images/placeholder.png'">
                </div>
                
                <div class="produit-content">
                    <h3 class="produit-titre">${produit.nom}</h3>
                    <p class="produit-description">${produit.description || 'Description non disponible'}</p>
                    
                    <div class="produit-prix">
                        ${produit.prix || 'Prix non communiqué'}
                    </div>
                    
                    ${produit.fonctionnalites_avancees && produit.fonctionnalites_avancees.length > 0 ? `
                        <ul class="produit-features">
                            ${produit.fonctionnalites_avancees.slice(0, 3).map(f => `<li>✓ ${f}</li>`).join('')}
                        </ul>
                    ` : ''}
                    
                    <div class="produit-actions">
                        ${ficheUrl !== '#' ? `
                            <a href="${ficheUrl}" target="_blank" class="btn btn-primary">
                                Voir la fiche détaillée
                            </a>
                        ` : `
                            <button class="btn btn-secondary" onclick="afficherDetailsModal(${produit.id})">
                                Voir les détails
                            </button>
                        `}
                    </div>
                </div>
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
    // Bouton retour
    const btnRetour = document.getElementById('btn-retour');
    if (btnRetour) {
        btnRetour.addEventListener('click', () => {
            if (categorieActuelle) {
                window.location.href = 'index.html';
            } else {
                window.history.back();
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
    const checkboxes = document.querySelectorAll('.checkbox-compare');
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

// Comparer les produits sélectionnés
async function comparerProduits() {
    if (produitsSelectionnes.length < 2) {
        alert('Veuillez sélectionner au moins 2 produits à comparer');
        return;
    }
    
    try {
        const zoneComparaison = document.getElementById('zone-comparaison');
        const comparaisonContent = document.getElementById('comparaison-content');
        
        // Charger les détails des produits sélectionnés
        const produitsDetails = await Promise.all(
            produitsSelectionnes.map(async p => {
                const response = await fetch(`${API_URL}/produits/${p.id}`);
                const data = await response.json();
                return data.success ? data.data : null;
            })
        );
        
        // Filtrer les produits null
        const produitsValides = produitsDetails.filter(p => p !== null);
        
        if (produitsValides.length === 0) {
            alert('Impossible de charger les produits pour la comparaison');
            return;
        }
        
        // Créer le tableau de comparaison
        comparaisonContent.innerHTML = `
            <table class="table-comparaison">
                <thead>
                    <tr>
                        <th>Caractéristique</th>
                        ${produitsValides.map(p => `<th>${p.nom}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Image</strong></td>
                        ${produitsValides.map(p => `
                            <td>
                                <img src="${p.image || p.image_data || 'assets/images/placeholder.png'}" 
                                     alt="${p.nom}" 
                                     style="max-width: 150px; height: auto;">
                            </td>
                        `).join('')}
                    </tr>
                    <tr>
                        <td><strong>Prix</strong></td>
                        ${produitsValides.map(p => `<td>${p.prix || 'N/C'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Catégorie</strong></td>
                        ${produitsValides.map(p => `<td>${p.categorie || 'N/C'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Description</strong></td>
                        ${produitsValides.map(p => `<td>${p.description || 'N/C'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Top du mois</strong></td>
                        ${produitsValides.map(p => `<td>${p.top_du_mois ? '⭐ Oui' : 'Non'}</td>`).join('')}
                    </tr>
                    ${produitsValides[0].fonctionnalites_avancees ? `
                        <tr>
                            <td><strong>Fonctionnalités</strong></td>
                            ${produitsValides.map(p => `
                                <td>
                                    ${p.fonctionnalites_avancees ? 
                                        `<ul>${p.fonctionnalites_avancees.map(f => `<li>${f}</li>`).join('')}</ul>` 
                                        : 'N/C'
                                    }
                                </td>
                            `).join('')}
                        </tr>
                    ` : ''}
                </tbody>
            </table>
            <button class="btn btn-secondary" onclick="fermerComparaison()">Fermer la comparaison</button>
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
    document.querySelectorAll('.checkbox-compare').forEach(cb => cb.checked = false);
    produitsSelectionnes = [];
    
    // Masquer le bouton de comparaison
    const btnComparer = document.getElementById('btn-comparer');
    if (btnComparer) {
        btnComparer.style.display = 'none';
    }
}

// Afficher les détails dans une modal (si pas de fiche)
async function afficherDetailsModal(produitId) {
    try {
        const response = await fetch(`${API_URL}/produits/${produitId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const produit = data.data;
            
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