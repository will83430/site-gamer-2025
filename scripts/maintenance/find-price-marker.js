async function main() {
  const pool = require('../backend/config/database');
  const sql = "select id, categorie, nom, donnees_fiche from produits where exists (select 1 from unnest(donnees_fiche) d where d like '%💰 Prix%') order by categorie, id";
  const res = await pool.query(sql);
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
