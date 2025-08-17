// server.js - API Express pour récupérer les données PostgreSQL
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Configuration PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'gamer_2025',
  password: 'ton_mot_de_passe',  // ← CHANGE ÇA
  port: 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend/public'));

// Route pour récupérer tous les produits
app.get('/api/produits', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, nom, categorie, description, image, lien, 
        top_du_mois, prix, fonctionnalites_avancees, donnees_fiche
      FROM produits 
      ORDER BY categorie, nom
    `);
    
    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des produits'
    });
  }
});

// Route pour les statistiques
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT id) AS total_products,
        COUNT(DISTINCT categorie) AS total_categories,
        COUNT(*) FILTER (WHERE top_du_mois = TRUE) AS featured_products
      FROM produits
    `);
    
    res.json({
      success: true,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
});

// Test connexion PostgreSQL
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur connexion PostgreSQL:', err);
  } else {
    console.log('✅ Connexion PostgreSQL établie');
  }
});