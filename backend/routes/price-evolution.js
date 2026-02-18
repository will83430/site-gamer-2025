const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const logger = require('../config/logger');

// Parse prix string → number : "À partir de 1 429 €" → 1429
function parsePrice(str) {
    if (!str) return null;
    const cleaned = str.replace(/[^0-9,.\s]/g, '').replace(',', '.').replace(/\s/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

async function initPriceHistoryTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS price_history (
                id SERIAL PRIMARY KEY,
                produit_id VARCHAR(100) NOT NULL,
                prix VARCHAR(100) NOT NULL,
                prix_numerique NUMERIC,
                date_enregistrement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_price_history_produit
            ON price_history(produit_id)
        `);
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_price_history_date
            ON price_history(date_enregistrement DESC)
        `);
        logger.info('Table price_history initialisée');
    } catch (error) {
        logger.error('Erreur init price_history:', error);
    }
}

initPriceHistoryTable();

/**
 * GET /api/price-evolution
 * Toutes les variations récentes avec infos produit
 */
router.get('/', async (req, res) => {
    try {
        const { categorie, limit = 100 } = req.query;

        let query = `
            SELECT ph.*, p.nom, p.categorie, p.image, p.prix as prix_actuel
            FROM price_history ph
            JOIN produits p ON ph.produit_id = p.id
        `;
        const params = [];
        let idx = 1;

        if (categorie) {
            query += ` WHERE p.categorie = $${idx}`;
            params.push(categorie);
            idx++;
        }

        query += ` ORDER BY ph.date_enregistrement DESC LIMIT $${idx}`;
        params.push(parseInt(limit));

        const { rows } = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        logger.error('Erreur GET price-evolution:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/price-evolution/stats
 * Stats globales des prix
 */
router.get('/stats', async (req, res) => {
    try {
        const [totalResult, productsResult, trendsResult, lastUpdateResult] = await Promise.all([
            pool.query('SELECT COUNT(*) as total FROM price_history'),
            pool.query('SELECT COUNT(DISTINCT produit_id) as total FROM price_history'),
            pool.query(`
                SELECT produit_id,
                    (SELECT prix_numerique FROM price_history ph2
                     WHERE ph2.produit_id = ph1.produit_id
                     ORDER BY date_enregistrement DESC LIMIT 1) as dernier_prix,
                    (SELECT prix_numerique FROM price_history ph3
                     WHERE ph3.produit_id = ph1.produit_id
                     ORDER BY date_enregistrement ASC LIMIT 1) as premier_prix
                FROM (SELECT DISTINCT produit_id FROM price_history) ph1
            `),
            pool.query('SELECT MAX(date_enregistrement) as last_update FROM price_history')
        ]);

        let hausses = 0, baisses = 0, stables = 0;
        for (const row of trendsResult.rows) {
            if (row.dernier_prix == null || row.premier_prix == null) { stables++; continue; }
            const diff = parseFloat(row.dernier_prix) - parseFloat(row.premier_prix);
            if (diff > 0) hausses++;
            else if (diff < 0) baisses++;
            else stables++;
        }

        res.json({
            success: true,
            stats: {
                total_enregistrements: parseInt(totalResult.rows[0].total),
                produits_suivis: parseInt(productsResult.rows[0].total),
                hausses,
                baisses,
                stables,
                derniere_maj: lastUpdateResult.rows[0].last_update
            }
        });
    } catch (error) {
        logger.error('Erreur GET price-evolution/stats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/price-evolution/produit/:id
 * Historique d'un produit spécifique
 */
router.get('/produit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query(`
            SELECT ph.*, p.nom, p.categorie, p.image, p.prix as prix_actuel
            FROM price_history ph
            JOIN produits p ON ph.produit_id = p.id
            WHERE ph.produit_id = $1
            ORDER BY ph.date_enregistrement ASC
        `, [id]);
        res.json({ success: true, data: rows });
    } catch (error) {
        logger.error('Erreur GET price-evolution/produit:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * GET /api/price-evolution/products-summary
 * Résumé par produit : premier prix, dernier prix, variation
 */
router.get('/products-summary', async (req, res) => {
    try {
        const { categorie } = req.query;

        let query = `
            SELECT
                p.id, p.nom, p.categorie, p.image, p.prix as prix_actuel,
                first_entry.prix_numerique as premier_prix,
                first_entry.date_enregistrement as premiere_date,
                last_entry.prix_numerique as dernier_prix,
                last_entry.date_enregistrement as derniere_date,
                (SELECT COUNT(*) FROM price_history ph WHERE ph.produit_id = p.id) as nb_enregistrements
            FROM produits p
            JOIN LATERAL (
                SELECT prix_numerique, date_enregistrement FROM price_history
                WHERE produit_id = p.id ORDER BY date_enregistrement ASC LIMIT 1
            ) first_entry ON true
            JOIN LATERAL (
                SELECT prix_numerique, date_enregistrement FROM price_history
                WHERE produit_id = p.id ORDER BY date_enregistrement DESC LIMIT 1
            ) last_entry ON true
        `;
        const params = [];

        if (categorie) {
            query += ` WHERE p.categorie = $1`;
            params.push(categorie);
        }

        query += ` ORDER BY p.nom`;

        const { rows } = await pool.query(query, params);
        res.json({ success: true, data: rows });
    } catch (error) {
        logger.error('Erreur GET products-summary:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/price-evolution/snapshot
 * Capture les prix actuels de tous les produits
 */
router.post('/snapshot', async (req, res) => {
    try {
        const { rows: produits } = await pool.query(
            "SELECT id, prix FROM produits WHERE prix IS NOT NULL AND prix ~ '[0-9]'"
        );

        let count = 0;
        for (const p of produits) {
            const num = parsePrice(p.prix);
            await pool.query(
                'INSERT INTO price_history (produit_id, prix, prix_numerique) VALUES ($1, $2, $3)',
                [p.id, p.prix, num]
            );
            count++;
        }

        logger.info(`Snapshot prix: ${count} produits enregistrés`);
        res.json({ success: true, message: `${count} prix enregistrés`, count });
    } catch (error) {
        logger.error('Erreur POST snapshot:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/price-evolution/update-manual
 * Met à jour manuellement le prix d'un produit et enregistre dans l'historique
 */
router.post('/update-manual', async (req, res) => {
    try {
        const { produit_id, nouveau_prix } = req.body;
        if (!produit_id || !nouveau_prix) {
            return res.status(400).json({ success: false, error: 'produit_id et nouveau_prix requis' });
        }

        // Récupérer l'ancien prix
        const { rows } = await pool.query('SELECT prix, nom FROM produits WHERE id = $1', [produit_id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Produit non trouvé' });
        }
        const { prix: ancien_prix, nom } = rows[0];

        // Mettre à jour le prix du produit
        await pool.query('UPDATE produits SET prix = $1 WHERE id = $2', [nouveau_prix, produit_id]);

        // Enregistrer dans price_history
        const num = parsePrice(nouveau_prix);
        await pool.query(
            'INSERT INTO price_history (produit_id, prix, prix_numerique) VALUES ($1, $2, $3)',
            [produit_id, nouveau_prix, num]
        );

        logger.info(`Prix mis à jour manuellement: ${nom} ${ancien_prix} → ${nouveau_prix}`);
        res.json({
            success: true,
            message: `Prix mis à jour : ${ancien_prix} → ${nouveau_prix}`,
            ancien_prix,
            nouveau_prix,
            nom
        });
    } catch (error) {
        logger.error('Erreur update-manual:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
module.exports.parsePrice = parsePrice;
