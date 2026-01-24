async function main() {
  const pool = require('../backend/config/database');

  // Produits avec prix à nettoyer
  const updates = [
    {
      id: 'prod_46',
      prixActuel: '49,99€/mois – Tarif incluant l\'abonnement fibre, les services TV et les options premium',
      prixNettoye: '49,99€/mois'
    }
  ];

  for (const { id, prixActuel, prixNettoye } of updates) {
    await pool.query('UPDATE produits SET prix = $1 WHERE id = $2', [prixNettoye, id]);
    console.log(`✅ ${id}: "${prixActuel}" → "${prixNettoye}"`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
