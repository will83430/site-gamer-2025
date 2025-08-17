// Script à ajouter dans "Gestion des produits et génération automatique.html"

class AdminManager {
    constructor() {
        this.apiBaseUrl = '/api';
        this.currentProducts = [];
        this.currentEditingProduct = null;
        this.init();
    }

    async init() {
        console.log('🚀 Initialisation du dashboard admin...');
        await this.loadStats();
        await this.loadProducts();
        this.setupEventListeners();
    }

    // Charger les statistiques depuis PostgreSQL
    async loadStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/stats`);
            const result = await response.json();
            
            if (result.success) {
                const stats = result.stats;
                document.getElementById('total-products').textContent = stats.total_products || 0;
                document.getElementById('total-categories').textContent = stats.total_categories || 0;
                document.getElementById('featured-products').textContent = stats.featured_products || 0;
                
                console.log('✅ Statistiques chargées:', stats);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur chargement stats:', error);
            this.showError('Impossible de charger les statistiques');
        }
    }

    // Charger tous les produits depuis PostgreSQL
    async loadProducts() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/produits`);
            const result = await response.json();
            
            if (result.success) {
                this.currentProducts = result.data;
                this.populateProductSelect();
                console.log(`✅ ${result.total} produits chargés depuis PostgreSQL`);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur chargement produits:', error);
            this.showError('Impossible de charger les produits depuis la base de données');
        }
    }

    // Remplir la liste déroulante des produits
    populateProductSelect() {
        const select = document.getElementById('product-select');
        if (!select) return;

        // Vider la liste
        select.innerHTML = '<option value="">-- Choisir un produit --</option>';

        // Ajouter les produits groupés par catégorie
        const productsByCategory = this.groupByCategory(this.currentProducts);
        
        Object.keys(productsByCategory).sort().forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category;
            
            productsByCategory[category].forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.nom;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });
    }

    // Grouper les produits par catégorie
    groupByCategory(products) {
        return products.reduce((groups, product) => {
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
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur chargement produit:', error);
            this.showError('Impossible de charger le produit sélectionné');
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
        
        // Fonctionnalités avancées (array vers texte)
        const fonctionnalites = Array.isArray(product.fonctionnalites_avancees) 
            ? product.fonctionnalites_avancees.join('\n')
            : product.fonctionnalites_avancees || '';
        document.getElementById('edit-fonctionnalites').value = fonctionnalites;

        // Données de fiche personnalisées selon la catégorie
        this.populateCategorySpecificFields(product);
    }

    // Remplir les champs spécifiques à la catégorie
    populateCategorySpecificFields(product) {
        const container = document.getElementById('category-specific-fields');
        if (!container) return;

        // Nettoyer le conteneur
        container.innerHTML = '';

        // Obtenir les champs selon la catégorie
        const fields = this.getCategoryFields(product.categorie);
        
        if (fields.length === 0) return;

        // Créer les champs dynamiquement
        fields.forEach((field, index) => {
            const value = product.donnees_fiche && product.donnees_fiche[index + 2] 
                ? product.donnees_fiche[index + 2] 
                : 'À REMPLIR';

            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label>${field.label}</label>
                <textarea id="${field.id}" rows="3" class="form-control">${value}</textarea>
            `;
            container.appendChild(div);
        });
    }

    // Obtenir les champs selon la catégorie
    getCategoryFields(categorie) {
        const fieldsMap = {
            'DRONE': [{ label: "Fonctions vidéo 🎥", id: "fiche-video" }],
            'CONSOLE': [
                { label: "Écran et affichage 🖥️", id: "fiche-ecran" },
                { label: "Contrôleurs et interaction 🕹️", id: "fiche-controleurs" }
            ],
            'TABLETTE': [
                { label: "Écran et affichage 🖥️", id: "fiche-ecran" },
                { label: "Accessoires et interaction 🖊️", id: "fiche-accessoires" }
            ],
            'SMARTPHONE': [{ label: "Appareil photo 📸", id: "fiche-photo" }],
            'PC GAMING': [{ label: "Fonctions gaming 🎮", id: "fiche-gaming" }],
            'SERVEUR': [{ label: "Performances et virtualisation 🖥️", id: "fiche-performance" }],
            'CASQUE AUDIO': [{ label: "Fonctions audio 🎧", id: "fiche-audio" }],
            'MONTRE CONNECTE': [{ label: "Fonctions sport et santé ⌚", id: "fiche-sport" }]
        };

        return fieldsMap[categorie] || [];
    }

    // Sauvegarder les modifications
    async saveProduct() {
        if (!this.currentEditingProduct) {
            this.showError('Aucun produit sélectionné pour la sauvegarde');
            return;
        }

        try {
            // Collecter les données du formulaire
            const formData = this.collectFormData();
            
            const response = await fetch(`${this.apiBaseUrl}/produits/${this.currentEditingProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Produit mis à jour avec succès !');
                await this.loadProducts(); // Recharger la liste
                await this.loadStats(); // Mettre à jour les stats
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur sauvegarde:', error);
            this.showError('Erreur lors de la sauvegarde: ' + error.message);
        }
    }

    // Collecter les données du formulaire
    collectFormData() {
        const data = {
            nom: document.getElementById('edit-nom').value,
            categorie: document.getElementById('edit-categorie').value,
            prix: document.getElementById('edit-prix').value,
            description: document.getElementById('edit-description').value,
            image: document.getElementById('edit-image').value,
            top_du_mois: document.getElementById('edit-top').value === 'true',
        };

        // Fonctionnalités avancées
        const fonctionnalitesText = document.getElementById('edit-fonctionnalites').value;
        data.fonctionnalites_avancees = fonctionnalitesText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // Données de fiche (base + spécifiques)
        data.donnees_fiche = [
            data.description,
            `💰 ${data.prix}`,
            `🧩 Spécifications matérielles\\n - ${data.fonctionnalites_avancees.join('\\n - ')}`
        ];

        // Ajouter les champs spécifiques à la catégorie
        const categoryFields = this.getCategoryFields(data.categorie);
        categoryFields.forEach(field => {
            const fieldElement = document.getElementById(field.id);
            if (fieldElement) {
                data.donnees_fiche.push(fieldElement.value);
            }
        });

        return data;
    }

    // Configurer les écouteurs d'événements
    setupEventListeners() {
        // Sélection de produit
        const productSelect = document.getElementById('product-select');
        if (productSelect) {
            productSelect.addEventListener('change', () => this.loadProductForEdit());
        }

        // Bouton de sauvegarde
        const saveBtn = document.getElementById('save-product-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveProduct());
        }

        // Auto-refresh des stats toutes les 30 secondes
        setInterval(() => this.loadStats(), 30000);
    }

    // Afficher un message d'erreur
    showError(message) {
        const resultDiv = document.getElementById('edit-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    ❌ ${message}
                </div>
            `;
        }
    }

    // Afficher un message de succès
    showSuccess(message) {
        const resultDiv = document.getElementById('edit-result');
        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    ✅ ${message}
                </div>
            `;
        }
    }
}

// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initialisation du dashboard admin avec PostgreSQL');
    window.adminManager = new AdminManager();
});

// Fonctions globales pour compatibilité avec l'HTML existant
function loadProductForEdit() {
    if (window.adminManager) {
        window.adminManager.loadProductForEdit();
    }
}

function saveProduct() {
    if (window.adminManager) {
        window.adminManager.saveProduct();
    }
}