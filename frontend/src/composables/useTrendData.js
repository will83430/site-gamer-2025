import { ref } from 'vue';

// Cache pour éviter les requêtes dupliquées
const dataCache = new Map();
const pendingRequests = new Map();

/**
 * Hook personnalisé pour charger et mettre en cache les données de tendances
 * Évite les requêtes dupliquées et le rechargement inutile
 */
export function useTrendData() {
  const loading = ref(false);
  const error = ref(null);

  /**
   * Fetch avec cache et déduplication
   */
  async function fetchWithCache(cacheKey, fetchFn) {
    // Retourner depuis le cache si présent
    if (dataCache.has(cacheKey)) {
      return dataCache.get(cacheKey);
    }

    // Attendre la requête en cours si elle existe
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    // Créer et stocker la promesse en cours
    const promise = (async () => {
      try {
        const data = await fetchFn();
        dataCache.set(cacheKey, data);
        return data;
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, promise);
    return promise;
  }

  /**
   * Charger les actualités
   */
  async function loadActualites(categorie) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`/api/${categorie}/actualites`);
      if (!res.ok) throw new Error('Erreur API actualités');
      return await res.json();
    } catch (err) {
      error.value = 'Impossible de charger les actualités';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Charger les technologies
   */
  async function loadTechnologies(categorie) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`/api/${categorie}/technologies`);
      if (!res.ok) throw new Error('Erreur API technologies');
      return await res.json();
    } catch (err) {
      error.value = 'Impossible de charger les technologies';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Charger le marché et les insights en parallèle
   */
  async function loadMarketData(categorie) {
    loading.value = true;
    error.value = null;
    try {
      const [marche, insights] = await Promise.all([
        (async () => {
          const res = await fetch(`/api/${categorie}/marche`);
          if (!res.ok) throw new Error('Erreur API marché');
          return res.json();
        })(),
        (async () => {
          const res = await fetch(`/api/${categorie}/insights`);
          if (!res.ok) throw new Error('Erreur API insights');
          return res.json();
        })(),
      ]);
      return { marche, insights };
    } catch (err) {
      error.value = 'Impossible de charger les données de marché';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Charger les prédictions
   */
  async function loadPredictions(categorie) {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`/api/${categorie}/predictions`);
      if (!res.ok) throw new Error('Erreur API prédictions');
      return await res.json();
    } catch (err) {
      error.value = 'Impossible de charger les prédictions';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Invalider le cache pour une catégorie
   */
  function invalidateCache(categorie) {
    const keysToDelete = Array.from(dataCache.keys()).filter(key =>
      key.startsWith(categorie)
    );
    keysToDelete.forEach(key => dataCache.delete(key));
  }

  /**
   * Vider tout le cache
   */
  function clearCache() {
    dataCache.clear();
    pendingRequests.clear();
  }

  return {
    loading,
    error,
    fetchWithCache,
    loadActualites,
    loadTechnologies,
    loadMarketData,
    loadPredictions,
    invalidateCache,
    clearCache,
  };
}
