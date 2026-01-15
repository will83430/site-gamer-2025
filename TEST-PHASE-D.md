# Test Phase D - TrendPage (Tendances)

## Statut : EN COURS - Problème CLS non résolu

## Démarrage

Les deux serveurs sont en cours d'exécution :
- **Express Backend** : http://localhost:3000
- **Vite Dev Server** : http://localhost:5173

## Page migrée

### TrendPage.vue
- **URL** : http://localhost:5173/tendances/:categorie
- **Exemple** : http://localhost:5173/tendances/drone
- **Fichier** : frontend/src/views/TrendPage.vue

## Fonctionnalités implémentées

### Navigation par onglets
- Actualités (section par défaut)
- Technologies
- Marché
- Prédictions
- Bouton Retour

### 16 catégories supportées
- drone, pc-gaming, smartphone, tablette, console, serveur
- casque-audio, casque-vr, montre-connectee, imprimante-3d
- ecran-tv, camera, peripheriques, video-projecteur
- box-internet, tableau-interactif

### APIs utilisées
- `/api/:categorie/actualites`
- `/api/:categorie/technologies`
- `/api/:categorie/marche`
- `/api/:categorie/insights`
- `/api/:categorie/predictions`

## Problème actuel : Layout Shift (CLS)

### Description
Quand on arrive sur la page ou qu'on change d'onglet, le **footer apparaît brièvement** avant que le contenu ne soit chargé, causant un **Layout Shift** visible (score CLS ~0.38).

### Ce qui a été tenté

1. **`v-if="!loading"` sur AppFooter**
   - Résultat : Amélioration minime (0.10)
   - Le footer disparaît mais le problème persiste

2. **Loading fullscreen initial (`isReady` computed)**
   - `<div v-if="!isReady" class="loading-fullscreen">`
   - Le contenu (header, nav, footer) s'affiche seulement quand les données sont prêtes
   - Résultat : Fonctionne au premier chargement mais pas au changement d'onglet

3. **`min-height: 60vh` sur `.container-tendances`**
   - Idée : Garder une hauteur minimale pour que le footer ne remonte pas
   - Résultat : Le CSS scoped ne s'applique pas correctement

4. **Loading en superposition (overlay)**
   - `<div v-if="loading && hasData" class="loading-overlay">`
   - Affiche un spinner semi-transparent par-dessus le contenu existant
   - Les sections utilisent `v-if` au lieu de `v-else-if` pour rester visibles
   - Résultat : Le footer remonte toujours pendant le chargement

### Code actuel (TrendPage.vue)

```vue
<!-- Loading plein écran tant que pas de données -->
<div v-if="!isReady" class="loading-fullscreen">
  <LoadingSpinner message="Chargement..." />
</div>

<!-- Contenu principal -->
<template v-else>
  <AppHeader />
  <main>...</main>
  <div class="tendances-nav">...</div>

  <div class="container-tendances">
    <!-- Loading overlay pour changement de section -->
    <div v-if="loading && hasData" class="loading-overlay">
      <LoadingSpinner />
    </div>

    <!-- Sections avec v-if au lieu de v-else-if -->
    <section v-if="currentSection === 'actualites' && actualites.length > 0">...</section>
    <section v-if="currentSection === 'technologies' && technologies.length > 0">...</section>
    <section v-if="currentSection === 'marche' && marche.length > 0">...</section>
    <section v-if="currentSection === 'predictions' && predictions.length > 0">...</section>
  </div>

  <AppFooter />
</template>
```

### Computed properties

```javascript
const hasData = computed(() => {
  return actualites.value.length > 0 ||
         technologies.value.length > 0 ||
         marche.value.length > 0 ||
         predictions.value.length > 0;
});

const isReady = computed(() => {
  if (error.value) return true;
  if (loading.value) return false;
  // Vérifie si les données de la section actuelle sont chargées
  switch (currentSection.value) {
    case 'actualites': return actualites.value.length > 0;
    case 'technologies': return technologies.value.length > 0;
    case 'marche': return marche.value.length > 0;
    case 'predictions': return predictions.value.length > 0;
    default: return false;
  }
});
```

### Styles CSS (scoped)

```css
.loading-fullscreen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a2e;
}

.container-tendances {
  position: relative;
  min-height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(26, 26, 46, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
```

## Pistes à explorer

1. **Ajouter le style dans styles_tendances.css** au lieu de scoped
   - Le CSS scoped peut ne pas s'appliquer correctement

2. **Utiliser `visibility: hidden` au lieu de `v-if`**
   - Garder l'espace réservé mais cacher visuellement

3. **Fixer le footer en bas de page**
   - `position: fixed; bottom: 0;`
   - Nécessite d'ajouter du padding-bottom au contenu

4. **Précharger toutes les sections au montage**
   - Charger actualités + technologies + marché + prédictions en parallèle
   - Ainsi le changement d'onglet est instantané (pas de loading)

## Routes configurées

```javascript
{
  path: '/tendances/:categorie',
  name: 'tendances',
  component: TrendPage,
  meta: { title: 'Tendances - Site Gamer 2025' }
}
```

## Liens depuis ProductDetail.vue

Le bouton "Voir les tendances [CATEGORIE]" sur les fiches produit mène vers cette page :
```vue
<router-link :to="`/tendances/${getCategorySlug(product.categorie)}`">
  Voir les tendances {{ formatCategory(product.categorie) }}
</router-link>
```

## Commandes utiles

```bash
# Démarrer les deux serveurs
npm run dev:full

# Tester une catégorie
http://localhost:5173/tendances/drone
http://localhost:5173/tendances/pc-gaming
http://localhost:5173/tendances/smartphone
```
