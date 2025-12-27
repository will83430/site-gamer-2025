async function updateProducts() {
  const c = new Client({ user: 'postgres', host: 'localhost', database: 'gamer_2025', password: 'Wilfried!1985', port: 5432 });
  await c.connect();
  
  console.log('Vérification des données manquantes...\n');
  
  // Les données complètes à ajouter
  const updates = [
    {
      id: 'prod_44',
      fonctionnalites_avancees: '{"Spécifications matérielles- Processeur : Intel Core i9-12900K- RAM : 32 Go DDR5- Stockage : 2 To SSD NVMe- Carte Graphique : NVIDIA GeForce RTX 4080- Connectivité : Wi-Fi 6, Bluetooth 5.2- Boîtier : Tour ATX avec refroidissement liquide RGB"}',
      donnees_fiche: '["PC gaming haut de gamme avec éclairage RGB, conçu pour les performances en 4K et la réalité virtuelle.","💰 Prix : 1549,99 €","🧩 Spécifications- Processeur : Intel Core i9-12900K- RAM : 32 Go DDR5- Stockage : 2 To SSD NVMe- Carte Graphique : NVIDIA GeForce RTX 4080- Connectivité : Wi-Fi 6, Bluetooth 5.2- Boîtier : Tour ATX avec refroidissement liquide RGB","🌐 Fonctionnalités- Optimisation thermique avancée- Support multi-écrans- Mode streaming haute performance- Compatible VR avec Oculus et HTC Vive","🎮 Usage recommandé- Idéal pour le gaming AAA, le montage vidéo 4K, la modélisation 3D et les expériences immersives multi-écrans."]'
    },
    {
      id: 'prod_41',
      fonctionnalites_avancees: '{"Spécifications matérielles - Processeur : Intel Core Ultra 9 275HX - Carte graphique : NVIDIA GeForce RTX 5070 Laptop GPU - RAM : 32 Go DDR5-5600 - Stockage : SSD PCIe Gen4 NVMe de 1 To - Connectivité : Wi-Fi 6E, Bluetooth 5.3, Ethernet RJ45, USB-C 40Gbps"}',
      donnees_fiche: '["Le PC portable gaming 18 pouces ultime, conçu pour les performances extrêmes et les jeux AAA en 2.5K.","💰 À partir de 2 599 euros – Intel Core Ultra 9 275HX, RTX 5070, 32 Go DDR5, SSD 1 To, écran 240 Hz.","🧩 Spécifications matérielles - Processeur : Intel Core Ultra 9 275HX (36 Mo cache, jusqu à 5.1 GHz) - Carte graphique : NVIDIA GeForce RTX 5070 Laptop GPU (8 Go GDDR7) - RAM : 32 Go DDR5-5600 (2x16 Go) - Stockage : SSD PCIe Gen4 NVMe de 1 To - Connectivité : Wi-Fi 6E, Bluetooth 5.3, Ethernet RJ45, USB-C 40Gbps - Refroidissement : ROG Intelligent Cooling avec métal liquide","🎮 Fonctions gaming - Technologies : NVIDIA Advanced Optimus, DLSS 3.5, G-Sync - Audio : Dolby Atmos, Smart Amp - Clavier : rétroéclairé RGB par touche, effet Halo Sync - Système : Windows 11 Pro avec Armoury Crate","🌐 Fonctionnalités connectées - Ports : 2x USB-A 3.2 Gen2, 2x USB-C (Thunderbolt 4 + DisplayPort), HDMI 2.1, combo audio 3.5mm - Extension : 2 slots M.2, 2 slots SO-DIMM (jusqu à 64 Go) - Sécurité : webcam FHD, verrou Kensington - Écosystème : compatible ROG accessories, Aura Sync","🎮 Expérience utilisateur - Écran : 18 WQXGA IPS (2560 x 1600), 240 Hz, 100% DCI-P3, Dolby Vision - Design : châssis aluminium, ventilation arrière, finitions gaming - Poids : 3.2 kg - Idéal pour les gamers exigeants, streamers et créateurs de contenu"]'
    },
    {
      id: 'prod_49',
      fonctionnalites_avancees: '{"Spécifications matérielles - Processeurs : jusqu à 4 x Intel Xeon Gen5 - RAM : jusqu à 6 To DDR5 ECC - Stockage : jusqu à 32 x SSD NVMe U.2 - Refroidissement : ventilateurs redondants + gestion thermique intelligente - Connectivité : 4 x ports 10/25/100 GbE, USB 3.2, iDRAC9 - Format : rack 4U avec rails coulissants"}',
      donnees_fiche: '["Le serveur rack 4U le plus performant de 2025, conçu pour les charges critiques et les environnements cloud hybrides.","💰 À partir de 8 999 euros – 4 processeurs Intel Xeon Gen5, jusqu à 6 To de RAM DDR5, stockage NVMe haute densité.","🧩 Spécifications matérielles - Processeurs : jusqu à 4 x Intel Xeon Gen5 - RAM : jusqu à 6 To DDR5 ECC - Stockage : jusqu à 32 x SSD NVMe U.2 - Refroidissement : ventilateurs redondants + gestion thermique intelligente - Connectivité : 4 x ports 10/25/100 GbE, USB 3.2, iDRAC9 - Format : rack 4U avec rails coulissants","🖥️ Performances et virtualisation - Optimisé pour VMware, Hyper-V, Proxmox - Prise en charge des conteneurs (Docker, Kubernetes) - Sécurité renforcée avec TPM 2.0 et Secure Boot - Gestion à distance via OpenManage Enterprise","🌐 Fonctionnalités avancées - Redondance complète (alimentation, réseau, stockage) - BIOS et firmware auto-réparables - Surveillance proactive avec IA embarquée - Compatible cloud hybride et edge computing","🎮 Cas d usage - Datacenters haute performance - Intelligence artificielle et machine learning - Bases de données critiques (SAP HANA, Oracle) - Virtualisation massive et hébergement web"]'
    },
    {
      id: 'prod_45',
      fonctionnalites_avancees: '{"Spécifications matérielles - Capteur : 8 000 DPI avec suivi sur verre - Boutons : 7 personnalisables + molette latérale - Défilement : MagSpeed électromagnétique ultra rapide - Autonomie : jusqu à 90 jours - Recharge : USB-C rapide (1 min = 3h) - Connectivité : Bluetooth + Logi Bolt"}',
      donnees_fiche: '["La souris haut de gamme la plus précise et polyvalente de 2025, conçue pour les pros et les créateurs.","💰 À partir de 149 euros – capteur 8K DPI, défilement MagSpeed, autonomie 90 jours, connectivité multi-appareils.","🧩 Spécifications matérielles - Capteur : 8 000 DPI avec suivi sur verre - Boutons : 7 personnalisables + molette latérale - Défilement : MagSpeed électromagnétique ultra rapide - Autonomie : jusqu à 90 jours - Recharge : USB-C rapide (1 min = 3h) - Connectivité : Bluetooth + Logi Bolt","🖥️ Ergonomie et design - Forme sculptée pour droitier - Repose-pouce intégré - Finition mate premium - Disponible en noir graphite, gris clair et bleu nuit","🌐 Fonctionnalités avancées - Flow : contrôle multi-PC avec copier-coller entre machines - Appairage avec 3 appareils - Logiciel Logi Options+ pour personnalisation - Compatible Windows, macOS, Linux, ChromeOS","🎮 Expérience utilisateur - Idéale pour bureautique, création, productivité - Silencieuse et ultra fluide - Parfaite pour les longues sessions - Récompensée pour son confort et sa précision"]'
    }
  ];

  for (const update of updates) {
    try {
      await c.query(
        'UPDATE produits SET fonctionnalites_avancees = $1, donnees_fiche = $2 WHERE id = $3',
        [update.fonctionnalites_avancees, update.donnees_fiche, update.id]
      );
      console.log(`✅ ${update.id} - mis à jour`);
    } catch (err) {
      console.error(`❌ ${update.id}:`, err.message);
    }
  }

  const r = await c.query('SELECT COUNT(*) as count FROM produits');
  console.log(`\n✅ Total: ${r.rows[0].count} produits dans la DB`);
  
  await c.end();
}

updateProducts().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});
