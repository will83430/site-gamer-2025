// admin-tendances-dashboard.js multi-onglets

// Colonnes spécifiques à chaque type
const columnsMap = {
  actualites: [
    { key: 'image', label: 'Image', render: t => t.image ? `<img src="/assets/images/${t.image}" class="tendance-img" alt="">` : '' },
    { key: 'titre', label: 'Titre', render: t => `<strong>${t.titre || ''}</strong>` },
    { key: 'description', label: 'Description', render: t => t.description || '' },
    { key: 'date_publication', label: 'Date', render: t => t.date_publication ? t.date_publication.split('T')[0] : '' },
    { key: 'tags', label: 'Tags', render: t => Array.isArray(t.tags) ? t.tags.join(', ') : (t.tags || '') },
    { key: 'actions', label: 'Actions', render: (t, type) => actionBtns(type, t.id) }
  ],
  technologies: [
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
    { key: 'label', label: 'Titre', render: t => `<strong>${t.label || ''}</strong>` },
    { key: 'valeur', label: 'Valeur', render: t => t.valeur || '' },
    { key: 'tendance', label: 'Tendance', render: t => t.tendance || '' },
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
  insights: [
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
let state = {
  actualites: { data: [], categorie: categories[0] },
  technologies: { data: [], categorie: categories[0] },
  marche: { data: [], categorie: categories[0] },
  insights: { data: [], categorie: categories[0] },
  predictions: { data: [], categorie: categories[0] }
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
  select.value = state[currentType].categorie;
  select.addEventListener('change', e => {
    state[currentType].categorie = e.target.value;
    loadTendances(currentType);
  });
  document.getElementById('btn-add').addEventListener('click', () => showAddModal(currentType));
  document.getElementById('tendance-form').onsubmit = submitTendance;
  // Initial load
  switchTab('actualites');
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
  // select
  document.getElementById('categorie-select').value = state[type].categorie;
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
  let extra = '';
  if(type === 'actualites' || type === 'technologies') {
    extra = `
      <label for="tech-nom">Nom *</label>
      <input type="text" id="tech-nom" required />
      <label for="tech-icone">Icône</label>
      <input type="text" id="tech-icone" />
      <label for="tech-taux">Taux adoption (%)</label>
      <input type="number" id="tech-taux" min="0" max="100" />
    `;
  }
  if(type === 'insights') {
    extra = `
      <label for="insight-titre">Titre *</label>
      <input type="text" id="insight-titre" required />
      <label for="insight-icone">Icône</label>
      <input type="text" id="insight-icone" />
    `;
  }
    if(type === 'marche') {
      extra = `
        <label for="marche-label">Titre *</label>
        <input type="text" id="marche-label" required />
        <label for="marche-valeur">Valeur</label>
        <input type="text" id="marche-valeur" />
        <label for="marche-icone">Icône</label>
        <input type="text" id="marche-icone" />
      `;
    }
  if(type === 'predictions') {
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
  document.getElementById('tendance-date').value = t.date_publication ? t.date_publication.split('T')[0] : '';
  document.getElementById('tendance-tags').value = Array.isArray(t.tags) ? t.tags.join(',') : (t.tags || '');

  // Champs dynamiques selon le type
  let extra = '';
  if(type === 'technologies') {
    extra = `
      <label for="tech-nom">Nom *</label>
      <input type="text" id="tech-nom" required value="${t.nom || ''}" />
      <label for="tech-icone">Icône</label>
      <input type="text" id="tech-icone" value="${t.icone || ''}" />
      <label for="tech-taux">Taux adoption (%)</label>
      <input type="number" id="tech-taux" min="0" max="100" value="${t.taux_adoption || ''}" />
    `;
  }
  if(type === 'marche') {
      extra = `
        <label for="marche-label">Titre *</label>
        <input type="text" id="marche-label" required value="${t.label || ''}" />
        <label for="marche-valeur">Valeur</label>
        <input type="text" id="marche-valeur" value="${t.valeur || ''}" />
        <label for="marche-icone">Icône</label>
        <input type="text" id="marche-icone" value="${t.icone || ''}" />
      `;
  }
  if(type === 'insights') {
    extra = `
      <label for="insight-icone">Icône</label>
      <input type="text" id="insight-icone" value="${t.icone || ''}" />
    `;
  }
  if(type === 'predictions') {
    extra = `
      <label for="pred-annee">Année *</label>
      <input type="number" id="pred-annee" required value="${t.annee || ''}" />
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
  const body = {
    titre: document.getElementById('tendance-titre').value,
    description: document.getElementById('tendance-description').value,
    image: document.getElementById('tendance-image').value,
    date_publication: document.getElementById('tendance-date').value,
    tags: document.getElementById('tendance-tags').value.split(',').map(s => s.trim()).filter(Boolean),
    categorie: state[type].categorie
  };
  // Champs spécifiques au type technologies
  if(type === 'technologies') {
    body.nom = document.getElementById('tech-nom').value;
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

// Fermer la modale si clic en dehors
window.onclick = function(event) {
  const modal = document.getElementById('tendance-modal');
  if (event.target == modal) {
    closeModal();
  }
};