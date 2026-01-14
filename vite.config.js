import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

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
    proxy: {
      // Proxy vers l'API Express
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Proxy pour les assets existants pendant la migration
      '/assets': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/fiches': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
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
        },
      },
    },
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