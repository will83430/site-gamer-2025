// Configuration
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : `http://${window.location.hostname}:3000/api`;
let allProducts = [];
let currentEditingId = null;
let currentImageData = {};
let currentFicheData = {};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initImageColumn();
    loadStats();
    loadProducts();
    setupDragAndDrop();
    updateCategoryFields('new');

    // Écouteurs pour le titre automatique - CORRECTION
    const newNomInput = document.getElementById('new-nom');
    const editNomInput = document.getElementById('edit-nom');

    if (newNomInput) {
        newNomInput.addEventListener('input', function () {
            const titreField = document.getElementById('new-titre-affiche');
            if (titreField && !titreField.value.trim()) {
                titreField.value = formatTitreAffiche(this.value);
            }
        });
    }

    if (editNomInput) {
        editNomInput.addEventListener('input', function () {
            const titreField = document.getElementById('edit-titre-affiche');
            if (titreField && !titreField.value.trim()) {
                titreField.value = formatTitreAffiche(this.value);
            }
        });
    }
});

// Gérer la sélection de fichier HTML
function handleFicheSelect(event, prefix) {
    const file = event.target.files[0];
    if (!file) return;

    // Récupérer le nom du fichier
    const fileName = file.name;
    const pathInput = document.getElementById(`${prefix}-lien`);

    // Si le champ est vide, mettre juste le nom du fichier
    if (!pathInput.value) {
        pathInput.value = `fiches/${fileName}`;
    }

    // Lire le contenu du fichier HTML (optionnel)
    const reader = new FileReader();
    reader.onload = function (e) {
        currentFicheData[prefix] = {
            name: fileName,
            content: e.target.result
        };
        showMessage(`📄 Fichier "${fileName}" sélectionné`, 'success');
    };
    reader.readAsText(file);
}

// Afficher le sélecteur de fiches
async function showFicheSelector(prefix) {
    const selector = document.getElementById(`${prefix}-fiche-selector`);

    if (selector.style.display === 'block') {
        selector.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/fiches-list`);
        const data = await response.json();

        if (data.success && data.files.length > 0) {
            // Grouper par dossier
            const grouped = data.files.reduce((acc, file) => {
                if (!acc[file.folder]) acc[file.folder] = [];
                acc[file.folder].push(file);
                return acc;
            }, {});

            let html = '<div style="font-size: 14px;">';
            Object.keys(grouped).sort().forEach(folder => {
                html += `<div style="margin-bottom: 10px;">
                        <strong style="color: #667eea;">📁 ${folder}/</strong>
                        <div style="margin-left: 20px; margin-top: 5px;">`;

                grouped[folder].forEach(file => {
                    html += `
                            <div style="padding: 5px; cursor: pointer; hover: background: #f0f0f0;" 
                                 onmouseover="this.style.background='#f0f0f0'" 
                                 onmouseout="this.style.background='none'"
                                 onclick="selectFiche('${prefix}', '${file.path}')">
                                📄 ${file.name}
                            </div>`;
                });

                html += '</div></div>';
            });
            html += '</div>';

            selector.innerHTML = html;
            selector.style.display = 'block';
        } else {
            selector.innerHTML = '<p style="color: #888;">Aucun fichier HTML trouvé dans les dossiers de fiches</p>';
            selector.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur chargement fiches:', error);
        selector.innerHTML = '<p style="color: #dc3545;">Erreur lors du chargement des fiches</p>';
        selector.style.display = 'block';
    }
}

// Sélectionner une fiche depuis la liste
function selectFiche(prefix, path) {
    document.getElementById(`${prefix}-lien`).value = path;
    document.getElementById(`${prefix}-fiche-selector`).style.display = 'none';
    showMessage(`✅ Fiche sélectionnée: ${path}`, 'success');
}

// Initialiser la colonne image si nécessaire
async function initImageColumn() {
    try {
        await fetch(`${API_URL}/init-image-column`, { method: 'POST' });
    } catch (error) {
        console.error('Erreur init colonne:', error);
    }
}

// Navigation tabs
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
}

// Charger les statistiques
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/stats`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('total-products').textContent = data.stats.total_products || 0;
            document.getElementById('total-categories').textContent = data.stats.total_categories || 0;
            document.getElementById('featured-products').textContent = data.stats.featured_products || 0;
        }
    } catch (error) {
        console.error('Erreur stats:', error);
    }
}

