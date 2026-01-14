<template>
  <div class="product-card" @click="goToProduct">
    <!-- Image du produit avec lazy loading -->
    <div class="product-image">
      <img
        :src="`/assets/images/${product.image || product.nom + '.png'}`"
        :alt="product.nom"
        loading="lazy"
        @error="handleImageError"
      />
      <!-- Badge "Top du mois" si applicable -->
      <span v-if="product.top_du_mois" class="badge-top">⭐ Top du mois</span>
    </div>

    <!-- Informations produit -->
    <div class="product-info">
      <h3 class="product-name">{{ product.nom }}</h3>
      <p class="product-category">{{ formatCategory(product.categorie) }}</p>

      <!-- Prix si disponible -->
      <p v-if="product.prix" class="product-price">{{ formatPrice(product.prix) }}</p>

      <!-- Note si disponible -->
      <div v-if="product.note" class="product-rating">
        <span class="stars">{{ renderStars(product.note) }}</span>
        <span class="note-value">{{ product.note }}/5</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

// Navigation vers la fiche produit
function goToProduct() {
  if (props.product.lien) {
    // TODO: Quand la page ProductDetail sera migrée
    // router.push(`/produit/${props.product.id}`);

    // Pour l'instant, redirection vers l'ancienne page
    window.location.href = `/${props.product.lien}`;
  }
}

// Gestion erreur image (fallback)
function handleImageError(event) {
  event.target.src = '/assets/images/placeholder.png';
}

// Formater le nom de catégorie
function formatCategory(category) {
  if (!category) return '';
  return category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Formater le prix
function formatPrice(prix) {
  if (!prix) return '';
  return `${prix.toLocaleString('fr-FR')} €`;
}

// Générer les étoiles pour la note
function renderStars(note) {
  const fullStars = Math.floor(note);
  const halfStar = note % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes
  Les styles .product-card, .product-image, etc. sont définis dans styles.min.css
  On ajoute juste les styles spécifiques Vue si nécessaire
*/

.product-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.badge-top {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
}

.product-image {
  position: relative;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.stars {
  color: #ffd700;
  font-size: 1.1em;
}

.note-value {
  color: #666;
  font-size: 0.9em;
}
</style>
