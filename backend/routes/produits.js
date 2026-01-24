const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const path = require('path');
const fs = require('fs');
const { validateProductCreate, validateProductUpdate, validateId } = require('../middleware/validators');
const { slugToTitreAffiche, cleanImagePath } = require('../utils/helpers');

// GET - Récupérer tous les produits ou filtrer par catégorie
router.get('/', async (req, res) => {
  try {
    const { categorie } = req.query;
    let query = `
      SELECT 
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p
    `;
    const params = [];
    
    if (categorie) {
      // Convertir tirets en espaces pour correspondre au format DB
      const categorieNormalized = categorie.replace(/-/g, ' ');
      query += ` WHERE LOWER(categorie) = LOWER($1)`;
      params.push(categorieNormalized);
    }
    
    query += ` ORDER BY categorie, nom`;
    
    const result = await pool.query(query, params);
    console.log(`✅ Produits récupérés: ${result.rows.length}`);

    // Traiter les images pour ajouter image_url
    const productsWithImages = result.rows.map(product => {
      if (product.image) {
        product.image_url = `/assets/images/${product.image}`;
      } else {
        product.image_url = '/assets/images/placeholder.png';
      }
      return product;
    });
    
    res.json({
      success: true,
      data: productsWithImages,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Erreur GET produits:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer un produit par ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p 
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    const product = result.rows[0];

    // Correction du chemin de l'image
    if (product.image) {
      const cleanImage = cleanImagePath(product.image);
      product.image_url = `/assets/images/${cleanImage}`;
    } else {
      product.image_url = '/assets/images/placeholder.png';
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Erreur GET produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Créer un nouveau produit avec ID auto-généré
router.post('/', validateProductCreate, async (req, res) => {
  try {
    const {
      nom, categorie, description, image, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche,
      titre_affiche
    } = req.body;
    
    if (!nom) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du produit est obligatoire'
      });
    }

    // Générer un nouvel ID automatiquement
    const maxIdResult = await pool.query(`
      SELECT COALESCE(
        MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 
        45
      ) + 1 as next_id 
      FROM produits 
      WHERE id LIKE 'prod_%'
    `);

    const nextId = `prod_${maxIdResult.rows[0].next_id}`;

    const titreAfficheFinal = titre_affiche && titre_affiche.trim() !== ''
        ? titre_affiche 
        : slugToTitreAffiche(nom);

    const params = [
      nextId,
      nom, categorie || null, description || null,
      image || null,
      lien || null,
      top_du_mois || false, prix || null,
      fonctionnalites_avancees || [], donnees_fiche || [],
      titreAfficheFinal
    ];

    const query = `
      INSERT INTO produits 
      (id, nom, categorie, description, image, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche, titre_affiche)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, params);
    console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: `Produit créé avec l'ID ${nextId}`
    });

  } catch (error) {
    console.error('❌ Erreur POST produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT - Mettre à jour un produit
router.put('/:id', validateProductUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom, categorie, description, image, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche,
      titre_affiche
    } = req.body;

    const query = `
      UPDATE produits 
      SET nom = $1, 
          categorie = $2, 
          description = $3, 
          image = $4,
          lien = $5, 
          top_du_mois = $6, 
          prix = $7, 
          fonctionnalites_avancees = $8, 
          donnees_fiche = $9,
          titre_affiche = $10
      WHERE id = $11
      RETURNING *
    `;

    const params = [
      nom, 
      categorie || null, 
      description || null,
      image || null,
      lien || null,
      top_du_mois || false, 
      prix || null,
      fonctionnalites_avancees || [], 
      donnees_fiche || [],
      titre_affiche || null,
      id
    ];

    const result = await pool.query(query, params);
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Produit mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur PUT produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE - Supprimer un produit
router.delete('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM produits WHERE id = $1 RETURNING nom',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }
    res.json({
      success: true,
      message: `Produit "${result.rows[0].nom}" supprimé avec succès`
    });

  } catch (error) {
    console.error('❌ Erreur DELETE produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