// Charger tous les produits
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/produits`);
        const data = await response.json();

        if (data.success) {
            allProducts = data.data;
            displayProducts(allProducts);
            populateEditSelect(allProducts);
        }
    } catch (error) {
        console.error('Erreur chargement:', error);
        showMessage('Erreur de chargement des produits', 'danger');
    }
}

// Afficher les produits dans le tableau
function displayProducts(products) {
    const tbody = document.getElementById('products-list');

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Aucun produit trouvé</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => {
        let imageUrl = product.image || '';
        if (imageUrl) {
            if (imageUrl.startsWith('/')) {
                imageUrl = imageUrl.substring(1);
            }
            if (!imageUrl.startsWith('http') && !imageUrl.startsWith('assets/images/')) {
                imageUrl = `assets/images/${imageUrl}`;
            }
        } else {
            imageUrl = 'data:image/svg+xml,...'; // ou placeholder
        }

        const imageHtml = imageUrl
            ? `<img src="${imageUrl}" alt="${product.nom}" class="product-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E📦%3C/text%3E%3C/svg%3E'">`
            : '<div style="width:60px;height:60px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;">📦</div>';

        return `
            <tr>
                <td>${imageHtml}</td>
                <td>${product.id}</td>
                <td><strong>${product.nom}</strong></td>
                <td>${product.categorie || '-'}</td>
                <td>${product.prix || '-'}</td>
                <td>${product.top_du_mois ? '⭐' : '-'}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-warning" onclick="editProduct('${product.id}')">✏️</button>
                        <button class="btn btn-danger" onclick="confirmDelete('${product.id}')">🗑️</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Gérer la sélection d'image
async function handleImageSelect(event, prefix) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
        showMessage('❌ L\'image est trop lourde (max 10MB)', 'danger');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        // Stocker l'image en base64
        currentImageData[prefix] = e.target.result;

        // Afficher l'aperçu
        document.getElementById(`${prefix}-upload-area`).style.display = 'none';
        document.getElementById(`${prefix}-image-preview`).style.display = 'block';
        document.getElementById(`${prefix}-preview-img`).src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Supprimer l'image
function removeImage(prefix) {
    delete currentImageData[prefix];
    const uploadArea = document.getElementById(`${prefix}-upload-area`);
    if (uploadArea) uploadArea.style.display = 'block';
    const imagePreview = document.getElementById(`${prefix}-image-preview`);
    if (imagePreview) imagePreview.style.display = 'none';
    const previewImg = document.getElementById(`${prefix}-preview-img`);
    if (previewImg) previewImg.src = '';
    const imageFile = document.getElementById(`${prefix}-image-file`);
    if (imageFile) imageFile.value = '';
}

