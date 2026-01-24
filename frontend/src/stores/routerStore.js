import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useRouterStore = defineStore('router', () => {
  const isLoading = ref(false);
  const router = useRouter();

  // Démarrer le loading au changement de route
  router.beforeEach((to, from, next) => {
    isLoading.value = true;
    next();
  });

  // Arrêter le loading une fois la page chargée
  router.afterEach(() => {
    // Utiliser nextTick pour s'assurer que le DOM est à jour
    setTimeout(() => {
      isLoading.value = false;
    }, 100);
  });

  return {
    isLoading,
  };
});
