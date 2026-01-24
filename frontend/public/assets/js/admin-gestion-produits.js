// Configuration
const API_URL = '/api';
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

// REMPLACEZ la section ligne ~377-475 par ceci :

// Charger un produit pour édition
async function loadProductForEdit() {
    const select = document.getElementById('edit-product-select');
    const productId = select.value;

    if (!productId) {
        document.getElementById('edit-form-container').style.display = 'none';
        delete currentImageData['edit'];
        return;
    }

    delete currentImageData['edit'];

    try {
        const response = await fetch(`${API_URL}/produits/${productId}`);
        const data = await response.json();

        if (data.success) {
            const product = data.data;
            currentEditingId = productId;
            populateEditForm(product);
            document.getElementById('edit-form-container').style.display = 'block';

            // Forcer le rafraîchissement du titre après le chargement
            setTimeout(() => {
                const editNom = document.getElementById('edit-nom').value;
                const editTitre = document.getElementById('edit-titre-affiche');
                if (editTitre && !editTitre.value.trim() && editNom.trim()) {
                    editTitre.value = formatTitreAffiche(editNom);
                }
            }, 100);

            // Afficher l'image actuelle
            displayCurrentImage('edit', product.image);
        }
    } catch (error) {
        console.error('Erreur chargement:', error);
        showMessage('❌ Erreur lors du chargement', 'danger');
    }
}

// Remplir le formulaire d'édition
function populateEditForm(product) {
    document.getElementById('edit-nom').value = product.nom || '';
    document.getElementById('edit-titre-affiche').value = product.titre_affiche || '';
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
            imageUrl = imageUrl;
        } else if (imageUrl.startsWith('/')) {
            imageFileName = imageUrl.substring(1);
            imageUrl = `assets/images/${imageFileName}`;
        } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
            imageFileName = imageUrl;
            imageUrl = `assets/images/${imageUrl}`;
        }

        const editUploadArea = document.getElementById('edit-upload-area');
        const editImagePreview = document.getElementById('edit-image-preview');
        const editPreviewImg = document.getElementById('edit-preview-img');

        if (editUploadArea) editUploadArea.style.display = 'none';
        if (editImagePreview) editImagePreview.style.display = 'block';
        if (editPreviewImg) editPreviewImg.src = imageUrl;
        
        // Stocker juste le nom du fichier
        currentImageData['edit'] = imageFileName;
    }

    updateCategoryFields('edit', product.donnees_fiche);
    autoFillFichePath('edit');
}

