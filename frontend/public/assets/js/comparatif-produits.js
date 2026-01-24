// comparatif-produits.js - Génération dynamique du comparatif en grille

const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : `http://${window.location.hostname}:3000/api`;

// Fonction principale : charge tous les produits et affiche la grille
async function chargerComparatifProduits() {
    const container = document.getElementById('comparatif-grille');
    if (!container) return;
    container.innerHTML = '<div class="loader">Chargement...</div>';
    try {
        const response = await fetch(`${API_URL}/produits`);
        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) {
            container.innerHTML = '<p>Erreur de chargement des produits.</p>';
            return;
        }
        const produits = data.data;
        container.innerHTML = genererGrilleProduits(produits);
        setupComparisonCheckboxes();
    } catch (error) {
        container.innerHTML = '<p>Erreur de connexion à la base de données.</p>';
    }
}

// Génère la grille de cartes produits
function genererGrilleProduits(produits) {
    if (!produits.length) return '<p>Aucun produit trouvé.</p>';
    return `<div class="grille-produits">${
        produits.map(prod => `
        <div class="carte-produit">
            <div class="img-container">
                <img data-src="/assets/images/${prod.image || 'placeholder.png'}" alt="${prod.nom}" class="lazy" />
            </div>
            <div class="infos">
                <h3>${prod.nom}</h3>
                <p class="categorie">${prod.categorie}</p>
                <p class="prix">${prod.prix ? prod.prix + ' €' : ''}</p>
                <p class="note">${prod.note ? '⭐ ' + prod.note : ''}</p>
                <label><input type="checkbox" class="compare-checkbox" value="${prod.id}"> Comparer</label>
                <button class="btn-details" onclick="afficherDetailsModal('${prod.id}')">Détails</button>
            </div>
        </div>
        `).join('')
    }</div>`;
}

// Lazy loading des images
function initLazyLoadingComparatif() {
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
        return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                obs.unobserve(img);
            }
        });
    }, { rootMargin: '50px 0px', threshold: 0.1 });
    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
}

// Checkbox de comparaison
function setupComparisonCheckboxes() {
    document.querySelectorAll('.compare-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
            const selected = Array.from(document.querySelectorAll('.compare-checkbox:checked')).map(cb => cb.value);
            document.getElementById('btn-comparer').disabled = selected.length < 2;
        });
    });
}

// Afficher la comparaison dans une modal
async function afficherComparaison() {
    const selectedIds = Array.from(document.querySelectorAll('.compare-checkbox:checked')).map(cb => cb.value);
    if (selectedIds.length < 2) return;
    // Récupérer les produits sélectionnés
    const response = await fetch(`${API_URL}/produits`);
    const data = await response.json();
    if (!data.success || !Array.isArray(data.data)) return;
    const produits = data.data.filter(p => selectedIds.includes(p.id));
    // Générer le tableau comparatif
    const modal = document.getElementById('modal-comparaison');
    if (!modal) return;
    modal.innerHTML = genererTableauComparatif(produits);
    modal.style.display = 'block';
}

function genererTableauComparatif(produits) {
    if (!produits.length) return '<p>Aucun produit à comparer.</p>';
    // Colonnes principales : image, nom, catégorie, prix, note, specs
    let html = `<table class="table-comparatif"><thead><tr>
        <th>Image</th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Note</th><th>Spécifications</th>
    </tr></thead><tbody>`;
    produits.forEach(prod => {
        html += `<tr>
            <td><img src="/assets/images/${prod.image || 'placeholder.png'}" alt="${prod.nom}" class="img-compare" /></td>
            <td>${prod.nom}</td>
            <td>${prod.categorie}</td>
            <td>${prod.prix ? prod.prix + ' €' : ''}</td>
            <td>${prod.note ? '⭐ ' + prod.note : ''}</td>
            <td>${Array.isArray(prod.donnees_fiche) ? prod.donnees_fiche.join('<br>') : ''}</td>
        </tr>`;
    });
    html += '</tbody></table><button onclick="fermerComparaison()">Fermer</button>';
    return html;
}

function fermerComparaison() {
    const modal = document.getElementById('modal-comparaison');
    if (modal) modal.style.display = 'none';
}

// Initialisation
window.addEventListener('DOMContentLoaded', () => {
    chargerComparatifProduits();
    setTimeout(initLazyLoadingComparatif, 500);
    document.getElementById('btn-comparer').addEventListener('click', afficherComparaison);
});
