// Admin Tendances Advanced - JavaScript complet
const API_BASE = 'http://localhost:3000';
let categories = [];
let currentArticleId = null;
let allArticlesCache = []; // Cache pour le tri
let sortState = {
    column: null,
    direction: 'asc'
};

// ========== INITIALISATION ==========
document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadStats();
    await loadArticles();
    setupImageUploads();
    setupTabListeners();
});

// ========== CHARGEMENT DES CATÉGORIES ==========
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/api/categories`);
        categories = await response.json();
        
        // Remplir tous les selects de catégories
        const selects = [
            'new-categorie', 'edit-categorie', 
            'filter-category', 'bulk-category', 'bulk-hot-category'
        ];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;
            
            const hasAllOption = selectId.includes('filter') || selectId.includes('bulk');
            if (!hasAllOption) {
                select.innerHTML = '<option value="">-- Choisir --</option>';
            }
            
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.nom;
                select.appendChild(option);
            });
        });
    } catch (error) {
        console.error('Erreur chargement catégories:', error);
        showMessage('Erreur de chargement des catégories', 'error');
    }
}

// ========== STATISTIQUES ==========
async function loadStats() {
    try {
        // Total articles
        const articlesRes = await fetch(`${API_BASE}/api/tendances`);
        const articles = await articlesRes.json();
        
        document.getElementById('total-articles').textContent = articles.length;
        document.getElementById('total-categories').textContent = categories.length;
        
        const hotCount = articles.filter(a => a.hot).length;
        document.getElementById('hot-articles').textContent = hotCount;
        
        // Total sections
        const sectionsRes = await fetch(`${API_BASE}/api/fiche-tendance/sections/count`);
        const sectionsData = await sectionsRes.json();
        document.getElementById('total-sections').textContent = sectionsData.count || 0;
        
    } catch (error) {
        console.error('Erreur stats:', error);
    }
}

// ========== LISTE DES ARTICLES ==========
async function loadArticles() {
    try {
        const filterCat = document.getElementById('filter-category')?.value || '';
        const filterHot = document.getElementById('filter-hot')?.value || '';
        const search = document.getElementById('search-articles')?.value.toLowerCase() || '';
        
        let url = `${API_BASE}/api/tendances`;
        if (filterCat) {
            const category = categories.find(c => c.id == filterCat);
            url = `${API_BASE}/api/${category.nom.toLowerCase()}/actualites`;
        }
        
        const response = await fetch(url);
        let articles = await response.json();
        
        // Filtrer HOT
        if (filterHot) {
            articles = articles.filter(a => a.hot === (filterHot === 'true'));
        }
        
        // Recherche
        if (search) {
            articles = articles.filter(a => 
                a.titre?.toLowerCase().includes(search) ||
                a.description?.toLowerCase().includes(search)
            );
        }
        
        const tbody = document.getElementById('articles-list');
        tbody.innerHTML = '';
        
        if (articles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Aucun article trouvé</td></tr>';
            return;
        }
        
        // Charger les sections de chaque article
        for (const article of articles) {
            const sectionsRes = await fetch(`${API_BASE}/api/fiche-tendance/data/${article.id}`);
            const response = await sectionsRes.json();
            // L'API retourne { success: true, data: article } où article contient sections
            const articleData = response.data || response;
            article.sectionsCount = articleData.sections?.length || 0;
        }
        
        // Sauvegarder dans le cache
        allArticlesCache = articles;
        
        // Afficher
        displayArticles(articles);
        
        // Remplir les selects de modification et sections
        await populateArticleSelects(articles);
        
    } catch (error) {
        console.error('Erreur chargement articles:', error);
        showMessage('Erreur de chargement des articles', 'error');
    }
}

function displayArticles(articles) {
    const tbody = document.getElementById('articles-list');
    tbody.innerHTML = '';
    
    if (articles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">Aucun article trouvé</td></tr>';
        return;
    }
    
    articles.forEach(article => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                ${article.image 
                    ? `<img src="/assets/images/${article.image}" 
                            style="width: 80px; height: 60px; object-fit: cover; border-radius: 8px;">` 
                    : '<div style="width: 80px; height: 60px; background: #e0e0e0; border-radius: 8px; display: flex; align-items: center; justify-content: center;">📰</div>'}
            </td>
            <td><strong>${article.id}</strong></td>
            <td style="max-width: 300px;">
                <strong>${article.titre}</strong>
                ${article.video_url ? '<br><small style="color: #e74c3c;">🎥 Avec vidéo</small>' : ''}
            </td>
            <td><span class="badge">${article.categorie}</span></td>
            <td>${article.date_publication ? new Date(article.date_publication).toLocaleDateString('fr-FR') : '-'}</td>
            <td>${article.hot ? '🔥' : '-'}</td>
            <td>
                <span class="badge" style="background: ${article.sectionsCount >= 4 ? '#27ae60' : '#e74c3c'};">
                    ${article.sectionsCount} sections
                </span>
            </td>
            <td>
                <button class="btn btn-info" onclick="editArticle(${article.id})" style="padding: 5px 10px; font-size: 12px;">
                    ✏️ Modifier
                </button>
                <button class="btn btn-success" onclick="generateFiche(${article.id})" style="padding: 5px 10px; font-size: 12px;">
                    🚀 Générer
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== TRI DES COLONNES ==========
function sortTable(column) {
    // Toggle direction si même colonne
    if (sortState.column === column) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState.column = column;
        sortState.direction = 'asc';
    }
    
    // Réinitialiser tous les indicateurs
    ['id', 'titre', 'categorie', 'date', 'hot', 'sections'].forEach(col => {
        const indicator = document.getElementById(`sort-${col}`);
        if (indicator) indicator.textContent = '↕️';
    });
    
    // Mettre à jour l'indicateur de la colonne active
    const indicator = document.getElementById(`sort-${column}`);
    if (indicator) {
        indicator.textContent = sortState.direction === 'asc' ? '▲' : '▼';
    }
    
    // Trier les articles
    const sorted = [...allArticlesCache].sort((a, b) => {
        let valA, valB;
        
        switch(column) {
            case 'id':
                valA = a.id;
                valB = b.id;
                break;
            case 'titre':
                valA = a.titre?.toLowerCase() || '';
                valB = b.titre?.toLowerCase() || '';
                break;
            case 'categorie':
                valA = a.categorie?.toLowerCase() || '';
                valB = b.categorie?.toLowerCase() || '';
                break;
            case 'date':
                valA = a.date_publication ? new Date(a.date_publication).getTime() : 0;
                valB = b.date_publication ? new Date(b.date_publication).getTime() : 0;
                break;
            case 'hot':
                valA = a.hot ? 1 : 0;
                valB = b.hot ? 1 : 0;
                break;
            case 'sections':
                valA = a.sectionsCount || 0;
                valB = b.sectionsCount || 0;
                break;
            default:
                return 0;
        }
        
        if (valA < valB) return sortState.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortState.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    displayArticles(sorted);
}

// ========== LISTE DES ARTICLES (suite) ==========

async function populateArticleSelects(articles) {
    const editSelect = document.getElementById('edit-article-select');
    const sectionsSelect = document.getElementById('sections-article-select');
    
    [editSelect, sectionsSelect].forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">-- Choisir un article --</option>';
        articles.forEach(article => {
            // S'assurer que l'ID existe et est valide
            const articleId = article.id || article.actualite_id;
            if (!articleId) {
                console.warn('⚠️ Article sans ID:', article);
                return;
            }
            
            const option = document.createElement('option');
            option.value = articleId;
            option.textContent = `${article.titre} (${article.categorie || 'Sans catégorie'})`;
            option.dataset.articleId = articleId;
            select.appendChild(option);
        });
    });
}

// ========== CRÉER UN ARTICLE ==========
async function createArticle(event) {
    event.preventDefault();
    
    try {
        const categorieId = document.getElementById('new-categorie').value;
        const categorie = categories.find(c => c.id == categorieId);
        
        const formData = new FormData();
        formData.append('titre', document.getElementById('new-titre').value);
        formData.append('description', document.getElementById('new-description').value);
        formData.append('categorie_id', categorieId);
        formData.append('date_publication', document.getElementById('new-date').value || null);
        formData.append('hot', document.getElementById('new-hot').checked);
        formData.append('video_url', document.getElementById('new-video').value || null);
        formData.append('tags', document.getElementById('new-tags').value || '');
        
        // Image
        const imageFile = document.getElementById('new-image-file').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await fetch(`${API_BASE}/api/${categorie.nom.toLowerCase()}/actualites`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            showMessage('✅ Article créé avec succès !', 'success');
            resetCreateForm();
            await loadArticles();
            await loadStats();
            showTab('list');
        } else {
            throw new Error('Erreur création article');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('❌ Erreur lors de la création', 'error');
    }
}

async function createArticleAndGenerate() {
    const form = document.getElementById('create-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Créer l'article d'abord
    await createArticle(new Event('submit'));
    
    // Attendre un peu et générer la fiche du dernier article créé
    setTimeout(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/tendances`);
            const articles = await response.json();
            const lastArticle = articles[articles.length - 1];
            
            if (lastArticle) {
                await generateFiche(lastArticle.id);
            }
        } catch (error) {
            console.error('Erreur génération:', error);
        }
    }, 1000);
}

