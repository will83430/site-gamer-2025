# 📝 Guide : Système de Sections des Articles Tendances

## Qu'est-ce qu'une section ?

Une **section** est un bloc de contenu structuré qui compose un article tendance. Chaque article contient **4 sections** qui organisent l'information de manière claire et cohérente.

### Exemple concret (Article NVIDIA RTX 5090) :

```
Section 1 : 🎮 Innovation majeure
Contenu : Présentation de la carte graphique, ses nouveautés...

Section 2 : ⚡ Puissance et performances  
Contenu : Benchmarks, comparaisons, gains de performance...

Section 3 : 🎯 Technologies embarquées
Contenu : Ray tracing, DLSS 4, technologies propriétaires...

Section 4 : 💰 Disponibilité et prix
Contenu : Date de sortie, prix, où l'acheter...
```

## Architecture Technique

### Base de données
Table : `actualites_sections`
```sql
- id (SERIAL PRIMARY KEY)
- actualite_id (INTEGER) -> FK vers actualites.id  
- titre (VARCHAR 200) -> Ex: "🎮 Innovation majeure"
- contenu (TEXT) -> Le texte complet de la section
- ordre (INTEGER) -> Position (1, 2, 3, 4)
- created_at, updated_at (TIMESTAMP)
```

### Chargement dynamique
1. **Fiche HTML minimale** : Contient juste `<body data-article-id="101">`
2. **JavaScript** (`fiche-tendance.js`) : Charge les données via API
3. **API** (`/api/fiche-tendance/data/:id`) : Retourne article + sections
4. **Affichage** : JavaScript injecte le contenu dans le DOM

## Avantages du système

✅ **Modification sans régénération** : Changez le contenu via l'admin, rechargez la page, c'est tout !
✅ **Uniformité** : Structure cohérente sur tous les articles (4 sections)
✅ **Flexibilité** : Chaque section a son titre et contenu personnalisés
✅ **Templates intelligents** : 16 modèles de sections par catégorie

## Statistiques actuelles (Janvier 2026)

- **77 articles** au total
- **308 sections** (77 × 4)
- **16 catégories** couvertes à 100%
- **Taux de complétion** : 100% (toutes les fiches ont 4 sections)

## Gestion dans le dashboard

### Via l'onglet "📝 Gérer les Sections"
1. Sélectionnez un article
2. Visualisez ses 4 sections
3. Cliquez "✏️ Modifier" pour éditer une section
4. Changez le titre ou le contenu
5. Sauvegardez → changement immédiat sur le site !

### Actions possibles
- ✏️ **Modifier** une section existante
- ➕ **Ajouter** une nouvelle section (si < 4)
- 🗑️ **Supprimer** une section
- 🔢 **Réorganiser** l'ordre des sections

## Workflow de création d'article

### Option 1 : Avec template automatique
1. Créer l'article via l'admin
2. Script `fill-all-articles.js` remplit automatiquement les 4 sections selon la catégorie
3. Générer la fiche HTML

### Option 2 : Manuel complet
1. Créer l'article via l'admin
2. Aller dans "📝 Gérer les Sections"
3. Ajouter manuellement les 4 sections avec titres émojis
4. Générer la fiche HTML

### Option 3 : Hybride (recommandé)
1. Créer l'article + template automatique
2. Personnaliser quelques sections via l'admin
3. Générer/régénérer la fiche si besoin

## Bonnes pratiques

### Titres de sections
- ✅ **Utilisez des émojis** : 🎮, ⚡, 🎯, 💰, 📱, 📸, etc.
- ✅ **Courts et percutants** : 3-5 mots max
- ✅ **Hiérarchie logique** : Innovation → Technique → Marché → Prix

### Contenu
- ✅ **Paragraphes aérés** : Utilisez `\n\n` pour les sauts de ligne
- ✅ **Mise en gras** : Utilisez `**texte**` pour les mots-clés
- ✅ **150-300 mots** par section (équilibré)
- ✅ **Informations factuelles** et dates précises

### Templates par catégorie

Les 16 catégories ont des templates pré-définis :
- **PC Gaming** : Innovation GPU, Performances, Technologies, Prix
- **Console** : Annonces officielles, Puissance, Catalogue, Disponibilité  
- **Smartphone** : Design écran, Photo/IA, Autonomie/charge, Tarifs
- **Drone** : Innovations techniques, Réglementation, Autonomie, Prix
- *(etc. pour les 12 autres catégories)*

## Maintenance

### Vérifier l'intégrité
```sql
-- Articles sans sections
SELECT a.id, a.titre, c.nom
FROM actualites a
LEFT JOIN categories c ON a.categorie_id = c.id
WHERE NOT EXISTS (
    SELECT 1 FROM actualites_sections WHERE actualite_id = a.id
);

-- Nombre de sections par article
SELECT actualite_id, COUNT(*) as nb_sections
FROM actualites_sections
GROUP BY actualite_id
HAVING COUNT(*) != 4;
```

### Régénérer les fiches
- **Une fiche** : Bouton "🚀 Générer" dans la liste
- **Une catégorie** : Onglet "⚡ Actions en Masse" → Régénérer par catégorie
- **Toutes (77)** : Bouton "🔄 Régénérer Toutes les Fiches"

## Évolutions futures possibles

- 🔮 Sections variables (3 à 6 sections selon article)
- 📊 Graphiques/charts intégrés dans sections
- 🎨 Mise en forme riche (listes à puces, tableaux)
- 🔗 Liens inter-articles automatiques
- 📷 Galeries d'images par section
- 🎥 Vidéos intégrées par section
- 🤖 Génération IA du contenu des sections

---

**Créé le** : 11 janvier 2026  
**Version** : 1.0  
**Auteur** : Admin Site Gamer 2025
