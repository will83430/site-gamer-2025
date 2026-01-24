<template>
  <div class="error-message" :class="type">
    <div class="error-icon">{{ icon }}</div>
    <div class="error-content">
      <h3 v-if="title">{{ title }}</h3>
      <p>{{ message }}</p>
      <button v-if="showRetry" @click="$emit('retry')" class="btn-retry">
        🔄 Réessayer
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'error', // 'error', 'warning', 'info'
    validator: (value) => ['error', 'warning', 'info'].includes(value),
  },
  showRetry: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['retry']);

const icon = computed(() => {
  switch (props.type) {
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '❌';
  }
});
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.error-message.error {
  background: #ffe6e6;
  border-left: 4px solid #dc3545;
}

.error-message.warning {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}

.error-message.info {
  background: #e7f3ff;
  border-left: 4px solid #17a2b8;
}

.error-icon {
  font-size: 2em;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
}

.error-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.1em;
  color: #333;
}

.error-content p {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.5;
}

.btn-retry {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #5568d3;
}
</style>
