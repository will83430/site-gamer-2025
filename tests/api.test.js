// tests/api.test.js
// Tests des endpoints API
const request = require('supertest');
const express = require('express');

// Créer une instance de test du serveur
const app = express();
app.use(express.json());

// Importer les routes
const produitsRoutes = require('../backend/routes/produits');
const fichesRoutes = require('../backend/routes/fiches');
const tendancesRoutes = require('../backend/routes/tendances');

app.use('/api/produits', produitsRoutes);
app.use('/api', fichesRoutes);
app.use('/api/tendances', tendancesRoutes);
app.use('/api/actualites', tendancesRoutes);

describe('API Endpoints', () => {
  describe('GET /api/produits', () => {
    test('Should return all products', async () => {
      const response = await request(app).get('/api/produits');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('Should filter products by category', async () => {
      const response = await request(app).get('/api/produits?categorie=drone');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0].categorie).toBe('drone');
      }
    });
  });

  describe('GET /api/produits/:id', () => {
    test('Should return a specific product', async () => {
      const response = await request(app).get('/api/produits/prod_1');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test('Should return 404 for non-existent product', async () => {
      const response = await request(app).get('/api/produits/prod_999999');
      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/tendances/:categorie', () => {
    test('Should return tendances for a category', async () => {
      const response = await request(app).get('/api/tendances/drone');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/actualites/:categorie', () => {
    test('Should return actualites (same as tendances)', async () => {
      const response = await request(app).get('/api/actualites/drone');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
