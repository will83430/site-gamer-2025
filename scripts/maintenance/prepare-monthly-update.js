/**
 * 📅 SCRIPT DE PRÉPARATION MISE À JOUR MENSUELLE
 * 
 * Ce script aide à préparer une mise à jour mensuelle complète du site.
 * Il génère les templates de scripts et vérifie l'état actuel de la base.
 * 
 * Usage: node scripts/maintenance/prepare-monthly-update.js [mois] [annee]
 * Exemple: node scripts/maintenance/prepare-monthly-update.js fevrier 2026
 */

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration base de données
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'gamer_2025',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Mapping des catégories
const CATEGORIES = {
  1: { nom: 'PC Gaming', slug: 'pc-gaming', priorite: 'haute' },
  2: { nom: 'Drone', slug: 'drone', priorite: 'moyenne' },
  3: { nom: 'Smartphone', slug: 'smartphone', priorite: 'haute' },
  4: { nom: 'Console', slug: 'console', priorite: 'haute' },
  5: { nom: 'Tablette', slug: 'tablette', priorite: 'moyenne' },
  6: { nom: 'Casque Audio', slug: 'casque-audio', priorite: 'moyenne' },
  7: { nom: 'Montre Connectée', slug: 'montre-connectee', priorite: 'moyenne' },
  8: { nom: 'Serveur', slug: 'serveur', priorite: 'basse' },
  9: { nom: 'Box Internet', slug: 'box-internet', priorite: 'basse' },
  10: { nom: 'Caméra', slug: 'camera', priorite: 'moyenne' },
  11: { nom: 'Casque VR', slug: 'casque-vr', priorite: 'haute' },
  12: { nom: 'Écran TV', slug: 'ecran-tv', priorite: 'moyenne' },
  13: { nom: 'Imprimante 3D', slug: 'imprimante-3d', priorite: 'basse' },
  14: { nom: 'Périphériques', slug: 'peripheriques', priorite: 'moyenne' },
  15: { nom: 'Tableau Interactif', slug: 'tableau-interactif', priorite: 'basse' },
  16: { nom: 'Vidéo Projecteur', slug: 'video-projecteur', priorite: 'basse' },
};

// Arguments - Mois par défaut : mois actuel ou suivant
const MOIS_NOMS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin',
                   'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
const now = new Date();
const moisDefaut = MOIS_NOMS[now.getMonth()];
const anneeDefaut = now.getFullYear().toString();

const mois = process.argv[2] || moisDefaut;
const annee = process.argv[3] || anneeDefaut;

/**
 * Convertit le nom du mois en numéro (01-12)
 */
function getMoisNumero(nomMois) {
  const moisMap = {
    'janvier': '01', 'fevrier': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'aout': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'decembre': '12'
  };
  return moisMap[nomMois.toLowerCase()] || '01';
}

console.log('\n🚀 PRÉPARATION MISE À JOUR MENSUELLE');
console.log(`📅 Mois cible: ${mois} ${annee}\n`);

/**
 * Récupère le dernier ID produit
 */
