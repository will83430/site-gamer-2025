const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

/**
 * Initialise la table des logs d'activité si elle n'existe pas
 */
async function initActivityLogsTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        action VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100),
        entity_name VARCHAR(255),
        details JSONB,
        user_ip VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer un index pour les recherches par date
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at
      ON activity_logs(created_at DESC)
    `);

    logger.info('Table activity_logs initialisée');
  } catch (error) {
    logger.error('Erreur initialisation table activity_logs:', error);
  }
}

// Initialiser la table au démarrage
initActivityLogsTable();

/**
 * Enregistre une activité
 * @param {string} action - Type d'action (create, update, delete, export, import, etc.)
 * @param {string} entityType - Type d'entité (produit, article, categorie, etc.)
 * @param {string} entityId - ID de l'entité
 * @param {string} entityName - Nom de l'entité (pour affichage)
 * @param {object} details - Détails supplémentaires
 * @param {string} userIp - IP de l'utilisateur
 */
async function logActivity(action, entityType, entityId, entityName, details = null, userIp = null) {
  try {
    await pool.query(`
      INSERT INTO activity_logs (action, entity_type, entity_id, entity_name, details, user_ip)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [action, entityType, entityId, entityName, details ? JSON.stringify(details) : null, userIp]);
  } catch (error) {
    logger.error('Erreur enregistrement log activité:', error);
  }
}

/**
 * GET /api/activity-logs
 * Récupère les logs d'activité avec pagination
 */
router.get('/', async (req, res) => {
  try {
    const {
      limit = 50,
      offset = 0,
      action,
      entity_type,
      date_from,
      date_to
    } = req.query;

    let query = `
      SELECT * FROM activity_logs
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (action) {
      query += ` AND action = $${paramIndex}`;
      params.push(action);
      paramIndex++;
    }

    if (entity_type) {
      query += ` AND entity_type = $${paramIndex}`;
      params.push(entity_type);
      paramIndex++;
    }

    if (date_from) {
      query += ` AND created_at >= $${paramIndex}`;
      params.push(date_from);
      paramIndex++;
    }

    if (date_to) {
      query += ` AND created_at <= $${paramIndex}`;
      params.push(date_to);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);

    // Compter le total
    let countQuery = `SELECT COUNT(*) as total FROM activity_logs WHERE 1=1`;
    const countParams = [];
    let countIndex = 1;

    if (action) {
      countQuery += ` AND action = $${countIndex}`;
      countParams.push(action);
      countIndex++;
    }

    if (entity_type) {
      countQuery += ` AND entity_type = $${countIndex}`;
      countParams.push(entity_type);
      countIndex++;
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    logger.error('Erreur récupération logs activité:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/activity-logs/stats
 * Statistiques des logs d'activité
 */
router.get('/stats', async (req, res) => {
  try {
    const [byAction, byEntity, recent] = await Promise.all([
      pool.query(`
        SELECT action, COUNT(*) as count
        FROM activity_logs
        GROUP BY action
        ORDER BY count DESC
      `),
      pool.query(`
        SELECT entity_type, COUNT(*) as count
        FROM activity_logs
        GROUP BY entity_type
        ORDER BY count DESC
      `),
      pool.query(`
        SELECT COUNT(*) as count
        FROM activity_logs
        WHERE created_at >= NOW() - INTERVAL '24 hours'
      `)
    ]);

    res.json({
      success: true,
      stats: {
        byAction: byAction.rows,
        byEntity: byEntity.rows,
        last24h: parseInt(recent.rows[0].count)
      }
    });

  } catch (error) {
    logger.error('Erreur stats logs activité:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/activity-logs
 * Enregistre un nouveau log d'activité
 */
router.post('/', async (req, res) => {
  try {
    const { action, entity_type, entity_id, entity_name, details } = req.body;
    const userIp = req.ip || req.connection.remoteAddress;

    if (!action || !entity_type) {
      return res.status(400).json({
        success: false,
        error: 'Action et type d\'entité requis'
      });
    }

    await logActivity(action, entity_type, entity_id, entity_name, details, userIp);

    res.json({
      success: true,
      message: 'Activité enregistrée'
    });

  } catch (error) {
    logger.error('Erreur POST log activité:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/activity-logs/clear
 * Supprime les anciens logs (plus de 30 jours)
 */
router.delete('/clear', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const result = await pool.query(`
      DELETE FROM activity_logs
      WHERE created_at < NOW() - INTERVAL '${parseInt(days)} days'
      RETURNING id
    `);

    res.json({
      success: true,
      message: `${result.rowCount} logs supprimés (plus de ${days} jours)`
    });

  } catch (error) {
    logger.error('Erreur suppression logs:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Exporter la fonction logActivity pour l'utiliser dans d'autres routes
module.exports = router;
module.exports.logActivity = logActivity;
