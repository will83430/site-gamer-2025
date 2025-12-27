async function main() {
  const category = process.argv[2];
  if (!category) {
    console.error('Usage: node inspect-category.js "CATEGORIE"');
    process.exit(1);
  }

  const pool = require('../backend/config/database');

  const res = await pool.query(
    'select id, nom, prix, donnees_fiche from produits where categorie = $1 order by id',
    [category]
  );
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
