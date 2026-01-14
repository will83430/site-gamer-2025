import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Créer l'instance Pinia (state management)
const pinia = createPinia();

// Créer l'application Vue
const app = createApp(App);

// Utiliser les plugins
app.use(pinia);
app.use(router);

// Monter l'application sur #app
app.mount('#app');

console.log('🚀 Vue.js app mounted successfully!');
