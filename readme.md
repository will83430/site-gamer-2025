# Site Gamer 2025

Site web de présentation d'équipements technologiques avec système de fiches produits et connexion PostgreSQL.

## 🎯 Fonctionnalités principales

- **Catalogue produits** : Base de données PostgreSQL
- **Page fiches** : Navigation par catégories
- **Dashboard admin** : Gestion complète des produits
- **Design responsive** : Compatible mobile et desktop

## 📁 Structure du projet

```
site-gamer-2025/
├── frontend/public/
│   ├── assets/          
│   │   ├── images/      # Images produits
│   │   ├── categories/  # Images catégories  
│   │   ├── css/         # Styles CSS
│   │   └── js/          # Scripts JavaScript
│   │       ├── fiches.js
│   │       ├── fiche-produit.js
│   │       └── utils.js
│   ├── pages/
│   │   └── fiches.html  # Page principale des fiches
│   ├── fiches-produits/ # Fiches HTML générées (legacy)
│   ├── index.html       # Page d'accueil
│   └── admin.html       # Dashboard admin
├── fiches/              # Fiches produits organisées par catégorie
│   ├── drone/
│   ├── console/
│   ├── tablette/
│   └── ...
├── server.js            # Serveur Node.js avec PostgreSQL
├── package.json         # Dépendances Node.js
└── README.md
```

## 🚀 Installation rapide

### 1. Cloner le projet
```bash
git clone [votre-repo]
cd site-gamer-2025
```

### 2. Installation des dépendances (si utilisation du serveur)
```bash
npm install
```

### 3. Lancer le projet

**Avec serveur Node.js et PostgreSQL**
```bash
# Lancer le serveur
node server.js

# Le site sera accessible sur
http://localhost:3000
```

### 4. Pages principales
- Page d'accueil : `http://localhost:3000`
- Page fiches : `http://localhost:3000/frontend/public/pages/fiches.html`
- Dashboard admin : `http://localhost:3000/admin.html`

## ⚙️ Configuration

### Base de données PostgreSQL

Configurez vos identifiants dans `server.js` :

```javascript
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'votre_mot_de_passe',
  port: 5432,
});
```

## 📊 Format des données

Structure dans PostgreSQL (table `produits`) :

```sql
CREATE TABLE produits (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  categorie VARCHAR(100),
  prix VARCHAR(50),
  description TEXT,
  image VARCHAR(500),
  image_data TEXT, -- Pour base64
  lien VARCHAR(500),
  top_du_mois BOOLEAN DEFAULT false,
  fonctionnalites_avancees TEXT[],
  donnees_fiche TEXT[]
);
```

## 🛠️ Développement

### Fichiers principaux

- `server.js` : Serveur Node.js avec API PostgreSQL
- `admin.html` : Dashboard administrateur
- `pages/fiches.html` : Page principale des fiches produits
- `assets/js/fiches.js` : Logique de la page fiches
- `assets/js/fiche-produit.js` : Logique des fiches individuelles
- `assets/css/styles.css` : Styles principaux

### Ajouter une catégorie

1. Créer le dossier dans `/fiches/nouvelle-categorie/`
2. Ajouter les produits dans PostgreSQL via l'admin
3. Générer les fiches HTML depuis le dashboard

### API Endpoints (avec serveur)

- `GET /api/produits` : Liste tous les produits
- `GET /api/produits/:id` : Détails d'un produit
- `POST /api/produits` : Créer un produit
- `PUT /api/produits/:id` : Modifier un produit
- `DELETE /api/produits/:id` : Supprimer un produit

## 📦 Sauvegarde

### PostgreSQL
- Export via pgAdmin : Click droit sur la base > Backup
- En ligne de commande : `pg_dump -U postgres -d postgres > backup.sql`
- Restauration : `psql -U postgres -d postgres < backup.sql`

## 🚀 Déploiement

### Production avec serveur Node.js
```bash
# Installation des dépendances
npm install

# Lancer avec PM2 (recommandé)
npm install -g pm2
pm2 start server.js --name site-gamer

# Ou avec Node directement
node server.js
```

### Hébergeurs compatibles
- Heroku (avec add-on PostgreSQL)
- Railway
- Render
- VPS avec Node.js et PostgreSQL

## 🔧 Dépannage

### Le serveur ne démarre pas
- Vérifier PostgreSQL est lancé
- Vérifier les identifiants dans `server.js`
- Port 3000 disponible

### Les images ne s'affichent pas
- Vérifier les chemins dans la base de données
- Les images doivent être dans `/frontend/public/assets/images/`

### Erreur CORS
- Le serveur inclut déjà les headers CORS
- En local, utiliser `localhost` et non `127.0.0.1`

## 📄 Licence

MIT

---

*Projet Site Gamer 2025*