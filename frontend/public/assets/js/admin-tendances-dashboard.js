// admin-tendances-dashboard.js multi-onglets

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
    { key: 'nom', label: 'Nom', render: t => `<strong>${t.nom || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'taux_adoption', label: 'Taux adoption', render: t => t.taux_adoption ? t.taux_adoption + ' %' : '' },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  marche: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'label', label: 'Titre', render: t => `<strong>${t.label || ''}</strong>` },
    { key: 'valeur', label: 'Valeur', render: t => t.valeur || '' },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'tendance', label: 'Tendance', render: t => t.tendance || '' },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  insights: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'titre', label: 'Titre', render: t => `<strong>${t.titre || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  predictions: [
    { key: 'ordre', label: 'Ordre', render: (t, type) => `<div style="display:flex;gap:4px;justify-content:center;align-items:center;">
        <span style="min-width:30px;text-align:center;">${t.ordre || ''}</span>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','up')" title="Monter">↑</button>
        <button class="btn btn-sm" onclick="reorderItem('${type}','${t.id}','down')" title="Descendre">↓</button>
      </div>` },
    { key: 'annee', label: 'Année', render: t => t.annee || '' },
    { key: 'titre', label: 'Titre', render: t => `<strong>${t.titre || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'icone', label: 'Icône', render: t => {
        if (!t.icone) return '';
        if (t.icone.endsWith('.png') || t.icone.endsWith('.jpg') || t.icone.endsWith('.jpeg') || t.icone.endsWith('.svg')) {
          return `<img src="/assets/icones/${t.icone}" alt="" style="max-width:32px;max-height:32px;">`;
        }
        return t.icone;
      }
    },
    { key: 'probabilite', label: 'Probabilité', render: t => t.probabilite !== undefined && t.probabilite !== null && t.probabilite !== '' ? t.probabilite + ' %' : '' },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ]
};

const apiMap = {
  actualites: 'tendances',
  technologies: 'technologies',
  marche: 'marche',
  insights: 'insights',
  predictions: 'predictions'
};
const categories = [
  "pc-gaming", "drone", "smartphone", "console", "tablette", "casque-audio", "montre-connectee",
  "serveur", "box-internet", "camera", "casque-vr", "ecran-tv", "imprimante-3d",
  "peripheriques", "tableau-interactif", "video-projecteur"
];

// Récupérer la catégorie sauvegardée ou utiliser pc-gaming par défaut
let currentCategorie = localStorage.getItem('admin-tendances-categorie') || categories[0];

let state = {
  actualites: { data: [], categorie: currentCategorie },
  technologies: { data: [], categorie: currentCategorie },
  marche: { data: [], categorie: currentCategorie },
  insights: { data: [], categorie: currentCategorie },
  predictions: { data: [], categorie: currentCategorie }
};
let currentType = 'actualites';

document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.type));
  });
  // Catégories
  const select = document.getElementById('categorie-select');
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    select.appendChild(opt);
  });
  select.value = currentCategorie;
  select.addEventListener('change', e => {
    currentCategorie = e.target.value;
    // Synchroniser toutes les catégories dans state
    Object.keys(state).forEach(type => {
      state[type].categorie = currentCategorie;
    });
    // Sauvegarder dans localStorage
    localStorage.setItem('admin-tendances-categorie', currentCategorie);
    loadTendances(currentType);
  });
  document.getElementById('btn-add').addEventListener('click', () => showAddModal(currentType));
  document.getElementById('btn-preview').addEventListener('click', previewTendancesPage);
  document.getElementById('tendance-form').onsubmit = submitTendance;
  // Initial load
  switchTab('actualites');
// Ouvre la page tendances correspondante à la catégorie sélectionnée
function previewTendancesPage() {
  const select = document.getElementById('categorie-select');
  if (!select) return;
  let cat = currentCategorie;
  if (!cat) return;
  // Format du nom de fichier : tendances-<categorie>.html
  // On remplace les espaces/accents/majuscules par des tirets et minuscules
  let file = 'tendances-' + cat.toLowerCase().replace(/ /g, '-').replace(/é/g, 'e').replace(/è/g, 'e').replace(/ê/g, 'e').replace(/à/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i').replace(/ô/g, 'o').replace(/û/g, 'u').replace(/ç/g, 'c') + '.html';
  window.open(file, '_blank');
}
});

function switchTab(type) {
  currentType = type;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.type === type));
  // stats
  document.getElementById('stats-zone').innerHTML = `
    <div class="stat-card"><div class="stat-value" id="total-${type}">${state[type].data.length}</div>
    <div class="stat-label">${columnsMap[type][0].label} ${type.charAt(0).toUpperCase() + type.slice(1)}</div></div>
    <div class="stat-card"><div class="stat-value">${categories.length}</div>
    <div class="stat-label">📂 Catégories</div></div>
  `;
  // select - synchroniser avec la catégorie globale
  state[type].categorie = currentCategorie;
  document.getElementById('categorie-select').value = currentCategorie;
  // header
  renderHeader(type);
  // table
  renderTendances(type);
  // charger
  loadTendances(type);
}

function renderHeader(type) {
  const tr = document.getElementById('tendances-header');
  tr.innerHTML = columnsMap[type].map(col => `<th>${col.label}</th>`).join('');
}

function renderTendances(type) {
  const tbody = document.getElementById('tendances-list');
  tbody.innerHTML = '';
  if (!state[type].data.length) {
    tbody.innerHTML = `<tr><td colspan="${columnsMap[type].length}" style="text-align:center;">Aucune donnée pour cette catégorie.</td></tr>`;
    return;
  }
  state[type].data.forEach(t => {
    const tr = document.createElement('tr');
    // Pour chaque colonne, on crée une cellule séparée
    columnsMap[type].forEach(col => {
      const td = document.createElement('td');
      td.innerHTML = col.render(t, type);
      // Centrage pour les images/icônes
      if (col.key === 'image' || col.key === 'icone') {
        td.style.textAlign = 'center';
      }
      // Actions à droite
      if (col.key === 'actions') {
        td.style.textAlign = 'right';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function actionBtns(type, id) {
  return `
    <div class="actions">
      <button class="btn btn-warning" title="Modifier" onclick="editTendance('${type}','${id}')">✏️</button>
      <button class="btn btn-danger" title="Supprimer" onclick="deleteTendance('${type}','${id}')">🗑️</button>
    </div>
  `;
}

function loadTendances(type) {
  fetch(`/api/${apiMap[type]}/${state[type].categorie}`)
    .then(r => r.json())
    .then(data => {
      state[type].data = Array.isArray(data) ? data : [];
      renderTendances(type);
      document.getElementById(`total-${type}`).textContent = state[type].data.length;
    })
    .catch(() => {
      state[type].data = [];
      renderTendances(type);
    });
}

function showAddModal(type) {

  document.getElementById('modal-title').textContent = 'Ajouter';
  document.getElementById('tendance-form').reset();
  document.getElementById('tendance-id').value = '';
  document.getElementById('tendance-type').value = type;
  document.getElementById('tendance-modal').style.display = 'block';

  // Masquer/afficher dynamiquement les champs selon le type
  // Champs du formulaire principal
  const champsPrincipaux = [
    'tendance-titre',
    'tendance-description',
    'tendance-image',
    'tendance-date',
    'tendance-tags'
  ];
  // Par défaut, tout afficher
  champsPrincipaux.forEach(id => {
    const group = document.getElementById(id)?.closest('.form-group');
    if (group) group.style.display = '';
  });

  let extra = '';
  if(type === 'technologies') {
    // Masquer les champs non pertinents
    ['tendance-titre','tendance-image','tendance-date','tendance-tags'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'none';
    });
    // Remplacer le champ titre par Nom
    extra = `
      <label for="tech-nom">Nom *</label>
      <input type="text" id="tech-nom" required />
      <label for="tech-description">Description *</label>
      <textarea id="tech-description" required></textarea>
      <label for="tech-icone">Icône</label>
      <input type="text" id="tech-icone" />
      <label for="tech-taux">Taux adoption (%)</label>
      <input type="number" id="tech-taux" min="0" max="100" />
    `;
  }
  if(type === 'marche') {
    // Masquer les champs non pertinents
    ['tendance-titre','tendance-description','tendance-image','tendance-date','tendance-tags'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'none';
    });
    extra = `
      <label for="marche-label">Titre *</label>
      <input type="text" id="marche-label" required />
      <label for="marche-valeur">Valeur</label>
      <input type="text" id="marche-valeur" />
      <label for="marche-tendance">Tendance</label>
      <input type="text" id="marche-tendance" />
      <label for="marche-icone">Icône</label>
      <input type="text" id="marche-icone" />
    `;
  }
  if(type === 'insights') {
    // Masquer les champs non pertinents (y compris titre et description)
    ['tendance-titre','tendance-description','tendance-image','tendance-date','tendance-tags'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'none';
    });
    extra = `
      <label for="insight-titre">Titre *</label>
      <input type="text" id="insight-titre" required />
      <label for="insight-description">Description *</label>
      <textarea id="insight-description" required></textarea>
      <label for="insight-icone">Icône</label>
      <input type="text" id="insight-icone" />
    `;
  }

  if(type === 'predictions') {
    // Masquer tous les champs principaux ET retirer required
    ['tendance-titre','tendance-description','tendance-image','tendance-date','tendance-tags'].forEach(id => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.removeAttribute('required');
        const group = elem.closest('.form-group');
        if (group) group.style.display = 'none';
      }
    });
    const hotElem = document.getElementById('tendance-hot');
    if (hotElem) {
      const group = hotElem.closest('.form-group');
      if (group) group.style.display = 'none';
    }
    
    extra = `
      <label for="pred-annee">Année *</label>
      <input type="number" id="pred-annee" required />
      <label for="pred-titre">Titre *</label>
      <input type="text" id="pred-titre" required />
      <label for="pred-description">Description</label>
      <input type="text" id="pred-description" />
      <label for="pred-icone">Icône</label>
      <input type="text" id="pred-icone" />
      <label for="pred-probabilite">Probabilité (%)</label>
      <input type="number" id="pred-probabilite" min="0" max="100" />
    `;
  }
  document.getElementById('form-extra').innerHTML = extra;
}

function closeModal() {
  document.getElementById('tendance-modal').style.display = 'none';
}

function editTendance(type, id) {
  const t = state[type].data.find(x => x.id == id);
  if (!t) return;
  document.getElementById('modal-title').textContent = 'Modifier';
  document.getElementById('tendance-id').value = t.id;
  document.getElementById('tendance-type').value = type;
  document.getElementById('tendance-titre').value = t.titre || '';
  document.getElementById('tendance-description').value = t.description || '';
  document.getElementById('tendance-image').value = t.image || '';
  document.getElementById('tendance-video').value = t.video_url || '';
  document.getElementById('tendance-date').value = t.date_publication ? t.date_publication.split('T')[0] : '';
  document.getElementById('tendance-tags').value = Array.isArray(t.tags) ? t.tags.join(',') : (t.tags || '');  document.getElementById('tendance-hot').checked = t.hot || false;
  // Champs dynamiques selon le type
  let extra = '';
  
  // Pour actualités, afficher tous les champs génériques
  if(type === 'actualites') {
    ['tendance-titre','tendance-description','tendance-date','tendance-tags'].forEach(id => {
      const elem = document.getElementById(id);
      if (elem) {
        elem.setAttribute('required', 'required');
        const group = elem.closest('.form-group');
        if (group) group.style.display = 'block';
      }
    });
    // Image n'est pas required (optionnel si vidéo fournie)
    const imgElem = document.getElementById('tendance-image');
    if (imgElem) {
      imgElem.removeAttribute('required');
      const group = imgElem.closest('.form-group');
      if (group) group.style.display = 'block';
    }
    const hotElem = document.getElementById('tendance-hot');
    if (hotElem) {
      const group = hotElem.closest('.form-group');
      if (group) group.style.display = 'block';
    }
    // Afficher le champ vidéo pour actualités
    const videoElem = document.getElementById('tendance-video');
    if (videoElem) {
      const group = videoElem.closest('.form-group');
      if (group) group.style.display = 'block';
    }
    extra = ''; // Pas de champs supplémentaires pour actualités
  }
  
  if(type === 'technologies') {
    ['tendance-titre','tendance-description','tendance-image','tendance-video','tendance-date','tendance-tags'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'none';
    });
    const hotGroup = document.getElementById('tendance-hot')?.closest('.form-group');
    if (hotGroup) hotGroup.style.display = 'none';
    
    extra = `
      <label for="tech-nom">Nom *</label>
      <input type="text" id="tech-nom" required value="${t.nom || ''}" placeholder="Ex: Ray Tracing, Cloud Gaming" />
      <label for="tech-description">Description</label>
      <textarea id="tech-description" style="width:100%;min-height:80px;">${t.description || ''}</textarea>
      <label for="tech-icone">Icône (nom texte)</label>
      <input type="text" id="tech-icone" value="${t.icone || ''}" placeholder="Ex: cpu, zap, chip, network" />
      <label for="tech-taux">Taux adoption (%)</label>
      <input type="number" id="tech-taux" min="0" max="100" value="${t.taux_adoption || ''}" />
    `;
  }
  if(type === 'marche') {
    ['tendance-titre','tendance-description','tendance-image','tendance-video','tendance-date','tendance-tags'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'none';
    });
    const hotGroup = document.getElementById('tendance-hot')?.closest('.form-group');
    if (hotGroup) hotGroup.style.display = 'none';
    
    extra = `
        <label for="marche-label">Titre *</label>
        <input type="text" id="marche-label" required value="${t.label || ''}" />
        <label for="marche-valeur">Valeur</label>
        <input type="text" id="marche-valeur" value="${t.valeur || ''}" />
        <label for="marche-tendance">Tendance *</label>
        <select id="marche-tendance" required>
          <option value="up" ${t.tendance === 'up' ? 'selected' : ''}>📈 Hausse</option>
          <option value="down" ${t.tendance === 'down' ? 'selected' : ''}>📉 Baisse</option>
          <option value="stable" ${t.tendance === 'stable' ? 'selected' : ''}>➡️ Stable</option>
        </select>
        <label for="marche-icone">Icône</label>
        <input type="text" id="marche-icone" value="${t.icone || ''}" />
      `;
  }
  if(type === 'insights') {
    ['tendance-image','tendance-video','tendance-date','tendance-tags'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'none';
    });
    const hotGroup = document.getElementById('tendance-hot')?.closest('.form-group');
    if (hotGroup) hotGroup.style.display = 'none';
    // Afficher titre et description pour insights
    ['tendance-titre','tendance-description'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'block';
    });
    
    extra = `
      <label for="insight-icone">Icône (emoji) *</label>
      <input type="text" id="insight-icone" required value="${t.icone || ''}" placeholder="Ex: 💡 🔥 ⚠️" />
    `;
  }
  if(type === 'predictions') {
    ['tendance-titre','tendance-description','tendance-image','tendance-video','tendance-date','tendance-tags'].forEach(id => {
      const group = document.getElementById(id)?.closest('.form-group');
      if (group) group.style.display = 'none';
    });
    extra = `
      <label for="pred-annee">Année *</label>
      <input type="number" id="pred-annee" required value="${t.annee || ''}" />
      <label for="pred-titre">Titre *</label>
      <input type="text" id="pred-titre" required value="${t.titre || ''}" />
      <label for="pred-description">Description</label>
      <input type="text" id="pred-description" value="${t.description || ''}" />
      <label for="pred-icone">Icône</label>
      <input type="text" id="pred-icone" value="${t.icone || ''}" />
      <label for="pred-probabilite">Probabilité (%)</label>
      <input type="number" id="pred-probabilite" min="0" max="100" value="${t.probabilite || ''}" />
    `;
  }
  document.getElementById('form-extra').innerHTML = extra;
  document.getElementById('tendance-modal').style.display = 'block';
}

function submitTendance(e) {
  e.preventDefault();
  const id = document.getElementById('tendance-id').value;
  const type = document.getElementById('tendance-type').value;
  let body = {
    titre: document.getElementById('tendance-titre').value,
    description: document.getElementById('tendance-description').value,
    image: document.getElementById('tendance-image').value,
    video_url: document.getElementById('tendance-video').value || null,
    date_publication: document.getElementById('tendance-date').value,
    tags: document.getElementById('tendance-tags').value.split(',').map(s => s.trim()).filter(Boolean),
    hot: document.getElementById('tendance-hot').checked,
    categorie: state[type].categorie
  };
  // Champs spécifiques au type technologies
  if(type === 'technologies') {
    body.nom = document.getElementById('tech-nom').value;
    body.description = document.getElementById('tech-description').value;
    body.icone = document.getElementById('tech-icone').value;
    body.taux_adoption = document.getElementById('tech-taux').value;
  }
  // Champs spécifiques au type marche
  if(type === 'marche') {
    body.label = document.getElementById('marche-label').value;
    body.valeur = document.getElementById('marche-valeur').value;
    body.tendance = document.getElementById('marche-tendance').value;
    body.icone = document.getElementById('marche-icone').value;
  }
  // Champs spécifiques au type insights
  if(type === 'insights') {
    body.icone = document.getElementById('insight-icone').value;
  }
  if(type === 'predictions') {
    body = {
      annee: document.getElementById('pred-annee').value === '' ? null : Number(document.getElementById('pred-annee').value),
      titre: document.getElementById('pred-titre').value,
      description: document.getElementById('pred-description').value,
      icone: document.getElementById('pred-icone').value,
      probabilite: document.getElementById('pred-probabilite').value === '' ? null : Number(document.getElementById('pred-probabilite').value),
      categorie: state[type].categorie
    };
  }
  const url = id 
    ? `/api/${apiMap[type]}/${id}` 
    : `/api/${apiMap[type]}`;
  const method = id ? 'PUT' : 'POST';
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
    .then(r => r.json())
    .then(() => {
      closeModal();
      loadTendances(type);
    });
}

// Fonction de réordonnancement
function reorderItem(type, id, direction) {
  const categorie = state[type].categorie;
  fetch(`/api/${categorie}/${type}/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id), direction })
  })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        loadTendances(type);
      }
    })
    .catch(err => console.error('Erreur réordonnancement:', err));
}

function deleteTendance(type, id) {
  if (!confirm('Supprimer ?')) return;
  fetch(`/api/${type}/${id}`, { method: 'DELETE' })
    .then(r => r.json())
    .then(() => {
      loadTendances(type);
    });
}

// Pour accès global depuis le HTML
window.editTendance = editTendance;
window.deleteTendance = deleteTendance;
window.reorderItem = reorderItem;

// Fermer la modale si clic en dehors
window.onclick = function(event) {
  const modal = document.getElementById('tendance-modal');
  if (event.target == modal) {
    closeModal();
  }
};