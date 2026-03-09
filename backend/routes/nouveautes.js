const express = require('express');
const router = express.Router();
const RSSParser = require('rss-parser');
const logger = require('../config/logger');

const parser = new RSSParser({
    timeout: 10000,
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HighTech2026Bot/1.0)' },
    customFields: {
        item: [['media:content', 'mediaContent'], ['media:thumbnail', 'mediaThumbnail'], ['enclosure', 'enclosure']]
    }
});

// Cache en mémoire : 30 minutes
let cache = { data: null, ts: 0 };
const CACHE_TTL = 30 * 60 * 1000;

// Sources RSS tech
const SOURCES = [
    {
        url: 'https://www.lesnumeriques.com/rss.xml',
        nom: 'Les Numériques',
        lang: 'fr'
    },
    {
        url: 'https://www.01net.com/feed/',
        nom: '01net',
        lang: 'fr'
    },
    {
        url: 'https://www.numerama.com/feed/',
        nom: 'Numerama',
        lang: 'fr'
    },
    {
        url: 'https://www.gsmarena.com/rss-news-reviews.php3',
        nom: 'GSMArena',
        lang: 'en'
    },
    {
        url: 'https://www.theverge.com/rss/index.xml',
        nom: 'The Verge',
        lang: 'en'
    }
];

// Mots-clés pour auto-catégorisation
const CATEGORIES = {
    'smartphone': ['iphone', 'samsung galaxy', 'pixel', 'xiaomi', 'smartphone', 'android', '5g', 'oneplus', 'oppo', 'realme', 'nothing phone', 'motorola', 'honor'],
    'console': ['playstation', 'xbox', 'nintendo', 'switch 2', 'ps5', 'ps6', 'series x', 'game boy', 'console de jeu'],
    'pc-gaming': ['rtx', 'rx 7', 'rx 8', 'gaming laptop', 'pc gamer', 'processeur', 'amd ryzen', 'intel core', 'gaming pc', 'ordinateur portable gamer', 'carte graphique', 'gpu', 'cpu'],
    'casque-vr': ['meta quest', 'vision pro', 'casque vr', 'réalité virtuelle', 'mixed reality', 'vr headset', 'apple vision', 'playstation vr'],
    'drone': ['dji', 'drone', 'quadcopter', 'fpv', 'uav'],
    'montre-connectee': ['apple watch', 'galaxy watch', 'smartwatch', 'montre connectée', 'fitbit', 'garmin', 'wear os', 'pixel watch'],
    'camera': ['appareil photo', 'reflex', 'mirrorless', 'gopro', 'insta360', 'sony alpha', 'canon eos', 'nikon z', 'fujifilm', 'action cam'],
    'casque-audio': ['airpods', 'galaxy buds', 'casque audio', 'écouteurs', 'earbuds', 'headphones', 'sony wh', 'bose', 'jabra', 'anc'],
    'ecran-tv': ['oled tv', 'qled', 'mini-led', 'television', 'téléviseur', 'smart tv', 'moniteur gaming', 'monitor', '4k tv', '8k'],
    'tablette': ['ipad', 'galaxy tab', 'surface pro', 'tablette', 'tablet android'],
    'peripherique': ['clavier', 'souris', 'manette', 'joystick', 'gamepad', 'keyboard', 'gaming mouse', 'webcam', 'microphone'],
    'imprimante-3d': ['imprimante 3d', '3d printer', 'filament', 'bambu lab', 'creality', 'resin printer'],
    'box-internet': ['box internet', 'livebox', 'freebox', 'bbox', 'routeur wifi', 'wifi 7', 'wifi 6e'],
    'gaming': ['jeu vidéo', 'video game', 'gaming', 'esport', 'steam', 'epic games']
};

// Mots-clés pour détecter si c'est "prévu" (pas encore sorti)
const PREVU_KEYWORDS = ['prévu', 'annoncé', 'officiel', 'leak', 'rumeur', 'prochainement', 'à venir', 'sera lancé', 'upcoming', 'leaked', 'expected', 'announced', 'coming soon', 'teased', 'rumored'];

