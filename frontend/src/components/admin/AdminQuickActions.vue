<template>
  <div class="quick-actions">
    <h2>⚡ Actions Rapides</h2>

    <div class="actions-grid">
      <template v-for="action in actions" :key="action.id">
        <!-- Router link interne -->
        <router-link
          v-if="action.to"
          :to="action.to"
          class="action-btn"
        >
          <span class="action-icon">{{ action.icon }}</span>
          <span>{{ action.label }}</span>
        </router-link>

        <!-- Lien externe -->
        <a
          v-else-if="action.href"
          :href="action.href"
          class="action-btn"
        >
          <span class="action-icon">{{ action.icon }}</span>
          <span>{{ action.label }}</span>
        </a>

        <!-- Action bouton -->
        <button
          v-else-if="action.action"
          class="action-btn"
          @click="$emit('action', action.action)"
        >
          <span class="action-icon">{{ action.icon }}</span>
          <span>{{ action.label }}</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  actions: {
    type: Array,
    default: () => []
  }
});

defineEmits(['action']);
</script>

<style scoped>
.quick-actions {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.quick-actions h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-family: 'Montserrat', sans-serif;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 1rem;
  background: linear-gradient(135deg, #f8f9ff, #e8ecff);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  font-family: inherit;
}

.action-btn:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.action-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.action-btn:hover .action-icon {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
