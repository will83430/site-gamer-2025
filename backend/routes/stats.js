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

module.exports = router;
