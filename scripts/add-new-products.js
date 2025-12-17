// Script pour ajouter les 12 nouveaux produits proprement
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'gamer_2025',
  password: 'Wilfried!1985',
  port: 5432,
});

const products = [
  {
    id: 'prod_50',
    nom: 'xiaomi-15-ultra',
    categorie: 'smartphone',
    prix: '1399.99€',
    description: 'Le Xiaomi 15 Ultra redéfinit la photographie mobile avec son système Leica à 4 capteurs, son processeur Snapdragon 8 Gen 4 et sa charge ultra-rapide 120W.',
    titre_affiche: 'Xiaomi 15 Ultra',
    lien: 'fiches/smartphone/xiaomi-15-ultra.html',
    image: 'xiaomi-15-ultra.png',
    donnees_fiche: ['Écran AMOLED 6.7" 2K 120Hz', 'Snapdragon 8 Gen 4', '16 Go RAM / 512 Go', 'Quad camera Leica 50MP'],
    fonctionnalites_avancees: ['Charge rapide 120W', 'Charge sans fil 80W', 'IP68', 'Xiaomi HyperOS 2.0'],
    top_du_mois: true
  },
  {
    id: 'prod_51',
    nom: 'lenovo-legion-go-s',
    categorie: 'console',
    prix: '699.99€',
    description: 'Console portable gaming ultime avec écran 8.8" 144Hz, processeur AMD Ryzen Z2 Extreme et contrôleurs détachables pour une expérience versatile.',
    titre_affiche: 'Lenovo Legion Go S',
    lien: 'fiches/console/lenovo-legion-go-s.html',
    image: 'lenovo-legion-go-s.png',
    donnees_fiche: ['Écran 8.8" QHD+ 144Hz', 'AMD Ryzen Z2 Extreme', '16 Go LPDDR5X', 'SSD 1 To NVMe'],
    fonctionnalites_avancees: ['Contrôleurs détachables', 'Wi-Fi 6E', 'Legion Space UI', 'Compatible Steam/Xbox Game Pass'],
    top_du_mois: true
  },
  {
    id: 'prod_52',
    nom: 'dji-neo-2',
    categorie: 'drone',
    prix: '299.99€',
    description: 'Drone ultra-compact avec décollage depuis la paume, stabilisation 3 axes et suivi intelligent AI pour des vidéos parfaites en toute simplicité.',
    titre_affiche: 'DJI Neo 2',
    lien: 'fiches/drone/dji-neo-2.html',
    image: 'dji-neo-2.png',
    donnees_fiche: ['Caméra 4K/60fps stabilisée', 'Poids 135g', 'Autonomie 28 min', 'Portée 10 km'],
    fonctionnalites_avancees: ['Décollage main', 'ActiveTrack 360°', 'QuickShots AI', 'Mode retour automatique'],
    top_du_mois: true
  },
  {
    id: 'prod_53',
    nom: 'meta-quest-3s',
    categorie: 'casque-vr',
    prix: '399.99€',
    description: 'Version accessible du Quest 3 avec même processeur Snapdragon XR2 Gen 2, réalité mixte en couleur et bibliothèque de jeux complète.',
    titre_affiche: 'Meta Quest 3S',
    lien: 'fiches/casque-vr/meta-quest-3s.html',
    image: 'meta-quest-3s.png',
    donnees_fiche: ['Processeur Snapdragon XR2 Gen 2', 'Écrans LCD 128 Go', 'Passthrough couleur', 'Contrôleurs Touch Plus'],
    fonctionnalites_avancees: ['Réalité mixte', 'Compatible Quest 2/3', 'Meta Horizon OS', 'Résolution 1832x1920 par œil'],
    top_du_mois: true
  },
  {
    id: 'prod_54',
    nom: 'msi-titan-18-hx',
    categorie: 'pc-gaming',
    prix: '4999.99€',
    description: 'PC portable gaming extrême avec écran Mini LED 4K 120Hz, RTX 5090 et système de refroidissement Cooler Boost Titan pour performances maximales.',
    titre_affiche: 'MSI Titan 18 HX',
    lien: 'fiches/pc-gaming/msi-titan-18-hx.html',
    image: 'msi-titan-18-hx.png',
    donnees_fiche: ['Écran 18" Mini LED 4K 120Hz', 'Intel Core i9-14900HX', 'RTX 5090 16 Go', '128 Go DDR5 / 4 To SSD'],
    fonctionnalites_avancees: ['Clavier Cherry MX mécanique', 'Cooler Boost Titan', 'Audio Dynaudio 6 HP', 'Thunderbolt 5'],
    top_du_mois: true
  },
  {
    id: 'prod_55',
    nom: 'oneplus-pad-2',
    categorie: 'tablette',
    prix: '599.99€',
    description: 'Tablette premium avec écran 12.1" 144Hz, Snapdragon 8 Gen 3 et batterie 9510 mAh pour productivité et divertissement sans compromis.',
    titre_affiche: 'OnePlus Pad 2',
    lien: 'fiches/tablette/oneplus-pad-2.html',
    image: 'oneplus-pad-2.png',
    donnees_fiche: ['Écran 12.1" LCD 3000x2120 144Hz', 'Snapdragon 8 Gen 3', '12 Go RAM / 256 Go', 'Batterie 9510 mAh'],
    fonctionnalites_avancees: ['Charge SuperVOOC 67W', 'Stylet Smart Stylus Pro', 'Clavier magnétique', '6 haut-parleurs Dolby Atmos'],
    top_du_mois: true
  },
  {
    id: 'prod_56',
    nom: 'huawei-watch-gt-5-pro',
    categorie: 'montre-connectee',
    prix: '449.99€',
    description: 'Montre connectée premium en titane avec GPS double fréquence, autonomie 14 jours et capteurs santé avancés pour un suivi complet.',
    titre_affiche: 'Huawei Watch GT 5 Pro',
    lien: 'fiches/montre-connectee/huawei-watch-gt-5-pro.html',
    image: 'huawei-watch-gt-5-pro.png',
    donnees_fiche: ['Boîtier titane 46mm', 'Écran AMOLED 1.43"', 'GPS double fréquence', 'Autonomie 14 jours'],
    fonctionnalites_avancees: ['Capteur FC avancé', 'Suivi sommeil AI', '100+ modes sport', 'Étanche 5 ATM'],
    top_du_mois: true
  },
  {
    id: 'prod_57',
    nom: 'sennheiser-momentum-5',
    categorie: 'casque-audio',
    prix: '399.99€',
    description: 'Casque audio haut de gamme avec ANC adaptatif, audio spatial personnalisé et 60h d\'autonomie pour une immersion sonore exceptionnelle.',
    titre_affiche: 'Sennheiser Momentum 5',
    lien: 'fiches/casque-audio/sennheiser-momentum-5.html',
    image: 'sennheiser-momentum-5.png',
    donnees_fiche: ['Transducteurs 42mm', 'ANC adaptatif', 'Autonomie 60h', 'Bluetooth 5.4 aptX Lossless'],
    fonctionnalites_avancees: ['Audio spatial personnalisé', 'Matériaux premium', 'Commandes tactiles', 'Application Smart Control'],
    top_du_mois: true
  },
  {
    id: 'prod_58',
    nom: 'samsung-qn900d-neo-qled-8k',
    categorie: 'ecran-tv',
    prix: '5999.99€',
    description: 'TV 8K 75" avec technologie Neo QLED, processeur NQ8 AI Gen3 et Infinity Screen pour une qualité d\'image absolue.',
    titre_affiche: 'Samsung QN900D Neo QLED 8K',
    lien: 'fiches/ecran-tv/samsung-qn900d-neo-qled-8k.html',
    image: 'samsung-qn900d-8k.png',
    donnees_fiche: ['Écran 75" 8K Neo QLED', 'Processeur NQ8 AI Gen3', 'Mini LED Quantum Matrix Pro', 'Infinity Screen'],
    fonctionnalites_avancees: ['HDR10+ Adaptive', 'Object Tracking Sound Pro', '144Hz gaming', 'Smart Hub AI'],
    top_du_mois: true
  },
  {
    id: 'prod_59',
    nom: 'sony-a7-v',
    categorie: 'camera',
    prix: '4299.99€',
    description: 'Hybride plein format 61MP avec AF AI temps réel, vidéo 8K 30p et stabilisation 8 stops pour créateurs professionnels.',
    titre_affiche: 'Sony A7 V',
    lien: 'fiches/camera/sony-a7-v.html',
    image: 'sony-a7-v.png',
    donnees_fiche: ['Capteur 61MP full-frame', 'Vidéo 8K 30p / 4K 120p', 'AF AI 759 points', 'Stabilisation 8 stops'],
    fonctionnalites_avancees: ['Viseur OLED 9.44M points', 'Double slot CFexpress', 'Écran tactile orientable', 'Étanche IPX4'],
    top_du_mois: true
  },
  {
    id: 'prod_60',
    nom: 'bambu-lab-x1-carbon-combo',
    categorie: 'imprimante-3d',
    prix: '1449.99€',
    description: 'Imprimante 3D ultra-rapide avec système AMS 4 couleurs, détection IA et vitesse jusqu\'à 500mm/s pour impression professionnelle.',
    titre_affiche: 'Bambu Lab X1-Carbon Combo',
    lien: 'fiches/imprimante-3d/bambu-lab-x1-carbon-combo.html',
    image: 'bambu-lab-x1-carbon.png',
    donnees_fiche: ['Volume 256x256x256mm', 'Vitesse max 500mm/s', 'AMS 4 couleurs', 'Caméra IA'],
    fonctionnalites_avancees: ['Détection défauts IA', 'Plateau PEI chauffant', 'Filtre HEPA', 'Cloud printing'],
    top_du_mois: true
  },
  {
    id: 'prod_61',
    nom: 'razer-blackwidow-v4-pro-75-',
    categorie: 'peripheriques',
    prix: '249.99€',
    description: 'Clavier mécanique gaming compact 75% avec switches Gen-3, écran OLED, molette et RGB Chroma pour setup minimaliste ultime.',
    titre_affiche: 'Razer BlackWidow V4 Pro 75%',
    lien: 'fiches/peripheriques/razer-blackwidow-v4-pro.html',
    image: 'razer-blackwidow-v4-pro-75.png',
    donnees_fiche: ['Format 75% compact', 'Switches Razer Gen-3', 'Écran OLED', 'Molette multifonction'],
    fonctionnalites_avancees: ['RGB Chroma 16.8M couleurs', 'Repose-poignets magnétique', 'Polling 8000Hz', 'HyperSpeed Wireless'],
    top_du_mois: true
  }
];

async function run() {
  try {
    await client.connect();
    console.log('✅ Connecté à PostgreSQL\n');
    
    for (const p of products) {
      await client.query(
        `INSERT INTO produits (id, nom, categorie, prix, description, titre_affiche, lien, image, donnees_fiche, fonctionnalites_avancees, top_du_mois)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [p.id, p.nom, p.categorie, p.prix, p.description, p.titre_affiche, p.lien, p.image, p.donnees_fiche, p.fonctionnalites_avancees, p.top_du_mois]
      );
      console.log(`✅ ${p.id} - ${p.nom}`);
    }
    
    console.log('\n✅ 12 produits ajoutés !');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

run();
