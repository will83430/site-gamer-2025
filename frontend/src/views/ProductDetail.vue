<template>
  <div>
    <!-- En-tête identique aux autres pages -->
    <div class="entete">
      <img src="/assets/images/gaming.png" alt="Gaming" class="logo-gaming">
      <a class="lien-entete" href="#" @click.prevent="goBack">← Retour</a>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" message="Chargement du produit..." />

    <!-- Erreur -->
    <ErrorMessage
      v-else-if="error"
      type="error"
      :message="error"
      show-retry
      @retry="loadProduct"
    />

    <!-- Contenu produit -->
    <template v-else-if="product">
      <!-- Titre -->
      <h1 class="product-title">{{ product.titre_affiche || product.nom }}</h1>

      <!-- Badge top du mois -->
      <div v-if="product.top_du_mois" id="badge-top-mois">
        <div style="background: linear-gradient(45deg, #ffd700, #ffed4e); padding: 10px; margin-bottom: 20px; text-align: center; border-radius: 8px; font-weight: bold;">
          ⭐ Ce produit est en vedette ce mois-ci !
        </div>
      </div>

      <!-- Description -->
      <p v-if="product.description" class="description">
        {{ product.description }}
      </p>

      <!-- Image produit -->
      <div class="gallery">
        <img
          :src="getImageUrl(product)"
          :alt="product.nom"
          class="img-centree"
          @error="handleImageError"
        />
      </div>

      <!-- Lightbox (pour zoom) -->
      <div class="lightbox" id="lightbox">
        <img id="lightbox-img" src="" alt="Zoom">
      </div>

      <!-- Contenu de la fiche (sections dynamiques) -->
      <div id="product-content">
        <!-- Prix affiché en premier si non présent dans donnees_fiche -->
        <p v-if="shouldDisplaySeparatePrice">
          <strong>💰 Prix :</strong> {{ product.prix }}
        </p>

        <!-- Sections depuis donnees_fiche -->
        <template v-for="(section, index) in formattedSections" :key="index">
          <div v-if="section.titre" style="margin: 20px 0; text-align: center;">
            <h3 style="color: white; margin-bottom: 10px; font-weight: bold;">{{ section.titre }}</h3>
            <p v-html="section.contenu"></p>
          </div>
          <p v-else v-html="section.contenu"></p>
        </template>

        <p v-if="formattedSections.length === 0">Informations détaillées à venir...</p>
      </div>

      <!-- Bouton tendances si catégorie disponible -->
      <div v-if="product.categorie" class="tendances-btn-bottom" style="text-align: center; margin: 30px 0;">
        <router-link
          :to="`/tendances/${getCategorySlug(product.categorie)}`"
          class="btn btn-tendances"
        >
          📊 Voir les tendances {{ formatCategory(product.categorie) }}
        </router-link>
      </div>
    </template>

    <AppFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppFooter from '@components/layout/AppFooter.vue';
import LoadingSpinner from '@components/common/LoadingSpinner.vue';
import ErrorMessage from '@components/common/ErrorMessage.vue';

const route = useRoute();
const router = useRouter();

const product = ref(null);
const loading = ref(false);
const error = ref(null);

// ID du produit depuis l'URL
const productId = computed(() => route.params.id);

// Charger les données du produit
async function loadProduct() {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch('http://localhost:3000/api/produits');

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      // Chercher le produit par nom (ID correspond au nom du fichier)
      const foundProduct = data.data.find(p =>
        p.nom && p.nom.toLowerCase() === productId.value.toLowerCase()
      );

      if (foundProduct) {
        product.value = foundProduct;
      } else {
        throw new Error(`Produit "${productId.value}" non trouvé`);
      }
    } else {
      throw new Error('Erreur de chargement des données');
    }
  } catch (err) {
    error.value = err.message;
    console.error('❌ Erreur chargement produit:', err);
  } finally {
    loading.value = false;
  }
}

