async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_15',
      donnees: [
        'Vidéoprojecteur trilaser 4K HDR pour home cinéma et gaming.',
        '💰 À partir de 2 999 € – trilaser DLP 4K, Dolby Vision/HDR10+, Google TV, faible latence.',
        '🧩 Spécifications matérielles\n - Technologie : trilaser DLP 4K UHD\n - Luminosité : pic élevé (usage salon dédié)\n - Contraste : EBL (Enhanced Black Level)\n - Connectivité : HDMI 2.1, USB-C, Wi-Fi, Bluetooth\n - Audio : système intégré, télécommande rétroéclairée\n - Interface : Google TV',
        '🖥️ Qualité d’image\n - Résolution : 3840×2160\n - HDR : Dolby Vision et HDR10+\n - Colorimétrie : large, calibrage possible\n - Optique : zoom et focus auto\n - Correction trapèze avancée',
        '🎮 Gaming et fluidité\n - Faible input lag\n - Compatible consoles/PC\n - Mode jeu dédié, 4K 60 fps réactif',
        '🛡️ Garantie et support\n - Garantie constructeur (selon région)\n - Support en ligne',
        '📦 Accessoires inclus\n - Projecteur Valerion Vision Master Pro 2\n - Télécommande rétroéclairée\n - Câbles d’alimentation (selon pack)'
      ],
    },
    {
      id: 'prod_16',
      donnees: [
        'Vidéoprojecteur laser 3LCD 4K PRO-UHD haut de gamme pour home cinéma et gaming.',
        '💰 À partir de 4 195 € – 2 700 lumens, HDR10+, zoom motorisé, faible latence.',
        '🧩 Spécifications matérielles\n - Technologie : 3LCD laser phosphore\n - Résolution : 3840×2160 (pixel shifting)\n - Luminosité : 2 700 lumens (ISO couleur/blanc)\n - Contraste : dynamique 2 500 000:1\n - Connectivité : HDMI 2.1 x2, USB x2, Ethernet, RS232, trigger 12V\n - Optique : zoom motorisé 2.1x, lens shift motorisé (±96% V / ±47% H)',
        '🖥️ Qualité d’image\n - HDR : HDR10+ et HLG\n - Traitement : 4K Frame Interpolation, Super Resolution\n - Couleurs : 10 bits, grande couverture\n - Taille d’image : 50 à 300"\n - Bruit : 30 dB / 22 dB (Eco)',
        '🎮 Gaming et fluidité\n - Input lag ~20 ms en 4K/60\n - Mode jeu dédié\n - Compatible consoles et PC',
        '🛡️ Garantie et support\n - Garantie constructeur (selon région)\n - Support Epson',
        '📦 Accessoires inclus\n - Projecteur Epson EH-LS12000B\n - Télécommande\n - Câbles d’alimentation (selon pack)'
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
