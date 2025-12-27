/* scripts/set-top-decembre.js
 * Script Node minimal pour activer/désactiver top_du_mois via l'API
 * Usage: node scripts/set-top-decembre.js
 * Node 18+ recommandé (fetch global). Si Node <18, installe node-fetch.
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

// Liste des 'nom' (valeur de la colonne nom) à activer pour Top Décembre
const selection = [
  'sony-wh-1000xm5',
  'garmin-fenix-8',
  'google-pixel-10',
  'asus-rog-strix-g18',
  'asus-rog-ally-x',
  'dji-mini-5-pro',
  'creality-halot-mage-s-14k',
  'lg-oled65-g5',
  'epson-eh-ls12000b',
  'dell-poweredge-r760',
  'steelseries-apex-pro-tkl-gen-3',
  'corsair-one-i500'
];

async function run() {
  try {
    console.log('Récupération de tous les produits...');
    const res = await fetch(`${API_BASE}/api/produits`);
    const data = await res.json();
    if (!data.success) throw new Error('Erreur récupération produits');
    const produits = data.data;

    // 1) Désactiver top_du_mois pour tous
    console.log('Désactivation de top_du_mois pour tous les produits...');
    for (const p of produits) {
      if (p.top_du_mois) {
        await updateProduct(p.id, { ...p, top_du_mois: false });
        console.log(` -> désactivé ${p.nom}`);
      }
    }

    // 2) Activer pour la sélection
    console.log('Activation de la sélection Top Décembre...');
    for (const slug of selection) {
      const prod = produits.find(x => x.nom === slug || x.id === slug);
      if (!prod) {
        console.warn(`Produit non trouvé pour: ${slug}`);
        continue;
      }
      await updateProduct(prod.id, { ...prod, top_du_mois: true });
      console.log(` -> activé ${prod.nom}`);
    }

    console.log('Terminé. Vérifie avec GET /api/produits?top=true ou via la base.');
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  }
}

async function updateProduct(id, product) {
  // Le endpoint PUT attend tous les champs listés dans serverOK.js
  const body = {
    nom: product.nom,
    categorie: product.categorie || null,
    description: product.description || null,
    image: product.image || null,
    lien: product.lien || null,
    top_du_mois: !!product.top_du_mois,
    prix: product.prix || null,
    fonctionnalites_avancees: product.fonctionnalites_avancees || [],
    donnees_fiche: product.donnees_fiche || [],
    titre_affiche: product.titre_affiche || null
  };

  const res = await fetch(`${API_BASE}/api/produits/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PUT ${id} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

run();
