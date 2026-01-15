<template>
  <div>
    <AppHeader />

    <main>
      <h1>🔥 Équipements Vedettes du Mois</h1>

      <div style="text-align:center;margin:18px 0;">
        <div
          style="display:inline-block;background:linear-gradient(90deg,#f093fb,#667eea);color:#fff;padding:10px 18px;border-radius:20px;font-weight:700;box-shadow:0 8px 30px rgba(102,126,234,0.18);">
          Top {{ currentMonthYear }}
        </div>
      </div>

      <p class="intro">
        Voici les grandes catégories d'équipements numériques. Cliquez sur une image pour découvrir les produits
        vedettes du mois 🎯
      </p>

      <div class="categories-container">
        <!-- Matériel informatique -->
        <section class="category-section">
          <h2>💻 Matériel informatique</h2>
          <div class="container">
            <router-link
              v-for="cat in ['PC GAMING', 'SERVEUR', 'PERIPHERIQUES']"
              :key="cat"
              :to="`/produits?categorie=${encodeURIComponent(cat)}`"
              class="category-card"
              :data-category="cat"
              @mouseenter="afficherApercu(cat, $event)"
              @mouseleave="masquerApercu"
            >
              <div
                class="bloc"
                :style="getBlocStyle(cat)"
              >
                <!-- Badge Top du mois -->
                <div
                  v-if="categoriesAvecTop.has(cat)"
                  style="position:absolute;top:8px;left:8px;background:linear-gradient(90deg,#f093fb,#667eea);color:white;padding:6px 10px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 6px 18px rgba(102,126,234,0.18);z-index:10;"
                >
                  Top • {{ currentMonthShort }}
                </div>
                <!-- Compteur produits -->
                <div
                  v-if="getProductCount(cat) > 0"
                  style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:20px;font-size:14px;font-weight:bold;z-index:10;text-align:center;"
                  v-html="getCountBadgeHTML(cat)"
                ></div>
                <img :src="`/assets/images/${cat.toLowerCase().replace(/ /g, '-')}.png`" :alt="cat" loading="lazy">
                <p class="overlay-text">
                  {{ cat }}
                  <span
                    v-if="categoriesAvecTop.has(cat)"
                    style="background:linear-gradient(45deg,#ff6b6b,#ffd700);color:white;padding:4px 8px;border-radius:12px;font-size:12px;font-weight:bold;display:inline-block;margin-left:8px;animation:pulse 2s infinite;"
                  >⭐ TOP</span>
                </p>
              </div>
            </router-link>

            <router-link
              :to="`/produits?categorie=${encodeURIComponent('TABLETTE')}`"
              class="category-card"
              data-category="TABLETTE"
              style="grid-column: 1 / -1; justify-self: center;"
              @mouseenter="afficherApercu('TABLETTE', $event)"
              @mouseleave="masquerApercu"
            >
              <div
                class="bloc tablette"
                :style="getBlocStyle('TABLETTE')"
              >
                <div
                  v-if="categoriesAvecTop.has('TABLETTE')"
                  style="position:absolute;top:8px;left:8px;background:linear-gradient(90deg,#f093fb,#667eea);color:white;padding:6px 10px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 6px 18px rgba(102,126,234,0.18);z-index:10;"
                >
                  Top • {{ currentMonthShort }}
                </div>
                <div
                  v-if="getProductCount('TABLETTE') > 0"
                  style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:20px;font-size:14px;font-weight:bold;z-index:10;text-align:center;"
                  v-html="getCountBadgeHTML('TABLETTE')"
                ></div>
                <img src="/assets/images/tablette.png" alt="TABLETTE" loading="lazy">
                <p class="overlay-text">
                  TABLETTE
                  <span
                    v-if="categoriesAvecTop.has('TABLETTE')"
                    style="background:linear-gradient(45deg,#ff6b6b,#ffd700);color:white;padding:4px 8px;border-radius:12px;font-size:12px;font-weight:bold;display:inline-block;margin-left:8px;animation:pulse 2s infinite;"
                  >⭐ TOP</span>
                </p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Appareils mobiles -->
        <section class="category-section">
          <h2>📱 Appareils mobiles</h2>
          <div class="container">
            <router-link
              v-for="cat in ['SMARTPHONE', 'MONTRE CONNECTEE']"
              :key="cat"
              :to="`/produits?categorie=${encodeURIComponent(cat)}`"
              class="category-card"
              :data-category="cat"
              @mouseenter="afficherApercu(cat, $event)"
              @mouseleave="masquerApercu"
            >
              <div
                class="bloc"
                :style="getBlocStyle(cat)"
              >
                <div
                  v-if="categoriesAvecTop.has(cat)"
                  style="position:absolute;top:8px;left:8px;background:linear-gradient(90deg,#f093fb,#667eea);color:white;padding:6px 10px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 6px 18px rgba(102,126,234,0.18);z-index:10;"
                >
                  Top • {{ currentMonthShort }}
                </div>
                <div
                  v-if="getProductCount(cat) > 0"
                  style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:20px;font-size:14px;font-weight:bold;z-index:10;text-align:center;"
                  v-html="getCountBadgeHTML(cat)"
                ></div>
                <img :src="`/assets/images/${cat.toLowerCase().replace(/ /g, '-')}.png`" :alt="cat" loading="lazy">
                <p class="overlay-text">
                  {{ cat }}
                  <span
                    v-if="categoriesAvecTop.has(cat)"
                    style="background:linear-gradient(45deg,#ff6b6b,#ffd700);color:white;padding:4px 8px;border-radius:12px;font-size:12px;font-weight:bold;display:inline-block;margin-left:8px;animation:pulse 2s infinite;"
                  >⭐ TOP</span>
                </p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Matériel audiovisuel -->
        <section class="category-section">
          <h2>🎬 Matériel audiovisuel</h2>
          <div class="container">
            <router-link
              v-for="cat in ['ECRAN TV', 'CAMERA', 'VIDEO PROJECTEUR']"
              :key="cat"
              :to="`/produits?categorie=${encodeURIComponent(cat)}`"
              class="category-card"
              :data-category="cat"
              @mouseenter="afficherApercu(cat, $event)"
              @mouseleave="masquerApercu"
            >
              <div
                class="bloc"
                :style="getBlocStyle(cat)"
              >
                <div
                  v-if="categoriesAvecTop.has(cat)"
                  style="position:absolute;top:8px;left:8px;background:linear-gradient(90deg,#f093fb,#667eea);color:white;padding:6px 10px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 6px 18px rgba(102,126,234,0.18);z-index:10;"
                >
                  Top • {{ currentMonthShort }}
                </div>
                <div
                  v-if="getProductCount(cat) > 0"
                  style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:20px;font-size:14px;font-weight:bold;z-index:10;text-align:center;"
                  v-html="getCountBadgeHTML(cat)"
                ></div>
                <img :src="`/assets/images/${cat.toLowerCase().replace(/ /g, '-')}.png`" :alt="cat" loading="lazy">
                <p class="overlay-text">
                  {{ cat }}
                  <span
                    v-if="categoriesAvecTop.has(cat)"
                    style="background:linear-gradient(45deg,#ff6b6b,#ffd700);color:white;padding:4px 8px;border-radius:12px;font-size:12px;font-weight:bold;display:inline-block;margin-left:8px;animation:pulse 2s infinite;"
                  >⭐ TOP</span>
                </p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Équipements de communication -->
        <section class="category-section">
          <h2>📡 Équipements de communication</h2>
          <div class="container">
            <router-link
              v-for="cat in ['BOX INTERNET', 'CASQUE AUDIO']"
              :key="cat"
              :to="`/produits?categorie=${encodeURIComponent(cat)}`"
              class="category-card"
              :data-category="cat"
              @mouseenter="afficherApercu(cat, $event)"
              @mouseleave="masquerApercu"
            >
              <div
                class="bloc"
                :style="getBlocStyle(cat)"
              >
                <div
                  v-if="categoriesAvecTop.has(cat)"
                  style="position:absolute;top:8px;left:8px;background:linear-gradient(90deg,#f093fb,#667eea);color:white;padding:6px 10px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 6px 18px rgba(102,126,234,0.18);z-index:10;"
                >
                  Top • {{ currentMonthShort }}
                </div>
                <div
                  v-if="getProductCount(cat) > 0"
                  style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:20px;font-size:14px;font-weight:bold;z-index:10;text-align:center;"
                  v-html="getCountBadgeHTML(cat)"
                ></div>
                <img :src="`/assets/images/${cat.toLowerCase().replace(/ /g, '-')}.png`" :alt="cat" loading="lazy">
                <p class="overlay-text">
                  {{ cat }}
                  <span
                    v-if="categoriesAvecTop.has(cat)"
                    style="background:linear-gradient(45deg,#ff6b6b,#ffd700);color:white;padding:4px 8px;border-radius:12px;font-size:12px;font-weight:bold;display:inline-block;margin-left:8px;animation:pulse 2s infinite;"
                  >⭐ TOP</span>
                </p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Matériel éducatif et interactif -->
        <section class="category-section">
          <h2>🎓 Matériel éducatif et interactif</h2>
          <div class="container">
            <router-link
              v-for="cat in ['TABLEAU INTERACTIF', 'CONSOLE', 'CASQUE VR']"
              :key="cat"
              :to="`/produits?categorie=${encodeURIComponent(cat)}`"
              class="category-card"
              :data-category="cat"
              @mouseenter="afficherApercu(cat, $event)"
              @mouseleave="masquerApercu"
            >
              <div
                class="bloc"
                :style="getBlocStyle(cat)"
              >
                <div
                  v-if="categoriesAvecTop.has(cat)"
                  style="position:absolute;top:8px;left:8px;background:linear-gradient(90deg,#f093fb,#667eea);color:white;padding:6px 10px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 6px 18px rgba(102,126,234,0.18);z-index:10;"
                >
                  Top • {{ currentMonthShort }}
                </div>
                <div
                  v-if="getProductCount(cat) > 0"
                  style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:20px;font-size:14px;font-weight:bold;z-index:10;text-align:center;"
                  v-html="getCountBadgeHTML(cat)"
                ></div>
                <img :src="`/assets/images/${cat.toLowerCase().replace(/ /g, '-')}.png`" :alt="cat" loading="lazy">
                <p class="overlay-text">
                  {{ cat }}
                  <span
                    v-if="categoriesAvecTop.has(cat)"
                    style="background:linear-gradient(45deg,#ff6b6b,#ffd700);color:white;padding:4px 8px;border-radius:12px;font-size:12px;font-weight:bold;display:inline-block;margin-left:8px;animation:pulse 2s infinite;"
                  >⭐ TOP</span>
                </p>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Matériel spécialisé -->
        <section class="category-section">
          <h2>🔧 Matériel spécialisé</h2>
          <div class="container">
            <router-link
              v-for="cat in ['IMPRIMANTE 3D', 'DRONE']"
              :key="cat"
              :to="`/produits?categorie=${encodeURIComponent(cat)}`"
              class="category-card"
              :data-category="cat"
              @mouseenter="afficherApercu(cat, $event)"
              @mouseleave="masquerApercu"
            >
              <div
                class="bloc"
                :style="getBlocStyle(cat)"
              >
                <div
                  v-if="categoriesAvecTop.has(cat)"
                  style="position:absolute;top:8px;left:8px;background:linear-gradient(90deg,#f093fb,#667eea);color:white;padding:6px 10px;border-radius:12px;font-weight:800;font-size:12px;box-shadow:0 6px 18px rgba(102,126,234,0.18);z-index:10;"
                >
                  Top • {{ currentMonthShort }}
                </div>
                <div
                  v-if="getProductCount(cat) > 0"
                  style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);color:white;padding:5px 10px;border-radius:20px;font-size:14px;font-weight:bold;z-index:10;text-align:center;"
                  v-html="getCountBadgeHTML(cat)"
                ></div>
                <img :src="`/assets/images/${cat.toLowerCase().replace(/ /g, '-')}.png`" :alt="cat" loading="lazy">
                <p class="overlay-text">
                  {{ cat }}
                  <span
                    v-if="categoriesAvecTop.has(cat)"
                    style="background:linear-gradient(45deg,#ff6b6b,#ffd700);color:white;padding:4px 8px;border-radius:12px;font-size:12px;font-weight:bold;display:inline-block;margin-left:8px;animation:pulse 2s infinite;"
                  >⭐ TOP</span>
                </p>
              </div>
            </router-link>
          </div>
        </section>
      </div>

      <!-- Popup aperçu produits -->
      <div
        v-if="apercuVisible"
        id="apercu-produits"
        class="apercu-produits"
        :style="apercuStyle"
        v-html="apercuContent"
      ></div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import AppHeader from '@components/layout/AppHeader.vue';
