// admin-postgres.js - Version FINALE avec les vrais IDs
class AdminManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.currentProducts = [];
        this.currentEditingProduct = null;
        this.init();
    }

    async init() {
        console.log('🚀 Interface admin PostgreSQL - VERSION FINALE');
        
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
                
                console.log('✅ Stats PostgreSQL:', stats);
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
                console.log(`✅ ${this.currentProducts.length} produits chargés`);
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
                console.log('✅ Produit chargé:', result.data.nom);
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
        // Utiliser le vrai conteneur : edit-category-fields
        const container = document.getElementById('edit-category-fields');
        if (!container) {
            console.error('❌ Conteneur edit-category-fields non trouvé !');
            return;
        }

        container.innerHTML = '<h3>📝 Données de fiche par catégorie</h3>';

        // Définir les champs selon la catégorie
        const fieldsMap = {
            'CONSOLE': [
                { label: "📝 Description détaillée", id: "edit-fiche-0" },
                { label: "💰 Prix", id: "edit-fiche-1" },
                { label: "🧩 Spécifications", id: "edit-fiche-2" },
                { label: "🖥️ Écran et affichage", id: "edit-fiche-3" },
                { label: "🕹️ Contrôleurs", id: "edit-fiche-4" },
                { label: "🌐 Connectivité", id: "edit-fiche-5" },
                { label: "🎮 Expérience utilisateur", id: "edit-fiche-6" }
            ],
            'DRONE': [
                { label: "📝 Description détaillée", id: "edit-fiche-0" },
                { label: "💰 Prix", id: "edit-fiche-1" },
                { label: "🧩 Spécifications", id: "edit-fiche-2" },
                { label: "🎥 Fonctions vidéo", id: "edit-fiche-3" },
                { label: "🌐 Connectivité", id: "edit-fiche-4" },
                { label: "🎮 Expérience utilisateur", id: "edit-fiche-5" }
            ],
            'TABLETTE': [
                { label: "📝 Description détaillée", id: "edit-fiche-0" },
                { label: "💰 Prix", id: "edit-fiche-1" },
                { label: "🧩 Spécifications", id: "edit-fiche-2" },
                { label: "🖥️ Écran et affichage", id: "edit-fiche-3" },
                { label: "🖊️ Accessoires", id: "edit-fiche-4" },
                { label: "🌐 Connectivité", id: "edit-fiche-5" },
                { label: "🎮 Expérience utilisateur", id: "edit-fiche-6" }
            ]
        };

        const fields = fieldsMap[product.categorie] || fieldsMap['CONSOLE'];
        
        // Créer les champs dynamiquement
        fields.forEach((field, index) => {
            const value = product.donnees_fiche && product.donnees_fiche[index] 
                ? product.donnees_fiche[index] 
                : '';

            const div = document.createElement('div');
            div.className = 'form-group';
            div.innerHTML = `
                <label>${field.label}</label>
                <textarea id="${field.id}" rows="3" style="width: 100%; padding: 10px; border: 2px solid #dee2e6; border-radius: 6px;">${value}</textarea>
            `;
            container.appendChild(div);
        });

        console.log(`📝 ${fields.length} champs générés pour ${product.categorie}`);
    }

    // ⭐ SAUVEGARDER AVEC FORMATAGE
    async saveToPostgreSQL() {
        if (!this.currentEditingProduct) {
            this.showError('Aucun produit sélectionné');
            return;
        }

        try {
            console.log('💾 Sauvegarde avec formatage...');
            
            const formData = this.collectFormData();
            console.log('📤 Données à sauvegarder:', formData);
            
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
        console.log('🎯 CollectFormData FINAL avec formatage');

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
        console.log('🎯 Formatage pour catégorie:', data.categorie);
        
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
        console.log('📝 donnees_fiche à envoyer:', data.donnees_fiche);

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

        console.log('⚙️ Événements configurés');
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
        console.log('✅', message);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initialisation AdminManager FINAL');
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