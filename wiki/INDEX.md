# Wiki - Site Gamer 2025/2026

## Diagrammes d'Architecture Interactifs

### 📊 Diagrammes Disponibles

| Fichier | Description | Version | Taille |
|---------|-------------|---------|--------|
| **[project-connections-vue.html](./project-connections-vue.html)** | Architecture Backend Modulaire | 1.0 | 45 KB |
| **[project-connections-vue.html](./project-connections-vue.html)** | Architecture Vue.js Complète | 2.0 | 54 KB |

### 🎯 Quel diagramme utiliser?

#### `project-connections-vue.html` - Architecture Backend
Utilisez ce diagramme si vous voulez comprendre:
- La refactorisation du backend Express
- Les 8 modules routes modulaires
- La migration de 51 scripts
- L'architecture PostgreSQL
- Les tests Jest backend

**Focus**: Backend Node.js/Express

#### `project-connections-vue.html` - Architecture Vue.js
Utilisez ce diagramme si vous voulez comprendre:
- L'architecture Vue.js 3 complète
- Les 5 pages Vue (Views)
- Les 8 composants réutilisables
- Le routing avec Vue Router
- Le state management avec Pinia
- Les connexions Frontend → Backend

**Focus**: Frontend Vue.js + Backend intégré

## 📁 Structure du Wiki

```
wiki/
├── INDEX.md                          ← Ce fichier
├── CHANGELOG-DIAGRAM-VUE.md         ← Historique des changements
├── project-connections-vue.html          ← Diagramme backend v1.0
├── project-connections-vue.html      ← Diagramme Vue.js v2.0
└── architecture-flow-modular.css     ← Styles partagés
```

## 🚀 Ouverture rapide

### Windows (PowerShell)
```powershell
# Diagramme Vue.js
.\open-architecture-vue.ps1

# Ou manuellement
cd wiki
start project-connections-vue.html
start project-connections-vue.html
```

### macOS / Linux
```bash
# Diagramme Vue.js
cd wiki
open project-connections-vue.html

# Diagramme backend
open project-connections-vue.html
```

## 📖 Documentation Associée

### Documents Racine
- **[ARCHITECTURE-VUE-INTERACTIVE.md](../ARCHITECTURE-VUE-INTERACTIVE.md)** - Documentation complète Vue.js
- **[REFACTORING-SUMMARY.md](../REFACTORING-SUMMARY.md)** - Historique refactoring backend
- **[ANALYSE-ARCHITECTURE-COMPLETE.md](../ANALYSE-ARCHITECTURE-COMPLETE.md)** - Architecture globale
- **[TRANSITIONS-FLUIDES.md](../TRANSITIONS-FLUIDES.md)** - Détails transitions Vue
- **[OPTIMISATIONS-PERFORMANCE-VUE.md](../OPTIMISATIONS-PERFORMANCE-VUE.md)** - Optimisations Vue.js

### Documents de Test
- **[TEST-PHASE-C.md](../TEST-PHASE-C.md)** - Tests migration Vue
- **[TEST-PHASE-D.md](../TEST-PHASE-D.md)** - Tests validation

## ✨ Fonctionnalités des Diagrammes

### Interactions Communes
- 🖱️ **Hover** - Affiche les connexions entrantes (vert) et sortantes (violet)
- 🖱️ **Click** - Verrouille la vue sur un nœud
- 📊 **Filtres** - Affiche par couche (Vue.js, Frontend, Config, Routes, etc.)
- 🔢 **Badges** - Nombre de connexions actives
- 💬 **Tooltips** - Description détaillée au survol
- 📈 **Compteur** - Connexions actives en temps réel

### Légende des Connexions
- **Violet** → Connexions sortantes (ce composant utilise...)
- **Vert** → Connexions entrantes (utilisé par...)
- **Gris** → Connexions inactives (filtrées)

## 🎨 Couleurs par Couche

