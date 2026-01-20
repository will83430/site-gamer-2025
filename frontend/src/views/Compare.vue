<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCompareStore } from '@/stores/compareStore';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const compareStore = useCompareStore();

// Catégories pour le filtre
const categories = ref([]);
const selectedCategory = ref('');
const allProducts = ref([]);
const loading = ref(false);

// Produits filtrés par catégorie (exclure ceux déjà dans la comparaison)
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return [];
  let products = allProducts.value.filter(p => !compareStore.isInCompare(p.id));
  products = products.filter(p =>
    p.categorie?.toLowerCase() === selectedCategory.value.toLowerCase()
  );
  return products.slice(0, 12);
});

// Charger les produits disponibles
async function loadProducts() {
  loading.value = true;
  try {
    const response = await fetch('/api/produits');
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) {
      allProducts.value = data.data;
      const cats = [...new Set(data.data.map(p => p.categorie).filter(c => c))];
      categories.value = cats.sort();
      // Sélectionner la première catégorie par défaut
      if (cats.length > 0 && !selectedCategory.value) {
        selectedCategory.value = cats[0];
      }
    }
  } catch (error) {
    console.error('Erreur chargement produits:', error);
  } finally {
    loading.value = false;
  }
}

function getImageUrl(product) {
  if (product.image_url) return product.image_url;
  if (product.image) {
    const clean = product.image.replace(/^assets\/images\//, '');
    return `/assets/images/${clean}`;
  }
  return '/assets/images/placeholder.png';
}

function addProduct(product) {
  compareStore.addToCompare(product);
}

function removeProduct(productId) {
  compareStore.removeFromCompare(productId);
}

onMounted(() => {
  loadProducts();
  document.body.classList.add('fiches-page');
});
</script>

<template>
  <div class="compare-page">
    <AppHeader />

    <main>
      <h1 class="titre-categorie">&#x2696; Comparatif Produits</h1>
      <p class="description">
        Comparez jusqu'à {{ compareStore.maxItems }} produits de la même catégorie
      </p>

      <!-- Section Ajouter des produits EN PREMIER -->
      <div v-if="!compareStore.isFull" class="add-section">
        <h2>Sélectionnez une catégorie et ajoutez des produits</h2>

        <div class="filter-bar">
          <label>Catégorie :</label>
          <select v-model="selectedCategory" class="category-select">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <div v-if="loading" class="loading-text">Chargement des produits...</div>

        <div v-else-if="filteredProducts.length > 0" class="produits-grid-mini">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-mini"
            @click="addProduct(product)"
          >
            <img
              :src="getImageUrl(product)"
              :alt="product.nom"
              @error="$event.target.src = '/assets/images/placeholder.png'"
            />
            <div class="product-mini-info">
              <span class="product-mini-name">{{ product.titre_affiche || product.nom }}</span>
              <span class="product-mini-price">{{ product.prix || 'N/C' }}</span>
            </div>
            <div class="add-overlay">+ Ajouter</div>
          </div>
        </div>

        <div v-else-if="selectedCategory" class="no-products">
          <p>Tous les produits de cette catégorie sont déjà dans la comparaison</p>
        </div>
      </div>

      <div v-else class="full-message">
        <p>&#x2714; Comparaison complète ({{ compareStore.maxItems }} produits max)</p>
      </div>

      <!-- Zone de comparaison -->
      <div v-if="compareStore.compareCount > 0" class="compare-section">
        <h2>Comparaison ({{ compareStore.compareCount }}/{{ compareStore.maxItems }})</h2>

        <div class="compare-grid">
          <div
            v-for="product in compareStore.compareList"
            :key="product.id"
            class="compare-card"
          >
            <button class="btn-remove-compare" @click="removeProduct(product.id)">&times;</button>

            <img
              :src="getImageUrl(product)"
              :alt="product.nom"
              class="compare-img"
              @error="$event.target.src = '/assets/images/placeholder.png'"
            />

            <h3>{{ product.titre_affiche || product.nom }}</h3>

            <div class="compare-details">
              <div class="detail-row highlight">
                <span class="label">Prix</span>
                <span class="value price">{{ product.prix || 'N/C' }}</span>
              </div>

              <div class="detail-row">
                <span class="label">Catégorie</span>
                <span class="value">{{ product.categorie || 'N/C' }}</span>
              </div>

              <div v-if="product.note" class="detail-row">
                <span class="label">Note</span>
                <span class="value">{{ product.note }}</span>
              </div>

              <div class="detail-row description">
                <span class="value">{{ product.description || 'Description non disponible' }}</span>
              </div>

              <!-- Fonctionnalités avancées -->
              <div v-if="product.fonctionnalites_avancees && product.fonctionnalites_avancees.length > 0" class="features">
                <span class="label">Caractéristiques</span>
                <ul>
                  <li v-for="(f, idx) in product.fonctionnalites_avancees" :key="idx">{{ f }}</li>
                </ul>
              </div>

              <!-- Données fiche technique -->
              <div v-if="product.donnees_fiche && product.donnees_fiche.length > 0" class="specs">
                <span class="label">Fiche technique</span>
                <ul>
                  <li v-for="(spec, idx) in product.donnees_fiche" :key="idx">{{ spec }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="compare-actions">
          <button class="btn btn-comparer" @click="compareStore.clearCompare">
            Vider la comparaison
          </button>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="empty-state">
        <div class="empty-icon">&#x2696;</div>
        <h2>Aucun produit à comparer</h2>
        <p>Sélectionnez une catégorie ci-dessus et cliquez sur les produits pour les ajouter</p>
      </div>

      <!-- Lien retour -->
      <div class="bottom-actions">
        <a href="/top-du-mois.html" class="btn btn-tendances-top">
          ← Retour aux produits
        </a>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.compare-page {
  min-height: 100vh;
}

.titre-categorie {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 5px;
}

.description {
  text-align: center;
  color: #aaa;
  margin-bottom: 20px;
  font-size: 0.95em;
}

/* Section ajout - EN PREMIER */
.add-section {
  margin: 0 auto 30px;
  max-width: 1200px;
  padding: 20px;
  background: rgba(30, 30, 50, 0.8);
  border-radius: 12px;
}

.add-section h2 {
  color: #fff;
  margin: 0 0 15px;
  text-align: center;
  font-size: 1.1em;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.filter-bar label {
  color: #ccc;
  font-size: 0.95em;
}

.category-select {
  padding: 8px 16px;
  font-size: 0.95em;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  cursor: pointer;
  min-width: 180px;
}

.category-select option {
  background: #1f2039;
  color: #fff;
}

.loading-text {
  text-align: center;
  color: #aaa;
  padding: 20px;
}

/* Grille mini produits */
.produits-grid-mini {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.produits-grid-mini .product-mini {
  flex: 0 0 200px;
  max-width: 200px;
}

.product-mini {
  background: linear-gradient(145deg, rgba(40, 40, 70, 0.95), rgba(25, 25, 50, 0.98));
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.product-mini:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 12px 25px rgba(102, 126, 234, 0.5);
}

.product-mini:hover .add-overlay {
  opacity: 1;
}

.product-mini img {
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(240, 147, 251, 0.15));
  border: 1px solid rgba(240, 147, 251, 0.25);
  border-radius: 8px;
  padding: 8px;
}

.product-mini-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.product-mini-name {
  font-size: 0.95em;
  color: #fff;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.product-mini-price {
  font-size: 1em;
  color: #98fb98;
  font-weight: 700;
}

.add-overlay {
  position: absolute;
  inset: 0;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9em;
  opacity: 0;
  transition: opacity 0.2s;
}

.no-products {
  text-align: center;
  color: #aaa;
  padding: 20px;
}

.full-message {
  text-align: center;
  padding: 15px;
  background: rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  margin: 0 auto 20px;
  max-width: 400px;
  color: #98fb98;
}

/* Section comparaison */
.compare-section {
  margin: 0 auto 30px;
  max-width: 1400px;
  padding: 20px;
}

.compare-section h2 {
  color: #fff;
  text-align: center;
  margin: 0 0 20px;
  font-size: 1.2em;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.compare-card {
  background: rgba(30, 30, 50, 0.95);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.btn-remove-compare {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ff4757;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  z-index: 10;
}

.btn-remove-compare:hover {
  transform: scale(1.1);
}

.compare-img {
  width: 100%;
  height: 150px;
  object-fit: contain;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(240, 147, 251, 0.15));
  border: 2px solid rgba(240, 147, 251, 0.3);
  border-radius: 12px;
  margin-bottom: 15px;
  padding: 10px;
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.15), inset 0 0 30px rgba(102, 126, 234, 0.1);
}

.compare-card h3 {
  color: #fff;
  margin: 0 0 15px;
  font-size: 1.1em;
  text-align: center;
  line-height: 1.3;
}

.compare-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-row.highlight {
  background: rgba(102, 126, 234, 0.2);
  padding: 8px 10px;
  border-radius: 6px;
  border-bottom: none;
  margin-bottom: 5px;
}

.detail-row.description {
  flex-direction: column;
  align-items: flex-start;
  border-bottom: none;
  padding-top: 10px;
}

.detail-row .label {
  color: #aaa;
  font-size: 0.85em;
}

.detail-row .value {
  color: #fff;
  font-size: 0.9em;
}

.detail-row .value.price {
  color: #98fb98;
  font-weight: 700;
  font-size: 1.1em;
}

.detail-row.description .value {
  color: #ccc;
  font-size: 0.85em;
  line-height: 1.4;
}

.features, .specs {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.features .label, .specs .label {
  display: block;
  color: #667eea;
  font-size: 0.85em;
  font-weight: 600;
  margin-bottom: 8px;
}

.features ul, .specs ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features li, .specs li {
  color: #ccc;
  font-size: 0.8em;
  padding: 4px 0;
  padding-left: 15px;
  position: relative;
  line-height: 1.3;
}

.features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #98fb98;
}

.specs li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #667eea;
}

.compare-actions {
  text-align: center;
  margin-top: 20px;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  margin: 20px auto;
  max-width: 500px;
}

.empty-icon {
  font-size: 60px;
  opacity: 0.3;
  margin-bottom: 15px;
}

.empty-state h2 {
  color: #fff;
  margin: 0 0 8px;
  font-size: 1.2em;
}

.empty-state p {
  color: #aaa;
  font-size: 0.9em;
}

.bottom-actions {
  text-align: center;
  margin: 30px 0;
}

.btn-tendances-top {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-tendances-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .produits-grid-mini {
    gap: 12px;
    max-width: 100%;
  }

  .produits-grid-mini .product-mini {
    flex: 0 0 calc(50% - 6px);
    max-width: calc(50% - 6px);
  }

  .compare-grid {
    grid-template-columns: 1fr;
  }

  .product-mini {
    padding: 12px;
  }

  .product-mini img {
    height: 90px;
  }

  .product-mini-name {
    font-size: 0.85em;
  }

  .product-mini-price {
    font-size: 0.9em;
  }
}
</style>
