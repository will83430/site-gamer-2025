<template>
  <div class="tool-card">
    <div class="tool-icon">{{ icon }}</div>
    <h3 class="tool-title">{{ title }}</h3>
    <p class="tool-description">{{ description }}</p>

    <ul class="tool-features">
      <li v-for="(feature, index) in features" :key="index">
        {{ feature }}
      </li>
    </ul>

    <div class="tool-buttons">
      <template v-for="button in buttons" :key="button.label">
        <!-- Lien externe -->
        <a
          v-if="button.href"
          :href="button.href"
          class="tool-button"
          :class="getButtonClass(button.style)"
        >
          {{ button.label }}
        </a>
        <!-- Action interne -->
        <button
          v-else-if="button.action"
          class="tool-button"
          :class="getButtonClass(button.style)"
          @click="$emit('action', button.action)"
        >
          {{ button.label }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: Array,
    default: () => []
  },
  buttons: {
    type: Array,
    default: () => []
  }
});

defineEmits(['action']);

function getButtonClass(style) {
  const classes = {
    primary: 'btn-primary',
    orange: 'btn-orange',
    purple: 'btn-purple',
    red: 'btn-red',
    green: 'btn-green',
    blue: 'btn-blue'
  };
  return classes[style] || 'btn-primary';
}
</script>

<style scoped>
.tool-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.2);
  position: relative;
  overflow: hidden;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.tool-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
}

.tool-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.tool-title {
  color: #333;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.tool-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.tool-features {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.tool-features li {
  color: #555;
  margin-bottom: 0.5rem;
  padding-left: 1.5rem;
  position: relative;
}

.tool-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.tool-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tool-button {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: white;
}

.tool-button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2, #667eea);
}

.btn-orange {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
}

.btn-orange:hover {
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.btn-purple {
  background: linear-gradient(135deg, #9c27b0, #673ab7);
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
}

.btn-purple:hover {
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
}

.btn-red {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3);
}

.btn-red:hover {
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
}

.btn-green {
  background: linear-gradient(135deg, #4caf50, #45a049);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.btn-green:hover {
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.btn-blue {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.btn-blue:hover {
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}
</style>
