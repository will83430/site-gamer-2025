<script setup>
import { useCompareStore } from '@/stores/compareStore';

const compareStore = useCompareStore();
</script>

<template>
  <Transition name="bounce">
    <button
      v-if="compareStore.compareCount > 0"
      class="compare-floating-btn"
      @click="compareStore.openModal"
      :title="`${compareStore.compareCount} produit(s) à comparer`"
    >
      <span class="icon">&#x2696;</span>
      <span class="badge">{{ compareStore.compareCount }}</span>
    </button>
  </Transition>
</template>

<style scoped>
.compare-floating-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 900;
}

.compare-floating-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(102, 126, 234, 0.5);
}

.icon {
  font-size: 24px;
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff4757;
  color: white;
  font-size: 12px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* Animation */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
