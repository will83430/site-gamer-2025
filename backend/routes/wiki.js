// Routes CRUD pour le Wiki
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

/**
 * Initialise la table des pages wiki si elle n'existe pas
 */
async function initWikiPagesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS wiki_pages (
                id SERIAL PRIMARY KEY,
                titre VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                contenu TEXT,
                description TEXT,
                icone VARCHAR(20),
                categorie VARCHAR(100),
                ordre INT DEFAULT 0,
                type VARCHAR(50),
                actif BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Créer un index pour les recherches par slug
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_wiki_pages_slug
            ON wiki_pages(slug)
        `);

        // Créer un index pour les recherches par catégorie et ordre
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_wiki_pages_categorie_ordre
            ON wiki_pages(categorie, ordre ASC)
        `);

        logger.info('Table wiki_pages initialisée');
    } catch (error) {
        logger.error('Erreur initialisation table wiki_pages:', error);
    }
}

// Initialiser la table au démarrage
initWikiPagesTable();

// GET toutes les pages wiki (actives uniquement pour le front)
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT id, titre, slug, description, icone, categorie, ordre, type, actif, created_at, updated_at
            FROM wiki_pages
            WHERE actif = true
            ORDER BY ordre ASC, titre ASC
        `);
        res.json(rows);
    } catch (err) {
        logger.error('Erreur GET wiki pages:', err);
        res.status(500).json({ error: 'Erreur BDD' });
    }
});

// GET toutes les pages wiki (admin - toutes)
router.get('/admin/all', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT *
            FROM wiki_pages
            ORDER BY ordre ASC, titre ASC
        `);
        res.json({
            success: true,
            pages: rows
        });
    } catch (err) {
        logger.error('Erreur GET all wiki pages:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// GET une page wiki par slug
router.get('/page/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { rows } = await pool.query(
            'SELECT * FROM wiki_pages WHERE slug = $1 AND actif = true',
            [slug]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'Page non trouvée' });
        }

        res.json(rows[0]);
    } catch (err) {
        logger.error('Erreur GET wiki page:', err);
        res.status(500).json({ error: 'Erreur BDD' });
    }
});

// GET une page wiki par ID (admin)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier que c'est un ID numérique
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ error: 'ID invalide' });
        }

        const { rows } = await pool.query(
            'SELECT * FROM wiki_pages WHERE id = $1',
            [id]
        );

        if (!rows.length) {
            return res.status(404).json({ error: 'Page non trouvée' });
        }

        res.json({
            success: true,
            page: rows[0]
        });
    } catch (err) {
        logger.error('Erreur GET wiki page by ID:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// POST créer une page wiki
router.post('/', async (req, res) => {
    try {
        const { titre, slug, contenu, description, icone, categorie, ordre, actif } = req.body;

        if (!titre) {
            return res.status(400).json({ success: false, error: 'Le titre est requis' });
        }

        // Générer le slug si non fourni
        const finalSlug = slug || titre.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Vérifier que le slug n'existe pas déjà
        const existing = await pool.query('SELECT id FROM wiki_pages WHERE slug = $1', [finalSlug]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, error: 'Ce slug existe déjà' });
        }

        // Récupérer le max ordre
        const { rows: maxRows } = await pool.query(
            'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM wiki_pages'
        );
        const newOrdre = ordre || (maxRows[0].max_ordre + 1);

        const result = await pool.query(`
            INSERT INTO wiki_pages (titre, slug, contenu, description, icone, categorie, ordre, actif)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [
            titre,
            finalSlug,
            contenu || '',
            description || '',
            icone || '📄',
            categorie || 'general',
            newOrdre,
            actif !== false
        ]);

        logger.info(`Page wiki créée: ${titre} (${finalSlug})`);

        res.status(201).json({
            success: true,
            page: result.rows[0]
        });
    } catch (err) {
        logger.error('Erreur POST wiki page:', err);
        res.status(500).json({ success: false, error: 'Erreur création page' });
    }
});

// PUT modifier une page wiki
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, slug, contenu, description, icone, categorie, ordre, actif } = req.body;

        // Vérifier que la page existe
        const existing = await pool.query('SELECT * FROM wiki_pages WHERE id = $1', [id]);
        if (!existing.rows.length) {
            return res.status(404).json({ success: false, error: 'Page non trouvée' });
        }

        // Si le slug change, vérifier qu'il n'existe pas déjà
        if (slug && slug !== existing.rows[0].slug) {
            const slugExists = await pool.query('SELECT id FROM wiki_pages WHERE slug = $1 AND id != $2', [slug, id]);
            if (slugExists.rows.length > 0) {
                return res.status(400).json({ success: false, error: 'Ce slug existe déjà' });
            }
        }

        const result = await pool.query(`
            UPDATE wiki_pages
            SET titre = COALESCE($1, titre),
                slug = COALESCE($2, slug),
                contenu = COALESCE($3, contenu),
                description = COALESCE($4, description),
                icone = COALESCE($5, icone),
                categorie = COALESCE($6, categorie),
                ordre = COALESCE($7, ordre),
                actif = COALESCE($8, actif),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *
        `, [titre, slug, contenu, description, icone, categorie, ordre, actif, id]);

        logger.info(`Page wiki mise à jour: ${id}`);

        res.json({
            success: true,
            page: result.rows[0]
        });
    } catch (err) {
        logger.error('Erreur PUT wiki page:', err);
        res.status(500).json({ success: false, error: 'Erreur modification page' });
    }
});

// DELETE supprimer une page wiki
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM wiki_pages WHERE id = $1 RETURNING id, titre, slug',
            [id]
        );

        if (!result.rows.length) {
            return res.status(404).json({ success: false, error: 'Page non trouvée' });
        }

        // Réorganiser les ordres
        await pool.query(`
            WITH ordered AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY ordre ASC, titre ASC) as new_ordre
                FROM wiki_pages
            )
            UPDATE wiki_pages SET ordre = ordered.new_ordre
            FROM ordered WHERE wiki_pages.id = ordered.id
        `);

        logger.info(`Page wiki supprimée: ${result.rows[0].titre}`);

        res.json({
            success: true,
            message: 'Page supprimée'
        });
    } catch (err) {
        logger.error('Erreur DELETE wiki page:', err);
        res.status(500).json({ success: false, error: 'Erreur suppression page' });
    }
});

// POST réorganiser les pages wiki
router.post('/reorder', async (req, res) => {
    try {
        const { items } = req.body; // [{id, ordre}, ...]

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Items requis' });
        }

        for (const item of items) {
            await pool.query('UPDATE wiki_pages SET ordre = $1 WHERE id = $2', [item.ordre, item.id]);
        }

        logger.info(`Réorganisation de ${items.length} pages wiki`);

        res.json({
            success: true,
            message: `${items.length} pages réorganisées`
        });
    } catch (err) {
        logger.error('Erreur reorder wiki:', err);
        res.status(500).json({ success: false, error: 'Erreur réorganisation' });
    }
});

// GET pages par catégorie
router.get('/categorie/:categorie', async (req, res) => {
    try {
        const { categorie } = req.params;
        const { rows } = await pool.query(`
            SELECT id, titre, slug, description, icone, categorie, ordre
            FROM wiki_pages
            WHERE categorie = $1 AND actif = true
            ORDER BY ordre ASC, titre ASC
        `, [categorie]);

        res.json(rows);
    } catch (err) {
        logger.error('Erreur GET wiki by categorie:', err);
        res.status(500).json({ error: 'Erreur BDD' });
    }
});

module.exports = router;
