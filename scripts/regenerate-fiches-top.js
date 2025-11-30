// scripts/regenerate-fiches-top.js
// Récupère tous les produits via API, filtre ceux avec top_du_mois=true
// et appelle POST /api/generate-fiche/:id pour chacun afin de régénérer la fiche HTML.

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function run() {
  try {
    console.log('Récupération des produits depuis', API_BASE);
    const res = await fetch(`${API_BASE}/api/produits`);
    const data = await res.json();
    if (!data.success) throw new Error('Impossible de récupérer les produits');
    const produits = data.data;

    const topProduits = produits.filter(p => p.top_du_mois === true || p.top_du_mois === 't');
    console.log(`Produits trouvés: ${produits.length}, top_du_mois: ${topProduits.length}`);

    for (const p of topProduits) {
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

    console.log('Regénération terminée. Vérifiez le dossier `fiches/` pour les fichiers mis à jour.');
  } catch (err) {
    console.error('Erreur principale:', err.message);
    process.exit(1);
  }
}

// Node 18+ fournit fetch global. Si absent, require('node-fetch') will be tenté.
if (typeof fetch === 'undefined') {
  try { global.fetch = require('node-fetch'); } catch (e) { /* let runtime fail later */ }
}

run();
