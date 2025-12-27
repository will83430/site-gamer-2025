async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_23',
      donnees: [
        'Casque VR autonome premium avec passthrough couleur et Snapdragon XR3 Gen2.',
        '💰 À partir de 549 € – écrans 4K+, XR3 Gen2, 12 Go RAM, RM couleur.',
        '🧩 Spécifications matérielles\n - Processeur : Snapdragon XR3 Gen2\n - RAM : 12 Go\n - Stockage : 128/512 Go\n - Écrans : résolution 4K+\n - Autonomie : jusqu’à 2 h 30\n - Poids : 515 g',
        '🕹️ Contrôleurs et interaction\n - Suivi mains + yeux\n - Caméras couleur pour réalité mixte\n - Audio spatial intégré\n - Compatible PC VR (Air Link)',
        '🌐 Connectivité\n - Store Meta Quest (apps/jeux)\n - Partage écran TV/mobile\n - Contrôle parental et profils multiples',
        '🎮 Expérience immersive\n - Confort longue session, réglage IPD\n - Accessoires : Elite Strap, batterie, étui',
        '🛡️ Garantie et support\n - Support Meta, mises à jour logicielles',
        '📦 Contenu de la boîte\n - Casque Quest 3\n - Contrôleurs Touch\n - Câbles/chargeur (selon pack)'
      ],
    },
    {
      id: 'prod_47',
      donnees: [
        'Meta Quest 2 : casque VR tout-en-un XR2, bibliothèque Quest et PC VR.',
        '💰 349 € (128 Go) / 449 € (256 Go) – Snapdragon XR2, LCD 1832×1920, jusqu’à 120 Hz.',
        '🧩 Spécifications matérielles\n - Processeur : Snapdragon XR2\n - RAM : 6 Go\n - Stockage : 128/256 Go\n - Écran : 1832×1920 par œil, jusqu’à 120 Hz\n - Autonomie : 2-3 h (usage)',
        '🕹️ Contrôleurs et interaction\n - Contrôleurs Oculus Touch\n - Inside-out tracking 4 caméras\n - Reconnaissance des mains (apps compatibles)',
        '🌐 Connectivité\n - Wi-Fi 5, Bluetooth\n - USB-C pour recharge et Oculus Link (PC VR)',
        '🎮 Expérience immersive\n - FOV ~90-100°\n - Audio spatial intégré + jack 3,5 mm\n - Poids ~503 g, sangles ajustables',
        '🛡️ Garantie et support\n - Garantie 2 ans (EU)\n - Support Meta + mises à jour',
        '📦 Contenu de la boîte\n - Casque Quest 2\n - Contrôleurs Touch\n - Câble USB-C\n - Accessoires base (selon pack)'
      ],
    },
    {
      id: 'prod_53',
      donnees: [
        'Meta Quest 3S : version accessible du Quest 3 avec XR2 Gen2 et RM couleur.',
        '💰 399,99 € – XR2 Gen2, 128/256 Go, écrans 2064×2208, 90/120 Hz.',
        '🧩 Spécifications matérielles\n - Processeur : Snapdragon XR2 Gen2\n - Stockage : 128/256 Go\n - Résolution : 2064×2208 par œil\n - Taux : 90/120 Hz\n - Audio : spatial 3D intégré\n - Autonomie : 2-3 h',
        '🕹️ Contrôleurs et interaction\n - Suivi mains et tête 6DOF\n - Contrôleurs Touch\n - Passthrough couleur full HD',
        '🌐 Connectivité\n - Wi-Fi 6E ultra-rapide\n - Bibliothèque Quest (500+ jeux/apps)\n - Quest Link et streaming PC sans fil',
        '🎮 Expérience immersive\n - Partage écran instantané\n - Ajustement IPD 58-72 mm\n - Pensé pour familles et débutants VR',
        '🛡️ Garantie et support\n - Garantie constructeur (selon région)\n - Support Meta',
        '📦 Contenu de la boîte\n - Quest 3S\n - Contrôleurs Touch\n - Câbles/chargeur (selon pack)'
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
