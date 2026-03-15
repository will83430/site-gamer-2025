const request = require('supertest');
const app = require('../server-2026.js');

describe('API Catégories', () => {

    test('GET /api/categories — retourne 16 catégories', async () => {
        const res = await request(app).get('/api/categories');
        expect(res.status).toBe(200);
        const cats = res.body.data || res.body;
        expect(Array.isArray(cats)).toBe(true);
        expect(cats.length).toBeGreaterThanOrEqual(16);
    });

    test('Catégories — toutes ont un nom', async () => {
        const res = await request(app).get('/api/categories');
        const cats = res.body.data || res.body;
        cats.forEach(c => {
            expect(c.nom).toBeTruthy();
        });
    });
});

describe('API Annonces', () => {

    test('GET /api/announcements — retourne les annonces actives', async () => {
        const res = await request(app).get('/api/announcements');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.announcements)).toBe(true);
    });

    test('GET /api/announcements/admin/all — retourne toutes les annonces', async () => {
        const res = await request(app).get('/api/announcements/admin/all');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.announcements)).toBe(true);
    });
});

describe('API Bons Plans & Prix', () => {

    test('GET /api/bons-plans?days=0 — retourne un tableau', async () => {
        const res = await request(app).get('/api/bons-plans?days=0');
        expect(res.status).toBe(200);
        // L'API retourne { deals: [...] }
        const data = res.body.deals || res.body.data || res.body;
        expect(Array.isArray(data)).toBe(true);
    });

    test('GET /api/price-evolution/produit/:id — retourne historique pour produit existant', async () => {
        const list = await request(app).get('/api/produits');
        const id = list.body.data[0].id;

        const res = await request(app).get(`/api/price-evolution/produit/${id}`);
        expect(res.status).toBe(200);
    });
});

describe('API Stats & SEO', () => {

    test('GET /api/stats/homepage — retourne des compteurs', async () => {
        const res = await request(app).get('/api/stats/homepage');
        expect(res.status).toBe(200);
        // L'API retourne { success: true, stats: { produits, categories, tendances, visites } }
        expect(res.body.stats.produits).toBeGreaterThan(0);
        expect(res.body.stats.tendances).toBeGreaterThan(0);
        expect(res.body.stats.categories).toBeGreaterThan(0);
    });

    test('GET /sitemap.xml — retourne un XML valide', async () => {
        const res = await request(app).get('/sitemap.xml');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/xml/);
        expect(res.text).toContain('<urlset');
        expect(res.text).toContain('<url>');
    });
});

describe('Pages Frontend', () => {

    test('GET /2026/ — page accueil accessible', async () => {
        const res = await request(app).get('/2026/');
        expect(res.status).toBe(200);
    });

    test('GET /2026/produits.html — page produits accessible', async () => {
        const res = await request(app).get('/2026/produits.html');
        expect(res.status).toBe(200);
    });

    test('GET /2026/admin.html — page admin accessible', async () => {
        const res = await request(app).get('/2026/admin.html');
        expect(res.status).toBe(200);
    });

    test('GET /versus — redirige vers la page versus', async () => {
        const res = await request(app).get('/versus');
        expect([200, 301, 302]).toContain(res.status);
    });
});
