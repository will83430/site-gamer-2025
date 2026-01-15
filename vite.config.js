import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // Configuration du dossier public
  publicDir: 'frontend/public',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'),
      '@assets': path.resolve(__dirname, './frontend/public/assets'),
      '@components': path.resolve(__dirname, './frontend/src/components'),
      '@views': path.resolve(__dirname, './frontend/src/views'),
      '@stores': path.resolve(__dirname, './frontend/src/stores'),
      '@composables': path.resolve(__dirname, './frontend/src/composables'),
    },
  },

  // Serveur de développement
  server: {
    port: 5173, // Port Vite (different de Express 3000)
    middlewareMode: false,
    proxy: {
      // Proxy vers l'API Express UNIQUEMENT
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path,
      },
      // Ne pas proxy /assets - Vite les servira depuis publicDir
    },
    // Rediriger toutes les routes vers index.html pour le SPA
    historyApiFallback: true,
    // Améliorer la performance du HMR
    hmr: {
      host: 'localhost',
      port: 5173,
      protocol: 'ws',
    },
  },

  // Build de production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    // Optimisations
    minify: 'terser',
    sourcemap: false,

    rollupOptions: {
      output: {
        // Organisation des chunks
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'views': ['@views/Home.vue', '@views/Products.vue', '@views/ProductDetail.vue', '@views/TopOfMonth.vue', '@views/TrendPage.vue'],
        },
      },
    },

    // Augmenter le seuil pour réduire la fragmentation
    chunkSizeWarningLimit: 1000,
    
    // Optimiser les reportCompressedSize pour les builds plus rapides en dev
    reportCompressedSize: false,
  },

  // CSS
  css: {
    // Pas de preprocessing pour garder le CSS existant
    // Le CSS existant dans frontend/public/assets/css/ reste intact
  },

  // Optimisation des dépendances
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia'],
  },
});