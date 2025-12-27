const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { createFiche, deleteFiche, readFiche } = require('../utils/ficheGenerator');
const path = require('path');

// POST - Générer une fiche HTML
router.post('/generate-fiche/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le produit depuis PostgreSQL
    const result = await pool.query('SELECT * FROM produits WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }

    const product = result.rows[0];
    const baseDir = path.join(__dirname, '../..');

    // Générer la fiche
    const { path: fichePath } = createFiche(product, baseDir);

    res.json({
      success: true,
      message: `Fiche générée avec succès`,
      path: fichePath
    });

  } catch (error) {
    console.error('❌ Erreur génération fiche:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Supprimer une fiche HTML
router.delete('/fiches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le chemin du fichier depuis la BDD
    const { rows } = await pool.query('SELECT lien FROM produits WHERE id = $1', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Produit non trouvé' });
    }

    const fichePath = rows[0].lien;
    const baseDir = path.join(__dirname, '../..');
    
    const result = deleteFiche(fichePath, baseDir);
    res.json({ success: true, message: result.message });

  } catch (error) {
    console.error('❌ Erreur suppression fiche:', error);
    res.status(500).json({ success: false, error: 'Erreur suppression fiche' });
  }
});

// GET - Prévisualiser une fiche générée
router.get('/preview-fiche/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    console.log('🔍 Preview fiche pour ID:', productId);
    
    // Récupérer les infos du produit
    const result = await pool.query('SELECT * FROM produits WHERE id = $1', [productId]);
    
    if (result.rows.length === 0) {
      console.log('❌ Produit non trouvé pour ID:', productId);
      return res.json({ success: false, error: 'Produit non trouvé' });
    }
    
    const product = result.rows[0];
    console.log('📦 Produit trouvé:', product.nom);
    
    if (!product.lien) {
      console.log('❌ Aucun lien de fiche pour:', product.nom);
      return res.json({ success: false, error: 'Aucun lien de fiche défini pour ce produit' });
    }
    
    const baseDir = path.join(__dirname, '../..');
    const html = readFiche(product.lien, baseDir);
    
    if (html) {
      console.log('✅ Fichier trouvé et lu');
      res.json({ success: true, html });
    } else {
      console.log('❌ Fichier non trouvé');
      res.json({ 
        success: false, 
        error: 'Fichier HTML de la fiche non trouvé',
        lien: product.lien
      });
    }

  } catch (error) {
    console.error('❌ Erreur preview fiche:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
