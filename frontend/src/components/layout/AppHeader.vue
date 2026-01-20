<template>
  <div class="entete">
    <img src="/assets/images/gaming.png" alt="Gaming" class="logo-gaming">
    <!-- Page d'accueil : lien vers Top du Mois -->
    <router-link v-if="isHomePage" to="/top-du-mois" class="lien-top">
      Cliquer ici pour voir les Tops du Moment
    </router-link>
    <!-- Autres pages : lien vers Accueil -->
    <router-link v-else to="/" class="lien-entete">
      Accueil
    </router-link>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Détecte si on est sur la page d'accueil
const isHomePage = computed(() => route.path === '/' || route.path === '/accueil');
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes de styles.min.css
  - .entete : conteneur de l'en-tête
  - .logo-gaming : style du logo
  - .lien-top : lien vers Top du Mois (page accueil)
  - .lien-entete : lien vers Accueil (autres pages)
*/
</style>
