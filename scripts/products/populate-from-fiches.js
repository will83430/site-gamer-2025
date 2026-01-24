const fs = require('fs');
const path = require('path');

async function main() {
  const pool = require('../backend/config/database');

  const fichesDir = './fiches';
  const products = [];

  // Parcourt tous les fichiers HTML
  function scanDir(dir, categorie = '') {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        // C'est une sous-catégorie
        const catName = file;
        scanDir(filePath, catName);
      } else if (file.endsWith('.html')) {
        // C'est une fiche
        const html = fs.readFileSync(filePath, 'utf-8');
        
        // Extrait le titre
        const titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
        const titre = titleMatch ? titleMatch[1].trim() : file.replace('.html', '');
        
        // Extrait les sections de contenu
        const donnees_fiche = [];
        const sections = html.match(/<div class="fiche-section">[\s\S]*?<\/div>/g) || [];
        
        for (const section of sections) {
          // Extrait h3 (titre de section)
          const h3Match = section.match(/<h3>([^<]+)<\/h3>/);
          // Extrait p (contenu)
          const pMatch = section.match(/<p>([^<]+)<\/p>/);
          
          if (h3Match && pMatch) {
            const sectionTitre = h3Match[1].trim();
            const sectionContenu = pMatch[1].trim();
            donnees_fiche.push(`${sectionTitre}\n${sectionContenu}`);
          } else if (pMatch) {
            donnees_fiche.push(pMatch[1].trim());
          }
        }
        
        // Génère l'ID
        const fileName = file.replace('.html', '');
        const prodNum = products.length + 1;
        const prodId = `prod_${prodNum}`;
        
        products.push({
          id: prodId,
          nom: titre,
          categorie: categorie.toUpperCase(),
          description: donnees_fiche[0] || '',
          prix: '',
          image: '',
          lien: `fiches/${categorie}/${fileName}.html`,
          top_du_mois: false,
          titre_affiche: titre,
          fonctionnalites_avancees: [],
          donnees_fiche: donnees_fiche
        });
        
        console.log(`✅ ${prodId}: ${titre} (${categorie})`);
      }
    }
  }

  scanDir(fichesDir);

  // Insère dans la DB
  console.log(`\n📝 Insertion de ${products.length} produits...`);
  
  for (const prod of products) {
    await pool.query(
      `INSERT INTO produits (id, nom, categorie, description, prix, image, lien, top_du_mois, titre_affiche, fonctionnalites_avancees, donnees_fiche)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO UPDATE SET nom = EXCLUDED.nom, donnees_fiche = EXCLUDED.donnees_fiche`,
      [prod.id, prod.nom, prod.categorie, prod.description, prod.prix, prod.image, prod.lien, prod.top_du_mois, prod.titre_affiche, prod.fonctionnalites_avancees, prod.donnees_fiche]
    );
  }

  const count = await pool.query('SELECT COUNT(*) as count FROM produits');
  console.log(`\n✅ Total: ${count.rows[0].count} produits dans la base`);

  await pool.end();
}

main().catch((err) => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});
