# ⚡ HIGH-TECH 2026

> Site comparateur gaming & high-tech avec design futuriste et interface d'administration complète.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)

---

## 🚀 Démarrage Rapide

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

```
site-gamer-2025/
├── 🌐 frontend/public/2026/     # Pages du site
│   ├── index.html               # Accueil
│   ├── produits.html            # Catalogue
│   ├── fiche.html               # Fiche produit
│   ├── recherche.html           # Recherche globale
│   ├── comparatif.html          # Comparateur
│   ├── tendances.html           # Articles
│   ├── article.html             # Article détaillé
│   └── admin.html               # Administration
│
├── ⚙️ backend/
│   ├── routes/                  # API REST
│   ├── config/database.js       # PostgreSQL
│   └── middleware/              # Middlewares
│
└── 🖥️ server-2026.js            # Serveur Express
```

---

## 🎨 Pages Frontend

| Page | URL | Description |
|------|-----|-------------|
| 🏠 **Accueil** | `/2026/` | Hero, annonces, produits vedettes |
| 📦 **Produits** | `/2026/produits.html` | Catalogue avec filtres |
| 📄 **Fiche** | `/2026/fiche.html?produit=xxx` | Détails produit |
| 🔍 **Recherche** | `/2026/recherche.html` | Recherche globale |
| ⚖️ **Comparatif** | `/2026/comparatif.html` | Compare jusqu'à 4 produits |
| 📰 **Tendances** | `/2026/tendances.html` | Articles par catégorie |
| 📝 **Article** | `/2026/article.html?id=X` | Article complet |

---

## 🔧 Dashboard Admin

### 📦 Gestion des Produits

| Colonne | Description |
|---------|-------------|
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

- ✅ Gestion des bannières d'annonce
- ✅ Icône, titre, lien personnalisables

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

### Autres

```http
GET    /api/categories                  # Catégories
GET    /api/announcements               # Annonces
GET    /api/stats                       # Statistiques
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

---

## 🏷️ Catégories Disponibles

| Catégorie | Icône |
|-----------|-------|
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
- 🔍 **Recherche** - Produits et articles en temps réel
- ⚖️ **Comparateur** - Jusqu'à 4 produits + export PDF
- 📊 **Admin complet** - Gestion intuitive des contenus

---

## 🛠️ Technologies

| Stack | Version |
|-------|---------|
| Node.js | 18+ |
| Express.js | 4.x |
| PostgreSQL | 14+ |
| HTML/CSS/JS | ES6+ |

---

**Version** : Redesign 2026 | **Port** : 3000

