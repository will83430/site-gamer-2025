# 📅 TEMPLATE DE MISE À JOUR MENSUELLE - Site Gamer 2025

> **Document de référence pour les mises à jour mensuelles du contenu du site**

## 📋 Vue d'ensemble

Ce document décrit le processus complet pour mettre à jour le site avec du nouveau contenu chaque mois.

---

## 🎯 Composants à mettre à jour

### 1. **Nouveaux Produits** (12 produits minimum)

**Table :** `produits`  
**Prochain ID :** Vérifier le dernier `prod_XX` en base  
**Répartition suggérée :** 1-2 produits par catégorie phare

#### Structure d'un produit

```javascript
{
  id: 'prod_XX',                    // Auto-incrémenté
  nom: 'slug-produit-mois',         // Slug URL-friendly
  categorie: 'CATEGORIE',           // EN MAJUSCULES
  prix: 'XXX.XX €',                 // Format exact
  description: 'Description courte (1-2 phrases)',
  image: 'nom-image.jpg',           // Nom fichier uniquement
  lien: 'fiches/categorie-slug/produit-slug.html',
  titre_affiche: 'Nom Commercial',  // Nom affiché
  top_du_mois: true/false,          // 3-4 produits minimum en true
  fonctionnalites_avancees: [       // Array de strings
    'Spec 1',
    'Spec 2',
    // ... 10-15 fonctionnalités
  ],
  donnees_fiche: [                  // Array structuré
    '📝 Description détaillée\n- Points\n- Caractéristiques',
    '💰 Prix\nPrix : XX €',
    '🧩 Spécifications matérielles\n- CPU\n- RAM\n- Stockage',
    '🎮 Performances\n- Performance 1\n- Performance 2',
    '🌐 Connectivité\n- WiFi\n- Bluetooth\n- Ports',
    '🎮 Expérience utilisateur\n- Interface\n- Ergonomie',
    '🛡️ Garantie et support\n- Garantie\n- Support'
  ]
}
```

---

### 2. **Contenu Éditorial par Catégorie**

Pour **chaque catégorie** (16 total), mettre à jour 5 types de contenu :

#### A. Actualités (`actualites`)

**Quantité :** 3-5 par catégorie
**Total estimé :** 48-80 actualités

```javascript
{
  titre: 'Titre accrocheur',
  description: 'Description détaillée (200-300 mots)',
  image: 'nom-image.jpg',
  video_url: 'https://youtube.com/embed/... (optionnel)',
  date_publication: 'YYYY-MM-DD',
  tags: ['tag1', 'tag2', 'tag3'],
  hot: true/false,
  categorie_id: XX,              // ID de la catégorie (1-16)
  lien: 'url-externe (optionnel)',
  ordre: XX
}
```

#### B. Technologies (`technologies`)

**Quantité :** 3-4 par catégorie
**Total estimé :** 48-64 technologies

```javascript
{
  nom: 'Nom de la technologie',
  description: 'Description technique complète',
  icone: 'chip',                 // Nom d'icône (chip, ai, cloud, etc.)
  taux_adoption: 75,             // Pourcentage 0-100
  categorie_id: XX,              // ID de la catégorie (1-16)
  ordre: XX
}
```

#### C. Marché (`marche`)

**Quantité :** 3-4 par catégorie
**Total estimé :** 48-64 entrées

```javascript
{
  label: 'Marché Europe 2026',   // Label descriptif
  valeur: '5.2 Mds €',           // Valeur formatée (string)
  tendance: 'up',                // up/down/stable
  icone: 'euro',                 // Nom d'icône
  categorie_id: XX,              // ID de la catégorie (1-16)
  ordre: XX
}
```

#### D. Insights (`insights`)

**Quantité :** 2-3 par catégorie
**Total estimé :** 32-48 insights

```javascript
{
  titre: 'Titre de l\'analyse',
  description: 'Analyse approfondie (300-500 mots)',
  icone: 'chart',                // Nom d'icône
  categorie_id: XX,              // ID de la catégorie (1-16)
  ordre: XX
}
```

#### E. Prédictions (`predictions`)

**Quantité :** 4-5 par catégorie
**Total estimé :** 64-80 prédictions

```javascript
{
  annee: 2026,                   // Année de la prédiction
  titre: 'Titre de la prédiction',
  description: 'Description détaillée',
  icone: 'eye',                  // Nom d'icône
  probabilite: 75,               // Pourcentage 0-100
  categorie_id: XX,              // ID de la catégorie (1-16)
  ordre: XX
}
```

---

