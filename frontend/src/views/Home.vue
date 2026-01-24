<template>
  <div>
    <!-- Header avec logo et navigation -->
    <AppHeader />

    <!-- Contenu principal (reproduction exacte de index.html) -->
    <main>
      <!-- Message de bienvenue avec le mois -->
      <div id="date-mois" class="date-mois">✨ Bienvenue en {{ currentMonthYear }}</div>

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

    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppHeader from '@components/layout/AppHeader.vue';
import AppFooter from '@components/layout/AppFooter.vue';

const currentMonthYear = ref('');

onMounted(() => {
  const mois = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const maintenant = new Date();
  currentMonthYear.value = `${mois[maintenant.getMonth()]} ${maintenant.getFullYear()}`;
});
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes de styles.min.css
  Le CSS global (.description-principale, h1, etc.) gère déjà tout le style
*/

.video-intro {
  padding: 0;
  display: block;
  margin: 0 auto 35px auto;
  border-radius: 60px;
}
</style>
