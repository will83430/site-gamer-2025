import { createRouter, createWebHistory } from 'vue-router';

// Import des vues (lazy loading pour performance)
const Home = () => import('@views/Home.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Accueil - Site Gamer 2025',
      },
    },
    // Les autres routes seront ajoutées progressivement
  ],
});

// Mise à jour du titre de la page
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Site Gamer 2025';
  next();
});

export default router;
