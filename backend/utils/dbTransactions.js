/**
 * Utilitaires pour les transactions de base de données
 */

const pool = require('../config/database');
const logger = require('../config/logger');

/**
 * Exécute une fonction dans une transaction
 * @param {Function} callback - Fonction qui reçoit le client DB
 * @returns {Promise} - Résultat de la transaction
 */
async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction rollback:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Réorganise l'ordre des éléments dans une table
 * @param {string} tableName - Nom de la table
 * @param {Array} items - Tableau d'objets {id, ordre}
 * @returns {Promise}
 */
async function reorderItems(tableName, items) {
  return withTransaction(async (client) => {
    const updates = items.map((item, index) => {
      return client.query(
        `UPDATE ${tableName} SET ordre = $1 WHERE id = $2`,
        [index + 1, item.id]
      );
    });

    await Promise.all(updates);

    logger.info(`Réorganisation de ${tableName}: ${items.length} éléments`);

    return { success: true, count: items.length };
  });
}

/**
 * Échange l'ordre de deux éléments
 * @param {string} tableName - Nom de la table
 * @param {number} id1 - ID du premier élément
 * @param {number} id2 - ID du second élément
 * @returns {Promise}
 */
async function swapOrder(tableName, id1, id2) {
  return withTransaction(async (client) => {
    // Récupérer les ordres actuels
    const result1 = await client.query(
      `SELECT ordre FROM ${tableName} WHERE id = $1`,
      [id1]
    );
    const result2 = await client.query(
      `SELECT ordre FROM ${tableName} WHERE id = $1`,
      [id2]
    );

    if (result1.rows.length === 0 || result2.rows.length === 0) {
      throw new Error('Un ou plusieurs éléments introuvables');
    }

    const ordre1 = result1.rows[0].ordre;
    const ordre2 = result2.rows[0].ordre;

    // Échanger les ordres
    await client.query(
      `UPDATE ${tableName} SET ordre = $1 WHERE id = $2`,
      [ordre2, id1]
    );
    await client.query(
      `UPDATE ${tableName} SET ordre = $1 WHERE id = $2`,
      [ordre1, id2]
    );

    logger.info(`Échange d'ordre dans ${tableName}: ${id1} <-> ${id2}`);

    return { success: true };
  });
}

/**
 * Déplace un élément d'une catégorie à une autre avec transaction
 * @param {string} tableName - Nom de la table
 * @param {number} itemId - ID de l'élément à déplacer
 * @param {string} newCategorie - Nouvelle catégorie
 * @returns {Promise}
 */
async function moveToCategory(tableName, itemId, newCategorie) {
  return withTransaction(async (client) => {
    // Vérifier que l'élément existe
    const checkResult = await client.query(
      `SELECT * FROM ${tableName} WHERE id = $1`,
      [itemId]
    );

    if (checkResult.rows.length === 0) {
      throw new Error('Élément introuvable');
    }

    // Déplacer vers la nouvelle catégorie
    await client.query(
      `UPDATE ${tableName} SET categorie = $1 WHERE id = $2`,
      [newCategorie, itemId]
    );

    logger.info(`Déplacement dans ${tableName}: élément ${itemId} vers ${newCategorie}`);

    return { success: true, item: checkResult.rows[0] };
  });
}

/**
 * Supprime plusieurs éléments en batch avec transaction
 * @param {string} tableName - Nom de la table
 * @param {Array} ids - Tableau d'IDs à supprimer
 * @returns {Promise}
 */
async function batchDelete(tableName, ids) {
  return withTransaction(async (client) => {
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
    const query = `DELETE FROM ${tableName} WHERE id IN (${placeholders}) RETURNING id`;

    const result = await client.query(query, ids);

    logger.info(`Suppression en batch dans ${tableName}: ${result.rows.length} éléments`);

    return { success: true, deleted: result.rows };
  });
}

module.exports = {
  withTransaction,
  reorderItems,
  swapOrder,
  moveToCategory,
  batchDelete
};
