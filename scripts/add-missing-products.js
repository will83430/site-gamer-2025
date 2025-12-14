const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'gamer_2025',
    password: 'admin',
    port: 5432,
});

const nouveauxProduits = [
    {
        nom: 'apple-vision-pro',
        categorie: 'CASQUE VR',
        image: 'apple-vision-pro.png',
        lien: 'fiches/casque-vr/apple-vision-pro.html',
        description: 'Casque de réalité mixte haut de gamme signé Apple avec qualité d\'image exceptionnelle.',
        top_du_mois: true,
        prix: 'À partir de 3 699 €',
        titre_affiche: 'Apple Vision Pro'
    },
    {
        nom: 'lenovo-yoga-tab-15',
        categorie: 'TABLETTE',
        image: 'lenovo-yoga-tab-15.png',
        lien: 'fiches/tablette/lenovo-yoga-tab-15.html',
        description: 'Tablette Android haut de gamme pensée pour les créateurs et le multimédia.',
        top_du_mois: true,
        prix: 'Environ 400 €',
        titre_affiche: 'Lenovo Yoga Tab 15'
    },
    {
        nom: 'oculus-quest-2',
        categorie: 'CASQUE VR',
        image: 'oculus-quest-2.png',
        lien: 'fiches/casque-vr/oculus-quest-2.html',
        description: 'Casque de réalité virtuelle autonome, sans fil, conçu pour une immersion totale.',
        top_du_mois: true,
        prix: '550 €',
        titre_affiche: 'Oculus Quest 2'
    },
    {
        nom: 'sennheiser-momentum-5',
        categorie: 'CASQUE AUDIO',
        image: 'sennheiser-momentum-5.png',
        lien: 'fiches/casque-audio/sennheiser-momentum-5.html',
        description: 'Casque audio haut de gamme avec ANC adaptatif et 60h d\'autonomie.',
        top_du_mois: true,
        prix: '399.99€',
        titre_affiche: 'Sennheiser Momentum 5'
    },
    {
        nom: 'meta-quest-3s',
        categorie: 'CASQUE VR',
        image: 'meta-quest-3s.png',
        lien: 'fiches/casque-vr/meta-quest-3s.html',
        description: 'Version accessible du Quest 3 avec même processeur et réalité mixte couleur.',
        top_du_mois: true,
        prix: '399.99€',
        titre_affiche: 'Meta Quest 3S'
    },
    {
        nom: 'razer-blackwidow-v4-pro-75',
        categorie: 'PERIPHERIQUES',
        image: 'razer-blackwidow-v4-pro-75.png',
        lien: 'fiches/peripheriques/razer-blackwidow-v4-pro-75.html',
        description: 'Clavier mécanique gaming compact 75% avec switches Gen-3 et écran OLED.',
        top_du_mois: true,
        prix: '249.99€',
        titre_affiche: 'Razer BlackWidow V4 Pro 75%'
    },
    {
        nom: 'lenovo-legion-go-s',
        categorie: 'CONSOLE',
        image: 'lenovo-legion-go-s.png',
        lien: 'fiches/console/lenovo-legion-go-s.html',
        description: 'Console portable gaming avec écran 8.8" 144Hz et manettes détachables.',
        top_du_mois: true,
        prix: '699.99€',
        titre_affiche: 'Lenovo Legion Go S'
    },
    {
        nom: 'dji-neo-2',
        categorie: 'DRONE',
        image: 'dji-neo-2.png',
        lien: 'fiches/drone/dji-neo-2.html',
        description: 'Drone ultra-compact avec caméra 4K 60fps et suivi automatique avancé.',
        top_du_mois: true,
        prix: '299.99€',
        titre_affiche: 'DJI Neo 2'
    },
    {
        nom: 'xiaomi-15-ultra',
        categorie: 'SMARTPHONE',
        image: 'xiaomi-15-ultra.png',
        lien: 'fiches/smartphone/xiaomi-15-ultra.html',
        description: 'Le Xiaomi 15 Ultra redéfinit la photographie mobile avec son système Leica à 4 capteurs.',
        top_du_mois: true,
        prix: '1399.99€',
        titre_affiche: 'Xiaomi 15 Ultra'
    },
    {
        nom: 'huawei-watch-gt-5-pro',
        categorie: 'MONTRE CONNECTEE',
        image: 'huawei-watch-gt-5-pro.png',
        lien: 'fiches/montre-connectee/huawei-watch-gt-5-pro.html',
        description: 'Montre connectée premium en titane avec GPS double fréquence et autonomie 14 jours.',
        top_du_mois: true,
        prix: '449.99€',
        titre_affiche: 'Huawei Watch GT 5 Pro'
    },
    {
        nom: 'msi-titan-18-hx',
        categorie: 'PC GAMING',
        image: 'msi-titan-18-hx.png',
        lien: 'fiches/pc-gaming/msi-titan-18-hx.html',
        description: 'PC portable gaming extrême avec écran Mini LED 4K 120Hz et RTX 5090.',
        top_du_mois: true,
        prix: '4999.99€',
        titre_affiche: 'MSI Titan 18 HX'
    },
    {
        nom: 'oneplus-pad-2',
        categorie: 'TABLETTE',
        image: 'oneplus-pad-2.png',
        lien: 'fiches/tablette/oneplus-pad-2.html',
        description: 'Tablette premium avec écran 12.1" 144Hz et batterie 9510 mAh.',
        top_du_mois: true,
        prix: '599.99€',
        titre_affiche: 'OnePlus Pad 2'
    },
    {
        nom: 'sony-a7-v',
        categorie: 'CAMERA',
        image: 'sony-a7-v.png',
        lien: 'fiches/camera/sony-a7-v.html',
        description: 'Hybride plein format 61MP avec AF AI temps réel et vidéo 8K 30p.',
        top_du_mois: true,
        prix: '4299.99€',
        titre_affiche: 'Sony A7 V'
    },
    {
        nom: 'samsung-qn900d-neo-qled-8k',
        categorie: 'ECRAN TV',
        image: 'samsung-qn900d-8k.png',
        lien: 'fiches/ecran-tv/samsung-qn900d-neo-qled-8k.html',
        description: 'TV 8K 75" avec technologie Neo QLED et processeur NQ8 AI Gen3.',
        top_du_mois: true,
        prix: '5999.99€',
        titre_affiche: 'Samsung QN900D Neo QLED 8K'
    },
    {
        nom: 'bambu-lab-x1-carbon-combo',
        categorie: 'IMPRIMANTE 3D',
        image: 'bambu-lab-x1-carbon.png',
        lien: 'fiches/imprimante-3d/bambu-lab-x1-carbon-combo.html',
        description: 'Imprimante 3D ultra-rapide avec système AMS 4 couleurs et détection IA.',
        top_du_mois: true,
        prix: '1449.99€',
        titre_affiche: 'Bambu Lab X1-Carbon Combo'
    }
];

