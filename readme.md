# 🎮 Site Gamer 2025 - Comparateur de Produits Gaming

Un site web moderne de comparaison et gestion de produits gaming avec interface d'administration complète, base de données PostgreSQL et documentation Wiki interactive.

## 📈 Dernières Mises à Jour

### 🎉 Version 2.3.0 - 6 Janvier 2026

#### 🎨 Architecture Interactive Améliorée

- ✅ **Diagramme d'architecture interactif avancé** : project-connections-enhanced.html
- ✅ **Courbes de Bézier élégantes** : Connexions fluides adaptées aux distances
- ✅ **Hover avec transparence** : Met en évidence les composants connectés
- ✅ **Click-to-lock** : Verrouille la visualisation avec bordure orange
- ✅ **Compteur dynamique** : Affiche connexions sortantes (→) et entrantes (←)
- ✅ **Légende interactive** : Explique les types de connexions (violet/vert/gris)
- ✅ **Filtres par couche** : Frontend, Config, Routes, Database, Scripts, Tests
- ✅ **Badges de connexion** : Affiche le nombre de liens par composant

#### ✅ Suite de Tests Complète

- ✅ **38 tests au total** : 15 Jest (Backend) + 23 Web (E2E)
- ✅ **Tests unitaires Jest** : API, Database, Generation (15 tests)
- ✅ **Tests fonctionnels Web** : Suite interactive 23 tests (P1/P2/P3)
- ✅ **Coverage** : Couverture de code avec lcov
- ✅ **Interface test-suite.html** : Runner interactif avec priorités
- ✅ **Tests automatisés** : Images, fiches, API, performance, SEO, accessibilité

### 🎉 Version 2.2.0 - 26 Décembre 2025

#### 📚 Nouvelle Documentation Wiki Interactive

- ✅ **15 pages de documentation complètes** avec navigation cohérente
- ✅ **wiki.html** : Hub principal avec recherche en temps réel et cartes interactives
- ✅ **project-connections.html** : Diagramme SVG interactif montrant l'architecture du système
- ✅ **tests.html** : Documentation complète des tests avec accès direct à la suite
- ✅ **api-reference.html** : Documentation complète de l'API REST
- ✅ **database.html** : Schéma PostgreSQL avec exemples de requêtes
- ✅ **scripts.html** : Documentation des 30+ scripts de maintenance
- ✅ **changelog.html** : Historique des versions avec recherche intégrée
- ✅ **troubleshooting.html** : Guide de dépannage complet
- ✅ **CSS externe unifié** : wiki-styles.css pour meilleure maintenabilité
- ✅ **Recherche intelligente** : Filtrage en temps réel sur wiki.html et changelog.html

#### 🎯 Nouveaux Produits Premium - Décembre 2025

- ✅ **12 produits top ajoutés** (prod_50 à prod_61) :
  - **Smartphones** : iPhone 15 Pro Max, Samsung Galaxy S24 Ultra
  - **Montres** : Apple Watch Ultra 2, Samsung Galaxy Watch6 Classic
  - **Caméras** : Canon EOS R5 Mark II, Sony Alpha 7R V
  - **Écrans TV** : LG OLED G4 77", Samsung Neo QLED QN95D 85"
  - **Casques VR** : Meta Quest 3, PlayStation VR2
  - **GPU** : NVIDIA RTX 4090, AMD Radeon RX 7900 XTX
- ✅ **Scripts de génération** : add-new-products.js, generate-all-new-fiches.js
- ✅ **Système "Top du mois"** : set-top-decembre.js pour marquage automatique

#### 🗃️ Optimisations Base de Données

- ✅ **61+ produits** avec données complètes et enrichies
- ✅ **16 catégories** standardisées et normalisées
- ✅ **Scripts de normalisation** par catégorie (camera, drone, smartphone, etc.)
- ✅ **Vérification intégrité** : verify-database-state.js avec checks automatiques
- ✅ **Arrays JSONB** : fonctionnalites_avancees et donnees_fiche structurés
- ✅ **Gestion des liens** : Correction automatique des espaces et chemins absolus

