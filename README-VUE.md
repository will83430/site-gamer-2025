# 🚀 Guide Vue.js - Site Gamer 2025

## ✅ Installation des dépendances

```bash
npm install
```

## 🔥 Lancement du projet

### Option 1 : Développement complet (Backend + Frontend Vue)
```bash
npm run dev:full
```
Ceci lance :
- Backend Express sur `http://localhost:3000`
- Frontend Vite sur `http://localhost:5173` (avec hot-reload)

### Option 2 : Lancer séparément

**Terminal 1 - Backend:**
```bash
npm run dev
# ou
npm start
```

**Terminal 2 - Frontend Vue:**
```bash
npm run dev:vue
```

## 📦 Build de production

```bash
npm run build:all
```

Ceci construit :
- CSS minifié (`styles.min.css`)
- JS legacy minifié (`fiches.min.js`, etc.)
- App Vue.js compilée (dossier `dist/`)

## 🌐 URLs

- **Backend API** : http://localhost:3000
- **Frontend Vue (dev)** : http://localhost:5173
- **Frontend Vue (preview build)** : http://localhost:4173 (après `npm run preview`)

## 📁 Structure Vue.js

```
frontend/src/
├── main.js                 # Point d'entrée
├── App.vue                 # Composant racine
├── views/                  # Pages
│   └── Home.vue
├── components/             # Composants réutilisables
│   ├── layout/
│   ├── products/
│   └── common/
├── composables/            # Logique réutilisable
├── stores/                 # Pinia (state management)
├── router/                 # Vue Router
│   └── index.js
└── services/               # Clients API
```

## 🎨 CSS - IMPORTANT

**Le CSS existant (`frontend/public/assets/css/styles.css`) reste intact !**

- Le fichier `index.html` charge `styles.min.css` comme avant
- Les composants Vue peuvent avoir du `<style scoped>` additionnel
- Aucune modification du design existant

## 🧪 Tester l'installation

1. Lance `npm run dev:full`
2. Va sur http://localhost:5173
3. Tu devrais voir une page de test Vue.js
4. Clique sur "Tester API Produits" pour vérifier la connexion backend

## ✅ Phase A - Setup COMPLÉTÉ

- [x] Vue 3 installé (v3.5.13)
- [x] Vite configuré (v6.0.7)
- [x] Vue Router configuré (v4.5.0)
- [x] Pinia installé (v2.3.0)
- [x] Structure de dossiers créée
- [x] Premier composant Home.vue fonctionnel
- [x] Hot-reload activé
- [x] CSS existant préservé

## 📝 Prochaines étapes (Phase B)

Créer les composants de base :
- `AppHeader.vue` - En-tête avec navigation
- `AppFooter.vue` - Pied de page
- `ProductCard.vue` - Carte produit réutilisable
- `LoadingSpinner.vue` - Indicateur de chargement
- `ErrorMessage.vue` - Messages d'erreur

## 🚨 Dépannage

### Port 5173 déjà utilisé
```bash
# Changer le port dans vite.config.js
server: {
  port: 5174, // ou autre
}
```

### Erreur "Cannot find module '@views/Home.vue'"
```bash
# Vérifier que le fichier existe
ls frontend/src/views/Home.vue

# Réinstaller les dépendances si nécessaire
rm -rf node_modules package-lock.json
npm install
```

### API ne répond pas (CORS, 404, etc.)
- Vérifier que le backend tourne sur port 3000
- Vérifier le proxy dans `vite.config.js`
- Logs backend : regarder le terminal Express

## 📚 Documentation

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
