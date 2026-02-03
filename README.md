# HIGH-TECH 2026 - Site Comparateur Gaming & Tech

Un site web moderne de comparaison de produits gaming et high-tech avec interface d'administration complète, base de données PostgreSQL et design futuriste 2026.

## Aperçu du Redesign 2026

Le projet a été entièrement redesigné en 2026 avec :
- **Nouveau design futuriste** : Thème sombre avec accents néon jaune/vert
- **Pages dynamiques** : Chargement des données depuis l'API PostgreSQL
- **Dashboard admin complet** : Gestion produits, articles, annonces
- **Serveur dédié** : `server-2026.js` sur port 3000

## Structure du Projet 2026

```
site-gamer-2025/
├── frontend/public/2026/          # Pages redesign 2026
│   ├── index.html                 # Accueil avec annonces et top produits
│   ├── produits.html              # Catalogue produits avec filtres
│   ├── fiche.html                 # Fiche produit dynamique (?produit=nom)
│   ├── tendances.html             # Articles/tendances par catégorie
│   ├── article.html               # Article détaillé avec sections (?id=X)
│   ├── comparatif.html            # Comparateur jusqu'à 4 produits
│   ├── admin.html                 # Dashboard administration complet
│   └── 404.html                   # Page erreur 404
├── frontend/public/assets/
│   ├── css/                       # Styles (style.css, admin-styles.css)
│   ├── js/                        # Scripts (theme-toggle.js, etc.)
│   └── images/                    # Images produits (300+ fichiers)
├── backend/
│   ├── routes/                    # Routes API modulaires
│   │   ├── produits.js            # CRUD produits
│   │   ├── tendances.js           # CRUD articles/actualités
│   │   ├── categories.js          # Catégories
│   │   ├── announcements.js       # Annonces
│   │   ├── fichesTendances.js     # Sections articles
│   │   └── ...
│   ├── config/
│   │   └── database.js            # Pool PostgreSQL
│   └── middleware/
│       └── errorHandler.js        # Gestion erreurs
├── server-2026.js                 # Serveur Express dédié 2026
└── package.json
```

## Démarrage Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base de données (.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamer_2025
DB_USER=votre_user
DB_PASSWORD=votre_password

# 3. Démarrer le serveur 2026
node server-2026.js

