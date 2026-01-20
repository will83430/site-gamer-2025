<template>
  <div
    class="fiche-produit"
    :data-id="product.id"
    :style="product.top_du_mois ? 'position: relative; border: 3px solid #ffd700; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);' : 'position: relative;'"
  >
    <!-- Badge TOP du mois -->
    <span
      v-if="product.top_du_mois"
      class="vedette-badge"
      style="background: linear-gradient(45deg, #ff6b6b, #ffd700); color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; position: absolute; top: 10px; right: 10px; z-index: 10; animation: pulse 2s infinite; box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);"
    >🔥 TOP</span>

    <!-- Checkbox de comparaison -->
    <input
      type="checkbox"
      class="produit-checkbox"
      :data-id="product.id"
      :data-nom="product.nom"
      :checked="compareStore.isInCompare(product.id)"
      @change="handleCompareToggle"
    >

    <!-- Image du produit -->
    <img
      :src="imageUrl"
      :alt="product.titre_affiche || product.nom"
      loading="lazy"
      style="width: 100%; height: 200px; object-fit: cover; background: #f0f0f0;"
      @error="handleImageError"
    />

    <!-- Nom du produit -->
    <div class="overlay-text-produit">{{ product.titre_affiche || product.nom }}</div>

    <!-- Description -->
    <p class="info">{{ product.description || 'Description non disponible' }}</p>

    <!-- Prix -->
    <p class="info" style="color: #667eea; font-weight: bold;">{{ product.prix || 'Prix non communiqué' }}</p>

    <!-- Fonctionnalités avancées -->
    <ul
      v-if="product.fonctionnalites_avancees && product.fonctionnalites_avancees.length > 0"
      style="text-align: left; padding-left: 20px; margin: 10px 0;"
    >
      <li
        v-for="(feature, index) in product.fonctionnalites_avancees.slice(0, 3)"
        :key="index"
        style="font-size: 0.9em;"
      >{{ feature }}</li>
    </ul>

    <!-- Bouton voir la fiche -->
    <router-link
      :to="productLink"
      class="btn btn-details"
      @click.stop
    >Voir la fiche</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCompareStore } from '@/stores/compareStore';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  from: {
    type: String,
    default: ''
  }
});

// Store de comparaison
const compareStore = useCompareStore();

// Déclaration des événements émis
defineEmits(['compare-toggle']);

// Gestion du toggle de comparaison
function handleCompareToggle() {
  compareStore.toggleCompare(props.product);
}

// URL de l'image (logique identique à fiches.js)
const imageUrl = computed(() => {
  if (props.product.image_url) {
    return props.product.image_url;
  } else if (props.product.image) {
    const clean = props.product.image.replace(/^assets\/images\//, '');
    return `/assets/images/${clean}`;
  }
  return '/assets/images/placeholder.png';
});

// Lien vers la fiche produit
const productLink = computed(() => {
  // Navigation SPA : /produit/:id
  if (props.from === 'produits' || props.from === 'top-du-mois') {
    const query = {};
    if (props.product.categorie) query.categorie = props.product.categorie;
    if (props.from) query.from = props.from;
    return {
      path: `/produit/${props.product.nom}`,
      query
    };
  }
  // Sinon, lien statique (fiches générées)
  const basePath = props.product.lien
    ? (props.product.lien.startsWith('/') ? props.product.lien : `/${props.product.lien}`)
    : `/fiches/${(props.product.categorie || '').toLowerCase().replace(/\s+/g, '-')}/${props.product.nom.toLowerCase()}.html`;
  const query = {};
  if (props.product.categorie) query.categorie = props.product.categorie;
  if (props.from) query.from = props.from;
  if (Object.keys(query).length > 0) {
    return {
      path: basePath,
      query
    };
  }
  return basePath;
});

// Gestion erreur image (fallback)
function handleImageError(event) {
  event.target.src = '/assets/images/placeholder.png';
}
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes de styles.min.css
  Les styles .fiche-produit, .overlay-text-produit, .info, .btn, .btn-details sont définis là-bas
*/
</style>
