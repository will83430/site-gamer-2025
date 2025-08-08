# Site Gamer 2025 🎮

Site web dédié à l'exploration des équipements technologiques modernes : informatique, audiovisuel, communication et éducation.

## 📋 Vue d'ensemble

Ce projet présente un catalogue de **47 produits** répartis dans **15 catégories** avec :

- Fiches détaillées pour chaque produit
- Système de navigation par catégories
- Sélection mensuelle des produits vedettes
- Interface responsive et moderne

## 🏗️ Structure du projet

```texte
site-gamer-2025/
├── frontend/public/
│   ├── assets/           # CSS, JS, images
│   ├── data/            # Données JSON
│   ├── fiches-produits/ # Catalogue par catégorie
│   ├── index.html       # Page d'accueil
│   ├── top-du-mois.html # Sélection mensuelle
│   └── fiches.html      # Navigation produits
└── README.md
```

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript Vanilla
- **Données** : JSON statique
- **Style** : CSS Grid/Flexbox + animations
- **Architecture** : Site statique multi-pages

## 🚀 Démarrage rapide

### Option 1 : Ouverture directe

```bash
# Cloner le dépôt
git clone [votre-repo]
cd site-gamer-2025

# Ouvrir dans le navigateur
open frontend/public/index.html
```

### Option 2 : Serveur local

```bash
# Avec Python
cd frontend/public
python -m http.server 8000

# Avec Node.js
npx serve frontend/public

# Accès : http://localhost:8000
```

## 📱 Catégories disponibles

- **Gaming** : PC Gaming, Consoles, Casques VR
- **Audio/Vidéo** : Casques audio, Caméras, Vidéoprojecteurs
- **Mobile** : Smartphones, Tablettes, Montres connectées
- **Pro/Éducation** : Tableaux interactifs, Imprimantes 3D, Serveurs
- **Accessoires** : Périphériques, Drones

## ✨ Fonctionnalités

### Navigation

- **Page d'accueil** : Introduction et navigation principale
- **Top du mois** : Produits vedettes avec badges animés
- **Fiches produits** : Catalogue filtrable par catégorie

### Système de fiches

- Comparaison de produits (sélection multiple)
- Images avec lightbox
- Informations détaillées (prix, specs, fonctionnalités)
- Liens vers fiches complètes

### Interface utilisateur

- Design responsive (mobile/desktop)
- Animations CSS fluides
- Gestion d'erreurs robuste
- Chargement optimisé des données

## 📁 Fichiers clés

| Fichier | Description |
|---------|-------------|
| `data/equipements.json` | Base de données des produits |
| `assets/js/utils.js` | Utilitaires partagés |
| `assets/js/fiches.js` | Logique des fiches produits |
| `assets/css/styles.css` | Styles principaux |

## 🔧 Développement

### Structure des données

```json
{
  "nom": "Nom du produit",
  "categorie": "CATEGORIE",
  "prix": "À partir de X €",
  "description": "Description courte",
  "top_du_mois": true/false,
  "image": "chemin/vers/image.png",
  "lien": "chemin/vers/fiche.html"
}
```

### Ajout d'un produit

1. Ajouter l'entrée dans `data/equipements.json`
2. Créer la fiche HTML dans le dossier catégorie approprié
3. Ajouter l'image dans `assets/images/`

### Fonctionnalités JavaScript

- **Cache des données** : Chargement unique du JSON
- **Gestion d'erreurs** : Fallbacks et messages utilisateur
- **Optimisations** : Debouncing, lazy loading
- **Utils** : Fonctions réutilisables (formatage, navigation)

## 📱 Responsive

Le site s'adapte automatiquement :

- **Desktop** : Grilles multi-colonnes
- **Tablette** : Colonnes réduites
- **Mobile** : Vue en colonne unique

## 🎨 Personnalisation

### Couleurs (CSS Variables)

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6a00b3;
  --background-dark: rgba(0, 0, 0, 0.8);
  --text-light: #fdf8f8;
}
```

### Thème

- Arrière-plan : Dégradé violet/bleu
- Typographie : Manrope + Montserrat
- Animations : Transitions fluides 0.3s

## 📜 Licence

CC0 1.0 Universal - Domaine public

## 🛟 Support

Pour le développement local, ouvrir la console navigateur pour les logs détaillés :

- ✅ Messages de succès
- ⚠️ Avertissements
- ❌ Erreurs avec détails
  