// Nouvelle fonction pour afficher l'image actuelle
function displayCurrentImage(prefix, imageFileName) {
    const currentImageDiv = document.getElementById(`${prefix}-current-image`);
    const currentImg = document.getElementById(`${prefix}-current-img`);
    const actionsDiv = document.getElementById(`${prefix}-image-actions`);
    
    if (imageFileName && imageFileName.trim() !== '') {
        // Afficher l'image actuelle
        currentImg.src = `/assets/images/${imageFileName}`;
        currentImg.title = "🔍 Cliquez pour voir en grand - Survolez pour agrandir";
        
        // Ajouter l'événement de clic pour afficher en modal
        currentImg.onclick = function() {
            showImageModal(`/assets/images/${imageFileName}`, imageFileName);
        };
        
        currentImg.onerror = function() {
            this.src = '/assets/images/placeholder.png';
            this.title = "Image non trouvée";
        };
        
        currentImageDiv.style.display = 'block';
        actionsDiv.style.display = 'block';
        
        // Modifier le texte de la zone d'upload
        const uploadZone = document.getElementById(`${prefix}-upload-zone`);
        const uploadText = uploadZone.querySelector('.upload-text');
        const uploadHint = uploadZone.querySelector('.upload-hint');
        
        uploadText.textContent = 'Remplacer par une nouvelle image';
        uploadHint.textContent = 'ou cliquez pour parcourir (JPG, PNG, WebP - Max 5MB)';
    } else {
        // Pas d'image actuelle
        currentImageDiv.style.display = 'none';
        actionsDiv.style.display = 'none';
        
        // Remettre le texte par défaut
        const uploadZone = document.getElementById(`${prefix}-upload-zone`);
        const uploadText = uploadZone.querySelector('.upload-text');
        const uploadHint = uploadZone.querySelector('.upload-hint');
        
        uploadText.textContent = 'Glissez votre image ici';
        uploadHint.textContent = 'ou cliquez pour parcourir (JPG, PNG, WebP - Max 5MB)';
    }
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
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Contenu de la boîte", placeholder: "Tablette, câble, chargeur..." }
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
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Contenu de la boîte", placeholder: "Casque, câbles, étui..." }
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
            { emoji: "�", label: "Autonomie", placeholder: "Batterie, recharge..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Contenu de la boîte", placeholder: "Accessoires inclus..." }
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
            { emoji: "🖥️", label: "Écran et affichage", placeholder: "Taille, résolution, tactile..." },
            { emoji: "🖊️", label: "Accessoires et interaction", placeholder: "Stylet, support mural, caméra..." },
            { emoji: "🌐", label: "Connectivité", placeholder: "Wi-Fi, HDMI, USB-C..." },
            { emoji: "🎮", label: "Expérience utilisateur", placeholder: "Logiciel, collaboration..." },
            { emoji: "🔋", label: "Autonomie et consommation", placeholder: "Alimentation, consommation..." },
            { emoji: "🛡️", label: "Garantie et support", placeholder: "Durée, SAV..." },
            { emoji: "📦", label: "Contenu de la boîte", placeholder: "Stylets, câbles, support..." }
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


// Remplacer l'ancien setupDragAndDrop
// REMPLACEZ setupDragAndDrop (ligne ~1147) :

function setupDragAndDrop() {
    setTimeout(() => {
        if (!window.dragDropInitialized) {
            modernUpload.new = new ModernImageUpload('new');
            modernUpload.edit = new ModernImageUpload('edit');
            window.dragDropInitialized = true;
        }
    }, 200);
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

// NOUVELLES FONCTIONS DE PRÉVISUALISATION

// Fonction de prévisualisation
function previewProduct(prefix) {
    const nom = document.getElementById(`${prefix}-nom`).value || 'Nom du produit';
    const prix = document.getElementById(`${prefix}-prix`).value || 'Prix non communiqué';
    const description = document.getElementById(`${prefix}-description`).value || 'Description non disponible';
    const topDuMois = document.getElementById(`${prefix}-top`).value === 'true';
    const fonctionnalitesText = document.getElementById(`${prefix}-fonctionnalites`).value;
    
    // Récupérer l'image
    let imageUrl = 'assets/images/placeholder.png';
    if (currentImageData[prefix]) {
        if (typeof currentImageData[prefix] === 'string' && currentImageData[prefix].startsWith('data:')) {
            // Base64 image from file upload
            imageUrl = currentImageData[prefix];
        } else if (typeof currentImageData[prefix] === 'string') {
            // Existing image path
            imageUrl = currentImageData[prefix].startsWith('assets/images/') 
                ? currentImageData[prefix] 
                : `assets/images/${currentImageData[prefix]}`;
        }
    }
    
    // Parser les fonctionnalités
    const fonctionnalites = fonctionnalitesText 
        ? fonctionnalitesText.split('\n').filter(f => f.trim()).slice(0, 3)
        : [];

    // Générer le HTML de prévisualisation
    const previewHTML = `
        ${topDuMois ? '<span class="top-badge">⭐ TOP</span>' : ''}
        <img src="${imageUrl}" alt="${nom}" onerror="this.src='assets/images/placeholder.png'">
        <h3 style="color: #667eea; margin: 15px 0;">${nom}</h3>
        <p style="color: #666; margin: 10px 0;">${description}</p>
        <p style="color: #667eea; font-weight: bold; font-size: 18px;">${prix}</p>
        ${fonctionnalites.length > 0 ? `
            <ul style="text-align: left; padding-left: 20px; margin: 15px 0;">
                ${fonctionnalites.map(f => `<li style="color: #333;">${f}</li>`).join('')}
            </ul>
        ` : ''}
    `;

    document.getElementById('fichePreview').innerHTML = previewHTML;
    document.getElementById('previewModal').style.display = 'block';
}

// Fermer la prévisualisation
function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

// Changer le format d'affichage (si vous avez des boutons device)
function changeDevice(device) {
    const preview = document.getElementById('fichePreview');
    const buttons = document.querySelectorAll('.device-btn');
    
    // Reset classes
    buttons.forEach(btn => btn.classList.remove('active'));
    preview.className = 'fiche-preview';
    
    // Appliquer la nouvelle classe
    if (event && event.target) {
        event.target.classList.add('active');
        preview.classList.add(`${device}-preview`);
    }
}

// Event listeners pour la modal
document.addEventListener('DOMContentLoaded', function() {
    // Fermer avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('previewModal');
            if (modal && modal.style.display === 'block') {
                closePreview();
            }
        }
    });

    // Fermer en cliquant à côté
    const previewModal = document.getElementById('previewModal');
    if (previewModal) {
        previewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closePreview();
            }
        });
    }
});