### 3. **Tendances Globales** (`tendances`)

**Quantité :** 10-15 articles transversaux

```javascript
{
  titre: 'Titre de la tendance',
  description: 'Analyse cross-catégorie (400-600 mots)',
  categorie: 'Tendances',
  tags: ['tag1', 'tag2', 'tag3'],
  created_at: 'YYYY-MM-DD'
}
```

---

## 🗂️ Catégories et IDs

| ID | Catégorie | Slug | Priorité |
|----|-----------|------|----------|
| 1 | PC Gaming | pc-gaming | ⭐⭐⭐ |
| 2 | Drone | drone | ⭐⭐ |
| 3 | Smartphone | smartphone | ⭐⭐⭐ |
| 4 | Console | console | ⭐⭐⭐ |
| 5 | Tablette | tablette | ⭐⭐ |
| 6 | Casque Audio | casque-audio | ⭐⭐ |
| 7 | Montre Connectée | montre-connectee | ⭐⭐ |
| 8 | Serveur | serveur | ⭐ |
| 9 | Box Internet | box-internet | ⭐ |
| 10 | Caméra | camera | ⭐⭐ |
| 11 | Casque VR | casque-vr | ⭐⭐⭐ |
| 12 | Écran TV | ecran-tv | ⭐⭐ |
| 13 | Imprimante 3D | imprimante-3d | ⭐ |
| 14 | Périphériques | peripheriques | ⭐⭐ |
| 15 | Tableau Interactif | tableau-interactif | ⭐ |
| 16 | Vidéo Projecteur | video-projecteur | ⭐ |

---

## 📝 Processus de mise à jour

### Étape 1 : Préparation (J-7)

1. **Identifier les nouveautés du mois**
   - Suivre actualités tech (CES, MWC, annonces constructeurs)
   - Identifier produits phares à ajouter
   - Compiler tendances sectorielles

2. **Vérifier la base de données**
   ```bash
   node scripts/maintenance/verify-database-state.js
   ```

3. **Déterminer les IDs produits**
   - Trouver le dernier `prod_XX` en base
   - Planifier `prod_XX+1` à `prod_XX+12`

### Étape 2 : Création du contenu (J-5 à J-3)

1. **Rédiger les 12 fiches produits**
   - Focus sur innovations du mois
   - Specs techniques complètes
   - Prix et disponibilité

2. **Créer le contenu éditorial**
   - Actualités récentes par catégorie
   - Technologies émergentes
   - Données de marché actualisées
   - Insights sectoriels
   - Prédictions à jour

3. **Rédiger les tendances globales**
   - Analyses transversales
   - Prospective sectorielle

### Étape 3 : Création des scripts (J-2)

1. **Script produits**
   ```
   scripts/products/add-[mois]-2026-products.js
   ```

2. **Script contenu éditorial**
   ```
   scripts/content/add-[mois]-2026-content.js
   ```

3. **Script tendances**
   ```
   scripts/tendances/add-[mois]-2026-tendances.js
   ```

### Étape 4 : Tests (J-1)

1. **Tester en environnement de dev**
   ```bash
   node scripts/products/add-[mois]-2026-products.js
   node scripts/content/add-[mois]-2026-content.js
   node scripts/tendances/add-[mois]-2026-tendances.js
   ```

2. **Vérifier l'intégrité**
   ```bash
   node scripts/maintenance/verify-database-state.js
   ```

3. **Générer les fiches**
   ```bash
   node scripts/fiches/quick-regenerate-fiches.js
   ```

### Étape 5 : Déploiement (J-Day)

1. **Backup de la base**
   ```bash
   pg_dump gamer_2025 > backup-[date].sql
   ```

2. **Exécuter les scripts en production**

3. **Régénérer toutes les fiches**
   ```bash
   node scripts/maintenance/regenerate-all-fiches.js
   ```

4. **Vérification finale**
   - Tester navigation site
   - Vérifier pages tendances
   - Contrôler images et liens

---

## ✅ Checklist de mise à jour

### Avant le déploiement

- [ ] 12 nouveaux produits rédigés
- [ ] 51-85 actualités créées (3-5 par catégorie)
- [ ] 51-68 technologies identifiées (3-4 par catégorie)
- [ ] 51-68 données marché collectées (3-4 par catégorie)
- [ ] 34-51 insights rédigés (2-3 par catégorie)
- [ ] 68-85 prédictions formulées (4-5 par catégorie)
- [ ] 10-15 tendances globales écrites
- [ ] 3-4 produits marqués `top_du_mois: true`
- [ ] Slugs et liens vérifiés
- [ ] Images préparées (nom uniquement, pas de chemin)
- [ ] Dates du mois cohérentes
- [ ] Scripts testés en dev

