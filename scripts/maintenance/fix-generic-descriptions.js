// Script pour corriger les descriptions génériques
const pool = require('../backend/config/database');

// Descriptions spécifiques par produit avec puces
const specificDescriptions = {
  'corsair-one-i500': `PC compact ultra-puissant avec RTX 5090 24 Go, processeur i9-14900K, 64 Go RAM et refroidissement liquide intégral pour des performances gaming exceptionnelles en 4K.

• Processeur Intel Core i9-14900K (24 cœurs)
• Carte graphique NVIDIA RTX 5090 24 Go GDDR7
• Refroidissement liquide personnalisé
• Design compact et élégant`,
  'garmin-fenix-8': `Montre GPS multisport professionnelle avec cartographie mondiale, capteurs santé avancés (ECG, SpO2), autonomie 30 jours et résistance 10 ATM pour les aventuriers.

• GPS multibande ultra-précis
• Capteurs santé avancés (ECG, SpO2)
• Écran AMOLED always-on
• Autonomie jusqu'à 30 jours`,
  'lg-oled65-g5': 'TV OLED 65" avec dalle Evo ultra lumineuse (2412 cd/m²), processeur Alpha 11 AI, 120 Hz natif, Dolby Vision IQ et design mural One Wall pour cinéphiles exigeants.',
  'lg-oled65-g3': 'Téléviseur OLED Evo 65" avec technologie MLA, luminosité 1490 cd/m², HDMI 2.1 pour gaming 120 Hz, webOS 23 et design ultra-fin pour home cinéma premium.',
  'insta360-x5': 'Caméra 360° professionnelle 8K avec double capteur 1/1.28", stabilisation FlowState, mode FreeFrame et étanchéité 10m pour créateurs immersifs.',
  'canon-eos-r6-mark-ii': 'Hybride plein format 24.2 MP avec Dual Pixel CMOS AF II, rafale 40 i/s, vidéo 4K 60p sans crop, stabilisation 8 stops pour photo/vidéo professionnelle.',
  'valerion-vision-master-pro-2': 'Vidéoprojecteur trilaser DLP 4K avec Dolby Vision, HDR10+, Google TV intégré, luminosité élevée et faible latence pour home cinéma et gaming.',
  'epson-eh-ls12000b': 'Vidéoprojecteur laser 3LCD 4K Pro-UHD avec 2700 lumens, HDR10+, contraste 2 500 000:1, lens shift motorisé et HDMI 2.1 pour projection premium.',
  'bose-quietcomfort-45': 'Casque circum-aural avec réduction de bruit active 3 modes, autonomie 24h, confort exceptionnel et son équilibré pour voyages et télétravail.',
  'sony-wh-1000xm5': 'Casque premium avec ANC optimisée par 8 micros IA, transducteurs 30mm, autonomie 30h, codec LDAC et design ultra-confortable pour immersion sonore totale.',
  'vibox-x-215-sg': 'PC gaming tour avec i9-12900K, RTX 4080, 32 Go DDR5, SSD 2 To NVMe, RGB personnalisable et refroidissement liquide pour jeux 4K et création.',
  'samsung-flip-pro-2025': 'Tableau interactif 75" tactile QLED avec 20 points de contact, stylet passif, Tizen OS, partage sans fil et modes collaboration pour salles de réunion.',
  'hkmlc-smart-board-explorer-elite-dual-75': 'Tableau interactif 75" 4K UHD dual OS Android 12 + Windows 10, 20 points tactiles, 8 Go RAM, Wi-Fi 6 pour éducation et entreprises.',
  'asus-rog-ally-x': 'Console portable Windows avec Ryzen Z1 Extreme, 24 Go RAM, écran 7" 120 Hz, SSD 1 To et batterie 80 Wh pour gaming AAA nomade.',
  'meta-quest-3': 'Casque VR standalone avec Snapdragon XR2 Gen2, passthrough couleur HD, 12 Go RAM, suivi mains/yeux et bibliothèque Meta Quest pour réalité mixte.',
  'creality-ender-5-neo': 'Imprimante 3D FDM 220×220×250mm avec auto-nivellement, plateau chauffant, double extrusion, vitesse optimisée et connectivité USB/SD/Wi-Fi.',
  'creality-ender-3-v3': 'Imprimante 3D populaire avec volume 220×220×250mm, Direct Drive, double axe Z, auto-nivellement, vitesse 600mm/s et structure métallique stable.',
  'creality-halot-mage-s-14k': 'Imprimante résine 14K (13320×5120px) avec écran mono LCD 10.1", vitesse Dynax+ 150mm/h, purification d\'air et précision 16.8µm pour figurines.',
  'dji-mavic-4-pro': 'Drone pliable avec capteur Hasselblad 4/3 20 MP, vidéo 8K/30fps, autonomie 45 min, détection d\'obstacles et transmission O4 15 km pour cinéastes.',
  'skydio-x10': 'Drone autonome avec IA d\'évitement, dual 48 MP RGB + thermique, vidéo 4K HDR/60fps, autonomie 40 min et résistance IP54 pour missions pro.',
  'dji-air-3s': 'Drone polyvalent avec double capteur 50 MP + 48 MP, vidéo 4K/60fps HDR, mode vertical, autonomie 45 min et détection LiDAR pour créateurs.',
  'asus-rog-strix-g18': 'PC portable gaming 18" avec Intel Core Ultra 9 275HX, RTX 5070, 32 Go DDR5, écran 240 Hz, refroidissement ROG et clavier RGB par touche.',
  'parrot-anafi-usa': 'Drone professionnel avec triple capteur RGB + télé + FLIR thermique, zoom ×32, vidéo 4K HDR, autonomie 32 min, chiffrement AES 512 bits pour missions critiques.',
  'dji-mini-5-pro': 'Drone ultra-léger 249g avec capteur 1" 20 MP, vidéo 5.3K/30fps HDR, détection LiDAR omnidirectionnelle, autonomie 38 min et portée 18 km.',
  'autel-nano-plus': 'Mini drone 249g avec capteur RYYB 50 MP, zoom ×16, vidéo 4K/30fps HDR, stabilisation 3 axes, autonomie 28 min pour voyage et vlog.',
  'autel-evo-max-5g': 'Drone compact 249g avec capteur CMOS 1" 20 MP, vidéo 5.3K/30fps, LiDAR, transmission 5G, autonomie 38 min et portée 10 km pour pros mobiles.',
  'apple-watch-series-9': 'Montre connectée avec puce S9 SiP, écran OLED 2" always-on, double tap gestuel, capteurs santé (ECG, SpO2), autonomie 18h et watchOS 10.',
  'apple-watch-series-10': 'Montre connectée ultra fine avec écran Retina 2.1" 2000 nits, S10 SiP, capteurs santé avancés, détection apnée sommeil, autonomie 18h et watchOS 11.',
  'honor-200-pro': 'Smartphone avec Snapdragon 8s Gen 3, écran OLED 6.78" 120Hz, triple capteur 50 MP Sony IMX906 + téléobjectif, batterie 5200 mAh et charge 100W.',
  'playstation-5-slim': 'Console next-gen compacte avec AMD Ryzen Zen 2 8 cœurs, GPU RDNA 2 ray tracing, SSD 1 To ultra-rapide, 4K HDR 120fps et design 30% plus fin.',
  'samsung-galaxy-tab-s10-fe': 'Tablette 10.9" AMOLED avec Snapdragon 8 Gen 2, 8 Go RAM, 256 Go, S Pen inclus, batterie 12h, One UI 7 et mode DeX pour productivité.',
  'microsoft-surface-pro-x-2025': 'Tablette hybride Windows ARM avec Microsoft SQ4, écran PixelSense 13" 120 Hz, 16 Go RAM, 512 Go SSD, Slim Pen 3 et autonomie optimisée.',
  'dell-poweredge-r960': 'Serveur rack 4U avec 4× Intel Xeon Gen5, jusqu\'à 6 To DDR5 ECC, 32× SSD NVMe, refroidissement redondant et iDRAC9 pour datacenters.',
  'xbox-series-x': 'Console 4K avec AMD Zen 2 8 cœurs 3.8 GHz, GPU RDNA 2 12 TFLOPS, SSD 1 To NVMe, ray tracing, Quick Resume et rétrocompatibilité Xbox.',
  'nintendo-switch-2-pro': 'Console hybride avec Tegra X2 custom, écran OLED 7.5" 1080p/4K docké, 12 Go RAM, 256 Go, Joy-Con 2 retour haptique HD Rumble et Wi-Fi 6E.',
  'drone-x-pro-2025': 'Drone pliable avec caméra HD 1080p, stabilisation 3 axes, mode panoramique/slow motion, capteur gravité, design compact et contrôle intuitif.',
  'google-pixel-10': 'Smartphone Google avec Tensor G5, écran AMOLED 6.3" QHD+ LTPO 144 Hz, triple capteur IA optimisé, 7 ans de MAJ Android et traduction instantanée.',
  'redmagic-astra': 'Tablette gaming avec écran AMOLED 144 Hz, refroidissement actif intégré, processeur gaming, son DTS:X Ultra et compatibilité stylet RedMagic Pen.',
  'beyerdynamic-amiron-100': 'Casque circum-aural Tesla avec ANC adaptative, codec aptX Lossless, autonomie 45h, impédance 32Ω, réponse 5-40 kHz et fabrication allemande.',
  'freebox-ultra': 'Box internet fibre Wi-Fi 7 tri-bande avec débit 8 Gbit/s, NAS 1 To, Player 4K Dolby Atmos, 280 chaînes TV, domotique Matter/Zigbee et FreeOS.',
  'sony-a7-v': 'Hybride plein format 61 MP avec AF AI 759 points, vidéo 8K 30p/4K 120p, stabilisation 8 stops, double slot CFexpress et viseur OLED 9.44 Mpts.',
  'sennheiser-momentum-5': 'Casque premium avec transducteurs 42mm, ANC adaptatif, audio spatial personnalisé, autonomie 60h, Bluetooth 5.4 aptX Lossless et matériaux haut de gamme.',
  'steelseries-apex-pro-tkl-gen-3': 'Clavier mécanique TKL avec switches OmniPoint 2.0 magnétiques ajustables, écran OLED, RGB par touche, N-Key rollover et Rapid Trigger.',
  'dell-poweredge-r760': 'Serveur rack 2U avec dual Intel Xeon Scalable Gen4, jusqu\'à 2 To DDR5 ECC, 12 baies hot swap, 4× 10GbE, iDRAC et TPM 2.0 pour virtualisation.',
  'apple-vison-pro': 'Casque spatial computing avec double puce M2 + R1, écrans micro-OLED 23 Mpts, 12 caméras/5 capteurs, suivi yeux/mains et visionOS pour réalité mixte pro.',
  'meta-quest-3s': 'Casque VR accessible avec Snapdragon XR2 Gen 2, écrans LCD 128 Go, passthrough couleur, contrôleurs Touch Plus et compatibilité Quest 2/3.',
  'oculus-quest-2': 'Casque VR standalone avec Snapdragon XR2, écran LCD 1832×1920 par œil, 6 Go RAM, suivi inside-out, contrôleurs Touch et bibliothèque Quest.',
  'lenovo-legion-go-s': 'Console portable gaming avec écran 8.8" QHD+ 144Hz, AMD Ryzen Z2 Extreme, 16 Go LPDDR5X, SSD 1 To, contrôleurs détachables et Legion Space UI.',
  'dji-neo-2': 'Drone ultra-compact 135g avec caméra 4K/60fps stabilisée, décollage main, ActiveTrack 360°, QuickShots AI, autonomie 28 min et portée 10 km.',
  'samsung-qn900d-neo-qled-8k': 'TV 75" 8K Neo QLED avec processeur NQ8 AI Gen3, Mini LED Quantum Matrix Pro, HDR10+ Adaptive, Object Tracking Sound Pro, 144Hz gaming.',
  'bambu-lab-x1-carbon-combo': 'Imprimante 3D ultra-rapide 256×256×256mm avec AMS 4 couleurs, vitesse 500mm/s, caméra IA détection défauts, plateau PEI et filtre HEPA.',
  'huawei-watch-gt-5-pro': 'Montre connectée titane 46mm avec écran AMOLED 1.43", GPS double fréquence, autonomie 14 jours, capteur FC avancé et 100+ modes sport.',
  'msi-titan-18-hx': 'PC portable 18" avec écran Mini LED 4K 120Hz, Intel Core i9-14900HX, RTX 5090 16 Go, 128 Go DDR5, 4 To SSD, clavier Cherry MX et Cooler Boost Titan.',
  'razer-blackwidow-v4-pro-75': 'Clavier mécanique gaming 75% avec switches Razer Gen-3, écran OLED, molette multifonction, RGB Chroma 16.8M, polling 8000Hz et HyperSpeed Wireless.',
  'logitech-mx-master-4s': 'Souris ergonomique 8000 DPI avec défilement MagSpeed électromagnétique, 7 boutons personnalisables, autonomie 90 jours, Flow multi-PC et suivi sur verre.',
  'xiaomi-15-ultra': 'Smartphone avec Snapdragon 8 Gen 4, écran AMOLED 6.7" 2K 120Hz, quad camera Leica 50 MP, 16 Go RAM, 512 Go, charge 120W et HyperOS 2.0.',
  'lenovo-yoga-tab-15': 'Tablette grand format 15" avec béquille intégrée, processeur puissant, son JBL, stylet compatible, autonomie longue durée et mode tente/support.',
  'oneplus-pad-2': 'Tablette premium avec écran 12.1" LCD 144Hz, Snapdragon 8 Gen 3, 12 Go RAM, batterie 9510 mAh, charge SuperVOOC 67W et 6 HP Dolby Atmos.',
  'steelseries-apex-pro-tkl-gen-3': 'Clavier gaming TenKeyLess avec switches OmniPoint 2.0 magnétiques ajustables 0.2-3.8mm, écran OLED personnalisable, RGB 16.8M et aluminium aviation.',
  'apple-ipad-pro-m4': 'Tablette pro avec puce M4, écran OLED Ultra Retina XDR 11"/13" 120 Hz, 8/16 Go RAM, Apple Pencil Pro retour haptique et Magic Keyboard.',
  'samsung-galaxy-s25-ultra': 'Smartphone flagship avec Snapdragon 8 Elite, écran Dynamic AMOLED 6.9" 120 Hz, quad camera 200 MP, S Pen intégré, batterie 5000 mAh et Galaxy AI.'
};

async function run() {
  try {
    console.log('✅ Connecté à PostgreSQL\n');

    // Récupérer tous les produits
    const result = await pool.query('SELECT id, nom FROM produits ORDER BY id');
    
    let updated = 0;
    for (const product of result.rows) {
      const specificDesc = specificDescriptions[product.nom];
      
      if (specificDesc) {
        // Mettre à jour la description dans donnees_fiche
        await pool.query(`
          UPDATE produits 
          SET donnees_fiche = ARRAY[
            '📝 Description détaillée
' || $1,
            donnees_fiche[2],  -- Prix
            donnees_fiche[3],  -- Spécifications
            donnees_fiche[4],  -- Section spécifique
            donnees_fiche[5],  -- Connectivité
            donnees_fiche[6],  -- Expérience
            donnees_fiche[7],  -- Autonomie/Thermique
            donnees_fiche[8],  -- Garantie
            donnees_fiche[9]   -- Contenu
          ]
          WHERE id = $2
        `, [specificDesc, product.id]);
        
        updated++;
        console.log(`✅ ${product.id} - ${product.nom}`);
      }
    }
    
    console.log(`\n✅ ${updated} produits mis à jour !`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

run();