// ========== MODIFIER UN ARTICLE ==========
async function loadArticleForEdit() {
    const articleId = document.getElementById('edit-article-select').value;
    if (!articleId) {
        document.getElementById('edit-form-container').style.display = 'none';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/tendances/${articleId}`);
        const article = await response.json();
        
        currentArticleId = articleId;
        
        document.getElementById('edit-titre').value = article.titre || '';
        document.getElementById('edit-description').value = article.description || '';
        document.getElementById('edit-categorie').value = article.categorie_id || '';
        document.getElementById('edit-date').value = article.date_publication ? article.date_publication.split('T')[0] : '';
        document.getElementById('edit-hot').checked = article.hot || false;
        document.getElementById('edit-video').value = article.video_url || '';
        document.getElementById('edit-tags').value = article.tags || '';
        document.getElementById('edit-lien').value = article.lien || '';
        
        // Afficher l'image actuelle
        if (article.image) {
            document.getElementById('edit-current-image').style.display = 'block';
            document.getElementById('edit-current-img').src = `/assets/images/${article.image}`;
        } else {
            document.getElementById('edit-current-image').style.display = 'none';
        }
        
        document.getElementById('edit-form-container').style.display = 'block';
        
    } catch (error) {
        console.error('Erreur chargement article:', error);
        showMessage('Erreur de chargement', 'error');
    }
}

async function updateArticle(event) {
    event.preventDefault();
    
    if (!currentArticleId) return;
    
    try {
        const categorieId = document.getElementById('edit-categorie').value;
        const categorie = categories.find(c => c.id == categorieId);
        
        const formData = new FormData();
        formData.append('titre', document.getElementById('edit-titre').value);
        formData.append('description', document.getElementById('edit-description').value);
        formData.append('categorie_id', categorieId);
        formData.append('date_publication', document.getElementById('edit-date').value || null);
        formData.append('hot', document.getElementById('edit-hot').checked);
        formData.append('video_url', document.getElementById('edit-video').value || null);
        formData.append('tags', document.getElementById('edit-tags').value || '');
        
        // Nouvelle image ?
        const imageFile = document.getElementById('edit-image-file').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await fetch(`${API_BASE}/api/${categorie.nom.toLowerCase()}/actualites/${currentArticleId}`, {
            method: 'PUT',
            body: formData
        });
        
        if (response.ok) {
            showMessage('✅ Article mis à jour !', 'success');
            await loadArticles();
            await loadStats();
        } else {
            throw new Error('Erreur mise à jour');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('❌ Erreur lors de la mise à jour', 'error');
    }
}

async function updateArticleAndGenerate() {
    await updateArticle(new Event('submit'));
    setTimeout(() => generateFiche(currentArticleId), 500);
}

async function deleteArticle() {
    if (!currentArticleId) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;
    
    try {
        const categorieId = document.getElementById('edit-categorie').value;
        const categorie = categories.find(c => c.id == categorieId);
        
        const response = await fetch(`${API_BASE}/api/${categorie.nom.toLowerCase()}/actualites/${currentArticleId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('✅ Article supprimé', 'success');
            document.getElementById('edit-form-container').style.display = 'none';
            currentArticleId = null;
            await loadArticles();
            await loadStats();
        }
    } catch (error) {
        console.error('Erreur suppression:', error);
        showMessage('❌ Erreur lors de la suppression', 'error');
    }
}

