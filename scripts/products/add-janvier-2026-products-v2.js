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
      'Ray Tracing avancé, VRR, HDMI 2.2',
      'WiFi 7, Bluetooth 5.4',
      'Compatibilité PS5/PS4 complète',
      'Mode super-résolution IA',
      'Streaming cloud intégré'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Console next-gen Sony\n- Ray tracing 8K natif\n- SSD ultra-rapide 4TB\n- Rétrocompatibilité complète',
      '💰 Prix\nPrix de lancement : 699.99 €',
      '🧩 Spécifications matérielles\n- Processeur : AMD Zen 5 8 cœurs @ 4.5GHz\n- GPU : AMD RDNA 4 - 36 TFLOPS\n- Mémoire : 32GB GDDR7\n- Stockage : 4TB SSD NVMe Gen 5\n- Résolution : Jusqu\'à 8K @ 60fps',
      '🎮 Performances gaming\n- Performances ultra élevées en 8K\n- Ray tracing avancé\n- Temps de chargement quasi-instantanés\n- Compatible VR nouvelle génération',
      '🌐 Connectivité\n- WiFi 7\n- Bluetooth 5.4\n- HDMI 2.2\n- Ports USB-C haute vitesse',
      '🎮 Expérience utilisateur\n- Manettes haptiques Gen 2\n- Audio 3D immersif\n- Mode super-résolution IA\n- Interface intuitive',
      '🛡️ Garantie et support\n- Garantie constructeur : 2 ans\n- Support PlayStation Network\n- Mises à jour régulières\n- Service après-vente Sony'
    ]
  },
  {
    id: 'prod_64',
    nom: 'asus-rog-swift-pg32uqx-ii',
    categorie: 'ECRAN-TV',
    prix: '2499.99 €',
    description: 'Moniteur gaming 32" Mini-LED 4K 240Hz avec HDR 2000 et temps de réponse 0.5ms.',
    image: 'asus-rog-pg32uqx-ii.jpg',
    lien: 'fiches/ecran-tv/asus-rog-swift-pg32uqx-ii.html',
    titre_affiche: 'Asus ROG Swift PG32UQX II',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Taille : 32 pouces',
      'Résolution : 3840 x 2160 (4K UHD)',
      'Taux de rafraîchissement : 240Hz',
      'Temps de réponse : 0.5ms GTG',
      'Panel Mini-LED Quantum Dot IPS',
      'Luminosité : 2000 nits (HDR)',
      'Contraste : 1,000,000:1',
      'G-Sync Ultimate',
      'DisplayHDR 2000',
      'HDMI 2.2, DisplayPort 2.1, USB-C 140W'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Moniteur gaming premium\n- Mini-LED avec 2304 zones\n- Fluidité 240Hz\n- HDR ultime',
      '💰 Prix\nPrix de lancement : 2499.99 €',
      '🧩 Spécifications matérielles\n- Taille : 32 pouces\n- Résolution : 3840 x 2160 (4K)\n- Taux : 240Hz\n- Temps de réponse : 0.5ms\n- Luminosité : 2000 nits\n- Panel : Mini-LED Quantum Dot IPS',
      '🎮 Performances gaming\n- Performances ultra élevées\n- G-Sync Ultimate\n- Temps de réponse exceptionnel\n- Compatible consoles next-gen',
      '🌐 Connectivité\n- HDMI 2.2\n- DisplayPort 2.1\n- USB-C 140W\n- Hub USB 3.2',
      '🎮 Expérience utilisateur\n- Image parfaite HDR 2000\n- Ergonomie ajustable\n- ELMB Sync\n- Éclairage RGB Aura Sync',
      '🛡️ Garantie et support\n- Garantie constructeur : 3 ans\n- Support technique Asus\n- Mises à jour firmware\n- Service premium'
    ]
  },
  {
    id: 'prod_65',
    nom: 'alienware-area-51-elite',
    categorie: 'PC-GAMING',
    prix: '5999.99 €',
    description: 'PC gaming ultra-haut de gamme avec Intel Core Ultra 9 285K et NVIDIA RTX 5090.',
    image: 'alienware-area51-elite.jpg',
    lien: 'fiches/pc-gaming/alienware-area-51-elite.html',
    titre_affiche: 'Alienware Area-51 Elite',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Processeur Intel Core Ultra 9 285K (24 cœurs)',
      'GPU NVIDIA GeForce RTX 5090 24GB',
      'Mémoire 64GB DDR5-7200MHz',
      'Stockage 4TB NVMe Gen 5 + 4TB SSD',
      'Watercooling AIO 420mm',
      'Alimentation 1500W 80+ Platinum',
      'Boîtier Alienware Legend 3.0 RGB',
      'Overclocking automatique IA',
      'WiFi 7 & 10GbE',
      'Garantie 3 ans premium'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- PC gaming ultime\n- RTX 5090 flagship\n- Core Ultra 9 dernière génération\n- Design futuriste iconique',
      '💰 Prix\nPrix de lancement : 5999.99 €',
      '🧩 Spécifications matérielles\n- Processeur : Intel Core Ultra 9 285K (24C)\n- GPU : NVIDIA RTX 5090 24GB\n- RAM : 64GB DDR5-7200\n- Stockage : 8TB total (4TB Gen 5 + 4TB SSD)\n- Refroidissement : Watercooling 420mm',
      '🎮 Performances gaming\n- Performances absolues\n- 8K gaming possible\n- Ray tracing ultime\n- VR haut de gamme',
      '🌐 Connectivité\n- WiFi 7\n- Ethernet 10GbE\n- Thunderbolt 4\n- Ports USB-C multiples',
      '🎮 Expérience utilisateur\n- RGB AlienFX personnalisable\n- Panneau LCD de contrôle\n- Ultra silencieux\n- Évolutivité maximale',
      '🔋 Gestion thermique\n- Watercooling premium\n- Températures optimales\n- Système ultra-silencieux\n- Performance soutenue',
      '🛡️ Garantie et support\n- Garantie constructeur : 3 ans premium\n- Support 24/7\n- Mises à jour régulières\n- Service prioritaire'
    ]
  },
  {
    id: 'prod_66',
    nom: 'apple-airpods-max-2',
    categorie: 'CASQUE-AUDIO',
    prix: '649.99 €',
    description: 'Casque premium avec réduction de bruit adaptative, audio spatial personnalisé et puce H3.',
    image: 'airpods-max-2.jpg',
    lien: 'fiches/casque-audio/apple-airpods-max-2.html',
    titre_affiche: 'Apple AirPods Max 2',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Type : Circum-aural fermé',
      'Drivers : 40mm dynamiques custom',
      'Puce Apple H3',
      'Bluetooth 5.4 avec Lossless',
      'Autonomie : 30 heures (ANC activé)',
      'Charge : USB-C, charge rapide',
      'ANC adaptative nouvelle génération',
      'Audio spatial personnalisé',
      'Mode transparence adaptatif',
      'Égaliseur computationnel'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Casque premium Apple\n- ANC de nouvelle génération\n- Audio spatial immersif\n- Build quality exceptionnelle',
      '💰 Prix\nPrix de lancement : 649.99 €',
      '🧩 Spécifications matérielles\n- Drivers : 40mm dynamiques\n- Puce : Apple H3\n- Bluetooth : 5.4 Lossless\n- Autonomie : 30h (ANC on)\n- Charge : USB-C rapide\n- Poids : 365g',
      '🎮 Qualité audio\n- Son Hi-Fi exceptionnel\n- ANC adaptative\n- Audio spatial personnalisé\n- Égaliseur computationnel',
      '🌐 Connectivité\n- Bluetooth 5.4\n- Multipoint\n- USB-C\n- Intégration parfaite Apple',
      '🎮 Expérience utilisateur\n- Confort premium longue durée\n- Détection automatique de port\n- Commandes intuitives\n- Partage audio multi-casques',
      '🛡️ Garantie et support\n- Garantie constructeur : 1 an\n- AppleCare+ disponible\n- Support Apple\n- Mises à jour automatiques'
    ]
  },
  {
    id: 'prod_67',
    nom: 'dji-mavic-4-pro',
    categorie: 'DRONE',
    prix: '2199.99 €',
    description: 'Drone professionnel avec caméra Hasselblad 1" 60MP, détection omnidirectionnelle et autonomie 50 minutes.',
    image: 'dji-mavic-4-pro.jpg',
    lien: 'fiches/drone/dji-mavic-4-pro.html',
    titre_affiche: 'DJI Mavic 4 Pro',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Capteur CMOS 1 pouce 60MP Hasselblad',
      'Vidéo 8K/60fps, 4K/120fps',
      'Stabilisation Gimbal 3 axes',
      'Vitesse max : 75 km/h',
      'Autonomie : 50 minutes',
      'Portée : 20 km (OcuSync 4.0)',
      'Détection omnidirectionnelle',
      'ActiveTrack 6.0',
      'MasterShots Pro',
      'Hyperlight Pro 2.0'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Drone professionnel DJI\n- Caméra Hasselblad 60MP\n- Vidéo 8K native\n- Sécurité maximale',
      '💰 Prix\nPrix de lancement : 2199.99 €',
      '🧩 Spécifications matérielles\n- Capteur : 1" 60MP Hasselblad\n- Vidéo : 8K/60fps\n- Stabilisation : Gimbal 3 axes\n- Autonomie : 50 min\n- Portée : 20 km\n- Poids : 895g',
      '🎮 Performances de vol\n- Vitesse max : 75 km/h\n- Stabilité exceptionnelle\n- Détection 6 directions\n- RTH intelligent',
      '🌐 Connectivité\n- OcuSync 4.0\n- Portée 20 km\n- Streaming 1080p\n- Contrôle smartphone',
      '🎮 Expérience utilisateur\n- ActiveTrack 6.0\n- QuickShots avancés\n- Mode FPV intégré\n- Pilotage intuitif',
      '🛡️ Garantie et support\n- Garantie constructeur : 1 an\n- DJI Care disponible\n- Support technique\n- Mises à jour régulières'
    ]
  },
  {
    id: 'prod_68',
    nom: 'logitech-mx-master-5',
    categorie: 'PERIPHERIQUES',
    prix: '129.99 €',
    description: 'Souris ergonomique professionnelle avec capteur 12000 DPI, recharge MagSpeed et multi-devices.',
    image: 'logitech-mx-master-5.jpg',
    lien: 'fiches/peripheriques/logitech-mx-master-5.html',
    titre_affiche: 'Logitech MX Master 5',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Capteur Darkfield 12000 DPI',
      '8 boutons programmables',
      'Bluetooth 5.4, USB-C Logi Bolt',
      'Autonomie : 120 jours',
      'Charge rapide : 3min = 8h utilisation',
      'MagSpeed Electromagnetic scroll',
      'Contrôle multi-devices (3 appareils)',
      'Flow cross-computer',
      'Compatible Windows, macOS, Linux, iPadOS'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Souris ergonomique premium\n- Précision ultime 12000 DPI\n- Multi-devices avancé\n- Productivité maximale',
      '💰 Prix\nPrix de lancement : 129.99 €',
      '🧩 Spécifications matérielles\n- Capteur : Darkfield 12000 DPI\n- Boutons : 8 programmables\n- Connectivité : BT 5.4, Logi Bolt\n- Autonomie : 120 jours\n- Charge : USB-C rapide\n- Poids : 141g',
      '🎮 Ergonomie\n- Design parfait pour usage intensif\n- Revêtement premium\n- Molette MagSpeed\n- Boutons gestes personnalisables',
      '🌐 Connectivité\n- 3 appareils simultanés\n- Easy-Switch rapide\n- Flow cross-computer\n- Compatible multi-OS',
      '🎮 Expérience utilisateur\n- Précision sur toute surface\n- Productivité multi-écrans\n- Personnalisation complète\n- Confort optimal',
      '🛡️ Garantie et support\n- Garantie constructeur : 2 ans\n- Support Logitech\n- Logiciel Logi Options+\n- Mises à jour régulières'
    ]
  },
  {
    id: 'prod_69',
    nom: 'samsung-galaxy-s26-ultra',
    categorie: 'SMARTPHONE',
    prix: '1399.99 €',
    description: 'Smartphone flagship avec écran AMOLED 6.9" 144Hz, Snapdragon 8 Gen 4 et caméra 240MP.',
    image: 'galaxy-s26-ultra.jpg',
    lien: 'fiches/smartphone/samsung-galaxy-s26-ultra.html',
    titre_affiche: 'Samsung Galaxy S26 Ultra',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Écran : 6.9" Dynamic AMOLED 2X 144Hz',
      'Résolution : 3200 x 1440 (QHD+)',
      'Processeur : Snapdragon 8 Gen 4',
      'RAM : 16GB LPDDR6',
      'Stockage : 512GB UFS 4.1',
      'Batterie : 6000mAh',
      'Charge : 65W filaire, 25W sans fil',
      'Caméra principale : 240MP f/1.7 OIS',
      'Galaxy AI avec Gemini Ultra',
      'S Pen intégré nouvelle génération'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Flagship Samsung ultime\n- Écran 144Hz le plus lumineux\n- Caméra 240MP révolutionnaire\n- S Pen intégré',
      '💰 Prix\nPrix de lancement : 1399.99 €',
      '🧩 Spécifications matérielles\n- Écran : 6.9" AMOLED 144Hz\n- Processeur : Snapdragon 8 Gen 4\n- RAM : 16GB LPDDR6\n- Stockage : 512GB UFS 4.1\n- Batterie : 6000mAh\n- 5G mmWave & WiFi 7',
      '🎮 Performances\n- Performances flagship absolues\n- Galaxy AI avancé\n- DeX sans fil\n- Multitâche fluide',
      '🌐 Connectivité\n- 5G mmWave\n- WiFi 7\n- Bluetooth 5.4\n- Ultra Wideband',
      '📷 Photo/Vidéo\n- Caméra 240MP principale\n- Ultra-wide 50MP\n- Téléobjectif 10x 50MP\n- Expert RAW Pro\n- Vidéo 8K',
      '🎮 Expérience utilisateur\n- S Pen nouvelle génération\n- Vision Booster 2.0\n- One UI 8\n- Autonomie solide',
      '🛡️ Garantie et support\n- Garantie constructeur : 2 ans\n- Support Samsung\n- Mises à jour 7 ans\n- Service premium'
    ]
  },
  {
    id: 'prod_70',
    nom: 'meta-quest-4',
    categorie: 'CASQUE-VR',
    prix: '549.99 €',
    description: 'Casque VR standalone avec écrans micro-OLED 4K par œil, eye-tracking et hand-tracking nouvelle génération.',
    image: 'meta-quest-4.jpg',
    lien: 'fiches/casque-vr/meta-quest-4.html',
    titre_affiche: 'Meta Quest 4',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Écrans : Micro-OLED 4K par œil',
      'Refresh rate : 120Hz',
      'Champ de vision : 110°',
      'Processeur : Snapdragon XR3 Gen 2',
      'Mémoire : 16GB',
      'Stockage : 512GB',
      'Tracking : Inside-out 6DoF',
      'Eye & Hand tracking',
      'Passthrough couleur haute résolution',
      'Autonomie : 3-4 heures'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Casque VR standalone ultime\n- Micro-OLED 4K clarté inégalée\n- Mixed Reality avancée\n- Confort amélioré',
      '💰 Prix\nPrix de lancement : 549.99 €',
      '🧩 Spécifications matérielles\n- Écrans : Micro-OLED 4K/œil\n- Refresh : 120Hz\n- FOV : 110°\n- Processeur : Snapdragon XR3 Gen 2\n- RAM : 16GB\n- Stockage : 512GB',
      '🎮 Performances VR\n- Clarté visuelle inégalée\n- Foveated rendering dynamique\n- Tracking précis\n- Compatibilité PC VR sans fil',
      '🌐 Connectivité\n- WiFi 6E\n- Bluetooth 5.3\n- USB-C\n- PC VR sans fil',
      '🎮 Expérience utilisateur\n- Confort sessions longues\n- Contrôleurs Touch Pro 2\n- Hand tracking avancé\n- Bibliothèque massive\n- Setup facile',
      '🛡️ Garantie et support\n- Garantie constructeur : 1 an\n- Support Meta\n- Mises à jour régulières\n- Communauté active'
    ]
  },
  {
    id: 'prod_71',
    nom: 'apple-macbook-pro-16-m5-ultra',
    categorie: 'PC-GAMING',
    prix: '4999.99 €',
    description: 'Workstation portable ultime avec puce M5 Ultra, écran Liquid Retina XDR et autonomie 24 heures.',
    image: 'macbook-pro-16-m5-ultra.jpg',
    lien: 'fiches/pc-gaming/apple-macbook-pro-16-m5-ultra.html',
    titre_affiche: 'Apple MacBook Pro 16" M5 Ultra',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Processeur : Apple M5 Ultra (32 cœurs CPU)',
      'GPU : 80 cœurs GPU',
      'Neural Engine : 40 cœurs',
      'Mémoire : 128GB RAM unifiée',
      'Stockage : 4TB SSD',
      'Écran : 16.2" Liquid Retina XDR 120Hz',
      'Luminosité : 1600 nits (HDR)',
      'Autonomie : 24 heures',
      '4x Thunderbolt 5',
      'WiFi 7 & 5G option'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Workstation portable ultime\n- Puce M5 Ultra révolutionnaire\n- Écran XDR référence\n- Autonomie 24h',
      '💰 Prix\nPrix de lancement : 4999.99 €',
      '🧩 Spécifications matérielles\n- Processeur : M5 Ultra 32C CPU\n- GPU : 80 cœurs\n- Neural Engine : 40 cœurs\n- RAM : 128GB unifiée\n- Stockage : 4TB SSD\n- Écran : 16.2" XDR 120Hz',
      '🎮 Performances\n- Puissance créative absolue\n- Rendering ultra-rapide\n- Gaming AAA capable\n- Silence absolu',
      '🌐 Connectivité\n- 4x Thunderbolt 5\n- HDMI 2.2\n- SD UHS-III\n- WiFi 7\n- 5G option',
      '🎮 Expérience utilisateur\n- ProMotion 120Hz adaptatif\n- Son spatial 6 HP\n- Touch ID\n- Magic Keyboard\n- Autonomie révolutionnaire',
      '🛡️ Garantie et support\n- Garantie constructeur : 1 an\n- AppleCare+ disponible\n- Support Apple Premium\n- macOS à vie'
    ]
  },
  {
    id: 'prod_72',
    nom: 'bambu-lab-x2-carbon',
    categorie: 'IMPRIMANTE-3D',
    prix: '1799.99 €',
    description: 'Imprimante 3D CoreXY ultra-rapide avec système AMS multicolore 16 matériaux et IA de détection d\'erreurs.',
    image: 'bambu-x2-carbon.jpg',
    lien: 'fiches/imprimante-3d/bambu-lab-x2-carbon.html',
    titre_affiche: 'Bambu Lab X2 Carbon',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Volume : 350 x 350 x 350 mm',
      'Vitesse : Jusqu\'à 1000 mm/s',
      'Précision : ±0.05mm',
      'Extrudeur : Direct drive',
      'Plateau : Chauffant magnétique PEI',
      'Température max : 350°C',
      'AMS 16 matériaux automatique',
      'Détection erreurs par IA',
      'Calibration automatique complète',
      'WiFi 6, Ethernet, USB'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Imprimante 3D ultra-rapide\n- AMS 16 matériaux\n- IA détection erreurs\n- Qualité professionnelle',
      '💰 Prix\nPrix de lancement : 1799.99 €',
      '🧩 Spécifications matérielles\n- Volume : 350x350x350mm\n- Vitesse : 1000mm/s\n- Précision : ±0.05mm\n- Extrudeur : Direct drive\n- Temp max : 350°C\n- Connectivité : WiFi 6, Ethernet',
      '🎮 Performances d\'impression\n- Vitesse exceptionnelle\n- Qualité pro\n- Multi-matériaux automatique\n- Fiabilité maximale',
      '🌐 Connectivité\n- WiFi 6\n- Ethernet\n- USB\n- Streaming 1080p\n- Contrôle à distance',
      '🎮 Expérience utilisateur\n- Caméra streaming 1080p\n- Mode silencieux\n- Reprise après coupure\n- Interface tactile\n- Utilisation simple',
      '🛡️ Garantie et support\n- Garantie constructeur : 1 an\n- Support Bambu Lab\n- Communauté active\n- Mises à jour firmware'
    ]
  },
  {
    id: 'prod_73',
    nom: 'garmin-fenix-8-solar',
    categorie: 'MONTRE-CONNECTEE',
    prix: '999.99 €',
    description: 'Montre multisport premium avec charge solaire, cartographie complète et autonomie 60 jours.',
    image: 'garmin-fenix-8-solar.jpg',
    lien: 'fiches/montre-connectee/garmin-fenix-8-solar.html',
    titre_affiche: 'Garmin Fenix 8 Solar',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Écran : 1.4" AMOLED toujours actif',
      'Boîtier : Titane 47mm',
      'Verre : Power Sapphire solaire',
      'Étanchéité : 10 ATM (100m)',
      'Autonomie : 60 jours smartwatch',
      'Capteurs : Cardio Gen 5, SpO2, Altimètre',
      'Cartographie topoactive préchargée',
      '100+ profils sportifs',
      'Paiement sans contact',
      'Lampe LED intégrée'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Montre multisport premium\n- Charge solaire\n- Cartographie complète\n- Build militaire',
      '💰 Prix\nPrix de lancement : 999.99 €',
      '🧩 Spécifications matérielles\n- Écran : 1.4" AMOLED\n- Boîtier : Titane 47mm\n- Verre : Power Sapphire\n- Étanchéité : 10 ATM\n- Autonomie : 60j (smartwatch)\n- GPS : Multi-bandes',
      '🎮 Fonctionnalités sport\n- 100+ profils sportifs\n- Training readiness\n- GPS multi-bandes précis\n- Métriques avancées',
      '🌐 Connectivité\n- Bluetooth\n- ANT+\n- WiFi\n- LTE option\n- Notifications smart',
      '🎮 Expérience utilisateur\n- Interface intuitive\n- Cartes préchargées\n- Musique stockée 32GB\n- Paiement sans contact\n- Lampe LED\n- SOS & LiveTrack',
      '🔋 Autonomie\n- 60 jours smartwatch\n- 150h GPS\n- Charge solaire\n- Gestion intelligente',
      '🛡️ Garantie et support\n- Garantie constructeur : 2 ans\n- Support Garmin\n- Mises à jour gratuites\n- MIL-STD-810 certifié'
    ]
  },
  {
    id: 'prod_74',
    nom: 'microsoft-surface-hub-3-85',
    categorie: 'TABLEAU-INTERACTIF',
    prix: '12999.99 €',
    description: 'Tableau collaboratif géant 85" 4K tactile avec Windows 11 Team, caméras IA et son spatial.',
    image: 'surface-hub-3-85.jpg',
    lien: 'fiches/tableau-interactif/microsoft-surface-hub-3-85.html',
    titre_affiche: 'Microsoft Surface Hub 3 85"',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Écran : 85" LCD IPS 4K tactile 20 points',
      'Résolution : 3840 x 2160',
      'Processeur : Intel Core i9-14900',
      'GPU : NVIDIA RTX A4000',
      'Mémoire : 64GB DDR5',
      'Stockage : 1TB NVMe',
      'Caméras : Triple 4K avec IA tracking',
      'Son : 6 haut-parleurs + subwoofer',
      'Windows 11 Team Edition',
      'Microsoft Teams natif'
    ],
    donnees_fiche: [
      '📝 Description détaillée\n- Tableau collaboratif géant\n- 85" 4K tactile\n- IA tracking avancé\n- Collaboration hybride ultime',
      '💰 Prix\nPrix de lancement : 12999.99 €',
      '🧩 Spécifications matérielles\n- Écran : 85" 4K tactile 20 points\n- Processeur : Core i9-14900\n- GPU : RTX A4000\n- RAM : 64GB DDR5\n- Stockage : 1TB NVMe\n- Caméras : Triple 4K IA',
      '🎮 Collaboration\n- Windows 11 Team\n- Teams natif\n- Whiteboard IA\n- Framing automatique\n- Annulation bruit avancée',
      '🌐 Connectivité\n- HDMI 2.1\n- DisplayPort\n- USB-C\n- Ethernet 10Gb\n- WiFi 6E',
      '🎮 Expérience utilisateur\n- Tactile 20 points\n- Rotation auto\n- Montage mobile\n- Batterie intégrée\n- Interface intuitive',
      '🛡️ Garantie et support\n- Garantie constructeur : 3 ans\n- Support Microsoft Premier\n- Mises à jour Windows\n- Service entreprise'
    ]
  }
];

async function addProducts() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Début de l\'insertion des produits de Janvier 2026...\n');
    
    for (const produit of produitsJanvier2026) {
      console.log(`📦 Insertion de ${produit.titre_affiche}...`);
      
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
            titre_affiche = $8,
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
          produit.titre_affiche,
          produit.fonctionnalites_avancees,
          produit.donnees_fiche,
          produit.id
        ]);
        
        console.log(`   ✅ Produit ${produit.id} mis à jour`);
      } else {
        const insertQuery = `
          INSERT INTO produits (
            id, nom, categorie, prix, description, image, lien, 
            top_du_mois, titre_affiche, fonctionnalites_avancees, donnees_fiche
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
          produit.titre_affiche,
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
    topProducts.forEach(p => console.log(`   - ${p.titre_affiche} (${p.categorie})`));
    
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
