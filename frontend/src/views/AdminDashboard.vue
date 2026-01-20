<template>
  <div class="admin-page">
    <!-- Header Admin -->
    <div class="admin-header">
      <h1>🎯 Centre d'Administration</h1>
      <p>Gestion complète de votre site gaming - Tous vos outils en un seul endroit</p>
    </div>

    <div class="admin-container">
      <!-- Statistiques rapides -->
      <AdminStats
        :stats="stats"
        :loading="loadingStats"
        @refresh="loadAllStats"
      />

      <!-- Outils principaux -->
      <div class="tools-grid">
        <AdminToolCard
          v-for="tool in tools"
          :key="tool.id"
          :icon="tool.icon"
          :title="tool.title"
          :description="tool.description"
          :features="tool.features"
          :buttons="tool.buttons"
          @action="handleToolAction"
        />
      </div>

      <!-- Actions rapides -->
      <AdminQuickActions
        :actions="quickActions"
        @action="handleQuickAction"
      />
    </div>

    <!-- Footer Admin -->
    <div class="footer-admin">
      <p>
        🎯 <strong>Site Gamer 2025</strong> - Interface d'administration
      </p>
      <div class="footer-links">
        <router-link to="/">🏠 Accueil</router-link>
        <router-link to="/top-du-mois">⭐ Vitrine</router-link>
        <a href="mailto:admin@site-gamer.com">📧 Support</a>
      </div>
    </div>

    <!-- Notification Toast -->
    <Transition name="slide">
      <div
        v-if="notification.show"
        class="admin-notification"
        :class="notification.type"
      >
        {{ notification.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import AdminStats from '@/components/admin/AdminStats.vue';
import AdminToolCard from '@/components/admin/AdminToolCard.vue';
import AdminQuickActions from '@/components/admin/AdminQuickActions.vue';

const API_URL = 'http://localhost:3000/api';

// État des statistiques
const loadingStats = ref(true);
const stats = reactive({
  totalProducts: 0,
  totalTrends: 0,
  totalCategories: 0,
  featuredCount: 0
});

// Notification
const notification = reactive({
  show: false,
  message: '',
  type: 'info'
});

// Configuration des outils
const tools = [
  {
    id: 'products',
    icon: '📦',
    title: 'Gestion des Produits',
    description: 'Interface complète pour gérer votre catalogue de produits gaming avec génération automatique de fiches.',
    features: [
      'Création et modification de produits',
      'Upload d\'images avec drag & drop',
      'Génération automatique de fiches HTML',
      'Gestion des catégories et spécifications',
      'Système de "Top du mois"'
    ],
    buttons: [
      { label: '🚀 Interface Admin', href: '/Gestion des produits et génération automatique.html', style: 'primary' }
    ]
  },
  {
    id: 'trends',
    icon: '📈',
    title: 'Gestion des Tendances',
    description: 'Dashboard avancé pour gérer vos articles de tendances avec système de sections personnalisables.',
    features: [
      'Création d\'articles dynamiques',
      'Gestion des sections par article',
      'Tri et filtrage avancé',
      'Prévisualisation en temps réel',
      'Actions en lot'
    ],
    buttons: [
      { label: '🎯 Dashboard Avancé', href: '/admin-tendances-advanced.html', style: 'primary' },
      { label: '📊 Dashboard Simple', href: '/admin-tendances.html', style: 'orange' }
    ]
  },
  {
    id: 'docs',
    icon: '📚',
    title: 'Documentation & Wiki',
    description: 'Documentation complète du projet avec guides, API et architectures.',
    features: [
      'Guide d\'installation',
      'Référence API complète',
      'Architecture du système',
      'Workflow de développement',
      'Troubleshooting'
    ],
    buttons: [
      { label: '📖 Wiki Principal', href: '/wiki/wiki.html', style: 'primary' },
      { label: '🔌 API Docs', href: '/wiki/api-reference.html', style: 'purple' }
    ]
  },
  {
    id: 'maintenance',
    icon: '🛠️',
    title: 'Outils de Maintenance',
    description: 'Scripts et outils pour maintenir, optimiser et vérifier l\'intégrité de votre système.',
    features: [
      'Tests automatisés',
      'Vérification d\'intégrité',
      'Nettoyage cache',
      'Normalisation données',
      'Monitoring système'
    ],
    buttons: [
      { label: '🧪 Suite de Tests', href: '/scripts/maintenance/test-suite.html', style: 'primary' },
      { label: '🗑️ Clear Cache', href: '/scripts/maintenance/clear-cache.html', style: 'red' },
      { label: '🔗 Intégrité Liens', href: '/scripts/maintenance/rapport-integrite-liens.html', style: 'green' }
    ]
  },
  {
    id: 'scripts',
    icon: '⚙️',
    title: 'Scripts & Automatisation',
    description: 'Scripts Node.js pour automatiser les tâches de gestion et de maintenance.',
    features: [
      'Régénération massive',
      'Mise à jour données',
      'Backup automatique',
      'Migration scripts',
      'Batch processing'
    ],
    buttons: [
      { label: '✅ Vérifier BDD', action: 'checkDatabase', style: 'blue' }
    ]
  }
];

// Actions rapides
const quickActions = [
  { id: 'home', icon: '🏠', label: 'Retour au site', to: '/' },
  { id: 'index', icon: '🎮', label: 'Page d\'accueil', href: '/index.html' },
  { id: 'top', icon: '⭐', label: 'Voir les Top du Mois', to: '/top-du-mois' },
  { id: 'fiches', icon: '📋', label: 'Toutes les fiches', to: '/produits' },
  { id: 'wiki', icon: '📚', label: 'Documentation', href: '/wiki/wiki.html' },
  { id: 'refresh', icon: '🔄', label: 'Actualiser les stats', action: 'refreshStats' },
  { id: 'status', icon: '💡', label: 'État du système', action: 'showStatus' },
  { id: 'check', icon: '🔧', label: 'Check système', action: 'runCheck' }
];

// Charger les statistiques
async function loadAllStats() {
  loadingStats.value = true;

  try {
    // Charger les produits
    const productsRes = await fetch(`${API_URL}/produits`);
    if (productsRes.ok) {
      const result = await productsRes.json();
      const products = result.data || result;

      stats.totalProducts = result.total || (Array.isArray(products) ? products.length : 0);

      if (Array.isArray(products)) {
        stats.featuredCount = products.filter(p => p.top_du_mois).length;
        const categories = [...new Set(products.map(p => p.categorie))];
        stats.totalCategories = categories.length;
      }
    }

    // Charger les tendances
    const trendsRes = await fetch(`${API_URL}/drone/actualites`);
    if (trendsRes.ok) {
      const trends = await trendsRes.json();
      stats.totalTrends = Array.isArray(trends) ? trends.length : 0;
    }
  } catch (error) {
    console.error('Erreur chargement stats:', error);
    showNotification('❌ Erreur lors du chargement des statistiques', 'error');
  } finally {
    loadingStats.value = false;
  }
}

// Afficher une notification
function showNotification(message, type = 'info') {
  notification.message = message;
  notification.type = type;
  notification.show = true;

  setTimeout(() => {
    notification.show = false;
  }, 4000);
}

// Vérifier la base de données
async function checkDatabase() {
  showNotification('🔍 Vérification de la base de données...', 'info');

  try {
    const response = await fetch(`${API_URL}/produits`);

    if (response.ok) {
      const result = await response.json();
      const products = result.data || result;
      const count = Array.isArray(products) ? products.length : (result.total || 0);

      // Test API tendances
      const trendsRes = await fetch(`${API_URL}/drone/actualites`);

      if (trendsRes.ok) {
        showNotification(`✅ Base de données fonctionnelle - ${count} produits • API tendances OK`, 'success');
      } else {
        showNotification(`⚠️ Base de données OK (${count} produits) mais API tendances inaccessible`, 'warning');
      }
    } else {
      showNotification(`❌ Impossible d'accéder à la base de données (status: ${response.status})`, 'error');
    }
  } catch (error) {
    showNotification(`❌ Erreur de connexion: ${error.message}`, 'error');
  }
}

// Vérifier l'état du système
async function showSystemStatus() {
  try {
    const response = await fetch(`${API_URL}/produits`);
    if (response.ok) {
      showNotification('✅ Système opérationnel - Base de données connectée', 'success');
    } else {
      showNotification('⚠️ Problème de connexion détecté', 'warning');
    }
  } catch (error) {
    showNotification('❌ Serveur inaccessible', 'error');
  }
}

// Check système complet
async function runMaintenanceCheck() {
  showNotification('🔧 Vérification système en cours...', 'info');

  const checks = [
    { name: 'Base de données', url: `${API_URL}/produits` },
    { name: 'API Tendances', url: `${API_URL}/drone/actualites` },
    { name: 'Fichiers assets', url: '/assets/css/styles.min.css' }
  ];

  let allGood = true;

  for (const check of checks) {
    try {
      const response = await fetch(check.url);
      if (!response.ok) {
        allGood = false;
        showNotification(`⚠️ ${check.name}: Problème détecté`, 'warning');
      }
    } catch (error) {
      allGood = false;
      showNotification(`❌ ${check.name}: Inaccessible`, 'error');
    }
  }

  if (allGood) {
    showNotification('✅ Tous les systèmes sont opérationnels!', 'success');
  }
}

// Gérer les actions des outils
function handleToolAction(action) {
  if (action === 'checkDatabase') {
    checkDatabase();
  }
}

// Gérer les actions rapides
function handleQuickAction(action) {
  switch (action) {
    case 'refreshStats':
      loadAllStats();
      showNotification('✅ Statistiques actualisées !', 'success');
      break;
    case 'showStatus':
      showSystemStatus();
      break;
    case 'runCheck':
      runMaintenanceCheck();
      break;
  }
}

onMounted(() => {
  loadAllStats();
});
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.admin-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.admin-header h1 {
  color: #667eea;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.admin-header p {
  color: #666;
  font-size: 1.2rem;
  font-weight: 400;
  margin: 0 auto;
  text-align: center !important;
  width: 100%;
  display: block;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-admin {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
  margin-top: 3rem;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
}

.footer-admin p {
  color: #666;
  margin-bottom: 1rem;
}

.footer-links a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  margin: 0 1rem;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #764ba2;
}

/* Notification */
.admin-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  max-width: 350px;
}

.admin-notification.success {
  background: linear-gradient(135deg, #4caf50, #45a049);
}

.admin-notification.warning {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.admin-notification.error {
  background: linear-gradient(135deg, #f44336, #d32f2f);
}

.admin-notification.info {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(400px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-header h1 {
    font-size: 2rem;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .admin-container {
    padding: 0 1rem 2rem;
  }
}
</style>
