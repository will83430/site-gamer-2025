# ⚡ HIGH-TECH 2026

> Site comparateur gaming & high-tech avec design futuriste et interface d'administration complète.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

---

## 🚀 Démarrage Rapide

### Option 1 : Docker (recommandé)

```bash
# 1. Installer Docker Desktop (https://www.docker.com/products/docker-desktop/)
# 2. Lancer le site
docker compose up

# 3. Accéder au site
# 🌐 http://localhost:3000
# 🔧 http://localhost:3000/2026/admin.html (mot de passe : Admin2026!)
```

### Option 2 : Installation manuelle

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gamer_2025
DB_USER=votre_user
DB_PASSWORD=votre_password

# 3. Lancer le serveur
node server-2026.js

# 4. Accéder au site
# 🌐 http://localhost:3000/2026/
# 🔧 http://localhost:3000/2026/admin.html
```

---

## 📁 Structure du Projet

```text
site-gamer-2025/
├── 🌐 frontend/public/2026/     # Pages du site
│   ├── index.html               # Accueil
│   ├── produits.html            # Catalogue
│   ├── fiche.html               # Fiche produit
│   ├── recherche.html           # Recherche globale
│   ├── comparatif.html          # Comparateur
│   ├── tendances.html           # Articles
│   ├── article.html             # Article détaillé
│   ├── wiki.html                # Wiki technique
│   └── admin.html               # Administration
│
├── ⚙️ backend/
│   ├── routes/                  # API REST
│   ├── config/database.js       # PostgreSQL
│   └── middleware/              # Middlewares
│
├── 🐳 docker-compose.yml        # Installation Docker
├── 🐳 Dockerfile                # Build de l'app
├── 📦 init.sql                  # Données initiales BDD
│
└── 🖥️ server-2026.js            # Serveur Express
```

---

## 🎨 Pages Frontend

| Page | URL | Description |
| ------ | ----- | ------------- |
| 🏠 **Accueil** | `/2026/` | Hero, annonces, produits vedettes |
| 📦 **Produits** | `/2026/produits.html` | Catalogue avec filtres |
| 📄 **Fiche** | `/2026/fiche.html?produit=xxx` | Détails produit |
| 🔍 **Recherche** | `/2026/recherche.html` | Recherche globale |
| ⚖️ **Comparatif** | `/2026/comparatif.html` | Compare jusqu'à 4 produits |
| 📰 **Tendances** | `/2026/tendances.html` | Articles par catégorie |
| 📝 **Article** | `/2026/article.html?id=X` | Article complet |
| 📚 **Wiki** | `/2026/wiki.html` | Documentation technique |

---

## 🔧 Dashboard Admin

### 📦 Gestion des Produits

| Colonne | Description |
| --------- | ------------- |
| ⭐ **Vedette** | Badge TOP affiché sur le produit (illimité) |
| 🏠 **Accueil** | Affichage sur la page d'accueil (max 4) |

**Fonctionnalités :**

- ✅ CRUD complet (créer, modifier, supprimer)
- ✅ Upload image drag & drop
- ✅ Champs spécifiques par catégorie
- ✅ Aperçu fiche en temps réel

### 📰 Gestion des Articles

- ✅ Articles avec sections modulaires
- ✅ Réorganisation par drag (⬆️⬇️)
- ✅ Tags, statut Hot 🔥
- ✅ Filtres par catégorie

### 📢 Annonces

- ✅ Bannières d'annonce avec icône, titre, lien personnalisables
- ✅ Vue calendrier avec programmation par dates
- ✅ Templates rapides (nouveau produit, promo, alerte stock, info)
- ✅ Prévisualisation en temps réel
- ✅ Actions groupées (activer, désactiver, supprimer en masse)
- ✅ Réorganisation par drag & drop

### 🗂️ Gestion des Catégories

- ✅ CRUD complet depuis le panneau admin
- ✅ Slug auto-généré
- ✅ Icône et description personnalisables

---

## 🔌 API REST

### Produits

```http
GET    /api/produits                    # Liste tous
GET    /api/produits/:id                # Un produit
POST   /api/produits                    # Créer
PUT    /api/produits/:id                # Modifier
DELETE /api/produits/:id                # Supprimer
PATCH  /api/produits/:id/featured       # Toggle ⭐ vedette
GET    /api/produits/homepage/list      # Produits 🏠 accueil
PATCH  /api/produits/:id/homepage       # Toggle 🏠 accueil
```

### Articles

```http
GET    /api/actualites                  # Liste tous
GET    /api/actualites/:id              # Un article
POST   /api/actualites                  # Créer
PUT    /api/actualites/:id              # Modifier
DELETE /api/actualites/:id              # Supprimer
POST   /api/actualites/reorder          # Réorganiser
```

### Sections d'Articles

```http
GET    /api/fiche-tendance/data/:id     # Article + sections
POST   /api/fiche-tendance/sections     # Créer section
PUT    /api/fiche-tendance/sections/:id # Modifier section
DELETE /api/fiche-tendance/sections/:id # Supprimer section
```

### Catégories

```http
GET    /api/categories                  # Liste toutes
GET    /api/categories/:id              # Une catégorie
POST   /api/categories                  # Créer
PUT    /api/categories/:id              # Modifier
DELETE /api/categories/:id              # Supprimer
GET    /api/categories/:slug/produits   # Produits d'une catégorie
```

### Annonces

```http
GET    /api/announcements               # Annonces actives
GET    /api/announcements/admin/all     # Toutes (admin)
GET    /api/announcements/:id           # Une annonce
POST   /api/announcements               # Créer
PUT    /api/announcements/:id           # Modifier
DELETE /api/announcements/:id           # Supprimer
```

### Autres

```http
GET    /api/stats/homepage              # Statistiques accueil
GET    /api/wiki                        # Pages wiki
GET    /api/activity-logs               # Logs d'activité
GET    /api/technologies                # Technologies
GET    /api/insights                    # Insights marché
GET    /api/predictions                 # Prédictions
```

---

## 🗄️ Base de Données

### Table `produits`

```sql
CREATE TABLE produits (
    id VARCHAR(20) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prix VARCHAR(50),
    categorie VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    top_du_mois BOOLEAN DEFAULT FALSE,      -- ⭐ Vedette
    affiche_accueil BOOLEAN DEFAULT FALSE,  -- 🏠 Accueil
    titre_affiche VARCHAR(255),
    fonctionnalites_avancees TEXT[],
    donnees_fiche JSONB
);
```

### Table `actualites`

```sql
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
```

### Table `announcements`

```sql
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255),
    description TEXT,
    icone VARCHAR(50),
    type VARCHAR(50) DEFAULT 'info',
    actif BOOLEAN DEFAULT TRUE,
    lien TEXT,
    bouton_texte VARCHAR(100),
    date_debut TIMESTAMP,
    date_fin TIMESTAMP,
    ordre INT DEFAULT 0
);
```

---

## 🏷️ Catégories Disponibles

| Catégorie | Icône |
| ----------- | ------- |
| Smartphones | 📱 |
| PC Gaming | 🖥️ |
| Consoles | 🎮 |
| Casques VR | 🥽 |
| Drones | 🚁 |
| Montres Connectées | ⌚ |
| Caméras | 📷 |
| Casques Audio | 🎧 |
| Écrans & TV | 📺 |
| Tablettes | 📱 |
| Périphériques | ⌨️ |
| Imprimantes 3D | 🖨️ |
| Box Internet | 📡 |
| Serveurs | 🖲️ |
| Vidéoprojecteurs | 🎬 |
| Tableaux Interactifs | 📊 |

---

## ✨ Fonctionnalités Clés

- 🎨 **Design futuriste** - Thème sombre avec accents néon
- 📱 **Responsive** - Adapté mobile/tablette/desktop
- ⚡ **Performance** - Chargement dynamique depuis API
- 🔍 **Recherche globale** - Produits et articles en temps réel
- ⚖️ **Comparateur** - Jusqu'à 4 produits + export PDF
- 📊 **Admin complet** - Gestion intuitive des contenus
- 📅 **Calendrier annonces** - Programmation et prévisualisation
- 📚 **Wiki technique** - Documentation intégrée
- 🐳 **Docker ready** - Installation en une commande
- 🔒 **Sécurité** - Helmet, rate limiting, validation des entrées

---

## 🐳 Déploiement Docker

Le projet inclut un package d'installation autonome (`site-gamer-install/`) qui contient tout le nécessaire :

```text
site-gamer-install/
├── app/                  # Code source complet
│   ├── Dockerfile        # Build Node.js
│   └── .dockerignore
├── init.sql              # Dump complet de la BDD
├── docker-compose.yml    # Orchestre app + PostgreSQL
├── lancer.sh             # Script de lancement Linux/Mac
├── lancer.bat            # Script de lancement Windows
└── README.txt            # Instructions
```

**Compatible :** Linux, macOS, Windows (via Docker Desktop)

---

## 🛠️ Technologies

| Stack | Version |
| ------- | --------- |
| Node.js | 18+ |
| Express.js | 4.x |
| PostgreSQL | 14+ |
| HTML/CSS/JS | ES6+ |
| Docker | 20+ |

---

## 📊 État du Projet

| Métrique | Valeur |
| ---------- | -------- |
| Produits | ~107 |
| Articles | ~118 |
| Catégories | 16 |
| Pages frontend | 9 |
| Endpoints API | 30+ |

---

**Version** : Redesign 2026 | **Port** : 3000 | **Auteur** : Genin Wilfried