// Sections formatées depuis donnees_fiche
const formattedSections = computed(() => {
  if (!product.value?.donnees_fiche || product.value.donnees_fiche.length === 0) {
    return [];
  }

  return product.value.donnees_fiche.map(contenu => {
    if (!contenu || contenu.trim().length === 0) return null;

    // Nettoyer les \n échappés
    const contenuNettoye = contenu.replace(/\\n/g, '\n');

    let titre = '';
    let texte = '';

    if (contenuNettoye.includes('\n')) {
      // Format avec emoji: "🧩 Titre\nContenu"
      const parties = contenuNettoye.split('\n');
      titre = parties[0];
      texte = parties.slice(1).join('\n').trim();
    } else {
      // Format texte simple sans titre
      texte = contenu.trim();
    }

    return {
      titre,
      contenu: texte.replace(/\n/g, '<br>')
    };
  }).filter(section => section !== null && section.contenu.length > 0);
});

// Vérifier si on doit afficher le prix séparément
const shouldDisplaySeparatePrice = computed(() => {
  if (!product.value?.prix) return false;

  // Ne pas afficher si déjà présent dans donnees_fiche
  const hasPriceInSections = product.value.donnees_fiche?.some(
    d => d.includes('€') || d.includes('💰 Prix')
  );

  return !hasPriceInSections;
});

// Obtenir l'URL de l'image
function getImageUrl(product) {
  if (product.image_url) {
    return product.image_url;
  }

  if (product.image) {
    const clean = product.image.replace(/^assets\/images\//, '');
    return `/assets/images/${clean}`;
  }

  return '/assets/images/placeholder.png';
}

// Gestion erreur image
function handleImageError(event) {
  event.target.src = '/assets/images/placeholder.png';
}

// Formater le nom de catégorie pour l'affichage
function formatCategory(category) {
  if (!category) return '';

  return category
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Convertir la catégorie en slug pour l'URL
function getCategorySlug(category) {
  if (!category) return '';

  // Mapping des catégories vers les slugs d'URL
  const slugMapping = {
    'DRONE': 'drone',
    'PC GAMING': 'pc-gaming',
    'SMARTPHONE': 'smartphone',
    'TABLETTE': 'tablette',
    'CONSOLE': 'console',
    'SERVEUR': 'serveur',
    'CASQUE AUDIO': 'casque-audio',
    'CASQUE VR': 'casque-vr',
    'MONTRE CONNECTEE': 'montre-connectee',
    'IMPRIMANTE 3D': 'imprimante-3d',
    'ECRAN TV': 'ecran-tv',
    'CAMERA': 'camera',
    'PERIPHERIQUES': 'peripheriques',
    'VIDEO PROJECTEUR': 'video-projecteur',
    'BOX INTERNET': 'box-internet',
    'TABLEAU INTERACTIF': 'tableau-interactif'
  };

  return slugMapping[category.toUpperCase()] || category.toLowerCase().replace(/\s+/g, '-');
}

// Retour à la liste
function goBack() {
  const from = route.query.from;
  const categorie = route.query.categorie;
  if (from === 'top-du-mois') {
    router.push('/top-du-mois');
  } else if (categorie) {
    router.push({ path: '/produits', query: { categorie } });
  } else {
    // Fallback universel : retour navigateur natif
    window.history.length > 1 ? window.history.back() : router.push('/');
  }
}


// Recharger quand l'ID du produit change (navigation entre produits)
watch(productId, () => {
  loadProduct();
});

// Recharger à chaque changement de route (y compris navigation interne ou accès direct)
watch(() => route.fullPath, () => {
  console.log('[DEBUG] route.fullPath:', route.fullPath, '| route.query:', route.query, '| productId:', productId.value);
  loadProduct();
});

// Charger au montage
onMounted(() => {
  document.body.classList.add('fiches-page');
  loadProduct();
  // Log des paramètres pour debug navigation
  console.log('[DEBUG ProductDetail] Param from:', route.query.from, '| categorie:', route.query.categorie);
});
</script>

<style scoped>
/*
  IMPORTANT: Utilise les classes CSS existantes de styles.min.css
  (.entete, .gallery, .description, .product-title, .lien-entete, .footer, etc.)
*/

/* Bouton tendances */
.btn-tendances {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-tendances:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

/* Lightbox (zoom image) */
.lightbox {
  display: none;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  cursor: pointer;
}

.lightbox img {
  max-width: 90%;
  max-height: 90%;
  margin: auto;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
