async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_38',
      donnees: [
        'Tablette polyvalente orientée productivité et divertissement avec S Pen.',
        '💰 À partir de 699 € – écran 10,9" AMOLED 90 Hz, One UI 7/Android 15, DeX.',
        '🧩 Spécifications matérielles\n - Écran : 10,9" AMOLED 2560×1600, 90 Hz, 1 200 nits\n - S Pen inclus\n - Reconnaissance faciale\n - Mode DeX et multifenêtrage\n - Plateforme : One UI 7 (Android 15)',
        '🖥️ Écran et affichage\n - Lecture/vidéo fluide\n - Bon contraste AMOLED\n - Confort visuel',
        '🖊️ Accessoires et interaction\n - Clavier Book Cover en option\n - S Pen pour prise de notes et dessin',
        '🌐 Connectivité\n - Wi-Fi, Bluetooth\n - Sync Galaxy Watch/Buds, continuité écosystème Samsung',
        '🎮 Usages\n - Étudiants, pros nomades, cloud gaming (Xbox)\n - Multitâche et streaming',
        '🔋 Autonomie\n - Journée d’usage mixte (selon profil)\n - Charge rapide USB-C',
        '🛡️ Garantie et support\n - Mises à jour Android garanties (cycle Samsung)'
      ],
    },
    {
      id: 'prod_39',
      donnees: [
        'Surface Pro X 2025 : hybride Windows ARM pour créateurs et pros mobiles.',
        '💰 À partir de 1 199 € – écran 13" 120 Hz, Windows 11 ARM, stylet et clavier optionnels.',
        '🧩 Spécifications matérielles\n - Écran : 13" PixelSense Flow 2880×1920, 120 Hz, 1 400 nits\n - Sécurité : Windows Hello (caméra IR)\n - OS : Windows 11 ARM\n - Accessoires : Surface Slim Pen 3, clavier Signature',
        '🖊️ Accessoires et interaction\n - Mode tablette ou PC\n - Stylet pour dessin/annotation\n - Clavier détachable avec pavé tactile',
        '🌐 Connectivité et usages\n - Apps pro : Adobe CC, Teams, Office 365\n - Cloud sync OneDrive\n - Compatibilité Steam/Xbox Game Pass (ARM/émulation)',
        '🎮 Expérience utilisateur\n - Multitâche Windows fluide\n - Pensée pour créateurs et télétravail',
        '🔋 Autonomie\n - Journée de travail typique (variable selon charges)\n - Charge USB-C',
        '🛡️ Garantie et support\n - Support Microsoft et firmware Surface'
      ],
    },
    {
      id: 'prod_44',
      donnees: [
        'Tablette gaming RedMagic Astra avec design aluminium et audio DTS:X Ultra.',
        '💰 899 € – écran rapide, plateforme optimisée cloud gaming et streaming.',
        '🧩 Spécifications matérielles\n - Châssis aluminium\n - Audio stéréo DTS:X Ultra\n - Écran haute fréquence (gaming)\n - SOC haute performance (gamers)\n - Système de refroidissement optimisé',
        '🖥️ Écran et affichage\n - Dalle rapide pour jeux\n - Couleurs et luminosité adaptées streaming/cloud gaming',
        '🖊️ Accessoires et interaction\n - Compatible contrôleurs et claviers Bluetooth\n - Support stylet (selon bundle)',
        '🌐 Connectivité\n - Wi-Fi haute performance, Bluetooth\n - Pensée pour streaming et cloud gaming',
        '🎮 Expérience utilisateur\n - Mode jeu dédié\n - Optimisations réseau et latence\n - Idéale pour plateformes cloud et jeux mobiles',
        '🔋 Autonomie\n - Batterie dimensionnée pour sessions de jeu (variable selon charge)\n - Charge rapide USB-C',
        '🛡️ Garantie et support\n - Garantie constructeur (selon région)'
      ],
    },
    {
      id: 'prod_49',
      donnees: [
        'Lenovo Yoga Tab 15 : tablette 11,1" 144 Hz avec support intégré et audio 4 HP.',
        '💰 Environ 400 € – Snapdragon 8 Gen 3, 8/12 Go RAM, 128/256 Go, 8 860 mAh.',
        '🧩 Spécifications matérielles\n - Processeur : Snapdragon 8 Gen 3\n - RAM : 8/12 Go\n - Stockage : 128/256 Go UFS 4.0\n - Batterie : 8 860 mAh (charge rapide)',
        '🖥️ Écran et affichage\n - 11,1" IPS 3200×2000, 144 Hz\n - IA d’amélioration d’image\n - Support chevalet intégré',
        '🖊️ Accessoires et interaction\n - Stylet Lenovo Tab Pen Pro compatible\n - Clavier via connecteur magnétique\n - Reconnaissance faciale',
        '🌐 Connectivité\n - Wi-Fi 6/7, Bluetooth 5.4\n - Option 4G/5G selon modèle\n - USB-C 3.2',
        '🎮 Applications et usages\n - Prise de notes, retouche, streaming, jeux optimisés IA\n - Audio spatial 4 HP (2 tweeters + 2 woofers)',
        '🔋 Autonomie\n - Gestion intelligente via IA\n - Charge rapide',
        '🛡️ Garantie et support\n - Garantie 2 ans Lenovo\n - Mises à jour Android régulières',
        '📦 Contenu de la boîte\n - Yoga Tab 15\n - Chargeur USB-C\n - Stylet (si pack)\n - Documentation'
      ],
    },
    {
      id: 'prod_55',
      donnees: [
        'OnePlus Pad 2 : tablette 12,1" 144 Hz avec Snapdragon 8 Gen 3 et stylet inclus.',
        '💰 599,99 € – 12 Go RAM, 256 Go UFS 4.0, batterie 9 510 mAh, charge 67 W.',
        '🧩 Spécifications matérielles\n - Processeur : Snapdragon 8 Gen 3\n - RAM : 12 Go LPDDR5X\n - Stockage : 256 Go UFS 4.0\n - Batterie : 9 510 mAh, charge 67 W\n - Audio : 6 HP Dolby Atmos',
        '📱 Écran et affichage\n - 12,1" IPS 2.8K (2120×3000)\n - Ratio 7:5 productivité\n - 144 Hz adaptatif, DCI-P3 100%, ~900 nits HDR',
        '🌐 Connectivité\n - Wi-Fi 7 tri-band, Bluetooth 5.4\n - USB-C 3.2 Gen1\n - OxygenOS 14 (Android 14), option 5G selon version',
        '🎮 Expérience utilisateur\n - Stylet OnePlus Stylo 2 et clavier magnétique\n - Mode gaming 144 fps, multitâche fenêtres flottantes\n - Mode bureau type DeX-like',
        '🔋 Autonomie\n - 12-16h usage mixte\n - 0-100% ~80 min (67 W)\n - Charge sans fil 50 W',
        '🛡️ Garantie et support\n - Garantie 2 ans OnePlus\n - Support international',
        '📦 Accessoires inclus\n - OnePlus Pad 2\n - Stylet Stylo 2\n - Chargeur 67 W\n - Câble USB-C\n - Guide'
      ],
    },
    {
      id: 'prod_8',
      donnees: [
        'iPad Pro M4 : tablette OLED ultra puissante pour créateurs et pros.',
        '💰 À partir de 1 099 € – puce M4, OLED Ultra Retina XDR, 11/13", Apple Pencil Pro.',
        '🧩 Spécifications matérielles\n - Puce : Apple M4\n - Écran : 11" ou 13" OLED Ultra Retina XDR\n - Stockage : 256 Go à 2 To\n - Batterie : ~10 h usage web/vidéo\n - Épaisseur : 5,1 mm',
        '🖥️ Écran et affichage\n - 2420×1668 (11") / 2752×2064 (13")\n - 120 Hz ProMotion, 1 600 nits HDR\n - Colorimétrie pro, True Tone',
        '🖊️ Accessoires et interaction\n - Apple Pencil Pro (retour haptique, pression, gestuelle)\n - Magic Keyboard rétroéclairé\n - Face ID',
        '🌐 Connectivité\n - Wi-Fi 6E, Bluetooth 5.3, USB-C\n - iPadOS 17 avec Stage Manager\n - AirDrop, iCloud, continuité macOS/iOS',
        '🎮 Applications et usages\n - Final Cut/Logic Pro, apps créatives, Apple Arcade\n - Multifenêtrage, productivité mobile',
        '🔋 Autonomie\n - Environ 10 h vidéo/web\n - Charge USB-C',
        '🛡️ Garantie et support\n - Garantie Apple (selon région) + AppleCare optionnelle'
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