### Diagramme Vue.js (`project-connections-vue.html`)
| Couleur | Couche | Éléments |
|---------|--------|----------|
| 🟢 Vert/Turquoise | Vue.js Core | main.js, App.vue, Router, Pinia |
| 🔵 Bleu ciel | Vue Pages | Home, Products, ProductDetail, TopOfMonth, TrendPage |
| 🟣 Violet | Vue Components | Header, Footer, ProductCard, Loading, Error, Transition |
| 🟠 Orange | Stores & Logic | routerStore, useTrendData |
| 🟢 Cyan | Configuration | database.js, .env |
| 🔴 Rose | API Routes | 8 modules routes Express |
| 🟣 Violet foncé | Utilitaires | ficheGenerator.js |
| 🟡 Jaune | Database | Tables PostgreSQL |
| 🟠 Orange foncé | Scripts | 51 scripts organisés |
| 🟢 Vert pomme | Tests | Jest + Supertest |

### Diagramme Backend (`project-connections-vue.html`)
| Couleur | Couche | Éléments |
|---------|--------|----------|
| 🔵 Bleu | Frontend | HTML/JS statique |
| 🟢 Cyan | Configuration | database.js, .env |
| 🔴 Rose | Routes | 8 modules routes |
| 🟣 Violet | Utilitaires | ficheGenerator.js |
| 🟡 Jaune | Database | Tables PostgreSQL |
| 🟠 Orange | Scripts | Scripts organisés |
| 🟢 Vert pomme | Tests | Tests automatisés |

## 📈 Métriques Architecture

### Frontend Vue.js
- 5 pages principales (Views)
- 8 composants réutilisables
- 2 stores/composables Pinia
- 1 router (5 routes)
- 100% Composition API

### Backend Express
- 8 modules routes API RESTful
- 51 scripts maintenance organisés
- 15 tests Jest (100% pass)
- 7 tables PostgreSQL
- 1 configuration centralisée (database.js)

### Performance
- First Load: ~200ms (Vite dev)
- Route Change: ~50ms (lazy loading)
- Build Time: ~2s (Vite production)
- Bundle Size: ~150KB (gzipped)

## 🔄 Historique des Versions

### Version 2.0 (2026-01-15) - Migration Vue.js
- ✅ Nouveau diagramme `project-connections-vue.html`
- ✅ 4 nouvelles colonnes Vue.js (Core, Pages, Components, Stores)
- ✅ 17 nouveaux nœuds Vue.js
- ✅ 35 nouvelles connexions Frontend
- ✅ Filtre dédié "Vue.js"
- ✅ Couleurs Vue.js officielles
- ✅ Badges "NEW" animés
- ✅ Documentation complète

### Version 1.0 (2025) - Architecture Backend
- ✅ Diagramme initial `project-connections-vue.html`
- ✅ 6 colonnes backend
- ✅ ~30 nœuds
- ✅ ~25 connexions
- ✅ Système interactif complet

## 🛠️ Maintenance

### Mise à jour des diagrammes
Pour mettre à jour les diagrammes après des modifications d'architecture:

1. Ouvrir le fichier HTML concerné
2. Modifier la section `<div class="flow-container">`
3. Ajouter/modifier les nœuds avec `data-connects="targetId"`
4. Les connexions sont automatiquement recalculées par JavaScript
5. Tester les interactions (hover, click, filtres)
6. Documenter les changements dans CHANGELOG-DIAGRAM-VUE.md

### Ajout d'un nouveau nœud
```html
<div class="node" id="newNodeId" data-connects="targetId1,targetId2"
     style="background: linear-gradient(135deg, #color1, #color2);">
    <div class="node-tooltip">Description du nœud</div>
    <div class="connection-badge">2</div>
    <div class="node-title">🔧 Nom du nœud</div>
    <div class="node-desc">Description courte</div>
    <div class="node-badge">NEW</div>
</div>
```

## 📞 Support

Pour toute question sur l'architecture ou les diagrammes:
- Consulter la documentation complète dans les fichiers .md
- Examiner le code source des diagrammes HTML
- Vérifier les connexions interactives dans le navigateur

## 🎯 Prochaines Étapes

### Améliorations Prévues
- [ ] Ajouter section "Build Tools" (Vite, ESLint)
- [ ] Visualiser dépendances npm
- [ ] Mode comparaison "Avant/Après"
- [ ] Export PDF des diagrammes
- [ ] Timeline de migration
- [ ] Intégration tests E2E Vue.js
- [ ] Documentation flow Pinia détaillé
- [ ] Captures d'écran des pages Vue
- [ ] Métriques de performance en temps réel

---

**Dernière mise à jour**: 2026-01-15
**Mainteneur**: Équipe Dev Site Gamer 2025
**Version wiki**: 2.0
