// Routes pour les tendances (actualités) par catégorie
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET tendances par catégorie (ex: /api/tendances/serveur)
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
      'SELECT * FROM actualites WHERE categorie_id = $1 ORDER BY date_publication DESC', 
      [catId]
    );
    
    // Pour compatibilité front : transformer tags string -> array si besoin
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET tendances:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// GET une tendance par ID
router.get('/item/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM actualites WHERE id = $1', [id]);
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Tendance non trouvée' });
    }
    
    const tendance = rows[0];
    
    // Normaliser tags
    if (typeof tendance.tags === 'string') {
      tendance.tags = tendance.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
    }
    
    res.json(tendance);
  } catch (err) {
    console.error('❌ Erreur GET tendance:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// POST ajouter une tendance
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
      `INSERT INTO actualites (titre, description, image, date_publication, tags, categorie_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [titre, description, image, date_publication, tagsStr, catId]
    );
    
    console.log('✅ Tendance créée:', result.rows[0].id);
    res.json({ success: true, tendance: result.rows[0] });
  } catch (err) {
    console.error('❌ Erreur POST tendance:', err);
    res.status(500).json({ error: 'Erreur ajout tendance' });
  }
});

// PUT modifier une tendance
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, image, date_publication, tags } = req.body;
    
    const tagsStr = Array.isArray(tags) ? `{${tags.join(',')}}` : tags;
    
    await pool.query(
      `UPDATE actualites 
       SET titre=$1, description=$2, image=$3, date_publication=$4, tags=$5 
       WHERE id=$6`,
      [titre, description, image, date_publication, tagsStr, id]
    );
    
    console.log('✅ Tendance mise à jour:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur PUT tendance:', err);
    res.status(500).json({ error: 'Erreur modification tendance' });
  }
});

// DELETE supprimer une tendance
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM actualites WHERE id=$1', [id]);
    
    console.log('✅ Tendance supprimée:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur DELETE tendance:', err);
    res.status(500).json({ error: 'Erreur suppression tendance' });
  }
});

module.exports = router;
