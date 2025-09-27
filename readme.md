# 🎮 Site Gamer 2025 - Comparateur de Produits Gaming

Un site web moderne de comparaison et gestion de produits gaming avec interface d'administration complète et base de données PostgreSQL.

## 📋 Table des matières

- [Aperçu du projet](#-aperçu-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Configuration de la base de données](#️-configuration-de-la-base-de-données)
- [Utilisation](#-utilisation)
- [API](#-api)
- [Interface d'administration](#interface-dadministration)
- [Contribution](#-contribution)

## 🎯 Aperçu du projet

Site web professionnel dédié aux produits gaming permettant :

- Consultation et comparaison de produits
- Gestion administrative complète
- Interface utilisateur moderne et responsive
- Système de filtrage et recherche avancée
- **Base de données PostgreSQL** pour la persistance


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

## 🛠 Technologies utilisées

### Frontend

- **HTML5** - Structure sémantique
- **CSS3** - Styling moderne (Grid, Flexbox, animations)
- **JavaScript ES6+** - Logique interactive
- **Responsive Design** - Compatible tous écrans

### Backend

- **Node.js** - Serveur backend
- **Express.js** - Framework web
- **PostgreSQL** - Base de données relationnelle
- **pg** - Driver PostgreSQL pour Node.js
- **Multer** - Gestion upload fichiers

### Base de données

- **PostgreSQL 13+** - SGBD principal
- **pgAdmin** - Interface d'administration (optionnel)


## 📁 Structure du projet

```text
site-gamer-2025/
├── frontend/
│   └── public/
│       ├── assets/
│       │   ├── css/
│       │   │   ├── admin-styles.css     # Styles administration
│       │   │   ├── style.css            # Styles principaux
│       │   │   └── styles.min.css       # Styles minifiés
│       │   ├── images/                  # Images produits
│       │   └── js/
│       │       ├── admin-gestion-produits.js  # Logique admin
│       │       ├── fiches.min.js        # Logique fiches produits
│       │       └── script.js            # Scripts généraux
│       ├── fiches.html                 # Page catalogue produits
│       ├── index.html                  # Page d'accueil
│       ├── tendances-<categorie>.html  # Pages tendances dynamiques (ex : tendances-video-projecteur.html)
│       └── Gestion des produits et génération automatique.html  # Admin
└── backend/
    ├── server.js                       # Serveur Express
    ├── database/
    │   ├── config.js                   # Configuration PostgreSQL
    │   ├── schema.sql                  # Schéma base de données
    │   └── migrations/                 # Scripts de migration
    ├── routes/
    │   ├── produits.js                 # Routes API produits
    │   └── upload.js                   # Routes upload images
    ├── models/
    │   └── Produit.js                  # Modèle produit
    ├── package.json                    # Dépendances Node.js
    ├── .env                           # Variables d'environnement
    └── uploads/                        # Dossier uploads
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

3. **Installer les dépendances backend**

   ```bash
   cd backend
   npm install
   ```

4. **Configurer les variables d'environnement**

   ```bash
   cp .env.example .env
   # Éditer .env avec vos paramètres PostgreSQL
   ```

## 🗄️ Configuration de la base de données

### Variables d'environnement (.env)

```env
# Base de données PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=site_gamer_2025
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe

# Serveur
PORT=3000
NODE_ENV=development

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Initialisation de la base

1. **Créer la base de données**

   ```sql
   -- Connectez-vous à PostgreSQL
   psql -U postgres
   
   -- Créer la base
   CREATE DATABASE site_gamer_2025;
   CREATE USER votre_utilisateur WITH PASSWORD 'votre_mot_de_passe';
   GRANT ALL PRIVILEGES ON DATABASE site_gamer_2025 TO votre_utilisateur;
   ```

2. **Exécuter le schéma**

   ```bash
   psql -U votre_utilisateur -d site_gamer_2025 -f database/schema.sql
   ```

### Schéma de la base (database/schema.sql)

```sql
-- Table des produits
CREATE TABLE produits (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prix VARCHAR(50),
    categorie VARCHAR(100),
    description TEXT,
    image VARCHAR(255),
    fonctionnalites_avancees TEXT[], -- Array PostgreSQL
    top_du_mois BOOLEAN DEFAULT FALSE,
    titre_affiche VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les recherches
CREATE INDEX idx_produits_categorie ON produits(categorie);
CREATE INDEX idx_produits_nom ON produits(nom);
CREATE INDEX idx_produits_top ON produits(top_du_mois);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_produits_updated_at 
    BEFORE UPDATE ON produits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```


## 🌐 API




### Endpoints disponibles

// Récupérer les tendances d'une catégorie

GET /api/[categorie]/actualites
GET /api/[categorie]/technologies
GET /api/[categorie]/marche
GET /api/[categorie]/insights
GET /api/[categorie]/predictions

## 🗂️ Pages tendances par catégorie

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

**Version actuelle : 2.0.0** | **Dernière mise à jour : Septembre 2025**

**🚀 Migré vers PostgreSQL pour plus de performance et fiabilité !**
