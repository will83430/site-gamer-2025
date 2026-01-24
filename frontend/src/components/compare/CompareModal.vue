<script setup>
import { useCompareStore } from '@/stores/compareStore';
import { useRouter } from 'vue-router';

const compareStore = useCompareStore();
const router = useRouter();

function goToComparePage() {
  compareStore.closeModal();
  router.push('/comparatif');
}

function removeProduct(productId) {
  compareStore.removeFromCompare(productId);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="compareStore.isModalOpen" class="modal-overlay" @click.self="compareStore.closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Comparaison ({{ compareStore.compareCount }}/{{ compareStore.maxItems }})</h2>
            <button class="btn-close" @click="compareStore.closeModal">&times;</button>
          </div>

          <div class="modal-body">
            <div v-if="compareStore.compareCount === 0" class="empty-state">
              <p>Aucun produit dans la comparaison</p>
              <p class="hint">Cliquez sur "Comparer" sur les fiches produits pour les ajouter</p>
            </div>

            <div v-else class="compare-grid">
              <div
                v-for="product in compareStore.compareList"
                :key="product.id"
                class="compare-item"
              >
                <button class="btn-remove" @click="removeProduct(product.id)">
                  &times;
                </button>
                <img
                  :src="`/assets/images/${product.image || 'placeholder.png'}`"
                  :alt="product.nom"
                  class="product-image"
                />
                <h4 class="product-name">{{ product.nom }}</h4>
                <span class="product-category">{{ product.categorie }}</span>
                <span class="product-price">{{ product.prix }} &euro;</span>
              </div>

              <!-- Emplacements vides -->
              <div
                v-for="i in (compareStore.maxItems - compareStore.compareCount)"
                :key="`empty-${i}`"
                class="compare-item empty"
              >
                <div class="empty-placeholder">
                  <span class="plus-icon">+</span>
                  <span>Ajouter un produit</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button
              class="btn btn-secondary"
              @click="compareStore.clearCompare"
              :disabled="compareStore.compareCount === 0"
            >
              Vider la liste
            </button>
            <button
              class="btn btn-primary"
              @click="goToComparePage"
              :disabled="!compareStore.canCompare"
            >
              Comparer ({{ compareStore.compareCount }} produits)
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4em;
}

.btn-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 1;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.empty-state p {
  margin: 0;
  font-size: 1.1em;
}

.empty-state .hint {
  margin-top: 10px;
  font-size: 0.9em;
  color: #999;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .compare-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.compare-item {
  position: relative;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  border: 2px solid #e9ecef;
  transition: all 0.3s;
}

.compare-item:not(.empty):hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.compare-item.empty {
  border-style: dashed;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #aaa;
}

.plus-icon {
  font-size: 32px;
  font-weight: 300;
}

.btn-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff4757;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.btn-remove:hover {
  transform: scale(1.1);
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 12px;
  border-radius: 8px;
  background: white;
}

.product-name {
  margin: 0 0 8px;
  font-size: 0.95em;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  display: block;
  font-size: 0.8em;
  color: #667eea;
  margin-bottom: 4px;
}

.product-price {
  display: block;
  font-weight: 600;
  color: #333;
}

.modal-footer {
  padding: 16px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e9ecef;
  color: #666;
}

.btn-secondary:hover:not(:disabled) {
  background: #dee2e6;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(-20px);
}
</style>