# 4. Accéder au site
# Frontend : http://localhost:3000/2026/
# Admin    : http://localhost:3000/2026/admin.html
```

## Pages Frontend 2026

### Accueil (`/2026/index.html`)
- Bannière hero avec titre animé
- Section annonces dynamiques (depuis API)
- Top produits du mois
- Navigation vers catégories

### Catalogue Produits (`/2026/produits.html`)
- Grille de produits responsive
- Filtres par catégorie
- Recherche en temps réel
- Bouton "Voir la fiche" et "Comparer"

### Fiche Produit (`/2026/fiche.html?produit=nom-produit`)
- Chargement dynamique depuis l'API
- Image, prix, description
- Fonctionnalités avancées
- Données de fiche par catégorie (specs, connectivité, etc.)

### Tendances (`/2026/tendances.html?categorie=xxx`)
- Articles/actualités par catégorie
- Cards avec image, titre, description
- Lien vers article détaillé

### Article (`/2026/article.html?id=X`)
- Contenu complet avec sections
- Chaque section = titre + contenu détaillé
- Tags, date, catégorie

### Comparatif (`/2026/comparatif.html`)
- Comparaison jusqu'à 4 produits
- Tableau comparatif des specs
- Design gaming néon

## Dashboard Admin (`/2026/admin.html`)

Interface d'administration complète avec :

### Gestion des Produits
- **Liste** : Tableau avec image, nom, catégorie, prix, statut
- **Créer/Modifier** : Formulaire complet avec :
  - Nom, catégorie, prix, description
  - Image (drag & drop)
  - Top du mois (Oui/Non)
  - Fonctionnalités avancées (liste)
  - Titre affiché (auto-généré)
  - **Données de fiche par catégorie** : Champs spécifiques selon la catégorie (ex: DRONE → Vidéo/photo, Connectivité, Accessoires, etc.)
- **Aperçu** : Bouton "Voir la fiche" ouvre la page dynamique
- **Supprimer** : Avec confirmation

### Gestion des Articles
- **Liste** : Tableau avec image, titre, catégorie, date, statut
- **Filtres** : Par catégorie avec noms formatés
- **Ordre** : Réorganisation par catégorie (⬆️⬇️) - visible uniquement quand une catégorie est filtrée
- **Créer/Modifier** : Formulaire complet avec :
  - Titre, catégorie, date publication
  - Description courte (affichée sur la card)
  - Image, URL vidéo
  - Tags (séparés par virgules)
  - Hot 🔥 (Oui/Non)
  - **Sections** : Contenu détaillé de l'article
    - Ajouter/Modifier/Supprimer sections
    - Chaque section = Titre + Contenu
    - Réorganisation (⬆️⬇️)
- **Aperçu** : Bouton "Voir" ouvre article.html?id=X
- **Supprimer** : Avec confirmation

### Gestion des Annonces
- Liste des annonces actives
- Créer/Modifier avec icône, type, titre, description, lien

### Dashboard Stats
- Nombre total de produits
- Nombre d'articles
- Nombre de catégories
- Produits "Top du mois"

## API REST

### Produits
```
GET    /api/produits              # Liste tous les produits
GET    /api/produits/:id          # Un produit par ID
POST   /api/produits              # Créer un produit
PUT    /api/produits/:id          # Modifier un produit
DELETE /api/produits/:id          # Supprimer un produit
```

### Articles (Actualités)
```
GET    /api/actualites            # Tous les articles
GET    /api/actualites/:id        # Un article par ID
POST   /api/actualites            # Créer un article
PUT    /api/actualites/:id        # Modifier un article
DELETE /api/actualites/:id        # Supprimer un article
POST   /api/actualites/swap       # Échanger l'ordre de 2 articles
POST   /api/actualites/reorder    # Réorganiser plusieurs articles
```

### Sections d'Articles
```
GET    /api/fiche-tendance/data/:id     # Article avec ses sections
POST   /api/fiche-tendance/sections     # Créer une section
PUT    /api/fiche-tendance/sections/:id # Modifier une section
DELETE /api/fiche-tendance/sections/:id # Supprimer une section
```

### Autres
```
GET    /api/categories            # Liste des catégories
GET    /api/announcements         # Liste des annonces
POST   /api/announcements         # Créer une annonce
GET    /api/stats                 # Statistiques globales
```

## Catégories Disponibles

| Catégorie | Champs spécifiques fiche |
|-----------|-------------------------|
| DRONE | Vidéo/photo, Connectivité, Expérience, Garantie, Accessoires |
| CONSOLE | Écran, Contrôleurs, Connectivité, Expérience jeu, Garantie, Contenu boîte |
| TABLETTE | Écran, Accessoires, Connectivité, Applications, Autonomie, Garantie, Contenu boîte |
| SMARTPHONE | Appareil photo, Connectivité, Expérience, Autonomie, Garantie, Contenu boîte |
| PC GAMING | Performances, Connectivité, Expérience, Gestion thermique, Garantie, Accessoires |
| SERVEUR | Performances, Connectivité réseau, Gestion, Sécurité, Garantie |
| CASQUE AUDIO | Fonctions audio, Connectivité, Confort, Autonomie, Garantie, Contenu boîte |
| MONTRE CONNECTEE | Sport/santé, Connectivité, Applications, Autonomie, Garantie |
| CAMERA | Vidéo/photo, Connectivité, Expérience, Autonomie, Garantie, Accessoires |
| PERIPHERIQUES | Fonctions avancées, Connectivité, Expérience, Autonomie, Garantie, Contenu boîte |
| CASQUE VR | Contrôleurs, Connectivité, Expérience immersive, Garantie |
| IMPRIMANTE 3D | Fonctions impression, Connectivité, Expérience, Garantie |
| ECRAN TV | Écran, Connectivité, Expérience, Garantie |
| VIDEO PROJECTEUR | Fonctions vidéo, Connectivité, Expérience, Garantie |
| BOX INTERNET | Connectivité, Expérience, Garantie |
| TABLEAU INTERACTIF | Écran, Accessoires, Connectivité, Expérience, Autonomie, Garantie, Contenu boîte |

## Base de Données PostgreSQL

### Tables Principales

```sql
-- Produits
CREATE TABLE produits (
    id VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prix VARCHAR(50),
    categorie VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    top_du_mois BOOLEAN DEFAULT FALSE,
    titre_affiche VARCHAR(255),
    fonctionnalites_avancees TEXT[],
    donnees_fiche JSONB
);

