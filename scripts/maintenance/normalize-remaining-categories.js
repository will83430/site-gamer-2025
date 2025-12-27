async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_46',
      donnees: [
        'Box fibre haut de gamme avec services TV et securite renforcee.',
        '💰 49,99 €/mois – abonnement fibre + TV + options premium.',
        '🧩 Materiel\n - Processeur : Intel Core i7\n - RAM : 16 Go\n - Stockage : SSD 512 Go\n - Ports : Ethernet, USB-C, HDMI',
        '🌐 Connectivite et reseau\n - Wi-Fi 6 et Bluetooth 5.2\n - Debits fibre tres haut debit\n - Reseau maillable, IPv6, QoS, controle parental',
        '🎮 Experience multimedia\n - Interface FreeOS intuitive\n - TV 4K HDR, Dolby Atmos\n - Telecommande vocale, services streaming',
        '🛡️ Securite\n - Firewall integre et filtrage avance\n - Supervision via Freebox Connect',
        '⚙️ Services inclus\n - Telephonie fixe et stockage local\n - Compatibilite Freebox Connect et applications Free',
        '🔧 Installation\n - Plug-and-play avec accompagnement\n - Echange express en cas de panne',
        '🛡️ Garantie et support\n - Garantie 2 ans\n - Assistance 24/7 via l’application',
        '📦 Contenu de la boite\n - Freebox Ultra\n - Boitier TV et alimentation\n - Cables reseau/HDMI\n - Telecommande et documentation',
      ],
    },
    {
      id: 'prod_22',
      donnees: [
        'Console portable Windows 11 haut de gamme orientee PC gaming en mobilite.',
        '💰 A partir de 899 € – Ryzen Z1 Extreme, 24 Go LPDDR5X, SSD 1 To, ecran 7" 120 Hz.',
        '🧩 Materiel\n - Processeur : AMD Ryzen Z1 Extreme\n - RAM : 24 Go LPDDR5X\n - Stockage : SSD M.2 1 To\n - Refroidissement : systeme silencieux optimise\n - Connectique : USB-C, Wi-Fi 6E, Bluetooth 5.2',
        '🖥️ Ecran\n - IPS 7" Full HD 1920×1080\n - 120 Hz avec FreeSync Premium',
        '🕹️ Commandes\n - Joysticks et gachettes a effet Hall\n - Armory Crate SE sous Windows 11\n - Compatibilite Game Pass, Steam, Epic',
        '🎮 Usage\n - Jeux AAA en mobilite\n - Ideal pour gamers nomades',
        '🔋 Autonomie\n - Batterie 80 Wh jusqu’a ~6h30\n - Charge rapide via USB-C',
        '🌐 Connectivite\n - Wi-Fi 6E, Bluetooth 5.2\n - USB-C pour dock/affichage',
        '🛡️ Garantie et support\n - Garantie constructeur (selon region)\n - Support Asus ROG',
        '📦 Contenu de la boite\n - ROG Ally X\n - Alimentation USB-C\n - Documentation',
      ],
    },
    {
      id: 'prod_37',
      donnees: [
        'Console next-gen compacte avec design Slim et performances 4K.',
        '💰 499,00 € – CPU Zen 2 8 coeurs, GPU RDNA 2 ray tracing, SSD 1 To.',
        '🧩 Specifications materielles\n - CPU : AMD Ryzen Zen 2 8 coeurs 3.5 GHz\n - GPU : RDNA 2 avec ray tracing\n - RAM : 16 Go GDDR6\n - Stockage : SSD 1 To NVMe\n - Connectique : HDMI 2.1, USB-C/USB-A, Wi-Fi 6, Bluetooth 5.1',
        '🖥️ Affichage\n - Jeux jusqu’en 4K HDR\n - 120 fps avec VRR/ALLM selon titre',
        '🕹️ Controles\n - Manette DualSense avec retour haptique et gachettes adaptatives\n - Lecteur Blu-ray selon version',
        '🎮 Experience de jeu\n - Interface rapide, partage et captures\n - Catalogue PS5 + retrocompatibilite PS4',
        '🌐 Services\n - PlayStation Plus, cloud saves, jeux en ligne',
        '🔊 Audio\n - Tempest 3D Audio pour casques/TV compatibles',
        '🛡️ Garantie et support\n - Garantie constructeur\n - Options Sony (selon region)',
        '📦 Contenu de la boite\n - Console PS5 Slim\n - Manette DualSense\n - Cable HDMI, alimentation\n - Guide rapide',
      ],
    },
    {
      id: 'prod_40',
      donnees: [
        'Console 4K puissante concue pour le jeu haute frequence avec VRR et ray tracing.',
        '💰 A partir de 499€ – GPU 12 TFLOPS, SSD NVMe 1 To.',
        '🧩 Specifications materielles\n - 4K UHD, HDR10\n - Taux jusqu’a 120 Hz avec VRR/ALLM\n - Stockage : SSD NVMe 1 To\n - Ports : HDMI 2.1, USB, Ethernet',
        '🖥️ Affichage\n - 4K native selon jeu\n - Dolby Vision/Atmos si compatible',
        '🕹️ Controles\n - Manette sans fil ergonomique\n - Retrocompatibilite accessoires Xbox',
        '🌐 Connectivite\n - Wi-Fi 6, Ethernet Gigabit, Bluetooth 5.2\n - 3 ports USB, sortie HDMI 2.1',
        '🎮 Experience de jeu\n - Quick Resume multi jeux\n - Cloud gaming Xbox et partage instantane',
        '💾 Compatibilite\n - Retrocompatibilite large catalogue Xbox One/360/OG',
        '🛡️ Garantie et support\n - 2 ans constructeur (selon region)\n - Support Microsoft',
        '📦 Contenu de la boite\n - Xbox Series X\n - Manette sans fil\n - Cable HDMI\n - Alimentation et guide',
      ],
    },
    {
      id: 'prod_41',
      donnees: [
        'Console hybride 1080p portable / 4K docke avec compatibilite accessoires Switch 1.',
        '💰 469 € – SoC Tegra X2 custom, 12 Go RAM, 256 Go extensible.',
        '🧩 Specifications materielles\n - Processeur custom NVIDIA Tegra X2\n - RAM : 12 Go LPDDR5\n - Stockage : 256 Go + microSD\n - Dock avec port Ethernet',
        '🖥️ Ecran et affichage\n - OLED 7.5" 1080p portable\n - 4K en mode docke\n - 120 Hz',
        '🕹️ Controles\n - Joy-Con 2 avec retour haptique HD Rumble 2\n - Manette Pro 2 avec boutons arriere\n - Bouton GameChat integre',
        '🌐 Connectivite\n - Wi-Fi 6E, Bluetooth 5.2\n - Synchronisation rapide accessoires Switch 1',
        '🎮 Experience de jeu\n - Interface retravaillee multi-utilisateur\n - Chat vocal integre et acces rapide aux jeux',
        '🔋 Autonomie\n - Optimisee pour jeu nomade (selon usage)\n - Charge via USB-C',
        '🛡️ Garantie et support\n - Garantie constructeur Nintendo\n - Support en ligne',
        '📦 Contenu de la boite\n - Console Switch 2 Pro\n - Dock\n - Joy-Con 2 et dragonnes\n - Cables et documentation',
      ],
    },
    {
      id: 'prod_51',
      donnees: [
        'Console portable gaming avec manettes detachables et ecran 8.8" 144 Hz.',
        '💰 899,99 € – Ryzen Z2 Extreme, 16 Go LPDDR5X, SSD 1 To, ecran QHD+ 144 Hz.',
        '🧩 Specifications materielles\n - Processeur : AMD Ryzen Z2 Extreme\n - GPU : Radeon 780M integre\n - RAM : 16 Go LPDDR5X 7500 MHz\n - Stockage : SSD NVMe 1 To\n - Ports : USB-C 4.0 x2, USB-A 3.2, jack 3.5 mm',
        '🖥️ Ecran\n - 8.8" QHD+ IPS\n - 144 Hz pour fluidite',
        '🕹️ Commandes\n - Manettes Legion TrueStrike detachables\n - Mode souris/trackpad et gyroscope',
        '🎮 Gaming et performances\n - 60+ fps en 1080p sur AAA (selon reglages)\n - Compatibilite Steam, Game Pass, Epic\n - Mode TV via dock 4K 120 Hz',
        '🌐 Connectivite\n - Wi-Fi 6E et Bluetooth 5.3\n - USB-C 4.0 pour affichage/charge',
        '🔋 Autonomie\n - Batterie 49.2 Wh\n - 2-4 h de jeu, charge rapide 65 W USB-C',
        '🛡️ Support et garantie\n - Garantie Lenovo 2 ans\n - Support Legion 24/7',
        '📦 Accessoires inclus\n - Console Legion Go S\n - Adaptateur 65 W USB-C\n - Housse de transport\n - Guide',
      ],
    },
    {
      id: 'prod_24',
      donnees: [
        'Imprimante 3D polyvalente pour makers et prototypage domestique.',
        '💰 A partir de 399 € – volume 220×220×250 mm, double extrusion et auto-nivellement.',
        '🧩 Specifications materielles\n - Volume 220×220×250 mm\n - Buse 260°C et plateau chauffant\n - Double extrusion et auto-nivellement',
        '🖨️ Fonctions d’impression\n - Reprise apres coupure\n - Detection fin de filament\n - Impression multi-materiaux',
        '🌐 Connectivite\n - USB, carte SD, Wi-Fi\n - Controle et supervision via appli mobile',
        '🎛️ Logiciel\n - Creality Print inclus\n - Profils prets a l’emploi',
        '🎮 Experience utilisateur\n - Interface tactile simple\n - Fonctionnement silencieux pour bureau/atelier',
        '🛡️ Garantie et support\n - Support Creality\n - Ressources communautaires',
        '📦 Contenu de la boite\n - Ender 5 Neo\n - Plateau, cables, outils\n - Documentation',
      ],
    },
    {
      id: 'prod_25',
      donnees: [
        'Imprimante 3D rapide et abordable pour projets domestiques ou educatifs.',
        '💰 329,00 € – volume 220×220×250 mm, jusqu’a 600 mm/s, auto-nivellement.',
        '🧩 Specifications materielles\n - Volume 220×220×250 mm\n - Vitesse jusqu’a 600 mm/s, precision ±0.1 mm\n - Plateau auto-nivellement, surface magnetique\n - Direct Drive et double axe Z',
        '🖨️ Fonctions d’impression\n - Reprise apres coupure\n - Interface tactile intuitive\n - Impression silencieuse optimisee',
        '🌐 Connectivite\n - Carte SD, USB-C, Wi-Fi (modulable)',
        '🎮 Experience utilisateur\n - Assemblage rapide\n - Ideale ateliers, education, prototypage',
        '🛡️ Garantie et support\n - Support Creality\n - Communaute active',
        '📦 Contenu de la boite\n - Ender 3 V3\n - Surface magnetique\n - Cables, outils, documentation',
      ],
    },
    {
      id: 'prod_26',
      donnees: [
        'Imprimante 3D resine ultra precise 14K pour figurines, bijoux et prototypes pros.',
        '💰 A partir de 562 € – volume 223×126×230 mm, LCD 14K, vitesse jusqu’a 150 mm/h.',
        '🧩 Specifications materielles\n - Volume 223×126×230 mm\n - Ecran mono LCD 10.1" 14K (13320×5120)\n - Source lumineuse integrale 3.0 (>90% uniformite)\n - Hauteur de couche 50-200 microns\n - Bruit <49 dB',
        '🖨️ Fonctions d’impression\n - Mode Dynax+ jusqu’a 150 mm/h\n - Film Pictor 3 couches\n - Plaque gravee laser pour adherence\n - Rails lineaires doubles sur axe Z',
        '🌐 Connectivite\n - USB, Wi-Fi, Ethernet\n - HALOT OS avec controle a distance\n - Creality Cloud / Halot Box / appli mobile',
        '🎮 Experience utilisateur\n - Calibration rapide\n - Ideale studios pros et makers exigeants',
        '🛡️ Garantie et support\n - Support Creality\n - Ressources en ligne',
        '📦 Contenu de la boite\n - Halot Mage S 14K\n - Accessoires de maintenance\n - Cables et guide',
      ],
    },
    {
      id: 'prod_60',
      donnees: [
        'Imprimante 3D rapide avec AMS 4 couleurs et detection IA pour production intensive.',
        '💰 1 449,99 € – vitesse 500 mm/s, volume 256×256×256 mm, AMS multi-materiaux.',
        '🧩 Specifications materielles\n - Volume 256×256×256 mm\n - AMS 4 couleurs\n - Extrudeur direct drive haute precision\n - Filtration de fumee integree',
        '⚡ Performance\n - Vitesse jusqu’a 500 mm/s\n - Detection d’erreurs LiDAR, reprise apres coupure\n - Fonctionnement 24/7',
        '🌐 Connectivite\n - Wi-Fi cloud integre, Ethernet optionnel\n - Application Bambu Studio\n - Mises a jour OTA',
        '🎮 Experience utilisateur\n - Ecran tactile 5"\n - Demarrage plug & play en 5 min\n - Compatible Cura/PrusaSlicer',
        '🎨 Materiaux\n - PLA, ABS, PETG, TPU\n - Changement de filament automatique',
        '🛡️ Garantie et support\n - Garantie 2 ans\n - Support Bambu Lab\n - Communaute makers active',
        '📦 Accessoires inclus\n - X1 Carbon\n - Systeme AMS 4 couleurs\n - Bobines echantillon, outils\n - Guide d’installation',
      ],
    },
    {
      id: 'prod_4',
      donnees: [
        'Serveur rack 4U tres haute performance pour charges critiques et cloud hybride.',
        '💰 A partir de 8 999 € – jusqu’a 4× Intel Xeon Gen5, 6 To DDR5 ECC, 32 SSD NVMe.',
        '🧩 Materiel\n - Format 4U avec rails coulissants\n - Processeurs : jusqu’a 4× Intel Xeon Gen5\n - RAM : jusqu’a 6 To DDR5 ECC\n - Stockage : jusqu’a 32 SSD NVMe U.2\n - Refroidissement : ventilateurs redondants',
        '🖥️ Virtualisation et calcul\n - Optimise pour VMware/Hyper-V/Proxmox\n - Conteneurs Docker/Kubernetes\n - Acceleration IA et analytics (selon config)',
        '🌐 Reseau\n - 4 ports 10/25/100 GbE\n - USB 3.2 et iDRAC9 pour gestion a distance\n - Redondance alimentation et reseau',
        '🔒 Securite\n - TPM 2.0, Secure Boot\n - BIOS/firmware auto-reparables\n - Supervision proactive avec IA',
        '🎮 Cas d’usage\n - Bases de donnees critiques\n - Virtualisation massive\n - Cloud hybride et edge',
        '🛡️ Garantie et support\n - Support Dell ProSupport (selon contrat)\n - Pieces et intervention sur site',
        '📦 Inclus\n - Serveur PowerEdge R960\n - Kits rails\n - Alimentation(s)\n - Documentation',
      ],
    },
    {
      id: 'prod_5',
      donnees: [
        'Serveur rack 2U haute performance pour virtualisation et cloud hybride.',
        '💰 A partir de 4 999 € – processeurs Intel Xeon, DDR5 ECC et stockage NVMe modulable.',
        '🧩 Materiel\n - Format 2U\n - Processeurs Intel Xeon\n - RAM DDR5 ECC (configurable)\n - Stockage NVMe/SAS modulable\n - Refroidissement redondant',
        '🖥️ Virtualisation et VDI\n - VMware/Hyper-V/Proxmox\n - Conteneurs Docker/Kubernetes\n - Infrastructure VDI',
        '🌐 Reseau\n - Ports 10/25/100 GbE selon carte\n - iDRAC9 pour gestion a distance\n - Redondance alimentation/reseau',
        '🔒 Securite\n - TPM 2.0, Secure Boot, MFA\n - Zero Trust et surveillance proactive',
        '🎮 Cas d’usage\n - Bases de donnees et analytics\n - IA/ML et hebergement web\n - Cloud prive et edge',
        '🛡️ Garantie et support\n - Services Dell (selon contrat)\n - Pieces et assistance sur site',
        '📦 Inclus\n - Serveur PowerEdge R760\n - Kits rails\n - Alimentation(s)\n - Documentation',
      ],
    },
    {
      id: 'prod_20',
      donnees: [
        'Tableau interactif UHD pour salles de classe et reunions collaboratives.',
        '💰 A partir de 2 199 € – tailles 65/75/85", tactile 20 points, stylet passif.',
        '🧩 Specifications materielles\n - Resolution UHD 3840×2160\n - Tactile capacitif 20 points\n - Stylet passif sans batterie\n - Systeme : Tizen OS Flip UI\n - Ports : HDMI, USB, LAN, Wi-Fi, Bluetooth',
        '🖥️ Collaboration\n - Partage d’ecran sans fil (AirPlay, Miracast)\n - Tableau blanc, annotation, export PDF/image\n - Multi-utilisateurs simultanes\n - Enregistrement local ou cloud',
        '🖊️ Interaction\n - Ecriture fluide, effacement main/doigt\n - Modes presentation et brainstorming\n - Acces Google Drive, Dropbox, OneDrive',
        '🌐 Connectivite\n - Acces Internet et applications web\n - Compatible Teams, Zoom, Meet\n - Controle a distance via smartphone',
        '🎮 Experience utilisateur\n - Interface Flip intuitive\n - Ideale education et reunions hybrides',
        '🛡️ Garantie et support\n - Garantie constructeur (selon region)\n - Support Samsung Pro',
        '📦 Contenu de la boite\n - Samsung Flip Pro\n - Stylets\n - Cables alimentation/HDMI\n - Fixations et guide',
      ],
    },
    {
      id: 'prod_21',
      donnees: [
        'Tableau interactif 4K UHD double systeme Android/Windows pour enseignement et reunion.',
        '💰 A partir de 3 599 € – 75", Android 12 + Windows 10, 8 Go RAM et 128 Go SSD.',
        '🧩 Specifications materielles\n - Taille 75 pouces, UHD 3840×2160\n - Tactile infrarouge 20 points\n - Stylet passif precision 2 mm\n - Dual boot Android 12.0 + Windows 10\n - Memoire : 8 Go RAM, 128 Go SSD\n - Ports : HDMI, USB-C, USB-A, LAN, Wi-Fi, Bluetooth',
        '🖥️ Collaboration\n - Ecriture fluide avec reconnaissance manuscrite IA\n - Annotation sur documents, images et videos\n - Multi-canvas et export PDF/QR',
        '🖊️ Interaction et partage\n - Partage d’ecran sans fil (AirPlay, Miracast)\n - Acces Drive/Dropbox/OneDrive\n - Compatible Zoom, Teams, Meet, Webex\n - Controle a distance via smartphone',
        '🌐 Connectivite\n - Internet et applications embarquees\n - Wi-Fi et Bluetooth integres',
        '🎮 Experience utilisateur\n - Concu pour classes et salles de reunion\n - Interface simple avec enregistrement local ou cloud',
        '🛡️ Garantie et support\n - Garantie constructeur\n - Support technique dedie',
        '📦 Contenu de la boite\n - Smart Board Explorer Elite Dual 75\n - Stylets\n - Cablage et kit de montage\n - Documentation',
      ],
    },
  ];

  for (const { id, donnees } of updates) {
    await pool.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [donnees, id]);
    console.log(`✅ donnees_fiche mis a jour pour ${id}`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
