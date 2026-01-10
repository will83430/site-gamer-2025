// Routes pour le contenu par catégorie (actualites, technologies, marche, insights, predictions)
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Helper pour récupérer l'id catégorie
async function getCategoryId(nom) {
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
      'SELECT * FROM actualites WHERE categorie_id = $1 ORDER BY ordre ASC, date_publication DESC, id DESC', 
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
      'SELECT * FROM technologies WHERE categorie_id = $1 ORDER BY ordre ASC, id ASC', 
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
      'SELECT * FROM marche WHERE categorie_id = $1 ORDER BY ordre ASC, id ASC', 
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
      'SELECT * FROM insights WHERE categorie_id = $1 ORDER BY ordre ASC, id ASC', 
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
      'SELECT * FROM predictions WHERE categorie_id = $1 ORDER BY ordre ASC, annee ASC, id ASC', 
      [catId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET predictions:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// Réordonner un item (monter/descendre)
router.post('/:categorie/:type/reorder', async (req, res) => {
  try {
    const { categorie, type } = req.params;
    const { id, direction } = req.body; // direction: 'up' ou 'down'
    
    // Valider le type
    const validTypes = ['actualites', 'technologies', 'marche', 'insights', 'predictions'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: 'Type invalide' });
    }
    
    const catId = await getCategoryId(categorie);
    if (!catId) {
      return res.status(404).json({ error: 'Catégorie inconnue' });
    }
    
    // Récupérer l'item actuel
    const { rows: current } = await pool.query(
      `SELECT * FROM ${type} WHERE id = $1 AND categorie_id = $2`,
      [id, catId]
    );
    
    if (!current.length) {
      return res.status(404).json({ error: 'Item non trouvé' });
    }
    
    const currentOrdre = current[0].ordre;
    
    // Trouver l'item à échanger
    const operator = direction === 'up' ? '<' : '>';
    const order = direction === 'up' ? 'DESC' : 'ASC';
    
    const { rows: neighbor } = await pool.query(
      `SELECT * FROM ${type} 
       WHERE categorie_id = $1 AND ordre ${operator} $2 
       ORDER BY ordre ${order} 
       LIMIT 1`,
      [catId, currentOrdre]
    );
    
    if (!neighbor.length) {
      return res.json({ success: true, message: 'Déjà en position extrême' });
    }
    
    const neighborId = neighbor[0].id;
    const neighborOrdre = neighbor[0].ordre;
    
    // Échanger les ordres
    await pool.query(
      `UPDATE ${type} SET ordre = $1 WHERE id = $2`,
      [neighborOrdre, id]
    );
    
    await pool.query(
      `UPDATE ${type} SET ordre = $1 WHERE id = $2`,
      [currentOrdre, neighborId]
    );
    
    console.log(`✅ Item ${id} réordonné (${direction})`);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur réordonnancement:', err);
    res.status(500).json({ error: 'Erreur réordonnancement' });
  }
});

module.exports = router;