import AppFooter from '@components/layout/AppFooter.vue';

const currentMonthYear = ref('');
const currentMonthShort = ref('');
const produitsParCategorie = reactive({});
const categoriesAvecTop = reactive(new Set());

// Aperçu popup
const apercuVisible = ref(false);
const apercuContent = ref('');
const apercuStyle = ref({});

// API URL
const API_URL = 'http://localhost:3000/api';

onMounted(async () => {
  // Date du mois
  const date = new Date();
  const mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const moisShort = ['Jan.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
  currentMonthYear.value = `${mois[date.getMonth()]} ${date.getFullYear()}`;
  currentMonthShort.value = moisShort[date.getMonth()];

  // Charger les produits
  await chargerProduits();

  // Injecter les animations CSS
  injecterAnimations();
});

// Charger les produits depuis l'API
async function chargerProduits() {
  try {
    const response = await fetch(`${API_URL}/produits`);
    const data = await response.json();

    if (data?.success && Array.isArray(data.data)) {
      // Reset
      Object.keys(produitsParCategorie).forEach(key => delete produitsParCategorie[key]);
      categoriesAvecTop.clear();

      data.data.forEach((produit) => {
        const cat = produit?.categorie;
        if (!cat) return;

        if (!produitsParCategorie[cat]) {
          produitsParCategorie[cat] = [];
        }
        produitsParCategorie[cat].push(produit);

        if (produit.top_du_mois) {
          categoriesAvecTop.add(cat);
        }
      });
    }
  } catch (error) {
    console.error('❌ Erreur chargement produits:', error);
  }
}

// Style du bloc (liseret doré si TOP)
function getBlocStyle(categorie) {
  if (categoriesAvecTop.has(categorie)) {
    return {
      border: '3px solid #ffd700',
      boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
      position: 'relative'
    };
  }
  return { position: 'relative' };
}

// Nombre de produits par catégorie
function getProductCount(categorie) {
  return produitsParCategorie[categorie]?.length || 0;
}

// Nombre de produits TOP par catégorie
function getTopCount(categorie) {
  return produitsParCategorie[categorie]?.filter(p => p.top_du_mois).length || 0;
}

// HTML du badge compteur
function getCountBadgeHTML(categorie) {
  const count = getProductCount(categorie);
  const topCount = getTopCount(categorie);
  if (topCount > 0) {
    return `${count} produits<br><span style="color: #ffd700;">⭐ ${topCount} TOP</span>`;
  }
  return `${count} produits`;
}

// Afficher l'aperçu au survol
function afficherApercu(categorie, event) {
  const produits = produitsParCategorie[categorie];
  if (!produits || !produits.length) return;

  const topProduits = produits.filter(p => p.top_du_mois).slice(0, 3);
  const autresProduits = produits.filter(p => !p.top_du_mois).slice(0, 2);

  let contenuHTML = `<h4 style="margin: 0 0 10px 0; color: #ffd700;">📦 ${categorie}</h4>`;

  if (topProduits.length) {
    contenuHTML += '<div style="margin-bottom: 10px;"><strong style="color: #ffd700;">⭐ Top du mois:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
    topProduits.forEach(p => {
      contenuHTML += `<li style="margin: 3px 0;">${p.nom} ${p.prix ? '- ' + p.prix : ''}</li>`;
    });
    contenuHTML += '</ul></div>';
  }

  if (autresProduits.length) {
    contenuHTML += '<div><strong>Autres produits:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
    autresProduits.forEach(p => {
      contenuHTML += `<li style="margin: 3px 0;">${p.nom}</li>`;
    });
    contenuHTML += '</ul></div>';
  }

  contenuHTML += `<div style="margin-top: 10px; font-size: 12px; color: #aaa;">Cliquez pour voir tous les ${produits.length} produits →</div>`;

  apercuContent.value = contenuHTML;

  // Position
  const rect = event.currentTarget.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  apercuStyle.value = {
    position: 'absolute',
    background: 'rgba(0, 0, 0, 0.95)',
    color: 'white',
    padding: '15px',
    borderRadius: '10px',
    zIndex: 1000,
    minWidth: '250px',
    maxWidth: '350px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.3s ease',
    left: (scrollLeft + rect.right + 10) + 'px',
    top: (scrollTop + rect.top) + 'px'
  };

  apercuVisible.value = true;
}

// Masquer l'aperçu
function masquerApercu() {
  apercuVisible.value = false;
}

// Injecter les animations CSS
function injecterAnimations() {
  if (document.getElementById('animations-top-mois')) return;
  const style = document.createElement('style');
  style.id = 'animations-top-mois';
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}
</script>

<style scoped>
/*
  IMPORTANT: Utilise les classes CSS existantes de styles.min.css
  (.categories-container, .category-section, .container, .category-card, etc.)
*/

.intro {
  text-align: center;
  font-size: 1.1em;
  line-height: 1.6;
  margin: 20px auto;
  max-width: 800px;
  color: #ccc;
}
</style>
