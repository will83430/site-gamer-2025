// Routes pour les tendances (actualités) par catégorie
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { reorderItems, swapOrder } = require('../utils/dbTransactions');
const logger = require('../config/logger');

// GET toutes les tendances (tous types confondus)
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT a.*, c.nom as categorie
      FROM actualites a
      LEFT JOIN categories c ON a.categorie_id = c.id
      ORDER BY a.date_publication DESC, a.id DESC
    `);
    
    // Normaliser tags
    rows.forEach(r => {
      if (typeof r.tags === 'string') {
        r.tags = r.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
    });
    
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur GET toutes tendances:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

// GET un article spécifique par ID global
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que c'est bien un ID numérique, pas un nom de catégorie
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }
    
    const { rows } = await pool.query(`
      SELECT a.*, c.nom as categorie
      FROM actualites a
      LEFT JOIN categories c ON a.categorie_id = c.id
      WHERE a.id = $1
    `, [id]);
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    
    const article = rows[0];
    
    // Normaliser tags
    if (typeof article.tags === 'string') {
      article.tags = article.tags.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean);
    }
    
    res.json(article);
  } catch (err) {
    console.error('❌ Erreur GET article:', err);
    res.status(500).json({ error: 'Erreur BDD' });
  }
});

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
    const { titre, description, image, video_url, date_publication, tags, hot, categorie } = req.body;
    
    const { rows: catRows } = await pool.query(
      'SELECT id FROM categories WHERE LOWER(nom) = $1', 
      [categorie.toLowerCase()]
    );
    
    if (!catRows.length) {
      return res.status(400).json({ error: 'Catégorie inconnue' });
    }
    
    const catId = catRows[0].id;
    const tagsStr = Array.isArray(tags) ? `{${tags.join(',')}}` : tags;
    
    // Récupérer le max ordre pour cette catégorie
    const { rows: maxRows } = await pool.query(
      'SELECT COALESCE(MAX(ordre), 0) as max_ordre FROM actualites WHERE categorie_id = $1',
      [catId]
    );
    const newOrdre = maxRows[0].max_ordre + 1;
    
    const result = await pool.query(
      `INSERT INTO actualites (titre, description, image, video_url, date_publication, tags, hot, categorie_id, ordre)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [titre, description, image, video_url || null, date_publication, tagsStr, hot || false, catId, newOrdre]
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
    const { titre, description, image, video_url, date_publication, tags, hot } = req.body;
    
    const tagsStr = Array.isArray(tags) ? `{${tags.join(',')}}` : tags;
    
    await pool.query(
      `UPDATE actualites 
       SET titre=$1, description=$2, image=$3, video_url=$4, date_publication=$5, tags=$6, hot=$7 
       WHERE id=$8`,
      [titre, description, image, video_url || null, date_publication, tagsStr, hot || false, id]
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
    
    // Récupérer la catégorie avant suppression
    const { rows: item } = await pool.query('SELECT categorie_id FROM actualites WHERE id=$1', [id]);
    if (!item.length) {
      return res.status(404).json({ error: 'Tendance non trouvée' });
    }
    const categorieId = item[0].categorie_id;
    
    // Supprimer l'item
    await pool.query('DELETE FROM actualites WHERE id=$1', [id]);
    
    // Réorganiser les ordres de manière séquentielle
    const { rows: remaining } = await pool.query(
      'SELECT id FROM actualites WHERE categorie_id=$1 ORDER BY ordre ASC, date_publication DESC, id DESC',
      [categorieId]
    );
    
    for (let i = 0; i < remaining.length; i++) {
      await pool.query('UPDATE actualites SET ordre=$1 WHERE id=$2', [i + 1, remaining[i].id]);
    }
    
    console.log('✅ Tendance supprimée et ordres réorganisés:', id);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur DELETE tendance:', err);
    res.status(500).json({ error: 'Erreur suppression tendance' });
  }
});

// POST - Réorganiser plusieurs tendances (avec transaction)
router.post('/reorder', async (req, res) => {
  try {
    const { items } = req.body; // items = [{id, ordre}, ...]

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre items (tableau) est requis'
      });
    }

    await reorderItems('actualites', items);

    logger.info(`Réorganisation de ${items.length} actualités`);

    res.json({
      success: true,
      message: `${items.length} actualités réorganisées`,
      count: items.length
    });
  } catch (err) {
    logger.error('Erreur réorganisation tendances:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la réorganisation'
    });
  }
});

// POST - Échanger l'ordre de deux tendances (avec transaction)
router.post('/swap', async (req, res) => {
  try {
    const { id1, id2 } = req.body;

    if (!id1 || !id2) {
      return res.status(400).json({
        success: false,
        error: 'Les paramètres id1 et id2 sont requis'
      });
    }

    await swapOrder('actualites', id1, id2);

    logger.info(`Échange ordre actualités: ${id1} <-> ${id2}`);

    res.json({
      success: true,
      message: 'Ordre échangé avec succès'
    });
  } catch (err) {
    logger.error('Erreur échange ordre tendances:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Erreur lors de l\'échange'
    });
  }
});

module.exports = router;
