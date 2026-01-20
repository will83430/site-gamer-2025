import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCompareStore = defineStore('compare', () => {
  // État (pas de persistance - reset à chaque visite)
  const compareList = ref([]);
  const maxItems = 4; // Maximum 4 produits à comparer
  const isModalOpen = ref(false);

  // Getters
  const compareCount = computed(() => compareList.value.length);
  const canCompare = computed(() => compareList.value.length >= 2);
  const isFull = computed(() => compareList.value.length >= maxItems);
  const compareIds = computed(() => compareList.value.map(p => p.id));

  // Actions
  function addToCompare(product) {
    if (isFull.value) {
      return { success: false, message: `Maximum ${maxItems} produits` };
    }
    if (isInCompare(product.id)) {
      return { success: false, message: 'Produit déjà dans la comparaison' };
    }
    compareList.value.push(product);
    return { success: true, message: 'Produit ajouté à la comparaison' };
  }

  function removeFromCompare(productId) {
    const index = compareList.value.findIndex(p => p.id === productId);
    if (index > -1) {
      compareList.value.splice(index, 1);
      return { success: true, message: 'Produit retiré de la comparaison' };
    }
    return { success: false, message: 'Produit non trouvé' };
  }

  function toggleCompare(product) {
    if (isInCompare(product.id)) {
      return removeFromCompare(product.id);
    }
    return addToCompare(product);
  }

  function isInCompare(productId) {
    return compareList.value.some(p => p.id === productId);
  }

  function clearCompare() {
    compareList.value = [];
  }

  function openModal() {
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
  }

  return {
    // État
    compareList,
    maxItems,
    isModalOpen,
    // Getters
    compareCount,
    canCompare,
    isFull,
    compareIds,
    // Actions
    addToCompare,
    removeFromCompare,
    toggleCompare,
    isInCompare,
    clearCompare,
    openModal,
    closeModal,
  };
});
