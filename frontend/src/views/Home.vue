<template>
  <div>
    <!-- Header avec logo et navigation -->
    <AppHeader />

    <!-- Contenu principal (reproduction exacte de index.html) -->
    <main>
      <h1>Bienvenue dans l'univers du Matériel Numérique</h1>

      <video
        src="/assets/images/galaxy-falling-stars-wuthering-waves-moewalls-com.mp4"
        width="600"
        autoplay
        loop
        muted
        playsinline
        class="video-intro"
      ></video>

      <p class="description-principale">
        Ce site vous propose une exploration structurée des
        <em>équipements technologiques</em> qui accompagnent <br />
        notre quotidien : informatique, audiovisuel, communication, éducation, et
        plus encore.
        <br /><br />
        Naviguez à travers les catégories, découvrez les fiches détaillées, <br />
        et retrouvez <em>chaque mois</em> une sélection d'appareils mis en avant
        pour leur <em>pertinence et leur performance</em>. <br />
        Les <em>tendances</em> de chaque appareil sont analysées pour vous offrir une
        <em>vision claire de l'évolution technologique</em>. <br /><br />
        Cliquer <router-link to="/top-du-mois" class="colored-link">ici</router-link> pour
        découvrir les équipements vedettes.
      </p>

      <video
        src="/assets/images/high-noon-hecarim-league-of-legends-moewalls-com.mp4"
        width="600"
        autoplay
        loop
        muted
        playsinline
        class="video-intro"
      ></video>

      <!-- Section test Vue.js (temporaire pour valider Phase B) -->
      <div class="test-section">
        <h2>🧪 Test des composants Vue.js</h2>

        <!-- Test LoadingSpinner -->
        <div class="test-block">
          <h3>LoadingSpinner</h3>
          <LoadingSpinner message="Chargement des produits..." />
        </div>

        <!-- Test ErrorMessage -->
        <div class="test-block">
          <h3>ErrorMessage</h3>
          <ErrorMessage
            type="info"
            title="Information"
            message="Phase B complétée ! Composants de base créés."
          />
        </div>

        <!-- Test ProductCard avec données API -->
        <div class="test-block">
          <h3>ProductCard ({{ products.length }} produits chargés)</h3>

          <LoadingSpinner v-if="loading" message="Chargement..." />

          <ErrorMessage
            v-else-if="error"
            type="error"
            :message="error"
            show-retry
            @retry="loadProducts"
          />

          <div v-else-if="products.length > 0" class="products-test-grid">
            <ProductCard
              v-for="product in products.slice(0, 6)"
              :key="product.id"
              :product="product"
            />
          </div>

          <button v-else @click="loadProducts" class="btn-test">
            Charger les produits
          </button>
        </div>

        <!-- Statut migration -->
        <div class="migration-status">
          <h3>📋 Phase B - Composants de base ✅ COMPLÉTÉE</h3>
          <ul>
            <li>✅ AppHeader.vue - En-tête avec navigation</li>
            <li>✅ AppFooter.vue - Pied de page</li>
            <li>✅ ProductCard.vue - Carte produit réutilisable</li>
            <li>✅ LoadingSpinner.vue - Indicateur de chargement</li>
            <li>✅ ErrorMessage.vue - Messages d'erreur</li>
            <li>✅ CSS existant 100% intact</li>
            <li>⏳ Prochaine étape: Phase C - Pages principales</li>
          </ul>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@components/layout/AppHeader.vue';
import AppFooter from '@components/layout/AppFooter.vue';
import ProductCard from '@components/products/ProductCard.vue';
import LoadingSpinner from '@components/common/LoadingSpinner.vue';
import ErrorMessage from '@components/common/ErrorMessage.vue';

const products = ref([]);
const loading = ref(false);
const error = ref(null);

async function loadProducts() {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('http://localhost:3000/api/produits');

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    products.value = data.data || data;

    console.log('✅ Produits chargés:', products.value.length);
  } catch (err) {
    error.value = err.message;
    console.error('❌ Erreur:', err);
  } finally {
    loading.value = false;
  }
}

// Charger automatiquement les produits au montage
onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes de styles.min.css
  Style additionnel uniquement pour la section de test (temporaire)
*/

main {
  /* Le CSS global gère déjà le style de <main> */
}

.video-intro {
  padding: 0;
  display: block;
  margin: 0 auto 35px auto;
  border-radius: 60px;
}

.test-section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 40px 20px;
  background: #f9f9f9;
  border-radius: 12px;
}

.test-block {
  margin: 30px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.test-block h3 {
  margin-bottom: 20px;
  color: #667eea;
}

.products-test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.btn-test {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-test:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.migration-status {
  margin: 40px 0 0;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.migration-status h3 {
  margin: 0 0 16px 0;
  font-size: 1.3em;
}

.migration-status ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.migration-status li {
  padding: 8px 0;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
