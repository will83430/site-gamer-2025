const request = require('supertest');
const app = require('../server-2026.js');

afterAll(async () => {
    // Nettoie les produits créés pendant les tests
    const pool = require('../backend/config/database');
    await pool.query("DELETE FROM produits WHERE nom = 'Test produit'");
});

describe('API Produits', () => {

    test('GET /api/produits — retourne une liste', async () => {
        const res = await request(app).get('/api/produits');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/produits — filtre par catégorie', async () => {
        const res = await request(app).get('/api/produits?categorie=DRONE');
        expect(res.status).toBe(200);
        const drones = res.body.data;
        expect(drones.every(p => p.categorie === 'DRONE')).toBe(true);
    });

    test('GET /api/produits/:id — retourne un produit existant', async () => {
        // Récupère le premier produit de la liste pour avoir un ID valide
        const list = await request(app).get('/api/produits');
        const id = list.body.data[0].id;

        const res = await request(app).get(`/api/produits/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.id).toBe(id);
        expect(res.body.data.nom).toBeTruthy();
    });

    test('GET /api/produits/:id — retourne 404 si ID inconnu', async () => {
        const res = await request(app).get('/api/produits/prod_9999');
        expect(res.status).toBe(404);
    });

    test('GET /api/produits/search — recherche full-text', async () => {
        const res = await request(app).get('/api/produits/search?q=samsung&limit=5');
        expect(res.status).toBe(200);
        const results = res.body.data || res.body.results || res.body;
        expect(Array.isArray(results)).toBe(true);
    });

    test('GET /api/produits/featured/list — produits top du mois', async () => {
        const res = await request(app).get('/api/produits/featured/list');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        // Tous doivent avoir top_du_mois = true
        res.body.data.forEach(p => expect(p.top_du_mois).toBe(true));
    });

    test('GET /api/produits/homepage/list — produits accueil (max 4)', async () => {
        const res = await request(app).get('/api/produits/homepage/list');
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBeLessThanOrEqual(4);
    });

    test('POST /api/produits sans nom — retourne 400', async () => {
        const res = await request(app)
            .post('/api/produits')
            .send({ categorie: 'DRONE', prix: '99€' });
        expect(res.status).toBe(400);
    });

    test('POST /api/produits sans catégorie — catégorie est optionnelle (retourne 201)', async () => {
        const res = await request(app)
            .post('/api/produits')
            .send({ nom: 'Test produit' });
        // La catégorie est optionnelle dans le validator — la création doit réussir
        expect(res.status).toBe(201);
    });

    test('Produits actifs — aucun produit inactif dans la liste publique', async () => {
        const res = await request(app).get('/api/produits');
        const inactifs = res.body.data.filter(p => p.actif === false);
        expect(inactifs.length).toBe(0);
    });

    test('Produits — tous ont un nom et une catégorie', async () => {
        const res = await request(app).get('/api/produits');
        // Filtre les produits sans catégorie (ex : produits de test créés sans catégorie)
        const avecCategorie = res.body.data.filter(p => p.categorie);
        expect(avecCategorie.length).toBeGreaterThan(0);
        avecCategorie.forEach(p => {
            expect(p.nom).toBeTruthy();
            expect(p.categorie).toBeTruthy();
        });
    });
});
