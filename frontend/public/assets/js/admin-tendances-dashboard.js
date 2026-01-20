// admin-tendances-dashboard.js multi-onglets RÉPARÉ

// Colonnes spécifiques à chaque type
const columnsMap = {
  actualites: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'image', label: 'Image', render: t => {
      if (!t.image) return '';
      if (t.image.startsWith('http')) return '<span>🎥 Vidéo</span>';
      return `<img src="/assets/images/${t.image}" class="tendance-img" alt="">`;
    }},
    { key: 'titre', label: 'Titre', render: t => `<strong>${t.titre || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'date_publication', label: 'Date', render: t => t.date_publication ? t.date_publication.split('T')[0] : '' },
    { key: 'tags', label: 'Tags', render: t => Array.isArray(t.tags) ? t.tags.join(', ') : (t.tags || '') },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  technologies: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'nom', label: 'Nom', render: t => `<strong>${t.nom || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'taux_adoption', label: 'Taux adoption', render: t => t.taux_adoption ? t.taux_adoption + ' %' : '' },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  marche: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'titre', label: 'Titre', render: t => `<strong>${t.titre || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  insights: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'titre', label: 'Titre', render: t => `<strong>${t.titre || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  predictions: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'annee', label: 'Année', render: t => t.annee || '' },
    { key: 'titre', label: 'Titre', render: t => `<strong>${t.titre || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'probabilite', label: 'Probabilité', render: t => t.probabilite !== undefined && t.probabilite !== null && t.probabilite !== '' ? t.probabilite + ' %' : '' },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ]
};

// API endpoints CORRECTS
const apiMap = {
  actualites: 'actualites',
  technologies: 'technologies',
  marche: 'marche',
  insights: 'insights',
  predictions: 'predictions'
};

const categories = [
  'Box Internet', 'Camera', 'Casque Audio', 'Casque VR', 'Console',
  'Drone', 'Ecran TV', 'Imprimante 3D', 'Montre Connectée',
  'PC Gaming', 'Périphériques', 'Serveur', 'Smartphone',
  'Tableau Interactif', 'Tablette', 'Vidéo Projecteur'
];

let currentCategorie = localStorage.getItem('admin-tendances-categorie') || categories[0];

let state = {
  actualites: [],
  technologies: [],
  marche: [],
  insights: [],
  predictions: []
};

let currentType = 'actualites';

// Fonction utilitaire pour normaliser les noms de catégorie
function normalizeCategoryName(categoryName) {
  return categoryName.toLowerCase()
    .replace(/ /g, '-')
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/ê/g, 'e')
    .replace(/à/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ô/g, 'o')
    .replace(/û/g, 'u')
    .replace(/ç/g, 'c');
}

// Initialisation
function init() {
  const select = document.getElementById('categorie-select');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (cat === currentCategorie) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', (e) => {
    currentCategorie = e.target.value;
    localStorage.setItem('admin-tendances-categorie', currentCategorie);
    switchTab(currentType);
  });

  document.getElementById('btn-preview').addEventListener('click', previewTendancesPage);
  switchTab('actualites');
}

// Preview page
function previewTendancesPage() {
  const select = document.getElementById('categorie-select');
  if (!select) return;
  let cat = currentCategorie;
  
  // Normalisation du nom de fichier
  let file = 'tendances-' + normalizeCategoryName(cat) + '.html';
  window.open(file, '_blank');
}

// Switcher onglets
function switchTab(type) {
  currentType = type;
  const statsZone = document.getElementById('stats-zone');
  if (statsZone) {
    statsZone.innerHTML = `
      <div style="display: flex; gap: 15px; justify-content: center; align-items: center; background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px;">
        <strong>📊 Catégorie : ${currentCategorie}</strong>
        <span>•</span>
        <span>🗂️ Type : ${type.toUpperCase()}</span>
      </div>
    `;
  }
  
  // Marquer l'onglet actif
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.type === type);
  });
  
  loadTendances(type);
  renderHeader(type);
}

// Render header
function renderHeader(type) {
  const tr = document.getElementById('tendances-header');
  if (!tr) return;
  tr.innerHTML = columnsMap[type].map(col => `<th>${col.label}</th>`).join('');
}

// Render tendances
function renderTendances(type) {
  const tbody = document.getElementById('tendances-list');
  if (!tbody) return;
  
  const items = state[type] || [];
  tbody.innerHTML = '';
  
  items.forEach(item => {
    const tr = document.createElement('tr');
    columnsMap[type].forEach(col => {
      const td = document.createElement('td');
      if (col.render) {
        td.innerHTML = col.render(item, type);
      } else {
        td.textContent = item[col.key] || '';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  
  // Update counter
  const counter = document.getElementById('compteur');
  if (counter) {
    counter.textContent = `${items.length} éléments`;
  }
}

// Action buttons
function actionBtns(type, id) {
  return `
    <div style="display: flex; gap: 5px; justify-content: center;">
      <button class="btn btn-sm btn-warning" onclick="editTendance('${type}', '${id}')">✏️</button>
      <button class="btn btn-sm btn-danger" onclick="deleteTendance('${type}', '${id}')">🗑️</button>
    </div>
  `;
}

// Load tendances
async function loadTendances(type) {
  try {
    const endpoint = apiMap[type];
    const categorySlug = normalizeCategoryName(currentCategorie);
    
    const response = await fetch(`/api/${categorySlug}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }
    const data = await response.json();
    state[type] = data;
    renderTendances(type);
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    const tbody = document.getElementById('tendances-list');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:#dc3545;padding:20px;">⚠️ Erreur: ${error.message}</td></tr>`;
    }
  }
}

