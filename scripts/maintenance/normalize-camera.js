async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_13',
      donnees: [
        'Caméra 360° 8K pour créateurs immersifs avec stabilisation FlowState.',
        '💰 À partir de 549 € – double capteur 1/1.28", 8K 360°, étanchéité 10 m.',
        '🧩 Spécifications matérielles\n - Capteurs : double 1/1.28"\n - Vidéo : 8K 360°, 5.7K standard\n - Stabilisation : FlowState + horizon lock\n - Autonomie : ~90 min\n - Étanchéité : 10 m sans caisson\n - Connectivité : Wi-Fi, Bluetooth, USB-C',
        '🎥 Fonctions vidéo et photo\n - FreeFrame, timelapse, Bullet Time, HDR vidéo\n - Lentilles remplaçables\n - Optimisation faible lumière',
        '🌐 Connectivité\n - App Insta360 avec cadrage IA\n - Partage direct réseaux\n - Contrôle vocal/gestuel\n - Compatibilité Insta360 Studio',
        '🎮 Expérience utilisateur\n - Interface tactile intuitive\n - Accessoires : perche invisible, trépied, supports casque\n - Idéale vlog, sport, voyage',
        '🔋 Autonomie\n - ~90 min (usage standard)\n - Batterie amovible (selon pack)',
        '🛡️ Garantie et support\n - Support Insta360 + firmware OTA',
        '📦 Accessoires inclus\n - Caméra X5\n - Câble USB-C\n - Housse/protections (selon pack)'
      ],
    },
    {
      id: 'prod_14',
      donnees: [
        'Canon EOS R6 Mark II : hybride plein format rapide pour photo/vidéo.',
        '💰 À partir de 2 899 € – capteur 24.2 MP, 4K60, IBIS 8 stops.',
        '🧩 Spécifications matérielles\n - Capteur : CMOS plein format 24.2 MP\n - Processeur : DIGIC X\n - Stabilisation : IBIS jusqu’à 8 stops\n - Viseur : OLED 3.69 Mpts 120 Hz\n - Écran : LCD orientable 3"\n - Connectivité : Wi-Fi, Bluetooth, USB-C, micro-HDMI, jack casque/micro\n - Double slot SD UHS-II',
        '🎥 Fonctions vidéo et photo\n - 4K60 oversamplé, FHD 180p\n - Formats : MP4/RAW/C-RAW/HEIF\n - Autofocus Dual Pixel II (visages/animaux/véhicules)\n - Stabilisation numérique + IBIS\n - Enregistrement sans limite de durée',
        '🌐 Connectivité\n - App Canon Camera Connect\n - Mise à jour firmware via app\n - Contrôle à distance smartphone',
        '🎮 Expérience utilisateur\n - Rafale rapide, boîtier robuste et tropicalisé\n - Idéal reportage, mariage, sport, vlog, cinéma',
        '🔋 Autonomie\n - Batterie LP-E6NH (durée variable selon mode)\n - Charge via USB-C possible',
        '🛡️ Garantie et support\n - Garantie constructeur (selon région)\n - Support Canon pro',
        '📦 Accessoires inclus\n - Boîtier R6 Mark II\n - Batterie + chargeur\n - Courroie\n - Câble et documentation'
      ],
    },
    {
      id: 'prod_59',
      donnees: [
        'Sony A7 V : hybride plein format 61 MP avec AF IA temps réel et vidéo 8K.',
        '💰 4 299,99 € – capteur 61 MP BSI, 8K30, IBIS 8 stops.',
        '🧩 Spécifications matérielles\n - Capteur : CMOS Exmor R 61 MP BSI\n - Processeur : BIONZ XR\n - AF : 759 points phase avec IA temps réel\n - Vidéo : 8K30 / 4K120 interne\n - Stabilisation : IBIS 8 stops\n - Écran : tactile orientable 3.2"\n - Viseur : OLED 9.44 Mpts 120 fps\n - Slots : CFexpress A/SD double',
        '🎥 Fonctions vidéo et photo\n - Rafale : 10 fps méca / 30 fps élec\n - Plage ISO : 50-204800\n - Profils : S-Log3, S-Gamut3.Cine\n - RAW 16-bit / HEIF 10-bit',
        '🌐 Connectivité\n - Wi-Fi 6, Bluetooth 5.0\n - USB-C 3.2, HDMI Type-A\n - FTP/cloud direct',
        '🎮 Expérience utilisateur\n - Interface tactile personnalisable\n - Tropicalisation IP54\n - Pensé pour pro photo/vidéo',
        '🔋 Autonomie\n - Batterie NP-FZ100\n - ~530 photos / 90 min vidéo\n - Charge USB-C pendant usage',
        '🛡️ Garantie et support\n - Garantie Sony 2 ans internationale\n - Support technique pro',
        '📦 Accessoires inclus\n - Boîtier A7 V\n - Batterie NP-FZ100\n - Chargeur BC-QZ1\n - Courroie, cache oculaire\n - Guide de démarrage'
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
