/**
 * Fonctions utilitaires partagées
 */

/**
 * Convertit un slug en titre affiché formaté
 * Exemple: "mon-produit-test" => "Mon Produit Test"
 * @param {string} slug - Le slug à convertir
 * @returns {string} Le titre formaté
 */
function slugToTitreAffiche(slug) {
  if (!slug) return '';

  return slug
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Nettoie un chemin d'image pour retirer les préfixes inutiles
 * Exemple: "assets/images/test.png" => "test.png"
 * @param {string} imagePath - Le chemin de l'image
 * @returns {string} Le chemin nettoyé
 */
function cleanImagePath(imagePath) {
  if (!imagePath) return '';

  return imagePath.replace(/^assets\/images\//, '');
}

/**
 * Génère un slug unique basé sur le nom du produit
 * Exemple: "Mon Produit 123!" => "mon-produit-123"
 * @param {string} nom - Le nom du produit
 * @returns {string} Le slug généré
 */
function generateSlug(nom) {
  if (!nom) return '';

  return nom
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Remplace les caractères non alphanumériques par des tirets
    .replace(/^-+|-+$/g, '');      // Supprime les tirets au début et à la fin
}

/**
 * Formate une date au format français
 * @param {Date|string} date - La date à formater
 * @returns {string} La date formatée (JJ/MM/AAAA)
 */
function formatDateFr(date) {
  if (!date) return '';

  const d = new Date(date);
  const jour = String(d.getDate()).padStart(2, '0');
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const annee = d.getFullYear();

  return `${jour}/${mois}/${annee}`;
}

/**
 * Vérifie si une chaîne est une URL valide
 * @param {string} str - La chaîne à vérifier
 * @returns {boolean} True si c'est une URL valide
 */
function isValidUrl(str) {
  if (!str) return false;

  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = {
  slugToTitreAffiche,
  cleanImagePath,
  generateSlug,
  formatDateFr,
  isValidUrl
};
