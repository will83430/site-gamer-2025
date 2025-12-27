# Architecture du Projet Site Gamer 2025

## Vue d'ensemble

```
site-gamer-2025/
├── Backend (Node.js + Express + PostgreSQL)
│   └── server.js → Serveur principal
└── Frontend (Statique HTML/CSS/JS)
    └── frontend/public/
```

## 🔧 Backend (server.js)

**Rôle** : API REST + Serveur de fichiers statiques

### Endpoints principaux
- `GET /api/produits` → Liste tous les produits
- `POST /api/produits` → Créer un produit
- `PUT /api/produits/:id` → Modifier un produit
- `DELETE /api/produits/:id` → Supprimer un produit
- `POST /api/generate-fiche/:id` → Générer fiche HTML
- `GET /api/:categorie/actualites` → Actualités par catégorie
- `GET /api/:categorie/technologies` → Technologies par catégorie
- `GET /api/:categorie/marche` → Données marché par catégorie
- `GET /api/tendances` → Liste des tendances

### Dépendances
- `express` → Framework web
- `pg` → Client PostgreSQL
- `cors` → Gestion CORS
- `compression` → Gzip
- `multer` → Upload fichiers

### Middleware statique (ordre important)
1. `/assets` → `frontend/public/assets`
2. `/` → `frontend/public`
3. `/fiches` → `fiches/`
4. `/` → Racine projet

## 🎨 Frontend (Fichiers statiques)

### Structure des fichiers

```
frontend/public/
├── index.html                    → Page d'accueil
├── top-du-mois.html             → Page des tops produits
├── admin-gestion-produits.html  → Interface admin produits
├── admin-tendances-dashboard.html → Interface admin tendances
├── assets/
│   ├── css/
│   │   ├── styles.css          → Styles source
│   │   └── styles.min.css      → Styles minifiés (build)
│   ├── js/
│   │   ├── fiches.js           → Gestion liste produits
│   │   ├── fiche-produit.js    → Page détail produit
│   │   ├── tendances.js        → Gestion tendances
│   │   ├── admin-gestion-produits.js → Admin produits
│   │   ├── admin-tendances-dashboard.js → Admin tendances
│   │   └── *.min.js            → Versions minifiées (build)
│   └── images/
│       └── *.{png,jpg,jpeg}    → Images produits
```

### Relations fonctionnelles (pas de système de modules)

#### index.html → fiches.js
- Charge la liste des produits via `GET /api/produits`
- Affiche les catégories
- Gère la sélection et filtres

#### top-du-mois.html → fiches.js
- Charge produits avec `top_du_mois=true`
- Affichage optimisé pour les tops

#### Fiches générées → fiche-produit.js
```
fiches/<categorie>/<produit>.html
├── Charge styles.min.css
├── Charge fiche-produit.min.js
└── Appelle GET /api/produits pour charger données
```

#### admin-gestion-produits.html → admin-gestion-produits.js
- CRUD complet via API REST
- Upload images via Multer
- Génération de fiches via `POST /api/generate-fiche/:id`

#### admin-tendances-dashboard.html → admin-tendances-dashboard.js
- Gestion tendances (actualités, technologies, marché, etc.)
- Par catégorie de produits

## 🗄️ Base de données (PostgreSQL)

### Tables principales
- `produits` → Catalogue produits (id, nom, categorie, prix, etc.)
- `categories` → Liste des catégories
- `actualites` → Actualités par catégorie
- `technologies` → Technologies émergentes
- `marche` → Données du marché
- `insights` → Analyses sectorielles
- `predictions` → Prévisions tech
- `tendances` → Tendances globales

### Connexion
- User: `postgres`
- Database: `gamer_2025`
- Password: `Wilfried!1985`

## 🔄 Flux de données

### Chargement d'une page produit
```
1. User visite fiches/<categorie>/<produit>.html
2. Navigateur charge fiche-produit.min.js
3. JS fait GET /api/produits
4. Server.js query PostgreSQL
5. Retour JSON → Affichage dynamique
```

### Génération d'une fiche
```
1. Admin clique "Générer fiche" (ou script)
2. POST /api/generate-fiche/:id
3. Server.js:
   - Récupère produit depuis DB
   - Génère HTML avec template
   - Sauvegarde dans fiches/<categorie>/<slug>.html
4. Fiche accessible via URL statique
```

### Administration produits
```
1. Admin ouvre admin-gestion-produits.html
2. admin-gestion-produits.js charge liste via GET /api/produits
3. Modifications → PUT /api/produits/:id
4. Création → POST /api/produits
5. Suppression → DELETE /api/produits/:id
```

## 📦 Scripts de gestion

### scripts/
- `add-new-products.js` → Insert 12 produits décembre
- `generate-all-new-fiches.js` → Génère fiches via API
- `generate-new-products.js` → Génère fiches directement depuis DB
- `regenerate-all-fiches.js` → Regénère toutes les fiches
- `regenerate-fiches-top.js` → Regénère uniquement les tops
- `set-top-decembre.js` → Toggle `top_du_mois` via API
- `verify-database-state.js` → Vérifications intégrité DB

## 🏗️ Build process

### CSS
```bash
npm run build:css
# cleancss -o frontend/public/assets/css/styles.min.css frontend/public/assets/css/styles.css
```

### JavaScript
```bash
npm run build:js
# Minifie fiches.js, fiche-produit.js, tendances.js avec Terser
```

### Tout en un
```bash
npm run build:all
```

## 📊 Diagrammes disponibles

```bash
npm run diagram:all       # Vue complète projet
npm run diagram:backend   # Backend uniquement
npm run diagram:frontend  # Frontend uniquement
npm run diagram:server    # Dépendances server.js
npm run diagram:check     # Vérifier dépendances circulaires
```

**Note** : Les diagrammes madge montrent les imports/requires JavaScript. Comme le frontend utilise des fichiers autonomes (sans modules ES6/CommonJS), madge ne détecte pas de liens entre eux. Les relations réelles sont fonctionnelles (via API REST).

## 🚀 Démarrage

### Développement
```bash
npm run dev  # nodemon server.js
```

### Production
```bash
npm start    # node server.js
```

Le serveur écoute sur `http://0.0.0.0:3000`

## 🔒 Sécurité & Config

- CORS permissif (tous origins autorisés)
- Gzip activé pour toutes les réponses
- Pas d'authentification (admin en local)
- Credentials DB hard-codés (à externaliser via .env en prod)

## 📝 Notes importantes

1. **Ordre du middleware statique** : Ne pas réorganiser les app.use() dans server.js
2. **Images** : Stocker uniquement le nom de fichier dans `produits.image`, pas le chemin complet
3. **Slugification** : Les noms de fichiers fiches sont générés depuis `product.nom` (alphanumeric + `-`)
4. **Titre d'affichage** : `titre_affiche` optionnel, sinon utilise `nom` prettifié
5. **IDs produits** : Format `prod_XX` auto-incrémenté
