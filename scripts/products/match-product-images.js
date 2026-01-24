const fs = require('fs');
const path = require('path');

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function matchImages() {
  const pool = require('../backend/config/database');

  try {
    console.log('🔍 Recherche de correspondances d\'images...\n');

    const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'images');
    const allImages = fs.readdirSync(imagesDir).filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

    // Produits sans image
    const missing = [
      { id: 'prod_48', nom: 'sennheiser-momentum-5', titre: 'Sennheiser Momentum 5' },
      { id: 'prod_49', nom: 'steelseries-arctis-nova-pro', titre: 'SteelSeries Arctis Nova Pro' },
      { id: 'prod_51', nom: 'meta-quest-3s', titre: 'Meta Quest 3S' },
      { id: 'prod_52', nom: 'oculus-quest-2', titre: 'Oculus Quest 2' },
      { id: 'prod_53', nom: 'lenovo-legion-go-s', titre: 'Lenovo Legion Go S' },
      { id: 'prod_54', nom: 'dji-neo-2', titre: 'DJI Neo 2' },
      { id: 'prod_55', nom: 'samsung-qn900d-neo-qled-8k', titre: 'Samsung QN900D Neo QLED 8K' },
      { id: 'prod_56', nom: 'bambu-lab-x1-carbon-combo', titre: 'Bambu Lab X1 Carbon Combo' },
      { id: 'prod_58', nom: 'msi-titan-18-hx', titre: 'MSI Titan 18 HX' },
      { id: 'prod_59', nom: 'razer-blackwidow-v4-pro', titre: 'Razer BlackWidow V4 Pro' },
      { id: 'prod_61', nom: 'lenovo-yoga-tab-15', titre: 'Lenovo Yoga Tab 15' },
      { id: 'prod_62', nom: 'oneplus-pad-2', titre: 'OnePlus Pad 2' }
    ];

    const matches = [];

    for (const product of missing) {
      // Chercher une correspondance exacte
      const exactMatch = allImages.find(img => {
        const imgName = img.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
        return slugify(imgName) === product.nom;
      });

      if (exactMatch) {
        matches.push({ product, image: exactMatch, type: 'exact' });
        continue;
      }

      // Chercher une correspondance partielle
      const partialMatch = allImages.find(img => {
        const imgName = img.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '').toLowerCase();
        const productWords = product.nom.split('-').filter(w => w.length > 2);
        return productWords.every(word => imgName.includes(word));
      });

      if (partialMatch) {
        matches.push({ product, image: partialMatch, type: 'partial' });
        continue;
      }

      // Chercher par mots-clés
      const keywords = product.titre.toLowerCase().split(' ').filter(w => w.length > 3);
      const keywordMatch = allImages.find(img => {
        const imgName = img.toLowerCase();
        return keywords.some(kw => imgName.includes(kw));
      });

      if (keywordMatch) {
        matches.push({ product, image: keywordMatch, type: 'keyword' });
      }
    }

    console.log(`✅ ${matches.length} correspondances trouvées:\n`);

    let updated = 0;

    for (const match of matches) {
      console.log(`${match.type === 'exact' ? '✅' : match.type === 'partial' ? '🟡' : '🔍'} ${match.product.id} - ${match.product.titre}`);
      console.log(`   → ${match.image}\n`);

      // Mettre à jour la BDD
      await pool.query('UPDATE produits SET image = $1 WHERE id = $2', [match.image, match.product.id]);
      updated++;
    }

    console.log(`\n✅ ${updated} produits mis à jour avec des images`);

    // Produits toujours sans image
    const stillMissing = missing.filter(p => !matches.find(m => m.product.id === p.id));
    if (stillMissing.length > 0) {
      console.log(`\n⚠️  ${stillMissing.length} produits sans image trouvée:`);
      stillMissing.forEach(p => console.log(`  ${p.id} - ${p.titre}`));
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

matchImages();
