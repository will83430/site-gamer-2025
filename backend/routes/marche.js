// Routes CRUD pour marché
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET marché par catégorie
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
      'SELECT * FROM marche WHERE categorie_id = $1 ORDER BY ordre ASC, id ASC', 
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
    console.error('❌ Erreur GET marché:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// POST ajouter une donnée marché
router.post('/', async (req, res) => {
  try {
    const { label, valeur, tendance, icone, categorie } = req.body;
    
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
      'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM marche WHERE categorie_id = $1',
      [catId]
    );
    const newOrdre = maxRows[0].max_ordre + 1;
    
    const result = await pool.query(
      `INSERT INTO marche (label, valeur, tendance, icone, categorie_id, ordre)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [label, valeur, tendance, icone, catId, newOrdre]
    );
    
    console.log('✅ Marché créé:', result.rows[0].id);
    res.json({ success: true, marche: result.rows[0] });
  } catch (err) {
    console.error('❌ Erreur POST marché:', err);
    res.status(500).json({ error: 'Erreur ajout marché' });
  }
});

// PUT modifier une donnée marché
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { label, valeur, tendance, icone } = req.body;
    
    await pool.query(
      `UPDATE marche 
       SET label=$1, valeur=$2, tendance=$3, icone=$4 
       WHERE id=$5`,
      [label, valeur, tendance, icone, id]
    );
    
    console.log('✅ Marché mis à jour:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur PUT marché:', err);
    res.status(500).json({ error: 'Erreur modification marché' });
  }
});

// DELETE supprimer une donnée marché
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la catégorie avant suppression
    const { rows: item } = await pool.query('SELECT categorie_id FROM marche WHERE id=$1', [id]);
    if (!item.length) {
      return res.status(404).json({ error: 'Marché non trouvé' });
    }
    const categorieId = item[0].categorie_id;
    
    // Supprimer l'item
    await pool.query('DELETE FROM marche WHERE id=$1', [id]);
    
    // Réorganiser les ordres de manière séquentielle
    const { rows: remaining } = await pool.query(
      'SELECT id FROM marche WHERE categorie_id=$1 ORDER BY ordre ASC, id ASC',
      [categorieId]
    );
    
    for (let i = 0; i < remaining.length; i++) {
      await pool.query('UPDATE marche SET ordre=$1 WHERE id=$2', [i + 1, remaining[i].id]);
    }
    
    console.log('✅ Marché supprimé et ordres réorganisés:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur DELETE marché:', err);
    res.status(500).json({ error: 'Erreur suppression marché' });
  }
});

module.exports = router;
