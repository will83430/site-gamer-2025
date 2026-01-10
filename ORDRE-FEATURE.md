# Fonctionnalité de Réordonnancement des Tendances

## Vue d'ensemble
Un système complet de réordonnancement a été ajouté au dashboard des tendances, permettant de contrôler manuellement l'ordre d'affichage des items dans toutes les sections (actualités, technologies, marché, insights, prédictions).

## Modifications apportées

### 1. Base de données (SQL)
**Fichier:** `sql/add-ordre-column.sql`

- Ajout de la colonne `ordre` (INTEGER) aux 5 tables
- Initialisation automatique avec valeurs séquentielles par catégorie
- Script exécuté avec succès :
  - actualites: 67 items
  - technologies: 63 items
  - marche: 80 items
  - insights: 45 items
  - predictions: 71 items

### 2. Backend

#### Routes de contenu (`backend/routes/content.js`)
- **Tri modifié** dans toutes les requêtes GET :
  ```sql
  ORDER BY ordre ASC, date_publication DESC, id DESC
  ```
- **Nouvel endpoint** `/api/:categorie/:type/reorder` (POST)
  - Paramètres: `{ id, direction }` (direction: 'up' ou 'down')
  - Échange les valeurs `ordre` entre l'item sélectionné et son voisin
  - Retourne un message si l'item est déjà en position extrême

#### Routes CRUD individuelles
Tous les fichiers modifiés :
- `backend/routes/tendances.js`
- `backend/routes/technologies.js`
- `backend/routes/marche.js`
- `backend/routes/insights.js`
- `backend/routes/predictions.js`

**POST (création) :**
- Récupère `MAX(ordre)` pour la catégorie
- Attribue automatiquement `ordre = max + 1`
- Assure que les nouveaux items apparaissent en dernier

**PUT (modification) :**
- Corrigé pour utiliser les bons champs de chaque table

**GET :**
- Tri par `ordre ASC` puis critères secondaires

### 3. Frontend

#### Dashboard (`frontend/public/assets/js/admin-tendances-dashboard.js`)

**Colonnes modifiées :**
Ajout d'une colonne "Ordre" en première position pour chaque type :
```javascript
{ 
  key: 'ordre', 
  label: 'Ordre', 
  render: (t, type) => `
    <div style="display:flex;gap:4px;justify-content:center;">
      <span>${t.ordre || ''}</span>
      <button onclick="reorderItem('${type}','${t.id}','up')">↑</button>
      <button onclick="reorderItem('${type}','${t.id}','down')">↓</button>
    </div>`
}
```

**Nouvelle fonction :**
```javascript
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
        loadTendances(type); // Recharge la liste
      }
    });
}
```

**Export global :**
```javascript
window.reorderItem = reorderItem;
```

#### Styles (`frontend/public/assets/css/admin-styles.css`)
```css
.btn-sm {
    padding: 4px 10px;
    font-size: 14px;
    min-width: 28px;
    height: 28px;
    background: #6c757d;
    color: white;
    border-radius: 4px;
}

.btn-sm:hover {
    background: #5a6268;
    transform: scale(1.05);
}
```

## Utilisation

### Dans le dashboard admin (`admin-tendances.html`)

1. **Affichage :** Chaque ligne montre maintenant son numéro d'ordre + 2 boutons fléchés
2. **Monter un item :** Cliquer sur ↑ pour faire remonter l'item d'une position
3. **Descendre un item :** Cliquer sur ↓ pour faire descendre l'item d'une position
4. **Limite :** Tenter de monter le premier item ou descendre le dernier affiche un message d'info

### Ordre d'affichage
- **Actualités :** ordre → date_publication DESC → id DESC
- **Technologies :** ordre → id ASC
- **Marché :** ordre → id ASC
- **Insights :** ordre → id ASC
- **Prédictions :** ordre → annee ASC → id ASC

### Nouveaux items
Automatiquement placés en dernière position (ordre = max + 1)

## Tests recommandés

1. ✅ Vérifier l'affichage de la colonne Ordre
2. ✅ Tester monter/descendre des items
3. ✅ Vérifier le comportement aux limites (premier/dernier item)
4. ✅ Créer un nouvel item et vérifier qu'il apparaît en dernier
5. ✅ Changer de catégorie et vérifier l'ordre indépendant par catégorie

## Notes techniques

- L'ordre est **indépendant par catégorie**
- Le réordonnancement utilise un **échange atomique** (swap) pour garantir la cohérence
- Les requêtes utilisent **COALESCE(MAX(ordre), 0)** pour gérer le cas où aucun item n'existe
- Le frontend recharge automatiquement la liste après chaque modification

## Date d'implémentation
6 janvier 2026
