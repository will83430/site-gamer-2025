const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

/**
 * Initialise la table des annonces si elle n'existe pas
 */
async function initAnnouncementsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        titre VARCHAR(255) NOT NULL,
        description TEXT,
        icone VARCHAR(20) DEFAULT '🚀',
        lien VARCHAR(255),
        bouton_texte VARCHAR(255) DEFAULT 'En savoir plus →',
        type VARCHAR(50) DEFAULT 'info',
        actif BOOLEAN DEFAULT true,
        ordre INT DEFAULT 0,
        date_debut TIMESTAMP,
        date_fin TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer un index pour les recherches par statut et ordre
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_announcements_actif_ordre
      ON announcements(actif, ordre ASC, created_at DESC)
    `);

    logger.info('Table announcements initialisée');
  } catch (error) {
    logger.error('Erreur initialisation table announcements:', error);
  }
}

// Initialiser la table au démarrage
initAnnouncementsTable();

/**
 * GET /api/announcements
 * Récupère les annonces actives
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, titre, description, icone, lien, bouton_texte, type, ordre
      FROM announcements
      WHERE actif = true
        AND (date_debut IS NULL OR date_debut <= CURRENT_TIMESTAMP)
        AND (date_fin IS NULL OR date_fin >= CURRENT_TIMESTAMP)
      ORDER BY ordre ASC, created_at DESC
    `);

    res.json({
      success: true,
      announcements: result.rows
    });
  } catch (error) {
    logger.error('Erreur récupération announcements:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/announcements/:id
 * Récupère une annonce par ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM announcements WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Annonce non trouvée'
      });
    }

    res.json({
      success: true,
      announcement: result.rows[0]
    });
  } catch (error) {
    logger.error('Erreur récupération announcement:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/announcements
 * Crée une nouvelle annonce (admin)
 */
router.post('/', async (req, res) => {
  try {
    const {
      titre,
      description,
      icone = '🚀',
      lien,
      bouton_texte = 'En savoir plus →',
      type = 'info',
      actif = true,
      ordre = 0,
      date_debut,
      date_fin
    } = req.body;

    if (!titre) {
      return res.status(400).json({
        success: false,
        error: 'Le titre est requis'
      });
    }

    const result = await pool.query(`
      INSERT INTO announcements
        (titre, description, icone, lien, bouton_texte, type, actif, ordre, date_debut, date_fin)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [titre, description, icone, lien, bouton_texte, type, actif, ordre, date_debut, date_fin]);

    logger.info(`Nouvelle annonce créée: ${titre}`);

    res.status(201).json({
      success: true,
      announcement: result.rows[0]
    });
  } catch (error) {
    logger.error('Erreur création announcement:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/announcements/:id
 * Met à jour une annonce (admin)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      icone,
      lien,
      bouton_texte,
      type,
      actif,
      ordre,
      date_debut,
      date_fin
    } = req.body;

    const result = await pool.query(`
      UPDATE announcements
      SET titre = COALESCE($1, titre),
          description = COALESCE($2, description),
          icone = COALESCE($3, icone),
          lien = COALESCE($4, lien),
          bouton_texte = COALESCE($5, bouton_texte),
          type = COALESCE($6, type),
          actif = COALESCE($7, actif),
          ordre = COALESCE($8, ordre),
          date_debut = COALESCE($9, date_debut),
          date_fin = COALESCE($10, date_fin),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `, [titre, description, icone, lien, bouton_texte, type, actif, ordre, date_debut, date_fin, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Annonce non trouvée'
      });
    }

    logger.info(`Annonce mise à jour: ${id}`);

    res.json({
      success: true,
      announcement: result.rows[0]
    });
  } catch (error) {
    logger.error('Erreur mise à jour announcement:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/announcements/:id
 * Supprime une annonce (admin)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM announcements WHERE id = $1 RETURNING id, titre',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Annonce non trouvée'
      });
    }

    logger.info(`Annonce supprimée: ${result.rows[0].titre}`);

    res.json({
      success: true,
      message: 'Annonce supprimée'
    });
  } catch (error) {
    logger.error('Erreur suppression announcement:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/announcements/admin/all
 * Récupère TOUTES les annonces (admin)
 */
router.get('/admin/all', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM announcements
      ORDER BY ordre ASC, created_at DESC
    `);

    res.json({
      success: true,
      announcements: result.rows
    });
  } catch (error) {
    logger.error('Erreur récupération all announcements:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