// NOUVELLES FONCTIONS DE PRÉVISUALISATION - À AJOUTER DANS LE JS
async function previewGeneratedFiche(prefix) {
    
    const nom = document.getElementById(`${prefix}-nom`).value;
    const lien = document.getElementById(`${prefix}-lien`).value;
    
    
    if (!nom) {
        showMessage('⚠️ Veuillez saisir un nom de produit', 'warning');
        return;
    }

    // Si on est en mode édition et qu'un produit est sélectionné
    if (prefix === 'edit' && currentEditingId) {
        return previewFicheFromId(currentEditingId);
    } 
    
    // Mode création : vérifier si un lien de fiche est spécifié
    if (lien && lien.trim()) {
        const fichePath = lien.startsWith('/') ? lien.substring(1) : lien;
        
        try {
            // Vérifier que le fichier existe
            const response = await fetch(`/${fichePath}`, { method: 'HEAD' });
            
            if (response.ok) {
                // Le fichier existe - l'ouvrir dans un nouvel onglet
                const ficheUrl = `${window.location.origin}/${fichePath}`;
                window.open(ficheUrl, '_blank');
                showMessage('📄 Fiche ouverte dans un nouvel onglet !', 'success');
            } else {
                showMessage(`❌ Fichier de fiche non trouvé : ${fichePath}`, 'danger');
            }
            
        } catch (error) {
            console.error('❌ Erreur ouverture fichier:', error);
            showMessage('❌ Erreur lors de l\'ouverture du fichier de fiche', 'danger');
        }
    } else {
        showMessage('⚠️ Aucun lien de fiche spécifié. Saisissez d\'abord un produit et générez sa fiche.', 'warning');
    }
}

