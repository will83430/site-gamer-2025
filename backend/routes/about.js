// Routes CRUD pour la page À propos
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

// GET toutes les sections
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM about_sections ORDER BY ordre ASC, id ASC'
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        logger.error('Erreur GET about sections:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// GET une section par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ success: false, error: 'ID invalide' });
        }
        const { rows } = await pool.query('SELECT * FROM about_sections WHERE id = $1', [id]);
        if (!rows.length) {
            return res.status(404).json({ success: false, error: 'Section non trouvée' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        logger.error('Erreur GET about section:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// POST créer une section
router.post('/', async (req, res) => {
    try {
        const { titre, contenu, icone, type, ordre } = req.body;
        if (!titre) {
            return res.status(400).json({ success: false, error: 'Le titre est requis' });
        }

        const { rows: maxRows } = await pool.query(
            'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM about_sections'
        );
        const newOrdre = ordre || (maxRows[0].max_ordre + 1);

        const result = await pool.query(`
            INSERT INTO about_sections (titre, contenu, icone, type, ordre)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [titre, contenu || '', icone || '📄', type || 'text', newOrdre]);

        logger.info(`Section about créée: ${titre}`);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        logger.error('Erreur POST about section:', err);
        res.status(500).json({ success: false, error: 'Erreur création section' });
    }
});

// PUT modifier une section
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, contenu, icone, type, ordre } = req.body;

        const existing = await pool.query('SELECT * FROM about_sections WHERE id = $1', [id]);
        if (!existing.rows.length) {
            return res.status(404).json({ success: false, error: 'Section non trouvée' });
        }

        const result = await pool.query(`
            UPDATE about_sections
            SET titre = COALESCE($1, titre),
                contenu = COALESCE($2, contenu),
                icone = COALESCE($3, icone),
                type = COALESCE($4, type),
                ordre = COALESCE($5, ordre)
            WHERE id = $6
            RETURNING *
        `, [titre, contenu, icone, type, ordre, id]);

        logger.info(`Section about mise à jour: ${id}`);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        logger.error('Erreur PUT about section:', err);
        res.status(500).json({ success: false, error: 'Erreur modification section' });
    }
});

// DELETE supprimer une section
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM about_sections WHERE id = $1 RETURNING id, titre',
            [id]
        );
        if (!result.rows.length) {
            return res.status(404).json({ success: false, error: 'Section non trouvée' });
        }

        await pool.query(`
            WITH ordered AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY ordre ASC, id ASC) as new_ordre
                FROM about_sections
            )
            UPDATE about_sections SET ordre = ordered.new_ordre
            FROM ordered WHERE about_sections.id = ordered.id
        `);

        logger.info(`Section about supprimée: ${result.rows[0].titre}`);
        res.json({ success: true, message: 'Section supprimée' });
    } catch (err) {
        logger.error('Erreur DELETE about section:', err);
        res.status(500).json({ success: false, error: 'Erreur suppression section' });
    }
});

// POST réordonner les sections
router.post('/reorder', async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Items requis' });
        }
        for (const item of items) {
            await pool.query('UPDATE about_sections SET ordre = $1 WHERE id = $2', [item.ordre, item.id]);
        }
        logger.info(`Réorganisation de ${items.length} sections about`);
        res.json({ success: true, message: `${items.length} sections réorganisées` });
    } catch (err) {
        logger.error('Erreur reorder about:', err);
        res.status(500).json({ success: false, error: 'Erreur réorganisation' });
    }
});

module.exports = router;
