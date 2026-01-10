// Routes CRUD pour insights
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET insights par catégorie
router.get('/:categorie', async (req, res) => {
  try {
    const cat = req.params.categorie;
    const { rows: catRows } = await pool.query(
      'SELECT id FROM categories WHERE LOWER(nom) = $1', 
      [cat.toLowerCase()]
    );
    
    if (!catRows.length) {
      return res.status(404).json({ error: 'Catégorie inconnue' });
    }
    
    const catId = catRows[0].id;
    const { rows } = await pool.query(
      'SELECT * FROM insights WHERE categorie_id = $1 ORDER BY ordre ASC, id ASC', 
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
    console.error('❌ Erreur GET insights:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// POST ajouter un insight
router.post('/', async (req, res) => {
  try {
    const { titre, description, icone, categorie } = req.body;
    
    const { rows: catRows } = await pool.query(
      'SELECT id FROM categories WHERE LOWER(nom) = $1', 
      [categorie.toLowerCase()]
    );
    
    if (!catRows.length) {
      return res.status(400).json({ error: 'Catégorie inconnue' });
    }
    
    const catId = catRows[0].id;
    
    // Récupérer le max ordre pour cette catégorie
    const { rows: maxRows } = await pool.query(
      'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM insights WHERE categorie_id = $1',
      [catId]
    );
    const newOrdre = maxRows[0].max_ordre + 1;
    
    const result = await pool.query(
      `INSERT INTO insights (titre, description, icone, categorie_id, ordre)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titre, description, icone, catId, newOrdre]
    );
    
    console.log('✅ Insight créé:', result.rows[0].id);
    res.json({ success: true, insight: result.rows[0] });
  } catch (err) {
    console.error('❌ Erreur POST insight:', err);
    res.status(500).json({ error: 'Erreur ajout insight' });
  }
});

// PUT modifier un insight
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, icone } = req.body;
    
    await pool.query(
      `UPDATE insights 
       SET titre=$1, description=$2, icone=$3 
       WHERE id=$4`,
      [titre, description, icone, id]
    );
    
    console.log('✅ Insight mis à jour:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur PUT insight:', err);
    res.status(500).json({ error: 'Erreur modification insight' });
  }
});

// DELETE supprimer un insight
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la catégorie avant suppression
    const { rows: item } = await pool.query('SELECT categorie_id FROM insights WHERE id=$1', [id]);
    if (!item.length) {
      return res.status(404).json({ error: 'Insight non trouvé' });
    }
    const categorieId = item[0].categorie_id;
    
    // Supprimer l'item
    await pool.query('DELETE FROM insights WHERE id=$1', [id]);
    
    // Réorganiser les ordres de manière séquentielle
    const { rows: remaining } = await pool.query(
      'SELECT id FROM insights WHERE categorie_id=$1 ORDER BY ordre ASC, id ASC',
      [categorieId]
    );
    
    for (let i = 0; i < remaining.length; i++) {
      await pool.query('UPDATE insights SET ordre=$1 WHERE id=$2', [i + 1, remaining[i].id]);
    }
    
    console.log('✅ Insight supprimé et ordres réorganisés:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur DELETE insight:', err);
    res.status(500).json({ error: 'Erreur suppression insight' });
  }
});

module.exports = router;
