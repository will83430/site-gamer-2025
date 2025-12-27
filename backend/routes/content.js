// Routes pour le contenu par catégorie (actualites, technologies, marche, insights, predictions)
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Helper pour récupérer l'id catégorie
async function getCategoryId(nom) {
  console.log(`[LOG] Recherche de l'id pour la catégorie : ${nom}`);
  const { rows } = await pool.query('SELECT id FROM categories WHERE LOWER(nom) = $1', [nom.toLowerCase()]);
  if (rows.length === 0) {
    console.warn(`[WARN] Catégorie non trouvée : ${nom}`);
    return null;
  }
  return rows[0].id;
}

// Actualités par catégorie
router.get('/:categorie/actualites', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const catId = await getCategoryId(cat);
    
    if (!catId) {
      return res.status(404).json({ error: 'Catégorie inconnue' });
    }
    
    const { rows } = await pool.query(
      'SELECT * FROM actualites WHERE categorie_id = $1 ORDER BY date_publication DESC', 
      [catId]
    );
    
    // Normaliser tags
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET actualites:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// Technologies par catégorie
router.get('/:categorie/technologies', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const catId = await getCategoryId(cat);
    
    if (!catId) {
      return res.status(404).json({ error: 'Catégorie inconnue' });
    }
    
    const { rows } = await pool.query(
      'SELECT * FROM technologies WHERE categorie_id = $1', 
      [catId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET technologies:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// Marché par catégorie
router.get('/:categorie/marche', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const catId = await getCategoryId(cat);
    
    if (!catId) {
      return res.status(404).json({ error: 'Catégorie inconnue' });
    }
    
    const { rows } = await pool.query(
      'SELECT * FROM marche WHERE categorie_id = $1', 
      [catId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET marche:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// Insights par catégorie
router.get('/:categorie/insights', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const catId = await getCategoryId(cat);
    
    if (!catId) {
      return res.status(404).json({ error: 'Catégorie inconnue' });
    }
    
    const { rows } = await pool.query(
      'SELECT * FROM insights WHERE categorie_id = $1', 
      [catId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET insights:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// Prédictions par catégorie
router.get('/:categorie/predictions', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const catId = await getCategoryId(cat);
    
    if (!catId) {
      return res.status(404).json({ error: 'Catégorie inconnue' });
    }
    
    const { rows } = await pool.query(
      'SELECT * FROM predictions WHERE categorie_id = $1 ORDER BY annee', 
      [catId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET predictions:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

module.exports = router;