### Après le déploiement

- [ ] Produits visibles sur la page d'accueil
- [ ] Fiches HTML générées correctement
- [ ] Pages tendances à jour
- [ ] Images affichées correctement
- [ ] Liens fonctionnels
- [ ] SEO vérifié
- [ ] Performance testée
- [ ] Backup créé

---

## 📚 EXEMPLES DE CONTENU PAR CATÉGORIE

Cette section fournit des exemples concrets de contenu pour chaque catégorie, prêts à être adaptés et utilisés.

### Catégorie 1 : PC Gaming

**Actualité exemple :**
```javascript
{
  titre: 'NVIDIA GeForce RTX 5090 : benchmark record en 8K',
  description: 'La nouvelle GeForce RTX 5090 de NVIDIA pulvérise tous les records de performance en gaming 8K. Équipée de 32 Go de GDDR7 et de la nouvelle architecture Blackwell, la carte affiche des performances 70% supérieures à la RTX 4090 tout en consommant seulement 450W. Les premiers tests en ray tracing montrent des gains impressionnants grâce aux nouveaux RT Cores de 5ème génération.',
  image: 'rtx-5090-benchmark.jpg',
  video_url: 'https://youtube.com/embed/example1',
  date_publication: '2026-01-05',
  tags: ['nvidia', 'rtx5090', 'benchmark', '8k'],
  hot: true,
  categorie_id: 1,
  lien: null,
  ordre: 1
}
```

**Technologie exemple :**
```javascript
{
  nom: 'DLSS 4.0 Multi-Frame Generation',
  description: 'La technologie DLSS 4.0 de NVIDIA génère désormais jusqu\'à 3 frames interpolées pour chaque frame rendue, permettant de multiplier par 4 le framerate effectif.',
  icone: 'chip',
  taux_adoption: 45,
  categorie_id: 1,
  ordre: 1
}
```

**Marché exemple :**
```javascript
{
  label: 'Marché PC Gaming Europe',
  valeur: '8.7 Mds €',
  tendance: 'up',
  icone: 'euro',
  categorie_id: 1,
  ordre: 1
}
```

**Insight exemple :**
```javascript
{
  titre: 'L\'ère du gaming 8K est arrivée',
  description: 'Avec les RTX 5090 et les technologies DLSS 4.0, le gaming en 8K natif devient enfin accessible. Les moniteurs 8K gaming se démocratisent avec des prix passant sous la barre des 2000€.',
  icone: 'chart',
  categorie_id: 1,
  ordre: 1
}
```

**Prédiction exemple :**
```javascript
{
  annee: 2026,
  titre: 'GPU avec 48 Go de VRAM standard',
  description: 'Les GPU gaming haut de gamme embarqueront 48 Go de GDDR7 pour supporter les textures 8K et les assets IA.',
  icone: 'chip',
  probabilite: 85,
  categorie_id: 1,
  ordre: 1
}
```

---

### Catégorie 3 : Smartphone

**Actualité exemple :**
```javascript
{
  titre: 'Samsung Galaxy S26 Ultra : capteur 400 MP et IA on-device',
  description: 'Samsung révolutionne la photo mobile avec un capteur de 400 MP utilisant le pixel binning 16-en-1. Le Galaxy AI 3.0 fonctionne entièrement hors ligne grâce au NPU Exynos 2600.',
  image: 'galaxy-s26-ultra.jpg',
  video_url: 'https://youtube.com/embed/example3',
  date_publication: '2026-01-02',
  tags: ['samsung', 'galaxy', 's26', 'ultra'],
  hot: true,
  categorie_id: 3,
  lien: null,
  ordre: 1
}
```

**Technologie exemple :**
```javascript
{
  nom: 'LLM on-device',
  description: 'Les modèles de langage locaux (7-15B paramètres) fonctionnent en temps réel sur smartphone pour la vie privée.',
  icone: 'ai',
  taux_adoption: 55,
  categorie_id: 3,
  ordre: 1
}
```

---

### Catégorie 4 : Console

**Actualité exemple :**
```javascript
{
  titre: 'PlayStation 6 : annonce officielle et specs révélées',
  description: 'Sony lève le voile sur la PS6 : CPU AMD Zen 6 à 16 cœurs, GPU RDNA 5 capable de ray tracing en 8K, 32 Go de RAM GDDR7. Le SSD de 2 To atteint 25 Go/s. Rétrocompatibilité totale PS4/PS5.',
  image: 'ps6-reveal.jpg',
  video_url: 'https://youtube.com/embed/example4',
  date_publication: '2026-01-01',
  tags: ['playstation', 'ps6', 'sony', 'nextgen'],
  hot: true,
  categorie_id: 4,
  lien: null,
  ordre: 1
}
```

