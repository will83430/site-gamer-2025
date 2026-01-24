<template>
  <div id="app">
    <!-- Le RouterView affichera les pages selon la route -->
    <RouterView :key="$route.fullPath" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
</script>

<style>
/*
  IMPORTANT: On n'ajoute PAS de CSS ici !
  Le CSS existant dans /assets/css/styles.min.css est déjà chargé dans index.html
  On garde tout le style existant intact
*/
</style>
