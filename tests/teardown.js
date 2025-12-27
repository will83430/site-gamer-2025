// tests/teardown.js
// Global teardown pour fermer les connexions
const pool = require('../backend/config/database');

module.exports = async () => {
  await pool.end();
};