**Insight exemple :**
```javascript
{
  titre: 'Le cloud gaming intégré aux consoles',
  description: 'La frontière entre jeu local et cloud s\'estompe. PS6 et Xbox Series Y peuvent basculer automatiquement vers le cloud pour les jeux les plus exigeants.',
  icone: 'cloud',
  categorie_id: 4,
  ordre: 1
}
```

---

### Catégorie 10 : Caméra (Importante - manque d'insights en base)

**Actualité exemple :**
```javascript
{
  titre: 'Canon EOS R1 : le flagship mirrorless professionnel',
  description: 'Canon dévoile l\'EOS R1 avec capteur stacked CMOS de 30 MP, rafale 40 fps sans blackout, et AF Eye Tracking capable de suivre les sportifs en mouvement rapide.',
  image: 'canon-r1.jpg',
  video_url: null,
  date_publication: '2026-01-02',
  tags: ['canon', 'eosr1', 'mirrorless', 'pro'],
  hot: true,
  categorie_id: 10,
  lien: null,
  ordre: 1
}
```

**Insights exemples (à ajouter - catégorie sans insights) :**
```javascript
{
  titre: 'Photo ou vidéo : les hybrides excellent partout',
  description: 'La distinction entre appareils photo et caméras s\'efface. Les hybrides haut de gamme (Sony A7S IV, Canon R5 II) rivalisent avec les caméras cinéma pour la vidéo tout en excellant en photo.',
  icone: 'camera',
  categorie_id: 10,
  ordre: 1
},
{
  titre: 'IA dans le workflow photo',
  description: 'De la prise de vue (AF, exposition) à la post-production (denoising, upscaling), l\'IA transforme chaque étape du workflow photographique.',
  icone: 'ai',
  categorie_id: 10,
  ordre: 2
},
{
  titre: 'Marché stable mais premium en hausse',
  description: 'Les volumes stagnent mais le panier moyen augmente. Les photographes investissent dans du matériel haut de gamme plutôt que de renouveler fréquemment.',
  icone: 'chart',
  categorie_id: 10,
  ordre: 3
}
```

---

### Catégorie 11 : Casque VR

**Actualité exemple :**
```javascript
{
  titre: 'Apple Vision Pro 2 : plus léger et moins cher',
  description: 'Apple présente le Vision Pro 2 avec un poids réduit de 30% et un prix de 2499€. La puce M5 offre le rendu fovéal 16K et le passthrough parfait.',
  image: 'vision-pro-2.jpg',
  video_url: 'https://youtube.com/embed/example5',
  date_publication: '2026-01-01',
  tags: ['apple', 'visionpro', 'vr', 'ar'],
  hot: true,
  categorie_id: 11,
  lien: null,
  ordre: 1
}
```

**Prédiction exemple :**
```javascript
{
  annee: 2027,
  titre: 'Vision Pro sous 1500€',
  description: 'Apple lancera une version grand public du Vision Pro.',
  icone: 'apple',
  probabilite: 85,
  categorie_id: 11,
  ordre: 1
}
```

---

### Tendance globale exemple

```javascript
{
  titre: 'L\'IA générative transforme tous les secteurs tech',
  description: 'De l\'upscaling vidéo en temps réel aux PNJ intelligents, en passant par la génération de contenu et l\'aide à la création, l\'IA générative s\'infiltre dans tous les produits tech. Les NPU deviennent aussi importants que les CPU et GPU. Cette convergence redéfinit les critères d\'achat et les usages quotidiens des appareils électroniques.',
  categorie: 'Tendances',
  tags: ['ia', 'generative', 'npu', 'innovation'],
  created_at: '2026-01-01'
}
```

---

## 🎨 Sources d'inspiration

### Produits

- **Innovations 2026 :** IA générative, WiFi 7, HDMI 2.2, 8K, DDR6
- **Nouveaux modèles :** PS6, Xbox Series Y, RTX 60XX, Apple Vision Pro 2
- **Tendances :** Écologie, efficacité énergétique, recyclage
- **Tech immersive :** VR/AR/XR nouvelle génération

### Actualités