// Modal functions
function openModal() {
  document.getElementById('tendance-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('tendance-modal').style.display = 'none';
  document.getElementById('tendance-form').reset();
  document.getElementById('tendance-id').value = '';
  document.getElementById('form-extra').innerHTML = '';
}

// Add new
function addNew() {
  openModal();
  populateFormFields(currentType, {});
}

// Edit tendance
function editTendance(type, id) {
  const item = state[type].find(t => t.id == id);
  if (!item) return;
  
  document.getElementById('tendance-id').value = id;
  populateFormFields(type, item);
  openModal();
}

// Populate form
function populateFormFields(type, item) {
  const extraDiv = document.getElementById('form-extra');
  extraDiv.innerHTML = '';
  
  // Champs communs
  document.getElementById('tendance-titre').value = item.titre || '';
  document.getElementById('tendance-description').value = item.description || '';
  
  // Champs spécifiques
  if (type === 'actualites') {
    document.getElementById('tendance-image').value = item.image || '';
    document.getElementById('tendance-date').value = item.date_publication ? item.date_publication.split('T')[0] : '';
    document.getElementById('tendance-tags').value = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
    document.getElementById('tendance-hot').checked = item.hot || false;
  } else if (type === 'technologies') {
    extraDiv.innerHTML = `
      <div class="form-group">
        <label for="tendance-nom">Nom de la technologie</label>
        <input type="text" id="tendance-nom" value="${item.nom || ''}" />
      </div>
      <div class="form-group">
        <label for="tendance-icone">Icône</label>
        <input type="text" id="tendance-icone" value="${item.icone || ''}" />
      </div>
      <div class="form-group">
        <label for="tendance-taux">Taux d'adoption (%)</label>
        <input type="number" id="tendance-taux" value="${item.taux_adoption || ''}" />
      </div>
    `;
  } else if (type === 'predictions') {
    extraDiv.innerHTML = `
      <div class="form-group">
        <label for="tendance-annee">Année</label>
        <input type="number" id="tendance-annee" value="${item.annee || ''}" />
      </div>
      <div class="form-group">
        <label for="tendance-icone">Icône</label>
        <input type="text" id="tendance-icone" value="${item.icone || ''}" />
      </div>
      <div class="form-group">
        <label for="tendance-probabilite">Probabilité (%)</label>
        <input type="number" id="tendance-probabilite" value="${item.probabilite || ''}" />
      </div>
    `;
  } else {
    // marche, insights
    extraDiv.innerHTML = `
      <div class="form-group">
        <label for="tendance-icone">Icône</label>
        <input type="text" id="tendance-icone" value="${item.icone || ''}" />
      </div>
    `;
  }
}

// Save tendance
async function saveTendance() {
  const id = document.getElementById('tendance-id').value;
  const titre = document.getElementById('tendance-titre').value;
  const description = document.getElementById('tendance-description').value;
  
  if (!titre) {
    alert('Le titre est requis');
    return;
  }
  
  let payload = { titre, description };
  
  // Champs spécifiques par type
  if (currentType === 'actualites') {
    payload.image = document.getElementById('tendance-image').value;
    payload.date_publication = document.getElementById('tendance-date').value;
    payload.tags = document.getElementById('tendance-tags').value.split(',').map(t => t.trim()).filter(t => t);
    payload.hot = document.getElementById('tendance-hot').checked;
  } else if (currentType === 'technologies') {
    payload.nom = document.getElementById('tendance-nom').value;
    payload.icone = document.getElementById('tendance-icone').value;
    payload.taux_adoption = document.getElementById('tendance-taux').value;
  } else if (currentType === 'predictions') {
    payload.annee = document.getElementById('tendance-annee').value;
    payload.icone = document.getElementById('tendance-icone').value;
    payload.probabilite = document.getElementById('tendance-probabilite').value;
  } else {
    payload.icone = document.getElementById('tendance-icone').value;
  }
  
  try {
    const endpoint = apiMap[currentType];
    const method = id ? 'PUT' : 'POST';
    const categorySlug = normalizeCategoryName(currentCategorie);
    const url = id ? `/api/${categorySlug}/${endpoint}/${id}` : `/api/${categorySlug}/${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }
    
    closeModal();
    loadTendances(currentType);
    alert('Sauvegarde réussie');
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
    alert('Erreur: ' + error.message);
  }
}

// Delete tendance
async function deleteTendance(type, id) {
  if (!confirm('Supprimer cet élément ?')) return;
  
  try {
    const endpoint = apiMap[type];
    const categorySlug = normalizeCategoryName(currentCategorie);
    const response = await fetch(`/api/${categorySlug}/${endpoint}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }
    
    loadTendances(type);
    alert('Suppression réussie');
  } catch (error) {
    console.error('Erreur suppression:', error);
    alert('Erreur: ' + error.message);
  }
}

// Reorder
async function reorderItem(type, id, direction) {
  try {
    const endpoint = apiMap[type];
    const categorySlug = normalizeCategoryName(currentCategorie);
    const response = await fetch(`/api/${categorySlug}/${endpoint}/${id}/reorder`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }
    
    loadTendances(type);
  } catch (error) {
    console.error('Erreur réordonnancement:', error);
    alert('Erreur: ' + error.message);
  }
}

// Form submit
document.addEventListener('DOMContentLoaded', () => {
  init();

  // Gestion des onglets
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Retirer la classe active de tous les onglets
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      // Ajouter la classe active à l'onglet cliqué
      btn.classList.add('active');
      // Charger le type correspondant
      const type = btn.dataset.type;
      if (type) {
        switchTab(type);
      }
    });
  });

  // Bouton Ajouter
  const btnAdd = document.getElementById('btn-add');
  if (btnAdd) {
    btnAdd.addEventListener('click', addNew);
  }

  const form = document.getElementById('tendance-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveTendance();
    });
  }
});