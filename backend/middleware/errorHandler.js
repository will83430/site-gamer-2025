/**
 * Middleware de gestion centralisée des erreurs
 * Capture toutes les erreurs non gérées et renvoie une réponse formatée
 */

const logger = require('../config/logger');

// Classe d'erreur personnalisée pour les erreurs API
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Middleware de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Erreur par défaut si non définie
  if (!statusCode) {
    statusCode = 500;
  }

  if (!message) {
    message = 'Erreur interne du serveur';
  }

  // Filtrer les logs pour les routes connues (DevTools, favicon, etc.)
  const ignoredPaths = [
    '/.well-known/',
    '/favicon.ico',
    '/.vscode/',
    '/__webpack'
  ];

  const shouldLog = !ignoredPaths.some(path => req.path.startsWith(path));

  // Log de l'erreur avec Winston
  if (shouldLog) {
    if (statusCode >= 500) {
      // Erreurs serveur (5xx) - niveau error
      logger.logError(err, req);
    } else if (statusCode >= 400) {
      // Erreurs client (4xx) - niveau warn
      logger.warn({
        statusCode,
        message,
        path: req.path,
        method: req.method,
      });
    }
  }

  // Réponse formatée
  const response = {
    success: false,
    error: message,
    statusCode
  };

  // En développement, inclure la stack trace
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Middleware pour gérer les routes non trouvées (404)
const notFoundHandler = (req, res, next) => {
  // Pour les requêtes API, renvoyer du JSON
  if (req.path.startsWith('/api/')) {
    const error = new ApiError(404, `Route non trouvée: ${req.originalUrl}`);
    return next(error);
  }

  // Pour les autres requêtes, servir la page 404 HTML
  const path = require('path');
  const page404 = path.join(__dirname, '../../frontend/public/2026/404.html');
  res.status(404).sendFile(page404, (err) => {
    if (err) {
      // Fallback si le fichier n'existe pas
      res.status(404).send('<h1>404 - Page non trouvée</h1>');
    }
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  ApiError
};