async function getDernierIdProduit() {
  try {
    const result = await pool.query(`
      SELECT id FROM produits 
      ORDER BY CAST(SUBSTRING(id FROM 'prod_([0-9]+)') AS INTEGER) DESC 
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      return 'prod_0';
    }
    
    return result.rows[0].id;
  } catch (error) {
    console.error('❌ Erreur récupération dernier ID:', error.message);
    return 'prod_0';
  }
}

/**
 * Génère les prochains IDs produits
 */
function genererProchainIDs(dernierID, quantite = 12) {
  const numero = parseInt(dernierID.replace('prod_', ''));
  const ids = [];
  
  for (let i = 1; i <= quantite; i++) {
    ids.push(`prod_${numero + i}`);
  }
  
  return ids;
}

/**
 * Compte les entrées par type de contenu
 * Gère les tables qui peuvent ne pas exister
 */
async function getStatistiquesContenu() {
  const stats = {
    produits: 0,
    actualites: 0,
    technologies: 0,
    marche: 0,
    insights: 0,
    predictions: 0,
    categories: 0
  };

  const queries = [
    { key: 'produits', sql: 'SELECT COUNT(*) FROM produits' },
    { key: 'actualites', sql: 'SELECT COUNT(*) FROM actualites' },
    { key: 'technologies', sql: 'SELECT COUNT(*) FROM technologies' },
    { key: 'marche', sql: 'SELECT COUNT(*) FROM marche' },
    { key: 'insights', sql: 'SELECT COUNT(*) FROM insights' },
    { key: 'predictions', sql: 'SELECT COUNT(*) FROM predictions' },
    { key: 'categories', sql: 'SELECT COUNT(*) FROM categories' }
  ];

  for (const query of queries) {
    try {
      const result = await pool.query(query.sql);
      stats[query.key] = parseInt(result.rows[0].count);
    } catch (error) {
      // Table n'existe pas, on laisse à 0
      console.warn(`   ⚠️ Table ${query.key} non trouvée`);
    }
  }

  return stats;
}

/**
 * Génère le template de script produits
 */
function genererTemplateScriptProduits(mois, annee, prochainIDs) {
  return `/**
 * Script d'ajout des produits de ${mois.charAt(0).toUpperCase() + mois.slice(1)} ${annee}
 * Insère 12 nouveaux produits innovants
 *
 * PRODUITS PRÉ-REMPLIS - PRÊTS À ÊTRE INSÉRÉS
 */

require('dotenv').config();
const { Pool } = require('pg');
const { execSync } = require('child_process');
const path = require('path');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ============================================================================
// 12 PRODUITS DE ${mois.toUpperCase()} ${annee} (${prochainIDs[0]} à ${prochainIDs[11]})
// ============================================================================

const produits${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee} = [

  // ============================================================================
  // PRODUIT 1 : NVIDIA GeForce RTX 5090 Founders Edition
  // ============================================================================
  {
    id: '${prochainIDs[0]}',
    nom: 'nvidia-geforce-rtx-5090-fe',
    categorie: 'PC GAMING',
    prix: '2 199.00 €',
    description: 'La carte graphique ultime pour le gaming 8K. Architecture Blackwell, 32 Go GDDR7, DLSS 4.0 et ray tracing 5ème génération.',
    image: 'rtx-5090-fe.jpg',
    lien: 'fiches/pc-gaming/nvidia-geforce-rtx-5090-fe.html',
    titre_affiche: 'NVIDIA GeForce RTX 5090 Founders Edition',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Architecture NVIDIA Blackwell',
      '32 Go GDDR7 à 28 Gbps',
      'Bus mémoire 512 bits',
      '21 760 CUDA Cores',
      'RT Cores 5ème génération',
      'Tensor Cores 5ème génération',
      'DLSS 4.0 Multi-Frame Generation',
      'Reflex 2.0 ultra-basse latence',
      'PCIe 5.0 x16',
      'TDP 450W',
      '3x DisplayPort 2.1, 1x HDMI 2.1a',
      'Support 8K 60Hz / 4K 240Hz',
      'AV1 encode/decode hardware',
      'Refroidissement vapor chamber'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Carte graphique flagship NVIDIA pour le gaming 8K\\n- Architecture Blackwell révolutionnaire\\n- Performances 70% supérieures à la RTX 4090\\n- Ray tracing en temps réel sans compromis',
      '💰 Prix\\nPrix : 2 199.00 €\\nDisponibilité : Janvier 2026',
      '🧩 Spécifications matérielles\\n- GPU : NVIDIA Blackwell GB202\\n- VRAM : 32 Go GDDR7\\n- Bus : 512 bits\\n- Bandwidth : 1.8 To/s',
      '🎮 Performances\\n- 8K Gaming : 60+ FPS avec DLSS\\n- 4K Gaming : 200+ FPS\\n- Ray Tracing : 2x RTX 4090\\n- Score 3DMark : 45000+',
      '🌐 Connectivité\\n- 3x DisplayPort 2.1 UHBR20\\n- 1x HDMI 2.1a\\n- PCIe 5.0 x16',
      '🎮 Expérience utilisateur\\n- NVIDIA App intégré\\n- GeForce Experience\\n- Broadcast & Studio drivers',
      '🛡️ Garantie et support\\n- Garantie : 3 ans\\n- Support NVIDIA premium'
    ]
  },

  // ============================================================================
  // PRODUIT 2 : AMD Ryzen 9 9950X3D
  // ============================================================================
  {
    id: '${prochainIDs[1]}',
    nom: 'amd-ryzen-9-9950x3d',
    categorie: 'PC GAMING',
    prix: '699.00 €',
    description: 'Le processeur gaming ultime avec 3D V-Cache de 2ème génération. 16 cœurs Zen 5, 144 Mo de cache L3 total.',
    image: 'ryzen-9-9950x3d.jpg',
    lien: 'fiches/pc-gaming/amd-ryzen-9-9950x3d.html',
    titre_affiche: 'AMD Ryzen 9 9950X3D',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Architecture AMD Zen 5',
      '16 cœurs / 32 threads',
      'Fréquence boost 5.7 GHz',
      '3D V-Cache 2ème génération',
      '144 Mo cache L3 total',
      'TDP 120W',
      'Socket AM5',
      'Support DDR5-6400',
      'PCIe 5.0 (28 lanes)',
      'Gravure TSMC 4nm',
      'AMD EXPO support',
      'Precision Boost Overdrive 3'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Processeur gaming haute performance AMD\\n- Technologie 3D V-Cache révolutionnaire\\n- Leader incontesté en gaming\\n- Excellent en productivité',
      '💰 Prix\\nPrix : 699.00 €\\nDisponibilité : Février 2026',
      '🧩 Spécifications matérielles\\n- Cœurs : 16 (Zen 5)\\n- Threads : 32\\n- Cache L3 : 144 Mo\\n- TDP : 120W',
      '🎮 Performances\\n- Gaming 1080p : +25% vs 7950X3D\\n- Productivité : +40% vs 7950X3D\\n- Latence cache : Ultra-basse',
      '🌐 Connectivité\\n- DDR5-6400 native\\n- PCIe 5.0 x16 GPU\\n- PCIe 5.0 x4 NVMe',
      '🎮 Expérience utilisateur\\n- AMD Ryzen Master\\n- Curve Optimizer\\n- PBO 3 automatique',
      '🛡️ Garantie et support\\n- Garantie : 3 ans\\n- Support AMD premium'
    ]
  },

  // ============================================================================
  // PRODUIT 3 : Apple iPhone 18 Pro Max
  // ============================================================================
  {
    id: '${prochainIDs[2]}',
    nom: 'apple-iphone-18-pro-max',
    categorie: 'SMARTPHONE',
    prix: '1 599.00 €',
    description: 'Le smartphone le plus avancé d\\'Apple. Puce A20 Bionic en 2nm, capteur 48 MP amélioré et Apple Intelligence.',
    image: 'iphone-18-pro-max.jpg',
    lien: 'fiches/smartphone/apple-iphone-18-pro-max.html',
    titre_affiche: 'Apple iPhone 18 Pro Max',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'Puce A20 Bionic (2nm)',
      'Écran Super Retina XDR 6.9\\'\\' ProMotion',
      'Luminosité 3000 nits HDR',
      'Capteur principal 48 MP amélioré',
      'Ultra grand-angle 48 MP',
      'Téléobjectif 5x optique',
      'Enregistrement vidéo 8K',
      'Apple Intelligence on-device',
      'Face ID nouvelle génération',
      'USB-C Thunderbolt 5',
      'Batterie 4800 mAh',
      'Charge rapide 45W',
      'MagSafe 25W',
      'Titane Grade 5'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Smartphone flagship Apple 2026\\n- Puce A20 la plus puissante du marché\\n- Système photo pro révolutionné\\n- Apple Intelligence intégré',
      '💰 Prix\\nPrix : 1 599.00 € (256 Go)\\nDisponibilité : Septembre 2026',
      '🧩 Spécifications matérielles\\n- SoC : A20 Bionic 2nm\\n- RAM : 12 Go\\n- Stockage : 256 Go - 2 To\\n- Écran : 6.9\\'\\' OLED 120Hz',
      '🎮 Performances\\n- Antutu : 2.5M+\\n- NPU : 45 TOPS\\n- GPU : 50% plus rapide\\n- Autonomie : 2 jours',
      '🌐 Connectivité\\n- 5G Sub-6 + mmWave\\n- WiFi 7\\n- Bluetooth 5.4\\n- Satellite bidirectionnel',
      '🎮 Expérience utilisateur\\n- iOS 20\\n- Apple Intelligence\\n- Dynamic Island amélioré',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- AppleCare+ disponible'
    ]
  },

  // ============================================================================
  // PRODUIT 4 : OnePlus 14 Pro
  // ============================================================================
  {
    id: '${prochainIDs[3]}',
    nom: 'oneplus-14-pro',
    categorie: 'SMARTPHONE',
    prix: '1 099.00 €',
    description: 'Le flagship OnePlus avec charge 300W en 5 minutes. Snapdragon 8 Gen 4, écran LTPO 4.0 et partenariat Hasselblad.',
    image: 'oneplus-14-pro.jpg',
    lien: 'fiches/smartphone/oneplus-14-pro.html',
    titre_affiche: 'OnePlus 14 Pro',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Snapdragon 8 Gen 4',
      'Écran AMOLED LTPO 4.0 6.8\\'\\' 2K',
      'Refresh rate 1-144Hz adaptatif',
      'Charge SuperVOOC 300W',
      '0-100% en 5 minutes',
      'Batterie 6000 mAh silicone-carbone',
      'Triple caméra Hasselblad',
      'Capteur principal 64 MP 1\\'\\' type',
      'Ultra grand-angle 50 MP',
      'Périscope 64 MP 3x',
      'OxygenOS 15',
      'WiFi 7, Bluetooth 5.4',
      'Alert Slider nouvelle génération'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Flagship OnePlus 2026\\n- Charge la plus rapide du marché\\n- Partenariat Hasselblad approfondi\\n- Performances de pointe',
      '💰 Prix\\nPrix : 1 099.00 €\\nDisponibilité : Mars 2026',
      '🧩 Spécifications matérielles\\n- SoC : Snapdragon 8 Gen 4\\n- RAM : 16 Go LPDDR5X\\n- Stockage : 256-512 Go UFS 4.0\\n- Batterie : 6000 mAh',
      '🎮 Performances\\n- Charge : 5 min 0-100%\\n- 1600 cycles à 90%\\n- Antutu : 2.3M+',
      '🌐 Connectivité\\n- 5G SA/NSA\\n- WiFi 7\\n- Bluetooth 5.4\\n- NFC',
      '🎮 Expérience utilisateur\\n- OxygenOS 15\\n- 5 ans MAJ Android\\n- 6 ans MAJ sécurité',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- Support OnePlus Care'
    ]
  },

  // ============================================================================
  // PRODUIT 5 : Microsoft Xbox Series Y
  // ============================================================================
  {
    id: '${prochainIDs[4]}',
    nom: 'microsoft-xbox-series-y',
    categorie: 'CONSOLE',
    prix: '599.00 €',
    description: 'La nouvelle génération Xbox avec architecture cloud-hybride. Jeu local 4K/120fps et streaming 8K natif.',
    image: 'xbox-series-y.jpg',
    lien: 'fiches/console/microsoft-xbox-series-y.html',
    titre_affiche: 'Microsoft Xbox Series Y',
    top_du_mois: true,
    fonctionnalites_avancees: [
      'CPU AMD Zen 5 custom 12 cœurs',
      'GPU RDNA 4 custom 18 TFLOPs',
      'RAM 24 Go GDDR7',
      'SSD NVMe 2 To (15 Go/s)',
      'Architecture cloud-hybride',
      'Jeu local 4K/120fps',
      'Streaming cloud 8K natif',
      'Ray tracing hardware complet',
      'DirectX 13 Ultimate',
      'Quick Resume amélioré',
      'Rétrocompatibilité totale Xbox',
      'Game Pass Ultimate inclus 1 an',
      'Dolby Vision & Atmos',
      'WiFi 7 intégré'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Console next-gen Microsoft\\n- Première console cloud-hybride\\n- Game Pass au cœur de l\\'expérience\\n- Rétrocompatibilité 4 générations',
      '💰 Prix\\nPrix : 599.00 €\\nDisponibilité : Novembre 2026',
      '🧩 Spécifications matérielles\\n- CPU : AMD Zen 5 12 cœurs\\n- GPU : RDNA 4 18 TFLOPs\\n- RAM : 24 Go GDDR7\\n- SSD : 2 To NVMe',
      '🎮 Performances\\n- Local : 4K/120fps\\n- Cloud : 8K/60fps\\n- Ray Tracing : Natif\\n- Latence : < 10ms cloud',
      '🌐 Connectivité\\n- HDMI 2.1\\n- USB-C 4.0\\n- WiFi 7\\n- Ethernet 2.5G',
      '🎮 Expérience utilisateur\\n- Xbox OS nouvelle génération\\n- Game Pass Ultimate\\n- Cross-play universel',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- Xbox Support 24/7'
    ]
  },

  // ============================================================================
  // PRODUIT 6 : Valve Steam Deck 2
  // ============================================================================
  {
    id: '${prochainIDs[5]}',
    nom: 'valve-steam-deck-2',
    categorie: 'CONSOLE',
    prix: '549.00 €',
    description: 'La console portable PC ultime. APU AMD custom 7nm, écran OLED 120Hz et performances doublées.',
    image: 'steam-deck-2.jpg',
    lien: 'fiches/console/valve-steam-deck-2.html',
    titre_affiche: 'Valve Steam Deck 2',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'APU AMD custom 7nm (Zen 4 + RDNA 3.5)',
      'CPU 8 cœurs / 16 threads',
      'GPU 12 CUs RDNA 3.5',
      'RAM 32 Go LPDDR5X',
      'Écran OLED 7.4\\'\\' 1200p 120Hz',
      'HDR 1000 nits',
      'SSD NVMe 1 To (remplaçable)',
      'Batterie 65 Wh',
      'Autonomie 4-8 heures',
      'Charge 65W USB-C PD',
      'WiFi 6E, Bluetooth 5.3',
      'Trackpads haptiques améliorés',
      'Gyroscope précision pro',
      'SteamOS 4.0'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Console portable Valve 2ème génération\\n- Performances doublées vs Steam Deck 1\\n- Écran OLED magnifique\\n- Toute la bibliothèque Steam',
      '💰 Prix\\nPrix : 549.00 € (1 To)\\nDisponibilité : Q2 2026',
      '🧩 Spécifications matérielles\\n- APU : AMD custom 7nm\\n- RAM : 32 Go LPDDR5X\\n- SSD : 1 To NVMe\\n- Écran : 7.4\\'\\' OLED 120Hz',
      '🎮 Performances\\n- AAA 1080p : 60+ fps\\n- Indie/AA : 120 fps\\n- Autonomie : 4-8h\\n- TDP : 15-30W',
      '🌐 Connectivité\\n- WiFi 6E\\n- Bluetooth 5.3\\n- USB-C 4.0\\n- MicroSD UHS-II',
      '🎮 Expérience utilisateur\\n- SteamOS 4.0\\n- Steam Input\\n- Proton optimisé',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- Steam Support'
    ]
  },

  // ============================================================================
  // PRODUIT 7 : Sony PlayStation VR 3
  // ============================================================================
  {
    id: '${prochainIDs[6]}',
    nom: 'sony-playstation-vr3',
    categorie: 'CASQUE VR',
    prix: '599.00 €',
    description: 'Le casque VR next-gen pour PS6. Résolution 4K par œil, eye tracking et titres exclusifs Sony.',
    image: 'psvr3.jpg',
    lien: 'fiches/casque-vr/sony-playstation-vr3.html',
    titre_affiche: 'Sony PlayStation VR 3',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Résolution 4K par œil (4000x4000)',
      'Écrans OLED HDR',
      'Refresh rate 90/120Hz',
      'Champ de vision 120°',
      'Eye tracking intégré',
      'Rendu fovéal dynamique',
      'Audio 3D Tempest intégré',
      'Inside-out tracking 6DoF',
      'Contrôleurs Sense nouvelle génération',
      'Retour haptique avancé',
      'Compatible PS6 uniquement',
      'Exclusivités : Gran Turismo VR, Horizon VR',
      'Connexion unique USB-C',
      'Passthrough couleur'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Casque VR officiel PlayStation 6\\n- Expérience VR premium Sony\\n- Exclusivités AAA en VR\\n- Technologie eye tracking avancée',
      '💰 Prix\\nPrix : 599.00 €\\nDisponibilité : Décembre 2026',
      '🧩 Spécifications matérielles\\n- Résolution : 4K par œil\\n- Écrans : OLED HDR\\n- FOV : 120°\\n- Refresh : 90/120Hz',
      '🎮 Performances\\n- Eye tracking : Rendu fovéal\\n- Latence : < 10ms\\n- Audio : 3D Tempest\\n- Haptique : Sense avancé',
      '🌐 Connectivité\\n- USB-C unique vers PS6\\n- Sans fil optionnel (add-on)',
      '🎮 Expérience utilisateur\\n- PlayStation VR2 compatible\\n- Titres exclusifs Sony\\n- Social VR PlayStation',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- PlayStation Support'
    ]
  },

  // ============================================================================
  // PRODUIT 8 : Varjo XR-5
  // ============================================================================
  {
    id: '${prochainIDs[7]}',
    nom: 'varjo-xr5',
    categorie: 'CASQUE VR',
    prix: '4 990.00 €',
    description: 'Le casque XR professionnel ultime. Résolution humaine 70 PPD, passthrough 8K stéréo et précision industrielle.',
    image: 'varjo-xr5.jpg',
    lien: 'fiches/casque-vr/varjo-xr5.html',
    titre_affiche: 'Varjo XR-5',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Résolution humaine 70 PPD',
      'Affichage Bionic dual-display',
      'Zone focus 2560x2560 par œil',
      'Zone périphérique 2880x2720',
      'Passthrough 8K stéréo',
      'Latence passthrough < 10ms',
      'Eye tracking 200Hz',
      'Champ de vision 115°',
      'LiDAR intégré',
      'Compatible SteamVR & OpenXR',
      'Casque audio 3D intégré',
      'Certification industrielle',
      'SDK professionnel',
      'Support entreprise'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Casque XR professionnel haut de gamme\\n- Résolution œil humain inégalée\\n- Réalité mixte parfaite\\n- Applications industrielles et créatives',
      '💰 Prix\\nPrix : 4 990.00 €\\nDisponibilité : Q1 2026',
      '🧩 Spécifications matérielles\\n- Résolution : 70 PPD (humain)\\n- Passthrough : 8K stéréo\\n- Eye tracking : 200Hz\\n- FOV : 115°',
      '🎮 Performances\\n- Clarté : Niveau lecture texte\\n- Passthrough : Photoréaliste\\n- Précision : < 1° eye tracking',
      '🌐 Connectivité\\n- DisplayPort 1.4\\n- USB 3.0\\n- Tracking externe optionnel',
      '🎮 Expérience utilisateur\\n- Varjo Base\\n- SteamVR compatible\\n- OpenXR natif',
      '🛡️ Garantie et support\\n- Garantie : 2 ans entreprise\\n- Support Varjo dédié'
    ]
  },

  // ============================================================================
  // PRODUIT 9 : DJI Air 4
  // ============================================================================
  {
    id: '${prochainIDs[8]}',
    nom: 'dji-air-4',
    categorie: 'DRONE',
    prix: '1 099.00 €',
    description: 'Le drone compact ultime. Capteur 1 pouce, vidéo 6K/60fps et détection d\\'obstacles omnidirectionnelle.',
    image: 'dji-air-4.jpg',
    lien: 'fiches/drone/dji-air-4.html',
    titre_affiche: 'DJI Air 4',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Capteur CMOS 1 pouce 50 MP',
      'Vidéo 6K/60fps, 4K/120fps',
      'D-Log M & HLG HDR',
      'Détection obstacles 360° (12 capteurs)',
      'APAS 6.0 évitement intelligent',
      'Transmission O4 (20 km, 1080p/120fps)',
      'Autonomie 46 minutes',
      'Vitesse max 75 km/h',
      'Résistance vent niveau 6',
      'Poids 720g',
      'ActiveTrack 6.0',
      'MasterShots amélioré',
      'Waypoints avancés',
      'Return to Home intelligent'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Drone compact premium DJI\\n- Qualité d\\'image professionnelle\\n- Sécurité de vol maximale\\n- Idéal créateurs et voyageurs',
      '💰 Prix\\nPrix : 1 099.00 €\\nDisponibilité : Avril 2026',
      '🧩 Spécifications matérielles\\n- Capteur : 1 pouce 50 MP\\n- Vidéo : 6K/60fps\\n- Autonomie : 46 min\\n- Portée : 20 km',
      '🎮 Performances\\n- Détection : 360° omnidirectionnel\\n- Transmission : O4 120fps\\n- Vent : Niveau 6\\n- Précision hover : ±0.1m',
      '🌐 Connectivité\\n- RC Pro compatible\\n- WiFi Direct\\n- DJI Fly app',
      '🎮 Expérience utilisateur\\n- ActiveTrack 6.0\\n- MasterShots\\n- Hyperlapse',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- DJI Care Refresh dispo'
    ]
  },

  // ============================================================================
  // PRODUIT 10 : Sony WH-1000XM6
  // ============================================================================
  {
    id: '${prochainIDs[9]}',
    nom: 'sony-wh-1000xm6',
    categorie: 'CASQUE AUDIO',
    prix: '429.00 €',
    description: 'Le roi de l\\'ANC nouvelle génération. Réduction de bruit IA adaptative et codec LC3plus lossless.',
    image: 'sony-wh-1000xm6.jpg',
    lien: 'fiches/casque-audio/sony-wh-1000xm6.html',
    titre_affiche: 'Sony WH-1000XM6',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Processeur V2 amélioré',
      'ANC adaptatif IA temps réel',
      'Drivers 40mm nouvelle génération',
      'Codec LC3plus lossless Bluetooth',
      'LDAC 990 kbps',
      '360 Reality Audio amélioré',
      'DSEE Extreme AI upscaling',
      'Multipoint 3 appareils',
      'Autonomie 40h (ANC on)',
      'Charge rapide 3 min = 3h',
      'Speak-to-Chat amélioré',
      'Quick Attention',
      'Audio spatial personnalisé',
      'Poids 250g'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Casque premium Sony 6ème génération\\n- Meilleur ANC du marché\\n- Audio Hi-Res sans fil\\n- Confort longue durée',
      '💰 Prix\\nPrix : 429.00 €\\nDisponibilité : Septembre 2026',
      '🧩 Spécifications matérielles\\n- Drivers : 40mm\\n- ANC : V2 AI\\n- Codecs : LC3plus, LDAC\\n- Autonomie : 40h',
      '🎮 Performances\\n- ANC : -45 dB\\n- Réponse : 4Hz-80kHz\\n- THD : < 0.05%',
      '🌐 Connectivité\\n- Bluetooth 5.4\\n- Multipoint 3 devices\\n- NFC\\n- USB-C audio',
      '🎮 Expérience utilisateur\\n- Sony Headphones Connect\\n- 360 Reality Audio\\n- Speak-to-Chat',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- Support Sony'
    ]
  },

  // ============================================================================
  // PRODUIT 11 : Apple Watch Series 11
  // ============================================================================
  {
    id: '${prochainIDs[10]}',
    nom: 'apple-watch-series-11',
    categorie: 'MONTRE CONNECTEE',
    prix: '499.00 €',
    description: 'La montre connectée révolutionnaire avec capteur glycémie non-invasif. Puce S11 et watchOS 13.',
    image: 'apple-watch-series-11.jpg',
    lien: 'fiches/montre-connectee/apple-watch-series-11.html',
    titre_affiche: 'Apple Watch Series 11',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Puce S11 avec Neural Engine',
      'Capteur glycémie non-invasif',
      'ECG avancé (fibrillation)',
      'Oxymètre de pouls continu',
      'Température corporelle continue',
      'Écran LTPO 4.0 Always-On',
      'Luminosité 3000 nits',
      'Autonomie 48h standard',
      'Charge rapide 30 min = 80%',
      'watchOS 13',
      'Double tap amélioré',
      'Détection chute/accident',
      'SOS satellite',
      'Boîtier titane recyclé'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Montre connectée Apple 2026\\n- Première avec glycémie non-invasive\\n- Suivi santé le plus complet\\n- Design premium titane',
      '💰 Prix\\nPrix : 499.00 € (45mm GPS)\\nDisponibilité : Septembre 2026',
      '🧩 Spécifications matérielles\\n- SoC : S11\\n- Écran : LTPO 4.0\\n- Autonomie : 48h\\n- Étanchéité : 50m',
      '🎮 Performances\\n- Glycémie : ±10mg/dL précision\\n- ECG : Certifié médical\\n- GPS : Double fréquence',
      '🌐 Connectivité\\n- Bluetooth 5.4\\n- WiFi 6\\n- Ultra Wideband 2\\n- LTE optionnel',
      '🎮 Expérience utilisateur\\n- watchOS 13\\n- Apple Intelligence\\n- Siri amélioré',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- AppleCare+ disponible'
    ]
  },

  // ============================================================================
  // PRODUIT 12 : Apple iPad Pro M5 13"
  // ============================================================================
  {
    id: '${prochainIDs[11]}',
    nom: 'apple-ipad-pro-m5-13',
    categorie: 'TABLETTE',
    prix: '1 499.00 €',
    description: 'La tablette la plus puissante au monde. Puce M5, écran OLED tandem Ultra Retina XDR et Thunderbolt 5.',
    image: 'ipad-pro-m5-13.jpg',
    lien: 'fiches/tablette/apple-ipad-pro-m5-13.html',
    titre_affiche: 'Apple iPad Pro M5 13\\'\\' ',
    top_du_mois: false,
    fonctionnalites_avancees: [
      'Puce Apple M5 (12 cœurs CPU, 20 GPU)',
      'Neural Engine 18 cœurs',
      'Écran OLED tandem 13\\'\\' Ultra Retina XDR',
      'ProMotion 10-120Hz',
      'Luminosité SDR 2000 nits',
      'Luminosité HDR 3000 nits',
      'Thunderbolt 5 (120 Gbps)',
      'WiFi 7',
      'Face ID nouvelle génération',
      'Apple Pencil Pro 2 support',
      'Magic Keyboard compatible',
      'iPadOS 20',
      'Apple Intelligence',
      'Épaisseur 5.1mm'
    ],
    donnees_fiche: [
      '📝 Description détaillée\\n- Tablette professionnelle Apple\\n- Performances niveau MacBook Pro\\n- Écran OLED le plus avancé\\n- Créativité sans limites',
      '💰 Prix\\nPrix : 1 499.00 € (256 Go)\\nDisponibilité : Mai 2026',
      '🧩 Spécifications matérielles\\n- SoC : M5 12 cœurs\\n- RAM : 16/32 Go\\n- Stockage : 256 Go - 2 To\\n- Écran : 13\\'\\' OLED 120Hz',
      '🎮 Performances\\n- Geekbench SC : 4000+\\n- Geekbench MC : 18000+\\n- GPU : Pro-level\\n- NPU : 45 TOPS',
      '🌐 Connectivité\\n- Thunderbolt 5\\n- WiFi 7\\n- Bluetooth 5.4\\n- 5G optionnel',
      '🎮 Expérience utilisateur\\n- iPadOS 20\\n- Stage Manager avancé\\n- Apple Intelligence',
      '🛡️ Garantie et support\\n- Garantie : 2 ans\\n- AppleCare+ disponible'
    ]
  }

];

