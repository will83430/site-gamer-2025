# Site Gamer 2025

## Description

Site web dédié à l'exploration des équipements technologiques modernes : informatique, audiovisuel, communication et éducation.

## Structure du projet

```texte
site-gamer-2025/
└── frontend/
    └── public/
        ├── assets/           # Ressources statiques
        │   ├── css/         # Feuilles de style
        │   ├── images/      # Images du site
        │   └── js/          # Scripts JavaScript
        ├── data/            # Données structurées
        └── fiches-produits/ # Catalogue produits
            ├── box-internet/
            ├── camera/
            ├── casque-audio/
            ├── casque-vr/
            ├── console/
            ├── drone/
            ├── ecran-tv/
            ├── imprimante-3d/
            ├── montre-connecte/
            ├── pc-gaming/
            ├── peripheriques/
            ├── serveur/
            ├── smartphone/
            ├── tableau-interactif/
            ├── tablette/
            └── video-projecteur/
```

## Catégories de produits

### Gaming & Divertissement

- Consoles de jeu
- PC Gaming
- Casques VR
- Écrans TV

### Audio & Vidéo

- Casques audio
- Caméras
- Vidéoprojecteurs

### Mobile & Connectivité

- Smartphones
- Tablettes
- Montres connectées
- Box internet

### Professionnel & Éducation

- Tableaux interactifs
- Imprimantes 3D
- Serveurs

### Accessoires

- Périphériques
- Drones

## Stack technique

**Frontend :** HTML5 / CSS3 / JavaScript Vanilla

- Site web statique avec navigation multi-pages
- Système de fiches produits dynamiques
- Interface responsive

**Structure des données :**

- `equipements.json` - Base de données des produits
- Scripts de génération automatique des fiches

**Scripts JavaScript :**

- `home.js` - Page d'accueil
- `fiches.js` - Système de fiches produits
- `top-du-mois.js` - Gestion du top mensuel
- `automatisation-fiches.js` - Génération automatique
- `utils.js` - Fonctions utilitaires

## Pages principales

- `index.html` - Accueil du site
- `fiches.html` - Catalogue des produits
- `top-du-mois.html` - Sélection mensuelle

## Contenu

Le site présente **47 produits** répartis dans 15 catégories avec :

- Fiches détaillées pour chaque produit
- Images haute qualité
- Système de navigation par catégories

## Installation

```bash
# Cloner le projet
git clone [votre-repo]

# Lancer un serveur local (optionnel)
# Avec Python 3
python -m http.server 8000

# Avec Node.js (si installé)
npx serve public

# Ou simplement ouvrir index.html dans votre navigateur
```

## Licence

Ce projet est sous licence CC0 1.0 Universal (domaine public).
