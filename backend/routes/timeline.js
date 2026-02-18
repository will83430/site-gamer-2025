// Routes CRUD pour la Timeline Tech
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

// GET tous les événements (avec nom de catégorie)
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT t.*, c.nom as categorie_nom
            FROM timeline_events t
            LEFT JOIN categories c ON t.categorie_id = c.id
            ORDER BY t.annee DESC, t.mois DESC NULLS LAST, t.ordre ASC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        logger.error('Erreur GET timeline:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// GET événements par catégorie
router.get('/categorie/:categorieId', async (req, res) => {
    try {
        const { categorieId } = req.params;

        // Chercher la catégorie par nom ou ID
        let catQuery = 'SELECT id FROM categories WHERE ';
        let catParam;
        if (/^\d+$/.test(categorieId)) {
            catQuery += 'id = $1';
            catParam = categorieId;
        } else {
            catQuery += 'LOWER(nom) = LOWER($1)';
            catParam = categorieId.replace(/-/g, ' ');
        }

        const catResult = await pool.query(catQuery, [catParam]);
        if (!catResult.rows.length) {
            return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
        }

        const catId = catResult.rows[0].id;
        const { rows } = await pool.query(`
            SELECT t.*, c.nom as categorie_nom
            FROM timeline_events t
            LEFT JOIN categories c ON t.categorie_id = c.id
            WHERE t.categorie_id = $1
            ORDER BY t.annee DESC, t.mois DESC NULLS LAST, t.ordre ASC
        `, [catId]);

        res.json({ success: true, data: rows });
    } catch (err) {
        logger.error('Erreur GET timeline par catégorie:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// GET un événement par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ success: false, error: 'ID invalide' });
        }
        const { rows } = await pool.query(`
            SELECT t.*, c.nom as categorie_nom
            FROM timeline_events t
            LEFT JOIN categories c ON t.categorie_id = c.id
            WHERE t.id = $1
        `, [id]);
        if (!rows.length) {
            return res.status(404).json({ success: false, error: 'Événement non trouvé' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        logger.error('Erreur GET timeline event:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// POST créer un événement
router.post('/', async (req, res) => {
    try {
        const { titre, annee, mois, description, icone, image, categorie } = req.body;
        if (!titre || !annee) {
            return res.status(400).json({ success: false, error: 'Le titre et l\'année sont requis' });
        }

        // Résoudre categorie_id
        let categorie_id = null;
        if (categorie) {
            const catRes = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = LOWER($1)', [categorie]);
            if (catRes.rows.length) categorie_id = catRes.rows[0].id;
        }

        const { rows: maxRows } = await pool.query(
            'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM timeline_events'
        );
        const newOrdre = maxRows[0].max_ordre + 1;

        const result = await pool.query(`
            INSERT INTO timeline_events (titre, annee, mois, description, icone, image, categorie_id, ordre)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [titre, annee, mois || null, description || '', icone || '📅', image || null, categorie_id, newOrdre]);

        logger.info(`Événement timeline créé: ${titre} (${annee})`);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        logger.error('Erreur POST timeline:', err);
        res.status(500).json({ success: false, error: 'Erreur création événement' });
    }
});

// PUT modifier un événement
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, annee, mois, description, icone, image, categorie } = req.body;

        const existing = await pool.query('SELECT * FROM timeline_events WHERE id = $1', [id]);
        if (!existing.rows.length) {
            return res.status(404).json({ success: false, error: 'Événement non trouvé' });
        }

        // Résoudre categorie_id
        let categorie_id = existing.rows[0].categorie_id;
        if (categorie !== undefined) {
            if (categorie) {
                const catRes = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = LOWER($1)', [categorie]);
                categorie_id = catRes.rows.length ? catRes.rows[0].id : null;
            } else {
                categorie_id = null;
            }
        }

        const result = await pool.query(`
            UPDATE timeline_events
            SET titre = COALESCE($1, titre),
                annee = COALESCE($2, annee),
                mois = $3,
                description = COALESCE($4, description),
                icone = COALESCE($5, icone),
                image = $6,
                categorie_id = $7
            WHERE id = $8
            RETURNING *
        `, [titre, annee, mois !== undefined ? mois : existing.rows[0].mois, description, icone, image !== undefined ? image : existing.rows[0].image, categorie_id, id]);

        logger.info(`Événement timeline mis à jour: ${id}`);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        logger.error('Erreur PUT timeline:', err);
        res.status(500).json({ success: false, error: 'Erreur modification événement' });
    }
});

// DELETE supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM timeline_events WHERE id = $1 RETURNING id, titre',
            [id]
        );
        if (!result.rows.length) {
            return res.status(404).json({ success: false, error: 'Événement non trouvé' });
        }

        await pool.query(`
            WITH ordered AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY annee DESC, mois DESC NULLS LAST, ordre ASC) as new_ordre
                FROM timeline_events
            )
            UPDATE timeline_events SET ordre = ordered.new_ordre
            FROM ordered WHERE timeline_events.id = ordered.id
        `);

        logger.info(`Événement timeline supprimé: ${result.rows[0].titre}`);
        res.json({ success: true, message: 'Événement supprimé' });
    } catch (err) {
        logger.error('Erreur DELETE timeline:', err);
        res.status(500).json({ success: false, error: 'Erreur suppression événement' });
    }
});

// POST réordonner
router.post('/reorder', async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Items requis' });
        }
        for (const item of items) {
            await pool.query('UPDATE timeline_events SET ordre = $1 WHERE id = $2', [item.ordre, item.id]);
        }
        logger.info(`Réorganisation de ${items.length} événements timeline`);
        res.json({ success: true, message: `${items.length} événements réorganisés` });
    } catch (err) {
        logger.error('Erreur reorder timeline:', err);
        res.status(500).json({ success: false, error: 'Erreur réorganisation' });
    }
});

module.exports = router;
