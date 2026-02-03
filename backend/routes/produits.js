const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { validateProductCreate, validateProductUpdate, validateId } = require('../middleware/validators');

// Configuration multer pour l'upload CSV
const uploadCSV = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers CSV sont acceptés'), false);
    }
  }
});
const { slugToTitreAffiche, cleanImagePath } = require('../utils/helpers');

// Import du système de logs d'activité (chargé de manière différée pour éviter les dépendances circulaires)
let logActivity = null;
const getLogActivity = () => {
  if (!logActivity) {
    try {
      logActivity = require('./activity-logs').logActivity;
    } catch (e) {
      logActivity = () => {}; // Fonction vide si le module n'est pas disponible
    }
  }
  return logActivity;
};

// GET - Récupérer tous les produits ou filtrer par catégorie
router.get('/', async (req, res) => {
  try {
    const { categorie } = req.query;
    let query = `
      SELECT 
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p
    `;
    const params = [];
    
    if (categorie) {
      // Convertir tirets en espaces pour correspondre au format DB
      const categorieNormalized = categorie.replace(/-/g, ' ');
      query += ` WHERE LOWER(categorie) = LOWER($1)`;
      params.push(categorieNormalized);
    }
    
    query += ` ORDER BY categorie, nom`;
    
    const result = await pool.query(query, params);
    console.log(`✅ Produits récupérés: ${result.rows.length}`);

    // Traiter les images pour ajouter image_url
    const productsWithImages = result.rows.map(product => {
      if (product.image) {
        product.image_url = `/assets/images/${product.image}`;
      } else {
        product.image_url = '/assets/images/placeholder.png';
      }
      return product;
    });
    
    res.json({
      success: true,
      data: productsWithImages,
      total: result.rows.length
    });

  } catch (error) {
    console.error('❌ Erreur GET produits:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer un produit par nom (slug)
router.get('/by-name/:nom', async (req, res) => {
  try {
    const { nom } = req.params;
    const result = await pool.query(`
      SELECT
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p
      WHERE LOWER(p.nom) = LOWER($1)
    `, [nom]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    const product = result.rows[0];

    // Correction du chemin de l'image
    if (product.image) {
      const cleanImage = cleanImagePath(product.image);
      product.image_url = `/assets/images/${cleanImage}`;
    } else {
      product.image_url = '/assets/images/placeholder.png';
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Erreur GET produit par nom:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer les produits vedettes (top_du_mois) - pour badges
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const result = await pool.query(`
      SELECT
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p
      WHERE top_du_mois = TRUE
      ORDER BY categorie, nom
      LIMIT $1
    `, [parseInt(limit)]);

    const productsWithImages = result.rows.map(product => {
      if (product.image) {
        product.image_url = `/assets/images/${product.image}`;
      } else {
        product.image_url = '/assets/images/placeholder.png';
      }
      return product;
    });

    res.json({
      success: true,
      data: productsWithImages,
      total: result.rows.length
    });
  } catch (error) {
    console.error('❌ Erreur GET produits vedettes:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer les produits pour la section Accueil (affiche_accueil)
router.get('/homepage/list', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p
      WHERE affiche_accueil = TRUE
      ORDER BY categorie, nom
      LIMIT 4
    `);

    const productsWithImages = result.rows.map(product => {
      if (product.image) {
        product.image_url = `/assets/images/${product.image}`;
      } else {
        product.image_url = '/assets/images/placeholder.png';
      }
      return product;
    });

    res.json({
      success: true,
      data: productsWithImages,
      total: result.rows.length
    });
  } catch (error) {
    console.error('❌ Erreur GET produits homepage:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH - Toggle affiche_accueil pour un produit (max 4)
router.patch('/:id/homepage', async (req, res) => {
  try {
    const { id } = req.params;
    const { display } = req.body;

    // Vérifier la limite de 4 produits si on veut ajouter
    if (display === true) {
      const countResult = await pool.query('SELECT COUNT(*) FROM produits WHERE affiche_accueil = TRUE');
      const currentCount = parseInt(countResult.rows[0].count);
      if (currentCount >= 4) {
        return res.status(400).json({
          success: false,
          error: 'Maximum 4 produits peuvent être affichés sur l\'accueil'
        });
      }
    }

    const result = await pool.query(`
      UPDATE produits
      SET affiche_accueil = $1
      WHERE id = $2
      RETURNING *
    `, [display === true, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    // Log de l'activité
    const actionType = display ? 'homepage_add' : 'homepage_remove';
    getLogActivity()(actionType, 'produit', id, result.rows[0].nom, null, req.ip);

    res.json({
      success: true,
      data: result.rows[0],
      message: display ? 'Produit ajouté à l\'accueil' : 'Produit retiré de l\'accueil'
    });
  } catch (error) {
    console.error('❌ Erreur toggle homepage:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PATCH - Toggle top_du_mois pour un produit
router.patch('/:id/featured', async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    const result = await pool.query(`
      UPDATE produits
      SET top_du_mois = $1
      WHERE id = $2
      RETURNING *
    `, [featured === true, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    // Log de l'activité
    const actionType = featured ? 'feature' : 'unfeature';
    getLogActivity()(actionType, 'produit', id, result.rows[0].nom, null, req.ip);

    res.json({
      success: true,
      data: result.rows[0],
      message: featured ? 'Produit ajouté aux vedettes' : 'Produit retiré des vedettes'
    });
  } catch (error) {
    console.error('❌ Erreur toggle featured:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET - Récupérer un produit par ID
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*,
        COALESCE(p.titre_affiche, p.nom) as titre_affiche
      FROM produits p 
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    const product = result.rows[0];

    // Correction du chemin de l'image
    if (product.image) {
      const cleanImage = cleanImagePath(product.image);
      product.image_url = `/assets/images/${cleanImage}`;
    } else {
      product.image_url = '/assets/images/placeholder.png';
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('❌ Erreur GET produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Créer un nouveau produit avec ID auto-généré
router.post('/', validateProductCreate, async (req, res) => {
  try {
    const {
      nom, categorie, description, image, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche,
      titre_affiche
    } = req.body;
    
    if (!nom) {
      return res.status(400).json({
        success: false,
        error: 'Le nom du produit est obligatoire'
      });
    }

    // Générer un nouvel ID automatiquement
    const maxIdResult = await pool.query(`
      SELECT COALESCE(
        MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 
        45
      ) + 1 as next_id 
      FROM produits 
      WHERE id LIKE 'prod_%'
    `);

    const nextId = `prod_${maxIdResult.rows[0].next_id}`;

    const titreAfficheFinal = titre_affiche && titre_affiche.trim() !== ''
        ? titre_affiche 
        : slugToTitreAffiche(nom);

    const params = [
      nextId,
      nom, categorie || null, description || null,
      image || null,
      lien || null,
      top_du_mois || false, prix || null,
      fonctionnalites_avancees || [], donnees_fiche || [],
      titreAfficheFinal
    ];

    const query = `
      INSERT INTO produits 
      (id, nom, categorie, description, image, lien, top_du_mois, prix, fonctionnalites_avancees, donnees_fiche, titre_affiche)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await pool.query(query, params);
    console.log(result.rows[0]);

    // Log de l'activité
    getLogActivity()('create', 'produit', nextId, nom, { categorie, prix }, req.ip);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: `Produit créé avec l'ID ${nextId}`
    });

  } catch (error) {
    console.error('❌ Erreur POST produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT - Mettre à jour un produit
router.put('/:id', validateProductUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nom, categorie, description, image, lien,
      top_du_mois, prix, fonctionnalites_avancees, donnees_fiche,
      titre_affiche
    } = req.body;

    const query = `
      UPDATE produits 
      SET nom = $1, 
          categorie = $2, 
          description = $3, 
          image = $4,
          lien = $5, 
          top_du_mois = $6, 
          prix = $7, 
          fonctionnalites_avancees = $8, 
          donnees_fiche = $9,
          titre_affiche = $10
      WHERE id = $11
      RETURNING *
    `;

    const params = [
      nom, 
      categorie || null, 
      description || null,
      image || null,
      lien || null,
      top_du_mois || false, 
      prix || null,
      fonctionnalites_avancees || [], 
      donnees_fiche || [],
      titre_affiche || null,
      id
    ];

    const result = await pool.query(query, params);

    // Log de l'activité
    getLogActivity()('update', 'produit', id, nom, { categorie, prix }, req.ip);

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Produit mis à jour avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur PUT produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE - Supprimer un produit
router.delete('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM produits WHERE id = $1 RETURNING nom',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produit non trouvé'
      });
    }

    // Log de l'activité
    getLogActivity()('delete', 'produit', id, result.rows[0].nom, null, req.ip);

    res.json({
      success: true,
      message: `Produit "${result.rows[0].nom}" supprimé avec succès`
    });

  } catch (error) {
    console.error('❌ Erreur DELETE produit:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ==================== IMPORT/EXPORT CSV ====================

// Fonction utilitaire pour échapper les valeurs CSV
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Fonction utilitaire pour parser une ligne CSV
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}

// GET - Export tous les produits en CSV
router.get('/export/csv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id, nom, titre_affiche, categorie, description,
        image, lien, prix, top_du_mois,
        fonctionnalites_avancees, donnees_fiche
      FROM produits
      ORDER BY categorie, nom
    `);

    // En-têtes CSV
    const headers = [
      'id', 'nom', 'titre_affiche', 'categorie', 'description',
      'image', 'lien', 'prix', 'top_du_mois',
      'fonctionnalites_avancees', 'donnees_fiche'
    ];

    // Construire le CSV
    let csv = headers.join(',') + '\n';

    for (const row of result.rows) {
      const values = headers.map(header => {
        let value = row[header];
        // Convertir les arrays/objets en JSON
        if (Array.isArray(value) || typeof value === 'object') {
          value = JSON.stringify(value);
        }
        return escapeCSV(value);
      });
      csv += values.join(',') + '\n';
    }

    // Envoyer le fichier CSV
    const filename = `produits_export_${new Date().toISOString().split('T')[0]}.csv`;
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // Ajouter BOM UTF-8 pour Excel
    res.send('\ufeff' + csv);

    // Log de l'activité
    getLogActivity()('export', 'produits', null, `${result.rows.length} produits`, { format: 'csv' }, req.ip);

    console.log(`✅ Export CSV: ${result.rows.length} produits exportés`);

  } catch (error) {
    console.error('❌ Erreur export CSV:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST - Import produits depuis CSV
router.post('/import/csv', uploadCSV.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucun fichier CSV fourni'
      });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim());

    if (lines.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le fichier CSV est vide ou mal formaté'
      });
    }

    // Parser les en-têtes
    const headers = parseCSVLine(lines[0]);
    const requiredHeaders = ['nom', 'categorie'];

    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        return res.status(400).json({
          success: false,
          error: `Colonne obligatoire manquante: ${required}`
        });
      }
    }

    const results = {
      created: 0,
      updated: 0,
      errors: []
    };

    // Traiter chaque ligne
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const row = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || null;
        });

        // Convertir les champs JSON
        if (row.fonctionnalites_avancees) {
          try {
            row.fonctionnalites_avancees = JSON.parse(row.fonctionnalites_avancees);
          } catch {
            row.fonctionnalites_avancees = [];
          }
        }
        if (row.donnees_fiche) {
          try {
            row.donnees_fiche = JSON.parse(row.donnees_fiche);
          } catch {
            row.donnees_fiche = [];
          }
        }

        // Convertir top_du_mois en boolean
        row.top_du_mois = row.top_du_mois === 'true' || row.top_du_mois === '1' || row.top_du_mois === 'TRUE';

        // Vérifier si le produit existe déjà (par ID ou nom)
        let existingProduct = null;
        if (row.id) {
          const existing = await pool.query('SELECT id FROM produits WHERE id = $1', [row.id]);
          if (existing.rows.length > 0) {
            existingProduct = existing.rows[0];
          }
        }

        if (existingProduct) {
          // Mise à jour
          await pool.query(`
            UPDATE produits SET
              nom = $1, titre_affiche = $2, categorie = $3, description = $4,
              image = $5, lien = $6, prix = $7, top_du_mois = $8,
              fonctionnalites_avancees = $9, donnees_fiche = $10
            WHERE id = $11
          `, [
            row.nom, row.titre_affiche || row.nom, row.categorie, row.description,
            row.image, row.lien, row.prix, row.top_du_mois,
            row.fonctionnalites_avancees || [], row.donnees_fiche || [],
            row.id
          ]);
          results.updated++;
        } else {
          // Création - générer un nouvel ID
          const maxIdResult = await pool.query(`
            SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 6) AS INTEGER)), 45) + 1 as next_id
            FROM produits WHERE id LIKE 'prod_%'
          `);
          const newId = row.id || `prod_${maxIdResult.rows[0].next_id}`;

          await pool.query(`
            INSERT INTO produits (id, nom, titre_affiche, categorie, description, image, lien, prix, top_du_mois, fonctionnalites_avancees, donnees_fiche)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          `, [
            newId, row.nom, row.titre_affiche || row.nom, row.categorie, row.description,
            row.image, row.lien, row.prix, row.top_du_mois,
            row.fonctionnalites_avancees || [], row.donnees_fiche || []
          ]);
          results.created++;
        }

      } catch (lineError) {
        results.errors.push(`Ligne ${i + 1}: ${lineError.message}`);
      }
    }

    console.log(`✅ Import CSV terminé: ${results.created} créés, ${results.updated} mis à jour, ${results.errors.length} erreurs`);

    // Log de l'activité
    getLogActivity()('import', 'produits', null, `${results.created} créés, ${results.updated} mis à jour`, {
      format: 'csv',
      created: results.created,
      updated: results.updated,
      errors: results.errors.length
    }, req.ip);

    res.json({
      success: true,
      message: `Import terminé: ${results.created} produits créés, ${results.updated} mis à jour`,
      results
    });

  } catch (error) {
    console.error('❌ Erreur import CSV:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