// Créer un nouveau produit
async function createProduct(event) {
    event.preventDefault();

    // Récupérer les valeurs
    const nom = document.getElementById('new-nom').value;
    let titreAffiche = document.getElementById('new-titre-affiche').value.trim();

    // Si titre_affiche est vide, le générer automatiquement à partir du nom
    if (!titreAffiche) {
        titreAffiche = formatTitreAffiche(nom);
        // Optionnel : remplir le champ dans l'interface pour que l'utilisateur voie
        document.getElementById('new-titre-affiche').value = titreAffiche;
    }

    const productData = {
        nom: nom,
        titre_affiche: titreAffiche, // Maintenant toujours rempli
        categorie: document.getElementById('new-categorie').value,
        prix: document.getElementById('new-prix').value,
        description: document.getElementById('new-description').value,
        lien: document.getElementById('new-lien').value,
        top_du_mois: document.getElementById('new-top').value === 'true',
        fonctionnalites_avancees: document.getElementById('new-fonctionnalites').value.split('\n').filter(f => f.trim()),
        donnees_fiche: collectCategoryData('new'),
    };

    // Ajouter l'image si présente
    if (currentImageData['new']) {
        const fileInput = document.getElementById('new-image-file');
        if (fileInput && fileInput.files[0]) {
            productData.image = fileInput.files[0].name;
        }
    }

    try {
        const response = await fetch(`${API_URL}/produits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (data.success) {
            showMessage('✅ Produit créé avec succès!', 'success');
            resetCreateForm();
            loadProducts();
            loadStats();
        } else {
            showMessage('❌ Erreur: ' + data.error, 'danger');
        }
    } catch (error) {
        console.error('Erreur création:', error);
        showMessage('❌ Erreur lors de la création', 'danger');
    }
}

// Charger un produit pour édition
async function loadProductForEdit() {
    const select = document.getElementById('edit-product-select');
    const productId = select.value;

    if (!productId) {
        document.getElementById('edit-form-container').style.display = 'none';
        // AJOUT: Nettoyer les données d'image quand on désélectionne
        delete currentImageData['edit'];
        if (typeof modernUpload !== 'undefined' && modernUpload.edit) {
            modernUpload.edit.removePreview();
        }
        return;
    }

    // AJOUT: Nettoyer avant de charger un nouveau produit
    delete currentImageData['edit'];
    if (typeof modernUpload !== 'undefined' && modernUpload.edit) {
        modernUpload.edit.removePreview();
    }

    try {
        const response = await fetch(`${API_URL}/produits/${productId}`);
        const data = await response.json();

        if (data.success) {
            currentEditingId = productId;
            populateEditForm(data.data);
            document.getElementById('edit-form-container').style.display = 'block';

            // AJOUT: Forcer le rafraîchissement du titre après le chargement
            setTimeout(() => {
                const editNom = document.getElementById('edit-nom').value;
                const editTitre = document.getElementById('edit-titre-affiche');
                if (editTitre && !editTitre.value.trim() && editNom.trim()) {
                    editTitre.value = formatTitreAffiche(editNom);
                }
            }, 100);
        }
    } catch (error) {
        console.error('Erreur chargement:', error);
        showMessage('❌ Erreur lors du chargement', 'danger');
    }
}

// Remplir le formulaire d'édition
function populateEditForm(product) {
    document.getElementById('edit-nom').value = product.nom || '';
    document.getElementById('edit-titre-affiche').value = product.titre_affiche || ''; // AJOUT
    document.getElementById('edit-categorie').value = product.categorie || '';
    document.getElementById('edit-prix').value = product.prix || '';
    document.getElementById('edit-description').value = product.description || '';
    document.getElementById('edit-lien').value = product.lien || '';
    document.getElementById('edit-top').value = product.top_du_mois ? 'true' : 'false';

    const fonctionnalites = Array.isArray(product.fonctionnalites_avancees)
        ? product.fonctionnalites_avancees.join('\n')
        : '';
    document.getElementById('edit-fonctionnalites').value = fonctionnalites;

    // Afficher l'image existante
    if (product.image) {
        let imageUrl = product.image;
        let imageFileName = product.image;

        // Extraire juste le nom du fichier pour currentImageData
        if (imageUrl.startsWith('assets/images/')) {
            imageFileName = imageUrl.replace('assets/images/', '');
            // Pour l'affichage, garder le chemin complet
            imageUrl = imageUrl;
        } else if (imageUrl.startsWith('/')) {
            imageFileName = imageUrl.substring(1);
            imageUrl = `assets/images/${imageFileName}`;
        } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            // Juste un nom de fichier
            imageFileName = imageUrl;
            imageUrl = `assets/images/${imageUrl}`;
        }

        const editUploadArea = document.getElementById('edit-upload-area');
        const editImagePreview = document.getElementById('edit-image-preview');
        const editPreviewImg = document.getElementById('edit-preview-img');

        if (editUploadArea) editUploadArea.style.display = 'none';
        if (editImagePreview) editImagePreview.style.display = 'block';
        if (editPreviewImg) editPreviewImg.src = imageUrl;
        
        // IMPORTANT: Stocker juste le nom du fichier
        currentImageData['edit'] = imageFileName;
    }

    updateCategoryFields('edit', product.donnees_fiche);
    autoFillFichePath('edit');
}

// Mettre à jour un produit
async function updateProduct(event) {
    event.preventDefault();

    if (!currentEditingId) return;

    // Récupérer les valeurs
    const nom = document.getElementById('edit-nom').value;
    let titreAffiche = document.getElementById('edit-titre-affiche').value.trim();

    // Si titre_affiche est vide, le générer automatiquement
    if (!titreAffiche) {
        titreAffiche = formatTitreAffiche(nom);
        document.getElementById('edit-titre-affiche').value = titreAffiche;
    }

    const productData = {
        nom: nom,
        titre_affiche: titreAffiche, // Maintenant toujours rempli
        categorie: document.getElementById('edit-categorie').value,
        prix: document.getElementById('edit-prix').value,
        description: document.getElementById('edit-description').value,
        lien: document.getElementById('edit-lien').value,
        top_du_mois: document.getElementById('edit-top').value === 'true',
        fonctionnalites_avancees: document.getElementById('edit-fonctionnalites').value.split('\n').filter(f => f.trim()),
        donnees_fiche: collectCategoryData('edit')
    };

    // Ajouter l'image si présente
    if (currentImageData['edit']) {
        const fileInput = document.getElementById('edit-image-file');
        if (fileInput && fileInput.files[0]) {
            // Nouveau fichier - juste le nom
            productData.image = fileInput.files[0].name;
        } else if (typeof currentImageData['edit'] === 'string' && 
                   currentImageData['edit'].trim() && 
                   !currentImageData['edit'].startsWith('data:')) {
            // Image existante - nettoyer le nom
            let imageName = currentImageData['edit'];
            
            if (imageName.startsWith('assets/images/')) {
                imageName = imageName.replace('assets/images/', '');
            }
            if (imageName.startsWith('/')) {
                imageName = imageName.substring(1);
            }
            
            productData.image = imageName;
        }
    }

    try {
        const response = await fetch(`${API_URL}/produits/${currentEditingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        const data = await response.json();

        if (data.success) {
            showMessage('✅ Produit mis à jour avec succès!', 'success');
            loadProducts();
            loadStats();
        } else {
            showMessage('❌ Erreur: ' + data.error, 'danger');
        }
    } catch (error) {
        console.error('Erreur mise à jour:', error);
        showMessage('❌ Erreur lors de la mise à jour', 'danger');
    }
}

// Supprimer un produit
async function deleteProduct() {
    if (!currentEditingId) return;

    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce produit?')) return;

    try {
        // 1. Supprimer la fiche locale AVANT la BDD
        await fetch(`${API_URL}/fiches/${currentEditingId}`, { method: 'DELETE' });

        // 2. Supprimer le produit en BDD
        const response = await fetch(`${API_URL}/produits/${currentEditingId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
            showMessage('✅ Produit et fiche supprimés avec succès!', 'success');
            document.getElementById('edit-form-container').style.display = 'none';
            loadProducts();
            loadStats();
        } else {
            showMessage('❌ Erreur: ' + data.error, 'danger');
        }
    } catch (error) {
        showMessage('❌ Erreur lors de la suppression', 'danger');
    }
}

// Supprimer un produit (raccourci depuis la colonne Actions)  
async function confirmDelete(productId) {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }

    try {
        // 1. Supprimer la fiche locale AVANT la BDD
        await fetch(`${API_URL}/fiches/${productId}`, { method: 'DELETE' });

        // 2. Supprimer le produit en BDD
        const response = await fetch(`${API_URL}/produits/${productId}`, {
            method: 'DELETE'
        });
        const data = await response.json();

        if (data.success) {
            showMessage('✅ Produit et fiche supprimés avec succès !', 'success');
            loadProducts();
            loadStats();
        } else {
            showMessage('❌ Erreur: ' + data.error, 'danger');
        }
    } catch (error) {
        showMessage('❌ Erreur lors de la suppression', 'danger');
    }
}

// Éditer un produit (raccourci depuis la colonne Actions)
function editProduct(productId) {
    // Aller dans l'onglet modifier
    showTab('modify');

    // Sélectionner le produit dans la liste déroulante
    const select = document.getElementById('edit-product-select');
    if (select) {
        select.value = productId;
        // Déclencher le chargement du formulaire
        loadProductForEdit();
    } else {
        console.error('❌ Element edit-product-select non trouvé');
    }
}

async function generateFicheFromEdit() {
    if (!currentEditingId) {
        showMessage('Sélectionnez un produit', 'warning');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/generate-fiche/${currentEditingId}`, {
            method: 'POST'
        });

        const data = await response.json();
        if (data.success) {
            showMessage(`Fiche générée: ${data.path}`, 'success');
        } else {
            showMessage(`Erreur: ${data.error}`, 'danger');
        }
    } catch (error) {
        showMessage('Erreur de génération', 'danger');
    }
}

// Peupler le select d'édition
function populateEditSelect(products) {
    const select = document.getElementById('edit-product-select');
    select.innerHTML = '<option value="">-- Choisir un produit --</option>';

    const grouped = products.reduce((acc, product) => {
        const cat = product.categorie || 'Sans catégorie';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(product);
        return acc;
    }, {});

    Object.keys(grouped).sort().forEach(category => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;

        grouped[category].forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.nom} - ${product.prix || 'N/A'}`;
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    });
}

// Mettre à jour les champs spécifiques à la catégorie
function updateCategoryFields(prefix, existingData = null) {
    const category = document.getElementById(`${prefix}-categorie`).value;
    const container = document.getElementById(`${prefix}-category-fields`);

    if (!category) {
        container.innerHTML = '';
        return;
    }

    const fields = getCategorySpecificFields(category);

    // 1. Récupère les valeurs déjà saisies AVANT de régénérer le HTML
    let previousValues = [];
    for (let i = 0; i < fields.length; i++) {
        const textarea = document.getElementById(`${prefix}-fiche-${i}`);
        if (textarea) {
            previousValues[i] = textarea.value;
        }
    }

    container.innerHTML = `
        <h3 style="margin-top: 30px; margin-bottom: 20px; color: #667eea;">
            📋 Données de fiche pour ${category}
        </h3>
        ${fields.map((field, index) => {
            // Priorité : existingData (édition) > texte déjà saisi > vide
            let value = '';
            if (existingData && existingData[index]) {
                const contenu = existingData[index];
                // Gérer les \n échappés
                const contenuNettoye = contenu.replace(/\\n/g, '\n');

                if (contenuNettoye.includes('\n') && /^[^\w\s]/.test(contenuNettoye)) {
                    value = contenuNettoye.split('\n').slice(1).join('\n');
                } else {
                    value = contenu;
                }
            } else if (previousValues[index]) {
                value = previousValues[index];
            }
            return `
                <div class="form-group">
                    <label>${field.emoji} ${field.label}</label>
                    <textarea 
                        id="${prefix}-fiche-${index}" 
                        rows="3"
                        placeholder="${field.placeholder || ''}"
                    >${value}</textarea>
                </div>
            `;
        }).join('')}
    `;
}

// Obtenir les champs spécifiques à une catégorie
function getCategorySpecificFields(category) {
    const baseFields = [
        { emoji: "📝", label: "Description détaillée", placeholder: "Description complète du produit" },
        { emoji: "💰", label: "Prix", placeholder: "Ex: 1299€ - Prix compétitif" },
        { emoji: "🧩", label: "Spécifications matérielles", placeholder: "Processeur, RAM, stockage..." }
    ];

    const categorySpecific = {
        'DRONE': [
            { emoji: "🎥", label: "Fonctions vidéo et photo", placeholder: "Résolution, stabilisation, modes photo..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Wi-Fi, Bluetooth, radio..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Pilotage, application mobile..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Accessoires inclus", placeholder: "Batteries, hélices, sacoche..." }
        ],
        'CONSOLE': [
            { emoji: "🖥️", label: "Écran et affichage", placeholder: "Résolution, taux de rafraîchissement..." },
            { emoji: "🕹️", label: "Contrôleurs et interaction", placeholder: "Manettes, accessoires..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Wi-Fi, Ethernet, Bluetooth..." },
            { emoji: "🎮", label: "Expérience de jeu", placeholder: "Interface, exclusivités..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Contenu de la boîte", placeholder: "Manettes, câbles..." }
        ],
        'TABLETTE': [
            { emoji: "🖥️", label: "Écran et affichage", placeholder: "Taille, résolution, technologie..." },
            { emoji: "🖊️", label: "Accessoires et interaction", placeholder: "Stylet, clavier..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Wi-Fi, 4G/5G, Bluetooth..." },
            { emoji: "🎮", label: "Applications et usages", placeholder: "Productivité, jeux..." },
            { emoji: "🔋", label: "Autonomie", placeholder: "Batterie, recharge..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'SMARTPHONE': [
            { emoji: "📸", label: "Appareil photo", placeholder: "Nombre de capteurs, résolution..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "5G, Wi-Fi, Bluetooth..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Interface, OS..." },
            { emoji: "🔋", label: "Autonomie", placeholder: "Batterie, recharge..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Contenu de la boîte", placeholder: "Chargeur, câble..." }
        ],
        'PC GAMING': [
            { emoji: "🎮", label: "Performances gaming", placeholder: "GPU, CPU, FPS..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Wi-Fi, Ethernet, Bluetooth..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Refroidissement, bruit..." },
            { emoji: "🔋", label: "Gestion thermique", placeholder: "Ventilation, watercooling..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Accessoires inclus", placeholder: "Souris, clavier..." }
        ],
        'SERVEUR': [
            { emoji: "🖥️", label: "Performances et virtualisation", placeholder: "CPU, RAM, hyperviseur..." },
            { emoji: "🌐", label: "Connectivité réseau", placeholder: "Ethernet, fibre..." },
            { emoji: "🎮", label: "Gestion et monitoring", placeholder: "Logiciels, alertes..." },
            { emoji: "🔒", label: "Sécurité et redondance", placeholder: "RAID, alimentation..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'CASQUE AUDIO': [
            { emoji: "🎧", label: "Fonctions audio", placeholder: "ANC, spatialisation..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Bluetooth, filaire..." },
            { emoji: "🎮", label: "Confort et utilisation", placeholder: "Poids, coussinets..." },
            { emoji: "🔋", label: "Autonomie", placeholder: "Batterie, recharge..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'MONTRE CONNECTEE': [
            { emoji: "⌚", label: "Fonctions sport et santé", placeholder: "Cardio, GPS, sommeil..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Bluetooth, Wi-Fi..." },
            { emoji: "🎮", label: "Applications et autonomie", placeholder: "App store, batterie..." },
            { emoji: "🔋", label: "Autonomie", placeholder: "Batterie, recharge..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'CAMERA': [
            { emoji: "🎥", label: "Fonctions vidéo et photo", placeholder: "Résolution, formats, modes..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Wi-Fi, Bluetooth..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Interface, ergonomie..." },
            { emoji: "🔋", label: "Autonomie", placeholder: "Batterie, recharge..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Accessoires inclus", placeholder: "Objectifs, câbles..." }
        ],
        'PERIPHERIQUES': [
            { emoji: "🎛️", label: "Fonctions avancées", placeholder: "Macros, RGB, capteurs..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "USB, Bluetooth, sans fil..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Ergonomie, confort..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Contenu de la boîte", placeholder: "Accessoires inclus..." },
            { emoji: "🔋", label: "Autonomie", placeholder: "Batterie, recharge..." }
        ],
        'CASQUE VR': [
            { emoji: "🕹️", label: "Contrôleurs et interaction", placeholder: "Manettes, capteurs..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "USB, Bluetooth, Wi-Fi..." },
            { emoji: "🎮", label: "Expérience immersive", placeholder: "Champ de vision, confort..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'IMPRIMANTE 3D': [
            { emoji: "🖨️", label: "Fonctions d'impression", placeholder: "Technologie, matériaux..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "USB, Wi-Fi..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Logiciel, calibration..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'ECRAN TV': [
            { emoji: "🖥️", label: "Écran et affichage", placeholder: "Taille, résolution, HDR..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "HDMI, Wi-Fi..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Interface, télécommande..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'VIDEO PROJECTEUR': [
            { emoji: "🎥", label: "Fonctions vidéo", placeholder: "Résolution, luminosité..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "HDMI, Wi-Fi..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Installation, réglages..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'BOX INTERNET': [
            { emoji: "🌐", label: "Connectivité", placeholder: "Ethernet, Wi-Fi..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Interface, installation..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ],
        'TABLEAU INTERACTIF': [
            { emoji: "🖥️", label: "Écran et affichage", placeholder: "Taille, résolution..." },
            { emoji: "🖊️", label: "Accessoires et interaction", placeholder: "Stylet, support..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Wi-Fi, HDMI..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Logiciel, ergonomie..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." }
        ]
    };

    return [
        ...baseFields,
        ...(categorySpecific[category] || [])
    ];
}

// Collecter les données de catégorie AVEC LABELS ET ICÔNES
function collectCategoryData(prefix) {
    const data = [];
    const category = document.getElementById(`${prefix}-categorie`).value;
    const fields = getCategorySpecificFields(category);

    for (let index = 0; index < fields.length; index++) {
        const field = document.getElementById(`${prefix}-fiche-${index}`);
        if (!field) continue;
        // Format : "📝 Description détaillée\nLe contenu saisi"
        data.push(`${fields[index].emoji} ${fields[index].label}\n${field.value.trim()}`);
    }
    return data;
}

function resetCreateForm() {
    document.getElementById('create-form').reset();
    document.getElementById('new-category-fields').innerHTML = '';

    // AJOUT: Nettoyer complètement les données d'image
    delete currentImageData['new'];

    // Réinitialiser la zone d'upload moderne
    if (typeof modernUpload !== 'undefined' && modernUpload.new) {
        modernUpload.new.removePreview();
    }
}

// Afficher un message
function showMessage(message, type) {
    const container = document.getElementById('message-container');
    container.innerHTML = `
        <div class="alert alert-${type}">
            ${message}
        </div>
    `;

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
    // Ctrl+N : Nouveau produit
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        showTab('create');
    }

    // Ctrl+E : Éditer
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        showTab('modify');
    }

    // Ctrl+L : Liste
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        showTab('list');
    }
});

// Auto-refresh toutes les 30 secondes
setInterval(() => {
    loadStats();
}, 30000);

// DRAG & DROP MODERNE
class ModernImageUpload {
    constructor(prefix) {
        this.prefix = prefix;
        this.uploadZone = document.getElementById(`${prefix}-upload-zone`);
        this.fileInput = document.getElementById(`${prefix}-image-file`);
        this.previewContainer = document.getElementById(`${prefix}-preview-container`);
        this.currentFile = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (!this.uploadZone || !this.fileInput) return;

        this.uploadZone.addEventListener('click', () => {
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        this.uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadZone.classList.add('dragover');
        });

        this.uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
        });

        this.uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    handleFiles(files) {
        if (files.length === 0) return;

        const file = files[0];

        if (!file.type.startsWith('image/')) {
            showMessage(`❌ ${file.name} n'est pas une image`, 'danger');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showMessage(`❌ ${file.name} dépasse 5MB`, 'danger');
            return;
        }

        this.currentFile = file;
        this.createPreview(file);
        showMessage(`✅ Image ${file.name} sélectionnée`, 'success');
    }

    createPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewContainer.innerHTML = `
                <div class="preview-card-modern">
                    <img src="${e.target.result}" alt="Aperçu" style="width:100%;height:200px;object-fit:cover;">
                    <div style="padding:15px;text-align:center;">
                        <div style="font-weight:600;color:#333;margin-bottom:10px;">${file.name}</div>
                        <div class="upload-progress" style="display:none;">
                            <div class="progress-bar" id="progress-${this.prefix}"></div>
                        </div>
                        <div style="display:flex;gap:10px;justify-content:center;margin-top:10px;">
                            <button type="button" class="btn btn-primary" onclick="modernUpload.${this.prefix}.simulateUpload()">
                                📤 Traiter
                            </button>
                            <button type="button" class="btn btn-danger" onclick="modernUpload.${this.prefix}.removePreview()">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            `;

            currentImageData[this.prefix] = file.name;
        };
        reader.readAsDataURL(file);
    }

    async simulateUpload() {
        const progressBar = document.getElementById(`progress-${this.prefix}`);
        const progressContainer = progressBar.parentElement;

        progressContainer.style.display = 'block';

        for (let i = 0; i <= 100; i += 20) {
            progressBar.style.width = i + '%';
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        showMessage(`✅ Image traitée avec succès !`, 'success');
        progressContainer.style.display = 'none';
    }

    removePreview() {
        this.previewContainer.innerHTML = '';
        this.fileInput.value = '';
        this.currentFile = null;

        // CORRECTION: Nettoyer complètement les données
        delete currentImageData[this.prefix];

        // Réafficher la zone d'upload
        const uploadZone = document.getElementById(`${this.prefix}-upload-zone`);
        if (uploadZone) {
            uploadZone.style.display = 'block';
        }
    }
}

