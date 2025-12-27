async function main() {
  const pool = require('../backend/config/database');

  const res = await pool.query(
    "select id, categorie, nom from produits where donnees_fiche::text ilike '%À REMPLIR%' order by categorie, nom"
  );
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
