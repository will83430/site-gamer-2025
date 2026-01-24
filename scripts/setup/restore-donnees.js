async function main() {
  const pool = require('../backend/config/database');

  // Restaure le format original depuis le seed SQL
  const updates = [
    {
      id: 'prod_1',
      donnees: [
        "Le PC gamer compact le plus puissant de 2025, idéal pour le jeu 4K et la création.",
        "💰 À partir de 3 499 € – Intel Core i9-14900K, RTX 5090, 64 Go DDR5, SSD 4 To, Wi-Fi 7.",
        "🧩 Spécifications matérielles\n - Processeur : Intel Core i9-14900K\n - Carte graphique : NVIDIA RTX 5090 24 Go\n - RAM : 64 Go DDR5\n - Stockage : SSD NVMe 4 To\n - Connectivité : Wi-Fi 7, Bluetooth 5.4, Ethernet 10G",
        "🎮 Fonctions gaming\n - Ray tracing, DLSS 4, Reflex\n - Refroidissement liquide intégral\n - RGB personnalisable",
        "🌐 Fonctionnalités connectées\n - iCUE pour gestion RGB et monitoring\n - Streaming 4K, VR Ready\n - Ports Thunderbolt 4, USB-C, HDMI 2.1",
        "🎮 Expérience utilisateur\n - Format compact, ultra silencieux\n - Châssis aluminium premium\n - Idéal pour gamers, streamers, créateurs"
      ]
    }
  ];

  for (const upd of updates) {
    await pool.query('UPDATE produits SET donnees_fiche = $1 WHERE id = $2', [upd.donnees, upd.id]);
    console.log(`✅ ${upd.id} restauré`);
  }

  console.log('\n✅ Restauration terminée');
  await pool.end();
}

main().catch(console.error);
