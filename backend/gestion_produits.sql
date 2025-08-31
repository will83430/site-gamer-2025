INSERT INTO produits
SELECT *
FROM json_populate_recordset(
    NULL::produits,
    $$
  
  {
    "nom": "Corsair One i500",
    "categorie": "PC GAMING",
    "image": "Corsair One i500 sty.png",
    "lien": "fiches/pc-gaming/Corsair One i500.html",
    "description": "PC gaming ultra compact avec RTX 5090 et refroidissement liquide.",
    "top_du_mois": true,
    "prix": "À partir de 3 499 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeur : Intel Core i9-14900K - Carte graphique : NVIDIA RTX 5090 24 Go - RAM : 64 Go DDR5 - Stockage : SSD NVMe 4 To - Connectivité : Wi-Fi 7, Bluetooth 5.4, Ethernet 10G"
    ],
    "id": "prod_1",
    "donnees_fiche": [
      "Le PC gamer compact le plus puissant de 2025, idéal pour le jeu 4K et la création.",
      "💰 À partir de 3 499 € – Intel Core i9-14900K, RTX 5090, 64 Go DDR5, SSD 4 To, Wi-Fi 7.",
      "🧩 Spécifications matérielles\\n - Processeur : Intel Core i9-14900K\\n - Carte graphique : NVIDIA RTX 5090 24 Go\\n - RAM : 64 Go DDR5\\n - Stockage : SSD NVMe 4 To\\n - Connectivité : Wi-Fi 7, Bluetooth 5.4, Ethernet 10G",
      "🎮 Fonctions gaming\\n - Ray tracing, DLSS 4, Reflex\\n - Refroidissement liquide intégral\\n - RGB personnalisable",
      "🌐 Fonctionnalités connectées\\n - iCUE pour gestion RGB et monitoring\\n - Streaming 4K, VR Ready\\n - Ports Thunderbolt 4, USB-C, HDMI 2.1",
      "🎮 Expérience utilisateur\\n - Format compact, ultra silencieux\\n - Châssis aluminium premium\\n - Idéal pour gamers, streamers, créateurs"
    ]
  },
  {
    "nom": "Vibox X-215 SG",
    "categorie": "PC GAMING",
    "description": "PC gaming haut de gamme avec éclairage RGB, conçu pour les performances en 4K et la réalité virtuelle.",
    "image": "Vibox X-215 SG stylé.png",
    "lien": "fiches/pc-gaming/Vibox X-215 SG.html",
    "top_du_mois": true,
    "prix": "1549.99 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles- Processeur : Intel Core i9-12900K- RAM : 32 Go DDR5- Stockage : 2 To SSD NVMe- Carte Graphique : NVIDIA GeForce RTX 4080- Connectivité : Wi-Fi 6, Bluetooth 5.2- Boîtier : Tour ATX avec refroidissement liquide RGB"
    ],
    "id": "prod_2",
    "donnees_fiche": [
      "PC gaming haut de gamme avec éclairage RGB, conçu pour les performances en 4K et la réalité virtuelle.",
      "💰 Prix : 1549,99 €",
      "🧩 Spécifications- Processeur : Intel Core i9-12900K- RAM : 32 Go DDR5- Stockage : 2 To SSD NVMe- Carte Graphique : NVIDIA GeForce RTX 4080- Connectivité : Wi-Fi 6, Bluetooth 5.2- Boîtier : Tour ATX avec refroidissement liquide RGB",
      "🌐 Fonctionnalités- Optimisation thermique avancée- Support multi-écrans- Mode streaming haute performance- Compatible VR avec Oculus et HTC Vive",
      "🎮 Usage recommandé- Idéal pour le gaming AAA, le montage vidéo 4K, la modélisation 3D et les expériences immersives multi-écrans."
    ]
  },
  {
    "nom": "Asus ROG Strix G18",
    "categorie": "PC GAMING",
    "image": "Asus ROG Strix G18.png",
    "lien": "fiches/pc-gaming/Asus ROG Strix G18.html",
    "description": "PC 18 pouces ultra puissant avec RTX 5070 et écran 240 Hz.",
    "top_du_mois": true,
    "prix": "À partir de 2 599 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeur : Intel Core Ultra 9 275HX - Carte graphique : NVIDIA GeForce RTX 5070 Laptop GPU - RAM : 32 Go DDR5-5600 - Stockage : SSD PCIe Gen4 NVMe de 1 To - Connectivité : Wi-Fi 6E, Bluetooth 5.3, Ethernet RJ45, USB-C 40Gbps"
    ],
    "id": "prod_3",
    "donnees_fiche": [
      "Le PC portable gaming 18 pouces ultime, conçu pour les performances extrêmes et les jeux AAA en 2.5K.",
      "💰 À partir de 2 599 € – Intel Core Ultra 9 275HX, RTX 5070, 32 Go DDR5, SSD 1 To, écran 240 Hz.",
      "🧩 Spécifications matérielles\\n - Processeur : Intel Core Ultra 9 275HX (36 Mo cache, jusqu’à 5.1 GHz)\\n - Carte graphique : NVIDIA GeForce RTX 5070 Laptop GPU (8 Go GDDR7)\\n - RAM : 32 Go DDR5-5600 (2x16 Go)\\n - Stockage : SSD PCIe Gen4 NVMe de 1 To\\n - Connectivité : Wi-Fi 6E, Bluetooth 5.3, Ethernet RJ45, USB-C 40Gbps\\n - Refroidissement : ROG Intelligent Cooling avec métal liquide",
      "🎮 Fonctions gaming\\n - Technologies : NVIDIA Advanced Optimus, DLSS 3.5, G-Sync\\n - Audio : Dolby Atmos, Smart Amp\\n - Clavier : rétroéclairé RGB par touche, effet Halo Sync\\n - Système : Windows 11 Pro avec Armoury Crate",
      "🌐 Fonctionnalités connectées\\n - Ports : 2x USB-A 3.2 Gen2, 2x USB-C (Thunderbolt 4 + DisplayPort), HDMI 2.1, combo audio 3.5mm\\n - Extension : 2 slots M.2, 2 slots SO-DIMM (jusqu’à 64 Go)\\n - Sécurité : webcam FHD, verrou Kensington\\n - Écosystème : compatible ROG accessories, Aura Sync",
      "🎮 Expérience utilisateur\\n - Écran : 18” WQXGA IPS (2560 × 1600), 240 Hz, 100% DCI-P3, Dolby Vision\\n - Design : châssis aluminium, ventilation arrière, finitions gaming\\n - Poids : 3.2 kg\\n - Idéal pour les gamers exigeants, streamers et créateurs de contenu"
    ]
  },
  {
    "nom": "Dell PowerEdge R960",
    "categorie": "SERVEUR",
    "image": "dell-poweredge-r960.png",
    "lien": "fiches/serveur/Dell PowerEdge R960.html",
    "description": "Serveur rack 4U avec 4 processeurs et 12 To de RAM.",
    "top_du_mois": false,
    "prix": "À partir de 8 999 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeurs : jusqu’à 4 × Intel Xeon Gen5 - RAM : jusqu’à 6 To DDR5 ECC - Stockage : jusqu’à 32 × SSD NVMe U.2 - Refroidissement : ventilateurs redondants + gestion thermique intelligente - Connectivité : 4 × ports 10/25/100 GbE, USB 3.2, iDRAC9 - Format : rack 4U avec rails coulissants"
    ],
    "id": "prod_4",
    "donnees_fiche": [
      "Le serveur rack 4U le plus performant de 2025, conçu pour les charges critiques et les environnements cloud hybrides.",
      "💰 À partir de 8 999 € – 4 processeurs Intel Xeon Gen5, jusqu’à 6 To de RAM DDR5, stockage NVMe haute densité.",
      "🧩 Spécifications matérielles\\n - Processeurs : jusqu’à 4 × Intel Xeon Gen5\\n - RAM : jusqu’à 6 To DDR5 ECC\\n - Stockage : jusqu’à 32 × SSD NVMe U.2\\n - Refroidissement : ventilateurs redondants + gestion thermique intelligente\\n - Connectivité : 4 × ports 10/25/100 GbE, USB 3.2, iDRAC9\\n - Format : rack 4U avec rails coulissants",
      "🖥️ Performances et virtualisation\\n - Optimisé pour VMware, Hyper-V, Proxmox\\n - Prise en charge des conteneurs (Docker, Kubernetes)\\n - Sécurité renforcée avec TPM 2.0 et Secure Boot\\n - Gestion à distance via OpenManage Enterprise",
      "🌐 Fonctionnalités avancées\\n - Redondance complète (alimentation, réseau, stockage)\\n - BIOS et firmware auto-réparables\\n - Surveillance proactive avec IA embarquée\\n - Compatible cloud hybride et edge computing",
      "🎮 Cas d’usage\\n - Datacenters haute performance\\n - Intelligence artificielle et machine learning\\n - Bases de données critiques (SAP HANA, Oracle)\\n - Virtualisation massive et hébergement web"
    ]
  },
  {
    "nom": "Dell PowerEdge R760",
    "categorie": "SERVEUR",
    "image": "Dell PowerEdge R760.png",
    "lien": "fiches/serveur/Dell PowerEdge R760.html",
    "description": "Serveur rack 2U ultra performant pour datacenter et virtualisation.",
    "top_du_mois": false,
    "prix": "À partir de 4 999 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeur : Dual Intel Xeon Scalable Gen4 - RAM : Jusqu'à 2 To DDR5 ECC - Stockage : 12 baies SSD/NVMe hot swap - Réseau : 4x 10GbE + iDRAC - Redondance : alimentation double + refroidissement actif - Virtualisation : compatible VMware, Hyper-V, Proxmox"
    ],
    "id": "prod_5",
    "donnees_fiche": [
      "Serveur rack 2U hautes performances, idéal pour la virtualisation, l’IA et les infrastructures cloud hybrides.",
      "💰 À partir de 5 499 € – 2 processeurs Intel Xeon Gen5, jusqu’à 8 To de RAM DDR5, stockage NVMe haute densité.",
      "🧩 Spécifications matérielles\\n - Processeurs : jusqu’à 2 × Intel Xeon Gen5 (jusqu’à 56 cœurs chacun)\\n - RAM : jusqu’à 8 To DDR5 ECC (32 slots DIMM)\\n - Stockage : jusqu’à 24 × SSD NVMe U.2 Gen4/Gen5\\n - Refroidissement : Smart Flow chassis + ventilateurs redondants\\n - Connectivité : 2 × ports 100 GbE, USB 3.2, iDRAC9\\n - Format : rack 2U avec options GPU (jusqu’à 2 double-wide)",
      "🖥️ Performances et virtualisation\\n - Optimisé pour VMware, Hyper-V, Proxmox\\n - Prise en charge des conteneurs (Docker, Kubernetes)\\n - Sécurité renforcée avec TPM 2.0, Secure Boot et MFA\\n - Gestion centralisée via OpenManage Enterprise",
      "🌐 Fonctionnalités avancées\\n - Architecture résiliente Zero Trust\\n - BIOS et firmware auto-réparables\\n - Surveillance proactive avec IA embarquée\\n - Compatible cloud hybride, edge computing et IA",
      "🎮 Cas d’usage\\n - Virtualisation standardisée\\n - Bases de données et analytics\\n - Infrastructure VDI\\n - Intelligence artificielle et machine learning"
    ]
  },
  {
    "nom": "Logitech MX Master 4S",
    "categorie": "PERIPHERIQUES",
    "image": "logitech-mx-master-4s.png",
    "lien": "fiches/peripheriques/Logitech MX Master 4S.html",
    "description": "Souris ergonomique ultra précise pour bureautique et gaming.",
    "top_du_mois": true,
    "prix": "À partir de 149 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteur : 8 000 DPI avec suivi sur verre - Boutons : 7 personnalisables + molette latérale - Défilement : MagSpeed électromagnétique ultra rapide - Autonomie : jusqu’à 90 jours - Recharge : USB-C rapide (1 min = 3h) - Connectivité : Bluetooth + Logi Bolt"
    ],
    "id": "prod_6",
    "donnees_fiche": [
      "La souris haut de gamme la plus précise et polyvalente de 2025, conçue pour les pros et les créateurs.",
      "💰 À partir de 149 € – capteur 8K DPI, défilement MagSpeed, autonomie 90 jours, connectivité multi-appareils.",
      "🧩 Spécifications matérielles\\n - Capteur : 8 000 DPI avec suivi sur verre\\n - Boutons : 7 personnalisables + molette latérale\\n - Défilement : MagSpeed électromagnétique ultra rapide\\n - Autonomie : jusqu’à 90 jours\\n - Recharge : USB-C rapide (1 min = 3h)\\n - Connectivité : Bluetooth + Logi Bolt",
      "🖥️ Ergonomie et design\\n - Forme sculptée pour droitier\\n - Repose-pouce intégré\\n - Finition mate premium\\n - Disponible en noir graphite, gris clair et bleu nuit",
      "🌐 Fonctionnalités avancées\\n - Flow : contrôle multi-PC avec copier-coller entre machines\\n - Appairage avec 3 appareils\\n - Logiciel Logi Options+ pour personnalisation\\n - Compatible Windows, macOS, Linux, ChromeOS",
      "🎮 Expérience utilisateur\\n - Idéale pour bureautique, création, productivité\\n - Silencieuse et ultra fluide\\n - Parfaite pour les longues sessions\\n - Récompensée pour son confort et sa précision"
    ]
  },
  {
    "nom": "SteelSeries Apex Pro TKL Gen 3",
    "categorie": "PERIPHERIQUES",
    "image": "SteelSeries Apex Pro TKL Gen 3.png",
    "lien": "fiches/peripheriques/SteelSeries Apex Pro TKL Gen 3.html",
    "description": "Clavier gaming mécanique ultra réactif avec switches magnétiques ajustables et OLED intégré.",
    "top_du_mois": false,
    "prix": "À partir de 229 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Format : TenKeyLess (sans pavé numérique) - Switches : OmniPoint 2.0 magnétiques ajustables - Écran : OLED personnalisable - Rétroéclairage : RGB 16.8M couleurs par touche - Connectivité : USB-C détachable - Matériaux : aluminium aviation série 5000 - Anti-ghosting : 100% N-Key rollover - Compatibilité : Windows, macOS, Linux"
    ],
    "id": "prod_7",
    "donnees_fiche": [
      "Le clavier gaming le plus rapide du monde, conçu pour les joueurs compétitifs avec switches magnétiques OmniPoint 3.0.",
      "💰 À partir de 249 € – switches OmniPoint 3.0, Rapid Trigger, écran OLED, aluminium premium, USB-C détachable.",
      "🧩 Spécifications matérielles\\n - Switches : OmniPoint 3.0 à effet Hall, activation réglable 0.1–4.0 mm\\n - Format : Tenkeyless (TKL), sans pavé numérique\\n - Matériaux : plaque supérieure en aluminium de qualité aéronautique\\n - Écran : OLED intelligent pour stats et contrôle multimédia\\n - Connectivité : USB-C détachable, compatible SteelSeries GG",
      "🖥️ Ergonomie et design\\n - Dimensions : 355 × 129 × 42 mm\\n - Poids : 974 g\\n - Rétroéclairage RGB par touche\\n - Molette de volume en aluminium\\n - Câble tressé amovible",
      "🌐 Fonctionnalités avancées\\n - Rapid Trigger et Rapid Tap pour saisie ultra rapide\\n - Protection Mode pour éviter les frappes accidentelles\\n - GG QuickSet : préréglages instantanés\\n - Compatible Windows, macOS, Linux",
      "🎮 Expérience utilisateur\\n - Idéal pour e-sport, FPS, MOBA et multitâche\\n - Personnalisation complète via SteelSeries GG\\n - Résistant, précis et ultra réactif\\n - Récompensé pour sa performance et son confort"
    ]
  },
  {
    "nom": "Apple iPad Pro M4",
    "categorie": "TABLETTE",
    "image": "iPad.png",
    "lien": "fiches/tablette/Apple iPad Pro M4.html",
    "description": "Tablette professionnelle avec puce M4, écran OLED et Face ID.",
    "top_du_mois": false,
    "prix": "À partir de 1 099 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeur : Apple M4 - RAM : 8 ou 16 Go selon configuration - Stockage : 256 Go / 512 Go / 1 To / 2 To - Batterie : autonomie jusqu’à 10 heures - Connectivité : Wi-Fi 6E, Bluetooth 5.3, USB-C - Épaisseur : seulement 5,1 mm"
    ],
    "id": "prod_8",
    "donnees_fiche": [
      "La tablette la plus puissante et élégante de 2025, conçue pour les créateurs et les pros.",
      "💰 À partir de 1 099 € – puce Apple M4, écran OLED Ultra Retina XDR, design ultra-fin, Apple Pencil Pro compatible.",
      "🧩 Spécifications matérielles\\n - Processeur : Apple M4\\n - RAM : 8 ou 16 Go selon configuration\\n - Stockage : 256 Go / 512 Go / 1 To / 2 To\\n - Batterie : autonomie jusqu’à 10 heures\\n - Connectivité : Wi-Fi 6E, Bluetooth 5.3, USB-C\\n - Épaisseur : seulement 5,1 mm",
      "🖥️ Écran et affichage\\n - Taille : 11 ou 13 pouces\\n - Technologie : OLED Ultra Retina XDR\\n - Résolution : 2420 × 1668 (11\") / 2752 × 2064 (13\")\\n - Luminosité : jusqu’à 1 600 nits en HDR\\n - Taux de rafraîchissement : 120 Hz (ProMotion)",
      "🖊️ Accessoires et interaction\\n - Apple Pencil Pro : retour haptique, capteur de pression, gestuelle\\n - Magic Keyboard : pavé tactile, touches rétroéclairées\\n - Face ID et caméra falseDepth\\n - Système d’exploitation : iPadOS 17",
      "🌐 Fonctionnalités avancées\\n - Multifenêtrage et Stage Manager\\n - Applications pro : Final Cut Pro, Logic Pro, Affinity Photo\\n - Enregistrement vidéo en ProRes\\n - Synchronisation iCloud et AirDrop",
      "🎮 Expérience utilisateur\\n - Idéal pour le dessin, le montage vidéo, la musique et le gaming\\n - Compatible avec les jeux Apple Arcade et les apps créatives\\n - Interface fluide et intuitive"
    ]
  },
  {
    "nom": "Samsung Galaxy S25 Ultra",
    "categorie": "SMARTPHONE",
    "image": "Samsung Galaxy S25 U.png",
    "lien": "fiches/smartphone/Samsung Galaxy S25 Ultra.html",
    "description": "Smartphone haut de gamme avec zoom x100 et écran AMOLED 120Hz.",
    "top_du_mois": true,
    "prix": "À partir de 1 199 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeur : Snapdragon 8 Elite - RAM : 12 ou 16 Go - Stockage : 256 Go / 512 Go / 1 To - Batterie : 5 000 mAh — autonomie jusqu’à 2 jours - Refroidissement : chambre à vapeur optimisée - Connectivité : Wi-Fi 7, Bluetooth 5.4, USB-C"
    ],
    "id": "prod_9",
    "donnees_fiche": [
      "Le smartphone Android le plus puissant et polyvalent de 2025.",
      "💰 À partir de 1 199 € – Snapdragon 8 Elite, écran Dynamic AMOLED 2X, quadruple capteur photo, IA intégrée.",
      "🧩 Spécifications matérielles\\n - Processeur : Snapdragon 8 Elite\\n - RAM : 12 ou 16 Go\\n - Stockage : 256 Go / 512 Go / 1 To\\n - Batterie : 5 000 mAh — autonomie jusqu’à 2 jours\\n - Refroidissement : chambre à vapeur optimisée\\n - Connectivité : Wi-Fi 7, Bluetooth 5.4, USB-C",
      "🖥️ Écran et affichage\\n - Taille : 6,9 pouces Dynamic AMOLED 2X\\n - Résolution : 1440 × 3120 pixels\\n - Taux de rafraîchissement : 1 à 120 Hz (LTPO)\\n - Luminosité : jusqu’à 2 600 nits\\n - Revêtement : Gorilla Glass Armor anti-reflets",
      "📸 Appareil photo\\n - Capteur principal : 200 MP\\n - Ultra grand-angle : 50 MP\\n - Téléobjectif x3 : 10 MP\\n - Périscope x5 : 50 MP\\n - Zoom optique jusqu’à x10\\n - Vidéo : 8K à 30 fps",
      "🌐 Fonctionnalités avancées\\n - Galaxy AI : résumé vocal, traduction instantanée, retouche photo intelligente\\n - Interface One UI 7\\n - S Pen intégré (sans Bluetooth)\\n - Résistance IP68\\n - Recharge rapide 45W + recharge sans fil",
      "🎮 Expérience utilisateur\\n - Idéal pour le multitâche, la photo pro et le gaming\\n - Compatible avec DeX, Samsung Cloud, et SmartThings\\n - Mises à jour Android garanties pendant 7 ans"
    ]
  },
  {
    "nom": "Garmin Fénix 8",
    "categorie": "MONTRE CONNECTEE",
    "image": "fénix 8.png",
    "lien": "fiches/montre-connectee/Garmin Fénix 8.html",
    "description": "Montre GPS multisport avec cartographie et suivi santé complet.",
    "top_du_mois": false,
    "prix": "À partir de 799 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Écran : AMOLED 1,4” tactile - GPS multi-bandes, altimètre, baromètre, boussole - Autonomie : jusqu’à 30 jours - Étanchéité : 10 ATM"
    ],
    "id": "prod_10",
    "donnees_fiche": [
      "La montre connectée la plus complète de 2025, idéale pour le sport, l’aventure et la santé.",
      "💰 À partir de 799 € – GPS multi-bandes, autonomie 30j, écran AMOLED, cartographie mondiale, paiement sans contact.",
      "🧩 Spécifications matérielles\\n - Écran : AMOLED 1,4” tactile\\n - GPS multi-bandes, altimètre, baromètre, boussole\\n - Autonomie : jusqu’à 30 jours\\n - Étanchéité : 10 ATM",
      "⌚ Fonctions sport et santé\\n - Suivi multisport, VO2max, ECG, SpO2\\n - Analyse du sommeil, stress, récupération\\n - Coach Garmin, plans d’entraînement\\n - Paiement Garmin Pay",
      "🌐 Fonctionnalités connectées\\n - Notifications smartphone, musique embarquée\\n - Cartographie mondiale, LiveTrack\\n - Boutique Connect IQ pour apps et cadrans",
      "🎮 Expérience utilisateur\\n - Interface personnalisable\\n - Bracelet QuickFit, verre saphir\\n - Idéale pour sportifs, aventuriers, voyageurs"
    ]
  },
  {
    "nom": "LG OLED65 G5",
    "categorie": "ECRAN TV",
    "image": "lg.png",
    "lien": "fiches/ecran-tv/LG OLED65 G5.html",
    "description": "TV OLED 4K 65'' avec Dolby Vision, G-Sync et design mural.",
    "top_du_mois": false,
    "prix": "À partir de 2 790 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Taille : 65 pouces - Technologie : OLED Evo 4K - Processeur : Alpha 11 AI 4K Gen2 - Luminosité : jusqu’à 2 412 cd/m² - Connectivité : Wi-Fi 6, Bluetooth 5.3, HDMI 2.1 x4 - Design : ultra-fin, montage mural sans espace"
    ],
    "id": "prod_11",
    "donnees_fiche": [
      "Le téléviseur OLED le plus performant et lumineux de 2025.",
      "💰 À partir de 2 790 €",
      "🧩 Spécifications matérielles\\n - Taille : 65 pouces\\n - Technologie : OLED Evo 4K\\n - Processeur : Alpha 11 AI 4K Gen2\\n - Luminosité : jusqu’à 2 412 cd/m²\\n - Connectivité : Wi-Fi 6, Bluetooth 5.3, HDMI 2.1 x4\\n - Design : ultra fin, montage mural sans espace  – Particularités : dalle OLED Evo, Dolby Vision, HDMI 2.1, design mural.",
      "🖥️ Qualité d’image\\n - Résolution : 3840 × 2160 pixels\\n - HDR : Dolby Vision, HDR10, HLG\\n - Modes : Filmmaker, Cinéma, Jeu, Standard, Vif\\n - Colorimétrie : Delta E moyen à 0,79\\n - Température des couleurs : 6493 K",
      "🎮 Gaming et fluidité\\n - Taux de rafraîchissement : 120 Hz\\n - VRR, ALLM, G-Sync et FreeSync compatibles\\n - Input lag ultra faible\\n - Optimiseur de jeu intégré",
      "🌐 Fonctionnalités connectées\\n - Système : webOS avec applications multimédia\\n - Assistant vocal : Google Assistant, Alexa\\n - Multi-vues et contrôle domotique\\n - Mode galerie et fond d’écran dynamique",
      "🎬 Expérience cinéma\\n - Contraste infini\\n - Noirs parfaits\\n - Son immersif avec AI Sound Pro\\n - Compatible Dolby Atmos  – dalle OLED Evo  Dolby Vision, HDMI 2.1, design mural.",
      "À REMPLIR"
    ]
  },
  {
    "nom": "LG OLED65 G3",
    "categorie": "ECRAN TV",
    "image": "LG OLED65 G3.png",
    "lien": "fiches/ecran-tv/LG OLED65 G3.html",
    "description": "Téléviseur OLED EVO 4K ultra-fin avec Dolby Vision et 120Hz.",
    "top_du_mois": false,
    "prix": "À partir de 2 999 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Résolution : 4K UHD (3840x2160) - Dalle : OLED EVO avec luminosité auto & anti-reflets - Fréquence : 120Hz VRR, G-Sync & FreeSync compatible - Audio : Dolby Atmos, 4.2 canaux - Connectivité : 4x HDMI 2.1, Wi-Fi 6, Bluetooth 5.0 - Système : webOS 23 + ThinQ AI + Apple HomeKit"
    ],
    "id": "prod_12",
    "donnees_fiche": [
      "Le téléviseur OLED Evo G3 de 65 pouces, avec dalle MLA ultra lumineuse et design mural affleurant.",
      "💰 À partir de 2 999 €",
      "🧩 Spécifications matérielles\\n - Taille : 65 pouces \\n- Technologie : OLED Evo MLA 4K\\n - Processeur : Alpha 9 AI 4K Gen6\\n - Luminosité : jusqu’à 1 490 cd/m²\\n - Connectivité : Wi-Fi 6, Bluetooth 5.3, HDMI 2.1 x4, USB x3, Ethernet \\n- Design : One Wall Design, montage mural sans espace\\n -Spécificités :  dalle OLED Evo MLA, Dolby Vision IQ, HDMI 2.1, WebOS 23.",
      "🖥️ Qualité d’image \\n- Résolution : 3840 × 2160 pixels\\n - HDR : Dolby Vision IQ, HDR10, HLG\\n - Modes : Filmmaker, Cinéma, Jeu, Standard, Vif\\n - Colorimétrie : Delta E moyen à 0,79\\n - Fréquence : 120 Hz natif",
      "🎮 Gaming et fluidité\\n - Compatibilité : VRR, ALLM, G-Sync, FreeSync\\n - Input lag : 9,1 ms\\n - Optimiseur de jeu intégré\\n - Accès direct à GeForce Now",
      "🌐 Fonctionnalités connectées\\n - Système : WebOS 23 avec Quick Media Switching\\n - Assistant vocal : Google Assistant, Alexa\\n - Protocoles : AirPlay 2, Miracast, Matter\\n - Multi-vues, contrôle domotique, mode galerie",
      "🎬 Expérience cinéma\\n - Contraste infini et noirs absolus\\n - Son immersif avec Dolby Atmos et AI Sound Pro\\n - Dalle certifiée anti-reflets\\n - Télécommande ergonomique (non rétroéclairée)"
    ]
  },
  {
    "nom": "Insta360 X5",
    "categorie": "CAMERA",
    "image": "Insta X.png",
    "lien": "fiches/camera/Insta360 X5.html",
    "description": "Caméra 360 professionnelle pour capture immersive en 8K.",
    "top_du_mois": false,
    "prix": "À partir de 549 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteurs : double capteur 1/1.28 pouces - Résolution vidéo : 8K 360° / 5.7K standard - Stabilisation : FlowState + horizon lock - Autonomie : jusqu’à 90 minutes - Étanchéité : jusqu’à 10 m sans caisson - Connectivité : Wi-Fi, Bluetooth, USB-C"
    ],
    "id": "prod_13",
    "donnees_fiche": [
      "La caméra 360° la plus avancée de 2025, idéale pour les créateurs immersifs et les aventuriers.",
      "💰 À partir de 549 € – vidéo 8K 360°, stabilisation FlowState, lentilles interchangeables, étanchéité renforcée.",
      "🧩 Spécifications matérielles\\n - Capteurs : double capteur 1/1.28 pouces\\n - Résolution vidéo : 8K 360° / 5.7K standard\\n - Stabilisation : FlowState + horizon lock\\n - Autonomie : jusqu’à 90 minutes\\n - Étanchéité : jusqu’à 10 m sans caisson\\n - Connectivité : Wi-Fi, Bluetooth, USB-C",
      "🎥 Fonctions vidéo\\n - Mode FreeFrame pour recadrage libre\\n - Timelapse, Bullet Time, HDR vidéo\\n - Enregistrement en faible lumière optimisé\\n - Lentilles remplaçables en cas de rayure",
      "🌐 Fonctionnalités connectées\\n - Application Insta360 avec IA de cadrage\\n - Partage direct sur réseaux sociaux\\n - Contrôle vocal et gestuel\\n - Compatible avec Insta360 Studio pour montage avancé",
      "🎮 Expérience utilisateur\\n - Interface tactile intuitive\\n - Compatible Android, iOS, Windows, macOS\\n - Accessoires multiples : perche invisible, trépied, support casque\\n - Idéale pour vlog, sport extrême, voyage et réalité virtuelle"
    ]
  },
  {
    "nom": "Canon EOS R6 Mark II",
    "categorie": "CAMERA",
    "image": "Canon EOS R6 Mark II.png",
    "lien": "fiches/camera/Canon EOS R6 Mark II.html",
    "description": "Appareil photo hybride plein format ultra rapide, idéal pour les créateurs photo/vidéo.",
    "top_du_mois": true,
    "prix": "À partir de 2 899 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteur : CMOS plein format 24.2 MP (36 x 24 mm) - Processeur : DIGIC X - Autofocus : Dual Pixel CMOS AF II avec suivi humain/animal/véhicule - Stabilisation : IBIS 5 axes jusqu’à 8 stops - Rafale : jusqu’à 40 i/s en obturateur électronique - Vidéo : 4K 60p sans crop, Full HD 180p, C-Log 3 - Écran : tactile orientable 3” LCD 1.62M points - Viseur : OLED 3.69M points à 120Hz - Connectivité : Wi-Fi 5, Bluetooth 5.0, USB-C, micro HDMI, double slot SD UHS-II - Poids : 670g avec batterie et carte"
    ],
    "id": "prod_14",
    "donnees_fiche": [
      "Appareil photo hybride plein format ultra rapide, idéal pour les créateurs exigeants en photo et vidéo.",
      "💰 À partir de 2 899 € – capteur 24.2 MP, vidéo 4K 60p, stabilisation 8 stops, autofocus intelligent.",
      "🧩 Spécifications matérielles\\n - Capteur : CMOS plein format 24.2 MP\\n - Processeur : DIGIC X\\n - Stabilisation : jusqu’à 8 stops (IBIS)\\n - Viseur : OLED 3.69 Mpts, 120 Hz\\n - Écran : LCD tactile orientable 3”\\n - Connectivité : Wi-Fi, Bluetooth, USB-C, micro-HDMI, jack casque et micro",
      "🎥 Fonctions vidéo\\n - Résolution : 4K 60p oversamplée, Full HD 180p\\n - Formats : MP4, RAW, C-RAW, HEIF\\n - Autofocus : Dual Pixel CMOS AF II avec détection des visages, animaux, véhicules\\n - Stabilisation numérique vidéo + IBIS\\n - Enregistrement sans limite de durée",
      "🌐 Fonctionnalités connectées\\n - Double slot SD UHS-II\\n - Application Canon Camera Connect\\n - Mise à jour firmware via app\\n - Contrôle à distance via smartphone",
      "🎮 Expérience utilisateur\\n - Rafale : jusqu’à 40 i/s en obturateur électronique\\n - Ergonomie : boîtier robuste et tropicalisé\\n - Compatibilité : objectifs RF, EF via adaptateur\\n - Idéal pour reportage, mariage, sport, vlog et cinéma"
    ]
  },
  {
    "nom": "Valerion Vision Master Pro 2",
    "categorie": "VIDEO PROJECTEUR",
    "image": "Valerion Vision Mast.png",
    "lien": "fiches/video-projecteur/Valerion Vision Master Pro 2.html",
    "description": "Vidéoprojecteur laser 4K HDR avec 3500 lumens et Android TV intégré.",
    "top_du_mois": false,
    "prix": "À partir de 2 999 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Technologie : trilaser DLP 4K UHD - Luminosité : pic lumineux très élevé - Contraste : dynamique avec EBL (Enhanced Black Level) - Connectivité : HDMI 2.1, USB-C, Wi-Fi, Bluetooth - Audio : système intégré, télécommande rétroéclairée - Interface : Google TV fluide et complète"
    ],
    "id": "prod_15",
    "donnees_fiche": [
      "Le vidéoprojecteur trilaser 4K le plus avancé de 2025, conçu pour le home cinéma et le gaming.",
      "💰 À partir de 2 999 € – technologie trilaser, Dolby Vision, HDR10+, Google TV, zoom optique, faible latence.",
      "🧩 Spécifications matérielles\\n - Technologie : trilaser DLP 4K UHD\\n - Luminosité : pic lumineux très élevé\\n - Contraste : dynamique avec EBL (Enhanced Black Level)\\n - Connectivité : HDMI 2.1, USB-C, Wi-Fi, Bluetooth\\n - Audio : système intégré, télécommande rétroéclairée\\n - Interface : Google TV fluide et complète",
      "🖥️ Qualité d’image\\n - Résolution : 3840 × 2160 pixels\\n - HDR : compatible HDR10+ et Dolby Vision\\n - Colorimétrie : couverture étendue, calibrage possible\\n - Zoom optique et mise au point automatique\\n - Correction du trapèze avancée",
      "🎮 Gaming et fluidité\\n - Faible input lag\\n - Compatible avec consoles et PC\\n - Mode jeu dédié\\n - Bonne réactivité en 4K 60 fps",
      "🌐 Fonctionnalités connectées\\n - Google TV avec Netflix, Prime Video, YouTube\\n - Assistant vocal intégré\\n - Multi-utilisateurs et profils\\n - Contrôle via smartphone",
      "🎬 Expérience cinéma\\n - Image grand format immersive\\n - Contraste profond et couleurs éclatantes\\n - Silencieux en fonctionnement\\n - Idéal pour films, séries et sport"
    ]
  },
  {
    "nom": "Epson EH-LS12000B",
    "categorie": "VIDEO PROJECTEUR",
    "image": "Epson EH-LS12000B.png",
    "lien": "fiches/video-projecteur/Epson EH-LS12000B.html",
    "description": "Vidéoprojecteur laser 4K Pro-UHD haut de gamme avec HDR10+ et installation flexible.",
    "top_du_mois": false,
    "prix": "À partir de 4 195 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Technologie : 3LCD laser - Résolution : 4K Pro-UHD (3840 x 2160) - Luminosité : 2 700 lumens - Contraste : 2 500 000:1 - HDR : compatible HDR10, HDR10+, HLG - Connectivité : HDMI 2.1 x2 (40 Gbps), USB, LAN, RS-232 - Installation : zoom optique motorisé, lens shift horizontal/vertical - Bruit : 22 dB (mode éco) - Durée de vie laser : jusqu’à 20 000 h - Dimensions : 520 x 510 x 193 mm - Poids : 12.7 kg"
    ],
    "id": "prod_16",
    "donnees_fiche": [
      "Vidéoprojecteur laser 4K HDR haut de gamme, conçu pour le home cinéma immersif et les sessions gaming en grand format.",
      "💰 À partir de 3 999 € – technologie 3LCD, HDR10+, 2 700 lumens, contraste 2 500 000:1, zoom motorisé, faible latence.",
      "🧩 Spécifications matérielles\\n - Technologie : 3LCD avec laser phosphore\\n - Résolution : 3840 × 2160 (4K PRO-UHD avec pixel shifting)\\n - Luminosité : 2 700 lumens (ISO couleur et blanc)\\n - Contraste : dynamique 2 500 000:1\\n - Connectivité : HDMI 2.1 x2, USB x2, Ethernet, RS232, trigger 12V\\n - Optique : zoom motorisé 2.1x, mise au point et lens shift motorisés (±96% vertical / ±47% horizontal)",
      "🖥️ Qualité d’image\\n - HDR : compatible HDR10+ et HLG\\n - Traitement : 4K Frame Interpolation, Super Resolution\\n - Couleurs : 10 bits, couverture étendue\\n - Taille d’image : de 50 à 300 pouces\\n - Bruit : 30 dB / 22 dB (Eco)",
      "🎮 Gaming et fluidité\\n - Input lag : 20 ms en 4K/60p\\n - Compatible avec consoles et PC\\n - Mode jeu dédié\\n - Fluidité optimisée pour les contenus rapides",
      "🌐 Fonctionnalités connectées\\n - Processeur : Epson ZX Picture Processor\\n - Scene Adaptive Gamma\\n - Correction trapèze numérique\\n - Compatible domotique via RS232 et trigger",
      "🎬 Expérience cinéma\\n - Image ultra précise et lumineuse\\n - Installation flexible et rapide\\n - Longévité : jusqu’à 20 000 h sans maintenance\\n - Idéal pour films, séries, sport et gaming immersif"
    ]
  },
  {
    "nom": "Freebox Ultra",
    "categorie": "BOX INTERNET",
    "image": "Freebox Ultra stylé.png",
    "lien": "fiches/box-internet/Freebox Ultra.html",
    "description": "Box ultra rapide avec fibre 8G, WiFi 7 et services TV premium.",
    "top_du_mois": false,
    "prix": "À partir de 49,99 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Débit descendant : jusqu’à 8 Gbit/s - Débit montant : jusqu’à 8 Gbit/s - WiFi : WiFi 7 avec répéteur inclus - Téléphonie : appels illimités vers fixes et mobiles - Connectivité : Ethernet 2.5G, USB-C, Bluetooth, Wi-Fi 7 - Réseau : fibre optique FTTH"
    ],
    "id": "prod_17",
    "donnees_fiche": [
      "La box internet la plus rapide et complète de 2025, idéale pour les foyers ultra-connectés.",
      "💰 À partir de 49,99 € – fibre jusqu’à 8 Gbit/s, WiFi 7, 280 chaînes TV, appels illimités, services SVOD inclus.",
      "🧩 Spécifications matérielles\\n - Débit descendant : jusqu’à 8 Gbit/s\\n - Débit montant : jusqu’à 8 Gbit/s\\n - WiFi : WiFi 7 avec répéteur inclus\\n - Téléphonie : appels illimités vers fixes et mobiles\\n - Connectivité : Ethernet 2.5G, USB-C, Bluetooth, Wi-Fi 7\\n - Réseau : fibre optique FTTH",
      "📺 Services TV et multimédia\\n - 280 chaînes incluses\\n - Décodeur TV 4K HDR\\n - Replay, enregistrement, contrôle du direct\\n - Compatible Netflix, Disney+, Prime Video (inclus 3 mois)",
      "🌐 Fonctionnalités avancées\\n - Interface FreeOS intuitive\\n - Multi-TV et multi-utilisateurs\\n - Contrôle parental et gestion des profils\\n - Accès à OQEE Ciné et Cafeyn",
      "🎮 Expérience utilisateur\\n - Idéal pour le gaming en ligne et le streaming 4K\\n - Faible latence et stabilité réseau\\n - Compatible domotique et objets connectés\\n - Abonnement Free Mobile 5G à tarif réduit pour les abonnés"
    ]
  },
  {
    "nom": "Bose QuietComfort 45",
    "categorie": "CASQUE AUDIO",
    "image": "Bose QuietComfort 45.png",
    "lien": "fiches/casque-audio/Bose QuietComfort 45.html",
    "description": "Casque à réduction de bruit actif et autonomie prolongée.",
    "top_du_mois": false,
    "prix": "À partir de 349 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Haut-parleurs : 40 mm - Réduction de bruit : active, 3 modes - Autonomie : jusqu’à 24h - Connectivité : Bluetooth 5.1, USB-C, jack 3.5mm - Poids : 240g"
    ],
    "id": "prod_18",
    "donnees_fiche": [
      "Le casque audio à réduction de bruit le plus confortable de 2025, idéal pour la musique et les appels.",
      "💰 À partir de 349 € – réduction de bruit active, autonomie 24h, Bluetooth 5.1, mode Aware, confort premium.",
      "🧩 Spécifications matérielles\\n - Haut-parleurs : 40 mm\\n - Réduction de bruit : active, 3 modes\\n - Autonomie : jusqu’à 24h\\n - Connectivité : Bluetooth 5.1, USB-C, jack 3.5mm\\n - Poids : 240g",
      "🎧 Fonctions audio\\n - Mode Aware pour entendre l’environnement\\n - Égaliseur personnalisable via app\\n - Microphones à réduction de bruit pour appels clairs\\n - Multipoint : connexion à 2 appareils simultanés",
      "🌐 Fonctionnalités connectées\\n - Application Bose Music\\n - Assistant vocal intégré (Google, Alexa, Siri)\\n - Mise à jour firmware via app",
      "🎮 Expérience utilisateur\\n - Coussinets ultra-doux\\n - Arceau pliable et étui de transport\\n - Idéal pour le voyage, le bureau, la maison"
    ]
  },
 {
  "nom": "Sony WH-1000XM5",
  "description": "Casque audio haut de gamme à réduction de bruit active, conçu pour une immersion sonore totale et des appels ultra clairs.",
  "categorie": "CASQUE AUDIO",
  "image": "Sony WH-1000XM5.png",
  "lien": "fiches/casque-audio/Sony WH-1000XM5.html",
  "top_du_mois": false,
  "prix": "À partir de 399 €",
  "fonctionnalites_avancees": [
      "Spécifications matérielles - Haut-parleurs : 30 mm - Réduction de bruit : active, 3 modes - Autonomie : jusqu’à 30h - Connectivité : Bluetooth 5.1, USB-C, jack 3.5mm - Poids : 250g"
    ],
  "id": "prod_19",
  "donnees_fiche": [
    "Casque audio haut de gamme à réduction de bruit active, conçu pour une immersion sonore totale et des appels ultra clairs.",
    "💰 À partir de 399 € – réduction de bruit adaptative, autonomie 30h, Bluetooth 5.2, design épuré et confort premium.",
    "🧩 Spécifications matérielles\\n\n    - Haut-parleurs : 30 mm avec aimants néodyme\\n\n    - Réduction de bruit : active, optimisée par IA (8 micros)\\n\n    - Autonomie : jusqu’à 30h (NC activé), 40h (NC désactivé)\\n\n    - Connectivité : Bluetooth 5.2, USB-C, jack 3.5mm\\n\n    - Poids : 250g\n  ",
    "🌐 Fonctionnalités connectées\\n\n    - Assistant vocal intégré (Google, Alexa, Siri)\\n\n    - Mode Quick Attention + Ambient Sound\\n\n    - Mise à jour firmware via app\\n\n    - Codec LDAC haute résolution\n  ",
    "🎮 Expérience utilisateur\\n\n    - Coussinets en mousse à mémoire de forme\\n\n    - Arceau souple et design pliable\\n\n    - Étui de transport inclus\\n\n    - Idéal pour les trajets, le télétravail et les sessions musicales prolongées\n  "
  ]
},
  {
    "nom": "Samsung Flip Pro 2025",
    "categorie": "TABLEAU INTERACTIF",
    "image": "samsung flip pro.png",
    "lien": "fiches/tableau-interactif/Samsung Flip Pro 2025.html",
    "description": "Tableau interactif 75'' tactile avec stylet et écran QLED.",
    "top_du_mois": false,
    "prix": "À partir de 2 199 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Taille : 65\", 75\" ou 85\" selon modèle - Résolution : UHD 3840 × 2160 pixels - Écran : tactile capacitif avec 20 points de contact - Stylet : passif, sans batterie - Connectivité : HDMI, USB, LAN, Wi-Fi, Bluetooth - Système : Tizen OS avec interface Flip intuitive"
    ],
    "id": "prod_20",
    "donnees_fiche": [
      "Le tableau interactif le plus fluide et collaboratif de 2025, idéal pour les salles de classe et les espaces de réunion.",
      "💰 À partir de 2 199 € – écran tactile 4K, stylet passif, multi-utilisateurs, connectivité étendue, interface intuitive.",
      "🧩 Spécifications matérielles\\n - Taille : 65\", 75\" ou 85\" selon modèle\\n - Résolution : UHD 3840 × 2160 pixels\\n - Écran : tactile capacitif avec 20 points de contact\\n - Stylet : passif, sans batterie\\n - Connectivité : HDMI, USB, LAN, Wi-Fi, Bluetooth\\n - Système : Tizen OS avec interface Flip intuitive",
      "🖊️ Fonctions interactives\\n - Écriture fluide et naturelle\\n - Effacement à la main ou au doigt\\n - Annotation sur documents, images, vidéos\\n - Mode tableau blanc, présentation, brainstorming\\n - Exportation en PDF ou image",
      "🌐 Fonctionnalités connectées\\n - Partage d’écran sans fil (AirPlay, Miracast)\\n - Accès à Internet et aux applications web\\n - Multi-utilisateurs simultanés\\n - Enregistrement et sauvegarde sur USB ou Cloud\\n - Compatible avec Microsoft Teams, Zoom, Google Meet",
      "🎮 Expérience utilisateur\\n - Interface intuitive et rapide\\n - Mode portrait ou paysage\\n - Idéal pour l’enseignement, les réunions, les ateliers\\n - Design épuré et mobile avec support à roulettes"
    ]
  },
  {
    "nom": "HKMLC Smart Board Explorer Elite Dual 75",
    "categorie": "TABLEAU INTERACTIF",
    "image": "HKMLC Smart Board Explorer Elite Dual 75.png",
    "lien": "fiches/tableau-interactif/HKMLC Smart Board Explorer Elite Dual 75.html",
    "description": "Tableau interactif 4K UHD avec double système Android/Windows, idéal pour l’éducation et les entreprises.",
    "top_du_mois": false,
    "prix": "À partir de 3 599 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Taille : 75 pouces - Résolution : 4K UHD (3840 x 2160) - Système : Dual OS Android 12 + Windows 10 - Mémoire : 8 Go RAM, 128 Go SSD - Touches : jusqu’à 20 points tactiles simultanés - Connectivité : Wi-Fi, HDMI, USB, LAN, AirPlay, Miracast - Compatibilité : Zoom, Teams, Webex, Google Meet - Audio : haut-parleurs stéréo intégrés - Fonctions : annotation, tableau blanc, partage cloud - Dimensions : 1 700 x 1 000 x 90 mm - Poids : 45 kg"
    ],
    "id": "prod_21",
    "donnees_fiche": [
      "Tableau interactif 4K UHD avec double système Android/Windows, idéal pour l’enseignement, les réunions et la collaboration hybride.",
      "💰 À partir de 3 599 € – écran tactile 75\", 4K UHD, 20 points de contact, 8 Go RAM, 128 Go SSD, stylet passif, connectivité complète.",
      "🧩 Spécifications matérielles\\n - Taille : 75 pouces\\n - Résolution : UHD 3840 × 2160 pixels\\n - Écran : tactile infrarouge avec 20 points de contact\\n - Stylet : passif, haute précision 2 mm\\n - Système : Android 12.0 + Windows 10 (dual boot)\\n - Mémoire : 8 Go RAM, 128 Go SSD\\n - Connectivité : HDMI, USB-C, USB-A, LAN, Wi-Fi, Bluetooth",
      "🖊️ Fonctions interactives\\n - Écriture fluide avec reconnaissance manuscrite IA\\n - Annotation sur documents, images, vidéos\\n - Effacement à la main ou au doigt\\n - Exportation en PDF ou QR code\\n - Multi-canvas et collaboration simultanée",
      "🌐 Fonctionnalités connectées\\n - Partage d’écran sans fil (AirPlay, Miracast)\\n - Accès à Google Drive, Dropbox, OneDrive\\n - Compatible Zoom, Teams, Meet, Webex\\n - Contrôle à distance via smartphone\\n - Enregistrement local ou cloud",
      "🎮 Expérience utilisateur\\n - Interface intuitive et rapide\\n - Support mobile avec roulettes verrouillables\\n - Réglage de hauteur jusqu’à 15 cm\\n - Idéal pour salles de classe, entreprises, ateliers\\n - Design épuré et robuste"
    ]
  },
  {
    "nom": "Asus ROG Ally X",
    "categorie": "CONSOLE",
    "image": "ROG Ally.png",
    "lien": "fiches/console/Asus ROG Ally X.html",
    "description": "Console portable Windows puissante et ergonomique pour gamers exigeants.",
    "top_du_mois": false,
    "prix": "À partir de 899 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeur : AMD Ryzen Z1 Extreme - RAM : 24 Go LPDDR5 - Stockage : SSD M.2 2280 de 1 To - Batterie : 80 Wh — autonomie jusqu’à 6h30 - Refroidissement : système silencieux optimisé - Connectivité : Wi-Fi 6E, Bluetooth 5.2, USB-C"
    ],
    "id": "prod_22",
    "donnees_fiche": [
      "La console portable la plus puissante de 2025, conçue pour les jeux AAA.",
      "💰 À partir de 899 € – Ryzen Z1 Extreme, 24 Go RAM, SSD 1 To, écran 120 Hz.",
      "🧩 Spécifications matérielles\\n - Processeur : AMD Ryzen Z1 Extreme\\n - RAM : 24 Go LPDDR5\\n - Stockage : SSD M.2 2280 de 1 To\\n - Batterie : 80 Wh — autonomie jusqu’à 6h30\\n - Refroidissement : système silencieux optimisé\\n - Connectivité : Wi-Fi 6E, Bluetooth 5.2, USB-C",
      "🖥️ Écran et affichage\\n - Taille : 7 pouces IPS\\n - Résolution : Full HD (1920 × 1080)\\n - Taux de rafraîchissement : 120 Hz\\n - Technologie : VRR avec FreeSync Premium",
      "🕹️ Contrôleurs et interaction\\n - Interface : Armoury Crate SE sous Windows 11\\n - Joysticks et gâchettes : effet Hall pour plus de précision\\n - Ergonomie : design repensé pour le confort\\n - Compatibilité : Game Pass, Steam, Epic Games",
      "🌐 Fonctionnalités avancées\\n - Refroidissement performant et silencieux\\n - Interface personnalisable\\n - Accès à tous les jeux PC\\n - Abonnement Game Pass inclus pendant 3 mois",
      "🎮 Expérience utilisateur\\n - Idéale pour les gamers nomades\\n - Compatible avec les jeux AAA comme Cyberpunk 2077, Elden Ring, Starfield\\n - Performances dignes d’un PC gaming haut de gamme"
    ]
  },
  {
    "nom": "Meta Quest 3",
    "categorie": "CASQUE VR",
    "image": "Meta Quest 3.png",
    "lien": "fiches/casque-vr/Meta Quest 3.html",
    "description": "Casque de réalité mixte haut de gamme avec passthrough HD.",
    "top_du_mois": false,
    "prix": "À partir de 549 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Processeur : Snapdragon XR3 Gen2 - RAM : 12 Go - Stockage : 128 Go / 512 Go - Autonomie : jusqu’à 2h30 - Poids : 515g"
    ],
    "id": "prod_23",
    "donnees_fiche": [
      "Le casque VR autonome le plus immersif de 2025, idéal pour la réalité virtuelle et mixte.",
      "💰 À partir de 549 € – processeur Snapdragon XR3, écrans 4K+, suivi des mains, réalité mixte couleur.",
      "🧩 Spécifications matérielles\\n - Processeur : Snapdragon XR3 Gen2\\n - RAM : 12 Go\\n - Stockage : 128 Go / 512 Go\\n - Autonomie : jusqu’à 2h30\\n - Poids : 515g",
      "🎮 Fonctions VR et MR\\n - Suivi des mains et des yeux\\n - Caméras couleur pour réalité mixte\\n - Audio spatial intégré\\n - Compatible PC VR (Air Link)",
      "🌐 Fonctionnalités connectées\\n - Store Meta Quest avec des milliers d’apps\\n - Partage d’écran sur TV ou mobile\\n - Contrôle parental et profils multiples",
      "🎮 Expérience utilisateur\\n - Confort optimisé pour longues sessions\\n - Réglage IPD facile\\n - Accessoires : Elite Strap, batterie, étui, etc."
    ]
  },
  {
    "nom": "Creality Ender 5 Neo",
    "categorie": "IMPRIMANTE 3D",
    "image": "imprimante 3D.png",
    "lien": "fiches/imprimante-3d/Creality Ender 5 Neo.html",
    "description": "Imprimante 3D précise avec double axe Z et auto-nivellement.",
    "top_du_mois": false,
    "prix": "À partir de 399 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Volume d’impression : 220×220×250 mm - Double extrusion, auto-nivellement - Plateau chauffant, buse 260°C - Connectivité : USB, carte SD, Wi-Fi"
    ],
    "id": "prod_24",
    "donnees_fiche": [
      "L’imprimante 3D la plus polyvalente de 2025, idéale pour le prototypage et la création à domicile.",
      "💰 À partir de 399 € – volume 220×220×250 mm, auto-nivellement, double extrusion, écran tactile.",
      "🧩 Spécifications matérielles\\n - Volume d’impression : 220×220×250 mm\\n - Double extrusion, auto-nivellement\\n - Plateau chauffant, buse 260°C\\n - Connectivité : USB, carte SD, Wi-Fi",
      "🖨️ Fonctions avancées\\n - Reprise d’impression après coupure\\n - Détection de fin de filament\\n - Impression multi-matériaux\\n - Logiciel Creality Print inclus",
      "🌐 Fonctionnalités connectées\\n - Contrôle à distance via appli mobile\\n - Surveillance caméra (optionnelle)\\n - Mises à jour firmware OTA",
      "🎮 Expérience utilisateur\\n - Montage rapide et facile\\n - Interface tactile intuitive\\n - Idéale pour makers, écoles, designers"
    ]
  },
  {
    "nom": "Creality Ender 3 V3",
    "categorie": "IMPRIMANTE 3D",
    "image": "Creality Ender 3 V3 stylé.png",
    "lien": "fiches/imprimante-3d/Creality Ender 3 V3.html",
    "description": "Imprimante 3D précise avec double axe Z et auto-nivellement.",
    "top_du_mois": false,
    "prix": "329,00 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles- Volume d'impression : 220 x 220 x 250 mm- Vitesse d'impression : Jusqu'à 600 mm/s- Précision : ±0.1 mm- Plateforme : Auto-nivellement, surface magnétique- Système : Direct Drive + double axe Z- Connectivité : Carte SD, USB-C, Wi-Fi (modulable)"
    ],
    "id": "prod_25",
    "donnees_fiche": [
      "Imprimante 3D ultra populaire, rapide, précise et idéale pour les projets domestiques, professionnels et éducatifs.",
      "💰 Prix : 329,00 €",
      "🧩 Spécifications- Volume d'impression : 220 x 220 x 250 mm- Vitesse d'impression : Jusqu'à 600 mm/s- Précision : ±0.1 mm- Plateforme : Auto-nivellement, surface magnétique- Système : Direct Drive + double axe Z- Connectivité : Carte SD, USB-C, Wi-Fi (modulable)",
      "🌐 Fonctionnalités- Structure entièrement métallique avec stabilité renforcée- Guides linéaires pour plus de fluidité- Interface tactile intuitive- Système silencieux optimisé",
      "🎮 Usage recommandéParfait pour le prototypage rapide, les objets personnalisés, l'art numérique et les ateliers d'ingénierie ou de design."
    ]
  },
  {
    "nom": "Creality Halot Mage S 14K",
    "categorie": "IMPRIMANTE 3D",
    "image": "Creality Halot Mage S 14K.png",
    "lien": "fiches/imprimante-3d/Creality Halot Mage S 14K.html",
    "description": "Imprimante 3D résine ultra précise avec écran 14K, purification d’air et impression rapide Dynax+.",
    "top_du_mois": false,
    "prix": "À partir de 562 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Technologie : LCD MSLA - Résolution : 14K (13320x5120 px), XY : 16.8x24.8 μm - Volume d’impression : 223 x 126 x 230 mm - Vitesse : jusqu’à 150 mm/h (mode Dynax+) - Écran : LCD mono 10.1” + écran de contrôle 4.3” - Connectivité : USB, Wi-Fi, Ethernet, Creality Cloud - Système : HALOT OS compatible Windows/Mac - Purification : filtre à charbon actif + extraction externe - Précision : 0.02 à 0.09 mm - Dimensions : 333 x 270 x 608 mm - Poids : 13.13 kg"
    ],
    "id": "prod_26",
    "donnees_fiche": [
      "Imprimante 3D résine ultra précise avec écran 14K, idéale pour les figurines, bijoux et prototypes professionnels.",
      "💰 À partir de 499 € – écran LCD 14K, volume 223×126×230 mm, vitesse jusqu’à 150 mm/h, connectivité complète.",
      "🧩 Spécifications matérielles\\n - Volume d’impression : 223×126×230 mm\\n - Écran : Mono LCD 10.1” – résolution 14K (13 320 × 5 120 px)\\n - Source lumineuse : intégrale 3.0 – uniformité >90%\\n - Hauteur de couche : 50 à 200 microns\\n - Connectivité : USB, Wi-Fi, Ethernet\\n - Bruit : <49 dB en fonctionnement",
      "🖨️ Fonctions avancées\\n - Mode Dynax+ : vitesse jusqu’à 150 mm/h\\n - Film Pictor 3 couches pour décollement optimisé\\n - Plaque gravée au laser pour meilleure adhérence\\n - Moteur à boucle fermée – couple 1300 N·m\\n - Rails linéaires doubles sur axe Z",
      "🌐 Fonctionnalités connectées\\n - Système HALOT OS avec contrôle à distance\\n - Compatible Creality Cloud et Halot Box\\n - Tranchage via appli mobile ou PC\\n - Surveillance caméra (optionnelle)",
      "🎮 Expérience utilisateur\\n - Interface tactile intuitive\\n - Compatible résines 405 nm toutes marques\\n - Idéale pour créateurs, designers, joailliers et makers exigeants"
    ]
  },
  {
    "nom": "DJI Mavic 4 Pro",
    "categorie": "DRONE",
    "image": "DJI Mavic 4 Pro styl.png",
    "lien": "fiches/drone/DJI Mavic 4 Pro.html",
    "description": "Drone ultra stabilisé avec capteurs 360° et caméra 6K.",
    "top_du_mois": false,
    "prix": "À partir de 1 799 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteur : CMOS 4/3 Hasselblad 20 MP - Vidéo : 8K/30fps, 4K/120fps - Autonomie : jusqu’à 45 min - Portée : 15 km - Poids : 895g"
    ],
    "id": "prod_27",
    "donnees_fiche": [
      "Le drone grand public le plus avancé de 2025, idéal pour la photo et la vidéo aérienne.",
      "💰 À partir de 1 799 € – caméra Hasselblad 4/3, vidéo 8K, autonomie 45 min, détection d’obstacles omnidirectionnelle.",
      "🧩 Spécifications matérielles\\n - Capteur : CMOS 4/3 Hasselblad 20 MP\\n - Vidéo : 8K/30fps, 4K/120fps\\n - Autonomie : jusqu’à 45 min\\n - Portée : 15 km\\n - Poids : 895g",
      "🎥 Fonctions vidéo\\n - Hyperlapse, ActiveTrack 5.0, Mastershots\\n - Zoom optique x7, mode nuit\\n - Transmission O4 HD, retour vidéo 1080p",
      "🌐 Fonctionnalités connectées\\n - Application DJI Fly\\n - Partage direct sur réseaux sociaux\\n - Contrôle gestuel et vocal",
      "🎮 Expérience utilisateur\\n - Interface intuitive\\n - Accessoires : filtres ND, batteries, sacoche\\n - Idéal pour créateurs, voyageurs, pros"
    ]
  },
  {
    "nom": "Skydio X10",
    "categorie": "DRONE",
    "image": "Skydio X10.png",
    "lien": "fiches/drone/Skydio X10.html",
    "description": "Drone autonome intelligent avec caméra thermique et stabilisation avancée.",
    "top_du_mois": false,
    "prix": "À partir de 2 999 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteur : Dual 48 MP RGB + FLIR thermique - Vidéo : 4K HDR/60fps, stabilisation active - Autonomie : jusqu’à 40 min - Portée : 12 km - Poids : 1 100g"
    ],
    "id": "prod_28",
    "donnees_fiche": [
      "Le drone autonome le plus intelligent du marché, conçu pour les missions complexes, la sécurité, et l’inspection industrielle.",
      "💰 À partir de 1 799 € – caméra Hasselblad 4/3, vidéo 8K, autonomie 45 min, détection d’obstacles omnidirectionnelle.",
      "💰 À partir de 2 999 € – navigation IA, caméra 4K HDR, thermique FLIR, autonomie 40 min.",
      "🧩 Spécifications matérielles\\n - Capteur : Dual 48 MP RGB + FLIR thermique- Vidéo : 4K HDR/60fps, stabilisation active- Autonomie : jusqu’à 40 min- Portée : 12 km- Poids : 1 100g",
      "🎥 Fonctions vidéo\\n - Suivi autonome par IA, détection et évitement d’obstacles en temps réel- Fonction vol sécurisé, mapping 3D- Transmission Skydio Link, retour vidéo HD",
      "🌐 Fonctionnalités connectées\\n - Application Skydio Enterprise- Contrôle via tablette ou télécommande- Sync cloud sécurisé pour les relevés de terrain",
      "🎮 Expérience utilisateur- Interface pro avec modes personnalisables- Accessoires : station mobile, valise rigide, batteries longue durée- Idéal pour sécurité, inspections, infrastructures critiques"
    ]
  },
  {
    "nom": "DJI Air 3S",
    "categorie": "DRONE",
    "image": "DJI Air 3S.png",
    "lien": "fiches/drone/DJI Air 3S.html",
    "description": "Drone polyvalent pour créateurs de contenu, avec double capteur et détection LiDAR.",
    "top_du_mois": false,
    "prix": "À partir de 1 599 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteurs : 50 MP CMOS 1” + 48 MP 1/1.3” - Vidéo : 4K/60fps HDR, 2.7K vertical - Autonomie : jusqu’à 45 min - Portée : 20 km - Poids : 724g"
    ],
    "id": "prod_29",
    "donnees_fiche": [
      "Drone polyvalent haut de gamme, idéal pour les créateurs de contenu, les voyageurs et les pros de l’image.",
      "💰 À partir de 1 599 € – double caméra 1” + 1/1.3”, vidéo 4K HDR, autonomie 45 min, détection omnidirectionnelle avec LiDAR.",
      "🧩 Spécifications matérielles\\n - Capteurs : 50 MP CMOS 1” + 48 MP 1/1.3”\\n - Vidéo : 4K/60fps HDR, 2.7K vertical\\n - Autonomie : jusqu’à 45 min\\n - Portée : 20 km\\n - Poids : 724g",
      "🎥 Fonctions vidéo\\n - Zoom optique x3, mode Panorama Libre\\n - Détection d’obstacles nocturne, FocusTrack\\n - Transmission O4 HD, retour vidéo 1080p",
      "🌐 Fonctionnalités connectées\\n - Application DJI Fly\\n - Dongle 4G en option\\n - Radiocommande avec écran intégré (RC 2)",
      "🎮 Expérience utilisateur\\n - Interface intuitive, décollage paume de main\\n - Accessoires : filtres ND, batteries, sacoche\\n - Idéal pour vloggers, vidéastes, pros mobiles"
    ]
  },
  {
    "nom": "Parrot Anafi USA",
    "categorie": "DRONE",
    "image": "Parrot Anafi USA.png",
    "lien": "fiches/drone/Parrot Anafi USA.html",
    "description": "Drone professionnel avec zoom x32 et capteur thermique pour missions critiques.",
    "top_du_mois": false,
    "prix": "À partir de 2 699 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteurs : 2x CMOS 1/2.4” + FLIR Boson thermique - Vidéo : 4K HDR + thermique 320x256 - Autonomie : jusqu’à 32 min - Portée : 10 km - Poids : 500g"
    ],
    "id": "prod_30",
    "donnees_fiche": [
      "Drone professionnel conçu pour les missions critiques : sécurité, inspection, cartographie, recherche.",
      "💰 À partir de 2 699 € – triple capteur (RGB + télé + thermique), zoom x32, autonomie 32 min, IP53, décollage en 55s.",
      "🧩 Spécifications matérielles\\n - Capteurs : 2x CMOS 1/2.4” + FLIR Boson thermique\\n - Vidéo : 4K HDR + thermique 320x256\\n - Autonomie : jusqu’à 32 min\\n - Portée : 10 km\\n - Poids : 500g",
      "🎥 Fonctions vidéo\\n - Zoom x32, superposition thermique + RGB\\n - Stabilisation 3 axes, vision nocturne\\n - Orientation\\n -140° à +110°, mapping 3D",
      "🌐 Fonctionnalités connectées\\n - Application FreeFlight 6.0\\n - Pas de zones NFZ\\n - Chiffrement AES-XTS 512 bits",
      "🎮 Expérience utilisateur\\n - Déploiement ultra rapide\\n - Accessoires : batteries, hélices, valise\\n - Idéal pour pompiers, BTP, forces de l’ordre"
    ]
  },
  {
    "nom": "DJI Mini 5 Pro",
    "categorie": "DRONE",
    "image": "DJI Mini 5 Pro.png",
    "lien": "fiches/drone/DJI Mini 5 Pro.html",
    "description": "Drone ultra-léger avec capteur 1” et détection LiDAR omnidirectionnelle.",
    "top_du_mois": false,
    "prix": "À partir de 999 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteur : CMOS 1” 20 MP - Vidéo : 5.3K/30fps, 4K/60fps HDR - Autonomie : jusqu’à 38 min - Portée : 18 km - Poids : 249g"
    ],
    "id": "prod_31",
    "donnees_fiche": [
      "Le drone ultra-léger nouvelle génération, conçu pour les créateurs exigeants et les passionnés de vol libre.",
      "💰 À partir de 999 € – capteur 1”, vidéo 5.3K HDR, LiDAR, autonomie 38 min, poids < 249g.",
      "🧩 Spécifications matérielles\\n - Capteur : CMOS 1” 20 MP\\n - Vidéo : 5.3K/30fps, 4K/60fps HDR\\n - Autonomie : jusqu’à 38 min\\n - Portée : 18 km\\n - Poids : 249g",
      "🎥 Fonctions vidéo\\n - ActiveTrack 360°, Mastershots, Hyperlapse\\n - Zoom numérique x4, mode nuit amélioré\\n - Transmission O5 HD, retour vidéo 1080p",
      "🌐 Fonctionnalités connectées\\n - Application DJI Fly\\n - Détection LiDAR omnidirectionnelle\\n - Contrôle vocal, synchronisation cloud",
      "🎮 Expérience utilisateur\\n - Interface simplifiée, décollage paume\\n - Accessoires : filtres ND, batteries, valise\\n - Idéal pour vloggers, voyageurs, pros mobiles"
    ]
  },
  {
    "nom": "Autel Nano+",
    "categorie": "DRONE",
    "image": "Autel Nano+.png",
    "lien": "fiches/drone/Autel Nano+.html",
    "description": "Mini drone puissant et nomade, avec capteur 50 MP et zoom x16.",
    "top_du_mois": false,
    "prix": "À partir de 849 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteur : CMOS 1/1.28” RYYB 50 MP - Vidéo : 4K/30fps HDR, stabilisation 3 axes - Autonomie : jusqu’à 28 min - Portée : 10 km - Poids : 249g"
    ],
    "id": "prod_32",
    "donnees_fiche": [
      "Mini drone ultra-léger et puissant, idéal pour les créateurs nomades et les passionnés de photo aérienne.",
      "💰 À partir de 849 € – capteur 50 MP, vidéo 4K HDR, zoom x16, autonomie 28 min, poids < 250g.",
      "🧩 Spécifications matérielles\\n - Capteur : CMOS 1/1.28” RYYB 50 MP\\n - Vidéo : 4K/30fps HDR, stabilisation 3 axes\\n - Autonomie : jusqu’à 28 min\\n - Portée : 10 km\\n - Poids : 249g",
      "🎥 Fonctions vidéo\\n - Zoom numérique x16, suivi automatique\\n - Modes QuickShot : Flick, Orbit, Rocket, Fade Away\\n - Transmission SkyLink HD, retour vidéo 2.7K/1080p",
      "🌐 Fonctionnalités connectées\\n - Application Autel Sky\\n - Contrôle gestuel et vocal\\n - Synchronisation cloud sécurisée",
      "🎮 Expérience utilisateur\\n - Interface intuitive, décollage rapide\\n - Accessoires : batteries, filtres ND, sacoche\\n - Idéal pour vloggers, voyageurs, créateurs mobiles"
    ]
  },
  {
    "nom": "Autel EVO Max 5G",
    "categorie": "DRONE",
    "image": "Autel EVO Max 5G.png",
    "lien": "fiches/drone/Autel EVO Max 5G.html",
    "description": "Drone ultraportable 249 g, capteur CMOS 1” 20 MP, vidéo 5.3K/30 fps HDR, LiDAR omnidirectionnel et 38 min d’autonomie.",
    "top_du_mois": false,
    "prix": "À partir de 999 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Capteur : CMOS 1” 20 MP - Vidéo : 5.3K/30fps, 4K/60fps HDR - Autonomie : jusqu’à 38 min - Portée : 18 km - Poids : 249g"
    ],
    "id": "prod_33",
    "donnees_fiche": [
      "Le drone ultra-léger nouvelle génération, conçu pour les créateurs exigeants et les passionnés de vol libre.",
      "💰 À partir de 999 € – capteur 1”, vidéo 5.3K HDR, LiDAR, autonomie 38 min, poids < 249g.",
      "🧩 Spécifications matérielles\\n - Capteur : CMOS 1” 20 MP\\n - Vidéo : 5.3K/30fps, 4K/60fps HDR\\n - Autonomie : jusqu’à 38 min\\n - Portée : 18 km\\n - Poids : 249g",
      "🎥 Fonctions vidéo\\n - ActiveTrack 360°, Mastershots, Hyperlapse\\n - Zoom numérique x4, mode nuit amélioré\\n - Transmission O5 HD, retour vidéo 1080p",
      "🌐 Fonctionnalités connectées\\n - Application DJI Fly\\n - Détection LiDAR omnidirectionnelle\\n - Contrôle vocal, synchronisation cloud",
      "🎮 Expérience utilisateur\\n - Interface simplifiée, décollage paume\\n - Accessoires : filtres ND, batteries, valise\\n - Idéal pour vloggers, voyageurs, pros mobiles"
    ]
  },
  {
    "nom": "Apple Watch Series 9",
    "categorie": "MONTRE CONNECTEE",
    "description": "Montre intelligente ultra fluide avec gestes tactiles, écran lumineux et puce S9 ultra-rapide.",
    "image": "Apple Watch Series 9 stylé.png",
    "lien": "fiches/montre-connectee/AppleWatchSeries9.html",
    "top_du_mois": false,
    "prix": "449,00 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles- Écran : OLED LTPO 2'' toujours activé- Puce : S9 SiP double cœur- Mémoire : 64 Go de stockage- Autonomie : 18 heures / mode économie jusqu’à 36h- Connectivité : Wi-Fi, Bluetooth 5.3, GPS/GNSS, NFC- Capteurs : Cardiofréquencemètre, oxygène sanguin, température, détection de chute"
    ],
    "id": "prod_34",
    "donnees_fiche": [
      "Montre intelligente ultra fluide avec gestes tactiles, écran lumineux et puce S9 ultra-rapide.",
      "💰 Prix : 449,00 €",
      "🧩 Spécifications- Écran : OLED LTPO 2'' toujours activé- Puce : S9 SiP double cœur- Mémoire : 64 Go de stockage- Autonomie : 18 heures / mode économie jusqu’à 36h- Connectivité : Wi-Fi, Bluetooth 5.3, GPS/GNSS, NFC- Capteurs : Cardiofréquencemètre, oxygène sanguin, température, détection de chute",
      "🌐 Fonctionnalités- Commande par double tap (gestuelle sans toucher l’écran)- Siri local avec accès aux données de santé- App Santé et suivi fitness intégrés- Mode nuit automatique et résistante à l’eau WR50",
      "🎮 Usage recommandéIdéale pour le suivi quotidien, la santé, le sport et les notifications discrètes avec style."
    ]
  },
  {
    "nom": "Apple Watch Series 10",
    "categorie": "MONTRE CONNECTEE",
    "image": "Apple Watch Series 10.png",
    "lien": "fiches/montre-connectee/Apple Watch Series 10.html",
    "description": "Montre connectée haut de gamme avec écran plus grand, capteurs santé avancés et autonomie optimisée.",
    "top_du_mois": false,
    "prix": "À partir de 429 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Écran : OLED LTPO 2.1” Retina, 2000 nits - Processeur : S10 SiP double cœur 64 bits - Capteurs : ECG, température, fréquence cardiaque, SpO2, détection de chute - Connectivité : Bluetooth 5.3, Wi-Fi, LTE (modèles cellulaires) - Autonomie : jusqu’à 18h (usage mixte), recharge rapide - Résistance : WR50 (50m), IP6X, verre saphir - Système : watchOS 11 avec widgets interactifs - Matériaux : aluminium, acier inoxydable ou titane"
    ],
    "id": "prod_35",
    "donnees_fiche": [
      "Montre connectée ultra fine avec écran OLED bord à bord, capteurs santé avancés et autonomie optimisée.",
      "💰 Prix : 449,00 €",
      "🧩 Spécifications\\n - Écran : OLED Retina LTPO 1.96'' toujours activé, 2000 nits\\n - Puce : S10 SiP double cœur + Neural Engine 4 cœurs\\n - Mémoire : 64 Go de stockage\\n - Autonomie : 18h / jusqu’à 36h en mode économie\\n - Connectivité : Wi-Fi, Bluetooth 5.3, GPS/GNSS, NFC, UWB\\n - Capteurs : ECG, fréquence cardiaque, SpO2, température, profondimètre, altimètre, détection de chute et d’apnée du sommeil",
      "🌐 Fonctionnalités\\n - Commande par double tap\\n - Siri local avec accès aux données santé\\n - App Santé, Pleine conscience, Bruit, Sommeil\\n - Étanchéité WR50 + verre Ion-X ou saphir selon finition",
      "🎮 Usage recommandé Idéale pour le sport, la santé, le suivi du sommeil et les notifications discrètes avec style et précision."
    ]
  },
  {
    "nom": "HONOR 200 Pro",
    "categorie": "SMARTPHONE",
    "description": "Smartphone premium avec caméra portrait IA, design élégant et performances photo impressionnantes.",
    "image": "HONOR 200 Pro stylé.png",
    "lien": "fiches/smartphone/HONOR200Pro.html",
    "top_du_mois": false,
    "prix": "799,99 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles- Écran : OLED 6.78'' 120Hz- Processeur : Snapdragon 8s Gen 3- RAM : 12 Go- Stockage : 512 Go- Batterie : 5200 mAh avec recharge 100W- Appareil photo : Triple capteur - 50MP Sony IMX906 + téléobjectif + ultra grand angle"
    ],
    "id": "prod_36",
    "donnees_fiche": [
      "Smartphone premium avec caméra portrait IA, design élégant et performances photo impressionnantes.",
      "💰 Prix : 799,99 €",
      "🧩 Spécifications- Écran : OLED 6.78'' 120Hz- Processeur : Snapdragon 8s Gen 3- RAM : 12 Go- Stockage : 512 Go- Batterie : 5200 mAh avec recharge 100W- Appareil photo : Triple capteur\\n - 50MP Sony IMX906 + téléobjectif + ultra grand angle",
      "🌐 Fonctionnalités- Caméra portrait IA HONOR développée avec Studio Harcourt- Recharge ultra-rapide 100W- Design incurvé premium- Optimisation thermique et autonomie longue durée",
      "🎮 Usage recommandéIdéal pour la photographie créative, les vidéos 4K, le gaming mobile et les expériences sociales immersives."
    ]
  },
  {
    "nom": "PlayStation 5 Slim",
    "categorie": "CONSOLE",
    "description": "Console next-gen compacte, puissante et élégante. Elle réinvente le gaming ultra-performant avec un design plus fin.",
    "image": "PlayStation 5 Slim stylé.png",
    "lien": "fiches/console/PlayStation5Slim.html",
    "top_du_mois": false,
    "prix": "499,00 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles- CPU : AMD Ryzen Zen 2 8 cœurs 3.5 GHz- GPU : RDNA 2 avec ray tracing- RAM : 16 Go GDDR6- Stockage : SSD 1 To NVMe- Résolution : 4K HDR à 120 fps- Connectivité : HDMI 2.1, USB-C, Wi-Fi 6, Bluetooth 5.1"
    ],
    "id": "prod_37",
    "donnees_fiche": [
      "Console next-gen compacte, puissante et élégante. Elle réinvente le gaming ultra-performant avec un design plus fin.",
      "💰 Prix : 499,00 €",
      "🧩 Spécifications- CPU : AMD Ryzen Zen 2 8 cœurs 3.5 GHz- GPU : RDNA 2 avec ray tracing- RAM : 16 Go GDDR6- Stockage : SSD 1 To NVMe- Résolution : 4K HDR à 120 fps- Connectivité : HDMI 2.1, USB-C, Wi-Fi 6, Bluetooth 5.1",
      "🌐 Fonctionnalités- Mode Turbo pour performance extrême- Design Slim avec LED bleutées- Interface rapide et fluide- Compatible PS5 Digital et Lecteur Blu-ray en module",
      "🎮 Usage recommandéIdéale pour les gamers exigeants, les streamers, et les sessions en écran partagé explosif."
    ]
  },
  {
    "nom": "Samsung Galaxy Tab S10 FE",
    "categorie": "TABLETTE",
    "image": "Galaxy Tab S10 FE.png",
    "lien": "fiches/tablette/Samsung Galaxy Tab S10 FE.html",
    "description": "Tablette polyvalente avec stylet inclus, parfaite pour le travail et les loisirs.",
    "top_du_mois": false,
    "prix": "À partir de 699 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Snapdragon 8 Gen 2, 8 Go RAM, jusqu’à 256 Go de stockage - Écran AMOLED 10,9 pouces, résolution 2560×1600 - Connectivité : Wi-Fi 6E, Bluetooth 5.3, USB-C - Batterie : jusqu’à 12 heures",
      "Accessoires et interaction - S Pen inclus, clavier Book Cover (optionnel), reconnaissance faciale - Système : One UI 7 basé sur Android 15",
      "Fonctionnalités avancées - Mode DeX, multifenêtrage, synchronisation Galaxy Watch/Buds - Expérience fluide et adaptée aux jeux Xbox Cloud Gaming"
    ],
    "id": "prod_38",
    "donnees_fiche": [
      "Une tablette polyvalente pensée pour la productivité mobile et le divertissement.",
      "💰 À partir de 699 € – écran 10,9\", stylet S Pen inclus, design fin et léger.",
      "🧩 Spécifications matérielles\\n - Processeur : Snapdragon 8 Gen 2\\n - RAM : 8 Go\\n - Stockage : 128 Go / 256 Go\\n - Batterie : jusqu’à 12 heures\\n - Connectivité : Wi-Fi 6E, Bluetooth 5.3, USB-C\\n - Épaisseur : 6,3 mm",
      "🖥️ Écran et affichage\\n - Taille : 10,9 pouces\\n - Technologie : AMOLED\\n - Résolution : 2560 × 1600\\n - Luminosité : 1 200 nits\\n - Taux de rafraîchissement : 90 Hz",
      "🖊️ Accessoires et interaction\\n - S Pen inclus\\n - Clavier Book Cover en option\\n - Reconnaissance faciale\\n - Système d’exploitation : One UI 7 (Android 15)",
      "🌐 Fonctionnalités avancées\\n - Mode DeX pour bureau virtuel\\n - Multifenêtrage intelligent\\n - Synchronisation avec Galaxy Watch et Buds\\n - Enregistrement vidéo 4K",
      "🎮 Expérience utilisateur\\n - Idéal pour les étudiants, les pros nomades et les gamers\\n - Compatible avec Xbox Cloud Gaming\\n - Interface fluide et personnalisable"
    ]
  },
  {
    "nom": "Microsoft Surface Pro X 2025",
    "categorie": "TABLETTE",
    "image": "Microsoft Surface Pro X 2025.png",
    "lien": "fiches/tablette/Microsoft Surface Pro X 2025.html",
    "description": "Tablette hybride haut de gamme sous Windows ARM avec stylet et clavier.",
    "top_du_mois": false,
    "prix": "À partir de 1 199 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles - Microsoft SQ4, 16 Go RAM, jusqu’à 512 Go de stockage - Écran PixelSense 13 pouces, 2880×1920, 120 Hz - Connectivité : Wi-Fi 7, Bluetooth 5.4, USB-C",
      "Accessoires et interaction - Surface Slim Pen 3, clavier Signature, reconnaissance Windows Hello - Système : Windows 11 ARM",
      "Fonctionnalités avancées - Mode PC ou tablette, apps Adobe CC, Office 365, Teams - Compatible avec Steam, Xbox Game Pass et cloud OneDrive"
    ],
    "id": "prod_39",
    "donnees_fiche": [
      "La tablette hybride Windows pensée pour les créateurs et les professionnels en déplacement.",
      "💰 À partir de 1 199 € – processeur ARM SQ4, écran PixelSense, clavier détachable.",
      "🧩 Spécifications matérielles\\n - Processeur : Microsoft SQ4 (ARM)\\n - RAM : 16 Go\\n - Stockage : 256 Go / 512 Go\\n - Batterie : jusqu’à 15 heures\\n - Connectivité : Wi-Fi 7, Bluetooth 5.4, USB-C\\n - Épaisseur : 7,3 mm",
      "🖥️ Écran et affichage\\n - Taille : 13 pouces\\n - Technologie : PixelSense Flow\\n - Résolution : 2880 × 1920\\n - Luminosité : 1 400 nits\\n - Taux de rafraîchissement : 120 Hz",
      "🖊️ Accessoires et interaction\\n - Surface Slim Pen 3\\n - Clavier Signature avec pavé tactile\\n - Windows Hello (caméra IR)\\n - Système d’exploitation : Windows 11 ARM",
      "🌐 Fonctionnalités avancées\\n - Mode tablette ou PC\\n - Applications pro : Adobe CC, Teams, Office 365\\n - Enregistrement vidéo 4K HDR\\n - Cloud Sync avec OneDrive",
      "🎮 Expérience utilisateur\\n - Parfait pour les créateurs, développeurs et télétravailleurs\\n - Compatible avec Steam et Xbox Game Pass\\n - Interface Windows fluide et multitâche"
    ]
  },
  {
    "nom": "Xbox Series X",
    "categorie": "CONSOLE",
    "description": "Console ultra-puissante conçue pour le jeu en 4K, offrant des performances fluides et une immersion totale dans l’univers Xbox.",
    "image": "Xbox Series X.png",
    "lien": "fiches/console/Xbox Series X.html",
    "top_du_mois": false,
    "prix": "499,00 €",
    "fonctionnalites_avancees": [
      "Spécifications matérielles- CPU : AMD Zen 2 8 cœurs 3.8 GHz - GPU : RDNA 2 avec 12 TFLOPS - RAM : 16 Go GDDR6 - Stockage : SSD NVMe 1 To - Résolution : 4K UHD à 120 fps - Connectivité : HDMI 2.1, USB 3.1, Ethernet, Wi-Fi 5"
    ],
    "id": "prod_40",
    "donnees_fiche": [
      "💰 Prix : 549,00 €",
      "🧩 Spécifications\\n - CPU : AMD Zen 2 8 cœurs 3.8 GHz\\n - GPU : RDNA 2 avec 12 TFLOPS\\n - RAM : 16 Go GDDR6\\n - Stockage : SSD NVMe 1 To\\n - Résolution : 4K UHD à 120 fps\\n - Connectivité : HDMI 2.1, USB 3.1, Ethernet, Wi-Fi 5",
      "🌐 Fonctionnalités\\n - Quick Resume pour basculer entre les jeux instantanément\\n - Refroidissement silencieux avec design monolithique\\n - Compatible avec Xbox Game Pass Ultimate\\n - Rétrocompatibilité étendue avec les jeux Xbox One, 360 et originaux",
      "🎮 Usage recommandé Parfaite pour les gamers hardcore, les amateurs de graphismes ultra-réalistes, et les fans de l’écosystème Xbox."
    ]
  },
 {
  "nom": "Nintendo Switch 2 Pro",
  "categorie": "CONSOLE",
  "image": "Nintendo Switch 2 Pro.png",
  "lien": "fiches/console/Nintendo Switch 2 Pro.html",
  "description": "La Nintendo Switch 2 Pro est une console hybride nouvelle génération, alliant puissance de salon et portabilité ultime.",
  "top_du_mois": true,
  "prix": "469 €",
  "fonctionnalites_avancees": [
    "Spécifications matérielles - CPU : AMD Zen 2 8 cœurs 3.8 GHz - GPU : RDNA 2 avec 12 TFLOPS - RAM : 16 Go GDDR6 - Stockage : SSD NVMe 1 To - Résolution : 4K UHD à 120 fps - Connectivité : HDMI 2.1, USB 3.1, Ethernet, Wi-Fi 5"
  ],


  "id": "prod_41",
  "donnees_fiche": [
    "La Nintendo Switch 2 Pro repousse les limites du jeu nomade avec une puissance accrue, un affichage 4K en mode docké, et une compatibilité étendue avec les accessoires et jeux de la première génération.",
    "💰 Prix : 469€",
    "🧩 Spécifications matérielles\n- Processeur custom NVIDIA Tegra X2\n- RAM 12 Go LPDDR5\n- Stockage interne 256 Go extensible via microSD",
    "🖥️ Écran et affichage\n- Écran OLED 7.5 pouces\n- Résolution 1080p portable / 4K docké\n- Taux de rafraîchissement 120 Hz",
    "🕹️ Contrôleurs et interaction\n- Joy-Con 2 avec retour haptique HD Rumble 2\n- Manette Pro 2 avec boutons arrière programmables\n- Bouton GameChat intégré",
    "🌐 Fonctionnalités connectées\n- Wi-Fi 6E\n- Bluetooth 5.2\n- Port Ethernet sur le dock\n- Synchronisation instantanée avec les accessoires Switch 1",
    "🎮 Expérience utilisateur\n- Interface retravaillée\n- Mode multi-utilisateur amélioré\n- Accès rapide aux jeux et applications\n- Support vocal intégré pour le chat en ligne"
  ]
},
  {
    "nom": "Drone X-Pro 2025",
    "categorie": "DRONE",
    "image": "drone-x-pro-2025.png",
    "lien": "fiches/drone/drone-x-pro-2025.html",
    "description": "Drone pliable ultra-portable avec caméra HD, idéal pour capturer des vues aériennes spectaculaires.",
    "top_du_mois": false,
    "prix": "41,32 €",
    "fonctionnalites_avancees": [
      "Caméra HD 1080p avec mode panoramique et slow motion",
      "Design pliable et compact, facile à transporter",
      "Capteur de gravité pour éviter les obstacles"
    ],
    "id": "prod_42",
    "donnees_fiche": [
      "À REMPLIR\\n - Description détaillée du produit.",
      "💰 Prix : À DÉFINIR",
      "🧩 Spécifications matérielle\n- À REMPLIR",
      "🎥 Fonctions vidéo\n- À REMPLIR",
      "🌐 Fonctionnalités connectée\n- À REMPLIR",
      "🎮 Expérience utilisateur\n- À REMPLIR"
    ]
  },
  {
    "nom": "Google Pixel 10",
    "categorie": "SMARTPHONE",
    "image": "google-pixel-10.png",
    "lien": "fiches/smartphone/google-pixel-10.html",
    "description": "Smartphone haut de gamme de Google intégrant des fonctions IA avancées et un module photo optimisé.",
    "top_du_mois": true,
    "prix": "999 €",
    "fonctionnalites_avancees": [
      "Traduction instantanée multilingue avec IA locale",
      "Mode astrophotographie optimisé",
      "Mises à jour Android garanties pendant 7 ans"
    ],
    "id": "prod_43",
    "donnees_fiche": [
      "À REMPLIR - Description détaillée du produit. \n- Écran AMOLED 6,3'' QHD+ LTPO 144 Hz \n- Finition aluminium et verre Gorilla Glass Victus 3 \n- Certification IP68",
      "💰 Prix : 999 €",
      "🧩 Spécifications matérielles \n- Processeur Google Tensor G4 gravé en 3 nm \n- 12 Go RAM LPDDR5X \n- Stockage 128/256/512 Go UFS 4.0",
      "📸 Appareil photo \n- Triple capteur arrière 50 Mpx (grand angle) + 48 Mpx (télé 5x) + 12 Mpx (ultra grand angle) \n- Vidéo 8K à 30 ips \n- Mode Portrait IA",
      "🌐 Fonctionnalités connectées \n- 5G \n- Wi-Fi 7 \n- Bluetooth 5.4 \n- NFC \n- Ultra Wideband (UWB)",
      "🎮 Expérience utilisateur \n- Android 15 \n- Commandes gestuelles IA \n- Résumé intelligent des notifications"
    ]
  },
  {
    "nom": "Redmagic Astra",
    "categorie": "TABLETTE",
    "image": "redmagic-astra.png",
    "lien": "fiches/tablette/redmagic-astra.html",
    "description": "Tablette gaming haute performance avec écran AMOLED 144 Hz et système de refroidissement actif.",
    "top_du_mois": false,
    "prix": "899 €",
    "fonctionnalites_avancees": [
      "Refroidissement actif intégré",
      "Compatibilité stylet Redmagic Pen",
      "Mode jeu avec macros matérielles"
    ],
    "id": "prod_44",
    "donnees_fiche": [
      "Tablette conçue pour les gamers exigeants. \n- Design aluminium \n- Son stéréo DTS:X Ultra \n- Optimisée pour le streaming et le cloud gaming",
      "💰 Prix : 899 €",
      "🧩 Spécifications matérielles \n- Snapdragon 8 Gen 4 \n- 12 Go RAM \n- 256 Go stockage UFS 4.0",
      "🖥️ Écran et affichage \n- 11'' AMOLED 2560x1600 \n- 144 Hz HDR10+ \n- Luminosité 800 nits",
      "🖊️ Accessoires et interaction \n- Stylet Redmagic Pen \n- Clavier magnétique \n- Manettes Bluetooth",
      "🌐 Fonctionnalités connectées \n- Wi-Fi 7 \n- 5G \n- USB-C 3.2 avec DisplayPort",
      "🎮 Expérience utilisateur \n- Interface Redmagic OS optimisée jeu \n- Profils performance personnalisés"
    ]
  },
  {
    "nom": "Beyerdynamic Amiron 100",
    "categorie": "CASQUE AUDIO",
    "image": "beyerdynamic-amiron-100.png",
    "lien": "fiches/casque-audio/beyerdynamic-amiron-100.html",
    "description": "Casque circum-aural haut de gamme offrant un son haute fidélité avec ANC adaptative.",
    "top_du_mois": false,
    "prix": "549 €",
    "fonctionnalites_avancees": [
      "Transducteurs Tesla",
      "ANC adaptative",
      "Codec aptX Lossless"
    ],
    "id": "prod_45",
    "donnees_fiche": [
      "Casque filaire et sans fil premium. \n- Confort mémoire de forme \n- Châssis aluminium \n- Fabrication allemande",
      "💰 Prix : 549 €",
      "🧩 Spécifications matérielles \n- Réponse 5 Hz – 40 kHz \n- Impédance 32 Ω \n- Autonomie 45h en Bluetooth",
      "🎧 Fonctions audio \n- ANC adaptative \n- Profils EQ via application \n- Codec aptX Lossless / LDAC / AAC",
      "🌐 Fonctionnalités connectées \n- Bluetooth 5.4 multipoint \n- Port USB-C audio \n- App compagnon iOS/Android",
      "🎮 Expérience utilisateur \n- Commandes tactiles \n- Détection de port automatique"
    ]
  }
