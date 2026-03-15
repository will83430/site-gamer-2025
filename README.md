# ⚡ HIGH-TECH 2026

> Site comparateur gaming & high-tech avec design futuriste et interface d'administration complète.

![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey?logo=express)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)

🌐 **Site en ligne : [guidehightech.org](https://guidehightech.org)**

---

## 🚀 Démarrage Rapide

### Option 1 : Docker (recommandé)

```bash
# 1. Installer Docker Desktop (https://www.docker.com/products/docker-desktop/)
# 2. Lancer le site
docker compose up

# 3. Accéder au site
# 🌐 http://localhost:3000
# 🔧 http://localhost:3000/2026/admin.html (mot de passe dans .env)
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
│   ├── comparatif.html          # Comparateur (jusqu'à 4 produits)
│   ├── versus.html              # Duel 2 produits avec verdict
│   ├── bons-plans.html          # Baisses de prix récentes
│   ├── evolution-prix.html      # Historique des prix (Chart.js)
│   ├── configurateur.html       # Budget builder par profil
│   ├── tendances.html           # Articles
│   ├── article.html             # Article détaillé
│   ├── guides.html              # Guides d'achat
│   ├── guide.html               # Guide détaillé
│   ├── timeline.html            # Frise chronologique
│   ├── wiki.html                # Wiki technique
│   ├── apropos.html             # À propos du site
│   ├── nouveautes.html          # Veille RSS (admin uniquement)
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
├── 🚀 deploy.sh                 # Script déploiement production
│
└── 🖥️ server-2026.js            # Serveur Express
```

---

## 🎨 Pages Frontend

| Page | URL | Description |
| ------ | ----- | ------------- |
| 🏠 **Accueil** | `/2026/` | Hero, annonces, produits vedettes |
| 📦 **Produits** | `/2026/produits.html` | Catalogue avec filtres |
| 📄 **Fiche** | `/2026/fiche.html?id=xxx` | Détails produit, specs, fonctionnalités |
| 🔍 **Recherche** | `/2026/recherche.html` | Recherche full-text (PostgreSQL) |
| ⚖️ **Comparatif** | `/2026/comparatif.html` | Compare jusqu'à 4 produits |
| ⚔️ **Versus** | `/2026/versus.html?id1=X&id2=Y` | Duel 2 produits avec verdict automatique |
| 💰 **Bons Plans** | `/2026/bons-plans.html` | Produits avec baisse de prix récente |
| 📈 **Évolution Prix** | `/2026/evolution-prix.html?id=X` | Historique des prix (Chart.js) |
| 🛠️ **Configurateur** | `/2026/configurateur.html` | Budget builder par profil usage |
| 📰 **Tendances** | `/2026/tendances.html` | Articles par catégorie |
| 📝 **Article** | `/2026/article.html?id=X` | Article complet |
| 📚 **Guides** | `/2026/guides.html` | Guides d'achat par catégorie |
| 🕐 **Timeline** | `/2026/timeline.html` | Frise chronologique des sorties |
| 📖 **Wiki** | `/2026/wiki.html` | Documentation technique |
| ℹ️ **À propos** | `/2026/apropos.html` | Présentation du site |

---

## 🔧 Dashboard Admin

### 📦 Gestion des Produits

| Colonne | Description |
| --------- | ------------- |
| ⭐ **Vedette** | Badge TOP affiché sur le produit |
| 🏠 **Accueil** | Affichage sur la page d'accueil (max 4) |
| 📅 **Prévu** | Badge violet pour produits fictifs/annoncés |

**Fonctionnalités :**

- ✅ CRUD complet (créer, modifier, supprimer)
- ✅ Upload image drag & drop
- ✅ Toggle actif/inactif
- ✅ Aperçu fiche en temps réel

### 📰 Gestion des Articles

- ✅ Articles avec sections modulaires
- ✅ Réorganisation par drag (⬆️⬇️)
- ✅ Tags, statut Hot 🔥
- ✅ Toggle actif/inactif

### 📢 Annonces

- ✅ Bannières avec icône, titre, lien personnalisables
- ✅ Vue calendrier avec programmation par dates
- ✅ Templates rapides (nouveau produit, promo, alerte stock, info)
- ✅ Actions groupées (activer, désactiver, supprimer en masse)

### 🆕 Veille Tech (Nouveautés RSS)

- ✅ Agrégation RSS depuis 5 sources (Les Numériques, 01net, Numerama, GSMArena, The Verge)
- ✅ Cache 30 minutes, rafraîchissement manuel
- ✅ Import en 1 clic → Nouveau Produit ou Nouvel Article

---

## 🔌 API REST

### Produits

```http
GET    /api/produits                    # Liste tous
GET    /api/produits/:id                # Un produit
POST   /api/produits                    # Créer
PUT    /api/produits/:id                # Modifier
DELETE /api/produits/:id                # Supprimer
PATCH  /api/produits/:id/featured       # Toggle vedette
PATCH  /api/produits/:id/homepage       # Toggle accueil
GET    /api/produits/search?q=&limit=   # Recherche full-text
```

### Articles

```http
GET    /api/actualites                  # Liste tous
GET    /api/actualites/:id              # Un article
POST   /api/actualites                  # Créer
PUT    /api/actualites/:id              # Modifier
DELETE /api/actualites/:id              # Supprimer
```

### Prix & Bons Plans

```http
GET    /api/bons-plans?days=N                  # Produits avec baisse de prix
GET    /api/price-evolution/produit/:id        # Historique des prix
POST   /api/price-evolution/scrape             # Scraper les prix
POST   /api/price-evolution/snapshot           # Snapshot manuel
```

### Autres

```http
GET    /api/categories                  # Catégories
GET    /api/announcements               # Annonces actives
GET    /api/nouveautes                  # Flux RSS agrégé
GET    /api/stats/homepage              # Statistiques accueil
GET    /api/guides                      # Guides d'achat
GET    /api/timeline                    # Événements timeline
GET    /api/wiki                        # Pages wiki
GET    /sitemap.xml                     # Sitemap dynamique SEO
```

---

## 🗄️ Base de Données

### Tables principales

```sql
produits        -- Catalogue produits (id VARCHAR, nom, prix, categorie...)
actualites      -- Articles (titre, description, sections, tags, hot...)
categories      -- Catégories (nom, slug, icone, description)
price_history   -- Historique des prix (produit_id, prix, prix_numerique, date)
announcements   -- Annonces/bannières (titre, type, dates, actif...)
actualites_sections -- Sections modulaires des articles
guides          -- Guides d'achat
wiki_pages      -- Documentation wiki
timeline_events -- Frise chronologique
site_stats      -- Compteurs (visites...)
```

---

## ✨ Fonctionnalités Clés

- 🎨 **Design futuriste** - Thème sombre avec accents néon
- 📱 **Responsive** - Adapté mobile/tablette/desktop
- ⚡ **Performance** - WebP, lazy loading, chargement dynamique API
- 🔍 **Recherche full-text** - PostgreSQL tsvector + index GIN
- ⚖️ **Comparateur** - Jusqu'à 4 produits
- ⚔️ **Versus / Duel** - Comparaison 2 produits avec verdict
- 💰 **Bons Plans** - Détection automatique des baisses de prix
- 📈 **Suivi des Prix** - Historique visuel avec Chart.js
- 🛠️ **Configurateur Budget** - Sélection par profil et budget
- 🆕 **Veille RSS** - Agrégation 5 sources tech
- 🗺️ **SEO** - Sitemap dynamique, JSON-LD, Open Graph
- 📊 **Google Analytics** - Suivi des visiteurs
- 🐳 **Docker ready** - Installation en une commande
- 🔒 **Sécurité** - Helmet, rate limiting, validation des entrées

---

## 🌐 Production

| Infra | Détail |
| ------- | ------- |
| Hébergeur | OVH VPS (Ubuntu 22.04) |
| IP | 162.19.230.51 |
| Domaine | guidehightech.org |
| Process manager | PM2 |
| Reverse proxy | Nginx |
| HTTPS | Let's Encrypt (renouvellement auto) |
| Analytics | Google Analytics G-ZYF9PK31GR |

### Déployer en production

```bash
./deploy.sh
# N  → sync fichiers uniquement + restart app
# o  → sync fichiers + sync BDD (préserve le compteur de visites)
```

Connexion VPS :

```bash
ssh ubuntu@162.19.230.51
```

---

## 🛠️ Technologies

| Stack | Version |
| ------- | --------- |
| Node.js | 20+ |
| Express.js | 4.x |
| PostgreSQL | 14+ |
| HTML/CSS/JS | ES6+ |
| Chart.js | 4.4.7 |
| Docker | 20+ |

---

## 📊 État du Projet

| Métrique | Valeur |
| ---------- | -------- |
| Produits | 113 (dont 5 fictifs/annoncés) |
| Articles | 119 |
| Catégories | 16 |
| Pages frontend | 20 |
| Images WebP | 259 |

---

**Version** : Redesign 2026 | **Port** : 3000 | **Auteur** : Genin Wilfried
