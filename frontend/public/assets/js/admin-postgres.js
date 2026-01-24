// admin-postgres.js - Version FINALE avec les vrais IDs
class AdminManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.currentProducts = [];
        this.currentEditingProduct = null;
        this.init();
    }

    async init() {
        await this.loadStats();
        await this.loadProducts();
        this.setupEventListeners();
    }

    // Charger les statistiques
    async loadStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/stats`);
            const result = await response.json();
            
            if (result.success) {
                const stats = result.stats;
                document.getElementById('total-products').textContent = stats.total_products || 0;
                document.getElementById('total-categories').textContent = stats.total_categories || 0;
                document.getElementById('featured-products').textContent = stats.featured_products || 0;
            }
        } catch (error) {
            console.error('❌ Erreur stats:', error);
        }
    }

    // Charger tous les produits
    async loadProducts() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/produits`);
            const result = await response.json();
            
            if (result.success) {
                this.currentProducts = result.data;
                this.populateProductSelect();
            }
        } catch (error) {
            console.error('❌ Erreur chargement produits:', error);
        }
    }

    // Remplir la liste déroulante
    populateProductSelect() {
        const select = document.getElementById('product-select');
        if (!select) return;

        select.innerHTML = '<option value="">-- Sélectionner un produit --</option>';
        
        const grouped = this.groupProductsByCategory();
        
        Object.keys(grouped).sort().forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            
            grouped[category].forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.nom} (${product.prix || 'Prix non défini'})`;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
    }

    // Grouper par catégorie
    groupProductsByCategory() {
        return this.currentProducts.reduce((groups, product) => {
            const category = product.categorie || 'Sans catégorie';
            if (!groups[category]) groups[category] = [];
            groups[category].push(product);
            return groups;
        }, {});
    }

    // Charger un produit pour édition
    async loadProductForEdit() {
        const select = document.getElementById('product-select');
        const productId = select.value;
        
        if (!productId) {
            document.getElementById('edit-form').style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/produits/${productId}`);
            const result = await response.json();
            
            if (result.success) {
                this.currentEditingProduct = result.data;
                this.populateEditForm(result.data);
                document.getElementById('edit-form').style.display = 'block';
            }
        } catch (error) {
            console.error('❌ Erreur chargement produit:', error);
        }
    }

    // Remplir le formulaire d'édition
    populateEditForm(product) {
        document.getElementById('edit-nom').value = product.nom || '';
        document.getElementById('edit-categorie').value = product.categorie || '';
        document.getElementById('edit-prix').value = product.prix || '';
        document.getElementById('edit-description').value = product.description || '';
        document.getElementById('edit-image').value = product.image || '';
        document.getElementById('edit-top').value = product.top_du_mois ? 'true' : 'false';
        
        // Fonctionnalités avancées
        const fonctionnalites = Array.isArray(product.fonctionnalites_avancees) 
            ? product.fonctionnalites_avancees.join('\n')
            : product.fonctionnalites_avancees || '';
        document.getElementById('edit-fonctionnalites').value = fonctionnalites;

        // ⭐ GÉNÉRATION DES CHAMPS CATÉGORIE
        this.generateCategoryFields(product);
    }

    // ⭐ GÉNÉRER LES CHAMPS SELON LA CATÉGORIE
