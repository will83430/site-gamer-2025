// scripts/regenerate-all-fiches.js
// Récupère tous les produits via l'API et appelle POST /api/generate-fiche/:id
// pour chacun afin de régénérer toutes les fiches statiques.

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function run() {
  try {
    console.log('Récupération des produits depuis', API_BASE);
    const res = await fetch(`${API_BASE}/api/produits`);
    const data = await res.json();
    if (!data.success) throw new Error('Impossible de récupérer les produits');
    const produits = data.data;

    console.log(`Produits trouvés: ${produits.length}`);

    for (const p of produits) {
      const id = encodeURIComponent(p.id || p.nom);
      try {
        console.log(`Génération fiche pour ${p.nom} (${id}) ...`);
        const gen = await fetch(`${API_BASE}/api/generate-fiche/${id}`, { method: 'POST' });
        const j = await gen.json().catch(() => null);
        if (gen.ok) {
          console.log(' -> OK', j?.path || 'path unknown');
        } else {
          console.warn(' -> Erreur génération:', gen.status, j ? JSON.stringify(j) : await gen.text());
        }
      } catch (err) {
        console.error(' -> Erreur requête generate:', err.message);
      }
    }

    console.log('Regénération complète terminée. Vérifiez le dossier `fiches/` pour les fichiers mis à jour.');
  } catch (err) {
    console.error('Erreur principale:', err.message);
    process.exit(1);
  }
}

// Node 18+ fournit fetch global. Si absent, attempt to require node-fetch
if (typeof fetch === 'undefined') {
  try { global.fetch = require('node-fetch'); } catch (e) { /* will fail on use */ }
}

run();