- **Événements :** CES, MWC, E3, Gamescom, IFA
- **Annonces constructeurs :** Apple, Samsung, Sony, Microsoft, NVIDIA
- **Acquisitions et partenariats**
- **Réglementations** (UE, USA, Chine)

### Technologies

- **IA :** GPT-5, génération d'images/vidéos, NPU
- **Connectivité :** 6G en préparation, WiFi 7, Bluetooth LE Audio
- **Affichage :** MicroLED, QD-OLED, 8K, 240Hz+
- **Puces :** 2nm, RISC-V, quantique

### Marché

- **Croissance post-pandémie**
- **Tensions géopolitiques** et supply chain
- **Adoption gaming** (cloud, mobile, PC)
- **Régions émergentes** (Afrique, Amérique latine)

### Tendances

- Cloud gaming et streaming (GeForce Now, Xbox Cloud, PlayStation Plus)
- Métavers et Web3
- Blockchain dans le gaming
- ESports et compétition
- Gaming mobile 5G
- Réalité mixte grand public

---

## 🔗 Ressources techniques

### Base de données

- **Host :** localhost (ou prod)
- **Database :** `gamer_2025`
- **User :** `postgres`
- **Password :** Variable `.env`

### Tables principales

- `produits` - Produits du catalogue
- `categories` - 17 catégories
- `actualites` - Actualités par catégorie
- `technologies` - Technologies émergentes
- `marche` - Données de marché
- `insights` - Analyses sectorielles
- `predictions` - Prédictions 2026-2030
- `tendances` - Tendances globales
- `actualites_sections` - Sections d'articles

### API Endpoints

- `GET /api/produits` - Liste produits
- `POST /api/produits` - Créer produit
- `PUT /api/produits/:id` - Modifier produit
- `DELETE /api/produits/:id` - Supprimer produit
- `GET /api/:categorie/actualites` - Actualités catégorie
- `POST /api/:categorie/actualites` - Créer actualité
- `POST /api/generate-fiche/:id` - Générer fiche HTML

### Scripts utiles

- `scripts/maintenance/verify-database-state.js` - Vérifier intégrité
- `scripts/maintenance/regenerate-all-fiches.js` - Régénérer toutes les fiches
- `scripts/fiches/quick-regenerate-fiches.js` - Régénération rapide
- `scripts/products/set-top-decembre.js` - Exemple toggle top_du_mois

---

## 📊 Métriques de succès

- ✅ 100% des produits avec fiches HTML générées
- ✅ Toutes les catégories avec contenu frais
- ✅ 0 erreur de lien ou image manquante
- ✅ Temps de chargement pages < 2s
- ✅ Score Lighthouse > 90
- ✅ Backup base de données créé

---

## 📅 Calendrier type

| Jour | Action |
|------|--------|
| J-7 | Identification des nouveautés |
| J-6 | Veille tech et compilation sources |
| J-5 | Rédaction fiches produits (1-6) |
| J-4 | Rédaction fiches produits (7-12) |
| J-3 | Création contenu éditorial (catégories 1-9) |
| J-2 | Création contenu éditorial (catégories 10-17) + tendances |
| J-1 | Création scripts + tests en dev |
| J-Day | Déploiement production |
| J+1 | Monitoring et corrections si nécessaire |

---

## 🚨 Points d'attention

### Qualité du contenu

- ✅ Descriptions uniques (pas de copier-coller)
- ✅ Specs techniques vérifiées
- ✅ Prix à jour et réalistes
- ✅ Orthographe et grammaire irréprochables
- ✅ Ton cohérent avec le site

### Technique

- ✅ Slugs URL-friendly (minuscules, tirets)
- ✅ Images nommées sans espaces ni accents
- ✅ Pas de chemins absolus dans `image`
- ✅ Catégories en MAJUSCULES dans `produits`
- ✅ categorie_id corrects pour contenu éditorial
- ✅ Arrays PostgreSQL formatés `{a,b,c}` si nécessaire

### SEO

- ✅ Titres optimisés (50-60 caractères)
- ✅ Meta descriptions (150-160 caractères)
- ✅ Alt text sur toutes les images
- ✅ Structure H1 > H2 > H3 respectée
- ✅ Liens internes cohérents

---

## 📞 Support

En cas de problème :

1. Vérifier les logs : `logs/` directory
2. Tester requêtes SQL manuellement
3. Vérifier variables `.env`
4. Consulter documentation : `README.md`, wikis dans `frontend/public/wiki/`
5. Rollback si nécessaire : restaurer backup

---

**Version :** 1.0  
**Dernière mise à jour :** Janvier 2026  
**Prochaine révision :** Mars 2026