generateCategoryFields(product) {
    const container = document.getElementById('edit-category-fields');
    if (!container) {
        console.error('❌ Conteneur edit-category-fields non trouvé !');
        return;
    }

    const fieldsMap = {
   'CONSOLE': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "🖥️", titre: "Écran et affichage" },
       { emoji: "🕹️", titre: "Contrôleurs" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ],
   'DRONE': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "🎥", titre: "Fonctions vidéo" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ],
   'TABLETTE': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "🖥️", titre: "Écran et affichage" },
       { emoji: "🖊️", titre: "Accessoires" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ],
   'SMARTPHONE': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "📸", titre: "Appareil photo" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ],
   'PC GAMING': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "🎮", titre: "Fonctions gaming" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ],
   'SERVEUR': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "🖥️", titre: "Performances" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ],
   'CASQUE AUDIO': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "🎧", titre: "Fonctions audio" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ],
   'MONTRE CONNECTEE': [
       { emoji: "📝", titre: "Description détaillée" },
       { emoji: "💰", titre: "Prix" },
       { emoji: "🧩", titre: "Spécifications" },
       { emoji: "⌚", titre: "Sport et santé" },
       { emoji: "🌐", titre: "Connectivité" },
       { emoji: "🎮", titre: "Expérience utilisateur" }
   ]
};

    const sections = fieldsMap[product.categorie] || fieldsMap['CONSOLE'];
    
    let html = '<h3>Données de fiche détaillée</h3>';
    
    sections.forEach((section, index) => {
    let value = '';
    if (product.donnees_fiche && product.donnees_fiche[index]) {
        const contenu = product.donnees_fiche[index];
        
        // Gérer les \n échappés ET les vrais \n
        const contenuNettoye = contenu.replace(/\\n/g, '\n');
        
        if (contenuNettoye.includes('\n') && /^[^\w\s]/.test(contenuNettoye)) {
            // Format avec emoji: "📝 Titre\nContenu"
            value = contenuNettoye.split('\n').slice(1).join('\n');
        } else {
            // Format texte simple: "Description sans emoji"
            value = contenu;
        }
    }
    
    html += `
        <div class="form-group">
            <label>${section.emoji} ${section.titre}</label>
            <textarea id="edit-fiche-${index}" rows="4">${value}</textarea>
        </div>
    `;
});
    sections.forEach((section, index) => {
    let value = '';
    if (product.donnees_fiche && product.donnees_fiche[index]) {
        const contenu = product.donnees_fiche[index];
        // Gérer les \n échappés ET les vrais \n
        const contenuNettoye = contenu.replace(/\\n/g, '\n');
        if (contenuNettoye.includes('\n') && /^[^\w\s]/.test(contenuNettoye)) {
            // Format avec emoji: "📝 Titre\nContenu"
            value = contenuNettoye.split('\n').slice(1).join('\n');
        } else {
            // Format texte simple: "Description sans emoji"
            value = contenu;
        }
    } else {
    }
    
    html += `
        <div class="form-group">
            <label>${section.emoji} ${section.titre}</label>
            <textarea id="edit-fiche-${index}" rows="4">${value}</textarea>
        </div>
    `;
});
    container.innerHTML = html;
}

    // ⭐ SAUVEGARDER AVEC FORMATAGE
    async saveToPostgreSQL() {
        if (!this.currentEditingProduct) {
            this.showError('Aucun produit sélectionné');
            return;
        }

        try {
            const formData = this.collectFormData();
            const response = await fetch(`${this.apiBaseUrl}/produits/${this.currentEditingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('✅ Sauvegarde réussie avec formatage !');
                await this.loadProducts();
                await this.loadStats();
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
            this.showError('Erreur sauvegarde: ' + error.message);
        }
    }

    // ⭐ COLLECTE AVEC FORMATAGE AUTOMATIQUE
    collectFormData() {
        const data = {
            id: this.currentEditingProduct.id,
            nom: document.getElementById('edit-nom').value,
            categorie: document.getElementById('edit-categorie').value,
            prix: document.getElementById('edit-prix').value,
            description: document.getElementById('edit-description').value,
            image: document.getElementById('edit-image').value,
            lien: this.currentEditingProduct.lien,
            top_du_mois: document.getElementById('edit-top').value === 'true',
        };

        // Fonctionnalités avancées
        const fonctionnalitesText = document.getElementById('edit-fonctionnalites').value;
        data.fonctionnalites_avancees = fonctionnalitesText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // ⭐ FORMATAGE FINAL AVEC ICÔNES + TITRES
        // 1. Récupère la catégorie pour savoir quels champs utiliser
        const categorie = document.getElementById('edit-categorie').value;
        const fieldsMap = {
            'CONSOLE': [
                { emoji: "📝", titre: "Description détaillée" },
                { emoji: "💰", titre: "Prix" },
                { emoji: "🧩", titre: "Spécifications" },
                { emoji: "🖥️", titre: "Écran et affichage" },
                { emoji: "🕹️", titre: "Contrôleurs" },
                { emoji: "🌐", titre: "Connectivité" },
                { emoji: "🎮", titre: "Expérience utilisateur" }
            ],
            'DRONE': [
                { emoji: "📝", titre: "Description détaillée" },
                { emoji: "💰", titre: "Prix" },
                { emoji: "🧩", titre: "Spécifications" },
                { emoji: "🎥", titre: "Fonctions vidéo" },
                { emoji: "🌐", titre: "Connectivité" },
                { emoji: "🎮", titre: "Expérience utilisateur" }
            ],
            'TABLETTE': [
                { emoji: "📝", titre: "Description détaillée" },
                { emoji: "💰", titre: "Prix" },
                { emoji: "🧩", titre: "Spécifications" },
                { emoji: "🖥️", titre: "Écran et affichage" },
                { emoji: "🖊️", titre: "Accessoires" },
                { emoji: "🌐", titre: "Connectivité" },
                { emoji: "🎮", titre: "Expérience utilisateur" }
            ]
        };
        const sections = fieldsMap[categorie] || fieldsMap['CONSOLE'];

        // 2. Formate chaque champ avec icône + titre + valeur
        data.donnees_fiche = sections.map((section, index) => {
    const field = document.getElementById(`edit-fiche-${index}`);
    const value = field ? field.value.trim() : '';
    
    // Si vide, on retourne une chaîne vide au lieu de l'icône+titre
    if (value.length === 0) {
        return '';
    }
    
    return `${section.emoji} ${section.titre}\n${value}`;
});

        // DEBUG : Affiche ce qui va partir à l’API
        return data;
    }

    // Configurer les événements
    setupEventListeners() {
        const productSelect = document.getElementById('product-select');
        if (productSelect) {
            productSelect.addEventListener('change', () => this.loadProductForEdit());
        }

        const editForm = document.getElementById('product-edit-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveToPostgreSQL();
            });
        }
    }

    // Messages d'erreur
    showError(message) {
        const resultDiv = document.getElementById('edit-result');
        if (resultDiv) {
            resultDiv.innerHTML = `<div style="color: red; padding: 10px; background: #fee;">❌ ${message}</div>`;
        }
        console.error('❌', message);
    }

    // Messages de succès
    showSuccess(message) {
        const resultDiv = document.getElementById('edit-result');
        if (resultDiv) {
            resultDiv.innerHTML = `<div style="color: green; padding: 10px; background: #efe;">✅ ${message}</div>`;
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});

// Fonctions globales
function loadProductForEdit() {
    if (window.adminManager) {
        window.adminManager.loadProductForEdit();
    }
}

function saveProduct() {
    if (window.adminManager) {
        window.adminManager.saveToPostgreSQL();
    }
}