$$
);
-- Vérifier le nombre total importé
SELECT COUNT(*) AS total_importe FROM produits;


-- 2️⃣  Statistiques individuelles
---------------------------------------------------------
-- Produits totaux avec id valide (prod_X, 1 ≤ X ≤ 99999)
SELECT COUNT(DISTINCT id) AS total_products
FROM produits
WHERE id ~ '^prod_[0-9]{1,5}$'
  AND CAST(SUBSTRING(id FROM 6) AS INTEGER) BETWEEN 1 AND 99999;

-- Nombre de catégories uniques
SELECT COUNT(DISTINCT categorie) AS total_categories
FROM produits
WHERE categorie IS NOT NULL AND categorie <> '';

-- Nombre de produits "top du mois"
SELECT COUNT(*) AS featured_products
FROM produits
WHERE top_du_mois = TRUE;


-- 3️⃣  Statistiques combinées en une seule requête
---------------------------------------------------------
SELECT
    COUNT(DISTINCT id) FILTER (
        WHERE id ~ '^prod_[0-9]{1,5}$'
          AND CAST(SUBSTRING(id FROM 6) AS INTEGER) BETWEEN 1 AND 99999
    ) AS total_products,

    COUNT(DISTINCT categorie) FILTER (
        WHERE categorie IS NOT NULL AND categorie <> ''
    ) AS total_categories,

    COUNT(*) FILTER (
        WHERE top_du_mois = TRUE
    ) AS featured_products
FROM produits;


-- 4️⃣  Analyse complémentaire
---------------------------------------------------------
-- Produits par catégorie
SELECT categorie, COUNT(*) AS nb_produits
FROM produits
GROUP BY categorie
ORDER BY nb_produits DESC;

-- Valeur totale de stock par catégorie (exemple avec champ `prix`)
-- SELECT categorie, SUM(prix) AS valeur_stock
-- FROM produits
-- GROUP BY categorie
-- ORDER BY valeur_stock DESC;

-- =====================================================
-- 📌 Fin du script
-- =====================================================
