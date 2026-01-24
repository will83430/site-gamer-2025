<template>
  <div>
    <AppHeader />

    <main>
      <div v-if="selectedCategory" class="tendances-btn-top">
        <router-link
          :to="`/tendances/${getCategorySlug(selectedCategory)}`"
          class="btn btn-tendances-top"
        >
          🔎 Voir les tendances {{ formatCategoryName(selectedCategory) }}
        </router-link>
      </div>

      <!-- Bouton retour -->
      <button
        v-if="selectedCategory"
        @click="goBack"
        class="btn btn-retour"
      >
        ← Retour
      </button>

      <!-- Titre -->
      <h1 class="titre-categorie">
        {{ pageTitle }}
      </h1>

      <!-- Description catégorie -->
      <p v-if="categoryDescription" class="description">
        {{ categoryDescription }}
      </p>

      <!-- Loading -->
      <LoadingSpinner v-if="loading" message="Chargement des produits..." />

      <!-- Erreur -->
      <ErrorMessage
        v-else-if="error"
        type="error"
        :message="error"
        show-retry
        @retry="loadProducts"
      />

      <!-- Grille des catégories (si aucune catégorie sélectionnée) -->
      <div v-else-if="!selectedCategory" id="zone-fiches" class="produits-grid">
        <div class="categories-grid">
          <router-link
            v-for="category in categories"
            :key="category"
            :to="`/produits?categorie=${encodeURIComponent(category)}`"
            class="categorie-card"
          >
            <div class="categorie-icon">{{ getCategoryIcon(category) }}</div>
            <h3>{{ formatCategoryName(category) }}</h3>
            <p>Voir les produits →</p>
          </router-link>
        </div>
      </div>

      <!-- Grille des produits (si catégorie sélectionnée) -->
      <div v-else id="zone-fiches" class="produits-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          from="produits"
        />

        <p v-if="filteredProducts.length === 0" class="no-products">
          Aucun produit trouvé dans cette catégorie.
        </p>
      </div>

      <!-- Pagination -->
      <div id="pagination-container">
        <div v-if="totalPages > 1" class="pagination-container">
          <button
            v-if="currentPage > 1"
            class="btn-page"
            @click="changePage(currentPage - 1)"
          >← Précédent</button>

          <button
            v-for="page in visiblePages"
            :key="page"
            class="btn-page"
            :class="{ active: page === currentPage }"
            @click="changePage(page)"
          >{{ page }}</button>

          <button
            v-if="currentPage < totalPages"
            class="btn-page"
            @click="changePage(currentPage + 1)"
          >Suivant →</button>

          <div class="page-info">
            Page {{ currentPage }} sur {{ totalPages }} ({{ filteredProducts.length }} produits)
          </div>
        </div>
      </div>

      <!-- Bouton comparaison -->
      <button
        v-if="selectedCategory"
        id="btn-comparer"
        class="btn btn-comparer"
        :disabled="!compareStore.canCompare"
        @click="showComparison = true"
      >
        Comparer les produits sélectionnés{{ compareStore.compareCount > 0 ? ` (${compareStore.compareCount})` : '' }}
      </button>

      <!-- Zone de comparaison -->
      <div v-if="showComparison" id="zone-comparaison" class="zone-comparaison">
        <div id="comparaison-content" class="comparaison-grid">
          <div
            v-for="product in selectedProductsDetails"
            :key="product.id"
            class="fiche-comparaison"
            style="position: relative;"
          >
            <span
              v-if="product.top_du_mois"
              class="vedette-badge"
              style="position: absolute; top: 10px; left: 10px; background: #c9c5aeff; color: #333; padding: 5px 10px; border-radius: 15px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 10;"
            >⭐ Top du mois</span>
            <img
              :src="getProductImage(product)"
              :alt="product.titre_affiche || product.nom"
              @error="$event.target.src = '/assets/images/placeholder.png'"
            >
            <h4>{{ product.titre_affiche || product.nom }}</h4>
            <p class="info"><strong>Prix:</strong> {{ product.prix || 'N/C' }}</p>
            <p class="info"><strong>Catégorie:</strong> {{ product.categorie || 'N/C' }}</p>
            <p class="info">{{ product.description || 'Description non disponible' }}</p>
            <ul v-if="product.fonctionnalites_avancees && product.fonctionnalites_avancees.length > 0">
              <li v-for="(f, idx) in product.fonctionnalites_avancees.slice(0, 3)" :key="idx">{{ f }}</li>
            </ul>
          </div>
        </div>
        <button
          id="btn-fermer-comparaison"
          class="btn btn-comparer"
          @click="closeComparison"
        >
          Fermer la comparaison
        </button>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '@components/layout/AppHeader.vue';
import AppFooter from '@components/layout/AppFooter.vue';
import ProductCard from '@components/products/ProductCard.vue';
import LoadingSpinner from '@components/common/LoadingSpinner.vue';
import ErrorMessage from '@components/common/ErrorMessage.vue';
import { useCompareStore } from '@/stores/compareStore';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const loading = ref(false);
const error = ref(null);

// Comparaison via store Pinia
const compareStore = useCompareStore();
const showComparison = ref(false);

// Pagination
const ITEMS_PER_PAGE = 12;
const currentPage = ref(1);

