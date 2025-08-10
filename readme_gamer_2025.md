# 🎮 Site de Fiches Produits - Version 2025

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 📋 Description

Application web interactive permettant de naviguer dans un catalogue de produits organisés par catégories. Le site offre une interface moderne avec navigation fluide, système de comparaison de produits et design responsive.

## ✨ Fonctionnalités

### 🎯 Navigation par Catégories
- **Affichage des catégories** : Interface en grille avec blocs colorés centrés
- **Navigation sans rechargement** : Utilisation de l'History API pour une expérience fluide
- **URL dynamiques** : Support des paramètres GET (`?cat=categorie`)

### 🔍 Gestion des Produits
- **Affichage par catégorie** : Filtrage automatique des produits
- **Fiches détaillées** : Informations complètes (prix, description, image)
- **Badges spéciaux** : Indication des produits "Top du mois" ⭐
- **Images optimisées** : Gestion des erreurs avec placeholders SVG

### ⚖️ Système de Comparaison
- **Sélection multiple** : Checkboxes pour choisir les produits
- **Compteur dynamique** : Affichage en temps réel du nombre de produits sélectionnés
- **Comparaison détaillée** : Vue côte à côte des caractéristiques
- **Fonctionnalités avancées** : Support des listes de fonctionnalités

### 🎨 Interface Utilisateur
- **Design moderne** : Animations et transitions fluides
- **Responsive** : Adaptation automatique mobile/desktop
- **Messages informatifs** : Gestion d'erreurs avec style
- **Loader animé** : Indicateur de chargement

## 🏗️ Structure du Projet

```text
site-gamer-2025/
├── frontend/
│   └── public/
│       ├── assets/
│       │   ├── images/
│       │   │   └── bannière pour pied d.png
│       │   ├── categories/
│       │   │   └── [images-categories].jpg
│       │   └── js/
│       │       └── fiches.js
│       ├── data/
│       │   └── top-du-mois/
│       │       └── data/
│       │           └── equipements.json
│       └── pages/
│           └── fiches.html
├── README.md
└── .gitignore
```

## 🚀 Installation et Lancement

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Serveur web local (optionnel pour développement)

### Installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/votre-username/site-gamer-2025.git
   cd site-gamer-2025
   ```

2. **Lancer le site**
   - **Option 1 - Serveur local :**

     ```bash
     # Avec Python
     python -m http.server 8000

     # Avec Node.js
     npx serve
     ```

   - **Option 2 - Ouverture directe :**
     Ouvrir `frontend/public/pages/fiches.html` dans le navigateur

3. **Accéder au site**

   ```text
   http://localhost:8000/frontend/public/pages/fiches.html
   ```

## 📊 Format des Données

Le fichier `equipements.json` doit suivre cette structure :

```json
[
  {
    "nom": "Nom du produit",
    "categorie": "Catégorie",
    "prix": "Prix",
    "description": "Description du produit",
    "image": "URL de l'image",
    "lien": "URL de la fiche complète",
    "top_du_mois": true,
    "fonctionnalites_avancees": ["Fonctionnalité 1", "Fonctionnalité 2"]
  }
]
```

## 🎨 Personnalisation CSS

### Variables principales
```css
:root {
  --primary-color: #007bff;
  --secondary-color: lightblue;
  --text-color: #242424;
  --background-color: #1f2039;
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
```

### Classes utiles
- `.category-selector` : Style des blocs de catégories
- `.fiche-produit` : Style des cartes produits
- `.produit-checkbox` : Style des checkboxes de sélection
- `.btn-comparer` : Style du bouton de comparaison

## 🔧 Configuration

### Modifier les chemins
Dans `fiches.js`, adapter la configuration :

```javascript
const CONFIG = {
  JSON_PATH: 'chemin/vers/equipements.json',
  CATEGORY_IMAGE_PATH: 'chemin/vers/images/categories/',
  // ...
};
```

### Ajouter de nouvelles catégories
1. Ajouter les produits dans `equipements.json`
2. Placer l'image de catégorie dans `assets/categories/`
3. Respecter le format : `nom-categorie.jpg`

## 🐛 Résolution de Problèmes

### Problèmes courants

**Images ne s'affichent pas**
- Vérifier les chemins dans `CONFIG.CATEGORY_IMAGE_PATH`
- S'assurer que les images existent dans le dossier

**Données non chargées**
- Vérifier le chemin `CONFIG.JSON_PATH`
- Contrôler la validité du JSON avec un validateur

**Navigation ne fonctionne pas**
- Vérifier que JavaScript est activé
- Contrôler la console pour les erreurs

### Mode debug
Ouvrir les outils de développement (F12) et vérifier :
- Console pour les erreurs JavaScript
- Network pour les requêtes de fichiers
- Application > Local Storage pour le cache

## 🔒 Sécurité

- ✅ Protection XSS avec `sanitizeId()`
- ✅ Validation des données d'entrée
- ✅ Liens externes sécurisés (`rel="noopener noreferrer"`)
- ✅ Gestion d'erreurs pour éviter les crashes

## 📱 Compatibilité

### Navigateurs supportés

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### Résolutions testées

- 📱 Mobile : 320px - 768px
- 💻 Tablette : 768px - 1024px
- 🖥️ Desktop : 1024px+

## 🚧 Roadmap

### Version 2.1
- [ ] Système de favoris
- [ ] Recherche textuelle
- [ ] Filtres par prix
- [ ] Mode sombre/clair

### Version 2.2
- [ ] Panier d'achat
- [ ] Notifications push
- [ ] PWA (Progressive Web App)
- [ ] Offline support

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Développeur principal* - [VotreGitHub](https://github.com/votre-username)

## 🙏 Remerciements

- **Manrope Font** - Police utilisée pour l'interface
- **MDN Web Docs** - Documentation et bonnes pratiques
- **Community** - Retours et suggestions d'amélioration

---

<div align="center">
  
**⭐ N'hésitez pas à mettre une étoile si ce projet vous a aidé ! ⭐**

</div>