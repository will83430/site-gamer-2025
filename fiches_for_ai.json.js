const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Wilfried!1985', // adapte selon ta config
  port: 5432,
});

(async () => {
  const res = await pool.query(`
    SELECT
      p.id,
      p.nom,
      p.titre_affiche,
      s.titre,
      s.contenu
    FROM produits p
    LEFT JOIN sections s ON s.produit_id = p.id
    ORDER BY p.id, s.titre;
  `);

  // Regroupe par produit
  const produits = {};
  res.rows.forEach(row => {
    if (!produits[row.id]) {
      produits[row.id] = {
        id: row.id,
        nom: row.nom,
        titre_affiche: row.titre_affiche,
        sections: []
      };
    }
    produits[row.id].sections.push({
      titre: row.titre,
      contenu: row.contenu || ""
    });
  });

  fs.writeFileSync('fiches_for_ai.json', JSON.stringify(Object.values(produits), null, 2), 'utf8');
  console.log('Export terminé : fiches_for_ai.json');
  pool.end();
})();