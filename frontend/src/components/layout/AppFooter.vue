<template>
  <footer class="footer">
    <img src="/assets/images/banniere-pied.png" alt="Bannière" class="footer-banner">

    <div class="footer-links">
      <div class="footer-item">
        <img src="/assets/images/etoile-blanche.png" alt="Top du Mois" class="footer-icon">
        <router-link to="/top-du-mois">Top du Mois</router-link>
      </div>
      <div class="footer-item">
        <img src="/assets/images/logo-dokk-blanc.png" alt="Centre d'Administration" class="footer-icon">
        <router-link to="/admin">Centre d'Administration</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Pas de logique nécessaire pour le footer
</script>

<style scoped>
/*
  IMPORTANT: On utilise les classes CSS existantes (.footer, .footer-banner, etc.)
  Le style est défini dans styles.min.css
*/
</style>
