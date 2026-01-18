# Changelog - Diagramme Architecture Vue.js

## Version 2.0 - Migration Vue.js (2026-01-15)

### Nouveau fichier créé
`wiki/project-connections-vue.html` - Diagramme dédié à l'architecture Vue.js

### Changements majeurs par rapport à `project-connections-vue.html`

#### 1. Titre et description mis à jour
- **Avant**: "Architecture Site Gamer 2025 - Vue Interactive Améliorée"
- **Après**: "Architecture Vue.js Site Gamer 2026 - Migration Complète"

#### 2. Métriques du header mises à jour
- **Avant**: 8 modules routes, -59% code server.js, 51 scripts migrés, etc.
- **Après**:
  - Vue 3 Composition API
  - 5 pages Vue
  - 8 composants
  - Vite build tool
  - Pinia state management

#### 3. Nouveau filtre "Vue.js" ajouté
- Bouton dédié pour filtrer uniquement l'architecture Vue.js
- Style personnalisé avec couleurs Vue.js (vert #42b883)
- Animation au hover avec shadow effect

#### 4. Nouvelle colonne "Vue.js Core" ajoutée
Contient:
- `main.js` - Point d'entrée Vue.js (connecté à App.vue, Router, Pinia)
- `App.vue` - Composant racine + Layout
- `router/index.js` - Vue Router avec 5 routes + lazy loading
- `Pinia` - State management
- `router-view` - Rendu dynamique des pages

Couleurs: Dégradé vert Vue.js (#42b883 → #35495e)

#### 5. Nouvelle colonne "Vue Pages" ajoutée
Contient les 5 pages principales:
- `Home.vue` - Page d'accueil
- `Products.vue` - Catalogue produits
- `ProductDetail.vue` - Détail produit
- `TopOfMonth.vue` - Top du mois
- `TrendPage.vue` - Tendances tech

Couleurs: Dégradé bleu ciel (#81d4fa → #4fc3f7)

#### 6. Nouvelle colonne "Vue Components" ajoutée
Contient les 6 composants réutilisables:
- `AppHeader.vue` - Navigation (Layout)
- `AppFooter.vue` - Footer (Layout)
- `ProductCard.vue` - Carte produit (Reusable)
- `LoadingSpinner.vue` - Spinner (Common)
- `ErrorMessage.vue` - Erreurs (Common)
- `PageTransition.vue` - Animations (Common)

Couleurs: Dégradé violet (#ce93d8 → #ba68c8)

#### 7. Nouvelle colonne "Stores & Logic" ajoutée
Contient:
- `routerStore.js` - Store Pinia pour loading state
- `useTrendData.js` - Composable pour tendances

Couleurs: Dégradé orange (#ffab91 → #ff8a65)

#### 8. Connexions Vue.js ajoutées
Nouvelles connexions documentées:
- main.js → App.vue, Router, Pinia
- App.vue → Header, Footer, router-view
- router-view → 5 pages Vue
- Pinia → routerStore
- Pages → Composants (ProductCard, LoadingSpinner, ErrorMessage)
- Pages → API Backend (Express Server)
- TrendPage → useTrendData composable
- useTrendData → API Backend

#### 9. Légende mise à jour
Nouvelles entrées:
- Vue.js Core (vert/turquoise)
- Vue Pages (bleu ciel)
- Vue Components (violet)
- Stores & Composables (orange)

Descriptions actualisées pour refléter l'architecture Vue.js

#### 10. Styles CSS personnalisés ajoutés
```css
/* Bouton Vue.js avec couleurs officielles */
.btn-vue {
    background: linear-gradient(135deg, #42b883, #35495e);
}

/* Animation pulse pour badges NEW */
@keyframes pulse-new {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

#### 11. Badges "NEW" ajoutés
Tous les éléments Vue.js ont un badge "NEW" avec animation pulse pour indiquer les nouveaux composants de la migration

#### 12. Tooltips enrichis
Nouveaux tooltips avec descriptions détaillées:
- "Point d'entrée Vue.js"
- "Composant racine + Layout"
- "Vue Router v4"
- "State management"
- "Carte produit réutilisable"
- etc.

### Fonctionnalités conservées

Les fonctionnalités interactives originales sont maintenues:
- Hover pour afficher les connexions
- Click pour verrouiller la vue
- Badges de comptage de connexions
- Tooltips au survol
- Compteur de connexions actives
- Légende des connexions
- Animations fluides
- Système de filtres par couches

### Architecture préservée

Les colonnes backend originales sont conservées:
- Server Column (server.js)
- Config Column (database.js, .env)
- Routes Column (8 modules routes)
- Database Column (PostgreSQL tables)
- Scripts Column (51 scripts organisés)
- Tests Column (Jest tests)

### Différences techniques

#### Fichier original (`project-connections-vue.html`)
- Focus: Architecture backend modulaire
- Frontend: HTML statique + vanilla JS
- Colonnes: 6 (Frontend, Server, Config, Routes, DB, Scripts, Tests)

#### Nouveau fichier (`project-connections-vue.html`)
- Focus: Architecture Vue.js + Backend
- Frontend: Vue.js 3 SPA moderne
- Colonnes: 10 (Vue Core, Vue Pages, Vue Components, Stores, + backend)

### Nombre de nœuds par fichier

**project-connections-vue.html**: ~30 nœuds
- 5 Frontend HTML/JS
- 1 Server
- 2 Config
- 8 Routes
- 1 Utilities
- 8 Database tables
- 4 Scripts groups
- 3 Tests

**project-connections-vue.html**: ~45 nœuds
- 5 Vue Core (main.js, App.vue, router, pinia, router-view)
- 5 Vue Pages
- 6 Vue Components
- 2 Stores/Composables
- 1 Server
- 2 Config
- 8 Routes
- 1 Utilities
- 8 Database tables
- 4 Scripts groups
- 3 Tests

### Poids des fichiers

- `project-connections-vue.html`: ~45 KB
- `project-connections-vue.html`: ~54 KB (+20% pour la nouvelle architecture Vue.js)

### Nombre de connexions

**Avant** (HTML statique): ~25 connexions
- Frontend → Server
- Server → Routes
- Routes → Database
- Config → Database

**Après** (Vue.js): ~60 connexions
- main.js → Vue Core
- App.vue → Layout Components
- router-view → Pages
- Pages → Components
- Pages → API Backend
- Components → Styles
- Stores → Router
- Composables → API

### Prochaines améliorations possibles

1. Ajouter une section "Build Tools" (Vite, ESLint, Prettier)
2. Visualiser les dépendances npm (package.json)
3. Ajouter les routes API détaillées par page
4. Inclure les tests E2E Vue.js
5. Documenter le flow de données Pinia
6. Ajouter une timeline de migration HTML → Vue
7. Intégrer un mode comparaison "Avant/Après"
8. Ajouter des captures d'écran des pages Vue
9. Documenter les performances (bundle size, load time)
10. Ajouter un export PDF du diagramme

---

**Version**: 2.0
**Date**: 2026-01-15
**Auteur**: Équipe Dev Site Gamer 2025
**Fichier source**: `wiki/project-connections-vue.html`