// Initialisation des uploaders modernes
const modernUpload = {};

// Remplacer l'ancien setupDragAndDrop
function setupDragAndDrop() {
    setTimeout(() => {
        modernUpload.new = new ModernImageUpload('new');
        modernUpload.edit = new ModernImageUpload('edit');
    }, 500);
}

/**
 * Sauvegarde un produit (création ou modification) et génère la fiche HTML.
 * @param {'new'|'edit'} mode - 'new' pour création, 'edit' pour modification
 */
async function saveProductAndGenerateFiche(mode) {
    const isEdit = mode === 'edit';
    const prefix = isEdit ? 'edit' : 'new';
    const id = isEdit ? currentEditingId : null;

    let titreAfficheValue = document.getElementById(`${prefix}-titre-affiche`).value.trim();
    if (!titreAfficheValue) {
        titreAfficheValue = formatTitreAffiche(document.getElementById(`${prefix}-nom`).value);
    }

    const productData = {
        nom: document.getElementById(`${prefix}-nom`).value,
        titre_affiche: titreAfficheValue,
        categorie: document.getElementById(`${prefix}-categorie`).value,
        prix: document.getElementById(`${prefix}-prix`).value,
        description: document.getElementById(`${prefix}-description`).value,
        lien: document.getElementById(`${prefix}-lien`).value,
        top_du_mois: document.getElementById(`${prefix}-top`).value === 'true',
        fonctionnalites_avancees: document.getElementById(`${prefix}-fonctionnalites`).value.split('\n').filter(f => f.trim()),
        donnees_fiche: collectCategoryData(prefix)
    };

    if (currentImageData[prefix]) {
        const fileInput = document.getElementById(`${prefix}-image-file`);
        if (fileInput && fileInput.files[0]) {
            // Nouveau fichier sélectionné - stocker JUSTE le nom du fichier
            productData.image = fileInput.files[0].name;
        } else if (typeof currentImageData[prefix] === 'string' && 
                   currentImageData[prefix].trim() && 
                   !currentImageData[prefix].startsWith('data:')) {
            // Image existante - nettoyer pour ne garder que le nom du fichier
            let imageName = currentImageData[prefix];
            
            // Supprimer le chemin assets/images/ s'il existe
            if (imageName.startsWith('assets/images/')) {
                imageName = imageName.replace('assets/images/', '');
            }
            
            // Supprimer le / au début s'il existe
            if (imageName.startsWith('/')) {
                imageName = imageName.substring(1);
            }
            
            productData.image = imageName;
        }
    }

    // Validation
    if (!productData.nom || !productData.categorie) {
        showMessage('⚠️ Nom et catégorie sont obligatoires', 'warning');
        return;
    }

    try {
        // 1. Création ou modification du produit
        let response, data;
        if (isEdit) {
            response = await fetch(`${API_URL}/produits/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            response = await fetch(`${API_URL}/produits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }
        data = await response.json();

        if (!data.success) {
            showMessage('❌ Erreur: ' + data.error, 'danger');
            return;
        }

        const productId = isEdit ? id : data.data.id;

        // 2. Générer la fiche HTML
        const ficheResponse = await fetch(`${API_URL}/generate-fiche/${productId}`, {
            method: 'POST'
        });
        const ficheData = await ficheResponse.json();

        if (ficheData.success) {
            showMessage(`✅ Produit ${isEdit ? 'modifié' : 'créé'} et fiche générée: ${ficheData.path}`, 'success');
        } else {
            showMessage(`✅ Produit ${isEdit ? 'modifié' : 'créé'} mais erreur fiche: ${ficheData.error}`, 'warning');
        }

        if (!isEdit) resetCreateForm();
        loadProducts();
        loadStats();

    } catch (error) {
        console.error('Erreur:', error);
        showMessage('❌ Erreur lors du processus', 'danger');
    }
}

function autoFillFichePath(prefix) {
    const nom = document.getElementById(`${prefix}-nom`).value.trim();
    const categorie = document.getElementById(`${prefix}-categorie`).value.trim();
    if (!nom || !categorie) return;

    // Formatage du chemin
    const catSlug = categorie.toLowerCase().replace(/\s+/g, '-');
    const nomSlug = nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // retire accents
        .replace(/[^a-zA-Z0-9]/g, '-') // remplace tout sauf lettres/chiffres par tiret
        .replace(/-+/g, '-') // évite les doubles tirets
        .replace(/^-|-$/g, '') // pas de tiret au début/fin
        .toLowerCase();

    const path = `fiches/${catSlug}/${nomSlug}.html`;
    document.getElementById(`${prefix}-lien`).value = path;
}

function formatTitreAffiche(nom) {
    if (!nom) return '';

    // Liste d'acronymes et termes à garder en majuscules
    const keepUppercase = ['EOS', 'RAM', 'SSD', 'HDD', 'CPU', 'GPU', 'LED', 'LCD', 'HDR', 'USB', 'HD', 'UHD', 'FHD', '4K', '8K', 'PS5', 'PS4', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

    return nom
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => {
            // Vérifier si le mot (en majuscules) est dans la liste à conserver en majuscules
            if (keepUppercase.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }
            // Sinon, appliquer la capitalisation standard
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
}