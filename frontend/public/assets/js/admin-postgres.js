// admin-postgres.js - Interface admin connectée directement à PostgreSQL
class AdminManager {
    constructor() {
        this.apiBaseUrl = '/api';
        this.currentProducts = [];
        this.currentEditingProduct = null;
        this.init();
    }

    async init() {
        console.log('🚀 Interface admin PostgreSQL directe');
        console.log('🔗 Base de données: postgres');
        
        await this.loadStats();
        await this.loadProducts();
        this.setupEventListeners();
    }

    // Charger les statistiques depuis PostgreSQL
    async loadStats() {
        try {
            console.log('📈 Chargement des statistiques PostgreSQL...');
            
            const response = await fetch(`${this.apiBaseUrl}/stats`);
            const result = await response.json();
            
            if (result.success) {
                const stats = result.stats;
                document.getElementById('total-products').textContent = stats.total_products || 0;
                document.getElementById('total-categories').textContent = stats.total_categories || 0;
                document.getElementById('featured-products').textContent = stats.featured_products || 0;
                
                console.log('✅ Stats PostgreSQL:', stats);
                this.showSuccess(`Connecté à PostgreSQL - ${stats.total_products} produits`);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur stats PostgreSQL:', error);
            this.showError('Erreur de connexion PostgreSQL');
        }
    }

    // Charger tous les produits depuis PostgreSQL
    async loadProducts() {
        try {
            console.log('📊 Chargement des produits PostgreSQL...');
            
            const response = await fetch(`${this.apiBaseUrl}/produits`);
            const result = await response.json();
            
            if (result.success) {
                this.currentProducts = result.data;
                this.populateProductSelect();
                console.log(`✅ ${result.total} produits PostgreSQL chargés`);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur produits PostgreSQL:', error);
            this.showError('Impossible de charger les produits PostgreSQL');
        }
    }

    // Remplir la liste déroulante des produits
    populateProductSelect() {
        const select = document.getElementById('product-select');
        if (!select) return;

        select.innerHTML = '<option value="">-- Choisir un produit PostgreSQL --</option>';

        // Grouper par catégorie
        const productsByCategory = this.groupByCategory(this.currentProducts);
        
        Object.keys(productsByCategory).sort().forEach(category => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = `${category} (${productsByCategory[category].length})`;
            
            productsByCategory[category].forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.nom} - ${product.prix}`;
                optgroup.appendChild(option);
            });
            
            select.appendChild(optgroup);
        });

        console.log('📋 Liste des produits mise à jour depuis PostgreSQL');
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
            console.log(`🔍 Chargement du produit ${productId} depuis PostgreSQL...`);
            
            const response = await fetch(`${this.apiBaseUrl}/produits/${productId}`);
            const result = await response.json();
            
            if (result.success) {
                this.currentEditingProduct = result.data;
                this.populateEditForm(result.data);
                document.getElementById('edit-form').style.display = 'block';
                console.log('✅ Produit PostgreSQL chargé:', result.data.nom);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur chargement produit:', error);
            this.showError('Impossible de charger le produit depuis PostgreSQL');
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
        const container = document.getElementById('donnees-fiche-container');
        if (!container) return;

        container.innerHTML = '';

        const fields = [
            { label: "Description détaillée", id: "fiche-description" },
            { label: "Prix (avec emoji 💰)", id: "fiche-prix" },
            { label: "Spécifications matérielles 🧩", id: "fiche-specs" }
        ];

        // Ajouter champs spécifiques selon catégorie
        const categoryFields = this.getCategoryFields(product.categorie);
        fields.push(...categoryFields);

        // Champs finaux communs
        fields.push(
            { label: "Fonctionnalités connectées 🌐", id: "fiche-connectees" },
            { label: "Expérience utilisateur 🎮", id: "fiche-experience" }
        );

        // Créer les champs dynamiquement
        fields.forEach((field, index) => {
            const value = product.donnees_fiche && product.donnees_fiche[index] 
                ? product.donnees_fiche[index] 
                : 'À REMPLIR';

            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label>${field.label}</label>
                <textarea id="${field.id}" rows="3" style="width: 100%; padding: 10px; border: 2px solid #dee2e6; border-radius: 6px; font-family: 'Manrope', sans-serif;">${value}</textarea>
            `;
            container.appendChild(div);
        });

        console.log(`📝 Formulaire généré pour ${product.categorie}`);
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

    // Sauvegarder les modifications vers PostgreSQL
    async saveToPostgreSQL() {
        if (!this.currentEditingProduct) {
            this.showError('Aucun produit sélectionné pour la sauvegarde');
            return;
        }

        try {
            console.log('💾 Sauvegarde vers PostgreSQL...');
            
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
                this.showSuccess('✅ Produit mis à jour dans PostgreSQL !');
                await this.loadProducts(); // Recharger la liste
                await this.loadStats(); // Mettre à jour les stats
                console.log('✅ Sauvegarde PostgreSQL réussie');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Erreur sauvegarde PostgreSQL:', error);
            this.showError('Erreur lors de la sauvegarde PostgreSQL: ' + error.message);
        }
    }

    // Collecter les données du formulaire
    collectFormData() {
        const data = {
            id: this.currentEditingProduct.id,
            nom: document.getElementById('edit-nom').value,
            categorie: document.getElementById('edit-categorie').value,
            prix: document.getElementById('edit-prix').value,
            description: document.getElementById('edit-description').value,
            image: document.getElementById('edit-image').value,
            lien: this.currentEditingProduct.lien, // Garder le lien existant
            top_du_mois: document.getElementById('edit-top').value === 'true',
        };

        // Fonctionnalités avancées
        const fonctionnalitesText = document.getElementById('edit-fonctionnalites').value;
        data.fonctionnalites_avancees = fonctionnalitesText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // Données de fiche
        data.donnees_fiche = [];
        const textareas = document.querySelectorAll('#donnees-fiche-container textarea');
        textareas.forEach(textarea => {
            data.donnees_fiche.push(textarea.value);
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

        // Formulaire de sauvegarde
        const editForm = document.getElementById('product-edit-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveToPostgreSQL();
            });
        }

        console.log('⚙️ Événements configurés');
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
    console.log('🎯 Initialisation interface admin PostgreSQL directe');
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
        window.adminManager.saveToPostgreSQL();
    }
}