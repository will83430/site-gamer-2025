<template>
  <div class="entete">
    <img src="/assets/images/gaming.png" alt="Gaming" />
    <router-link to="/top-du-mois" class="lien-top">
      Cliquer ici pour voir les Tops du Moment
    </router-link>
  </div>
  <div id="date-mois">{{ currentDate }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentDate = ref('');

onMounted(() => {
  // Format de date identique à l'existant
  const date = new Date();
  const mois = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  currentDate.value = `${mois[date.getMonth()]} ${date.getFullYear()}`;
});
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes
  Le style est défini dans styles.min.css
  Pas de nouveau style ici, on réutilise l'existant
*/
</style>