// ========== GESTION DES SECTIONS ==========
async function loadArticleSections() {
    const articleId = document.getElementById('sections-article-select').value;
    if (!articleId) {
        document.getElementById('sections-container').style.display = 'none';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/fiche-tendance/data/${articleId}`);
        const result = await response.json();
        const data = result.data || result;
        
        document.getElementById('sections-article-title').textContent = data.titre;
        document.getElementById('sections-container').style.display = 'block';
        
        const container = document.getElementById('sections-list');
        container.innerHTML = '';
        
        if (!data.sections || data.sections.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999;">Aucune section. Cliquez sur "Ajouter une Section".</p>';
            return;
        }
        
        data.sections.forEach(section => {
            const div = document.createElement('div');
            div.className = 'section-item';
            div.style.cssText = 'background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #667eea;';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 10px 0; color: #667eea;">${section.ordre}. ${section.titre}</h4>
                        <p style="color: #666; white-space: pre-wrap; margin: 0;">${section.contenu.substring(0, 200)}${section.contenu.length > 200 ? '...' : ''}</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-info" onclick='editSection(${JSON.stringify(section).replace(/'/g, "&apos;")})' style="padding: 8px 12px; font-size: 14px;">
                            ✏️ Modifier
                        </button>
                        <button class="btn btn-danger" onclick="deleteSection(${section.id}, ${articleId})" style="padding: 8px 12px; font-size: 14px;">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
        
    } catch (error) {
        console.error('Erreur chargement sections:', error);
        showMessage('Erreur de chargement des sections', 'error');
    }
}

function addNewSection() {
    const articleId = document.getElementById('sections-article-select').value;
    
    if (!articleId) {
        showMessage('❌ Veuillez d\'abord sélectionner un article dans le dropdown', 'error');
        console.warn('⚠️ Pas d\'article sélectionné');
        return;
    }
    
    if (isNaN(parseInt(articleId))) {
        showMessage('❌ ID article invalide. Sélectionnez un article valide', 'error');
        console.error('❌ Invalid articleId value:', { 
            value: articleId, 
            type: typeof articleId,
            parsed: parseInt(articleId)
        });
        return;
    }
    
    console.log('✅ Article sélectionné:', { articleId, parsed: parseInt(articleId) });
    
    document.getElementById('section-modal-title').textContent = 'Ajouter une Section';
    document.getElementById('section-id').value = '';
    document.getElementById('section-article-id').value = articleId;
    document.getElementById('section-titre').value = '';
    document.getElementById('section-contenu').value = '';
    document.getElementById('section-ordre').value = '1';
    
    document.getElementById('section-modal').style.display = 'flex';
}

function editSection(section) {
    // Validation de l'objet section
    if (!section || !section.id) {
        showMessage('❌ Erreur: Section invalide', 'error');
        console.error('❌ Invalid section:', section);
        return;
    }
    
    if (!section.actualite_id) {
        showMessage('❌ Erreur: ID article manquant dans la section', 'error');
        console.error('❌ Section missing actualite_id:', section);
        return;
    }
    
    console.log('✅ Modification section:', {
        sectionId: section.id,
        articleId: section.actualite_id,
        titre: section.titre
    });
    
    document.getElementById('section-modal-title').textContent = 'Modifier Section';
    document.getElementById('section-id').value = section.id;
    document.getElementById('section-article-id').value = section.actualite_id;
    document.getElementById('section-titre').value = section.titre;
    document.getElementById('section-contenu').value = section.contenu;
    document.getElementById('section-ordre').value = section.ordre;
    
    document.getElementById('section-modal').style.display = 'flex';
}

async function saveSection(event) {
    event.preventDefault();
    
    const sectionId = (document.getElementById('section-id').value || '').trim();
    const articleId = (document.getElementById('section-article-id').value || '').trim();
    
    // Validation stricte
    if (!articleId || isNaN(parseInt(articleId))) {
        showMessage('❌ Erreur: ID article invalide ou manquant', 'error');
        console.error('❌ Invalid articleId:', articleId);
        return;
    }
    
    const titre = document.getElementById('section-titre').value.trim();
    const contenu = document.getElementById('section-contenu').value.trim();
    const ordre = document.getElementById('section-ordre').value;
    
    // Valider les données obligatoires
    if (!titre || !contenu || !ordre) {
        showMessage('❌ Le titre, le contenu et l\'ordre sont obligatoires', 'error');
        return;
    }
    
    const data = {
        actualite_id: parseInt(articleId),
        titre: titre,
        contenu: contenu,
        ordre: parseInt(ordre)
    };
    
    // Double vérification que les conversions sont correctes
    if (isNaN(data.actualite_id) || isNaN(data.ordre)) {
        showMessage('❌ Erreur: Les valeurs numériques sont invalides', 'error');
        console.error('❌ NaN detected:', { articleId: data.actualite_id, ordre: data.ordre });
        return;
    }
    
    try {
        // Déterminer si c'est un POST (création) ou PUT (modification)
        const isUpdate = sectionId && !isNaN(parseInt(sectionId));
        
        const url = isUpdate 
            ? `${API_BASE}/api/fiche-tendance/sections/${sectionId}`
            : `${API_BASE}/api/fiche-tendance/sections`;
        
        const method = isUpdate ? 'PUT' : 'POST';
        
        console.log(`📝 ${isUpdate ? 'UPDATE' : 'CREATE'} section:`, {
            url: url,
            method: method,
            payload: data
        });
        
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('✅ Section enregistrée !', 'success');
            closeSectionModal();
            await loadArticleSections();
            await loadStats();
        } else {
            const errText = await response.text();
            console.error(`❌ HTTP ${response.status}:`, errText);
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }
    } catch (error) {
        console.error('❌ Erreur sauvegarde section:', error);
        showMessage(`❌ Erreur: ${error.message}`, 'error');
    }
}

async function deleteSection(sectionId, articleId) {
    if (!confirm('Supprimer cette section ?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/fiche-tendance/sections/${sectionId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showMessage('✅ Section supprimée', 'success');
            await loadArticleSections();
            await loadStats();
        }
    } catch (error) {
        console.error('Erreur suppression section:', error);
        showMessage('❌ Erreur lors de la suppression', 'error');
    }
}

function closeSectionModal() {
    document.getElementById('section-modal').style.display = 'none';
}

// ========== GÉNÉRATION DE FICHES ==========
async function generateFiche(articleId) {
    try {
        showMessage('⏳ Génération en cours...', 'info');
        
        const response = await fetch(`${API_BASE}/api/fiche-tendance/generate-fiche-tendance/${articleId}`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(`✅ Fiche générée : ${result.path}`, 'success');
            await loadArticles();
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Erreur génération:', error);
        showMessage('❌ Erreur lors de la génération', 'error');
    }
}

async function regenerateAllFiches() {
    if (!confirm('Régénérer toutes les 77 fiches ? Cela peut prendre 1-2 minutes.')) return;
    
    try {
        showMessage('⏳ Régénération de toutes les fiches en cours...', 'info');
        
        const response = await fetch(`${API_BASE}/api/fiche-tendance/regenerate-all-tendances`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(`✅ ${result.successCount} fiches régénérées !`, 'success');
        } else {
            throw new Error('Erreur régénération');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('❌ Erreur lors de la régénération', 'error');
    }
}

async function regenerateCategoryFiches() {
    const categoryId = document.getElementById('bulk-category').value;
    if (!categoryId) {
        alert('Veuillez sélectionner une catégorie');
        return;
    }
    
    const category = categories.find(c => c.id == categoryId);
    if (!confirm(`Régénérer toutes les fiches de la catégorie "${category.nom}" ?`)) return;
    
    try {
        showMessage('⏳ Régénération en cours...', 'info');
        
        // Récupérer les articles de la catégorie
        const articlesRes = await fetch(`${API_BASE}/api/${category.nom.toLowerCase()}/actualites`);
        const articles = await articlesRes.json();
        
        let successCount = 0;
        for (const article of articles) {
            try {
                await fetch(`${API_BASE}/api/fiche-tendance/generate-fiche-tendance/${article.id}`, {
                    method: 'POST'
                });
                successCount++;
            } catch (e) {
                console.error(`Erreur article ${article.id}:`, e);
            }
        }
        
        showMessage(`✅ ${successCount}/${articles.length} fiches régénérées pour "${category.nom}"`, 'success');
        
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('❌ Erreur lors de la régénération', 'error');
    }
}

async function markCategoryAsHot(isHot) {
    const categoryId = document.getElementById('bulk-hot-category').value;
    if (!categoryId) {
        alert('Veuillez sélectionner une catégorie');
        return;
    }
    
    const category = categories.find(c => c.id == categoryId);
    const action = isHot ? 'marquer HOT' : 'retirer HOT de';
    if (!confirm(`${action} tous les articles de "${category.nom}" ?`)) return;
    
    try {
        const articlesRes = await fetch(`${API_BASE}/api/${category.nom.toLowerCase()}/actualites`);
        const articles = await articlesRes.json();
        
        for (const article of articles) {
            const formData = new FormData();
            formData.append('titre', article.titre);
            formData.append('description', article.description);
            formData.append('categorie_id', article.categorie_id);
            formData.append('hot', isHot);
            
            await fetch(`${API_BASE}/api/${category.nom.toLowerCase()}/actualites/${article.id}`, {
                method: 'PUT',
                body: formData
            });
        }
        
        showMessage(`✅ ${articles.length} articles mis à jour`, 'success');
        await loadArticles();
        await loadStats();
        
    } catch (error) {
        console.error('Erreur:', error);
        showMessage('❌ Erreur lors de la mise à jour', 'error');
    }
}

async function showCategoryStats() {
    try {
        const statsBody = document.getElementById('stats-body');
        statsBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Chargement...</td></tr>';
        document.getElementById('stats-display').style.display = 'block';
        
        const stats = [];
        
        for (const category of categories) {
            const articlesRes = await fetch(`${API_BASE}/api/${category.nom.toLowerCase()}/actualites`);
            const articles = await articlesRes.json();
            
            let hotCount = 0;
            let totalSections = 0;
            let withImage = 0;
            let withVideo = 0;
            
            for (const article of articles) {
                if (article.hot) hotCount++;
                if (article.image) withImage++;
                if (article.video_url) withVideo++;
                
                const sectionsRes = await fetch(`${API_BASE}/api/fiche-tendance/data/${article.id}`);
                const result = await sectionsRes.json();
                const data = result.data || result;
                totalSections += data.sections?.length || 0;
            }
            
            const avgSections = articles.length > 0 ? (totalSections / articles.length).toFixed(1) : 0;
            
            stats.push({
                categorie: category.nom,
                count: articles.length,
                hot: hotCount,
                avgSections,
                withImage,
                withVideo
            });
        }
        
        statsBody.innerHTML = '';
        stats.forEach(stat => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${stat.categorie}</strong></td>
                <td>${stat.count}</td>
                <td>${stat.hot} 🔥</td>
                <td>${stat.avgSections}</td>
                <td>${stat.withImage} 📷</td>
                <td>${stat.withVideo} 🎥</td>
            `;
            statsBody.appendChild(tr);
        });
        
    } catch (error) {
        console.error('Erreur stats:', error);
        showMessage('❌ Erreur chargement des statistiques', 'error');
    }
}