async function previewFicheFromId(productId) {
    
    try {
        // 1. Récupérer les infos du produit pour connaître le chemin de sa fiche
        const productResponse = await fetch(`${API_URL}/produits/${productId}`);
        const productData = await productResponse.json();
        
        if (!productData.success) {
            showMessage(`❌ Erreur: ${productData.error}`, 'danger');
            return;
        }
        
        const product = productData.data;
        
        // 2. Construire le chemin vers la fiche générée
        let fichePath = product.lien;
        
        // Si pas de lien, construire le chemin automatiquement
        if (!fichePath) {
            const catSlug = product.categorie.toLowerCase().replace(/\s+/g, '-');
            const nomSlug = product.nom.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") 
                .replace(/[^a-zA-Z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .toLowerCase();
            fichePath = `fiches/${catSlug}/${nomSlug}.html`;
        }
        
        // Nettoyer le chemin
        if (fichePath.startsWith('/')) {
            fichePath = fichePath.substring(1);
        }
        
        
        // 3. Vérifier que la fiche existe
        try {
            const ficheResponse = await fetch(`/${fichePath}`, { method: 'HEAD' });
            
            if (ficheResponse.ok) {
                // ✅ La fiche existe - l'ouvrir dans un nouvel onglet
                const ficheUrl = `${window.location.origin}/${fichePath}`;
                
                window.open(ficheUrl, '_blank');
                showMessage('📄 Fiche ouverte dans un nouvel onglet !', 'success');
                
            } else {
                
                // Proposer de générer la fiche
                if (confirm(`❓ La fiche n'existe pas encore.\nVoulez-vous la générer maintenant ?`)) {
                    await generateAndOpenFiche(productId, fichePath);
                } else {
                    showMessage('⚠️ Fiche non trouvée sur le disque', 'warning');
                }
            }
            
        } catch (ficheError) {
            
            // Proposer de générer la fiche
            if (confirm(`❓ Impossible de vérifier si la fiche existe.\nVoulez-vous tenter de la générer ?`)) {
                await generateAndOpenFiche(productId, fichePath);
            } else {
                showMessage('❌ Erreur lors de la vérification de la fiche', 'danger');
            }
        }
        
    } catch (error) {
        console.error('❌ Erreur globale:', error);
        showMessage('❌ Erreur lors du chargement des informations du produit', 'danger');
    }
}

// Fonction pour générer une fiche et l'ouvrir
async function generateAndOpenFiche(productId, fichePath) {
    try {
        showMessage('⏳ Génération de la fiche en cours...', 'info');
        
        // Générer la fiche
        const response = await fetch(`${API_URL}/generate-fiche/${productId}`, {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Attendre un peu que le fichier soit écrit
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Ouvrir la fiche générée
            const ficheUrl = `${window.location.origin}/${fichePath}`;
            window.open(ficheUrl, '_blank');
            
            showMessage(`✅ Fiche générée et ouverte : ${data.path}`, 'success');
        } else {
            showMessage(`❌ Erreur de génération : ${data.error}`, 'danger');
        }
        
    } catch (error) {
        console.error('❌ Erreur génération:', error);
        showMessage('❌ Erreur lors de la génération de la fiche', 'danger');
    }
}

// AJOUTEZ cette fonction si elle n'existe pas :

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// AJOUTEZ cette fonction pour rétablir les event listeners :

// REMPLACEZ setupImageUpload pour forcer le nettoyage :

function setupImageUpload(prefix) {
    setTimeout(() => {
        const uploadZone = document.getElementById(`${prefix}-upload-zone`);
        const fileInput = document.getElementById(`${prefix}-image-file`);
        
        if (!uploadZone || !fileInput) {
            console.warn(`⚠️ Éléments upload manquants pour ${prefix}`);
            return;
        }

        // IMPORTANT : Ne pas utiliser outerHTML qui casse l'interaction
        // Au lieu de ça, supprimer les event listeners manuellement
        uploadZone.onclick = null;
        uploadZone.ondragover = null;
        uploadZone.ondragleave = null;
        uploadZone.ondrop = null;
        fileInput.onchange = null;

        // Variable de protection globale
        if (!window.clickProtection) window.clickProtection = {};
        
        // Event listener DIRECT sans preventDefault excessif
        uploadZone.addEventListener('click', function(e) {
            // Protection contre les doubles clics
            const now = Date.now();
            if (window.clickProtection[prefix] && (now - window.clickProtection[prefix]) < 1000) {
                return;
            }
            
            window.clickProtection[prefix] = now;
            
            // CORRECTION : Déclencher le clic DIRECTEMENT
            fileInput.click();
        }, { passive: true });

        // Event listener pour le changement de fichier
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && validateImageFile(file)) {
                showImagePreview(prefix, file);
            }
        });

        // Drag & Drop
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (validateImageFile(file)) {
                    // Assigner les fichiers à l'input
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileInput.files = dt.files;
                    
                    showImagePreview(prefix, file);
                }
            }
        });

        
    }, 100); // Réduire le délai
}

