async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_36',
      donnees: [
        'Smartphone premium orienté photo portrait IA avec design incurvé.',
        '💰 799,99 € – Snapdragon 8s Gen 3, écran OLED 120 Hz, 512 Go, recharge 100 W.',
        '🧩 Spécifications matérielles\n - Écran : OLED 6,78" 120 Hz\n - Processeur : Snapdragon 8s Gen 3\n - RAM : 12 Go\n - Stockage : 512 Go\n - Batterie : 5 200 mAh, recharge 100 W\n - Refroidissement : optimisation thermique avancée',
        '📸 Appareil photo\n - Triple capteur : 50 MP IMX906 + téléobjectif + ultra grand-angle\n - Mode portrait IA (Studio Harcourt)\n - Vidéo 4K stabilisée\n - Optimisation faible lumière',
        '📱 Écran et affichage\n - Dalle incurvée, haute luminosité\n - PWM faible scintillement\n - Lecture et jeu confortables',
        '🌐 Connectivité\n - 5G, Wi-Fi, Bluetooth, NFC\n - Dual SIM\n - Services Google complets',
        '🎮 Expérience utilisateur\n - Interface fluide et personnalisable\n - Idéal photo/vidéo, réseaux, gaming mobile\n - Design premium confortable',
        '🔋 Autonomie\n - Journée d’usage mixte\n - Recharge 100 W très rapide',
        '🛡️ Garantie et support\n - Garantie constructeur 2 ans (selon région)',
        '📦 Contenu de la boîte\n - Smartphone HONOR 200 Pro\n - Chargeur rapide\n - Câble USB-C\n - Outil SIM, documentation'
      ],
    },
    {
      id: 'prod_43',
      donnees: [
        'Google Pixel 10 avec Tensor G4, photo IA et Android pur.',
        '💰 999 € – Tensor G4, écran 6,3" 144 Hz, 12 Go RAM, 128/256/512 Go.',
        '🧩 Spécifications matérielles\n - Processeur : Google Tensor G4\n - RAM : 12 Go LPDDR5X\n - Stockage : 128/256/512 Go\n - Batterie : 4 700 mAh\n - Charge : 30 W filaire, 23 W sans fil\n - Sécurité : Titan M3',
        '📱 Écran et affichage\n - AMOLED LTPO 6,3" QHD+ (2424×1080)\n - 1-144 Hz adaptatif\n - Luminosité : ~2 000 nits HDR\n - Gorilla Glass Victus 3',
        '📸 Appareil photo\n - 50 MP principal, 12 MP ultra grand-angle, 48 MP télé 5x\n - Night Sight, Real Tone, Magic Eraser\n - Vidéo 4K 60 fps stabilisée',
        '🌐 Connectivité\n - 5G mmWave/Sub-6, Wi-Fi 7, Bluetooth 5.3, NFC\n - USB-C 3.2, eSIM + nano SIM\n - Android 15 avec 7 ans de mises à jour',
        '🎮 Expérience utilisateur\n - Call Screen IA, Live Translate\n - Assistant avancé, IP68\n - Interface Pixel fluide',
        '🔋 Autonomie\n - 24h+ usage adaptatif\n - Partage de batterie 5 W',
        '🛡️ Garantie et support\n - Support Google 24/7\n - Garantie constructeur 2 ans',
        '📦 Contenu de la boîte\n - Pixel 10\n - Câble USB-C\n - Adaptateur SIM tool\n - Documentation'
      ],
    },
    {
      id: 'prod_50',
      donnees: [
        'Xiaomi 15 Ultra orienté photo Leica avec Snapdragon 8 Gen 4 et charge 120 W.',
        '💰 1 399,99 € – Snapdragon 8 Gen 4, 12/16 Go RAM, 256 Go à 1 To, charge 120 W.',
        '🧩 Spécifications matérielles\n - Processeur : Snapdragon 8 Gen 4\n - RAM : 12/16 Go LPDDR5X\n - Stockage : 256/512 Go/1 To\n - Batterie : 5 300 mAh\n - Charge : 120 W filaire, 80 W sans fil, inverse 10 W\n - Refroidissement : chambre à vapeur avancée',
        '📱 Écran et affichage\n - 6,73" LTPO OLED, 1440×3200\n - 1-120 Hz adaptatif, 3 000 nits pic\n - Gorilla Glass Victus 2, Always-on',
        '📸 Appareil photo\n - Quad Leica : 50 MP principal Summicron, 50 MP ultra grand-angle 122°, 50 MP télé x3.2, 50 MP périscope x5\n - Vidéo 8K 24 fps, 4K 60 fps HDR10+\n - Mode nuit et IA photo avancée',
        '🌐 Connectivité\n - 5G Dual SIM, Wi-Fi 7, Bluetooth 5.4, NFC, IR\n - USB-C 3.2 Gen1\n - HyperOS 2.0 (Android 15)',
        '🎮 Expérience utilisateur\n - Mode jeu Turbo 120 fps\n - Sécurité : capteur ultrasonique\n - Résistance IP68',
        '🔋 Autonomie\n - 1-2 jours usage intensif\n - 0-100% en ~18 min (120 W)',
        '🛡️ Garantie et support\n - Garantie constructeur 2 ans\n - Service client Xiaomi international',
        '📦 Contenu de la boîte\n - Xiaomi 15 Ultra\n - Chargeur 120 W\n - Câble USB-C\n - Coque de protection\n - Outil SIM, guide'
      ],
    },
    {
      id: 'prod_9',
      donnees: [
        'Galaxy S25 Ultra avec S Pen intégré, photo 200 MP et IA Galaxy.',
        '💰 À partir de 1 199 € – Snapdragon 8 Elite, écran 6,9" 120 Hz, S Pen, batterie 5 000 mAh.',
        '🧩 Spécifications matérielles\n - Processeur : Snapdragon 8 Elite\n - RAM : 12/16 Go\n - Stockage : 256/512 Go/1 To\n - Batterie : 5 000 mAh\n - Refroidissement : chambre à vapeur optimisée\n - Connectivité : Wi-Fi 7, Bluetooth 5.4, USB-C',
        '📱 Écran et affichage\n - 6,9" Dynamic AMOLED 2X, 1440×3120\n - LTPO 1-120 Hz, jusqu’à 2 600 nits\n - Gorilla Glass Armor anti-reflets',
        '📸 Appareil photo\n - Principal 200 MP\n - Ultra grand-angle 50 MP\n - Télé x3 : 10 MP\n - Périscope x5 : 50 MP\n - Vidéo 8K 30 fps, zoom optique jusqu’à x10',
        '🌐 Connectivité\n - 5G, eSIM + nano SIM\n - Ultra Wideband, NFC\n - One UI 7 avec Galaxy AI',
        '🎮 Expérience utilisateur\n - S Pen intégré\n - IP68, audio stéréo\n - Idéal multitâche, photo pro, gaming',
        '🔋 Autonomie\n - 45 W filaire, sans fil rapide\n - Partage d’énergie sans fil',
        '🛡️ Garantie et support\n - Mises à jour Android 7 ans\n - Garantie constructeur (selon région)',
        '📦 Contenu de la boîte\n - Galaxy S25 Ultra\n - Câble USB-C\n - Outil SIM\n - Documentation'
      ],
    },
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
