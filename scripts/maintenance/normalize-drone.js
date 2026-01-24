async function main() {
  const pool = require('../backend/config/database');

  const updates = [
    {
      id: 'prod_27',
      donnees: [
        'Drone 4/3 Hasselblad 20 MP pensé pour la vidéo 8K et les créateurs pro.',
        '💰 À partir de 1 799 € – capteur 4/3 20 MP, 8K/30 fps, 45 min d’autonomie, portée 15 km.',
        '🧩 Spécifications matérielles\n - Capteur : CMOS 4/3 Hasselblad 20 MP\n - Vidéo : 8K/30 fps, 4K/120 fps\n - Autonomie : jusqu’à 45 min\n - Portée : 15 km (O4)\n - Poids : 895 g\n - Détection : évitement obstacles omnidirectionnel',
        '🎥 Fonctions vidéo et photo\n - Hyperlapse, ActiveTrack 5.0, MasterShots\n - Zoom optique x7, mode nuit optimisé\n - Profils LOG et D-Log pour étalonnage',
        '🌐 Connectivité\n - Application DJI Fly\n - Partage direct réseaux sociaux\n - Contrôle gestuel et vocal\n - Transmission O4 HD stable',
        '🎮 Expérience utilisateur\n - Interface intuitive, décollage/atterrissage assistés\n - Accessoires : filtres ND, batteries supplémentaires, sacoche\n - Idéal créateurs, voyageurs, pros de l’image',
        '🛡️ Sécurité et support\n - Return-to-Home avancé\n - Geofencing et détection d’obstacles complète\n - Support DJI Care (option)',
        '📦 Accessoires inclus\n - Drone Mavic 4 Pro\n - Radiocommande\n - Batterie, hélices, câble USB-C\n - Mallette de transport'
      ],
    },
    {
      id: 'prod_28',
      donnees: [
        'Drone autonome Skydio X10 pour missions industrielles, sécurité et inspection.',
        '💰 À partir de 2 999 € – double capteur 48 MP + thermique, 4K60 HDR, 40 min de vol.',
        '🧩 Spécifications matérielles\n - Capteurs : 48 MP RGB + FLIR thermique\n - Vidéo : 4K HDR 60 fps\n - Autonomie : jusqu’à 40 min\n - Portée : 12 km\n - Poids : 1,1 kg\n - IA : évitement obstacles temps réel',
        '🎥 Fonctions vidéo et photo\n - Suivi autonome par IA\n - Mapping 3D et inspection de structure\n - Stabilisation avancée, retour vidéo HD',
        '🌐 Connectivité\n - Application Skydio Enterprise\n - Contrôle via tablette ou radiocommande\n - Sync cloud sécurisé pour relevés',
        '🎮 Expérience utilisateur\n - Déploiement rapide sur site\n - Modes préconfigurés pour inspection, sécurité, repérage\n - Idéal forces de l’ordre, BTP, énergie',
        '🛡️ Sécurité et support\n - Diagnostics embarqués, vol sécurisé\n - Support pro et maintenance (options)',
        '📦 Accessoires inclus\n - Drone Skydio X10\n - Télécommande/console\n - Batterie, hélices\n - Valise de transport'
      ],
    },
    {
      id: 'prod_29',
      donnees: [
        'Drone polyvalent 50 MP bi-capteur pour créateurs, voyageurs et pros mobiles.',
        '💰 À partir de 1 599 € – double capteur 50/48 MP, 4K60 HDR, 45 min d’autonomie, portée 20 km.',
        '🧩 Spécifications matérielles\n - Capteurs : 50 MP 1” + 48 MP 1/1.3”\n - Vidéo : 4K/60 HDR, 2.7K vertical\n - Autonomie : jusqu’à 45 min\n - Portée : 20 km (O4)\n - Poids : 724 g\n - Détection : obstacles omnidirectionnelle',
        '🎥 Fonctions vidéo et photo\n - Zoom optique x3\n - FocusTrack, Panorama Libre\n - Transmission O4 HD, retour 1080p',
        '🌐 Connectivité\n - Application DJI Fly\n - Option dongle 4G\n - Radiocommande RC 2 avec écran intégré',
        '🎮 Expérience utilisateur\n - Décollage paume de main, modes auto\n - Accessoires : filtres ND, batteries, sacoche\n - Idéal vlog, voyage, prestation vidéo',
        '🛡️ Sécurité et support\n - RTH avancé, détection obstacles nuit\n - Support DJI et plan Care (option)',
        '📦 Accessoires inclus\n - Drone Air 3S\n - RC (selon pack)\n - Batterie, hélices, câble\n - Housse de transport'
      ],
    },
    {
      id: 'prod_30',
      donnees: [
        'Drone pro triple capteur pour sécurité, inspection et cartographie.',
        '💰 À partir de 2 699 € – zoom x32, capteur thermique FLIR, autonomie 32 min.',
        '🧩 Spécifications matérielles\n - Capteurs : 2× CMOS 1/2.4” + FLIR Boson thermique\n - Vidéo : 4K HDR + thermique 320×256\n - Autonomie : jusqu’à 32 min\n - Portée : 10 km\n - Poids : 500 g\n - Protection : IP53',
        '🎥 Fonctions vidéo et photo\n - Zoom x32, vision nocturne\n - Stabilisation 3 axes\n - Mapping 3D, orientation -140° à +110°',
        '🌐 Connectivité\n - Application FreeFlight 6.0\n - Pas de zones NFZ\n - Chiffrement AES-XTS 512 bits',
        '🎮 Expérience utilisateur\n - Déploiement en 55 s\n - Accessoires : batteries, hélices, valise\n - Ciblé pompiers, BTP, forces de l’ordre',
        '🛡️ Sécurité et support\n - RTH et sécurités pro\n - Support Parrot professionnel',
        '📦 Accessoires inclus\n - Anafi USA\n - Radiocommande\n - Batterie, hélices de rechange\n - Valise rigide'
      ],
    },
    {
      id: 'prod_31',
      donnees: [
        'Drone ultra-léger 249 g pour créateurs nomades avec capteur 1” et 5.3K.',
        '💰 À partir de 999 € – capteur 1” 20 MP, 5.3K/30, 38 min d’autonomie, portée 18 km.',
        '🧩 Spécifications matérielles\n - Capteur : CMOS 1” 20 MP\n - Vidéo : 5.3K/30 fps, 4K/60 HDR\n - Autonomie : jusqu’à 38 min\n - Portée : 18 km\n - Poids : 249 g',
        '🎥 Fonctions vidéo et photo\n - ActiveTrack 360°, MasterShots, Hyperlapse\n - Zoom numérique x4, mode nuit amélioré\n - Transmission O5 HD, retour 1080p',
        '🌐 Connectivité\n - Application DJI Fly\n - Détection LiDAR omnidirectionnelle\n - Contrôle vocal, synchro cloud',
        '🎮 Expérience utilisateur\n - Décollage paume, modes auto débutant\n - Accessoires : filtres ND, batteries, valise\n - Parfait vlog, voyage, création mobile',
        '🛡️ Sécurité et support\n - RTH avancé, détection obstacles 360°\n - Support DJI / DJI Care',
        '📦 Accessoires inclus\n - Drone Mini 5 Pro\n - Radiocommande\n - Batterie, hélices, câble\n - Étui de transport'
      ],
    },
    {
      id: 'prod_32',
      donnees: [
        'Drone léger Autel Nano Plus pour photo 4K HDR et vols urbains.',
        '💰 À partir de 849 € – capteur 1/1.28” 50 MP, 4K HDR, 28 min d’autonomie, 250 g.',
        '🧩 Spécifications matérielles\n - Capteur : 1/1.28” 50 MP RYYB\n - Vidéo : 4K HDR 30 fps\n - Autonomie : jusqu’à 28 min\n - Portée : 10 km\n - Poids : ≈250 g\n - Détection : obstacle avant/arrière/bas',
        '🎥 Fonctions vidéo et photo\n - HDR vidéo, suivi sujet\n - Hyperlapse et Portrait aérien\n - Mode nuit optimisé',
        '🌐 Connectivité\n - Application Autel Sky\n - Transmission SkyLink stable\n - Partage rapide réseaux sociaux',
        '🎮 Expérience utilisateur\n - Décollage facile, modes débutant\n - Accessoires : filtres ND, chargeur multi-batteries\n - Pensé pour créateurs urbains',
        '🛡️ Sécurité et support\n - RTH intelligent\n - Mise à jour OTA\n - Support Autel',
        '📦 Accessoires inclus\n - Drone Nano Plus\n - Radiocommande\n - Batterie, hélices de rechange\n - Câble USB-C, housse'
      ],
    },
    {
      id: 'prod_33',
      donnees: [
        'Drone Autel EVO Max 5G longue portée avec capteur 1” 20 MP.',
        '💰 À partir de 999 € – 5.3K/30, 4K/60, 38 min d’autonomie, portée 18 km.',
        '🧩 Spécifications matérielles\n - Capteur : CMOS 1” 20 MP\n - Vidéo : 5.3K/30, 4K/60 HDR\n - Autonomie : jusqu’à 38 min\n - Portée : 18 km\n - Poids : 249 g (châssis léger)',
        '🎥 Fonctions vidéo et photo\n - ActiveTrack et modes cinéma\n - Hyperlapse, MasterShots\n - Transmission longue portée, retour 1080p',
        '🌐 Connectivité\n - Application Autel Explorer\n - LiDAR et détection obstacles avancée\n - Contrôle vocal, synchro cloud',
        '🎮 Expérience utilisateur\n - Décollage paume, interface simple\n - Accessoires : filtres ND, batteries, valise\n - Idéal pour pros mobiles',
        '🛡️ Sécurité et support\n - RTH avancé, geofencing configurable\n - Support Autel Care (option)',
        '📦 Accessoires inclus\n - Drone EVO Max 5G\n - Radiocommande\n - Batterie, hélices\n - Sac de transport'
      ],
    },
    {
      id: 'prod_42',
      donnees: [
        'Drone X-Pro 2025 compact pliable 4K UHD pour voyageurs et pros légers.',
        '💰 1 199 € – 4K UHD stabilisé 3 axes, bras pliables, autonomie étendue.',
        '🧩 Spécifications matérielles\n - Caméra : 4K UHD stabilisation 3 axes\n - Autonomie : longue durée (pack multi-batteries)\n - Conception : bras pliables alliage léger\n - Portée : longue distance (mode FCC)\n - GPS + capteurs vision pour stabilité',
        '🎥 Fonctions vidéo et photo\n - Profils Log pour étalonnage\n - Ralenti 1080p haute vitesse\n - Panoramas et suivi sujet',
        '🌐 Connectivité\n - Application mobile dédiée\n - Partage direct réseaux sociaux\n - Retour vidéo HD',
        '🎮 Expérience utilisateur\n - Décollage/atterrissage automatiques\n - Modes intelligents (Follow Me, Orbit)\n - Transport facile grâce au châssis pliable',
        '🛡️ Sécurité et support\n - RTH automatique\n - Alerte vent et batterie faible\n - Support en ligne + garantie constructeur',
        '📦 Contenu de la boîte\n - Drone X-Pro 2025\n - Radiocommande\n - Batteries (selon pack)\n - Hélices de rechange\n - Sacoche de transport'
      ],
    },
    {
      id: 'prod_52',
      donnees: [
        'Drone ultra-compact 4K60 pilotable aux gestes, idéal pour créateurs mobiles.',
        '💰 249,99 € – caméra 4K60 stabilisée, 25 min de vol, 135 g.',
        '🧩 Spécifications matérielles\n - Caméra : 4K 60 fps, stabilisation 3 axes\n - Autonomie : 25 min\n - Poids : 135 g\n - Portée : 10 km (O4 HD)\n - Stockage : 32 Go interne + microSD',
        '🎥 Fonctions vidéo et photo\n - Follow Me, Orbit, Dronie, QuickShots\n - Slow motion 4K 120 fps\n - Photos RAW 12 MP, live streaming',
        '🌐 Connectivité\n - App DJI Fly\n - GPS/GLONASS double précision\n - Wi-Fi direct smartphone, mode hors ligne sécurisé',
        '🎮 Expérience utilisateur\n - Pilotage gestes, décollage auto\n - Mode débutant sécurisé\n - Interface tactile et partage social rapide',
        '🔋 Autonomie et charge\n - Batterie intelligente 1 435 mAh\n - Charge USB-C 60 min\n - Indicateurs LED statut',
        '🛡️ Sécurité et conformité\n - Détection obstacles 360°\n - Return-to-Home automatique\n - Certification CE/FCC',
        '📦 Contenu de la boîte\n - Drone DJI Neo 2\n - Batterie intelligente\n - Protections hélices x4\n - Câble USB-C\n - Guide de démarrage'
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
