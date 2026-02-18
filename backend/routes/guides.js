// Routes CRUD pour les Guides d'achat
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

// GET tous les guides (avec nom catégorie + count produits)
router.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT g.*, c.nom as categorie_nom,
                   (SELECT COUNT(*) FROM guides_produits gp WHERE gp.guide_id = g.id) as nb_produits
            FROM guides g
            LEFT JOIN categories c ON g.categorie_id = c.id
            ORDER BY g.ordre ASC, g.titre ASC
        `);
        res.json({ success: true, data: rows });
    } catch (err) {
        logger.error('Erreur GET guides:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// GET un guide par slug (avec produits recommandés)
router.get('/by-slug/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { rows } = await pool.query(`
            SELECT g.*, c.nom as categorie_nom
            FROM guides g
            LEFT JOIN categories c ON g.categorie_id = c.id
            WHERE g.slug = $1
        `, [slug]);

        if (!rows.length) {
            return res.status(404).json({ success: false, error: 'Guide non trouvé' });
        }

        const guide = rows[0];

        // Récupérer les produits recommandés
        const { rows: produits } = await pool.query(`
            SELECT p.id, p.nom, p.image, p.prix, p.categorie, p.description,
                   gp.recommendation, gp.ordre as rec_ordre
            FROM guides_produits gp
            JOIN produits p ON gp.produit_id = p.id
            WHERE gp.guide_id = $1
            ORDER BY gp.ordre ASC
        `, [guide.id]);

        guide.produits = produits;
        res.json({ success: true, data: guide });
    } catch (err) {
        logger.error('Erreur GET guide by slug:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// GET un guide par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({ success: false, error: 'ID invalide' });
        }
        const { rows } = await pool.query(`
            SELECT g.*, c.nom as categorie_nom
            FROM guides g
            LEFT JOIN categories c ON g.categorie_id = c.id
            WHERE g.id = $1
        `, [id]);
        if (!rows.length) {
            return res.status(404).json({ success: false, error: 'Guide non trouvé' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        logger.error('Erreur GET guide:', err);
        res.status(500).json({ success: false, error: 'Erreur BDD' });
    }
});

// POST créer un guide
router.post('/', async (req, res) => {
    try {
        const { titre, description, image, categorie, budget_min, budget_max, criteres, conseils } = req.body;
        if (!titre) {
            return res.status(400).json({ success: false, error: 'Le titre est requis' });
        }

        // Générer le slug
        const slug = titre.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Vérifier l'unicité du slug
        const existing = await pool.query('SELECT id FROM guides WHERE slug = $1', [slug]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ success: false, error: 'Ce slug existe déjà' });
        }

        // Résoudre categorie_id
        let categorie_id = null;
        if (categorie) {
            const catRes = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = LOWER($1)', [categorie]);
            if (catRes.rows.length) categorie_id = catRes.rows[0].id;
        }

        const { rows: maxRows } = await pool.query(
            'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM guides'
        );
        const newOrdre = maxRows[0].max_ordre + 1;

        const result = await pool.query(`
            INSERT INTO guides (titre, slug, categorie_id, description, image, criteres, conseils, budget_min, budget_max, ordre)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            titre, slug, categorie_id,
            description || '', image || null,
            JSON.stringify(criteres || []), JSON.stringify(conseils || []),
            budget_min || null, budget_max || null, newOrdre
        ]);

        logger.info(`Guide créé: ${titre} (${slug})`);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        logger.error('Erreur POST guide:', err);
        res.status(500).json({ success: false, error: 'Erreur création guide' });
    }
});

// PUT modifier un guide
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, description, image, categorie, budget_min, budget_max, criteres, conseils } = req.body;

        const existing = await pool.query('SELECT * FROM guides WHERE id = $1', [id]);
        if (!existing.rows.length) {
            return res.status(404).json({ success: false, error: 'Guide non trouvé' });
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
            UPDATE guides
            SET titre = COALESCE($1, titre),
                description = COALESCE($2, description),
                image = $3,
                categorie_id = $4,
                budget_min = $5,
                budget_max = $6,
                criteres = $7,
                conseils = $8
            WHERE id = $9
            RETURNING *
        `, [
            titre, description,
            image !== undefined ? image : existing.rows[0].image,
            categorie_id,
            budget_min !== undefined ? budget_min : existing.rows[0].budget_min,
            budget_max !== undefined ? budget_max : existing.rows[0].budget_max,
            criteres ? JSON.stringify(criteres) : existing.rows[0].criteres,
            conseils ? JSON.stringify(conseils) : existing.rows[0].conseils,
            id
        ]);

        logger.info(`Guide mis à jour: ${id}`);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        logger.error('Erreur PUT guide:', err);
        res.status(500).json({ success: false, error: 'Erreur modification guide' });
    }
});

// DELETE supprimer un guide
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM guides WHERE id = $1 RETURNING id, titre',
            [id]
        );
        if (!result.rows.length) {
            return res.status(404).json({ success: false, error: 'Guide non trouvé' });
        }

        await pool.query(`
            WITH ordered AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY ordre ASC, titre ASC) as new_ordre
                FROM guides
            )
            UPDATE guides SET ordre = ordered.new_ordre
            FROM ordered WHERE guides.id = ordered.id
        `);

        logger.info(`Guide supprimé: ${result.rows[0].titre}`);
        res.json({ success: true, message: 'Guide supprimé' });
    } catch (err) {
        logger.error('Erreur DELETE guide:', err);
        res.status(500).json({ success: false, error: 'Erreur suppression guide' });
    }
});

// POST ajouter un produit à un guide
router.post('/:id/produits', async (req, res) => {
    try {
        const { id } = req.params;
        const { produit_id, recommendation } = req.body;

        if (!produit_id) {
            return res.status(400).json({ success: false, error: 'produit_id requis' });
        }

        const { rows: maxRows } = await pool.query(
            'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM guides_produits WHERE guide_id = $1',
            [id]
        );
        const newOrdre = maxRows[0].max_ordre + 1;

        const result = await pool.query(`
            INSERT INTO guides_produits (guide_id, produit_id, recommendation, ordre)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [id, produit_id, recommendation || '', newOrdre]);

        logger.info(`Produit ${produit_id} ajouté au guide ${id}`);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        logger.error('Erreur POST guide produit:', err);
        res.status(500).json({ success: false, error: 'Erreur ajout produit' });
    }
});

// DELETE retirer un produit d'un guide
router.delete('/:id/produits/:produitId', async (req, res) => {
    try {
        const { id, produitId } = req.params;
        const result = await pool.query(
            'DELETE FROM guides_produits WHERE guide_id = $1 AND produit_id = $2 RETURNING *',
            [id, produitId]
        );
        if (!result.rows.length) {
            return res.status(404).json({ success: false, error: 'Association non trouvée' });
        }
        logger.info(`Produit ${produitId} retiré du guide ${id}`);
        res.json({ success: true, message: 'Produit retiré du guide' });
    } catch (err) {
        logger.error('Erreur DELETE guide produit:', err);
        res.status(500).json({ success: false, error: 'Erreur suppression produit' });
    }
});

// POST réordonner les guides
router.post('/reorder', async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Items requis' });
        }
        for (const item of items) {
            await pool.query('UPDATE guides SET ordre = $1 WHERE id = $2', [item.ordre, item.id]);
        }
        logger.info(`Réorganisation de ${items.length} guides`);
        res.json({ success: true, message: `${items.length} guides réorganisés` });
    } catch (err) {
        logger.error('Erreur reorder guides:', err);
        res.status(500).json({ success: false, error: 'Erreur réorganisation' });
    }
});

module.exports = router;
