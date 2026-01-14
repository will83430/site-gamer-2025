const { body, param, validationResult } = require('express-validator');

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation échouée',
      details: errors.array()
    });
  }
  next();
};

// Validation pour la création d'un produit
const validateProductCreate = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom du produit est obligatoire')
    .isLength({ max: 255 }).withMessage('Le nom ne doit pas dépasser 255 caractères'),

  body('categorie')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('La catégorie ne doit pas dépasser 100 caractères'),

  body('description')
    .optional()
    .trim(),

  body('image')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Le nom de l\'image ne doit pas dépasser 255 caractères'),

  body('lien')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Le lien ne doit pas dépasser 500 caractères'),

  body('prix')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le prix ne doit pas dépasser 50 caractères'),

  body('top_du_mois')
    .optional()
    .isBoolean().withMessage('top_du_mois doit être un booléen'),

  body('titre_affiche')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Le titre affiché ne doit pas dépasser 255 caractères'),

  body('fonctionnalites_avancees')
    .optional()
    .isArray().withMessage('fonctionnalites_avancees doit être un tableau'),

  body('donnees_fiche')
    .optional()
    .isObject().withMessage('donnees_fiche doit être un objet JSON'),

  handleValidationErrors
];

// Validation pour la mise à jour d'un produit
const validateProductUpdate = [
  param('id')
    .trim()
    .notEmpty().withMessage('L\'ID du produit est obligatoire'),

  ...validateProductCreate.slice(0, -1), // Réutiliser les validations de création sauf handleValidationErrors
  handleValidationErrors
];

// Validation pour les paramètres ID
const validateId = [
  param('id')
    .trim()
    .notEmpty().withMessage('L\'ID est obligatoire'),
  handleValidationErrors
];

// Validation pour les actualités
const validateActualite = [
  body('titre')
    .trim()
    .notEmpty().withMessage('Le titre est obligatoire'),

  body('description')
    .optional()
    .trim(),

  body('image')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Le nom de l\'image ne doit pas dépasser 255 caractères'),

  body('video_url')
    .optional()
    .trim()
    .isURL().withMessage('L\'URL vidéo doit être valide')
    .isLength({ max: 500 }).withMessage('L\'URL vidéo ne doit pas dépasser 500 caractères'),

  body('date_publication')
    .optional()
    .isISO8601().withMessage('La date doit être au format ISO8601'),

  body('tags')
    .optional()
    .isArray().withMessage('Les tags doivent être un tableau'),

  body('hot')
    .optional()
    .isBoolean().withMessage('hot doit être un booléen'),

  body('ordre')
    .optional()
    .isInt({ min: 0 }).withMessage('L\'ordre doit être un entier positif'),

  body('categorie_id')
    .optional()
    .isInt({ min: 1 }).withMessage('L\'ID de catégorie doit être un entier positif'),

  handleValidationErrors
];

module.exports = {
  validateProductCreate,
  validateProductUpdate,
  validateId,
  validateActualite,
  handleValidationErrors
};