async function ajouterNouveauxProduits() {
    try {
        await client.connect();
        console.log('🔌 Connexion établie');
        
        console.log(`📦 Ajout de ${nouveauxProduits.length} nouveaux produits...`);
        
        for (const produit of nouveauxProduits) {
            // Vérifier si le produit existe déjà
            const existingCheck = await client.query('SELECT nom FROM produits WHERE nom = $1', [produit.nom]);
            
            if (existingCheck.rows.length === 0) {
                const insertQuery = `
                    INSERT INTO produits (nom, categorie, image, lien, description, top_du_mois, prix, titre_affiche, id, fonctionnalites_avancees, donnees_fiche)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `;
                
                await client.query(insertQuery, [
                    produit.nom,
                    produit.categorie,
                    produit.image,
                    produit.lien,
                    produit.description,
                    produit.top_du_mois,
                    produit.prix,
                    produit.titre_affiche,
                    `prod_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                    ['Produit haut de gamme', 'Design premium'],
                    ['Spécifications complètes', 'Garantie constructeur']
                ]);
                
                console.log(`✅ ${produit.nom} ajouté`);
            } else {
                console.log(`⚠️ ${produit.nom} existe déjà`);
            }
        }
        
        // Vérification finale
        const finalCount = await client.query('SELECT COUNT(*) as total FROM produits');
        console.log(`\n📊 Total final: ${finalCount.rows[0].total} produits`);
        
        const byCategory = await client.query(`
            SELECT categorie, COUNT(*) as count 
            FROM produits 
            GROUP BY categorie 
            ORDER BY count DESC
        `);
        
        console.log('\n📂 Répartition finale:');
        byCategory.rows.forEach(row => {
            console.log(`  ${row.categorie.padEnd(20)} : ${row.count}`);
        });
        
        console.log('\n✅ Terminé!');
        
    } catch (error) {
        console.error('❌ Erreur:', error);
    } finally {
        await client.end();
    }
}

ajouterNouveauxProduits();