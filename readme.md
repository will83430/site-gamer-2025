# Site Gamer 2025

Site web de présentation d'équipements technologiques avec dashboard d'administration intégré.

## 🎯 Fonctionnalités

- **Catalogue de produits** : 47 équipements dans 15 catégories
- **Dashboard admin** : Interface complète de gestion
- **Génération automatique** : Fiches produits HTML
- **Interface responsive** : Compatible mobile et desktop

## 📁 Structure

```
site-gamer-2025/
├── frontend/public/
│   ├── assets/          # Images et ressources
│   ├── css/            # Styles CSS
│   ├── js/             # Scripts JavaScript
│   ├── data/           # Données JSON
│   ├── fiches-produits/ # Pages produits générées
│   ├── index.html      # Page d'accueil
│   ├── admin.html      # Dashboard administrateur
│   └── top-du-mois.html # Vitrine produits
```

## 🚀 Démarrage rapide

### Prérequis
- Navigateur web moderne
- Serveur web local (optionnel)

### Installation locale

1. **Cloner le projet**
```bash
git clone [votre-repo]
cd site-gamer-2025
```

2. **Lancer le site**
```bash
# Option 1: Directement dans le navigateur
open frontend/public/index.html

# Option 2: Serveur local (recommandé)
# Avec Python
cd frontend/public
python -m http.server 8000

# Avec Node.js
npx serve frontend/public
```

3. **Accéder au dashboard admin**
```
http://localhost:8000/admin.html
```

## ⚙️ Utilisation

### Dashboard administrateur

Le dashboard (`admin.html`) permet de :
- **Gérer les produits** : Ajouter, modifier, supprimer
- **Organiser par catégories** : 15 catégories disponibles
- **Générer les fiches** : HTML automatique pour chaque produit
- **Statistiques** : Vue d'ensemble des données

### Ajout d'un produit

1. Ouvrir le dashboard admin
2. Aller dans "Ajouter Produit"
3. Remplir les informations :
   - Nom du produit *
   - Catégorie *
   - Prix
   - Description
   - Image (optionnel)
   - Spécifications techniques
4. Sauvegarder ou "Sauvegarder & Générer Fiche"

### Catégories disponibles

- PC Gaming, Console, Casque VR
- Smartphone, Tablette, Montre Connectée
- Casque Audio, Caméra, Écran TV
- Drone, Imprimante 3D, Serveur
- Périphériques, Vidéoprojecteur, Box Internet, Tableau Interactif

## 📝 Format des données

Les produits sont stockés en JSON (`data/equipements.json`) :

```json
{
  "nom": "Nom du produit",
  "categorie": "CATEGORIE",
  "prix": "999€",
  "description": "Description courte",
  "image": "assets/images/produit.png",
  "top_du_mois": false,
  "specifications": "Détails techniques",
  "fonctionnalites_avancees": ["Fonctionnalité 1", "Fonctionnalité 2"]
}
```

## 🔧 Génération automatique

### Fiches produits
- **Déclenchement** : Bouton "Générer Fiche" dans le dashboard
- **Emplacement** : `fiches-produits/[categorie]/[nom-produit].html`
- **Template** : Structure HTML standardisée avec CSS intégré

### Fichiers système
- **Sitemap** : `sitemap.xml` généré automatiquement
- **Robots.txt** : Configuration SEO

## 🛠️ Développement

### Fichiers principaux

- `admin.html` : Interface d'administration complète
- `js/home.js` : Logique page d'accueil
- `js/fiches.js` : Système de gestion des fiches
- `js/utils.js` : Fonctions utilitaires
- `css/style/style 4.css` : Styles principaux

### Ajout d'une nouvelle catégorie

1. Modifier le mapping dans `admin.html` :
```javascript
const categoryFolders = {
  'NOUVELLE_CATEGORIE': 'nouveau-dossier'
};
```

2. Créer le dossier correspondant :
```bash
mkdir fiches-produits/nouveau-dossier
```

### Customisation du template

Modifier la fonction `generateProductHTML()` dans `admin.html` pour personnaliser le template des fiches produits.

## 📦 Sauvegarde

- **Auto-sauvegarde** : LocalStorage du navigateur
- **Export manuel** : Bouton "Sauvegarder Données" dans le dashboard
- **Format** : Fichier JSON avec timestamp

## 🌐 Déploiement

### Site statique
Le projet est entièrement statique et peut être déployé sur :
- GitHub Pages
- Netlify
- Vercel
- Serveur web classique

### Workflow recommandé

1. **Développement** : Utilisation du dashboard admin en local
2. **Génération** : Création des fiches via l'interface
3. **Commit** : Versioning des fichiers générés
4. **Merge sur main** : Déploiement automatique

## 📄 Licence

Domaine public (CC0 1.0 Universal)

## 🤝 Contribution

Pour contribuer :
1. Utiliser le dashboard admin pour les modifications de contenu
2. Tester la génération des fiches avant commit
3. Vérifier la compatibilité mobile
4. Suivre la structure de dossiers existante

---

*Généré pour le projet Site Gamer 2025*