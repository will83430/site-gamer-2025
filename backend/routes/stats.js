const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

/**
 * GET /api/stats
 * Récupère les statistiques globales du site
 */
router.get('/', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT id) AS total_products,
        COUNT(DISTINCT CASE WHEN categorie IS NOT NULL AND categorie != '' THEN categorie END) AS total_categories,
        COUNT(*) FILTER (WHERE top_du_mois = TRUE) AS featured_products
      FROM produits
    `);

    logger.info('Statistiques globales récupérées');

    res.json({
      success: true,
      stats: stats.rows[0]
    });
  } catch (error) {
    logger.error('Erreur récupération statistiques:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/stats/categories
 * Récupère le nombre de produits par catégorie
 */
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        categorie,
        COUNT(*) as count
      FROM produits
      WHERE categorie IS NOT NULL AND categorie != ''
      GROUP BY categorie
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Erreur stats par catégorie:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/stats/tendances
 * Récupère les statistiques des tendances (actualités, technologies, etc.)
 */
router.get('/tendances', async (req, res) => {
  try {
    const [actualites, technologies, marche, predictions] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM actualites'),
      pool.query('SELECT COUNT(*) as count FROM technologies'),
      pool.query('SELECT COUNT(*) as count FROM marche'),
      pool.query('SELECT COUNT(*) as count FROM predictions')
    ]);

    res.json({
      success: true,
      stats: {
        actualites: parseInt(actualites.rows[0].count),
        technologies: parseInt(technologies.rows[0].count),
        marche: parseInt(marche.rows[0].count),
        predictions: parseInt(predictions.rows[0].count),
        total: parseInt(actualites.rows[0].count) +
               parseInt(technologies.rows[0].count) +
               parseInt(marche.rows[0].count) +
               parseInt(predictions.rows[0].count)
      }
    });
  } catch (error) {
    logger.error('Erreur stats tendances:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/stats/homepage
 * Stats pour la homepage (produits, catégories, tendances, visites)
 */
router.get('/homepage', async (req, res) => {
  try {
    const [produits, categories, tendances, visites] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM produits'),
      pool.query('SELECT COUNT(*) as count FROM categories'),
      pool.query('SELECT COUNT(*) as count FROM actualites'),
      pool.query('SELECT valeur FROM site_stats WHERE cle = $1', ['visites_total'])
    ]);

    res.json({
      success: true,
      stats: {
        produits: parseInt(produits.rows[0]?.count || 0),
        categories: parseInt(categories.rows[0]?.count || 16),
        tendances: parseInt(tendances.rows[0]?.count || 0),
        visites: parseInt(visites.rows[0]?.valeur || 0)
      }
    });
  } catch (error) {
    logger.error('Erreur stats homepage:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/stats/admin
 * Stats complètes pour le dashboard admin
 */
router.get('/admin', async (req, res) => {
  try {
    const [
      produitsTotal,
      produitsParCategorie,
      topDuMois,
      tendances,
      visites,
      derniereVisite,
      prixStats
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM produits'),
      pool.query(`
        SELECT categorie, COUNT(*) as count
        FROM produits
        WHERE categorie IS NOT NULL AND categorie != ''
        GROUP BY categorie
        ORDER BY count DESC
        LIMIT 10
      `),
      pool.query('SELECT COUNT(*) as count FROM produits WHERE top_du_mois = TRUE'),
      pool.query(`
        SELECT
          (SELECT COUNT(*) FROM actualites) as actualites,
          (SELECT COUNT(*) FROM technologies) as technologies,
          (SELECT COUNT(*) FROM marche) as marche,
          (SELECT COUNT(*) FROM predictions) as predictions
      `),
      pool.query('SELECT valeur FROM site_stats WHERE cle = $1', ['visites_total']),
      pool.query('SELECT valeur FROM site_stats WHERE cle = $1', ['derniere_visite']),
      pool.query(`
        SELECT
          MIN(CAST(REGEXP_REPLACE(prix, '[^0-9.]', '', 'g') AS NUMERIC)) as min_prix,
          MAX(CAST(REGEXP_REPLACE(prix, '[^0-9.]', '', 'g') AS NUMERIC)) as max_prix,
          AVG(CAST(REGEXP_REPLACE(prix, '[^0-9.]', '', 'g') AS NUMERIC))::INTEGER as avg_prix
        FROM produits
        WHERE prix IS NOT NULL AND prix ~ '[0-9]'
      `)
    ]);

    const tendancesData = tendances.rows[0];
    const totalTendances = parseInt(tendancesData.actualites) +
                          parseInt(tendancesData.technologies) +
                          parseInt(tendancesData.marche) +
                          parseInt(tendancesData.predictions);

    res.json({
      success: true,
      stats: {
        produits: {
          total: parseInt(produitsTotal.rows[0].count),
          topDuMois: parseInt(topDuMois.rows[0].count),
          parCategorie: produitsParCategorie.rows
        },
        tendances: {
          actualites: parseInt(tendancesData.actualites),
          technologies: parseInt(tendancesData.technologies),
          marche: parseInt(tendancesData.marche),
          predictions: parseInt(tendancesData.predictions),
          total: totalTendances
        },
        visites: {
          total: parseInt(visites.rows[0]?.valeur || 0),
          derniereVisite: derniereVisite.rows[0]?.valeur || null
        },
        prix: prixStats.rows[0] || { min_prix: 0, max_prix: 0, avg_prix: 0 }
      }
    });
  } catch (error) {
    logger.error('Erreur stats admin:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/stats/visit
 * Incrémente le compteur de visites
 */
router.post('/visit', async (req, res) => {
  try {
    // Incrémenter le compteur total
    await pool.query(`
      UPDATE site_stats
      SET valeur = valeur + 1, updated_at = CURRENT_TIMESTAMP
      WHERE cle = 'visites_total'
    `);

    // Mettre à jour la dernière visite
    await pool.query(`
      UPDATE site_stats
      SET valeur = $1, updated_at = CURRENT_TIMESTAMP
      WHERE cle = 'derniere_visite'
    `, [Date.now()]);

    const result = await pool.query(
      'SELECT valeur FROM site_stats WHERE cle = $1',
      ['visites_total']
    );

    res.json({
      success: true,
      visites: parseInt(result.rows[0]?.valeur || 0)
    });
  } catch (error) {
    logger.error('Erreur incrément visite:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