async function ajouterProduits() {
  const client = await pool.connect();
  
  try {
    console.log('\\n🚀 Ajout des produits ${mois} ${annee}...\\n');
    
    for (const produit of produits${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee}) {
      await client.query(\`
        INSERT INTO produits (
          id, nom, categorie, prix, description, image, lien,
          titre_affiche, top_du_mois, fonctionnalites_avancees, donnees_fiche
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      \`, [
        produit.id,
        produit.nom,
        produit.categorie,
        produit.prix,
        produit.description,
        produit.image,
        produit.lien,
        produit.titre_affiche,
        produit.top_du_mois,
        produit.fonctionnalites_avancees,
        produit.donnees_fiche
      ]);
      
      console.log(\`✅ \${produit.id} - \${produit.titre_affiche}\`);
    }
    
    console.log(\`\\n✨ \${produits${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee}.length} produits ajoutés avec succès!\\n\`);

    // Génération automatique des fiches HTML
    console.log('📄 Génération des fiches HTML pour les nouveaux produits...\\n');
    try {
      const scriptPath = path.join(__dirname, '..', 'fiches', 'quick-regenerate-fiches.js');
      execSync(\`node "\${scriptPath}"\`, { stdio: 'inherit' });
      console.log('\\n✅ Fiches HTML générées avec succès!');
    } catch (ficheError) {
      console.error('\\n⚠️ Erreur lors de la génération des fiches:', ficheError.message);
      console.log('   Vous pouvez les générer manuellement avec: node scripts/fiches/quick-regenerate-fiches.js');
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\\'ajout des produits:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

ajouterProduits();
`;
}

/**
 * Génère le template de script contenu éditorial
 */
function genererTemplateScriptContenu(mois, annee) {
  const moisNum = getMoisNumero(mois);

  return `/**
 * Script d'ajout du contenu éditorial de ${mois.charAt(0).toUpperCase() + mois.slice(1)} ${annee}
 * Actualités, technologies, marché, insights et prédictions
 *
 * CONTENU COMPLET POUR LES 16 CATÉGORIES
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

// ============================================================================
// CONTENU PAR CATÉGORIE - STRUCTURE CONFORME À LA BDD
// ============================================================================

const contenu${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee} = {

  // ============================================================================
  // CATÉGORIE 1 : PC GAMING
  // ============================================================================
  1: {
    actualites: [
      {
        titre: 'NVIDIA GeForce RTX 5090 : benchmark record en 8K',
        description: 'La nouvelle GeForce RTX 5090 de NVIDIA pulvérise tous les records de performance en gaming 8K. Equipée de 32 Go de GDDR7 et de la nouvelle architecture Blackwell, la carte affiche des performances 70% supérieures à la RTX 4090 tout en consommant seulement 450W. Les premiers tests en ray tracing montrent des gains impressionnants grâce aux nouveaux RT Cores de 5ème génération.',
        image: 'rtx-5090-benchmark.jpg',
        video_url: 'https://youtube.com/embed/example1',
        date_publication: '${annee}-${moisNum}-05',
        tags: ['nvidia', 'rtx5090', 'benchmark', '8k'],
        hot: true,
        categorie_id: 1,
        lien: null,
        ordre: 1
      },
      {
        titre: 'AMD Ryzen 9 9950X3D : le nouveau roi du gaming',
        description: 'AMD lance le Ryzen 9 9950X3D avec sa technologie 3D V-Cache améliorée. Le processeur dispose de 144 Mo de cache L3 total et atteint des fréquences boost de 5.7 GHz. Les tests en gaming montrent une avance de 15% sur Intel Core Ultra 9 285K dans les titres les plus exigeants.',
        image: 'ryzen-9950x3d.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-10',
        tags: ['amd', 'ryzen', '3dvcache', 'cpu'],
        hot: true,
        categorie_id: 1,
        lien: null,
        ordre: 2
      },
      {
        titre: 'DDR6 : les premiers kits gaming arrivent',
        description: 'Corsair et G.Skill annoncent leurs premiers kits DDR6 pour le gaming. Avec des vitesses atteignant 12800 MT/s et une latence CAS de 28, la nouvelle génération de RAM promet des gains significatifs en bande passante. Les prix débutent à 399€ pour 32 Go.',
        image: 'ddr6-gaming.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-15',
        tags: ['ddr6', 'ram', 'corsair', 'gskill'],
        hot: false,
        categorie_id: 1,
        lien: null,
        ordre: 3
      },
      {
        titre: 'PCIe 6.0 : les premières cartes mères compatibles',
        description: 'ASUS et MSI présentent leurs cartes mères PCIe 6.0. Cette nouvelle norme double la bande passante à 128 GT/s par lane, permettant des SSD NVMe atteignant 25 Go/s en lecture séquentielle.',
        image: 'pcie6-motherboard.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-20',
        tags: ['pcie6', 'motherboard', 'asus', 'msi'],
        hot: false,
        categorie_id: 1,
        lien: null,
        ordre: 4
      }
    ],
    technologies: [
      {
        nom: 'DLSS 4.0 Multi-Frame Generation',
        description: 'La technologie DLSS 4.0 de NVIDIA génère désormais jusqu\\'à 3 frames interpolées pour chaque frame rendue, permettant de multiplier par 4 le framerate effectif. Couplée à l\\'upscaling neural amélioré, elle permet de jouer en 8K à plus de 120 FPS.',
        icone: 'chip',
        taux_adoption: 45,
        categorie_id: 1,
        ordre: 1
      },
      {
        nom: 'Intel Arc Battlemage',
        description: 'La 2ème génération d\\'architecture GPU Intel apporte le ray tracing de nouvelle génération et une efficacité énergétique améliorée de 40%. Les drivers matures offrent enfin des performances compétitives.',
        icone: 'cpu',
        taux_adoption: 25,
        categorie_id: 1,
        ordre: 2
      },
      {
        nom: 'Refroidissement liquide AIO 480mm',
        description: 'Les nouvelles solutions AIO 480mm deviennent le standard pour les processeurs haute performance, avec des dissipations de plus de 400W TDP.',
        icone: 'thermometer',
        taux_adoption: 60,
        categorie_id: 1,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché PC Gaming Europe',
        valeur: '8.7 Mds €',
        tendance: 'up',
        icone: 'euro',
        categorie_id: 1,
        ordre: 1
      },
      {
        label: 'Ventes GPU Gaming Q1',
        valeur: '+18%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 1,
        ordre: 2
      },
      {
        label: 'Prix moyen config gaming',
        valeur: '1 850 €',
        tendance: 'stable',
        icone: 'tag',
        categorie_id: 1,
        ordre: 3
      },
      {
        label: 'Part marché AMD CPU',
        valeur: '38%',
        tendance: 'up',
        icone: 'pie',
        categorie_id: 1,
        ordre: 4
      }
    ],
    insights: [
      {
        titre: 'L\\'ère du gaming 8K est arrivée',
        description: 'Avec les RTX 5090 et les technologies DLSS 4.0, le gaming en 8K natif devient enfin accessible. Les moniteurs 8K gaming se démocratisent avec des prix passant sous la barre des 2000€. L\\'écosystème complet (GPU, écrans, contenus) atteint la maturité nécessaire pour une adoption grand public d\\'ici 2027.',
        icone: 'chart',
        categorie_id: 1,
        ordre: 1
      },
      {
        titre: 'IA et gaming : la convergence s\\'accélère',
        description: 'Les NPU intégrés aux GPU permettent désormais l\\'exécution de modèles IA en temps réel pendant le jeu : PNJ intelligents, génération procédurale, upscaling et anti-aliasing. Cette convergence redéfinit les possibilités du game design.',
        icone: 'ai',
        categorie_id: 1,
        ordre: 2
      },
      {
        titre: 'Efficacité énergétique : nouveau critère d\\'achat',
        description: 'Face à la hausse des coûts de l\\'électricité, les gamers privilégient les configurations optimisées en performance par watt. Les fabricants répondent avec des composants plus efficients.',
        icone: 'leaf',
        categorie_id: 1,
        ordre: 3
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'GPU avec 48 Go de VRAM standard',
        description: 'Les GPU gaming haut de gamme embarqueront 48 Go de GDDR7 pour supporter les textures 8K et les assets IA.',
        icone: 'chip',
        probabilite: 85,
        categorie_id: 1,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Abandon du PCIe 4.0',
        description: 'Le PCIe 5.0 deviendra le minimum requis, PCIe 6.0 pour le haut de gamme.',
        icone: 'circuit',
        probabilite: 75,
        categorie_id: 1,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'IA générative en temps réel',
        description: 'Les jeux utiliseront l\\'IA générative pour créer du contenu unique à chaque partie.',
        icone: 'ai',
        probabilite: 70,
        categorie_id: 1,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Fin des limitations VRAM',
        description: 'Les architectures mémoire unifiée rendront la VRAM extensible dynamiquement.',
        icone: 'memory',
        probabilite: 60,
        categorie_id: 1,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 2 : DRONE
  // ============================================================================
  2: {
    actualites: [
      {
        titre: 'DJI Air 4 : capteur 1 pouce et obstacle sensing 360°',
        description: 'DJI dévoile l\\'Air 4, équipé d\\'un capteur 1 pouce capable de filmer en 6K/60fps. Le nouveau système de détection d\\'obstacles omnidirectionnel utilise 12 capteurs pour une sécurité maximale. Autonomie portée à 46 minutes.',
        image: 'dji-air4.jpg',
        video_url: 'https://youtube.com/embed/example2',
        date_publication: '${annee}-${moisNum}-03',
        tags: ['dji', 'air4', 'drone', '6k'],
        hot: true,
        categorie_id: 2,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Réglementation EU : nouvelles zones de vol autorisées',
        description: 'L\\'EASA assouplit les règles pour les drones de moins de 900g en catégorie ouverte. De nouvelles zones urbaines deviennent accessibles avec une simple déclaration.',
        image: 'drone-regulation-eu.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-12',
        tags: ['regulation', 'easa', 'drone', 'europe'],
        hot: false,
        categorie_id: 2,
        lien: null,
        ordre: 2
      },
      {
        titre: 'Autel EVO 3 Pro : concurrent sérieux du Mavic 3',
        description: 'Autel contre-attaque avec l\\'EVO 3 Pro : capteur Hasselblad 4/3, zoom optique 5x, et mode nuit amélioré par IA. Prix agressif à 1799€.',
        image: 'autel-evo3.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-18',
        tags: ['autel', 'evo3', 'hasselblad', 'drone'],
        hot: true,
        categorie_id: 2,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'Batteries état solide pour drones',
        description: 'Les premières batteries état solide commerciales offrent 50% d\\'autonomie supplémentaire pour un poids réduit de 30%. Temps de charge divisé par 3.',
        icone: 'battery',
        taux_adoption: 15,
        categorie_id: 2,
        ordre: 1
      },
      {
        nom: 'IA de vol autonome niveau 4',
        description: 'Les nouveaux algorithmes permettent des missions complexes sans intervention humaine : inspection, cartographie, livraison.',
        icone: 'ai',
        taux_adoption: 30,
        categorie_id: 2,
        ordre: 2
      },
      {
        nom: 'Transmission vidéo O4',
        description: 'Le protocole O4 de DJI atteint 20 km de portée en 1080p/120fps avec latence de 28ms.',
        icone: 'signal',
        taux_adoption: 40,
        categorie_id: 2,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché drone Europe',
        valeur: '3.2 Mds €',
        tendance: 'up',
        icone: 'euro',
        categorie_id: 2,
        ordre: 1
      },
      {
        label: 'Part DJI marché consumer',
        valeur: '72%',
        tendance: 'down',
        icone: 'pie',
        categorie_id: 2,
        ordre: 2
      },
      {
        label: 'Croissance segment pro',
        valeur: '+24%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 2,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'La livraison par drone décolle enfin',
        description: 'Après des années d\\'expérimentation, la livraison par drone devient réalité en Europe. Amazon Prime Air et Wing (Google) lancent leurs services dans 15 villes européennes. Les réglementations adaptées et les progrès en autonomie de vol permettent des livraisons en moins de 30 minutes.',
        icone: 'package',
        categorie_id: 2,
        ordre: 1
      },
      {
        titre: 'Drones FPV : du racing au cinéma',
        description: 'Les drones FPV professionnels transforment la production cinématographique avec des plans impossibles auparavant. La démocratisation des modèles sub-250g ouvre le marché aux créateurs indépendants.',
        icone: 'video',
        categorie_id: 2,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Autonomie standard de 60 minutes',
        description: 'Les drones consumer atteindront 1 heure d\\'autonomie grâce aux batteries nouvelle génération.',
        icone: 'battery',
        probabilite: 80,
        categorie_id: 2,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Certification automatique pilote',
        description: 'Les certifications pilote seront automatisées via IA et simulateurs reconnus.',
        icone: 'certificate',
        probabilite: 65,
        categorie_id: 2,
        ordre: 2
      },
      {
        annee: 2028,
        titre: 'Drones urbains de transport',
        description: 'Les premiers taxis-drones pour passagers seront commercialisés en Europe.',
        icone: 'plane',
        probabilite: 55,
        categorie_id: 2,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Essaims de drones grand public',
        description: 'Les systèmes multi-drones coordonnés seront accessibles aux particuliers.',
        icone: 'network',
        probabilite: 50,
        categorie_id: 2,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 3 : SMARTPHONE
  // ============================================================================
  3: {
    actualites: [
      {
        titre: 'Samsung Galaxy S26 Ultra : capteur 400 MP et IA on-device',
        description: 'Samsung révolutionne la photo mobile avec un capteur de 400 MP utilisant le pixel binning 16-en-1. Le Galaxy AI 3.0 fonctionne entièrement hors ligne grâce au NPU Exynos 2600. Écran AMOLED 2X avec luminosité record de 3500 nits.',
        image: 'galaxy-s26-ultra.jpg',
        video_url: 'https://youtube.com/embed/example3',
        date_publication: '${annee}-${moisNum}-02',
        tags: ['samsung', 'galaxy', 's26', 'ultra'],
        hot: true,
        categorie_id: 3,
        lien: null,
        ordre: 1
      },
      {
        titre: 'iPhone 18 Pro : puce A20 Bionic en 2nm',
        description: 'Apple franchit le cap du 2nm avec la puce A20 Bionic. Performances CPU +35%, GPU +40%, et NPU capable de 45 TOPS. La première puce mobile à supporter les LLM de plus de 30 milliards de paramètres.',
        image: 'iphone-18-pro.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-08',
        tags: ['apple', 'iphone', 'a20', '2nm'],
        hot: true,
        categorie_id: 3,
        lien: null,
        ordre: 2
      },
      {
        titre: 'OnePlus 14 Pro : charge 300W en 5 minutes',
        description: 'OnePlus repousse les limites avec une charge 300W permettant 0 à 100% en 5 minutes. La batterie silicone-carbone de 6000 mAh conserve 90% de capacité après 1600 cycles.',
        image: 'oneplus-14-pro.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-15',
        tags: ['oneplus', 'charge', 'rapide', 'batterie'],
        hot: false,
        categorie_id: 3,
        lien: null,
        ordre: 3
      },
      {
        titre: 'Xiaomi Mix Fold 4 : le pliable le plus fin',
        description: 'Xiaomi présente le Mix Fold 4 avec seulement 8.9mm d\\'épaisseur plié. Écran interne de 8.2 pouces LTPO 3.0, caméra Leica et Snapdragon 8 Gen 4.',
        image: 'xiaomi-mix-fold4.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-22',
        tags: ['xiaomi', 'pliable', 'fold', 'leica'],
        hot: false,
        categorie_id: 3,
        lien: null,
        ordre: 4
      }
    ],
    technologies: [
      {
        nom: 'Écrans sous-écran 2.0',
        description: 'Les caméras sous l\\'écran atteignent enfin la qualité des capteurs classiques grâce aux nouveaux pixels OLED transparents et algorithmes IA.',
        icone: 'camera',
        taux_adoption: 35,
        categorie_id: 3,
        ordre: 1
      },
      {
        nom: 'Batteries silicone-carbone',
        description: 'Les anodes silicone-carbone offrent 40% de densité énergétique supplémentaire pour le même volume.',
        icone: 'battery',
        taux_adoption: 50,
        categorie_id: 3,
        ordre: 2
      },
      {
        nom: 'Satellite bidirectionnel',
        description: 'La communication satellite devient bidirectionnelle : SMS, appels vocaux courts et data basique sans couverture cellulaire.',
        icone: 'satellite',
        taux_adoption: 40,
        categorie_id: 3,
        ordre: 3
      },
      {
        nom: 'LLM on-device',
        description: 'Les modèles de langage locaux (7-15B paramètres) fonctionnent en temps réel sur smartphone pour la vie privée.',
        icone: 'ai',
        taux_adoption: 55,
        categorie_id: 3,
        ordre: 4
      }
    ],
    marche: [
      {
        label: 'Ventes smartphones monde',
        valeur: '1.35 Md unités',
        tendance: 'up',
        icone: 'globe',
        categorie_id: 3,
        ordre: 1
      },
      {
        label: 'Part Apple Europe',
        valeur: '32%',
        tendance: 'stable',
        icone: 'apple',
        categorie_id: 3,
        ordre: 2
      },
      {
        label: 'Segment pliables',
        valeur: '+45%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 3,
        ordre: 3
      },
      {
        label: 'Prix moyen flagship',
        valeur: '1 150 €',
        tendance: 'up',
        icone: 'euro',
        categorie_id: 3,
        ordre: 4
      }
    ],
    insights: [
      {
        titre: 'L\\'IA mobile devient indispensable',
        description: 'Les fonctions IA (traduction temps réel, résumé, génération de contenu) sont désormais des critères d\\'achat majeurs. Les smartphones sans NPU performant perdent en attractivité. Apple et Google dominent avec leurs assistants IA intégrés.',
        icone: 'ai',
        categorie_id: 3,
        ordre: 1
      },
      {
        titre: 'Pliables : la maturité atteinte',
        description: 'Les smartphones pliables ont résolu leurs problèmes de durabilité. Avec des prix passant sous 1000€ pour l\\'entrée de gamme, ils captent désormais 15% du marché premium.',
        icone: 'fold',
        categorie_id: 3,
        ordre: 2
      },
      {
        titre: 'Réparabilité : nouveau critère légal',
        description: 'La réglementation européenne impose un indice de réparabilité minimum. Les constructeurs s\\'adaptent avec des designs modulaires et des pièces disponibles 7 ans.',
        icone: 'tool',
        categorie_id: 3,
        ordre: 3
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Caméras 1 pouce en standard flagship',
        description: 'Tous les flagships auront un capteur principal de 1 pouce minimum.',
        icone: 'camera',
        probabilite: 85,
        categorie_id: 3,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Fin des ports physiques',
        description: 'Les flagships abandonneront le port USB-C pour le tout sans-fil.',
        icone: 'wireless',
        probabilite: 60,
        categorie_id: 3,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Batteries 7 jours autonomie',
        description: 'Les technologies de batterie permettront une semaine d\\'autonomie réelle.',
        icone: 'battery',
        probabilite: 45,
        categorie_id: 3,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Écrans enroulables commerciaux',
        description: 'Les premiers smartphones à écran enroulable seront disponibles grand public.',
        icone: 'screen',
        probabilite: 70,
        categorie_id: 3,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 4 : CONSOLE
  // ============================================================================
  4: {
    actualites: [
      {
        titre: 'PlayStation 6 : annonce officielle et specs révélées',
        description: 'Sony lève le voile sur la PS6 : CPU AMD Zen 6 à 16 cœurs, GPU RDNA 5 capable de ray tracing en 8K, 32 Go de RAM GDDR7. Le SSD de 2 To atteint 25 Go/s. Rétrocompatibilité totale PS4/PS5.',
        image: 'ps6-reveal.jpg',
        video_url: 'https://youtube.com/embed/example4',
        date_publication: '${annee}-${moisNum}-01',
        tags: ['playstation', 'ps6', 'sony', 'nextgen'],
        hot: true,
        categorie_id: 4,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Xbox Series Y : la réponse de Microsoft',
        description: 'Microsoft annonce la Xbox Series Y avec une architecture cloud-hybride. Streaming 8K natif, jeu local en 4K/120fps, et abonnement Game Pass Ultimate inclus la première année.',
        image: 'xbox-series-y.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-10',
        tags: ['xbox', 'microsoft', 'seriesy', 'cloud'],
        hot: true,
        categorie_id: 4,
        lien: null,
        ordre: 2
      },
      {
        titre: 'Nintendo Switch 2 : premiers détails officiels',
        description: 'Nintendo confirme la Switch 2 avec écran OLED 8 pouces, dock 4K/60fps, et rétrocompatibilité Switch 1. Lancement prévu Q4 avec Zelda en titre de lancement.',
        image: 'switch-2.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-18',
        tags: ['nintendo', 'switch2', 'zelda', 'portable'],
        hot: true,
        categorie_id: 4,
        lien: null,
        ordre: 3
      },
      {
        titre: 'Steam Deck 2 : Valve passe au 7nm',
        description: 'Le Steam Deck 2 embarque une APU AMD custom en 7nm offrant des performances doublées. Écran OLED 120Hz, batterie 65Wh, et stockage NVMe de 1 To.',
        image: 'steam-deck-2.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-25',
        tags: ['valve', 'steamdeck', 'portable', 'pc'],
        hot: false,
        categorie_id: 4,
        lien: null,
        ordre: 4
      }
    ],
    technologies: [
      {
        nom: 'Ray tracing hardware temps réel',
        description: 'Les consoles next-gen supportent le ray tracing complet (global illumination, réflexions, ombres) en 4K/60fps sans compromis.',
        icone: 'light',
        taux_adoption: 70,
        categorie_id: 4,
        ordre: 1
      },
      {
        nom: 'Upscaling IA propriétaire',
        description: 'Sony (PSSR 2.0) et Microsoft (DirectSR) rivalisent avec DLSS pour un upscaling quasi-natif.',
        icone: 'ai',
        taux_adoption: 85,
        categorie_id: 4,
        ordre: 2
      },
      {
        nom: 'Stockage expandable ultra-rapide',
        description: 'Les cartes d\\'extension propriétaires atteignent 15 Go/s, compatibles avec les architectures de streaming des jeux.',
        icone: 'storage',
        taux_adoption: 60,
        categorie_id: 4,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Ventes consoles monde',
        valeur: '52M unités',
        tendance: 'up',
        icone: 'globe',
        categorie_id: 4,
        ordre: 1
      },
      {
        label: 'Revenus Game Pass',
        valeur: '4.8 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 4,
        ordre: 2
      },
      {
        label: 'Part Sony marché',
        valeur: '48%',
        tendance: 'stable',
        icone: 'pie',
        categorie_id: 4,
        ordre: 3
      },
      {
        label: 'Croissance portable',
        valeur: '+35%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 4,
        ordre: 4
      }
    ],
    insights: [
      {
        titre: 'Le cloud gaming intégré aux consoles',
        description: 'La frontière entre jeu local et cloud s\\'estompe. PS6 et Xbox Series Y peuvent basculer automatiquement vers le cloud pour les jeux les plus exigeants, offrant une expérience transparente aux joueurs.',
        icone: 'cloud',
        categorie_id: 4,
        ordre: 1
      },
      {
        titre: 'Guerre des abonnements',
        description: 'PlayStation Plus et Game Pass Ultimate s\\'affrontent sur le catalogue day-one. Les exclusivités deviennent des arguments marketing majeurs, bénéficiant aux joueurs.',
        icone: 'subscription',
        categorie_id: 4,
        ordre: 2
      },
      {
        titre: 'Portables : le segment en explosion',
        description: 'Steam Deck, ROG Ally, Legion Go : les PC portables gaming captent un public nouveau. Nintendo répond avec la Switch 2, ciblant une position intermédiaire.',
        icone: 'gamepad',
        categorie_id: 4,
        ordre: 3
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'PS6 et Xbox Y en simultané',
        description: 'Les deux consoles sortiront à quelques semaines d\\'intervalle, relançant la guerre des consoles.',
        icone: 'gamepad',
        probabilite: 90,
        categorie_id: 4,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Fin des versions physiques',
        description: '80% des ventes de jeux console seront dématérialisées.',
        icone: 'disc',
        probabilite: 75,
        categorie_id: 4,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Cross-play universel',
        description: 'Le cross-play entre toutes les plateformes (console, PC, mobile) deviendra la norme.',
        icone: 'network',
        probabilite: 80,
        categorie_id: 4,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Consoles modulaires',
        description: 'Les constructeurs proposeront des mises à niveau GPU/CPU pour prolonger la durée de vie.',
        icone: 'modular',
        probabilite: 45,
        categorie_id: 4,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 5 : TABLETTE
  // ============================================================================
  5: {
    actualites: [
      {
        titre: 'iPad Pro M5 : écran OLED tandem et puce desktop',
        description: 'Apple présente l\\'iPad Pro avec puce M5, atteignant les performances d\\'un MacBook Pro. L\\'écran OLED tandem Ultra Retina XDR offre 2000 nits en SDR. Thunderbolt 5 pour la connectivité.',
        image: 'ipad-pro-m5.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-05',
        tags: ['apple', 'ipad', 'm5', 'oled'],
        hot: true,
        categorie_id: 5,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Samsung Galaxy Tab S10 Ultra : écran 15.6 pouces',
        description: 'Samsung repousse les limites avec une tablette de 15.6 pouces AMOLED 120Hz. Snapdragon 8 Gen 4, S Pen intégré, et DeX amélioré pour une expérience desktop complète.',
        image: 'galaxy-tab-s10.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-12',
        tags: ['samsung', 'galaxy', 'tab', 'ultra'],
        hot: false,
        categorie_id: 5,
        lien: null,
        ordre: 2
      },
      {
        titre: 'Microsoft Surface Pro 11 : Snapdragon X Elite',
        description: 'La Surface Pro 11 adopte le Snapdragon X Elite pour une autonomie record de 22 heures. Windows on ARM mature enfin avec une compatibilité x86 quasi-parfaite.',
        image: 'surface-pro-11.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-20',
        tags: ['microsoft', 'surface', 'snapdragon', 'arm'],
        hot: false,
        categorie_id: 5,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'OLED Tandem',
        description: 'Deux couches OLED superposées pour une luminosité doublée et une longévité accrue. Standard sur les tablettes premium.',
        icone: 'screen',
        taux_adoption: 30,
        categorie_id: 5,
        ordre: 1
      },
      {
        nom: 'Stylets haptiques',
        description: 'Les stylets nouvelle génération simulent les textures du papier, toile et autres surfaces grâce au retour haptique avancé.',
        icone: 'pen',
        taux_adoption: 45,
        categorie_id: 5,
        ordre: 2
      },
      {
        nom: 'Puces ARM desktop-class',
        description: 'M5, Snapdragon X Elite et MediaTek Dimensity offrent des performances laptop dans un châssis tablette.',
        icone: 'chip',
        taux_adoption: 55,
        categorie_id: 5,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché tablettes monde',
        valeur: '165M unités',
        tendance: 'stable',
        icone: 'globe',
        categorie_id: 5,
        ordre: 1
      },
      {
        label: 'Part Apple',
        valeur: '38%',
        tendance: 'up',
        icone: 'apple',
        categorie_id: 5,
        ordre: 2
      },
      {
        label: 'Segment pro/créatif',
        valeur: '+22%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 5,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Tablettes vs laptops : la convergence',
        description: 'Avec les puces ARM performantes et les accessoires (claviers, trackpads), les tablettes premium remplacent les laptops pour 40% des utilisateurs professionnels. iPad Pro et Surface Pro mènent cette transition.',
        icone: 'laptop',
        categorie_id: 5,
        ordre: 1
      },
      {
        titre: 'Création mobile : le nouveau standard',
        description: 'Les créateurs adoptent massivement les tablettes pour le dessin, la retouche photo et même le montage vidéo 4K. Les apps pro (Procreate, DaVinci, Photoshop) atteignent la parité desktop.',
        icone: 'brush',
        categorie_id: 5,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Tablettes pliables mainstream',
        description: 'Les tablettes pliables 8-12 pouces deviendront un segment significatif du marché.',
        icone: 'fold',
        probabilite: 70,
        categorie_id: 5,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'iPadOS = macOS apps',
        description: 'Apple permettra l\\'exécution native des apps macOS sur iPad Pro.',
        icone: 'apple',
        probabilite: 65,
        categorie_id: 5,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Autonomie 30 heures',
        description: 'Les tablettes ARM atteindront 30 heures d\\'autonomie en usage mixte.',
        icone: 'battery',
        probabilite: 75,
        categorie_id: 5,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Fin des tablettes Android entrée de gamme',
        description: 'Le segment sera dominé par iPad et les tablettes ARM Windows.',
        icone: 'android',
        probabilite: 55,
        categorie_id: 5,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 6 : CASQUE AUDIO
  // ============================================================================
  6: {
    actualites: [
      {
        titre: 'Sony WH-1000XM6 : ANC adaptatif par IA',
        description: 'Sony dévoile le XM6 avec réduction de bruit pilotée par IA. Le système analyse l\\'environnement sonore en temps réel pour optimiser l\\'ANC. Audio spatial 360 Reality Audio amélioré.',
        image: 'sony-xm6.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-08',
        tags: ['sony', 'xm6', 'anc', 'audio'],
        hot: true,
        categorie_id: 6,
        lien: null,
        ordre: 1
      },
      {
        titre: 'AirPods Pro 3 : codec Lossless et santé auditive',
        description: 'Apple intègre le codec Apple Lossless sans fil aux AirPods Pro 3. Nouvelles fonctions de santé auditive : test auditif clinique, protection contre les sons forts.',
        image: 'airpods-pro-3.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-15',
        tags: ['apple', 'airpods', 'lossless', 'sante'],
        hot: true,
        categorie_id: 6,
        lien: null,
        ordre: 2
      },
      {
        titre: 'Sennheiser Momentum 5 : drivers planar magnetic',
        description: 'Sennheiser adopte les drivers planar magnetic pour une réponse en fréquence exceptionnelle. Le Momentum 5 vise les audiophiles exigeants avec certification Hi-Res Audio Wireless.',
        image: 'sennheiser-momentum5.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-22',
        tags: ['sennheiser', 'momentum', 'planar', 'audiophile'],
        hot: false,
        categorie_id: 6,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'Bluetooth LE Audio + LC3plus',
        description: 'Le codec LC3plus offre une qualité CD en Bluetooth avec latence de 20ms, révolutionnant l\\'audio sans fil.',
        icone: 'bluetooth',
        taux_adoption: 50,
        categorie_id: 6,
        ordre: 1
      },
      {
        nom: 'ANC adaptatif IA',
        description: 'L\\'intelligence artificielle ajuste la réduction de bruit en fonction du contexte sonore détecté.',
        icone: 'ai',
        taux_adoption: 40,
        categorie_id: 6,
        ordre: 2
      },
      {
        nom: 'Audio spatial personnalisé',
        description: 'Les casques scannent la morphologie de l\\'oreille pour créer un profil spatial 3D personnalisé.',
        icone: 'spatial',
        taux_adoption: 55,
        categorie_id: 6,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché casques premium',
        valeur: '12.5 Mds €',
        tendance: 'up',
        icone: 'euro',
        categorie_id: 6,
        ordre: 1
      },
      {
        label: 'Part TWS du marché',
        valeur: '68%',
        tendance: 'up',
        icone: 'pie',
        categorie_id: 6,
        ordre: 2
      },
      {
        label: 'Croissance segment gaming',
        valeur: '+28%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 6,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Santé auditive : nouveau différenciateur',
        description: 'Les fonctions de santé auditive (tests, protection, amplification) deviennent des arguments de vente majeurs. Apple et Sony intègrent des certifications médicales à leurs produits.',
        icone: 'health',
        categorie_id: 6,
        ordre: 1
      },
      {
        titre: 'Gaming audio : convergence avec le hi-fi',
        description: 'Les casques gaming adoptent les technologies audiophiles (DAC intégrés, drivers premium). Le segment fusionne avec le marché hi-fi grand public.',
        icone: 'headphones',
        categorie_id: 6,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Lossless Bluetooth standard',
        description: 'Le codec LC3plus deviendra le standard, rendant le lossless sans fil universel.',
        icone: 'bluetooth',
        probabilite: 80,
        categorie_id: 6,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'TWS avec ANC parfait',
        description: 'L\\'ANC des écouteurs TWS égalera celui des casques circum-auraux.',
        icone: 'noise',
        probabilite: 70,
        categorie_id: 6,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Casques augmentés',
        description: 'Les casques intégreront des fonctions AR audio : traduction temps réel, navigation sonore.',
        icone: 'ar',
        probabilite: 65,
        categorie_id: 6,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Implants cochléaires grand public',
        description: 'Les premiers implants audio non-chirurgicaux pour le grand public apparaîtront.',
        icone: 'implant',
        probabilite: 35,
        categorie_id: 6,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 7 : MONTRE CONNECTÉE
  // ============================================================================
  7: {
    actualites: [
      {
        titre: 'Apple Watch Series 11 : capteur glycémie non-invasif',
        description: 'Apple révolutionne le suivi santé avec un capteur de glycémie optique non-invasif. La Series 11 mesure en continu sans piqûre, une avancée majeure pour les diabétiques.',
        image: 'apple-watch-11.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-05',
        tags: ['apple', 'watch', 'glycemie', 'sante'],
        hot: true,
        categorie_id: 7,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Samsung Galaxy Watch 8 Ultra : autonomie 7 jours',
        description: 'Samsung atteint 7 jours d\\'autonomie grâce à une nouvelle batterie et un écran AMOLED LTPO 4.0 ultra-efficient. BioActive Sensor 3.0 pour le suivi santé.',
        image: 'galaxy-watch-8.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-12',
        tags: ['samsung', 'watch', 'autonomie', 'ultra'],
        hot: false,
        categorie_id: 7,
        lien: null,
        ordre: 2
      },
      {
        titre: 'Garmin Fenix 9 : cartographie et solar plus',
        description: 'Le Fenix 9 embarque la cartographie TopoActive mondiale et des panneaux solaires plus efficients. Autonomie de 40 jours en mode GPS basique.',
        image: 'garmin-fenix9.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-20',
        tags: ['garmin', 'fenix', 'outdoor', 'solar'],
        hot: false,
        categorie_id: 7,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'Capteurs optiques multi-longueurs d\\'onde',
        description: 'Les nouveaux capteurs utilisent 7 longueurs d\\'onde pour mesurer glycémie, hydratation et composition corporelle.',
        icone: 'sensor',
        taux_adoption: 25,
        categorie_id: 7,
        ordre: 1
      },
      {
        nom: 'Écrans LTPO 4.0',
        description: 'Les écrans LTPO 4.0 passent de 1Hz à 120Hz avec une consommation réduite de 30%.',
        icone: 'screen',
        taux_adoption: 60,
        categorie_id: 7,
        ordre: 2
      },
      {
        nom: 'IA santé prédictive',
        description: 'Les algorithmes IA prédisent les risques de santé (arythmie, fatigue, stress) avant qu\\'ils ne surviennent.',
        icone: 'ai',
        taux_adoption: 45,
        categorie_id: 7,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché montres connectées',
        valeur: '78 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 7,
        ordre: 1
      },
      {
        label: 'Part Apple Watch',
        valeur: '52%',
        tendance: 'stable',
        icone: 'apple',
        categorie_id: 7,
        ordre: 2
      },
      {
        label: 'Croissance segment santé',
        valeur: '+32%',
        tendance: 'up',
        icone: 'health',
        categorie_id: 7,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Montre = dispositif médical',
        description: 'Les montres connectées obtiennent de plus en plus de certifications médicales (ECG, tension, glycémie). Elles deviennent des outils de diagnostic précoce reconnus par les professionnels de santé.',
        icone: 'medical',
        categorie_id: 7,
        ordre: 1
      },
      {
        titre: 'Fitness vs lifestyle : segmentation claire',
        description: 'Le marché se scinde entre montres fitness (Garmin, Polar) et lifestyle (Apple, Samsung). Les consommateurs choisissent selon leur usage prioritaire.',
        icone: 'fitness',
        categorie_id: 7,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Glycémie non-invasive standard',
        description: 'La mesure de glycémie sans piqûre sera disponible sur tous les flagships.',
        icone: 'glucose',
        probabilite: 70,
        categorie_id: 7,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Tension artérielle en continu',
        description: 'Les montres mesureront la tension artérielle de manière continue et certifiée.',
        icone: 'heart',
        probabilite: 75,
        categorie_id: 7,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Autonomie 2 semaines standard',
        description: 'Les smartwatches standard atteindront 14 jours d\\'autonomie.',
        icone: 'battery',
        probabilite: 60,
        categorie_id: 7,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Remboursement sécurité sociale',
        description: 'Certaines montres seront remboursées pour le suivi de maladies chroniques.',
        icone: 'medical',
        probabilite: 50,
        categorie_id: 7,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 8 : SERVEUR
  // ============================================================================
  8: {
    actualites: [
      {
        titre: 'AMD EPYC Turin : 192 cœurs Zen 5',
        description: 'AMD lance les EPYC Turin avec jusqu\\'à 192 cœurs Zen 5 et 512 Mo de cache L3. TDP de 500W pour des performances record en calcul intensif et IA.',
        image: 'epyc-turin.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-03',
        tags: ['amd', 'epyc', 'serveur', 'datacenter'],
        hot: true,
        categorie_id: 8,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Intel Xeon Sierra Forest : efficacité E-cores',
        description: 'Intel propose jusqu\\'à 288 E-cores pour le cloud scale-out avec Sierra Forest. Efficacité énergétique record pour les workloads parallélisables.',
        image: 'xeon-sierra.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-15',
        tags: ['intel', 'xeon', 'ecores', 'cloud'],
        hot: false,
        categorie_id: 8,
        lien: null,
        ordre: 2
      },
      {
        titre: 'NVIDIA Grace Hopper GH300 : IA + CPU unifiés',
        description: 'NVIDIA unifie CPU ARM et GPU dans le GH300 pour l\\'entraînement IA. Mémoire unifiée de 288 Go HBM3e et interconnexion NVLink 5.0.',
        image: 'grace-hopper.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-22',
        tags: ['nvidia', 'grace', 'hopper', 'ia'],
        hot: true,
        categorie_id: 8,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'CXL 3.0 Memory Pooling',
        description: 'CXL 3.0 permet le partage de mémoire entre serveurs, multipliant la capacité RAM disponible.',
        icone: 'memory',
        taux_adoption: 35,
        categorie_id: 8,
        ordre: 1
      },
      {
        nom: 'Liquid Cooling Direct-to-Chip',
        description: 'Le refroidissement liquide direct au processeur devient obligatoire pour les TDP de 500W+.',
        icone: 'cooling',
        taux_adoption: 50,
        categorie_id: 8,
        ordre: 2
      },
      {
        nom: 'ARM Serveur',
        description: 'Les processeurs ARM (Ampere, AWS Graviton, NVIDIA Grace) captent 20% du marché serveur.',
        icone: 'arm',
        taux_adoption: 25,
        categorie_id: 8,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché serveurs mondial',
        valeur: '142 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 8,
        ordre: 1
      },
      {
        label: 'Croissance serveurs IA',
        valeur: '+65%',
        tendance: 'up',
        icone: 'ai',
        categorie_id: 8,
        ordre: 2
      },
      {
        label: 'Part AMD datacenter',
        valeur: '28%',
        tendance: 'up',
        icone: 'pie',
        categorie_id: 8,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'IA : moteur de croissance serveur',
        description: 'L\\'entraînement et l\\'inférence IA représentent 45% de la croissance du marché serveur. NVIDIA domine avec 85% des accélérateurs IA déployés.',
        icone: 'ai',
        categorie_id: 8,
        ordre: 1
      },
      {
        titre: 'Efficacité énergétique : priorité n°1',
        description: 'Face aux coûts énergétiques et aux objectifs climatiques, l\\'efficacité par watt devient le critère d\\'achat principal pour les datacenters.',
        icone: 'leaf',
        categorie_id: 8,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Serveurs 1000W TDP',
        description: 'Les configurations serveur atteindront 1000W par socket pour l\\'IA.',
        icone: 'power',
        probabilite: 85,
        categorie_id: 8,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'ARM à 40% du marché cloud',
        description: 'Les processeurs ARM capteront 40% des nouveaux déploiements cloud.',
        icone: 'arm',
        probabilite: 70,
        categorie_id: 8,
        ordre: 2
      },
      {
        annee: 2028,
        titre: 'Refroidissement immersion standard',
        description: 'Le refroidissement par immersion deviendra courant pour les clusters IA.',
        icone: 'water',
        probabilite: 65,
        categorie_id: 8,
        ordre: 3
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 9 : BOX INTERNET
  // ============================================================================
  9: {
    actualites: [
      {
        titre: 'Freebox Ultra 2 : WiFi 7 et 25 Gbps fibre',
        description: 'Free lance la Freebox Ultra 2 avec WiFi 7 tri-bande et débit fibre symétrique de 25 Gbps. Player 8K HDR et services cloud intégrés.',
        image: 'freebox-ultra2.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-05',
        tags: ['free', 'freebox', 'wifi7', 'fibre'],
        hot: true,
        categorie_id: 9,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Livebox 8 : IA pour optimiser le réseau',
        description: 'Orange présente la Livebox 8 avec IA embarquée qui optimise la couverture et la QoS en temps réel selon les usages détectés.',
        image: 'livebox-8.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-12',
        tags: ['orange', 'livebox', 'ia', 'wifi'],
        hot: false,
        categorie_id: 9,
        lien: null,
        ordre: 2
      },
      {
        titre: 'SFR Box Power+ : mesh WiFi 7 inclus',
        description: 'SFR intègre un système mesh WiFi 7 de 3 satellites à sa nouvelle box. Couverture garantie jusqu\\'à 250m².',
        image: 'sfr-box-power.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-20',
        tags: ['sfr', 'box', 'mesh', 'wifi7'],
        hot: false,
        categorie_id: 9,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'WiFi 7 (802.11be)',
        description: 'Le WiFi 7 atteint 46 Gbps théoriques avec MLO (Multi-Link Operation) pour une latence divisée par 3.',
        icone: 'wifi',
        taux_adoption: 30,
        categorie_id: 9,
        ordre: 1
      },
      {
        nom: 'XGS-PON 25G',
        description: 'La nouvelle norme fibre permet 25 Gbps symétrique vers les foyers.',
        icone: 'fiber',
        taux_adoption: 15,
        categorie_id: 9,
        ordre: 2
      },
      {
        nom: 'Matter/Thread intégrés',
        description: 'Les box deviennent le hub domotique central avec les protocoles Matter et Thread natifs.',
        icone: 'home',
        taux_adoption: 50,
        categorie_id: 9,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Abonnés fibre France',
        valeur: '24M',
        tendance: 'up',
        icone: 'users',
        categorie_id: 9,
        ordre: 1
      },
      {
        label: 'Part marché Free',
        valeur: '28%',
        tendance: 'stable',
        icone: 'pie',
        categorie_id: 9,
        ordre: 2
      },
      {
        label: 'ARPU moyen box',
        valeur: '42 €',
        tendance: 'up',
        icone: 'euro',
        categorie_id: 9,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Box = plateforme de services',
        description: 'Les box évoluent de simple modem vers des plateformes de services : cloud, gaming, domotique, sécurité. Les opérateurs diversifient leurs revenus au-delà de l\\'accès.',
        icone: 'platform',
        categorie_id: 9,
        ordre: 1
      },
      {
        titre: 'WiFi 7 : adoption progressive',
        description: 'Malgré le lancement des box WiFi 7, l\\'adoption dépend du renouvellement des appareils. Le plein bénéfice ne sera visible qu\\'en 2028.',
        icone: 'wifi',
        categorie_id: 9,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'WiFi 7 sur toutes les box premium',
        description: 'Tous les opérateurs proposeront une box WiFi 7 dans leur gamme haute.',
        icone: 'wifi',
        probabilite: 95,
        categorie_id: 9,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Fin du xDSL',
        description: 'Les dernières offres ADSL/VDSL seront abandonnées au profit exclusif de la fibre.',
        icone: 'fiber',
        probabilite: 80,
        categorie_id: 9,
        ordre: 2
      },
      {
        annee: 2028,
        titre: 'Box avec IA locale',
        description: 'Les box embarqueront des NPU pour exécuter des assistants IA localement.',
        icone: 'ai',
        probabilite: 70,
        categorie_id: 9,
        ordre: 3
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 10 : CAMÉRA
  // ============================================================================
  10: {
    actualites: [
      {
        titre: 'Canon EOS R1 : le flagship mirrorless professionnel',
        description: 'Canon dévoile l\\'EOS R1 avec capteur stacked CMOS de 30 MP, rafale 40 fps sans blackout, et AF Eye Tracking capable de suivre les sportifs en mouvement rapide.',
        image: 'canon-r1.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-02',
        tags: ['canon', 'eosr1', 'mirrorless', 'pro'],
        hot: true,
        categorie_id: 10,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Sony A7 V : capteur global shutter pour tous',
        description: 'Sony démocratise le global shutter avec l\\'A7 V. Fini les effets rolling shutter, même en vidéo 8K/30fps. Le capteur de 33 MP offre une dynamique de 16 stops.',
        image: 'sony-a7v.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-10',
        tags: ['sony', 'a7v', 'globalshutter', 'video'],
        hot: true,
        categorie_id: 10,
        lien: null,
        ordre: 2
      },
      {
        titre: 'Nikon Z9 II : vidéo 12K interne',
        description: 'Le Nikon Z9 II enregistre en 12K RAW interne sur CFexpress Type C. Le nouveau processeur EXPEED 8 gère l\\'énorme flux de données.',
        image: 'nikon-z9ii.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-18',
        tags: ['nikon', 'z9', '12k', 'video'],
        hot: false,
        categorie_id: 10,
        lien: null,
        ordre: 3
      },
      {
        titre: 'DJI Osmo Action 5 Pro : action cam 8K',
        description: 'DJI lance l\\'Osmo Action 5 Pro capable de filmer en 8K/60fps avec stabilisation RockSteady 4.0. Étanche à 20m sans caisson.',
        image: 'osmo-action5.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-25',
        tags: ['dji', 'action', '8k', 'stabilisation'],
        hot: false,
        categorie_id: 10,
        lien: null,
        ordre: 4
      }
    ],
    technologies: [
      {
        nom: 'Global Shutter CMOS',
        description: 'Les capteurs global shutter éliminent le rolling shutter et permettent le flash sync à toutes les vitesses.',
        icone: 'camera',
        taux_adoption: 25,
        categorie_id: 10,
        ordre: 1
      },
      {
        nom: 'AF par IA Deep Learning',
        description: 'L\\'autofocus apprend à reconnaître les sujets (humains, animaux, véhicules) pour un suivi prédictif.',
        icone: 'ai',
        taux_adoption: 70,
        categorie_id: 10,
        ordre: 2
      },
      {
        nom: 'Codec interne ProRes/RAW',
        description: 'Les hybrides haut de gamme enregistrent en ProRes ou RAW sans enregistreur externe.',
        icone: 'video',
        taux_adoption: 55,
        categorie_id: 10,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché appareils photo',
        valeur: '8.2 Mds $',
        tendance: 'stable',
        icone: 'dollar',
        categorie_id: 10,
        ordre: 1
      },
      {
        label: 'Part mirrorless',
        valeur: '92%',
        tendance: 'up',
        icone: 'pie',
        categorie_id: 10,
        ordre: 2
      },
      {
        label: 'Croissance segment vidéo',
        valeur: '+18%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 10,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Photo ou vidéo : les hybrides excellent partout',
        description: 'La distinction entre appareils photo et caméras s\\'efface. Les hybrides haut de gamme (Sony A7S IV, Canon R5 II) rivalisent avec les caméras cinéma pour la vidéo tout en excellant en photo.',
        icone: 'camera',
        categorie_id: 10,
        ordre: 1
      },
      {
        titre: 'IA dans le workflow photo',
        description: 'De la prise de vue (AF, exposition) à la post-production (denoising, upscaling), l\\'IA transforme chaque étape du workflow photographique.',
        icone: 'ai',
        categorie_id: 10,
        ordre: 2
      },
      {
        titre: 'Marché stable mais premium en hausse',
        description: 'Les volumes stagnent mais le panier moyen augmente. Les photographes investissent dans du matériel haut de gamme plutôt que de renouveler fréquemment.',
        icone: 'chart',
        categorie_id: 10,
        ordre: 3
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Global shutter démocratisé',
        description: 'Le global shutter sera disponible sur les hybrides milieu de gamme.',
        icone: 'camera',
        probabilite: 75,
        categorie_id: 10,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'IA de composition temps réel',
        description: 'Les appareils suggéreront le cadrage optimal en temps réel via IA.',
        icone: 'ai',
        probabilite: 70,
        categorie_id: 10,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Fin des reflex neufs',
        description: 'Les derniers fabricants cesseront la production de reflex numériques.',
        icone: 'camera',
        probabilite: 90,
        categorie_id: 10,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'Capteurs 100+ MP standard',
        description: 'Les capteurs full-frame dépasseront 100 MP sur le segment pro.',
        icone: 'sensor',
        probabilite: 80,
        categorie_id: 10,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 11 : CASQUE VR
  // ============================================================================
  11: {
    actualites: [
      {
        titre: 'Apple Vision Pro 2 : plus léger et moins cher',
        description: 'Apple présente le Vision Pro 2 avec un poids réduit de 30% et un prix de 2499€. La puce M5 offre le rendu fovéal 16K et le passthrough parfait.',
        image: 'vision-pro-2.jpg',
        video_url: 'https://youtube.com/embed/example5',
        date_publication: '${annee}-${moisNum}-01',
        tags: ['apple', 'visionpro', 'vr', 'ar'],
        hot: true,
        categorie_id: 11,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Meta Quest 4 : autonome avec qualité PC VR',
        description: 'Meta lance le Quest 4 avec Snapdragon XR3 Gen 2 offrant des graphismes comparables au PC VR. Résolution 4K par œil, 120Hz, et suivi corporel complet.',
        image: 'quest-4.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-08',
        tags: ['meta', 'quest4', 'vr', 'standalone'],
        hot: true,
        categorie_id: 11,
        lien: null,
        ordre: 2
      },
      {
        titre: 'PlayStation VR3 : exclusivités Sony en VR',
        description: 'Sony annonce le PSVR3 compatible PS6 avec rendu 8K et titres exclusifs : Gran Turismo VR, Horizon VR, Spider-Man VR.',
        image: 'psvr3.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-15',
        tags: ['sony', 'psvr', 'playstation', 'gaming'],
        hot: true,
        categorie_id: 11,
        lien: null,
        ordre: 3
      },
      {
        titre: 'Varjo XR-5 : le casque pro ultime',
        description: 'Varjo dévoile le XR-5 avec résolution humaine (70 PPD) et passthrough 8K stéréo. Destiné aux entreprises, il coûte 4990€.',
        image: 'varjo-xr5.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-22',
        tags: ['varjo', 'xr5', 'enterprise', 'pro'],
        hot: false,
        categorie_id: 11,
        lien: null,
        ordre: 4
      }
    ],
    technologies: [
      {
        nom: 'Rendu fovéal eye-tracking',
        description: 'Le rendu haute résolution uniquement où l\\'œil regarde permet le 16K perçu avec les performances du 4K.',
        icone: 'eye',
        taux_adoption: 60,
        categorie_id: 11,
        ordre: 1
      },
      {
        nom: 'Passthrough couleur HD',
        description: 'Les caméras passthrough atteignent la qualité nécessaire pour le travail en réalité mixte.',
        icone: 'camera',
        taux_adoption: 70,
        categorie_id: 11,
        ordre: 2
      },
      {
        nom: 'Pancake lenses 2.0',
        description: 'Les nouvelles optiques pancake offrent un champ de vision de 130° dans un form factor compact.',
        icone: 'lens',
        taux_adoption: 80,
        categorie_id: 11,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché XR mondial',
        valeur: '35 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 11,
        ordre: 1
      },
      {
        label: 'Part Meta',
        valeur: '58%',
        tendance: 'down',
        icone: 'pie',
        categorie_id: 11,
        ordre: 2
      },
      {
        label: 'Croissance segment enterprise',
        valeur: '+42%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 11,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Spatial computing : la nouvelle ère',
        description: 'Apple a rebaptisé la VR en "spatial computing". Cette vision centrée productivité et non gaming redéfinit les usages : travail à distance, collaboration 3D, formation.',
        icone: 'spatial',
        categorie_id: 11,
        ordre: 1
      },
      {
        titre: 'Gaming VR : le catalogue s\\'étoffe',
        description: 'Les AAA arrivent enfin en VR : Half-Life, Resident Evil, Gran Turismo. Le gaming VR passe de niche à segment significatif du marché gaming.',
        icone: 'gamepad',
        categorie_id: 11,
        ordre: 2
      },
      {
        titre: 'Enterprise VR en plein boom',
        description: 'Formation, design industriel, collaboration : les entreprises adoptent massivement la VR/AR. Le segment enterprise croît plus vite que le consumer.',
        icone: 'building',
        categorie_id: 11,
        ordre: 3
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Casque VR sous 500g',
        description: 'Les casques grand public passeront sous la barre des 500g.',
        icone: 'weight',
        probabilite: 80,
        categorie_id: 11,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Vision Pro sous 1500€',
        description: 'Apple lancera une version grand public du Vision Pro.',
        icone: 'apple',
        probabilite: 85,
        categorie_id: 11,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Lunettes AR grand public',
        description: 'Les premières lunettes AR tout-en-un viables seront commercialisées.',
        icone: 'glasses',
        probabilite: 65,
        categorie_id: 11,
        ordre: 3
      },
      {
        annee: 2028,
        titre: 'VR sans câble ni batterie visible',
        description: 'Les casques VR ressembleront à des lunettes de ski classiques.',
        icone: 'vr',
        probabilite: 50,
        categorie_id: 11,
        ordre: 4
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 12 : ÉCRAN TV
  // ============================================================================
  12: {
    actualites: [
      {
        titre: 'LG OLED G5 : panneau MLA 3ème génération',
        description: 'LG dévoile l\\'OLED G5 avec technologie MLA 3.0 atteignant 3500 nits en pic HDR. L\\'anti-reflet parfait et le processeur α12 AI améliorent l\\'expérience gaming et cinéma.',
        image: 'lg-oled-g5.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-03',
        tags: ['lg', 'oled', 'mla', 'tv'],
        hot: true,
        categorie_id: 12,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Samsung 8K QD-OLED : la fusion parfaite',
        description: 'Samsung combine QD-OLED et 8K pour la première fois. Le S100D de 98 pouces offre des couleurs parfaites et la netteté 8K avec l\\'upscaling AI.',
        image: 'samsung-8k-qdoled.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-12',
        tags: ['samsung', 'qdoled', '8k', 'premium'],
        hot: true,
        categorie_id: 12,
        lien: null,
        ordre: 2
      },
      {
        titre: 'TCL MiniLED 2026 : rapport qualité-prix imbattable',
        description: 'TCL démocratise le Mini LED premium avec des TV 75 pouces sous 1500€. Le nombre de zones atteint 5000 pour un contraste proche de l\\'OLED.',
        image: 'tcl-miniled-2026.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-20',
        tags: ['tcl', 'miniled', 'budget', 'gaming'],
        hot: false,
        categorie_id: 12,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'Micro-Lens Array (MLA)',
        description: 'Les microlentilles sur les panneaux OLED augmentent la luminosité de 70% sans augmenter la consommation.',
        icone: 'lens',
        taux_adoption: 40,
        categorie_id: 12,
        ordre: 1
      },
      {
        nom: 'Gaming features 2.1',
        description: 'HDMI 2.1a avec ALLM, VRR 48-144Hz, QMS et 4K/144Hz devient le standard gaming.',
        icone: 'gamepad',
        taux_adoption: 75,
        categorie_id: 12,
        ordre: 2
      },
      {
        nom: 'Upscaling IA 8K',
        description: 'Les processeurs TV upscalent le contenu 4K vers 8K de manière quasi-indiscernable du natif.',
        icone: 'ai',
        taux_adoption: 50,
        categorie_id: 12,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché TV mondial',
        valeur: '112 Mds $',
        tendance: 'stable',
        icone: 'dollar',
        categorie_id: 12,
        ordre: 1
      },
      {
        label: 'Part OLED segment premium',
        valeur: '45%',
        tendance: 'up',
        icone: 'pie',
        categorie_id: 12,
        ordre: 2
      },
      {
        label: 'Croissance 8K',
        valeur: '+85%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 12,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'OLED vs Mini LED : guerre de positions',
        description: 'LG et Sony poussent l\\'OLED, Samsung le QD-OLED et le Mini LED. Les consommateurs bénéficient de cette compétition avec des prix en baisse et des specs en hausse.',
        icone: 'screen',
        categorie_id: 12,
        ordre: 1
      },
      {
        titre: '8K : patience requise',
        description: 'Malgré l\\'offre de TV 8K, le contenu reste rare. L\\'adoption dépend des plateformes de streaming et de la diffusion sportive 8K.',
        icone: 'video',
        categorie_id: 12,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'OLED 55" sous 800€',
        description: 'Les TV OLED 55 pouces passeront sous 800€ pour l\\'entrée de gamme.',
        icone: 'euro',
        probabilite: 85,
        categorie_id: 12,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'MicroLED grand public',
        description: 'Les premières TV MicroLED abordables (sous 5000€) arriveront.',
        icone: 'screen',
        probabilite: 60,
        categorie_id: 12,
        ordre: 2
      },
      {
        annee: 2028,
        titre: 'Streaming 8K généralisé',
        description: 'Netflix, Disney+ et Amazon proposeront un catalogue significatif en 8K.',
        icone: 'streaming',
        probabilite: 65,
        categorie_id: 12,
        ordre: 3
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 13 : IMPRIMANTE 3D
  // ============================================================================
  13: {
    actualites: [
      {
        titre: 'Bambu Lab X2 : multi-matériaux automatique',
        description: 'Bambu Lab lance la X2 capable d\\'imprimer 16 matériaux différents dans une seule pièce. Changement automatique, purge optimisée et calibration IA.',
        image: 'bambu-x2.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-05',
        tags: ['bambulab', 'x2', 'multicolor', '3dprint'],
        hot: true,
        categorie_id: 13,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Prusa XL2 : grand format et fiabilité',
        description: 'Prusa agrandit son flagship avec un volume de 450x450x450mm. Multi-têtes pour l\\'impression multi-matériaux et support soluble.',
        image: 'prusa-xl2.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-15',
        tags: ['prusa', 'xl', 'opensource', 'pro'],
        hot: false,
        categorie_id: 13,
        lien: null,
        ordre: 2
      },
      {
        titre: 'Formlabs Form 5 : résine industrielle accessible',
        description: 'Le Form 5 apporte la précision industrielle (25 microns) aux créateurs et PME à 3999€. Nouvelles résines techniques pour le prototypage fonctionnel.',
        image: 'formlabs-form5.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-22',
        tags: ['formlabs', 'resine', 'sla', 'pro'],
        hot: false,
        categorie_id: 13,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'Core XY haute vitesse',
        description: 'Les cinématiques Core XY atteignent 600mm/s avec une qualité préservée grâce à l\\'analyse vibratoire IA.',
        icone: 'speed',
        taux_adoption: 65,
        categorie_id: 13,
        ordre: 1
      },
      {
        nom: 'Calibration IA automatique',
        description: 'Les imprimantes s\\'auto-calibrent en analysant les premières couches par caméra et IA.',
        icone: 'ai',
        taux_adoption: 50,
        categorie_id: 13,
        ordre: 2
      },
      {
        nom: 'Matériaux composites',
        description: 'Fibres de carbone, kevlar et verre sont désormais imprimables sur machines prosumer.',
        icone: 'material',
        taux_adoption: 35,
        categorie_id: 13,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché impression 3D',
        valeur: '28 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 13,
        ordre: 1
      },
      {
        label: 'Part segment prosumer',
        valeur: '38%',
        tendance: 'up',
        icone: 'pie',
        categorie_id: 13,
        ordre: 2
      },
      {
        label: 'Croissance FDM',
        valeur: '+22%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 13,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Démocratisation du multi-matériaux',
        description: 'L\\'impression multi-couleurs et multi-matériaux devient accessible au grand public. Les pièces fonctionnelles avec parties flexibles et rigides sont réalisables à domicile.',
        icone: 'print',
        categorie_id: 13,
        ordre: 1
      },
      {
        titre: 'Impression 3D dans l\\'industrie',
        description: 'L\\'impression 3D passe du prototypage à la production. Les pièces finies en petites séries sont désormais compétitives face à l\\'injection plastique.',
        icone: 'factory',
        categorie_id: 13,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Impression métal accessible',
        description: 'Les premières imprimantes métal sous 10 000€ arriveront pour les PME.',
        icone: 'metal',
        probabilite: 60,
        categorie_id: 13,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Impression multi-matériaux standard',
        description: 'Toutes les imprimantes milieu de gamme supporteront le multi-matériaux.',
        icone: 'print',
        probabilite: 80,
        categorie_id: 13,
        ordre: 2
      },
      {
        annee: 2028,
        titre: 'Bio-impression grand public',
        description: 'L\\'impression de matériaux biocompatibles sera accessible aux makers.',
        icone: 'bio',
        probabilite: 45,
        categorie_id: 13,
        ordre: 3
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 14 : PÉRIPHÉRIQUES
  // ============================================================================
  14: {
    actualites: [
      {
        titre: 'Logitech G Pro X 3 : souris gaming 8000Hz',
        description: 'Logitech repousse les limites avec une souris polling à 8000Hz. Le capteur HERO 3 atteint 44 000 DPI et le châssis carbone pèse seulement 52g.',
        image: 'logitech-gpro-x3.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-03',
        tags: ['logitech', 'souris', 'gaming', '8000hz'],
        hot: true,
        categorie_id: 14,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Razer Huntsman V4 : clavier optique analogique',
        description: 'Razer combine switches optiques et lecture analogique. Chaque touche détecte la pression de 0 à 100%, révolutionnant le contrôle en jeu.',
        image: 'razer-huntsman-v4.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-12',
        tags: ['razer', 'clavier', 'optique', 'analogique'],
        hot: true,
        categorie_id: 14,
        lien: null,
        ordre: 2
      },
      {
        titre: 'SteelSeries Arctis Nova Pro 2 : son Dolby Atmos natif',
        description: 'L\\'Arctis Nova Pro 2 intègre le décodage Dolby Atmos hardware. Le DAC externe Hi-Res certifié offre un son 24 bits/96kHz.',
        image: 'steelseries-arctis-nova2.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-20',
        tags: ['steelseries', 'casque', 'atmos', 'gaming'],
        hot: false,
        categorie_id: 14,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'Polling rate 8000Hz+',
        description: 'Les souris gaming atteignent 8000Hz de polling rate pour une latence sub-milliseconde.',
        icone: 'mouse',
        taux_adoption: 30,
        categorie_id: 14,
        ordre: 1
      },
      {
        nom: 'Switches optiques magnétiques',
        description: 'Les claviers combinent optique (vitesse) et magnétique (lecture analogique) pour le meilleur des deux mondes.',
        icone: 'keyboard',
        taux_adoption: 35,
        categorie_id: 14,
        ordre: 2
      },
      {
        nom: 'Wireless lossless',
        description: 'Les périphériques sans fil atteignent la latence et la qualité du filaire.',
        icone: 'wireless',
        taux_adoption: 70,
        categorie_id: 14,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché périphériques gaming',
        valeur: '8.5 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 14,
        ordre: 1
      },
      {
        label: 'Part Logitech',
        valeur: '32%',
        tendance: 'stable',
        icone: 'pie',
        categorie_id: 14,
        ordre: 2
      },
      {
        label: 'Croissance sans fil',
        valeur: '+35%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 14,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Sans fil = nouveau standard gaming',
        description: 'Les périphériques sans fil ont rattrapé puis dépassé le filaire en latence. Les pros esport adoptent massivement le wireless.',
        icone: 'wireless',
        categorie_id: 14,
        ordre: 1
      },
      {
        titre: 'Personnalisation extrême',
        description: 'Les gamers veulent des périphériques uniques. Switches interchangeables, keycaps custom, shells modulaires : la personnalisation explose.',
        icone: 'customize',
        categorie_id: 14,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: '16000Hz polling rate',
        description: 'Les souris atteindront 16000Hz, repoussant encore les limites de la latence.',
        icone: 'mouse',
        probabilite: 70,
        categorie_id: 14,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Claviers tout analogique',
        description: 'Les claviers avec toutes les touches analogiques deviendront courants.',
        icone: 'keyboard',
        probabilite: 75,
        categorie_id: 14,
        ordre: 2
      },
      {
        annee: 2027,
        titre: 'Périphériques IA intégrée',
        description: 'Les périphériques embarqueront une IA pour s\\'adapter au style de jeu.',
        icone: 'ai',
        probabilite: 55,
        categorie_id: 14,
        ordre: 3
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 15 : TABLEAU INTERACTIF
  // ============================================================================
  15: {
    actualites: [
      {
        titre: 'SMART Board MX Pro V5 : collaboration IA',
        description: 'SMART intègre l\\'IA pour la transcription temps réel, la traduction et le résumé automatique des sessions. Écran 4K 86 pouces avec 40 points de contact.',
        image: 'smart-mx-v5.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-05',
        tags: ['smart', 'tableau', 'education', 'ia'],
        hot: true,
        categorie_id: 15,
        lien: null,
        ordre: 1
      },
      {
        titre: 'ViewSonic ViewBoard 8600 : intégration Teams/Zoom native',
        description: 'ViewSonic propose l\\'intégration la plus poussée avec Teams et Zoom. Caméra 4K intégrée, annulation de bruit IA et partage d\\'écran one-touch.',
        image: 'viewsonic-8600.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-15',
        tags: ['viewsonic', 'visio', 'collaboration', 'hybrid'],
        hot: false,
        categorie_id: 15,
        lien: null,
        ordre: 2
      },
      {
        titre: 'BenQ Board RP04 : résistant pour l\\'éducation',
        description: 'BenQ cible les écoles avec un écran ultra-résistant (certification IP5X), antibactérien et avec gestion de classe intégrée.',
        image: 'benq-rp04.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-22',
        tags: ['benq', 'education', 'resistant', 'ecole'],
        hot: false,
        categorie_id: 15,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'InGlass Touch',
        description: 'La technologie tactile intégrée au verre offre une précision et une durabilité supérieures.',
        icone: 'touch',
        taux_adoption: 60,
        categorie_id: 15,
        ordre: 1
      },
      {
        nom: 'IA collaborative',
        description: 'L\\'IA transcrit, traduit et résume les réunions en temps réel sur le tableau.',
        icone: 'ai',
        taux_adoption: 30,
        categorie_id: 15,
        ordre: 2
      },
      {
        nom: 'Cloud whiteboard',
        description: 'Les tableaux se synchronisent avec les services cloud (OneNote, Miro, Jamboard) en temps réel.',
        icone: 'cloud',
        taux_adoption: 75,
        categorie_id: 15,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché tableaux interactifs',
        valeur: '6.8 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 15,
        ordre: 1
      },
      {
        label: 'Segment éducation',
        valeur: '62%',
        tendance: 'stable',
        icone: 'school',
        categorie_id: 15,
        ordre: 2
      },
      {
        label: 'Croissance entreprise',
        valeur: '+28%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 15,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'Travail hybride : le tableau essentiel',
        description: 'Les salles de réunion hybrides nécessitent des tableaux interactifs avec visioconférence intégrée. L\\'équipement devient standard dans les bureaux post-COVID.',
        icone: 'meeting',
        categorie_id: 15,
        ordre: 1
      },
      {
        titre: 'Éducation : digitalisation accélérée',
        description: 'Les écoles accélèrent l\\'équipement en tableaux interactifs. Les financements publics soutiennent la modernisation des salles de classe.',
        icone: 'school',
        categorie_id: 15,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'IA assistant de cours standard',
        description: 'Les tableaux éducatifs intégreront un assistant IA pédagogique.',
        icone: 'ai',
        probabilite: 70,
        categorie_id: 15,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Écrans flexibles muraux',
        description: 'Les premiers écrans flexibles couvrant des murs entiers apparaîtront.',
        icone: 'screen',
        probabilite: 45,
        categorie_id: 15,
        ordre: 2
      },
      {
        annee: 2028,
        titre: 'Holographie collaborative',
        description: 'L\\'intégration de l\\'holographie permettra la collaboration 3D.',
        icone: 'hologram',
        probabilite: 35,
        categorie_id: 15,
        ordre: 3
      }
    ]
  },

  // ============================================================================
  // CATÉGORIE 16 : VIDÉO PROJECTEUR
  // ============================================================================
  16: {
    actualites: [
      {
        titre: 'Samsung The Premiere 3 : laser triple 8K',
        description: 'Samsung présente The Premiere 3 avec technologie laser RGB triple offrant 100% du DCI-P3. Résolution native 8K et focale ultra-courte pour 150 pouces à 30cm du mur.',
        image: 'samsung-premiere-3.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-03',
        tags: ['samsung', 'projecteur', 'laser', '8k'],
        hot: true,
        categorie_id: 16,
        lien: null,
        ordre: 1
      },
      {
        titre: 'Epson EpiqVision Ultra LS900 : gaming 240Hz',
        description: 'Epson cible les gamers avec un projecteur laser 4K/240Hz. Input lag de 4ms et mode gaming automatique via HDMI 2.1.',
        image: 'epson-ls900.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-12',
        tags: ['epson', 'gaming', 'laser', '240hz'],
        hot: true,
        categorie_id: 16,
        lien: null,
        ordre: 2
      },
      {
        titre: 'XGIMI Horizon Max : portable et puissant',
        description: 'XGIMI combine portabilité et performance : 3500 lumens ANSI, 4K HDR, système audio Harman Kardon intégré et batterie optionnelle.',
        image: 'xgimi-horizon-max.jpg',
        video_url: null,
        date_publication: '${annee}-${moisNum}-20',
        tags: ['xgimi', 'portable', '4k', 'smart'],
        hot: false,
        categorie_id: 16,
        lien: null,
        ordre: 3
      }
    ],
    technologies: [
      {
        nom: 'Laser RGB triple',
        description: 'Les lasers RGB remplacent les lampes avec 100% du gamut DCI-P3 et une durée de vie de 30 000 heures.',
        icone: 'laser',
        taux_adoption: 45,
        categorie_id: 16,
        ordre: 1
      },
      {
        nom: 'Ultra Short Throw (UST)',
        description: 'Les projecteurs UST affichent 100+ pouces à quelques centimètres du mur, remplaçant les TV géantes.',
        icone: 'projector',
        taux_adoption: 55,
        categorie_id: 16,
        ordre: 2
      },
      {
        nom: 'Smart OS intégré',
        description: 'Les projecteurs embarquent Android TV ou Google TV avec apps streaming natives.',
        icone: 'smart',
        taux_adoption: 80,
        categorie_id: 16,
        ordre: 3
      }
    ],
    marche: [
      {
        label: 'Marché projecteurs',
        valeur: '9.2 Mds $',
        tendance: 'up',
        icone: 'dollar',
        categorie_id: 16,
        ordre: 1
      },
      {
        label: 'Segment home cinéma',
        valeur: '+32%',
        tendance: 'up',
        icone: 'chart',
        categorie_id: 16,
        ordre: 2
      },
      {
        label: 'Part laser du marché',
        valeur: '58%',
        tendance: 'up',
        icone: 'pie',
        categorie_id: 16,
        ordre: 3
      }
    ],
    insights: [
      {
        titre: 'UST vs TV géantes : le match',
        description: 'Les projecteurs ultra-courte focale rivalisent désormais avec les TV 85"+ en qualité d\\'image. Prix équivalent, taille d\\'écran bien supérieure : le choix se fait sur l\\'usage.',
        icone: 'versus',
        categorie_id: 16,
        ordre: 1
      },
      {
        titre: 'Gaming sur grand écran',
        description: 'Les projecteurs gaming avec HDMI 2.1 et faible input lag attirent les joueurs voulant une expérience immersive sur 100+ pouces.',
        icone: 'gamepad',
        categorie_id: 16,
        ordre: 2
      }
    ],
    predictions: [
      {
        annee: 2026,
        titre: 'Projecteurs 8K sous 5000€',
        description: 'Les premiers projecteurs 8K accessibles arriveront sous 5000€.',
        icone: '8k',
        probabilite: 75,
        categorie_id: 16,
        ordre: 1
      },
      {
        annee: 2027,
        titre: 'Fin des lampes',
        description: 'Les projecteurs à lampe disparaîtront au profit exclusif du laser et LED.',
        icone: 'laser',
        probabilite: 85,
        categorie_id: 16,
        ordre: 2
      },
      {
        annee: 2028,
        titre: 'Projection holographique grand public',
        description: 'Les premiers projecteurs holographiques pour le salon arriveront.',
        icone: 'hologram',
        probabilite: 40,
        categorie_id: 16,
        ordre: 3
      }
    ]
  }

};

async function ajouterContenu() {
  const client = await pool.connect();
  
  try {
    console.log('\\n🚀 Ajout du contenu éditorial ${mois} ${annee}...\\n');
    
    for (const [categorieId, contenu] of Object.entries(contenu${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee})) {
      console.log(\`\\n📂 Catégorie ID: \${categorieId}\`);
      
      // Actualités (colonnes: titre, description, image, video_url, date_publication, tags, hot, categorie_id, lien, ordre)
      for (const actu of contenu.actualites) {
        await client.query(\`
          INSERT INTO actualites (
            titre, description, image, video_url, date_publication,
            tags, hot, categorie_id, lien, ordre
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        \`, [
          actu.titre, actu.description, actu.image, actu.video_url,
          actu.date_publication, actu.tags, actu.hot, actu.categorie_id,
          actu.lien, actu.ordre
        ]);
        console.log(\`  ✅ Actualité: \${actu.titre}\`);
      }

      // Technologies (colonnes: nom, description, icone, taux_adoption, categorie_id, ordre)
      for (const tech of contenu.technologies) {
        await client.query(\`
          INSERT INTO technologies (
            nom, description, icone, taux_adoption, categorie_id, ordre
          ) VALUES ($1, $2, $3, $4, $5, $6)
        \`, [
          tech.nom, tech.description, tech.icone, tech.taux_adoption,
          tech.categorie_id, tech.ordre
        ]);
        console.log(\`  ✅ Technologie: \${tech.nom}\`);
      }

      // Marché (colonnes: label, valeur, tendance, icone, categorie_id, ordre)
      for (const data of contenu.marche) {
        await client.query(\`
          INSERT INTO marche (
            label, valeur, tendance, icone, categorie_id, ordre
          ) VALUES ($1, $2, $3, $4, $5, $6)
        \`, [
          data.label, data.valeur, data.tendance, data.icone,
          data.categorie_id, data.ordre
        ]);
        console.log(\`  ✅ Marché: \${data.label}\`);
      }

      // Insights (colonnes: titre, description, icone, categorie_id, ordre)
      for (const insight of contenu.insights) {
        await client.query(\`
          INSERT INTO insights (
            titre, description, icone, categorie_id, ordre
          ) VALUES ($1, $2, $3, $4, $5)
        \`, [
          insight.titre, insight.description, insight.icone,
          insight.categorie_id, insight.ordre
        ]);
        console.log(\`  ✅ Insight: \${insight.titre}\`);
      }

      // Prédictions (colonnes: annee, titre, description, icone, probabilite, categorie_id, ordre)
      for (const pred of contenu.predictions) {
        await client.query(\`
          INSERT INTO predictions (
            annee, titre, description, icone, probabilite, categorie_id, ordre
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        \`, [
          pred.annee, pred.titre, pred.description, pred.icone,
          pred.probabilite, pred.categorie_id, pred.ordre
        ]);
        console.log(\`  ✅ Prédiction \${pred.annee}: \${pred.titre}\`);
      }
    }
    
    console.log('\\n✨ Contenu éditorial ajouté avec succès!\\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

ajouterContenu();
`;
}

/**
 * Génère le template de script tendances
 */
function genererTemplateScriptTendances(mois, annee) {
  return `/**
 * Script d'ajout des tendances globales de ${mois.charAt(0).toUpperCase() + mois.slice(1)} ${annee}
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

const tendances${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee} = [
  {
    titre: 'Tendance globale 1',
    description: 'Analyse transversale complète (400-600 mots). Cette tendance impacte plusieurs secteurs...',
    categorie: 'Tendances',
    tags: ['ai', 'innovation', 'futur'],
    created_at: '${annee}-${mois === 'fevrier' ? '02' : '01'}-01'
  },
  {
    titre: 'Tendance globale 2',
    description: 'Autre analyse cross-catégorie...',
    categorie: 'Tendances',
    tags: ['cloud', 'gaming', 'streaming'],
    created_at: '${annee}-${mois === 'fevrier' ? '02' : '01'}-05'
  },
  // TODO: Ajouter 8-13 tendances supplémentaires
];

async function ajouterTendances() {
  const client = await pool.connect();
  
  try {
    console.log('\\n🚀 Ajout des tendances ${mois} ${annee}...\\n');
    
    for (const tendance of tendances${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee}) {
      await client.query(\`
        INSERT INTO tendances (titre, description, categorie, tags, created_at)
        VALUES ($1, $2, $3, $4, $5)
      \`, [
        tendance.titre,
        tendance.description,
        tendance.categorie,
        \`{\${tendance.tags.join(',')}}\`,
        tendance.created_at
      ]);
      
      console.log(\`✅ \${tendance.titre}\`);
    }
    
    console.log(\`\\n✨ \${tendances${mois.charAt(0).toUpperCase() + mois.slice(1)}${annee}.length} tendances ajoutées!\\n\`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

ajouterTendances();
`;
}

/**
 * Fonction principale
 */
async function main() {
  try {
    // 1. Récupérer les statistiques actuelles
    console.log('📊 Analyse de la base de données actuelle...\n');
    const stats = await getStatistiquesContenu();
    
    console.log('📈 Statistiques actuelles:');
    console.log(`   • Produits: ${stats.produits}`);
    console.log(`   • Catégories: ${stats.categories}`);
    console.log(`   • Actualités: ${stats.actualites}`);
    console.log(`   • Technologies: ${stats.technologies}`);
    console.log(`   • Marché: ${stats.marche}`);
    console.log(`   • Insights: ${stats.insights}`);
    console.log(`   • Prédictions: ${stats.predictions}\n`);
    
    // 2. Déterminer les prochains IDs
    const dernierID = await getDernierIdProduit();
    const prochainIDs = genererProchainIDs(dernierID, 12);
    
    console.log('🆔 IDs produits:');
    console.log(`   • Dernier ID actuel: ${dernierID}`);
    console.log(`   • Prochains IDs: ${prochainIDs[0]} à ${prochainIDs[11]}\n`);
    
    // 3. Créer les dossiers si nécessaire
    const dirProducts = path.join(__dirname, '..', 'products');
    const dirContent = path.join(__dirname, '..', 'content');
    const dirTendances = path.join(__dirname, '..', 'tendances');
    
    [dirProducts, dirContent, dirTendances].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // 4. Générer les templates de scripts
    console.log('📝 Génération des templates de scripts...\n');
    
    const scriptProduits = genererTemplateScriptProduits(mois, annee, prochainIDs);
    const scriptContenu = genererTemplateScriptContenu(mois, annee);
    const scriptTendances = genererTemplateScriptTendances(mois, annee);
    
    const fichierProduits = path.join(dirProducts, `add-${mois}-${annee}-products.js`);
    const fichierContenu = path.join(dirContent, `add-${mois}-${annee}-content.js`);
    const fichierTendances = path.join(dirTendances, `add-${mois}-${annee}-tendances.js`);
    
    fs.writeFileSync(fichierProduits, scriptProduits);
    fs.writeFileSync(fichierContenu, scriptContenu);
    fs.writeFileSync(fichierTendances, scriptTendances);
    
    console.log('✅ Templates générés:');
    console.log(`   • ${fichierProduits}`);
    console.log(`   • ${fichierContenu}`);
    console.log(`   • ${fichierTendances}\n`);
    
    // 5. Afficher les catégories
    console.log('📂 Catégories à couvrir:\n');
    Object.entries(CATEGORIES).forEach(([id, cat]) => {
      const prioriteSymbol = cat.priorite === 'haute' ? '⭐⭐⭐' : 
                             cat.priorite === 'moyenne' ? '⭐⭐' : '⭐';
      console.log(`   ${id.padStart(2, ' ')}. ${cat.nom.padEnd(20, ' ')} [${cat.slug}] ${prioriteSymbol}`);
    });
    
    // 6. Checklist (16 catégories)
    const nbCategories = Object.keys(CATEGORIES).length;
    console.log('\n\n✅ CHECKLIST DE MISE À JOUR:\n');
    console.log('   [ ] Compléter les 12 produits dans le script produits');
    console.log(`   [ ] Rédiger 3-5 actualités × ${nbCategories} catégories`);
    console.log(`   [ ] Identifier 3-4 technologies × ${nbCategories} catégories`);
    console.log(`   [ ] Collecter 3-4 données marché × ${nbCategories} catégories`);
    console.log(`   [ ] Écrire 2-3 insights × ${nbCategories} catégories`);
    console.log(`   [ ] Formuler 4-5 prédictions × ${nbCategories} catégories`);
    console.log('   [ ] Vérifier les images (noms sans espaces ni accents)');
    console.log('   [ ] Marquer 3-4 produits top_du_mois: true');
    console.log('   [ ] Tester les scripts en environnement dev');
    console.log('   [ ] Backup de la base avant déploiement');
    console.log('   [ ] Exécuter les scripts en production');
    console.log('   [ ] Régénérer toutes les fiches HTML\n');
    
    console.log('📚 Consultez MONTHLY-UPDATE-TEMPLATE.md pour plus de détails\n');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await pool.end();
  }
}

main();
