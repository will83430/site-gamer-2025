async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_11',
      donnees: [
        'TV OLED 4K 65" très lumineuse avec dalle Evo et processeur Alpha 11 AI.',
        '💰 À partir de 2 790 € – dalle OLED Evo 4K, processeur Alpha 11 AI, design ultra-fin.',
        '🧩 Spécifications matérielles\n - Taille : 65" OLED Evo 4K\n - Processeur : Alpha 11 AI Gen2\n - Luminosité pic : jusqu\'à 2 412 cd/m²\n - Connectivité : Wi-Fi 6, Bluetooth 5.3, HDMI 2.1 x4, USB, Ethernet\n - Design : montage mural affleurant, châssis ultra-fin',
        '🖥️ Qualité d\'image et affichage\n - HDR : Dolby Vision, HDR10, HLG\n - Colorimétrie : Delta E ≈ 0.79\n - Modes : Filmmaker, Cinéma, Jeu, Standard\n - Traitements : AI Picture, gestion des reflets',
        '🎮 Gaming et fluidité\n - 4K 120 Hz, VRR, ALLM\n - G-Sync, FreeSync compatible\n - Input lag très faible\n - Optimiseur de jeu avec presets',
        '🌐 Fonctionnalités connectées\n - Système : webOS avec applications streaming\n - Assistants : Google Assistant, Alexa\n - Multi-vues, mode galerie, contrôle domotique',
        '🎧 Audio et son\n - AI Sound Pro, Dolby Atmos\n - Haut-parleurs hauts de gamme',
        '🛡️ Garantie et support\n - Garantie LG standard\n - Support technique LG 24/7',
        '📦 Contenu de la boîte\n - TV LG OLED65 G5\n - Télécommande Magic Remote\n - Câbles HDMI et alimentation\n - Documentation et guide'
      ]
    },
    {
      id: 'prod_12',
      donnees: [
        'TV OLED Evo 4K 65" avec dalle MLA ultra-lumineuse et Alpha 9 AI Gen6.',
        '💰 À partir de 2 999 € – dalle OLED Evo MLA, processeur Alpha 9 AI Gen6, design One Wall.',
        '🧩 Spécifications matérielles\n - Taille : 65" OLED Evo MLA 4K\n - Processeur : Alpha 9 AI 4K Gen6\n - Luminosité pic : jusqu\'à 1 490 cd/m²\n - Connectivité : Wi-Fi 6, Bluetooth 5.3, HDMI 2.1 x4, USB x3, Ethernet\n - Design : One Wall Design, montage mural affleurant',
        '🖥️ Qualité d\'image et affichage\n - HDR : Dolby Vision IQ, HDR10, HLG\n - Modes : Filmmaker, Cinéma, Jeu, Standard, Vif\n - Colorimétrie : Delta E ≈ 0.79\n - Fréquence : 120 Hz natif',
        '🎮 Gaming et fluidité\n - VRR, ALLM, G-Sync, FreeSync\n - Input lag : ≈ 9 ms\n - Optimiseur de jeu avec accès GeForce Now',
        '🌐 Fonctionnalités connectées\n - Système : webOS 23 avec Quick Media Switching\n - Assistants : Google Assistant, Alexa\n - AirPlay 2, Miracast, Matter\n - Multi-vues, contrôle domotique, mode galerie',
        '🎧 Audio et son\n - Dolby Atmos, AI Sound Pro\n - Dalles anti-reflets haute qualité',
        '🛡️ Garantie et support\n - Garantie LG standard\n - Télécommande Magic Remote incluse',
        '📦 Contenu de la boîte\n - TV LG OLED65 G3\n - Télécommande Magic Remote\n - Câbles HDMI et alimentation\n - Support mural et documentation'
      ]
    },
    {
      id: 'prod_58',
      donnees: [
        'TV 8K 75" Neo QLED avec processeur NQ8 AI Gen3 et design Infinity Screen.',
        '💰 À partir de 5 999,99 € – dalle Neo QLED 8K, processeur IA NQ8 Gen3, 144 Hz, One Connect Box.',
        '🧩 Spécifications matérielles\n - Résolution : 8K (7680 × 4320)\n - Processeur : NQ8 AI Gen3\n - Technologie : Neo QLED Quantum Matrix Mini LED\n - Luminosité : jusqu\'à 4 000 nits (HDR10+)\n - Connectivité : Wi-Fi 6E, Bluetooth 5.2, HDMI 2.1, One Connect Box externe',
        '🖥️ Affichage et qualité d\'image\n - Taille : 75" Infinity Screen\n - Contraste : local dimming précis\n - Couleurs : Quantum Dot 100% DCI-P3\n - Upscaling : 8K AI, Real 8K Resolution',
        '🎮 Gaming et fluidité\n - 4K/8K 144 Hz, VRR, ALLM\n - FreeSync Premium Pro, G-Sync compatible\n - Gaming Hub et Game Mode Pro',
        '🌐 Fonctionnalités connectées\n - Système : Tizen OS 2025 fluide\n - Assistants : Bixby, Alexa, Google\n - AirPlay 2, Chromecast intégré\n - Applications 8K : Netflix, Prime Video',
        '🔊 Audio et son\n - Object Tracking Sound Pro, Dolby Atmos\n - Système audio immersif premium',
        '🛡️ Garantie et support\n - Installation premium incluse\n - Support Samsung 24/7\n - Garantie standard',
        '📦 Contenu de la boîte\n - TV Samsung 75" QN900D\n - Télécommande solaire\n - One Connect Box\n - Câbles et documentation\n - Support mural slim VESA 400×300'
      ]
    }
  ];

  for (const { id, donnees } of updates) {
    await pool.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [donnees, id]);
    console.log(`✅ donnees_fiche mis à jour pour ${id}`);
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