// ========== PREVIEW ==========
async function previewArticleFiche() {
    if (!currentArticleId) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/fiche-tendance/preview/${currentArticleId}`);
        const html = await response.text();
        
        document.getElementById('preview-container').innerHTML = html;
        document.getElementById('preview-modal').style.display = 'flex';
    } catch (error) {
        console.error('Erreur preview:', error);
        showMessage('❌ Erreur de prévisualisation', 'error');
    }
}

function openArticleFiche() {
    const lien = document.getElementById('edit-lien').value;
    if (lien) {
        window.open('/' + lien, '_blank');
    }
}

function closePreviewModal() {
    document.getElementById('preview-modal').style.display = 'none';
}

// ========== UPLOAD D'IMAGES ==========
function setupImageUploads() {
    ['new', 'edit'].forEach(prefix => {
        const zone = document.getElementById(`${prefix}-upload-zone`);
        const input = document.getElementById(`${prefix}-image-file`);
        const preview = document.getElementById(`${prefix}-preview-container`);
        
        if (!zone || !input) return;
        
        zone.addEventListener('click', () => input.click());
        
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#667eea';
            zone.style.background = '#f0f4ff';
        });
        
        zone.addEventListener('dragleave', () => {
            zone.style.borderColor = '#ddd';
            zone.style.background = '#fafafa';
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.borderColor = '#ddd';
            zone.style.background = '#fafafa';
            
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                handleImagePreview(prefix);
            }
        });
        
        input.addEventListener('change', () => handleImagePreview(prefix));
    });
}

function handleImagePreview(prefix) {
    const input = document.getElementById(`${prefix}-image-file`);
    const preview = document.getElementById(`${prefix}-preview-container`);
    
    if (!input.files[0]) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
        preview.innerHTML = `
            <div style="margin-top: 15px; text-align: center; background: #f0f4ff; padding: 20px; border-radius: 12px;">
                <p style="color: #667eea; margin-bottom: 10px; font-weight: 600;">✅ Image sélectionnée</p>
                <img src="${e.target.result}" style="max-width: 300px; height: 200px; object-fit: cover; border-radius: 12px; border: 3px solid #667eea;">
                <p style="margin-top: 10px; color: #666; font-size: 14px;">${file.name}</p>
            </div>
        `;
    };
    
    reader.readAsDataURL(file);
}

// ========== UTILITAIRES ==========
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event?.target.classList.add('active');
}

function setupTabListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showTab(tabName);
        });
    });
}

function editArticle(articleId) {
    document.getElementById('edit-article-select').value = articleId;
    loadArticleForEdit();
    showTab('modify');
}

function resetCreateForm() {
    document.getElementById('create-form').reset();
    document.getElementById('new-preview-container').innerHTML = '';
}

function showMessage(message, type) {
    const container = document.getElementById('message-container');
    const div = document.createElement('div');
    div.className = `message message-${type}`;
    div.textContent = message;
    div.style.cssText = `
        padding: 15px 20px;
        margin-bottom: 20px;
        border-radius: 8px;
        font-weight: 500;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
    `;
    
    container.innerHTML = '';
    container.appendChild(div);
    
    setTimeout(() => div.remove(), 5000);
}

function goToSections() {
    // Passer à l'onglet sections et sélectionner l'article actuel
    document.getElementById('sections-article-select').value = currentArticleId;
    showTab('sections');
    loadArticleSections();
}
