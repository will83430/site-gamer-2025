// Routes CRUD pour technologies
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET technologies par catégorie
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
      'SELECT * FROM technologies WHERE categorie_id = $1 ORDER BY ordre ASC, id ASC', 
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
    console.error('❌ Erreur GET technologies:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// POST ajouter une technologie
router.post('/', async (req, res) => {
  try {
    const { nom, description, icone, taux_adoption, categorie } = req.body;
    
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
      'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM technologies WHERE categorie_id = $1',
      [catId]
    );
    const newOrdre = maxRows[0].max_ordre + 1;
    
    const result = await pool.query(
      `INSERT INTO technologies (nom, description, icone, taux_adoption, categorie_id, ordre)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nom, description, icone, taux_adoption, catId, newOrdre]
    );
    
    console.log('✅ Technologie créée:', result.rows[0].id);
    res.json({ success: true, technologie: result.rows[0] });
  } catch (err) {
    console.error('❌ Erreur POST technologie:', err);
    res.status(500).json({ error: 'Erreur ajout technologie' });
  }
});

// PUT modifier une technologie
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, icone, taux_adoption } = req.body;
    
    await pool.query(
      `UPDATE technologies 
       SET nom=$1, description=$2, icone=$3, taux_adoption=$4 
       WHERE id=$5`,
      [nom, description, icone, taux_adoption, id]
    );
    
    console.log('✅ Technologie mise à jour:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur PUT technologie:', err);
    res.status(500).json({ error: 'Erreur modification technologie' });
  }
});

// DELETE supprimer une technologie
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la catégorie avant suppression
    const { rows: item } = await pool.query('SELECT categorie_id FROM technologies WHERE id=$1', [id]);
    if (!item.length) {
      return res.status(404).json({ error: 'Technologie non trouvée' });
    }
    const categorieId = item[0].categorie_id;
    
    // Supprimer l'item
    await pool.query('DELETE FROM technologies WHERE id=$1', [id]);
    
    // Réorganiser les ordres de manière séquentielle
    const { rows: remaining } = await pool.query(
      'SELECT id FROM technologies WHERE categorie_id=$1 ORDER BY ordre ASC, id ASC',
      [categorieId]
    );
    
    for (let i = 0; i < remaining.length; i++) {
      await pool.query('UPDATE technologies SET ordre=$1 WHERE id=$2', [i + 1, remaining[i].id]);
    }
    
    console.log('✅ Technologie supprimée et ordres réorganisés:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur DELETE technologie:', err);
    res.status(500).json({ error: 'Erreur suppression technologie' });
  }
});

module.exports = router;
