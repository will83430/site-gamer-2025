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
      'SELECT * FROM technologies WHERE categorie_id = $1', 
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
    const { titre, description, image, date_publication, tags, categorie } = req.body;
    
    const { rows: catRows } = await pool.query(
      'SELECT id FROM categories WHERE LOWER(nom) = $1', 
      [categorie.toLowerCase()]
    );
    
    if (!catRows.length) {
      return res.status(400).json({ error: 'Catégorie inconnue' });
    }
    
    const catId = catRows[0].id;
    const tagsStr = Array.isArray(tags) ? `{${tags.join(',')}}` : tags;
    
    const result = await pool.query(
      `INSERT INTO technologies (titre, description, image, date_publication, tags, categorie_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, description, image, date_publication, tagsStr, catId]
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
    const { titre, description, image, date_publication, tags } = req.body;
    
    const tagsStr = Array.isArray(tags) ? `{${tags.join(',')}}` : tags;
    
    await pool.query(
      `UPDATE technologies 
       SET titre=$1, description=$2, image=$3, date_publication=$4, tags=$5 
       WHERE id=$6`,
      [titre, description, image, date_publication, tagsStr, id]
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
    await pool.query('DELETE FROM technologies WHERE id=$1', [id]);
    
    console.log('✅ Technologie supprimée:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur DELETE technologie:', err);
    res.status(500).json({ error: 'Erreur suppression technologie' });
  }
});

module.exports = router;