// Catégorie sélectionnée depuis l'URL
const selectedCategory = computed(() => route.query.categorie || null);

// Liste des catégories disponibles
const categories = ref([
  'DRONE', 'CONSOLE', 'TABLETTE', 'SMARTPHONE', 'PC GAMING', 'SERVEUR',
  'CASQUE AUDIO', 'MONTRE CONNECTEE', 'CASQUE VR', 'IMPRIMANTE 3D',
  'ECRAN TV', 'CAMERA', 'PERIPHERIQUES', 'VIDEO PROJECTEUR',
  'BOX INTERNET', 'TABLEAU INTERACTIF'
]);

// Titre de la page
const pageTitle = computed(() => {
  if (selectedCategory.value) {
    return formatCategoryName(selectedCategory.value);
  }
  return 'Toutes les catégories';
});

// Description de la catégorie (TODO: ajouter des descriptions custom)
const categoryDescription = computed(() => {
  if (!selectedCategory.value) return '';
  return `Découvrez notre sélection de ${formatCategoryName(selectedCategory.value).toLowerCase()}`;
});

// Produits filtrés par catégorie
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value;

  return products.value.filter(
    p => p.categorie?.toUpperCase() === selectedCategory.value.toUpperCase()
  );
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / ITEMS_PER_PAGE));

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return filteredProducts.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

// Détails des produits sélectionnés pour la comparaison (via store)
const selectedProductsDetails = computed(() => {
  return compareStore.compareList;
});

// Charger les produits
async function loadProducts() {
  loading.value = true;
  error.value = null;

  try {
    const url = selectedCategory.value
      ? `/api/produits?categorie=${encodeURIComponent(selectedCategory.value)}`
      : '/api/produits';

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const data = await response.json();
    products.value = data.data || data;
  } catch (err) {
    error.value = err.message;
    console.error('❌ Erreur chargement produits:', err);
  } finally {
    loading.value = false;
  }
}

// Retour à la liste des catégories
function goBack() {
  router.push('/top-du-mois');
}

// Gestion de la comparaison (géré par le store via ProductCard)
function closeComparison() {
  showComparison.value = false;
  compareStore.clearCompare();
}

// Pagination
function changePage(page) {
  currentPage.value = page;
  document.getElementById('zone-fiches')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Image du produit pour la comparaison
function getProductImage(product) {
  if (product.image_url) return product.image_url;
  if (product.image) {
    const clean = product.image.replace(/^assets\/images\//, '');
    return `/assets/images/${clean}`;
  }
  return '/assets/images/placeholder.png';
}

// Formater le nom de catégorie
function formatCategoryName(category) {
  if (!category) return '';

  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Convertir la catégorie en slug pour l'URL
function getCategorySlug(category) {
  if (!category) return '';
  return category.toLowerCase().replace(/\s+/g, '-');
}

// Icônes des catégories
function getCategoryIcon(category) {
  const icons = {
    'DRONE': '🚁',
    'CONSOLE': '🎮',
    'TABLETTE': '📱',
    'SMARTPHONE': '📱',
    'PC GAMING': '💻',
    'SERVEUR': '🖥️',
    'CASQUE AUDIO': '🎧',
    'MONTRE CONNECTEE': '⌚',
    'CASQUE VR': '🥽',
    'IMPRIMANTE 3D': '🖨️',
    'ECRAN TV': '📺',
    'CAMERA': '📷',
    'PERIPHERIQUES': '⌨️',
    'VIDEO PROJECTEUR': '📽️',
    'BOX INTERNET': '📡',
    'TABLEAU INTERACTIF': '📊'
  };

  return icons[category.toUpperCase()] || '📦';
}

// Charger au montage et quand la catégorie change
onMounted(() => {
  document.body.classList.add('fiches-page');
  loadProducts();
});

watch(() => route.query.categorie, () => {
  currentPage.value = 1;
  compareStore.clearCompare();
  showComparison.value = false;
  loadProducts();
});
</script>

<style scoped>
/*
  IMPORTANT: Utilise les classes CSS existantes de styles.min.css
  (.fiches-page, .produits-grid, .categorie-card, etc.)
*/

.no-products {
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: #666;
  font-size: 1.1em;
}

/* Grille des catégories */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 60px 50px; /* vertical horizontal */
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  justify-items: start;
}

.categorie-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: linear-gradient(145deg, rgba(30, 30, 50, 0.9), rgba(20, 20, 40, 0.95));
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.categorie-card:hover {
  transform: translateY(-8px);
  border-color: #667eea;
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
  background: linear-gradient(145deg, rgba(40, 40, 70, 0.95), rgba(30, 30, 55, 0.98));
}

.categorie-icon {
  font-size: 3em;
  margin-bottom: 15px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.categorie-card h3 {
  margin: 0 0 10px;
  font-size: 1.3em;
  color: #fff;
  text-align: center;
}

.categorie-card p {
  margin: 0;
  font-size: 0.95em;
  color: #667eea;
  font-weight: 500;
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 15px;
  }

  .categorie-card {
    padding: 20px 15px;
  }

  .categorie-icon {
    font-size: 2.2em;
  }

  .categorie-card h3 {
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
