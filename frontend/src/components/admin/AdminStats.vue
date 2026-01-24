<template>
  <div class="stats-section">
    <div class="stats-header">
      <h2>📊 Aperçu Global</h2>
      <button class="refresh-btn" @click="$emit('refresh')" :disabled="loading">
        <span :class="{ spinning: loading }">🔄</span>
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-number">
          <span v-if="loading" class="loading-icon">⏳</span>
          <span v-else>{{ stats.totalProducts }}</span>
        </div>
        <div class="stat-label">Produits Gaming</div>
      </div>

      <div class="stat-item">
        <div class="stat-number">
          <span v-if="loading" class="loading-icon">⏳</span>
          <span v-else>{{ stats.totalTrends }}</span>
        </div>
        <div class="stat-label">Articles Tendances</div>
      </div>

      <div class="stat-item">
        <div class="stat-number">
          <span v-if="loading" class="loading-icon">⏳</span>
          <span v-else>{{ stats.totalCategories }}</span>
        </div>
        <div class="stat-label">Catégories Actives</div>
      </div>

      <div class="stat-item">
        <div class="stat-number">
          <span v-if="loading" class="loading-icon">⏳</span>
          <span v-else>{{ stats.featuredCount }}</span>
        </div>
        <div class="stat-label">Top du Mois</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['refresh']);
</script>

<style scoped>
.stats-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.stats-header h2 {
  color: #333;
  font-family: 'Montserrat', sans-serif;
  margin: 0;
}

.refresh-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.refresh-btn:hover {
  transform: scale(1.1);
}

.refresh-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9ff, #e8ecff);
  border-radius: 15px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.loading-icon {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
