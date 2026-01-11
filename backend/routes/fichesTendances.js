const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { createFicheTendance, deleteFicheTendance } = require('../utils/ficheTendanceGenerator');
const path = require('path');

// GET - Récupérer un article avec ses sections pour affichage dynamique dans la fiche
router.get('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer l'article
    const articleResult = await pool.query(`
      SELECT a.*, c.nom as categorie 
      FROM actualites a
      LEFT JOIN categories c ON a.categorie_id = c.id
      WHERE a.id = $1
    `, [id]);
    
    if (articleResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Article non trouvé' });
    }
    
    const article = articleResult.rows[0];
    
    // Récupérer les sections de l'article
    const sectionsResult = await pool.query(`
      SELECT titre, contenu, ordre
      FROM actualites_sections
      WHERE actualite_id = $1
      ORDER BY ordre
    `, [id]);
    
    article.sections = sectionsResult.rows;
    
    res.json({
      success: true,
      data: article
    });
    
  } catch (error) {
    console.error('❌ Erreur récupération article:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Générer une fiche HTML pour une tendance
router.post('/generate-fiche-tendance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer la tendance depuis PostgreSQL
    const result = await pool.query('SELECT * FROM actualites WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tendance non trouvée' });
    }

    const tendance = result.rows[0];
    
    // Récupérer le nom de la catégorie
    const catResult = await pool.query('SELECT nom FROM categories WHERE id = $1', [tendance.categorie_id]);
    if (catResult.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Catégorie non trouvée' });
    }

    const categorie = catResult.rows[0].nom;
    const baseDir = path.join(__dirname, '../..');

    // Générer la fiche avec accès à la BDD
    const { path: fichePath } = await createFicheTendance(tendance, categorie, baseDir, pool);

    // Mettre à jour le lien dans la base de données
    await pool.query(
      'UPDATE actualites SET lien = $1 WHERE id = $2',
      [fichePath, id]
    );

    res.json({
      success: true,
      message: `Fiche tendance générée avec succès`,
      path: fichePath
    });

  } catch (error) {
    console.error('❌ Erreur génération fiche tendance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Supprimer une fiche HTML de tendance
router.delete('/fiches-tendances/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer le chemin du fichier depuis la BDD
    const { rows } = await pool.query('SELECT lien FROM actualites WHERE id = $1', [id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Tendance non trouvée' });
    }

    const fichePath = rows[0].lien;
    const baseDir = path.join(__dirname, '../..');
    
    const result = deleteFicheTendance(fichePath, baseDir);
    
    // Supprimer le lien de la base de données
    await pool.query('UPDATE actualites SET lien = NULL WHERE id = $1', [id]);

    res.json({ success: true, message: result.message });

  } catch (error) {
    console.error('❌ Erreur suppression fiche tendance:', error);
    res.status(500).json({ success: false, error: 'Erreur suppression fiche tendance' });
  }
});

// POST - Régénérer toutes les fiches tendances
router.post('/regenerate-all-tendances', async (req, res) => {
  try {
    const baseDir = path.join(__dirname, '../..');
    
    // Récupérer toutes les tendances avec leurs catégories
    const result = await pool.query(`
      SELECT a.*, c.nom as categorie_nom 
      FROM actualites a
      JOIN categories c ON a.categorie_id = c.id
      ORDER BY a.date_publication DESC
    `);

    const tendances = result.rows;
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const tendance of tendances) {
      try {
        const { path: fichePath } = await createFicheTendance(tendance, tendance.categorie_nom, baseDir, pool);
        
        // Mettre à jour le lien dans la base de données
        await pool.query(
          'UPDATE actualites SET lien = $1 WHERE id = $2',
          [fichePath, tendance.id]
        );

        results.push({ id: tendance.id, titre: tendance.titre, success: true });
        successCount++;
      } catch (error) {
        console.error(`❌ Erreur génération fiche pour ${tendance.titre}:`, error);
        results.push({ id: tendance.id, titre: tendance.titre, success: false, error: error.message });
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Génération terminée: ${successCount} succès, ${errorCount} erreurs`,
      total: tendances.length,
      successCount,
      errorCount,
      results
    });

  } catch (error) {
    console.error('❌ Erreur régénération globale:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Régénérer les fiches tendances HOT uniquement
router.post('/regenerate-hot-tendances', async (req, res) => {
  try {
    const baseDir = path.join(__dirname, '../..');
    
    // Récupérer les tendances HOT avec leurs catégories
    const result = await pool.query(`
      SELECT a.*, c.nom as categorie_nom 
      FROM actualites a
      JOIN categories c ON a.categorie_id = c.id
      WHERE a.hot = true
      ORDER BY a.date_publication DESC
    `);

    const tendances = result.rows;
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const tendance of tendances) {
      try {
        const { path: fichePath } = await createFicheTendance(tendance, tendance.categorie_nom, baseDir, pool);
        
        // Mettre à jour le lien dans la base de données
        await pool.query(
          'UPDATE actualites SET lien = $1 WHERE id = $2',
          [fichePath, tendance.id]
        );

        results.push({ id: tendance.id, titre: tendance.titre, success: true });
        successCount++;
      } catch (error) {
        console.error(`❌ Erreur génération fiche pour ${tendance.titre}:`, error);
        results.push({ id: tendance.id, titre: tendance.titre, success: false, error: error.message });
        errorCount++;
      }
    }

    res.json({
      success: true,
      message: `Génération HOT terminée: ${successCount} succès, ${errorCount} erreurs`,
      total: tendances.length,
      successCount,
      errorCount,
      results
    });

  } catch (error) {
    console.error('❌ Erreur régénération HOT:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ENDPOINTS POUR GESTION DES SECTIONS ==========

// GET - Compter toutes les sections
router.get('/sections/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM actualites_sections');
    res.json({ success: true, count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('❌ Erreur comptage sections:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST - Créer une nouvelle section
router.post('/sections', async (req, res) => {
  try {
    const { actualite_id, titre, contenu, ordre } = req.body;
    
    const result = await pool.query(`
      INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [actualite_id, titre, contenu, ordre]);
    
    res.json({ success: true, section: result.rows[0] });
  } catch (error) {
    console.error('❌ Erreur création section:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT - Modifier une section
router.put('/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, contenu, ordre } = req.body;
    
    const result = await pool.query(`
      UPDATE actualites_sections
      SET titre = $1, contenu = $2, ordre = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [titre, contenu, ordre, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Section non trouvée' });
    }
    
    res.json({ success: true, section: result.rows[0] });
  } catch (error) {
    console.error('❌ Erreur modification section:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE - Supprimer une section
router.delete('/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM actualites_sections WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Section non trouvée' });
    }
    
    res.json({ success: true, message: 'Section supprimée' });
  } catch (error) {
    console.error('❌ Erreur suppression section:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET - Prévisualiser une fiche tendance
router.get('/preview/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Récupérer l'article avec ses sections
    const articleResult = await pool.query(`
      SELECT a.*, c.nom as categorie_nom
      FROM actualites a
      LEFT JOIN categories c ON a.categorie_id = c.id
      WHERE a.id = $1
    `, [id]);
    
    if (articleResult.rows.length === 0) {
      return res.status(404).send('<h1>Article non trouvé</h1>');
    }
    
    const article = articleResult.rows[0];
    
    // Récupérer les sections
    const sectionsResult = await pool.query(`
      SELECT titre, contenu, ordre
      FROM actualites_sections
      WHERE actualite_id = $1
      ORDER BY ordre
    `, [id]);
    
    const sections = sectionsResult.rows;
    
    // Générer le HTML complet pour prévisualisation
    const sectionsHTML = sections.map(section => `
      <div class="section-bloc">
        <h3 style="color: #667eea; margin: 30px 0 15px 0; font-size: 1.4em; border-left: 4px solid #667eea; padding-left: 15px;">
          ${section.titre}
        </h3>
        <div style="line-height: 1.8; color: #444; white-space: pre-wrap;">
          ${section.contenu.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </div>
      </div>
    `).join('');
    
    const previewHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>PRÉVISUALISATION - ${article.titre}</title>
    <link rel="stylesheet" href="/assets/css/styles.min.css">
    <style>
      body { padding: 20px; background: #f5f5f5; }
      .preview-header { 
        background: #e74c3c; 
        color: white; 
        padding: 10px 20px; 
        margin: -20px -20px 20px -20px; 
        text-align: center; 
        font-weight: bold;
      }
      .section-bloc { margin: 20px 0; }
    </style>
</head>
<body>
    <div class="preview-header">🔍 MODE PRÉVISUALISATION</div>
    
    <div class="entete">
        <img src="/assets/images/gaming.png" alt="Gaming">
    </div>

    <h1 class="article-title">${article.titre}</h1>
    
    ${article.hot ? '<div style="text-align: center; margin: 20px 0;"><span style="background: #e74c3c; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold;">🔥 ARTICLE HOT</span></div>' : ''}
    
    <p class="publication-date" style="text-align: center; color: #666; margin-bottom: 30px;">
      ${article.date_publication ? new Date(article.date_publication).toLocaleDateString('fr-FR') : 'Date non définie'}
    </p>

    ${article.video_url ? `
    <div class="gallery" style="background: #000; max-width: 700px; margin: 30px auto;">
        <iframe 
            style="width: 100%; aspect-ratio: 16/9; border: none; border-radius: 12px;"
            src="${article.video_url}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    </div>
    ` : article.image ? `<div class="gallery"><img src="/assets/images/${article.image}" alt="${article.titre}" class="img-centree"></div>` : ''}

    <div class="article-content">
      ${sections.length > 0 ? sectionsHTML : '<p style="text-align: center; color: #999; font-style: italic;">Aucune section disponible. Ajoutez du contenu dans l\'onglet "Gérer les Sections".</p>'}
    </div>

    <footer class="footer">
        <div style="text-align: center; padding: 20px; background: #333; color: white; margin-top: 40px;">
          <strong>🔍 Prévisualisation générée le ${new Date().toLocaleString('fr-FR')}</strong>
        </div>
    </footer>
</body>
</html>`;
    
    res.send(previewHTML);
  } catch (error) {
    console.error('❌ Erreur preview:', error);
    res.status(500).send(`<h1>Erreur lors de la prévisualisation</h1><p>${error.message}</p>`);
  }
});

module.exports = router;
