const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../config/database');
const logger = require('../config/logger');

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';

/**
 * Cherche le prix d'un produit sur Amazon FR via RapidAPI
 * API utilisée : real-time-amazon-data
 */
async function fetchAmazonPrice(productName) {
  if (!RAPIDAPI_KEY) return null;

  try {
    const response = await axios.get('https://real-time-amazon-data.p.rapidapi.com/search', {
      params: {
        query: productName,
        page: '1',
        country: 'FR',
        sort_by: 'RELEVANCE',
        product_condition: 'NEW',
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com',
      },
      timeout: 20000,
    });

    const products = response.data?.data?.products || [];
    if (products.length === 0) return null;

    // Prend le 1er résultat pertinent avec un prix
    const found = products.find(p => p.product_price && p.product_title);
    if (!found) return null;

    // Nettoie le prix "1 299,00 €" → 1299
    const raw = found.product_price.replace(/[^\d,\.]/g, '').replace(',', '.');
    const num = parseFloat(raw);
    if (isNaN(num) || num <= 0) return null;

    return {
      prix_formate: found.product_price,
      prix_numerique: num,
      source: 'Amazon FR',
      titre_trouve: found.product_title?.substring(0, 80),
    };
  } catch (err) {
    logger.warn(`RapidAPI erreur pour "${productName}": ${err.message}`);
    return null;
  }
}

/**
 * POST /api/price-scraper/update-one
 * Met à jour le prix d'un seul produit (manuel ou auto)
 * Body: { produit_id, prix, prix_numerique, source }
 */
