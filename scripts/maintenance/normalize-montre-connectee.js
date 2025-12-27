async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_10',
      donnees: [
        'Montre multisport haut de gamme avec GPS multi-bandes et autonomie longue.',
        '💰 À partir de 799 € – AMOLED 1,4", cartographie, suivi santé complet.',
        '🧩 Spécifications matérielles\n - Écran : AMOLED 1,4" tactile\n - GPS multi-bandes, altimètre, baromètre, boussole\n - Étanchéité : 10 ATM\n - Autonomie : jusqu’à 30 jours (mode étendu)',
        '⌚ Fonctions sport et santé\n - VO2max, ECG, SpO2, récupération\n - Suivi sommeil, stress\n - Coach Garmin, plans d’entraînement\n - Paiement Garmin Pay',
        '🌐 Connectivité\n - Notifications smartphone, musique embarquée\n - Cartographie mondiale, LiveTrack\n - Boutique Connect IQ (apps/cadrans)',
        '🎮 Expérience utilisateur\n - Interface personnalisable\n - Bracelet QuickFit, verre saphir\n - Idéale pour sportifs, aventuriers, voyageurs',
        '🔋 Autonomie\n - Jusqu’à 20 jours smartwatch, 60 h GPS',
        '🛡️ Garantie et support\n - 2 ans en Europe',
        '📦 Contenu de la boîte\n - Fénix 8\n - Câble de charge\n - Documentation'
      ],
    },
    {
      id: 'prod_34',
      donnees: [
        'Apple Watch Series 9 : montre fluide avec puce S9 et commandes double tap.',
        '💰 449 € – écran OLED LTPO, 64 Go, GPS/GNSS, Siri local.',
        '🧩 Spécifications matérielles\n - Écran : OLED LTPO toujours activé\n - Puce : S9 SiP double cœur\n - Stockage : 64 Go\n - Autonomie : 18 h (jusqu’à 36 h mode économie)\n - Connectivité : Wi-Fi, Bluetooth 5.3, GPS/GNSS, NFC\n - Capteurs : cardio, SpO2, température, détection de chute',
        '⌚ Fonctions sport et santé\n - Commande double tap\n - App Santé, suivi fitness, sommeil\n - Étanchéité WR50',
        '🌐 Connectivité\n - Idéale pour santé, sport, notifications discrètes\n - Paiement sans contact\n - Intégration iPhone complète',
        '🎮 Expérience utilisateur\n - watchOS fluide, complications et cadrans\n - Mode nuit automatique',
        '🔋 Autonomie\n - 18 h typique, 36 h mode basse conso',
        '🛡️ Garantie et support\n - Garantie Apple (selon région) + AppleCare option',
        '📦 Contenu de la boîte\n - Apple Watch Series 9\n - Bracelet\n - Câble de charge magnétique'
      ],
    },
    {
      id: 'prod_35',
      donnees: [
        'Apple Watch Series 10 : design ultra fin, écran bord à bord et capteurs santé avancés.',
        '💰 À partir de 429 € – OLED 1,96" 2000 nits, puce S10, UWB.',
        '🧩 Spécifications matérielles\n - Écran : OLED Retina LTPO 1,96" 2000 nits\n - Puce : S10 SiP + Neural Engine 4 cœurs\n - Stockage : 64 Go\n - Connectivité : Wi-Fi, Bluetooth 5.3, GPS/GNSS, NFC, UWB\n - Capteurs : ECG, cardio, SpO2, température, profondimètre, altimètre, détection de chute/apnée du sommeil',
        '⌚ Fonctions sport et santé\n - Double tap\n - App Santé, Pleine conscience, Sommeil\n - Étanchéité WR50',
        '🌐 Connectivité\n - Notifications, paiements, localisation UWB\n - Compatibilité iPhone, services Apple',
        '🎮 Expérience utilisateur\n - watchOS fluide, cadrans, complications\n - Design ultra fin, verre Ion-X ou saphir selon finition',
        '🔋 Autonomie\n - 18 h standard, 36 h mode économie',
        '🛡️ Garantie et support\n - Garantie Apple + AppleCare optionnelle',
        '📦 Contenu de la boîte\n - Apple Watch Series 10\n - Bracelet\n - Câble de charge'
      ],
    },
    {
      id: 'prod_56',
      donnees: [
        'Huawei Watch GT 5 Pro : boîtier titane, GPS double fréquence et 14 jours d’autonomie.',
        '💰 449,99 € – AMOLED 1,5", capteurs santé IA, GPS L1+L5, autonomie 14 jours.',
        '🧩 Spécifications matérielles\n - Boîtier titane grade 2\n - Écran : AMOLED 1,5" 466×466\n - GPS : double fréquence L1+L5\n - Étanchéité : 5 ATM + plongée\n - Autonomie : 14 jours usage normal',
        '⌚ Fonctions santé\n - Cardio H24, SpO2, sommeil détaillé\n - Stress et respiration guidée\n - Suivi cycle',
        '🌐 Connectivité\n - Bluetooth 5.2, NFC, Wi-Fi 2.4/5 GHz\n - HarmonyOS 4.0\n - Compatible Android/iPhone\n - Assistant vocal Celia',
        '🎮 Expérience utilisateur\n - 100+ sports, coach IA running\n - Cyclisme métriques puissance, natation, golf (15k parcours)\n - Interface fluide',
        '🔋 Autonomie\n - 14 jours usage normal\n - GPS continu : ~30 h\n - Charge sans fil magnétique (65 min 0-100%)',
        '🛡️ Garantie et support\n - Garantie constructeur 2 ans\n - Support Huawei international',
        '📦 Accessoires inclus\n - Watch GT 5 Pro\n - Bracelet sport\n - Chargeur sans fil magnétique\n - Câble USB-C\n - Guide utilisateur'
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