function detectCategorie(titre, description) {
    const text = (titre + ' ' + (description || '')).toLowerCase();
    for (const [cat, keywords] of Object.entries(CATEGORIES)) {
        if (keywords.some(kw => text.includes(kw))) return cat;
    }
    return 'autre';
}

function detectPrevu(titre, description) {
    const text = (titre + ' ' + (description || '')).toLowerCase();
    return PREVU_KEYWORDS.some(kw => text.includes(kw));
}

function extractImage(item) {
    // Tente plusieurs sources d'image dans l'ordre
    if (item.mediaContent?.['$']?.url) return item.mediaContent['$'].url;
    if (item.mediaThumbnail?.['$']?.url) return item.mediaThumbnail['$'].url;
    if (item.enclosure?.url) return item.enclosure.url;
    if (item['media:content']?.['$']?.url) return item['media:content']['$'].url;

    // Cherche une image dans le contenu HTML
    const html = item.content || item['content:encoded'] || item.summary || '';
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) return match[1];

    return null;
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim().substring(0, 200);
}

async function fetchAllFeeds() {
    const now = Date.now();
    if (cache.data && now - cache.ts < CACHE_TTL) {
        return cache.data;
    }

    const allItems = [];

    await Promise.allSettled(
        SOURCES.map(async (source) => {
            try {
                const feed = await parser.parseURL(source.url);
                const items = (feed.items || []).slice(0, 30).map(item => {
                    const titre = item.title || '';
                    const description = stripHtml(item.contentSnippet || item.description || item.summary || '');
                    const image = extractImage(item);
                    const date = item.pubDate ? new Date(item.pubDate) : new Date();
                    const categorie = detectCategorie(titre, description);
                    const est_prevu = detectPrevu(titre, description);

                    return {
                        id: Buffer.from(item.link || titre).toString('base64').substring(0, 20),
                        titre,
                        description,
                        image,
                        lien: item.link || '#',
                        date: date.toISOString(),
                        source: source.nom,
                        lang: source.lang,
                        categorie,
                        est_prevu
                    };
                }).filter(item => item.titre && item.lien !== '#');

                allItems.push(...items);
                logger.info(`RSS ${source.nom}: ${items.length} articles`);
            } catch (err) {
                logger.warn(`RSS ${source.nom} erreur: ${err.message}`);
            }
        })
    );

    // Tri par date décroissante, dédoublonnage par lien
    const seen = new Set();
    const unique = allItems
        .filter(item => {
            if (seen.has(item.lien)) return false;
            seen.add(item.lien);
            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    cache = { data: unique, ts: now };
    return unique;
}

/**
 * GET /api/nouveautes
 * Retourne les articles RSS tech récents, filtrés et catégorisés
 * Query: ?categorie=smartphone&days=7&prevu=true&limit=50
 */
router.get('/', async (req, res) => {
    try {
        let items = await fetchAllFeeds();

        const { categorie, days, prevu, limit = 100 } = req.query;

        if (categorie && categorie !== 'tout') {
            items = items.filter(i => i.categorie === categorie);
        }

        if (days) {
            const cutoff = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);
            items = items.filter(i => new Date(i.date) >= cutoff);
        }

        if (prevu === 'true') {
            items = items.filter(i => i.est_prevu);
        }

        items = items.slice(0, parseInt(limit));

        res.json({
            success: true,
            total: items.length,
            cached: Date.now() - cache.ts < CACHE_TTL,
            items
        });
    } catch (err) {
        logger.error('Erreur /api/nouveautes:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

/**
 * POST /api/nouveautes/refresh
 * Force le rafraîchissement du cache
 */
router.post('/refresh', async (req, res) => {
    cache = { data: null, ts: 0 };
    try {
        const items = await fetchAllFeeds();
        res.json({ success: true, total: items.length, message: 'Cache rafraîchi' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
