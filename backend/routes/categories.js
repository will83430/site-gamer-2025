const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

/**
 * GET /api/categories
 * Récupère toutes les catégories triées par nom
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY nom');

    logger.info(`Categories récupérées: ${result.rows.length} catégories`);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Erreur récupération catégories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/categories/:id
 * Récupère une catégorie par ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM categories WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Erreur récupération catégorie:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/categories/:slug/produits
 * Récupère tous les produits d'une catégorie par slug
 */
router.get('/:slug/produits', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'SELECT * FROM produits WHERE categorie = $1 ORDER BY id',
      [slug]
    );

    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    logger.error('Erreur récupération produits par catégorie:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