## 📋 Table des matières

- [Aperçu du projet](#-aperçu-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration de la base de données](#️-configuration-de-la-base-de-données)
- [Documentation Wiki](#-wiki---guide-complet)
- [API](#-api)
- [Scripts](#%EF%B8%8F-scripts)
- [Interface d'administration](#interface-dadministration)
- [Contribution](#-contribution)

## 🎯 Aperçu du projet

Site web professionnel dédié aux produits gaming permettant :

- Consultation et comparaison de 61+ produits tech/gaming
- Gestion administrative complète avec CRUD
- Interface utilisateur moderne et responsive
- Système de filtrage et recherche avancée
- **Base de données PostgreSQL** pour la persistance
- **Documentation Wiki interactive** avec 15 pages complètes
- **Génération automatique de fiches** produits HTML
- **Système de tendances** par catégorie (actualités, technologies, marché, etc.)

## ✨ Fonctionnalités

### 🌐 Frontend Public

- **Catalogue produits** : Affichage en grille moderne avec fiches détaillées
- **Pages tendances par catégorie** : Actualités, technologies, marché, insights et prédictions pour chaque univers (ex : vidéo projecteur, périphériques, etc.)
- **Navigation dynamique** : Accès rapide aux tendances de chaque catégorie via des pages dédiées
- **Système de comparaison** : Comparaison jusqu'à 4 produits simultanément
- **Filtrage avancé** : Par catégorie, prix, marque, etc.
- **Recherche intelligente** : Recherche en temps réel
- **Interface responsive** : Compatible mobile/tablette/desktop
- **Animations modernes** : Transitions fluides et effets visuels

### 🔧 Backend d'Administration

- **Gestion produits** : CRUD complet (Créer, Lire, Modifier, Supprimer)
- **Upload d'images** : Drag & drop moderne avec prévisualisation
- **Gestion catégories** : Système de catégories dynamiques
- **Interface intuitive** : Dashboard moderne avec onglets
- **Validation** : Contrôles de saisie et messages d'erreur
- **Persistance PostgreSQL** : Base de données relationnelle robuste
- **API REST complète** : 20+ endpoints pour produits, fiches, tendances
- **Génération de fiches** : Création automatique de pages HTML par produit

### 📚 Documentation Wiki

- **15 pages interactives** : Documentation complète et navigable
- **Recherche en temps réel** : Filtrage instantané sur wiki.html et changelog.html
- **Architecture interactive** : Diagramme avancé avec hover, click-to-lock et compteur
- **Documentation tests** : Guide complet 38 tests (15 Jest + 23 Web)
- **Guides complets** : Installation, API, base de données, scripts, workflows
- **Best practices** : Conventions de code et standards du projet
- **Glossaire technique** : 40+ termes définis de A à Z
- **Changelog détaillé** : Historique des versions avec recherche
- **CSS unifié** : wiki-styles.css pour maintenance facilitée

### ✅ Tests & Qualité

- **38 tests automatisés** : Couverture complète backend + frontend
- **15 tests Jest** : Tests unitaires (API, Database, Generation)
- **23 tests Web E2E** : Suite interactive priorités P1/P2/P3
- **Coverage reports** : LCOV avec seuils minimum 80%
- **Interface test-suite.html** : Runner web interactif avec statistiques
- **Tests CI-ready** : npm test pour intégration continue
- **Scripts de maintenance** : verify-assets.js, verify-database-state.js

## 🛠 Technologies utilisées

### Frontend

- **HTML5** - Structure sémantique
- **CSS3** - Styling moderne (Grid, Flexbox, animations, gradient effects)
- **JavaScript ES6+** - Logique interactive, fetch API
- **SVG** - Visualisations vectorielles (diagrammes d'architecture)
- **Responsive Design** - Compatible tous écrans
- **CSS Minification** - Clean-CSS pour production
- **JS Minification** - Terser pour optimisation

### Backend

- **Node.js 18+** - Serveur backend avec fetch natif
- **Express.js** - Framework web avec middleware gzip
- **PostgreSQL 14+** - Base de données relationnelle
- **pg** - Driver PostgreSQL pour Node.js
- **CORS** - Configuration permissive pour développement
- **Architecture modulaire** : 8 modules routes refactorisés (-59% code server.js)

### Base de données

- **PostgreSQL 14+** - SGBD principal avec arrays et JSONB
- **pgAdmin** - Interface d'administration (optionnel)
- **Indexes** - Optimisation requêtes sur catégorie, top_du_mois
- **JSONB** - Stockage flexible des donnees_fiche
- **Pool de connexions** - Gestion optimisée via backend/config/database.js

### Tests & Qualité

- **Jest** - Framework de tests unitaires
- **Supertest** - Tests HTTP/API
- **Coverage** - Rapports de couverture LCOV
- **Test-suite web** - Interface HTML interactive
- **Scripts Node** - Vérification automatisée des assets et données

### Documentation

- **Wiki HTML** - 15 pages interactives
- **CSS unifié** - wiki-styles.css pour cohérence
- **Recherche JS** - Filtrage en temps réel
- **SVG** - Diagrammes interactifs d'architecture

## 📁 Structure du projet

```text
site-gamer-2025/
├── frontend/
│   └── public/
│       ├── assets/
│       │   ├── css/
│       │   │   ├── admin-styles.css     # Styles administration
│       │   │   ├── style.css            # Styles principaux
│       │   │   └── styles.min.css       # Styles minifiés (production)
│       │   ├── images/                  # Images produits (300+ fichiers)
│       │   └── js/
│       │       ├── admin-gestion-produits.js  # Logique admin
│       │       ├── fiches.min.js        # Logique fiches (minifié)
│       │       └── script.js            # Scripts généraux
│       ├── fiches.html                 # Page catalogue produits
│       ├── index.html                  # Page d'accueil
│       ├── tendances-<categorie>.html  # Pages tendances (16 catégories)
│       └── Gestion des produits et génération automatique.html  # Admin
├── fiches/                             # Fiches produits générées
│   ├── smartphone/                     # Par catégorie
│   ├── pc-gaming/
│   ├── console/
│   └── ...                            # 16 catégories
├── wiki/                               # Documentation Wiki
│   ├── wiki.html                      # Hub principal avec recherche
│   ├── wiki-styles.css                # Styles communs
│   ├── project-connections.html       # Diagramme interactif
│   ├── project-details.html           # Documentation composants
│   ├── api-reference.html             # Référence API
│   ├── database.html                  # Schéma PostgreSQL
│   ├── scripts.html                   # Documentation scripts
│   ├── changelog.html                 # Historique versions
│   ├── troubleshooting.html           # Guide dépannage
│   ├── installation.html              # Guide installation
│   ├── best-practices.html            # Bonnes pratiques
│   ├── glossary.html                  # Glossaire technique
│   ├── deployment.html                # Guide déploiement
│   ├── frontend.html                  # Documentation frontend
│   ├── workflows.html                 # Processus détaillés
│   └── getting-started.html           # Démarrage rapide
├── scripts/                            # 30+ scripts maintenance
│   ├── add-new-products.js            # Ajout batch produits
│   ├── generate-all-new-fiches.js     # Génération fiches (API)
│   ├── generate-new-products.js       # Génération fiches (direct)
│   ├── regenerate-all-fiches.js       # Régénération complète
│   ├── regenerate-fiches-top.js       # Régénération "top du mois"
│   ├── set-top-decembre.js            # Marquage produits décembre
│   ├── verify-database-state.js       # Vérification intégrité DB
│   ├── normalize-*.js                 # Scripts normalisation (10+)
│   └── ...                            # Autres utilitaires
├── backend/
│   ├── gestion_produits.sql           # Données complètes (61 produits)
│   └── schema.sql                     # Schéma base de données
├── server.js                           # Serveur Express principal
├── package.json                        # Dépendances Node.js
├── README.md                           # Ce fichier
├── README-TOP-DECEMBRE.md             # Documentation produits décembre
└── README-TOP-NOVEMBRE.md             # Documentation produits novembre
```

## 🚀 Installation

### Prérequis

- **Node.js** (version 14+)
- **PostgreSQL** (version 13+)
- **npm** ou **yarn**
- Navigateur moderne

### Étapes d'installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/votre-username/site-gamer-2025.git
   cd site-gamer-2025
   ```

2. **Installer PostgreSQL**

   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib
   
   # macOS (avec Homebrew)
   brew install postgresql
   
   # Windows : Télécharger depuis postgresql.org
   ```

3. **Installer les dépendances**

   ```bash
   npm install
   ```

4. **Créer et initialiser la base de données**

   ```bash
   # Se connecter à PostgreSQL
   psql -U postgres
   
   # Créer la base
   CREATE DATABASE gamer_2025;
   \q
   
   # Charger les données complètes (61 produits + structure)
   psql -U postgres -d gamer_2025 -f backend/gestion_produits.sql
   ```

5. **Démarrer le serveur**

   ```bash
   npm start
   # Ou en mode développement avec nodemon
   npm run dev
   ```

6. **Accéder à l'application**

   - Frontend : <http://localhost:3000>
   - Wiki : <http://localhost:3000/wiki/wiki.html>
   - Admin : <http://localhost:3000/Gestion%20des%20produits%20et%20génération%20automatique.html>

## 🗄️ Configuration de la base de données

### Variables d'environnement (.env)

```env
# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=XXXX
DB_NAME=gamer_2025
DB_USER=XXXXX
DB_PASSWORD=XXXXXXX

# Serveur
PORT=3000
NODE_ENV=development
```

### Initialisation de la base

1. **Créer la base de données**

   ```sql
   -- Connectez-vous à PostgreSQL
   psql -U postgres
   
   -- Créer la base
   CREATE DATABASE gamer_2025;
   ```

2. **Charger les données complètes**

   ```bash
   psql -U postgres -d gamer_2025 -f backend/gestion_produits.sql
   ```

### Schéma principal

```sql
-- Table des produits (structure complète)
CREATE TABLE produits (
    id VARCHAR(20) PRIMARY KEY,          -- ex: prod_50, prod_51...
    nom VARCHAR(255) NOT NULL,
    prix VARCHAR(50),
    categorie VARCHAR(100),
    description TEXT,
    image VARCHAR(255),                   -- Nom fichier uniquement
    lien VARCHAR(500),                    -- URL fiche générée
    fonctionnalites_avancees TEXT[],      -- Array PostgreSQL
    donnees_fiche JSONB,                  -- Données structurées fiche
    top_du_mois BOOLEAN DEFAULT FALSE,
    titre_affiche VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables tendances par catégorie
CREATE TABLE categories (id SERIAL PRIMARY KEY, nom VARCHAR(100));
CREATE TABLE actualites (id SERIAL, titre TEXT, description TEXT, image VARCHAR(255), date_publication DATE, tags TEXT[], categorie_id INT);
CREATE TABLE technologies (id SERIAL, nom TEXT, description TEXT, icone VARCHAR(100), taux_adoption INT, categorie_id INT);
CREATE TABLE marche (id SERIAL, label TEXT, valeur TEXT, icone VARCHAR(100), tendance VARCHAR(50), categorie_id INT);
CREATE TABLE insights (id SERIAL, titre TEXT, description TEXT, icone VARCHAR(100), categorie_id INT);
CREATE TABLE predictions (id SERIAL, titre TEXT, description TEXT, annee INT, probabilite INT, icone VARCHAR(100), categorie_id INT);
CREATE TABLE tendances (id SERIAL, titre TEXT, description TEXT, categorie VARCHAR(100), tags TEXT[], created_at TIMESTAMP);

-- Index pour performances
CREATE INDEX idx_produits_categorie ON produits(categorie);
CREATE INDEX idx_produits_top ON produits(top_du_mois);
CREATE INDEX idx_tendances_categorie ON tendances(categorie);
```

## 📚 Wiki - Guide Complet

Accédez à la documentation complète via `wiki/wiki.html` :

### Index des Pages

| Page | Description | URL |
| ---- | ----------- | --- |
| 🏠 **Wiki Hub** | Page d'accueil avec recherche | `wiki/wiki.html` |
| 🔄 **Architecture** | Diagramme interactif SVG | `wiki/project-connections.html` |
| 📋 **Composants** | Documentation détaillée | `wiki/project-details.html` |
| 📁 **API** | Référence complète REST | `wiki/api-reference.html` |
| 🗄️ **Database** | Schéma PostgreSQL | `wiki/database.html` |
| ⚙️ **Scripts** | 30+ scripts documentés | `wiki/scripts.html` |
| 📝 **Changelog** | Historique versions | `wiki/changelog.html` |
| 🔧 **Troubleshooting** | Guide dépannage | `wiki/troubleshooting.html` |
| 🚀 **Installation** | Setup complet | `wiki/installation.html` |
| ⭐ **Best Practices** | Conventions code | `wiki/best-practices.html` |
| 📖 **Glossary** | Terminologie A-Z | `wiki/glossary.html` |
| ☁️ **Deployment** | Guide production | `wiki/deployment.html` |
| 🌐 **Frontend** | Structure assets | `wiki/frontend.html` |
| 🔁 **Workflows** | Processus détaillés | `wiki/workflows.html` |

### Fonctionnalités Wiki

- ✅ **Recherche en temps réel** : Filtrage instantané des cartes et pages
- ✅ **Navigation sticky** : Barre de navigation toujours accessible
- ✅ **Design cohérent** : Thème violet gradient (#667eea → #764ba2)
- ✅ **Responsive** : Adapté mobile/tablette/desktop
- ✅ **Raccourcis clavier** : Ctrl/Cmd+K pour focus recherche
- ✅ **CSS externe** : wiki-styles.css pour maintenance facilitée

## 🌐 API

### Endpoints Produits

```javascript
// Récupérer tous les produits
GET /api/produits
// Filtres : ?categorie=xxx&top_du_mois=true

// Récupérer un produit par ID
GET /api/produits/:id

// Créer un nouveau produit (auto-incrémente l'ID)
POST /api/produits
Content-Type: application/json

// Modifier un produit (nécessite TOUS les champs)
PUT /api/produits/:id
Content-Type: application/json

// Supprimer un produit
DELETE /api/produits/:id
```

### Endpoints Fiches

```javascript
// Générer une fiche HTML pour un produit
POST /api/generate-fiche/:id
// Crée le fichier dans fiches/<categorie>/<slug>.html

// Prévisualiser une fiche
GET /api/preview-fiche/:id
// Essaie plusieurs chemins possibles

// Supprimer une fiche
DELETE /api/fiches/:id
// Supprime le fichier basé sur product.lien
```

### Endpoints Tendances

```javascript
// Récupérer les tendances d'une catégorie
GET /api/:categorie/actualites
GET /api/:categorie/technologies
GET /api/:categorie/marche
GET /api/:categorie/insights
GET /api/:categorie/predictions

// CRUD tendances génériques
GET /api/tendances
POST /api/tendances
PUT /api/tendances/:id
DELETE /api/tendances/:id
```

### Endpoint Configuration LLM

```javascript
// Configuration modèle IA
GET /api/llm-config
// Retourne: { model, gpt5Enabled, gpt5Rollout }
```

### Exemples de requêtes

```javascript
// Récupérer produits top du mois
fetch('http://localhost:3000/api/produits?top_du_mois=true')
  .then(res => res.json())
  .then(data => console.log(data));

// Créer un produit
fetch('http://localhost:3000/api/produits', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nom: 'Nouveau Produit',
    prix: '999.99€',
    categorie: 'smartphone',
    description: 'Description détaillée',
    image: 'produit.jpg',
    fonctionnalites_avancees: ['Feature 1', 'Feature 2'],
    donnees_fiche: { section1: 'Contenu 1', section2: 'Contenu 2' }
  })
});

// Générer une fiche
fetch('http://localhost:3000/api/generate-fiche/prod_50', { method: 'POST' })
  .then(res => res.json())
  .then(data => console.log('Fiche générée:', data.lien));
```

## ⚙️ Scripts

Le projet inclut 30+ scripts pour automatiser les tâches courantes :

### Scripts de génération

```bash
# Ajouter les 12 produits de décembre
node scripts/add-new-products.js

# Générer toutes les nouvelles fiches (via API)
node scripts/generate-all-new-fiches.js

# Générer fiches directement depuis DB
node scripts/generate-new-products.js

# Régénérer toutes les fiches
node scripts/regenerate-all-fiches.js

# Régénérer uniquement les "top du mois"
node scripts/regenerate-fiches-top.js
```

### Scripts de maintenance

```bash
# Vérifier l'état de la base de données
node scripts/verify-database-state.js

# Marquer les produits "top du mois" décembre
node scripts/set-top-decembre.js

# Vérifier les schémas de données
node scripts/check-schemas.js

# Vérifier un produit spécifique
node scripts/check-prod50.js

# Check rapide
node quick-check.js
```

### Scripts de normalisation

```bash
# Normaliser par catégorie
node scripts/normalize-camera.js
node scripts/normalize-smartphone.js
node scripts/normalize-drone.js
node scripts/normalize-casque-vr.js
node scripts/normalize-ecran-tv.js
node scripts/normalize-montre-connectee.js
node scripts/normalize-tablette.js
node scripts/normalize-video-projecteur.js
node scripts/normalize-remaining-categories.js
```

### Scripts de nettoyage

```bash
# Nettoyer les données de fiche
node scripts/clean-donnees-fiche.js

# Nettoyer les prix
node scripts/clean-prices.js

# Corriger les descriptions dupliquées
node scripts/fix-generic-descriptions.js

# Corriger les incohérences
psql -U postgres -d gamer_2025 -f scripts/fix-database-inconsistencies.sql
```

## 🗂️ Pages Tendances par Catégorie

Chaque page `tendances-[categorie].html` affiche dynamiquement :

- Actualités
- Technologies
- Données de marché
- Insights
- Prédictions

Les données sont récupérées via les endpoints `/api/[categorie]/...` et affichées automatiquement.

**Exemple d’URL :**

`/tendances-video-projecteur.html` → `/api/video-projecteur/actualites`, etc.

**Exemple de structure HTML :**

```html
<h1>Tendances Vidéo Projecteur 2025</h1>
<div class="tendances-nav">
   <button data-section="actualites">Actualités</button>
   <button data-section="technologies">Technologies</button>
   <button data-section="marche">Marché</button>
   <button data-section="predictions">Prédictions</button>
</div>
```

## 🗃️ Schéma relationnel simplifié

- `categories` (id, nom)
- `actualites` (id, titre, description, image, date_publication, tags, categorie_id)
- `technologies` (id, nom, description, icone, taux_adoption, categorie_id)
- `marche` (id, label, valeur, icone, tendance, categorie_id)
- `insights` (id, titre, description, icone, categorie_id)
- `predictions` (id, titre, description, annee, probabilite, icone, categorie_id)
- `produits` (id, nom, ...)

## 🛡️ Bonnes pratiques

- Toujours insérer au moins 4 entrées par section pour chaque catégorie pour un affichage optimal.
- Si le champ `icone` est vide, une icône par défaut est affichée côté JS.
- Les pages tendances sont générées dynamiquement et consomment l’API REST.

## 🤝 Contribution aux tendances

Pour ajouter une nouvelle catégorie ou de nouvelles tendances :

1. Ajouter la catégorie dans la table `categories`
2. Insérer les données dans les tables `actualites`, `technologies`, `marche`, `insights`, `predictions` avec le bon `categorie_id`
3. Créer la page `tendances-[categorie].html` dans `frontend/public/`

```javascript
// Récupérer tous les produits
GET /api/produits
// Filtres : ?categorie=xxx&search=xxx&top_du_mois=true

// Récupérer un produit par ID
GET /api/produits/:id

// Créer un nouveau produit
POST /api/produits
Content-Type: multipart/form-data

// Modifier un produit
PUT /api/produits/:id
Content-Type: multipart/form-data

// Supprimer un produit
DELETE /api/produits/:id

// Upload d'image
POST /api/upload
Content-Type: multipart/form-data

// Récupérer les catégories
GET /api/categories
```

### Exemple de requête SQL

## 📊 Initialisation des données tendances

Pour chaque catégorie, il est possible d'insérer rapidement 4 actualités, 4 technologies, 4 données marché, 4 insights et 4 prédictions via des scripts SQL. Cela permet d'avoir un affichage complet sur toutes les pages tendances dès l'installation.

Exemple :

```sql
INSERT INTO actualites (titre, description, image, date_publication, tags, categorie_id) VALUES
('Epson lance l’EH-LS12000B', 'Un projecteur laser 4K ultra lumineux pour le home cinéma.', 'epson-eh-ls12000b.jpg', '2025-09-12', '{Epson,laser,4K}', 16),
('Valerion Vision Master Pro 2', 'Le projecteur portable le plus compact avec batterie intégrée.', 'valerion-vision-master-pro-2.jpg', '2025-08-20', '{Valerion,portable,batterie}', 16),
('Xiaomi Mi Smart Projector 3', 'Un projecteur intelligent avec Android TV intégré.', 'xiaomi-mi-smart-projector-3.jpg', '2025-07-10', '{Xiaomi,Android TV,smart}', 16),
('Sony VPL-XW7000ES', 'Sony repousse les limites de la projection 8K pour les salles premium.', 'sony-vpl-xw7000es.jpg', '2025-06-25', '{Sony,8K,premium}', 16);
```

```javascript
// Recherche avec filtres
const query = `
  SELECT * FROM produits 
  WHERE 
    ($1::text IS NULL OR categorie ILIKE $1) 
    AND ($2::text IS NULL OR nom ILIKE $2 OR description ILIKE $2)
    AND ($3::boolean IS NULL OR top_du_mois = $3)
  ORDER BY created_at DESC
  LIMIT $4 OFFSET $5
`;

const values = [
  categorie ? `%${categorie}%` : null,
  search ? `%${search}%` : null,
  top_du_mois || null,
  limit || 50,
  offset || 0
];
```

## 💻 Utilisation

### Démarrage

```bash
# Démarrer PostgreSQL
sudo service postgresql start

# Démarrer le serveur Node.js
cd backend
npm start

# Ou en mode développement
npm run dev
```

### Accès

- **Frontend** : `http://localhost:3000`
- **Admin** : `http://localhost:3000/Gestion des produits et génération automatique.html`
- **API** : `http://localhost:3000/api`

## 🔧 Scripts utiles

```bash
# Sauvegarde de la base
pg_dump -U votre_utilisateur site_gamer_2025 > backup.sql

# Restauration
psql -U votre_utilisateur site_gamer_2025 < backup.sql

# Logs PostgreSQL
tail -f /var/log/postgresql/postgresql-13-main.log

# Connexion directe
psql -U votre_utilisateur -d site_gamer_2025
```

## 🎯 Avantages PostgreSQL

✅ **Performance** : Requêtes complexes optimisées  
✅ **Fiabilité** : ACID compliance  
✅ **Évolutivité** : Support millions d'enregistrements  
✅ **Types avancés** : Arrays, JSON, UUID...  
✅ **Recherche** : Full-text search intégré  
✅ **Sauvegarde** : Système de backup robuste  

## Interface d'administration

### Fonctionnalités principales

- **Dashboard moderne** : Interface claire avec onglets
- **Gestion CRUD** : Création, lecture, modification, suppression
- **Upload avancé** : Drag & drop avec prévisualisation
- **Validation** : Contrôles en temps réel
- **Messages** : Feedback utilisateur instantané
- **Responsive** : Compatible tous écrans

### Classes principales

```javascript
// Gestion moderne des uploads
class ModernImageUpload {
  constructor(prefix)
  setupEventListeners()
  handleFiles(files)
  createPreview(file)
  removePreview()
}

// Fonctions principales
createProduct(event)     // Création produit
editProduct(id)         // Modification produit
deleteProduct(id)       // Suppression produit
displayProducts()       // Affichage liste
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Version actuelle : 2.2.0** | **Dernière mise à jour : 26 Décembre 2025**

### 🚀 Projet en Chiffres

PostgreSQL optimisée • 61+ produits • 15 pages Wiki • 30+ scripts

### 📈 Prochaines Évolutions

- **Janvier 2026** : Système de recherche full-text dans le wiki
- **v2.3.0 - Janvier 2026** :
  - Intégration GPT-5 pour descriptions enrichies
  - API d'authentification et gestion utilisateurs
  - Dashboard d'administration web amélioré
- **v3.0.0 - Février 2026** :
  - Migration vers Next.js/React
  - API GraphQL en complément REST
  - Cache Redis pour performances
  - CDN pour assets et images
  - Tests automatisés (Jest/Vitest)
  - CI/CD avec GitHub Actions
- **Futures améliorations** :
  - Système de notation et avis utilisateurs
  - Comparateur de produits interactif
  - Alertes prix et disponibilité
  - Application mobile (React Native)

### 🔗 Liens Utiles

- **📚 Wiki Documentation** : [Documentation complète](<http://localhost:3000/wiki/wiki.html>)
- **🔧 Interface Admin** : [Gestion produits](<http://localhost:3000/Gestion%20des%20produits%20et%20génération%20automatique.html>)
- **📁 API Reference** : [Endpoints](<http://localhost:3000/wiki/api-reference.html>)
- **🗄️ Database Schema** : [PostgreSQL](<http://localhost:3000/wiki/database.html>)
- **⚙️ Scripts Docs** : [30+ scripts](<http://localhost:3000/wiki/scripts.html>)
- **📝 Changelog** : [Versions](<http://localhost:3000/wiki/changelog.html>)
- **🔧 Troubleshooting** : [Dépannage](<http://localhost:3000/wiki/troubleshooting.html>)

### 📊 Statistiques Projet

| Métrique | Valeur |
| -------- | ------- |
| **Produits** | 61+ enrichis |
| **Catégories** | 16 standardisées |
| **Pages Wiki** | 15 interactives |
| **Scripts** | 30+ automatisés |
| **Endpoints API** | 20+ REST |
| **Images** | 300+ optimisées |
| **Top du mois** | 4 produits |

### 🎯 Points Forts

✅ **Documentation exhaustive** : Wiki de 15 pages avec recherche en temps réel  
✅ **Architecture claire** : Diagramme interactif SVG montrant tous les composants  
✅ **Scripts automatisés** : Génération, normalisation, vérification complète  
✅ **API REST complète** : CRUD sur produits, fiches, tendances  
✅ **Base PostgreSQL** : Schéma robuste avec JSONB et arrays  
✅ **Interface moderne** : Design gradient violet responsive  
✅ **Maintenance facile** : CSS externe unifié, code documenté, best practices  

---

**Développé avec ❤️ pour les gamers** | [📚 Wiki](http://localhost:3000/wiki/wiki.html) | [📝 Changelog](http://localhost:3000/wiki/changelog.html) | [🔧 Troubleshooting](http://localhost:3000/wiki/troubleshooting.html)
