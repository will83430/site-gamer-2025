const winston = require('winston');
const path = require('path');

// Définir les niveaux de log personnalisés
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Définir les couleurs pour chaque niveau
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Appliquer les couleurs à Winston
winston.addColors(colors);

// Choisir le niveau de log selon l'environnement
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Format pour les logs en console (développement)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    // Si le message est un objet, le formater en JSON
    let msg = typeof message === 'object' ? JSON.stringify(message, null, 2) : message;

    // Ajouter les métadonnées si présentes
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';

    return `${timestamp} [${level}]: ${msg}${metaStr}`;
  })
);

// Format pour les logs en fichier (production)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transports: où les logs sont envoyés
const transports = [
  // Console (toujours actif)
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // Fichier pour les erreurs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // Fichier pour tous les logs
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Créer le logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // Ne pas quitter sur une erreur non capturée
  exitOnError: false,
});

// Stream pour Morgan (logs HTTP)
logger.stream = {
  write: (message) => {
    // Retirer le \n final de Morgan
    logger.http(message.trim());
  },
};

// Méthodes helper pour des logs structurés
logger.logRequest = (req, statusCode, responseTime) => {
  logger.http({
    method: req.method,
    url: req.originalUrl,
    statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  });
};

logger.logError = (error, req = null) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    ...(req && {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
    }),
  };

  logger.error(errorLog);
};

logger.logDatabase = (query, duration, error = null) => {
  if (error) {
    logger.error({
      type: 'database',
      query,
      duration: `${duration}ms`,
      error: error.message,
    });
  } else {
    logger.debug({
      type: 'database',
      query,
      duration: `${duration}ms`,
    });
  }
};

module.exports = logger;