// Fonction de validation
function validateImageFile(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
        showMessage('❌ Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.', 'danger');
        return false;
    }
    
    if (file.size > maxSize) {
        showMessage(`❌ Taille de fichier trop grande. Max: ${formatFileSize(maxSize)}`, 'danger');
        return false;
    }
    
    return true;
}

// AJOUTEZ cette fonction après la fonction collectCategoryData (vers la ligne 700) :

function resetCreateForm() {
    document.getElementById('create-form').reset();
    document.getElementById('new-category-fields').innerHTML = '';
    delete currentImageData['new'];
    
    // Réinitialiser avec ModernImageUpload
    if (modernUpload.new) {
        modernUpload.new.removePreview();
    }
    
}

// AJOUTEZ ces fonctions après resetCreateForm :

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
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Aucun produit trouvé</td></tr>';
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
            imageUrl = 'data:image/svg+xml,...'; 
        }

        const imageHtml = imageUrl
            ? `<div class="product-image-container">
                 <img src="${imageUrl}" alt="${product.nom}" 
                      class="product-image" 
                      title="📷 Survolez pour agrandir - Cliquez pour voir en grand"
                      onclick="showImageModal('${imageUrl}', '${product.nom}')"
                      onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3E📦%3C/text%3E%3C/svg%3E'">
               </div>`
            : '<div style="width:60px;height:60px;background:#f0f0f0;border-radius:8px;display:flex;align-items:center;justify-content:center;">📦</div>';

        return `
            <tr>
                <td style="text-align: center; padding: 10px;">${imageHtml}</td>
                <td>${product.id}</td>
                <td><strong>${product.nom}</strong></td>
                <td>${product.categorie || '-'}</td>
                <td>${product.prix || '-'}</td>
                <td>${product.top_du_mois ? '⭐' : '-'}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-warning" onclick="editProduct('${product.id}')" title="Modifier">✏️</button>
                        <button class="btn btn-danger" onclick="confirmDelete('${product.id}')" title="Supprimer">🗑️</button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-info" onclick="previewFicheFromId('${product.id}')" title="Prévisualiser la fiche">
                        📄
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Fonction pour afficher l'image en modal
function showImageModal(imageUrl, productName) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    modal.innerHTML = `
        <div style="position: relative; max-width: 90vw; max-height: 90vh;">
            <img src="${imageUrl}" 
                 alt="${productName}" 
                 style="max-width: 90vw; max-height: 90vh; width: auto; height: auto; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); object-fit: contain; background: #fff;">
            <div style="position: absolute; top: -40px; left: 0; color: white; font-size: 18px; font-weight: bold;">
                📷 ${productName}
            </div>
            <div style="position: absolute; top: -40px; right: 0; color: white; font-size: 24px; cursor: pointer;" 
                 onclick="document.body.removeChild(this.closest('div[style*=fixed]'))">
                ❌
            </div>
            <div style="position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%); color: white; font-size: 14px; text-align: center;">
                Cliquez n'importe où pour fermer
            </div>
        </div>
    `;
    
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(modal);
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    document.body.appendChild(modal);
}

// Créer un nouveau produit
async function createProduct(event) {
    event.preventDefault();

    const nom = document.getElementById('new-nom').value;
    let titreAffiche = document.getElementById('new-titre-affiche').value.trim();

    if (!titreAffiche) {
        titreAffiche = formatTitreAffiche(nom);
        document.getElementById('new-titre-affiche').value = titreAffiche;
    }

    const productData = {
        nom: nom,
        titre_affiche: titreAffiche,
        categorie: document.getElementById('new-categorie').value,
        prix: document.getElementById('new-prix').value,
        description: document.getElementById('new-description').value,
        lien: document.getElementById('new-lien').value,
        top_du_mois: document.getElementById('new-top').value === 'true',
        fonctionnalites_avancees: document.getElementById('new-fonctionnalites').value.split('\n').filter(f => f.trim()),
        donnees_fiche: collectCategoryData('new'),
    };

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

// Classe ModernImageUpload
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

        // Protection anti-doublon
        if (!window.clickProtection) window.clickProtection = {};

        this.uploadZone.addEventListener('click', () => {
            const now = Date.now();
            if (window.clickProtection[this.prefix] && (now - window.clickProtection[this.prefix]) < 1000) {
                return;
            }
            window.clickProtection[this.prefix] = now;
            
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
        
        // IMPORTANT : Assigner le fichier à l'input pour la soumission
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        this.fileInput.files = dataTransfer.files;
    }

    createPreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Masquer la zone d'upload et afficher la prévisualisation
            this.uploadZone.style.display = 'none';
            
            this.previewContainer.innerHTML = `
                <div class="preview-card-modern" style="border: 2px solid #28a745; border-radius: 10px; background: #f8fff8; padding: 15px; text-align: center;">
                    <img src="${e.target.result}" alt="Aperçu" style="width:100%; max-width:250px; height:150px; object-fit:cover; border-radius:8px; margin-bottom:10px;">
                    <div style="font-weight:600; color:#28a745; margin-bottom:5px;">✅ ${file.name}</div>
                    <div style="color:#666; font-size:12px; margin-bottom:10px;">${this.formatFileSize(file.size)}</div>
                    <div class="upload-progress" style="display:none; background:#eee; border-radius:10px; overflow:hidden; margin:10px 0;">
                        <div class="progress-bar" id="progress-${this.prefix}" style="height:20px; background:#28a745; width:0%; transition:width 0.3s;"></div>
                    </div>
                    <div style="display:flex; gap:10px; justify-content:center; margin-top:15px;">
                        <button type="button" class="btn btn-primary" onclick="modernUpload.${this.prefix}.simulateUpload()" style="padding:8px 15px; background:#667eea; border:none; color:white; border-radius:5px; cursor:pointer;">
                            📤 Traiter
                        </button>
                        <button type="button" class="btn btn-danger" onclick="modernUpload.${this.prefix}.removePreview()" style="padding:8px 15px; background:#dc3545; border:none; color:white; border-radius:5px; cursor:pointer;">
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            `;
            
            this.previewContainer.style.display = 'block';

            // CORRECTION : Stocker le nom du fichier pour la soumission
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
        // Nettoyer la prévisualisation
        this.previewContainer.innerHTML = '';
        this.previewContainer.style.display = 'none';
        
        // Nettoyer l'input file
        this.fileInput.value = '';
        this.currentFile = null;

        // Nettoyer les données stockées
        delete currentImageData[this.prefix];

        // Réafficher la zone d'upload avec le contenu original
        this.uploadZone.innerHTML = `
            <div class="upload-icon">📁</div>
            <div class="upload-text">Glissez votre image ici</div>
            <div class="upload-hint">ou cliquez pour parcourir (JPG, PNG, WebP - Max 5MB)</div>
            <input type="file" id="${this.prefix}-image-file" accept="image/*" style="display: none;">
        `;
        this.uploadZone.style.display = 'block';
        
        // Reconfigurer les event listeners après la remise en place
        this.fileInput = document.getElementById(`${this.prefix}-image-file`);
        this.setupEventListeners();
        
        showMessage('🗑️ Image supprimée', 'info');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Fonction pour supprimer l'image (appelée depuis le HTML)
function removeImage(prefix) {
    if (modernUpload[prefix]) {
        modernUpload[prefix].removePreview();
    } else {
        // Fallback si l'uploader n'est pas initialisé
        const previewContainer = document.getElementById(`${prefix}-preview-container`);
        const uploadZone = document.getElementById(`${prefix}-upload-zone`);
        const fileInput = document.getElementById(`${prefix}-image-file`);
        const imageActions = document.getElementById(`${prefix}-image-actions`);
        
        if (previewContainer) previewContainer.innerHTML = '';
        if (uploadZone) uploadZone.style.display = 'block';
        if (fileInput) fileInput.value = '';
        if (imageActions) imageActions.style.display = 'none';
        
        delete currentImageData[prefix];
        showMessage('🗑️ Image supprimée', 'info');
    }
}

// Initialisation des uploaders modernes
const modernUpload = {};