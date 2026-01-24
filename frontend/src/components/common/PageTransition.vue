<template>
  <div 
    v-if="isLoading"
    class="page-transition-overlay"
  >
    <div class="page-transition-bar"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouterStore } from '@stores/routerStore';

const routerStore = useRouterStore();
const isLoading = computed(() => routerStore.isLoading);
</script>

<style scoped>
.page-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  pointer-events: none;
  background: transparent;
}

.page-transition-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  animation: loading-bar 0.5s ease-out forwards;
  width: 100%;
}

@keyframes loading-bar {
  from {
    opacity: 1;
    width: 0;
  }
  to {
    opacity: 0;
    width: 100%;
  }
}
</style>
