/**
 * Script d'ajout des produits de Janvier 2026
 * Insère 12 nouveaux produits innovants pour le mois de janvier 2026
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Produits de Janvier 2026 (prod_63 à prod_74)
const produitsJanvier2026 = [
  {
    id: 'prod_63',
    nom: 'sony-playstation-6',
    categorie: 'CONSOLE',
    prix: '699.99 €',
    description: 'La nouvelle génération de console Sony avec ray tracing 8K, SSD ultra-rapide 4TB et processeur AMD RDNA 4.',
    image: 'ps6.jpg',
    lien: 'fiches/console/sony-playstation-6.html',
    titre_affiche: 'Sony PlayStation 6',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Processeur AMD Zen 5 8 cœurs @ 4.5GHz',
      'GPU AMD RDNA 4 - 36 TFLOPS',
      'Mémoire 32GB GDDR7',
      'Stockage 4TB SSD NVMe Gen 5',
      'Résolution jusqu\'à 8K @ 60fps',
      'Ray Tracing avancé, VRR, HDMI 2.2',
      'WiFi 7, Bluetooth 5.4',
      'Compatibilité PS5/PS4',
      'Mode super-résolution IA',
      'Commandes vocales améliorées',
      'Streaming cloud intégré',
      'Support manettes haptiques Gen 2'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Console next-gen Sony\n- Ray tracing 8K natif\n- SSD ultra-rapide 4TB\n- Rétrocompatibilité complète',
      '💰 Prix\nPrix de lancement : 699.99 €',
      '🧩 Spécifications matérielles\n- Processeur : AMD Zen 5 8 cœurs @ 4.5GHz\n- GPU : AMD RDNA 4 - 36 TFLOPS\n- Mémoire : 32GB GDDR7\n- Stockage : 4TB SSD NVMe Gen 5\n- Résolution : Jusqu\'à 8K @ 60fps',
      '🎮 Performances gaming\n- Performances ultra élevées\n- Ray tracing supporté\n- Haute fréquence d\'images\n- Compatible VR nouvelle génération',
      '🌐 Connectivité\n- WiFi 7\n- Bluetooth 5.4\n- HDMI 2.2\n- Ports USB-C haute vitesse',
      '🎮 Expérience utilisateur\n- Interface intuitive nouvelle génération\n- Manettes haptiques Gen 2\n- Audio 3D immersif\n- Mode super-résolution IA',
      '🛡️ Garantie et support\n- Garantie constructeur : 2 ans\n- Support PlayStation Network\n- Mises à jour régulières\n- Service après-vente Sony'
    ]
  },
  {
    id: 'prod_64',
    nom: 'Asus ROG Swift PG32UQX II',
    categorie: 'ECRAN-TV',
    prix: 2499.99,
    description: 'Moniteur gaming 32" Mini-LED 4K 240Hz avec HDR 2000 et temps de réponse 0.5ms.',
    image: 'asus-rog-pg32uqx-ii.jpg',
    lien: '/fiches/ecran-tv/asus-rog-swift-pg32uqx-ii.html',
    top_du_mois: true,
    specifications_techniques: {
      taille: '32 pouces',
      resolution: '3840 x 2160 (4K UHD)',
      taux_rafraichissement: '240Hz',
      temps_reponse: '0.5ms GTG',
      panel: 'Mini-LED Quantum Dot IPS',
      luminosite: '2000 nits (HDR)',
      contraste: '1,000,000:1',
      connectique: ['HDMI 2.2', 'DisplayPort 2.1', 'USB-C 140W', 'USB 3.2 Hub']
    },
    fonctionnalites_avancees: [
      'G-Sync Ultimate',
      'DisplayHDR 2000',
      'ELMB Sync',
      'GamePlus & GameVisual',
      'Éclairage RGB Aura Sync'
    ],
    donnees_fiche: [
      'Image parfaite avec 2304 zones de dimming',
      'Fluidité absolue pour le gaming compétitif',
      'Ergonomie premium ajustable',
      'Hub USB intégré pratique'
    ]
  },
  {
    id: 'prod_65',
    nom: 'Alienware Area-51 Elite',
    categorie: 'PC-GAMING',
    prix: 5999.99,
    description: 'PC gaming ultra-haut de gamme avec Intel Core Ultra 9 285K et NVIDIA RTX 5090.',
    image: 'alienware-area51-elite.jpg',
    lien: '/fiches/pc-gaming/alienware-area-51-elite.html',
    top_du_mois: true,
    specifications_techniques: {
      processeur: 'Intel Core Ultra 9 285K (24 cœurs)',
      gpu: 'NVIDIA GeForce RTX 5090 24GB',
      memoire: '64GB DDR5-7200MHz',
      stockage: '4TB NVMe Gen 5 + 4TB SSD',
      refroidissement: 'Watercooling AIO 420mm',
      alimentation: '1500W 80+ Platinum',
      boitier: 'Alienware Legend 3.0 RGB'
    },
    fonctionnalites_avancees: [
      'Overclocking automatique IA',
      'RGB AlienFX personnalisable',
      'Panneau LCD de contrôle',
      'WiFi 7 & 10GbE',
      'Garantie 3 ans premium'
    ],
    donnees_fiche: [
      'Performances gaming absolues',
      'Design futuriste iconique',
      'Refroidissement ultra-silencieux',
      'Évolutivité maximale'
    ]
  },
  {
    id: 'prod_66',
    nom: 'Apple AirPods Max 2',
    categorie: 'CASQUE-AUDIO',
    prix: 649.99,
    description: 'Casque premium avec réduction de bruit adaptative, audio spatial personnalisé et puce H3.',
    image: 'airpods-max-2.jpg',
    lien: '/fiches/casque-audio/apple-airpods-max-2.html',
    top_du_mois: true,
    specifications_techniques: {
      type: 'Circum-aural fermé',
      drivers: '40mm dynamiques custom',
      puce: 'Apple H3',
      bluetooth: '5.4 avec Lossless',
      autonomie: '30 heures (ANC activé)',
      charge: 'USB-C, charge rapide 15min = 5h',
      poids: '365g'
    },
    fonctionnalites_avancees: [
      'ANC adaptative nouvelle génération',
      'Audio spatial personnalisé avec suivi de tête',
      'Mode transparence adaptatif',
      'Égaliseur computationnel',
      'Détection automatique de port',
      'Partage audio multi-casques'
    ],
    donnees_fiche: [
      'Qualité sonore exceptionnelle',
      'Confort premium longue durée',
      'Intégration parfaite écosystème Apple',
      'Build quality haut de gamme'
    ]
  },
  {
    id: 'prod_67',
    nom: 'DJI Mavic 4 Pro',
    categorie: 'DRONE',
    prix: 2199.99,
    description: 'Drone professionnel avec caméra Hasselblad 1" 60MP, détection omnidirectionnelle et autonomie 50 minutes.',
    image: 'dji-mavic-4-pro.jpg',
    lien: '/fiches/drone/dji-mavic-4-pro.html',
    top_du_mois: true,
    specifications_techniques: {
      capteur: 'CMOS 1 pouce 60MP Hasselblad',
      video: '8K/60fps, 4K/120fps',
      stabilisation: 'Gimbal 3 axes',
      vitesse_max: '75 km/h',
      autonomie: '50 minutes',
      portee: '20 km (OcuSync 4.0)',
      poids: '895g',
      detection: 'Omnidirectionnelle (6 directions)'
    },
    fonctionnalites_avancees: [
      'ActiveTrack 6.0',
      'MasterShots Pro',
      'QuickShots avancés',
      'Hyperlight Pro 2.0',
      'Mode FPV intégré',
      'RTH intelligent'
    ],
    donnees_fiche: [
      'Qualité d\'image professionnelle',
      'Sécurité maximale en vol',
      'Fonctions intelligentes avancées',
      'Portabilité et autonomie excellentes'
    ]
  },
  {
    id: 'prod_68',
    nom: 'Logitech MX Master 5',
    categorie: 'PERIPHERIQUES',
    prix: 129.99,
    description: 'Souris ergonomique professionnelle avec capteur 12000 DPI, recharge MagSpeed et multi-devices.',
    image: 'logitech-mx-master-5.jpg',
    lien: '/fiches/peripheriques/logitech-mx-master-5.html',
    top_du_mois: false,
    specifications_techniques: {
      capteur: 'Darkfield 12000 DPI',
      boutons: '8 programmables',
      connectivite: 'Bluetooth 5.4, USB-C Logi Bolt',
      autonomie: '120 jours (charge complète)',
      charge: 'USB-C (3min = 8h utilisation)',
      poids: '141g',
      compatibilite: 'Windows, macOS, Linux, iPadOS'
    },
    fonctionnalites_avancees: [
      'MagSpeed Electromagnetic scroll wheel',
      'Contrôle multi-devices (3 appareils)',
      'Flow cross-computer',
      'Bouton gestes personnalisables',
      'Easy-Switch rapide',
      'Revêtement premium anti-traces'
    ],
    donnees_fiche: [
      'Ergonomie parfaite pour usage intensif',
      'Précision ultime sur toute surface',
      'Productivité maximale multi-écrans',
      'Autonomie exceptionnelle'
    ]
  },
  {
    id: 'prod_69',
    nom: 'Samsung Galaxy S26 Ultra',
    categorie: 'SMARTPHONE',
    prix: 1399.99,
    description: 'Smartphone flagship avec écran AMOLED 6.9" 144Hz, Snapdragon 8 Gen 4 et caméra 240MP.',
    image: 'galaxy-s26-ultra.jpg',
    lien: '/fiches/smartphone/samsung-galaxy-s26-ultra.html',
    top_du_mois: true,
    specifications_techniques: {
      ecran: '6.9" Dynamic AMOLED 2X 144Hz',
      resolution: '3200 x 1440 (QHD+)',
      processeur: 'Snapdragon 8 Gen 4',
      ram: '16GB LPDDR6',
      stockage: '512GB UFS 4.1',
      batterie: '6000mAh',
      charge: '65W filaire, 25W sans fil',
      cameras: {
        principale: '240MP f/1.7 OIS',
        ultra_wide: '50MP f/1.9',
        periscope: '50MP f/2.4 10x optique',
        frontale: '40MP f/2.0'
      }
    },
    fonctionnalites_avancees: [
      'Galaxy AI avec Gemini Ultra',
      'S Pen intégré nouvelle génération',
      'DeX sans fil amélioré',
      'Vision Booster 2.0',
      'Expert RAW Pro',
      '5G mmWave & WiFi 7'
    ],
    donnees_fiche: [
      'Performances flagship absolues',
      'Écran le plus lumineux du marché',
      'Polyvalence photo professionnelle',
      'Autonomie solide toute la journée'
    ]
  },
  {
    id: 'prod_70',
    nom: 'Meta Quest 4',
    categorie: 'CASQUE-VR',
    prix: 549.99,
    description: 'Casque VR standalone avec écrans micro-OLED 4K par œil, eye-tracking et hand-tracking nouvelle génération.',
    image: 'meta-quest-4.jpg',
    lien: '/fiches/casque-vr/meta-quest-4.html',
    top_du_mois: true,
    specifications_techniques: {
      ecrans: 'Micro-OLED 4K par œil (4096 x 4096)',
      refresh_rate: '120Hz (90Hz compatible)',
      champ_vision: '110°',
      processeur: 'Snapdragon XR3 Gen 2',
      memoire: '16GB',
      stockage: '512GB',
      tracking: 'Inside-out 6DoF + Eye & Hand tracking',
      audio: 'Spatial audio 3D intégré',
      autonomie: '3-4 heures'
    },
    fonctionnalites_avancees: [
      'Passthrough couleur haute résolution',
      'Foveated rendering dynamique',
      'Mixed Reality avancée',
      'Compatibilité PC VR sans fil',
      'Contrôleurs Touch Pro 2',
      'Fitness tracking intégré'
    ],
    donnees_fiche: [
      'Clarté visuelle inégalée',
      'Confort amélioré pour sessions longues',
      'Bibliothèque de jeux massive',
      'Setup facile et intuitif'
    ]
  },
  {
    id: 'prod_71',
    nom: 'Apple MacBook Pro 16" M5 Ultra',
    categorie: 'PC-GAMING',
    prix: 4999.99,
    description: 'Workstation portable ultime avec puce M5 Ultra, écran Liquid Retina XDR et autonomie 24 heures.',
    image: 'macbook-pro-16-m5-ultra.jpg',
    lien: '/fiches/pc-gaming/apple-macbook-pro-16-m5-ultra.html',
    top_du_mois: false,
    specifications_techniques: {
      processeur: 'Apple M5 Ultra (32 cœurs CPU)',
      gpu: '80 cœurs GPU',
      neural_engine: '40 cœurs',
      memoire: '128GB RAM unifiée',
      stockage: '4TB SSD',
      ecran: '16.2" Liquid Retina XDR 120Hz',
      resolution: '3456 x 2234',
      luminosite: '1600 nits (HDR)',
      autonomie: '24 heures',
      ports: '4x Thunderbolt 5, HDMI 2.2, SD UHS-III, MagSafe 3'
    },
    fonctionnalites_avancees: [
      'ProMotion 120Hz adaptatif',
      'Caméra Center Stage 1080p',
      'Son spatial 6 haut-parleurs',
      'Touch ID',
      'WiFi 7 & 5G option',
      'Clavier rétroéclairé Magic Keyboard'
    ],
    donnees_fiche: [
      'Puissance créative sans compromis',
      'Écran XDR référence studio',
      'Autonomie révolutionnaire',
      'Silence absolu sous charge'
    ]
  },
  {
    id: 'prod_72',
    nom: 'Bambu Lab X2 Carbon',
    categorie: 'IMPRIMANTE-3D',
    prix: 1799.99,
    description: 'Imprimante 3D CoreXY ultra-rapide avec système AMS multicolore 16 matériaux et IA de détection d\'erreurs.',
    image: 'bambu-x2-carbon.jpg',
    lien: '/fiches/imprimante-3d/bambu-lab-x2-carbon.html',
    top_du_mois: true,
    specifications_techniques: {
      volume: '350 x 350 x 350 mm',
      vitesse: 'Jusqu\'à 1000 mm/s',
      precision: '±0.05mm',
      extrudeur: 'Direct drive',
      plateau: 'Chauffant magnétique PEI',
      temperature_max: '350°C (hotend)',
      materiaux: ['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'Nylon', 'Carbon Fiber'],
      connectivite: 'WiFi 6, Ethernet, USB'
    },
    fonctionnalites_avancees: [
      'AMS 16 matériaux automatique',
      'Détection erreurs par IA',
      'Calibration automatique complète',
      'Caméra streaming 1080p',
      'Mode silencieux',
      'Reprise après coupure'
    ],
    donnees_fiche: [
      'Vitesse d\'impression exceptionnelle',
      'Qualité professionnelle',
      'Multi-matériaux sans intervention',
      'Fiabilité et facilité d\'usage'
    ]
  },
  {
    id: 'prod_73',
    nom: 'Garmin Fenix 8 Solar',
    categorie: 'MONTRE-CONNECTEE',
    prix: 999.99,
    description: 'Montre multisport premium avec charge solaire, cartographie complète et autonomie 60 jours.',
    image: 'garmin-fenix-8-solar.jpg',
    lien: '/fiches/montre-connectee/garmin-fenix-8-solar.html',
    top_du_mois: true,
    specifications_techniques: {
      ecran: '1.4" AMOLED toujours actif',
      resolution: '454 x 454 pixels',
      boitier: 'Titane 47mm',
      verre: 'Power Sapphire solaire',
      etancheite: '10 ATM (100m)',
      autonomie: '60 jours (smartwatch), 150h (GPS)',
      capteurs: ['Cardio optique Gen 5', 'SpO2', 'Altimètre', 'Baromètre', 'Compas', 'Gyroscope'],
      connectivite: 'Bluetooth, ANT+, WiFi, LTE'
    },
    fonctionnalites_avancees: [
      'Cartographie topoactive préchargée',
      'Plus de 100 profils sportifs',
      'Training readiness & HRV',
      'Paiement sans contact',
      'Musique stockée (32GB)',
      'Lampe LED intégrée',
      'SOS & LiveTrack'
    ],
    donnees_fiche: [
      'Autonomie record avec charge solaire',
      'Build quality militaire (MIL-STD-810)',
      'Précision GPS multi-bandes',
      'Fonctionnalités sportives exhaustives'
    ]
  },
  {
    id: 'prod_74',
    nom: 'Microsoft Surface Hub 3 85"',
    categorie: 'TABLEAU-INTERACTIF',
    prix: 12999.99,
    description: 'Tableau collaboratif géant 85" 4K tactile avec Windows 11 Team, caméras IA et son spatial.',
    image: 'surface-hub-3-85.jpg',
    lien: '/fiches/tableau-interactif/microsoft-surface-hub-3-85.html',
    top_du_mois: false,
    specifications_techniques: {
      ecran: '85" LCD IPS 4K tactile 20 points',
      resolution: '3840 x 2160',
      processeur: 'Intel Core i9-14900',
      gpu: 'NVIDIA RTX A4000',
      memoire: '64GB DDR5',
      stockage: '1TB NVMe',
      cameras: 'Triple 4K avec IA tracking',
      son: 'Système 6 haut-parleurs + subwoofer',
      connectique: ['HDMI 2.1', 'DisplayPort', 'USB-C', 'Ethernet 10Gb']
    },
    fonctionnalites_avancees: [
      'Windows 11 Team Edition',
      'Microsoft Teams natif',
      'Whiteboard intelligent IA',
      'Framing automatique multi-personnes',
      'Annulation bruit avancée',
      'Rotation automatique portrait/paysage',
      'Montage mobile avec batterie'
    ],
    donnees_fiche: [
      'Collaboration hybride optimale',
      'Qualité d\'affichage exceptionnelle',
      'Intégration Microsoft 365 parfaite',
      'Audio/vidéo professionnel'
    ]
  }
];

async function addProducts() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Début de l\'insertion des produits de Janvier 2026...\n');
    
    for (const produit of produitsJanvier2026) {
      console.log(`📦 Insertion de ${produit.nom}...`);
      
      // Vérifier si le produit existe déjà
      const checkQuery = 'SELECT id FROM produits WHERE id = $1';
      const checkResult = await client.query(checkQuery, [produit.id]);
      
      if (checkResult.rows.length > 0) {
        console.log(`   ⚠️  Le produit ${produit.id} existe déjà, mise à jour...`);
        
        const updateQuery = `
          UPDATE produits SET
            nom = $1,
            categorie = $2,
            prix = $3,
            description = $4,
            image = $5,
            lien = $6,
            top_du_mois = $7,
            specifications_techniques = $8,
            fonctionnalites_avancees = $9,
            donnees_fiche = $10
          WHERE id = $11
        `;
        
        await client.query(updateQuery, [
          produit.nom,
          produit.categorie,
          produit.prix,
          produit.description,
          produit.image,
          produit.lien,
          produit.top_du_mois,
          JSON.stringify(produit.specifications_techniques),
          produit.fonctionnalites_avancees,
          produit.donnees_fiche,
          produit.id
        ]);
        
        console.log(`   ✅ Produit ${produit.id} mis à jour`);
      } else {
        const insertQuery = `
          INSERT INTO produits (
            id, nom, categorie, prix, description, image, lien, 
            top_du_mois, specifications_techniques, 
            fonctionnalites_avancees, donnees_fiche
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;
        
        await client.query(insertQuery, [
          produit.id,
          produit.nom,
          produit.categorie,
          produit.prix,
          produit.description,
          produit.image,
          produit.lien,
          produit.top_du_mois,
          JSON.stringify(produit.specifications_techniques),
          produit.fonctionnalites_avancees,
          produit.donnees_fiche
        ]);
        
        console.log(`   ✅ Produit ${produit.id} inséré`);
      }
    }
    
    console.log('\n✨ Tous les produits de Janvier 2026 ont été ajoutés avec succès !');
    console.log(`📊 Total : ${produitsJanvier2026.length} produits`);
    
    // Afficher le résumé
    const topProducts = produitsJanvier2026.filter(p => p.top_du_mois);
    console.log(`⭐ Produits "Top du mois" : ${topProducts.length}`);
    topProducts.forEach(p => console.log(`   - ${p.nom} (${p.categorie})`));
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des produits:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Exécution
addProducts().catch(console.error);
