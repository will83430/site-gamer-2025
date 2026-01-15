<template>
  <div>
    <!-- Loading plein écran tant que pas de données -->
    <div v-if="!isReady" class="loading-fullscreen">
      <div class="spinner-local"></div>
      <p class="loading-text">Chargement des tendances...</p>
    </div>

    <!-- Contenu principal (affiché seulement quand données prêtes) -->
    <template v-else>
      <AppHeader />

      <!-- Hero Section -->
      <main>
        <h1>Tendances {{ categoryDisplayName }} 2025</h1>
        <p>
          Découvrez les innovations et l'actualité qui font vibrer le monde {{ categoryPreposition }} {{ categoryDisplayName.toLowerCase() }}
        </p>
      </main>

      <!-- Navigation des sections -->
      <div class="tendances-nav">
        <button
          class="nav-btn"
          :class="{ active: currentSection === 'actualites' }"
          @click="switchSection('actualites')"
        >
          📰 Actualités
        </button>
        <button
          class="nav-btn"
          :class="{ active: currentSection === 'technologies' }"
          @click="switchSection('technologies')"
        >
          ⚡ Technologies
        </button>
        <button
          class="nav-btn"
          :class="{ active: currentSection === 'marche' }"
          @click="switchSection('marche')"
        >
          📊 Marché
        </button>
        <button
          class="nav-btn"
          :class="{ active: currentSection === 'predictions' }"
          @click="switchSection('predictions')"
        >
          🔮 Prédictions
        </button>
        <button class="nav-back" @click="goBack">← Retour</button>
      </div>

      <!-- Container principal -->
      <div class="container-tendances">
        <!-- Loading en superposition pour changement de section -->
        <div v-if="loading && hasData" class="loading-overlay">
          <LoadingSpinner message="Chargement..." />
        </div>

        <!-- Error -->
        <div v-if="error" class="error-container">
          <ErrorMessage
            type="error"
            :message="error"
            show-retry
            @retry="loadAllData"
          />
        </div>

        <!-- Section Actualités -->
        <section
          v-if="currentSection === 'actualites'"
          id="actualites"
          class="section-tendances"
          style="display: block;"
        >
          <h2>📰 Actualités {{ categoryDisplayName }} Récentes</h2>
          <div v-if="actualites.length > 0" class="actualites-grid">
            <article
              v-for="(news, index) in actualites"
              :key="news.id || index"
              class="actualite-card"
              :class="{ featured: index === 0 }"
            >
              <!-- Video ou Image -->
              <div v-if="news.video_url" class="card-video">
                <iframe
                  width="100%"
                  height="200"
                  :src="getVideoUrl(news.video_url)"
                  :title="news.titre"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
                ></iframe>
                <span v-if="news.hot" class="badge hot">🔥 HOT</span>
              </div>
              <div v-else class="card-image">
                <img
                  :src="`/assets/images/${news.image}`"
                  :alt="news.titre"
                  loading="lazy"
                  @error="handleImageError"
                >
                <span v-if="news.hot" class="badge hot">🔥 HOT</span>
              </div>
              <div class="card-content">
                <span class="date">{{ formatDate(news.date_publication) }}</span>
                <h3>{{ news.titre }}</h3>
                <p>{{ news.description }}</p>
                <div class="tags">
                  <span v-for="tag in parseTags(news.tags)" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </article>
          </div>
          <p v-else class="no-data">Aucune actualité disponible pour cette catégorie.</p>
        </section>

        <!-- Section Technologies -->
        <section
          v-if="currentSection === 'technologies'"
          id="technologies"
          class="section-tendances"
          style="display: block;"
        >
          <h2>⚡ Technologies {{ categoryDisplayName }}</h2>
          <div v-if="technologies.length > 0" class="tech-grid">
            <div v-for="(tech, index) in technologies" :key="tech.id || index" class="tech-card">
              <div class="tech-icon">{{ getIconEmoji(tech.icone) }}</div>
              <h3>{{ tech.nom }}</h3>
              <div class="progress-bar">
                <div
                  class="progress"
                  :style="{ width: animatedProgress[index] || '0%', transition: 'width 1s ease' }"
                ></div>
              </div>
              <p><strong>Adoption: {{ tech.taux_adoption }}%</strong></p>
              <p>{{ tech.description }}</p>
            </div>
          </div>
          <p v-else class="no-data">Aucune technologie disponible pour cette catégorie.</p>
        </section>

        <!-- Section Marché -->
        <section
          v-if="currentSection === 'marche'"
          id="marche"
          class="section-tendances"
          style="display: block;"
        >
          <h2>📊 Marché {{ categoryDisplayName }}</h2>
          <div v-if="marche.length > 0">
            <div class="marche-grid">
              <div v-for="(stat, index) in marche" :key="stat.id || index" class="stat-card">
                <div class="stat-icon">{{ getIconEmoji(stat.icone) || '💰' }}</div>
                <div class="stat-value">{{ stat.valeur }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                <div class="stat-trend" :class="stat.tendance">
                  {{ getTrendText(stat.tendance) }}
                </div>
              </div>
            </div>
            <div v-if="insights.length > 0" class="market-insights">
              <h3>📈 Insights Clés</h3>
              <div class="insights-grid">
                <div v-for="(insight, index) in insights" :key="insight.id || index" class="insight-item">
                  <span class="insight-icon">{{ insight.icone }}</span>
                  <div>
                    <h4>{{ insight.titre }}</h4>
                    <p>{{ insight.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="no-data">Aucune donnée marché disponible pour cette catégorie.</p>
        </section>

        <!-- Section Prédictions -->
        <section
          v-if="currentSection === 'predictions'"
          id="predictions"
          class="section-tendances"
          style="display: block;"
        >
          <h2>🔮 Prédictions 2026-2030</h2>
          <div v-if="predictions.length > 0" class="predictions-timeline">
            <div v-for="(pred, index) in predictions" :key="pred.id || index" class="timeline-item">
              <span class="timeline-year">{{ pred.annee }}</span>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-icon">{{ getIconEmoji(pred.icone) }}</span>
                  <h3>{{ pred.titre }}</h3>
                </div>
                <p>{{ pred.description }}</p>
                <div class="probability">Probabilité: {{ pred.probabilite }}%</div>
              </div>
            </div>
          </div>
          <p v-else class="no-data">Aucune prédiction disponible pour cette catégorie.</p>
        </section>
      </div>

      <AppFooter />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '@components/layout/AppHeader.vue';
import AppFooter from '@components/layout/AppFooter.vue';
import LoadingSpinner from '@components/common/LoadingSpinner.vue';
import ErrorMessage from '@components/common/ErrorMessage.vue';

const route = useRoute();
const router = useRouter();

// URL de l'API
const API_URL = 'http://localhost:3000/api';

// État - loading=true par défaut pour éviter le layout shift
const currentSection = ref('actualites');
const loading = ref(true);
const error = ref(null);

// Données
const actualites = ref([]);
const technologies = ref([]);
const marche = ref([]);
const insights = ref([]);
const predictions = ref([]);
const animatedProgress = ref([]);

// Catégorie depuis l'URL (normalisée en slug)
const categorie = computed(() => {
  const cat = route.params.categorie || 'drone';
  // Normaliser : "PC GAMING" -> "pc-gaming", "PC%20GAMING" -> "pc-gaming"
  return decodeURIComponent(cat).toLowerCase().replace(/\s+/g, '-');
});

// Mapping des catégories pour l'affichage
const categoryMapping = {
  'drone': { name: 'Drones', preposition: 'des' },
  'pc-gaming': { name: 'PC Gaming', preposition: 'du' },
  'smartphone': { name: 'Smartphones', preposition: 'des' },
  'tablette': { name: 'Tablettes', preposition: 'des' },
  'console': { name: 'Consoles', preposition: 'des' },
  'serveur': { name: 'Serveurs', preposition: 'des' },
  'casque-audio': { name: 'Casques Audio', preposition: 'des' },
  'casque-vr': { name: 'Casques VR', preposition: 'des' },
  'montre-connectee': { name: 'Montres Connectées', preposition: 'des' },
  'imprimante-3d': { name: 'Imprimantes 3D', preposition: 'des' },
  'ecran-tv': { name: 'Écrans TV', preposition: 'des' },
  'camera': { name: 'Caméras', preposition: 'des' },
  'peripheriques': { name: 'Périphériques', preposition: 'des' },
  'video-projecteur': { name: 'Vidéoprojecteurs', preposition: 'des' },
  'box-internet': { name: 'Box Internet', preposition: 'des' },
  'tableau-interactif': { name: 'Tableaux Interactifs', preposition: 'des' }
};

const categoryDisplayName = computed(() => {
  return categoryMapping[categorie.value]?.name || categorie.value;
});

const categoryPreposition = computed(() => {
  return categoryMapping[categorie.value]?.preposition || 'des';
});

// Vérifie si on a déjà des données (pour garder le contenu visible pendant le chargement)
const hasData = computed(() => {
  return actualites.value.length > 0 ||
         technologies.value.length > 0 ||
         marche.value.length > 0 ||
         predictions.value.length > 0;
});

// Vérifie si les données sont prêtes pour affichage
const isReady = computed(() => {
  // Affiche dès que loading est false (données chargées ou erreur)
  return !loading.value;
});

// Mapping des icônes
const iconMap = {
  'drone': '🚁', 'package': '📦', 'network': '🌐', 'camera': '📷',
  'satellite': '🛰️', '8k': '📺', 'brain': '🧠', 'phone-fold': '📱',
  'battery': '🔋', 'cloud': '☁️', 'vr-headset': '🥽', 'quantum': '⚛️',
  '6g': '📡', 'gamepad': '🎮', 'tablet': '📱', 'fold': '📋',
  'leaf': '🌿', 'translate': '🌍', 'sound-wave': '🎵', '3d': '🎭',
  'heartbeat': '💓', 'fingerprint': '👆', 'hologram': '✨', 'droplet': '💧',
  'cube': '🧊', 'box': '📦', 'zap': '⚡', 'book': '📚',
  'tv': '📺', 'eye': '👁️', 'printer': '🖨️', 'metal': '🔩',
  'recycle': '♻️', 'chip': '💾', 'keyboard': '⌨️', 'mouse': '🖱️',
  'sparkle': '✨', 'hand': '🤚', 'mic': '🎤', 'money': '💰',
  'building': '🏢', 'home': '🏠', 'phone': '📱', 'laptop': '💻',
  'apple': '🍏', 'android': '🤖', 'signal': '📶', 'trophy': '🏆',
  'flag': '🏁', 'wheat': '🌾', 'list': '📋', 'watch': '⌚',
  'headphones': '🎧', 'server': '🖥️', 'link': '🔗', 'globe': '🌍',
  'france': '🇫🇷', 'euro': '💶', 'meta': '🅼', 'lg': '🅻',
  'creality': '🅲', 'chart': '📊', 'school': '🏫', 'dollar': '💸',
  'cpu': '🖥️', 'monitor': '🖥️', 'refresh': '🔄', 'wind': '💨',
  'shield': '🛡️', 'pen': '✏️', 'bluetooth': '📶', '4k': '📺'
};

function getIconEmoji(iconName) {
  return iconMap[iconName] || '🔮';
}

function getTrendText(trend) {
  if (trend === 'up') return '+12.3% vs 2024';
  if (trend === 'down') return '-5.2% vs 2024';
  return 'Stable';
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function parseTags(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags.replace(/[{}"]/g, '').split(',').filter(t => t.trim());
  }
  return [];
}

function getVideoUrl(url) {
  if (!url) return '';
  // Ajouter les paramètres nécessaires pour l'iframe
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}enablejsapi=1&origin=${window.location.origin}`;
}

function handleImageError(event) {
  event.target.src = '/assets/images/placeholder.png';
}

function goBack() {
  router.back();
}

// Chargement séquentiel pour éviter le rate limit
async function loadAllData() {
  loading.value = true;
  error.value = null;

  // Charger chaque section indépendamment (ne pas s'arrêter si une échoue)
  const errors = [];

  try {
    await loadActualites();
  } catch (err) {
    console.error('Erreur actualités:', err);
    errors.push('actualités');
  }

  try {
    await loadTechnologies();
  } catch (err) {
    console.error('Erreur technologies:', err);
    errors.push('technologies');
  }

  try {
    await loadMarche();
  } catch (err) {
    console.error('Erreur marché:', err);
    errors.push('marché');
  }

  try {
    await loadInsights();
  } catch (err) {
    console.error('Erreur insights:', err);
    errors.push('insights');
  }

  try {
    await loadPredictions();
  } catch (err) {
    console.error('Erreur prédictions:', err);
    errors.push('prédictions');
  }

  if (errors.length === 5) {
    error.value = 'Impossible de charger les données. Veuillez réessayer.';
  }

  loading.value = false;
}

async function loadActualites() {
  console.log('[TrendPage] Chargement actualités pour:', categorie.value);
  const res = await fetch(`${API_URL}/${categorie.value}/actualites`);
  if (!res.ok) throw new Error(`Erreur API actualités (${res.status})`);
  actualites.value = await res.json();
  console.log('[TrendPage] Actualités chargées:', actualites.value.length);
}

async function loadTechnologies() {
  console.log('[TrendPage] Chargement technologies pour:', categorie.value);
  const res = await fetch(`${API_URL}/${categorie.value}/technologies`);
  if (!res.ok) throw new Error(`Erreur API technologies (${res.status})`);
  technologies.value = await res.json();
  console.log('[TrendPage] Technologies chargées:', technologies.value.length);

  // Animation optimisée des barres de progression
  await nextTick();
  animatedProgress.value = technologies.value.map(() => '0%');
  // Utiliser requestAnimationFrame pour une meilleure sync avec le rendu
  requestAnimationFrame(() => {
    technologies.value.forEach((tech, i) => {
      animatedProgress.value[i] = `${tech.taux_adoption}%`;
    });
  });
}

async function loadMarche() {
  console.log('[TrendPage] Chargement marché pour:', categorie.value);
  const res = await fetch(`${API_URL}/${categorie.value}/marche`);
  if (!res.ok) throw new Error(`Erreur API marché (${res.status})`);
  marche.value = await res.json();
  console.log('[TrendPage] Marché chargé:', marche.value.length);
}

async function loadInsights() {
  console.log('[TrendPage] Chargement insights pour:', categorie.value);
  const res = await fetch(`${API_URL}/${categorie.value}/insights`);
  if (!res.ok) throw new Error(`Erreur API insights (${res.status})`);
  insights.value = await res.json();
  console.log('[TrendPage] Insights chargés:', insights.value.length);
}

async function loadPredictions() {
  console.log('[TrendPage] Chargement prédictions pour:', categorie.value);
  const res = await fetch(`${API_URL}/${categorie.value}/predictions`);
  if (!res.ok) throw new Error(`Erreur API prédictions (${res.status})`);
  predictions.value = await res.json();
  console.log('[TrendPage] Prédictions chargées:', predictions.value.length);
}

function switchSection(section) {
  console.log('[TrendPage] switchSection:', section, '| avant:', currentSection.value);
  currentSection.value = section;
  console.log('[TrendPage] switchSection après:', currentSection.value);
}

// Watcher pour changement de catégorie
watch(categorie, () => {
  // Réinitialiser les données et recharger tout
  actualites.value = [];
  technologies.value = [];
  marche.value = [];
  insights.value = [];
  predictions.value = [];
  currentSection.value = 'actualites';
  loadAllData();
});

// Chargement initial
onMounted(() => {
  loadAllData();
});
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes
  Le style est défini dans styles_tendances.css
*/

/* Loading plein écran pour éviter le layout shift */
.loading-fullscreen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a2e;
}

.spinner-local {
  width: 60px;
  height: 60px;
  border: 5px solid rgba(255,255,255,0.3);
  border-top: 5px solid #667eea;
  border-radius: 50%;
  animation: spin-local 1s linear infinite;
}

@keyframes spin-local {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: white;
  margin-top: 20px;
  font-size: 1.2em;
}

/* Container principal avec position relative pour l'overlay */
.container-tendances {
  position: relative;
  min-height: 400px;
}

/* Message quand pas de données */
.no-data {
  color: #888;
  text-align: center;
  padding: 40px 20px;
  font-size: 1.1em;
}

/* Loading en superposition */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(26, 26, 46, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}
</style>

<!-- Footer normal, pas fixe -->