-- Articles/Actualités
CREATE TABLE actualites (
    id SERIAL PRIMARY KEY,
    titre TEXT,
    description TEXT,
    image VARCHAR(255),
    video_url TEXT,
    date_publication DATE,
    tags TEXT[],
    hot BOOLEAN DEFAULT FALSE,
    categorie_id INT REFERENCES categories(id),
    ordre INT
);

-- Sections d'articles
CREATE TABLE actualites_sections (
    id SERIAL PRIMARY KEY,
    actualite_id INT REFERENCES actualites(id) ON DELETE CASCADE,
    titre TEXT,
    contenu TEXT,
    ordre INT
);

-- Catégories
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100)
);

-- Annonces
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    icone VARCHAR(10),
    type VARCHAR(50),
    titre TEXT,
    description TEXT,
    lien TEXT,
    texte_bouton VARCHAR(100),
    actif BOOLEAN DEFAULT TRUE
);
```

## Technologies Utilisées

- **Frontend** : HTML5, CSS3 (variables, grid, flexbox), JavaScript ES6+
- **Backend** : Node.js 18+, Express.js
- **Base de données** : PostgreSQL 14+ (JSONB, arrays)
- **Design** : Thème sombre, accents néon (#d4ff00, #00ff88)

## Scripts Utiles

```bash
# Démarrer le serveur 2026
node server-2026.js

# Démarrer l'ancien serveur (si besoin)
node server.js

# Vérifier la base de données
node scripts/verify-database-state.js
```

## Flux de Travail

### Créer un nouveau produit
1. Aller sur `/2026/admin.html`
2. Section "Produits" → "+ Nouveau Produit"
3. Remplir le formulaire (nom, catégorie, prix, etc.)
4. Sélectionner une catégorie → champs spécifiques apparaissent
5. Remplir les données de fiche
6. Enregistrer
7. Le produit apparaît sur `/2026/produits.html`
8. Sa fiche est accessible via `/2026/fiche.html?produit=nom-produit`

### Créer un nouvel article
1. Aller sur `/2026/admin.html`
2. Section "Articles" → "+ Nouvel Article"
3. Remplir le formulaire (titre, catégorie, description, etc.)
4. Enregistrer l'article
5. Rouvrir l'article (bouton ✏️) pour ajouter des sections
6. Ajouter les sections (titre + contenu détaillé)
7. Enregistrer
8. L'article apparaît sur `/2026/tendances.html?categorie=xxx`
9. Le détail est accessible via `/2026/article.html?id=X`

### Réorganiser les articles d'une catégorie
1. Section "Articles"
2. Filtrer par catégorie (dropdown)
3. Utiliser les boutons ⬆️⬇️ pour réordonner
4. L'ordre est sauvegardé automatiquement

---

**Version** : Redesign 2026 | **Serveur** : `server-2026.js` | **Port** : 3000