router.post('/update-one', async (req, res) => {
  try {
    const { produit_id, prix, prix_numerique, source = 'Manuel' } = req.body;

    if (!produit_id || !prix_numerique) {
      return res.status(400).json({ success: false, error: 'produit_id et prix_numerique requis' });
    }

    // Vérifier que le produit existe
    const prod = await pool.query('SELECT id, nom, prix FROM produits WHERE id = $1', [produit_id]);
    if (prod.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produit introuvable' });
    }

    const num = parseFloat(prix_numerique);
    const prixFormate = prix || `${num.toLocaleString('fr-FR')} €`;

    // Insérer dans price_history
    await pool.query(
      'INSERT INTO price_history (produit_id, prix, prix_numerique, date_enregistrement) VALUES ($1, $2, $3, CURRENT_DATE)',
      [produit_id, prixFormate, num]
    );

    // Mettre à jour le prix actuel du produit
    await pool.query('UPDATE produits SET prix = $1 WHERE id = $2', [prixFormate, produit_id]);

    logger.info(`Prix mis à jour: ${prod.rows[0].nom} → ${prixFormate} (${source})`);

    res.json({
      success: true,
      produit: prod.rows[0].nom,
      ancien_prix: prod.rows[0].prix,
      nouveau_prix: prixFormate,
      source,
    });
  } catch (err) {
    logger.error('Erreur update-one:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/price-scraper/scrape-one
 * Scrape automatiquement le prix d'un produit via RapidAPI
 * Body: { produit_id }
 */
router.post('/scrape-one', async (req, res) => {
  try {
    const { produit_id } = req.body;

    if (!RAPIDAPI_KEY) {
      return res.status(503).json({ success: false, error: 'RAPIDAPI_KEY non configurée dans .env' });
    }

    const prod = await pool.query('SELECT id, nom, titre_affiche FROM produits WHERE id = $1', [produit_id]);
    if (prod.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produit introuvable' });
    }

    const nomRecherche = prod.rows[0].titre_affiche || prod.rows[0].nom;
    const result = await fetchAmazonPrice(nomRecherche);

    if (!result) {
      return res.json({ success: false, error: 'Aucun prix trouvé', produit: prod.rows[0].nom });
    }

    // Vérifier cohérence vs dernier prix connu (rejet si écart > 50%)
    const lastPrice = await pool.query(
      'SELECT prix_numerique FROM price_history WHERE produit_id = $1 ORDER BY date_enregistrement DESC LIMIT 1',
      [produit_id]
    );
    if (lastPrice.rows.length > 0 && lastPrice.rows[0].prix_numerique > 0) {
      const ancien = parseFloat(lastPrice.rows[0].prix_numerique);
      const variation = Math.abs((result.prix_numerique - ancien) / ancien);
      if (variation > 0.5) {
        logger.warn(`Prix suspect ignoré: ${prod.rows[0].nom} — ancien ${ancien}€ → nouveau ${result.prix_numerique}€ (${Math.round(variation * 100)}%)`);
        return res.json({
          success: false,
          suspect: true,
          produit: prod.rows[0].nom,
          error: `Prix suspect: écart de ${Math.round(variation * 100)}% (ancien: ${ancien}€, trouvé: ${result.prix_numerique}€)`,
          titre_trouve: result.titre_trouve,
        });
      }
    }

    // Enregistrer dans price_history
    await pool.query(
      'INSERT INTO price_history (produit_id, prix, prix_numerique, date_enregistrement) VALUES ($1, $2, $3, CURRENT_DATE)',
      [produit_id, result.prix_formate, result.prix_numerique]
    );

    // Mettre à jour le prix actuel
    await pool.query('UPDATE produits SET prix = $1 WHERE id = $2', [result.prix_formate, produit_id]);

    res.json({
      success: true,
      produit: prod.rows[0].nom,
      prix: result.prix_formate,
      prix_numerique: result.prix_numerique,
      source: result.source,
      titre_trouve: result.titre_trouve,
    });
  } catch (err) {
    logger.error('Erreur scrape-one:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/price-scraper/scrape-all
 * Scrape les prix de tous les produits actifs via RapidAPI (avec délai entre requêtes)
 * Body: { limit } (optionnel, défaut 20 pour ne pas dépasser le quota gratuit)
 */
router.post('/scrape-all', async (req, res) => {
  try {
    if (!RAPIDAPI_KEY) {
      return res.status(503).json({ success: false, error: 'RAPIDAPI_KEY non configurée dans .env' });
    }

    const { limit = 20 } = req.body;

    const produits = await pool.query(
      'SELECT id, nom, titre_affiche FROM produits WHERE est_prevu = false ORDER BY top_du_mois DESC, created_at DESC LIMIT $1',
      [parseInt(limit)]
    );

    const results = { success: [], failed: [], skipped: [], suspicious: [] };

    for (const prod of produits.rows) {
      // Vérifier si prix déjà mis à jour aujourd'hui
      const alreadyToday = await pool.query(
        "SELECT id FROM price_history WHERE produit_id = $1 AND date_enregistrement = CURRENT_DATE",
        [prod.id]
      );
      if (alreadyToday.rows.length > 0) {
        results.skipped.push(prod.nom);
        continue;
      }

      const nomRecherche = prod.titre_affiche || prod.nom;
      const result = await fetchAmazonPrice(nomRecherche);

      if (result) {
        // Vérifier cohérence vs dernier prix connu (rejet si écart > 50%)
        const lastPrice = await pool.query(
          'SELECT prix_numerique FROM price_history WHERE produit_id = $1 ORDER BY date_enregistrement DESC LIMIT 1',
          [prod.id]
        );
        if (lastPrice.rows.length > 0 && lastPrice.rows[0].prix_numerique > 0) {
          const ancien = parseFloat(lastPrice.rows[0].prix_numerique);
          const variation = Math.abs((result.prix_numerique - ancien) / ancien);
          if (variation > 0.5) {
            logger.warn(`Prix suspect ignoré: ${prod.nom} — ancien ${ancien}€ → nouveau ${result.prix_numerique}€ (${Math.round(variation * 100)}%)`);
            results.suspicious.push({ nom: prod.nom, ancien, nouveau: result.prix_numerique, titre_trouve: result.titre_trouve });
            await new Promise(r => setTimeout(r, 2500));
            continue;
          }
        }

        await pool.query(
          'INSERT INTO price_history (produit_id, prix, prix_numerique, date_enregistrement) VALUES ($1, $2, $3, CURRENT_DATE)',
          [prod.id, result.prix_formate, result.prix_numerique]
        );
        await pool.query('UPDATE produits SET prix = $1 WHERE id = $2', [result.prix_formate, prod.id]);
        results.success.push({ nom: prod.nom, prix: result.prix_formate });
      } else {
        results.failed.push(prod.nom);
      }

      // Délai 2,5s entre requêtes pour respecter le rate limit
      await new Promise(r => setTimeout(r, 2500));
    }

    logger.info(`Scrape-all terminé: ${results.success.length} OK, ${results.failed.length} échoués, ${results.skipped.length} déjà à jour, ${results.suspicious.length} suspects ignorés`);

    res.json({
      success: true,
      total: produits.rows.length,
      mis_a_jour: results.success.length,
      echecs: results.failed.length,
      deja_a_jour: results.skipped.length,
      suspects_ignores: results.suspicious.length,
      details: results,
    });
  } catch (err) {
    logger.error('Erreur scrape-all:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/price-scraper/status
 * Statut du scraper : clé API configurée ? Quota utilisé ?
 */
router.get('/status', async (req, res) => {
  const hasKey = !!RAPIDAPI_KEY;
  const lastUpdates = await pool.query(`
    SELECT MAX(date_enregistrement) as derniere_maj, COUNT(*) as nb_entrees
    FROM price_history
  `);

  res.json({
    success: true,
    api_configuree: hasKey,
    derniere_maj: lastUpdates.rows[0].derniere_maj,
    total_entrees_historique: parseInt(lastUpdates.rows[0].nb_entrees),
  });
});

module.exports = router;
