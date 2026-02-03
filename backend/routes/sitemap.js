/**
 * Route pour générer le sitemap.xml dynamiquement
 * Inclut les pages statiques + produits + articles de la BDD
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const BASE_URL = process.env.SITE_URL || 'https://high-tech-2026.com';

// Pages statiques du site
const staticPages = [
    { url: '/2026/', priority: '1.0', changefreq: 'daily' },
    { url: '/2026/produits.html', priority: '0.9', changefreq: 'daily' },
    { url: '/2026/tendances.html', priority: '0.8', changefreq: 'daily' },
    { url: '/2026/comparatif.html', priority: '0.7', changefreq: 'weekly' },
    { url: '/2026/recherche.html', priority: '0.6', changefreq: 'weekly' }
];

// Catégories pour les pages tendances
const categories = [
    'drone', 'console', 'tablette', 'smartphone', 'pc-gaming',
    'serveur', 'casque-audio', 'montre-connectee', 'camera',
    'peripheriques', 'casque-vr', 'imprimante-3d', 'ecran-tv',
    'video-projecteur', 'box-internet', 'tableau-interactif'
];

/**
 * GET /sitemap.xml
 * Génère un sitemap XML complet
 */
router.get('/', async (req, res) => {
    try {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // Pages statiques
        for (const page of staticPages) {
            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
        }

        // Pages tendances par catégorie
        for (const cat of categories) {
            xml += '  <url>\n';
            xml += `    <loc>${BASE_URL}/2026/tendances.html?categorie=${cat}</loc>\n`;
            xml += '    <changefreq>weekly</changefreq>\n';
            xml += '    <priority>0.7</priority>\n';
            xml += '  </url>\n';
        }

        // Produits depuis la BDD
        try {
            const { rows: produits } = await pool.query(`
                SELECT nom, updated_at
                FROM produits
                ORDER BY updated_at DESC NULLS LAST
            `);

            for (const p of produits) {
                const slug = p.nom.toLowerCase()
                    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');

                xml += '  <url>\n';
                xml += `    <loc>${BASE_URL}/2026/fiche.html?produit=${encodeURIComponent(slug)}</loc>\n`;
                if (p.updated_at) {
                    xml += `    <lastmod>${new Date(p.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
                }
                xml += '    <changefreq>weekly</changefreq>\n';
                xml += '    <priority>0.8</priority>\n';
                xml += '  </url>\n';
            }
        } catch (dbErr) {
            console.error('Sitemap: Erreur récupération produits:', dbErr.message);
        }

        // Articles depuis la BDD
        try {
            const { rows: articles } = await pool.query(`
                SELECT id, date_publication
                FROM actualites
                ORDER BY date_publication DESC NULLS LAST
            `);

            for (const a of articles) {
                xml += '  <url>\n';
                xml += `    <loc>${BASE_URL}/2026/article.html?id=${a.id}</loc>\n`;
                if (a.date_publication) {
                    xml += `    <lastmod>${new Date(a.date_publication).toISOString().split('T')[0]}</lastmod>\n`;
                }
                xml += '    <changefreq>monthly</changefreq>\n';
                xml += '    <priority>0.6</priority>\n';
                xml += '  </url>\n';
            }
        } catch (dbErr) {
            console.error('Sitemap: Erreur récupération articles:', dbErr.message);
        }

        xml += '</urlset>';

        res.set('Content-Type', 'application/xml');
        res.send(xml);

    } catch (error) {
        console.error('Erreur génération sitemap:', error);
        res.status(500).send('Erreur génération sitemap');
    }
});

module.exports = router;
