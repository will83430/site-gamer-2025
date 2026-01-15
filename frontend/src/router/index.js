import { createRouter, createWebHistory } from 'vue-router';

// Import des vues (lazy loading pour performance)
const Home = () => import('@views/Home.vue');
const Products = () => import('@views/Products.vue');
const ProductDetail = () => import('@views/ProductDetail.vue');
const TopOfMonth = () => import('@views/TopOfMonth.vue');
const TrendPage = () => import('@views/TrendPage.vue');

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top immédiatement au changement de route
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Accueil - Site Gamer 2025',
      },
    },
    {
      path: '/produits',
      name: 'products',
      component: Products,
      meta: {
        title: 'Produits - Site Gamer 2025',
      },
    },
    {
      path: '/produit/:id',
      name: 'product-detail',
      component: ProductDetail,
      meta: {
        title: 'Détail Produit - Site Gamer 2025',
      },
    },
    {
      path: '/top-du-mois',
      name: 'top-of-month',
      component: TopOfMonth,
      meta: {
        title: '🔥 Top du Mois - Site Gamer 2025',
      },
    },
    {
      path: '/tendances/:categorie',
      name: 'tendances',
      component: TrendPage,
      meta: {
        title: 'Tendances - Site Gamer 2025',
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

// Précharger les routes au hover
router.afterEach((to) => {
  // Preload adjacent routes
  if (to.name === 'home') {
    import('@views/Products.vue');
    import('@views/TopOfMonth.vue');
  } else if (to.name === 'products') {
    import('@views/Home.vue');
    import('@views/ProductDetail.vue');
  }
});

export default router;