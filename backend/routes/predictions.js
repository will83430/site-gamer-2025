// Routes CRUD pour predictions
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// GET predictions par catégorie
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
      'SELECT * FROM predictions WHERE categorie_id = $1 ORDER BY ordre ASC, annee ASC, id ASC', 
      [catId]
    );
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET predictions:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// POST ajouter une prédiction
router.post('/', async (req, res) => {
  try {
    const { annee, titre, description, icone, probabilite, categorie } = req.body;
    
    const { rows: catRows } = await pool.query(
      'SELECT id FROM categories WHERE LOWER(nom) = $1', 
      [categorie.toLowerCase()]
    );
    
    if (!catRows.length) {
      return res.status(400).json({ error: 'Catégorie inconnue' });
    }
    
    const catId = catRows[0].id;
    const anneeInt = annee === '' || annee === undefined ? null : parseInt(annee, 10);
    const probInt = probabilite === '' || probabilite === undefined ? null : parseInt(probabilite, 10);
    
    // Récupérer le max ordre pour cette catégorie
    const { rows: maxRows } = await pool.query(
      'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM predictions WHERE categorie_id = $1',
      [catId]
    );
    const newOrdre = maxRows[0].max_ordre + 1;
    
    const result = await pool.query(
      `INSERT INTO predictions (annee, titre, description, icone, probabilite, categorie_id, ordre)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [anneeInt, titre, description || null, icone || null, probInt, catId, newOrdre]
    );
    
    console.log('✅ Prédiction créée:', result.rows[0].id);
    res.json({ success: true, prediction: result.rows[0] });
  } catch (err) {
    console.error('❌ Erreur POST prediction:', err);
    res.status(500).json({ error: 'Erreur ajout prédiction' });
  }
});

// PUT modifier une prédiction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { annee, titre, description, icone, probabilite } = req.body;
    
    const anneeInt = annee === '' || annee === undefined ? null : parseInt(annee, 10);
    const probInt = probabilite === '' || probabilite === undefined ? null : parseInt(probabilite, 10);
    
    await pool.query(
      `UPDATE predictions 
       SET annee=$1, titre=$2, description=$3, icone=$4, probabilite=$5 
       WHERE id=$6`,
      [anneeInt, titre, description || null, icone || null, probInt, id]
    );
    
    console.log('✅ Prédiction mise à jour:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur PUT prediction:', err);
    res.status(500).json({ error: 'Erreur modification prédiction' });
  }
});

// DELETE supprimer une prédiction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la catégorie avant suppression
    const { rows: item } = await pool.query('SELECT categorie_id FROM predictions WHERE id=$1', [id]);
    if (!item.length) {
      return res.status(404).json({ error: 'Prédiction non trouvée' });
    }
    const categorieId = item[0].categorie_id;
    
    // Supprimer l'item
    await pool.query('DELETE FROM predictions WHERE id=$1', [id]);
    
    // Réorganiser les ordres de manière séquentielle
    const { rows: remaining } = await pool.query(
      'SELECT id FROM predictions WHERE categorie_id=$1 ORDER BY ordre ASC, annee ASC, id ASC',
      [categorieId]
    );
    
    for (let i = 0; i < remaining.length; i++) {
      await pool.query('UPDATE predictions SET ordre=$1 WHERE id=$2', [i + 1, remaining[i].id]);
    }
    
    console.log('✅ Prédiction supprimée et ordres réorganisés:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur DELETE prediction:', err);
    res.status(500).json({ error: 'Erreur suppression prédiction' });
  }
});

module.exports = router;
