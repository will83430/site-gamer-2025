const request = require('supertest');
const app = require('../server-2026.js');

describe('API Articles', () => {

    test('GET /api/actualites — retourne uniquement les articles actifs', async () => {
        const res = await request(app).get('/api/actualites');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // Aucun article inactif dans la vue publique
        res.body.forEach(a => expect(a.actif).not.toBe(false));
    });

    test('GET /api/actualites?admin=true — inclut les articles masqués', async () => {
        const pub = await request(app).get('/api/actualites');
        const admin = await request(app).get('/api/actualites?admin=true');
        // La vue admin a au moins autant d'articles que la vue publique
        expect(admin.body.length).toBeGreaterThanOrEqual(pub.body.length);
    });

    test('GET /api/actualites/:id — retourne un article existant', async () => {
        const list = await request(app).get('/api/actualites');
        expect(list.body.length).toBeGreaterThan(0);
        const id = list.body[0].id;

        const res = await request(app).get(`/api/actualites/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.titre).toBeTruthy();
    });

    test('GET /api/actualites/:id — retourne 400 pour un ID non numérique', async () => {
        const res = await request(app).get('/api/actualites/abc');
        expect(res.status).toBe(400);
    });

    test('Articles — tous ont un titre et une catégorie', async () => {
        const res = await request(app).get('/api/actualites');
        res.body.forEach(a => {
            expect(a.titre).toBeTruthy();
            expect(a.categorie).toBeTruthy();
        });
    });

    test('GET /api/fiche-tendance/data/:id — retourne article + sections', async () => {
        const list = await request(app).get('/api/actualites');
        const id = list.body[0].id;

        const res = await request(app).get(`/api/fiche-tendance/data/${id}`);
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.titre).toBeTruthy();
        expect(Array.isArray(res.body.data.sections)).toBe(true);
    });
});
