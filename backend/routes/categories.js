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
 * POST /api/categories
 * Crée une nouvelle catégorie
 */
router.post('/', async (req, res) => {
  try {
    const { nom, slug, description, icone } = req.body;

    if (!nom) {
      return res.status(400).json({
        success: false,
        error: 'Le nom est requis'
      });
    }

    const finalSlug = slug || nom.toUpperCase().replace(/\s+/g, '_');

    const result = await pool.query(`
      INSERT INTO categories (nom, slug, description, icone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [nom, finalSlug, description, icone]);

    logger.info(`Nouvelle catégorie créée: ${nom}`);

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Erreur création catégorie:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/categories/:id
 * Met à jour une catégorie
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, slug, description, icone } = req.body;

    const result = await pool.query(`
      UPDATE categories
      SET nom = COALESCE($1, nom),
          slug = COALESCE($2, slug),
          description = COALESCE($3, description),
          icone = COALESCE($4, icone)
      WHERE id = $5
      RETURNING *
    `, [nom, slug, description, icone, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }

    logger.info(`Catégorie mise à jour: ${id}`);

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Erreur mise à jour catégorie:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/categories/:id
 * Supprime une catégorie
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING id, nom',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }

    logger.info(`Catégorie supprimée: ${result.rows[0].nom}`);

    res.json({
      success: true,
      message: 'Catégorie supprimée'
    });
  } catch (error) {
    logger.error('Erreur suppression catégorie:', error);
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
