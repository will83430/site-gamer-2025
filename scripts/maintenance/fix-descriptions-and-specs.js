// Script pour corriger descriptions ET spécifications
const pool = require('../backend/config/database');

// Données complètes par produit : [description avec puces, spécifications matérielles]
const productData = {
  'xiaomi-15-ultra': {
    description: `-	Smartphone flagship avec Snapdragon 8 Gen 4,
-	Écran AMOLED 6.7" 2K 120Hz,
-	Quad camera Leica 50 MP + 16 Go RAM,
-	512 Go, charge 120W et HyperOS 2.0.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon 8 Gen 4 (4nm)
- RAM : 16 Go LPDDR5X
- Stockage : 512 Go UFS 4.0
- Écran : AMOLED LTPO 6.7" 3200×1440 120Hz
- Batterie : 5300 mAh, charge 120W
- Caméra : Quad 50+50+50+200 MP Leica
- OS : HyperOS 2.0 (Android 15)`
  },
  'corsair-one-i500': {
    description: `-	PC compact ultra-puissant avec RTX 5090 24 Go,
-	Processeur Intel Core i9-14900K,
-	64 Go RAM et refroidissement liquide intégral,
-	Pour performances gaming 4K exceptionnelles.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Intel Core i9-14900K (24C/32T, 5.8 GHz)
- GPU : NVIDIA RTX 5090 24 Go GDDR7
- RAM : 64 Go DDR5-6000 MHz
- Stockage : SSD 2 To NVMe PCIe 5.0
- Refroidissement : Liquide AIO 360mm
- PSU : 1200W 80+ Platinum
- Dimensions : 380 × 176 × 508 mm`
  },
  'lenovo-legion-go-s': {
    description: `-	Console portable gaming avec écran 8.8" QHD+ 144Hz,
-	AMD Ryzen Z2 Extreme,
-	16 Go LPDDR5X et SSD 1 To,
-	Contrôleurs détachables + Legion Space UI.`,
    specs: `🧩 Spécifications matérielles
- Processeur : AMD Ryzen Z2 Extreme (8C/16T, 5.1 GHz)
- GPU : AMD RDNA3 12 CU
- RAM : 16 Go LPDDR5X-7500
- Stockage : SSD 1 To PCIe 4.0
- Écran : 8.8" IPS 2560×1600 144Hz HDR400
- Batterie : 55 Wh, charge 100W
- Connectivité : Wi-Fi 6E, Bluetooth 5.3, USB4`
  },
  'dji-neo-2': {
    description: `-	Drone ultra-compact 135g avec caméra 4K/60fps stabilisée,
-	Décollage main et ActiveTrack 360°,
-	QuickShots AI,
-	Autonomie 28 min et portée 10 km.`,
    specs: `🧩 Spécifications matérielles
- Capteur : 1/1.3" CMOS 48 MP
- Vidéo : 4K/60fps, 1080p/120fps
- Stabilisation : Gimbal 3 axes motorisé
- Transmission : O4 10 km, 1080p/60fps
- Autonomie : 28 min vol, 18 min vidéo
- Poids : 135g
- Détection : Vision binoculaire avant/arrière/bas`
  },
  'meta-quest-3s': {
    description: `-	Casque VR accessible avec Snapdragon XR2 Gen 2,
-	Écrans LCD, 128 Go de stockage,
-	Passthrough couleur et contrôleurs Touch Plus,
-	Compatibilité Quest 2/3.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon XR2 Gen 2 (4nm)
- Écrans : Dual LCD 1832×1920/œil 90Hz
- RAM : 8 Go LPDDR5
- Stockage : 128 Go UFS 3.1
- FOV : 110° horizontal, 96° vertical
- Audio : Spatial 3D intégré
- Tracking : Inside-out 6DoF, caméras RGB passthrough`
  },
  'msi-titan-18-hx': {
    description: `-	PC portable 18" avec écran Mini LED 4K 120Hz,
-	Intel Core i9-14900HX et RTX 5090 16 Go,
-	128 Go DDR5 et 4 To SSD,
-	Clavier Cherry MX + Cooler Boost Titan.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Intel Core i9-14900HX (24C/32T, 5.8 GHz)
- GPU : RTX 5090 Laptop 16 Go GDDR7 175W
- RAM : 128 Go (4×32) DDR5-5600
- Stockage : 4 To (4× SSD 1 To NVMe PCIe 4.0)
- Écran : 18" Mini LED 3840×2400 120Hz HDR1000
- Clavier : Cherry MX ULP RGB
- Refroidissement : Cooler Boost Titan (4 ventilateurs)`
  },
  'oneplus-pad-2': {
    description: `-	Tablette premium avec écran 12.1" LCD 144Hz,
-	Snapdragon 8 Gen 3 et 12 Go RAM,
-	Batterie 9510 mAh et charge SuperVOOC 67W,
-	6 HP Dolby Atmos.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon 8 Gen 3 (4nm)
- RAM : 12 Go LPDDR5X
- Stockage : 256 Go UFS 4.0
- Écran : LCD 12.1" 3000×2120 144Hz HDR10+
- Batterie : 9510 mAh, charge 67W SuperVOOC
- Audio : 6× HP Dolby Atmos
- OS : OxygenOS 14 (Android 14)`
  },
  'huawei-watch-gt-5-pro': {
    description: `-	Montre connectée titane 46mm avec écran AMOLED 1.43",
-	GPS double fréquence,
-	Autonomie 14 jours et capteur FC avancé,
-	100+ modes sport.`,
    specs: `🧩 Spécifications matérielles
- Boîtier : Titane 46mm, verre saphir
- Écran : AMOLED 1.43" 466×466 always-on
- Capteurs : FC optique TruSeen 6.0+, SpO2, ECG
- GPS : Dual-band L1+L5, GLONASS, Galileo, Beidou
- Batterie : 14 jours (usage normal), 8 jours (intensif)
- Résistance : 5 ATM + IP69K
- OS : HarmonyOS 5.0`
  },
  'samsung-qn900d-neo-qled-8k': {
    description: `-	TV 75" 8K Neo QLED avec processeur NQ8 AI Gen3,
-	Mini LED Quantum Matrix Pro,
-	HDR10+ Adaptive et Object Tracking Sound Pro,
-	144Hz pour le gaming.`,
    specs: `🧩 Spécifications matérielles
- Écran : 75" Neo QLED 7680×4320 (8K)
- Rétroéclairage : Mini LED Quantum Matrix Pro (2000 zones)
- Processeur : Neural Quantum NQ8 AI Gen3
- HDR : HDR10+ Adaptive, HLG, Quantum HDR 4000 nits
- Gaming : HDMI 2.1 ×4, 144Hz, VRR, ALLM, FreeSync Premium Pro
- Audio : 90W 8.2.4 OTS Pro, Dolby Atmos
- OS : Tizen 8.0`
  },
  'sony-a7-v': {
    description: `-	Hybride plein format 61 MP avec AF AI 759 points,
-	Vidéo 8K 30p / 4K 120p,
-	Stabilisation 8 stops et double slot CFexpress,
-	Viseur OLED 9.44 Mpts.`,
    specs: `🧩 Spécifications matérielles
- Capteur : Full Frame Exmor R BSI 61 MP
- Processeur : Bionz XR + AI
- AF : 759 points PDAF, Eye/Animal/Bird AF
- Vidéo : 8K 30p, 4K 120p 10-bit 4:2:2
- Stabilisation : IBIS 5 axes 8 stops
- Viseur : OLED 9.44 Mpts 120fps
- Stockage : Double CFexpress Type A + SD UHS-II`
  },
  'sennheiser-momentum-5': {
    description: `-	Casque premium avec transducteurs 42mm,
-	ANC adaptatif et audio spatial personnalisé,
-	Autonomie 60h et Bluetooth 5.4 aptX Lossless,
-	Matériaux haut de gamme.`,
    specs: `🧩 Spécifications matérielles
- Transducteurs : Dynamiques 42mm néodyme
- ANC : Hybrid adaptatif 8 micros
- Codecs : aptX Lossless, LDAC, AAC, SBC
- Bluetooth : 5.4, multipoint 3 appareils
- Autonomie : 60h ANC on, 70h ANC off
- Charge : USB-C 65W (10 min = 6h)
- Matériaux : Aluminium, cuir Nappa, mousse mémoire`
  },
  'bambu-lab-x1-carbon-combo': {
    description: `-	Imprimante 3D ultra-rapide 256×256×256mm,
-	AMS 4 couleurs et vitesse 500mm/s,
-	Caméra IA détection défauts,
-	Plateau PEI et filtre HEPA.`,
    specs: `🧩 Spécifications matérielles
- Volume : 256×256×256 mm
- Vitesse : 500 mm/s max, 250 mm/s standard
- Précision : ±0.08 mm
- Buses : 0.4mm (0.2/0.6/0.8 option)
- Plateau : PEI texture double face, chauffant 100°C
- Extrudeur : Direct Drive double engrenages
- AMS : 4 filaments auto-switch
- Détection : Caméra 1080p + IA défauts`
  },
  'razer-blackwidow-v4-pro-75': {
    description: `-	Clavier mécanique gaming 75% avec switches Razer Gen-3, 
-	Écran OLED, molette multifonction, 
-	RGB Chroma 16.8M, polling 8000Hz et HyperSpeed Wireless.`,
    specs: `🧩 Spécifications matérielles
- Format : 75% (84 touches)
- Switches : Razer Mechanical Gen-3 (Green/Yellow/Orange)
- Rétroéclairage : Chroma RGB 16.8M par touche
- Écran : OLED 128×40 personnalisable
- Polling : 8000Hz HyperSpeed/filaire
- Connexion : 2.4 GHz + Bluetooth 5.0 + USB-C
- Autonomie : 200h (RGB off), 13h (RGB max)`
  },
  // Produits restants (48 produits supplémentaires)
  'vibox-x-215-sg': {
    description: `-	PC gaming tour avec Intel i9-12900K,
-	RTX 4080 16 Go et 32 Go DDR5,
-	SSD 2 To + HDD 4 To,
-	RGB personnalisable + refroidissement liquide pour jeux 4K.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Intel Core i9-12900K (16C/24T, 5.2 GHz)
- GPU : NVIDIA RTX 4080 16 Go GDDR6X
- RAM : 32 Go (2×16) DDR5-5200
- Stockage : SSD 2 To NVMe + HDD 4 To
- Refroidissement : AIO 280mm RGB
- PSU : 850W 80+ Gold
- Boîtier : Tour ATX RGB Tempered Glass`
  },
  'asus-rog-strix-g18': {
    description: `-	PC portable gaming 18" avec Intel Core Ultra 9 275HX,
-	RTX 5070 et 32 Go DDR5,
-	Écran 240 Hz et refroidissement ROG,
-	Clavier RGB par touche.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Intel Core Ultra 9 275HX (24C, 5.5 GHz)
- GPU : RTX 5070 Laptop 8 Go GDDR6 140W
- RAM : 32 Go DDR5-5600
- Stockage : SSD 2 To NVMe PCIe 4.0
- Écran : 18" FHD+ 2560×1600 240Hz IPS
- Clavier : RGB per-key Aura Sync
- Refroidissement : ROG Arc Flow + liquid metal`
  },
  'dell-poweredge-r960': {
    description: `-	Serveur rack 4U avec 4× Intel Xeon Gen5,
-	Jusqu'à 6 To DDR5 ECC,
-	32× SSD NVMe et refroidissement redondant,
-	iDRAC9 pour datacenters.`,
    specs: `🧩 Spécifications matérielles
- CPU : 4× Intel Xeon Scalable Gen5 (jusqu'à 64C/socket)
- RAM : Jusqu'à 6 To DDR5-4800 ECC (48 slots)
- Stockage : 32× NVMe U.2 + 8× SAS/SATA
- Réseau : 4× 25GbE, options 100GbE
- Management : iDRAC9 Enterprise, Redfish API
- PSU : 2400W Titanium redondant N+N
- Format : Rack 4U 19"`
  },
  'dell-poweredge-r760': {
    description: `-	Serveur rack 2U avec dual Intel Xeon Scalable Gen4,
-	Jusqu'à 2 To DDR5 ECC,
-	12 baies hot swap et 4× 10GbE,
-	iDRAC + TPM 2.0 pour virtualisation.`,
    specs: `🧩 Spécifications matérielles
- CPU : 2× Intel Xeon Scalable Gen4 (jusqu'à 60C/socket)
- RAM : Jusqu'à 2 To DDR5-4800 ECC (16 slots)
- Stockage : 12× 3.5" ou 24× 2.5" hot-swap
- Réseau : 4× 10GbE, PCIe pour 25/100GbE
- Management : iDRAC9, Lifecycle Controller
- PSU : 1400W Platinum redondant
- Format : Rack 2U 19"`
  },
  'logitech-mx-master-4s': {
    description: `-	Souris ergonomique 8000 DPI avec défilement MagSpeed électromagnétique,
-	7 boutons personnalisables et Flow multi-PC,
-	Autonomie 90 jours avec charge rapide,
-	Suivi sur verre.`,
    specs: `🧩 Spécifications matérielles
- Capteur : Darkfield 8000 DPI (suivi verre)
- Boutons : 7 programmables + scroll 2 axes
- Scroll : MagSpeed électromagnétique (1000 lignes/s)
- Connectivité : Bluetooth LE + USB-C Logi Bolt
- Batterie : 90 jours, charge rapide 1 min = 3h
- Compatibilité : Windows, macOS, Linux, iPadOS
- Dimensions : 124.9 × 84.3 × 51 mm`
  },
  'steelseries-apex-pro-tkl-gen-3': {
    description: `-	Clavier mécanique TKL avec switches OmniPoint 2.0 magnétiques,
-	Ajustables 0.2-3.8 mm avec Rapid Trigger,
-	Écran OLED et RGB per-touche,
-	N-Key rollover haute performance.`,
    specs: `🧩 Spécifications matérielles
- Format : TenKeyLess (88 touches)
- Switches : OmniPoint 2.0 magnétiques ajustables
- Actuation : 0.2-3.8 mm par touche
- Polling : 1000 Hz
- RGB : Per-key PrismSync 16.8M
- Écran : OLED Smart Display
- Connexion : USB-C détachable, rollover N-Key`
  },
  'apple-ipad-pro-m4': {
    description: `-	Tablette pro avec puce Apple M4,
-	Écran OLED Ultra Retina XDR 11"/13" 120 Hz,
-	8/16 Go RAM et Apple Pencil Pro retour haptique,
-	Magic Keyboard compatible.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Apple M4 (3nm, 10C CPU + 10C GPU)
- RAM : 8/16 Go unifiée
- Stockage : 256 Go, 512 Go, 1 To, 2 To
- Écran : OLED tandem 11"/13" ProMotion 120Hz 1600 nits
- Caméras : 12 MP wide + 10 MP ultra-wide avant
- Connectivité : Thunderbolt 4 / USB 4, Wi-Fi 6E
- OS : iPadOS 18`
  },
  'samsung-galaxy-s25-ultra': {
    description: `-	Smartphone flagship avec Snapdragon 8 Elite,
-	Écran Dynamic AMOLED 6.9" 120 Hz,
-	Quad camera 200 MP et S Pen intégré,
-	Batterie 5000 mAh + Galaxy AI.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon 8 Elite (3nm, 4.47 GHz)
- RAM : 12 Go LPDDR5X
- Stockage : 256/512 Go/1 To UFS 4.0
- Écran : 6.9" Dynamic AMOLED 3200×1440 LTPO 120Hz
- Caméras : 200 MP + 50 MP 5x + 10 MP 3x + 10 MP ultra-wide
- Batterie : 5000 mAh, charge 45W
- OS : One UI 7 (Android 15), 7 ans MAJ`
  },
  'garmin-fenix-8': {
    description: `-	Montre GPS multisport professionnelle avec cartographie mondiale,
-	Capteurs santé avancés (ECG, SpO2),
-	Autonomie 30 jours et résistance 10 ATM,
-	Pour les aventuriers.`,
    specs: `🧩 Spécifications matérielles
- Écran : AMOLED 1.4" 454×454 always-on, verre saphir
- GPS : Multibande L1+L5, GLONASS, Galileo
- Capteurs : ECG, SpO2, FC optique, altimètre, boussole
- Autonomie : 30j smartwatch, 89h GPS, 95h UltraTrac
- Résistance : 10 ATM, MIL-STD-810
- Connectivité : Wi-Fi, Bluetooth, ANT+
- OS : Garmin OS`
  },
  'lg-oled65-g5': {
    description: `-	TV OLED 65" avec dalle Evo ultra lumineuse (2412 cd/m²),
-	Processeur Alpha 11 AI et 120 Hz natif,
-	Dolby Vision IQ et design mural One Wall,
-	Pour cinéphiles exigeants.`,
    specs: `🧩 Spécifications matérielles
- Écran : 65" OLED Evo 3840×2160 120Hz
- Luminosité : 2412 cd/m² pic (MLA Tech)
- Processeur : Alpha 11 AI Gen2
- HDR : Dolby Vision IQ, HDR10, HLG
- Gaming : HDMI 2.1 ×4, G-Sync/FreeSync, 0.1ms
- Audio : 60W 4.2, Dolby Atmos
- OS : webOS 24`
  },
  'lg-oled65-g3': {
    description: `-	Téléviseur OLED Evo 65" avec technologie MLA,
-	Luminosité 1490 cd/m² et HDMI 2.1 pour gaming 120 Hz,
-	WebOS 23 et design ultra-fin,
-	Pour home cinéma premium.`,
    specs: `🧩 Spécifications matérielles
- Écran : 65" OLED Evo 3840×2160 120Hz MLA
- Luminosité : 1490 cd/m² pic
- Processeur : Alpha 9 Gen6 AI
- HDR : Dolby Vision IQ, HDR10, HLG, Filmmaker Mode
- Gaming : HDMI 2.1 ×4, VRR/ALLM, 0.1ms
- Audio : 60W 4.2, Dolby Atmos
- OS : webOS 23`
  },
  'insta360-x5': {
    description: `-	Caméra 360° professionnelle 8K avec double capteur 1/1.28",
-	Stabilisation FlowState avancée,
-	Mode FreeFrame et étanchéité 10m,
-	Pour créateurs immersifs.`,
    specs: `🧩 Spécifications matérielles
- Capteurs : Dual 1/1.28" 48 MP
- Vidéo : 8K 30fps, 5.7K 60fps 360°
- Photo : 72 MP 360° (11968×5984)
- Stabilisation : FlowState gyroscope 6 axes
- Écran : Tactile 2.5" couleur
- Batterie : 1800 mAh, 90 min (5.7K)
- Résistance : IPX8 10m sans boîtier`
  },
  'canon-eos-r6-mark-ii': {
    description: `-	Hybride plein format 24.2 MP avec Dual Pixel CMOS AF II,
-	Rafale 40 i/s et vidéo 4K 60p sans crop,
-	Stabilisation 8 stops,
-	Pour photo/vidéo professionnelle.`,
    specs: `🧩 Spécifications matérielles
- Capteur : Full Frame CMOS 24.2 MP BSI
- Processeur : DIGIC X
- AF : Dual Pixel CMOS AF II 1053 zones, Eye/Animal/Vehicle
- Rafale : 40 fps électronique, 12 fps mécanique
- Vidéo : 4K 60p 10-bit 4:2:2, FHD 180p
- Stabilisation : IBIS 5 axes 8 stops
- Cartes : Dual SD UHS-II`
  },
  'valerion-vision-master-pro-2': {
    description: `-	Vidéoprojecteur trilaser DLP 4K avec Dolby Vision,
-	HDR10+ et Google TV intégré,
-	Luminosité élevée et faible latence,
-	Pour home cinéma et gaming.`,
    specs: `🧩 Spécifications matérielles
- Technologie : DLP 0.47" 4K UHD + trilaser RGB
- Luminosité : 3000 lumens ISO
- Contraste : Infini (laser on/off)
- Couleurs : 99% DCI-P3, 100% Rec.709
- HDR : Dolby Vision, HDR10+, HLG
- Latence : <20ms
- OS : Google TV intégré, Wi-Fi 6`
  },
  'epson-eh-ls12000b': {
    description: `-	Vidéoprojecteur laser 3LCD 4K Pro-UHD avec 2700 lumens,
-	HDR10+ et contraste 2 500 000:1,
-	Lens shift motorisé et HDMI 2.1,
-	Pour projection premium.`,
    specs: `🧩 Spécifications matérielles
- Technologie : 3LCD reflective 4K Pro-UHD
- Source : Laser phosphore 20 000h
- Luminosité : 2700 lumens (blanc = couleur)
- Contraste : 2 500 000:1 dynamique
- HDR : HDR10+, HLG
- Lens : Motorisé 2.1× zoom, shift H±47% V±96%
- HDMI : 2.1 eARC ×2`
  },
  'bose-quietcomfort-45': {
    description: `-	Casque circum-aural avec réduction de bruit active 3 modes,
-	Autonomie 24h et confort exceptionnel,
-	Son équilibré et multi-connect 2 appareils,
-	Pour voyages et télétravail.`,
    specs: `🧩 Spécifications matérielles
- Transducteurs : TriPort propriétaires 40mm
- ANC : Adaptive 11 niveaux, mode Aware
- Codecs : AAC, SBC
- Bluetooth : 5.1, multipoint 2 appareils
- Autonomie : 24h ANC on
- Charge : USB-C, 15 min = 3h
- Poids : 240g`
  },
  'sony-wh-1000xm5': {
    description: `-	Casque premium avec ANC optimisée par 8 micros IA,
-	Transducteurs 30mm et autonomie 30h,
-	Codec LDAC et design ultra-confortable,
-	Pour immersion sonore totale.`,
    specs: `🧩 Spécifications matérielles
- Transducteurs : 30mm carbon fiber dome
- ANC : 8 micros + processeur V1 IA
- Codecs : LDAC, AAC, SBC, DSEE Extreme
- Bluetooth : 5.2, multipoint 2 appareils
- Autonomie : 30h ANC on, 40h off
- Charge : USB-C, 3 min = 3h
- Poids : 250g`
  },
  'samsung-flip-pro-2025': {
    description: `-	Tableau interactif 75" tactile QLED avec 20 points de contact,
-	Stylet passif et Tizen OS + Knox,
-	Partage sans fil multi-appareils,
-	Pivot motorisé pour salles de réunion.`,
    specs: `🧩 Spécifications matérielles
- Écran : 75" QLED 3840×2160 tactile 20 points
- Stylet : Passif batteryless, détection palme
- OS : Tizen 7.0 + Knox Security
- Connectivité : Wi-Fi 6, Bluetooth 5.2, USB-C, HDMI
- Audio : 2× 20W stéréo
- Pivot : Motorisé 90°
- Mémoire : 8 Go RAM, 128 Go stockage`
  },
  'hkmlc-smart-board-explorer-elite-dual-75': {
    description: `-	Tableau interactif 75" 4K UHD dual OS Android 12 + Windows 10,
-	20 points tactiles et 8 Go RAM,
-	Logiciels éducatifs préinstallés,
-	Wi-Fi 6 pour éducation et entreprises.`,
    specs: `🧩 Spécifications matérielles
- Écran : 75" IPS 4K 3840×2160 tactile 20 points
- OS : Dual Android 12 + Windows 10 Pro
- CPU : Intel Core i5 10e Gen
- RAM : 8 Go DDR4
- Stockage : 128 Go SSD
- Connectivité : Wi-Fi 6, Bluetooth 5.0, HDMI ×3, USB ×6
- Audio : 2× 15W front-facing`
  },
  'asus-rog-ally-x': {
    description: `-	Console portable Windows avec AMD Ryzen Z1 Extreme,
-	24 Go RAM et écran 7" 120 Hz,
-	SSD 1 To et batterie 80 Wh,
-	Pour gaming AAA nomade.`,
    specs: `🧩 Spécifications matérielles
- CPU : AMD Ryzen Z1 Extreme (8C/16T, 5.1 GHz)
- GPU : AMD RDNA3 12 CU (2.7 GHz)
- RAM : 24 Go LPDDR5X-7500
- Stockage : SSD 1 To M.2 2280 PCIe 4.0
- Écran : 7" IPS FHD 1920×1080 120Hz VRR
- Batterie : 80 Wh, charge 65W
- Connectivité : Wi-Fi 6E, Bluetooth 5.2, USB4`
  },
  'meta-quest-3': {
    description: `-	Casque VR standalone avec Snapdragon XR2 Gen2,
-	Passthrough couleur HD et 12 Go RAM,
-	Suivi mains/yeux et bibliothèque Meta Quest,
-	Pour réalité mixte.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon XR2 Gen 2 (4nm)
- Écrans : Dual LCD 2064×2208/œil 90/120Hz
- RAM : 12 Go LPDDR5
- Stockage : 128 Go ou 512 Go
- FOV : 110° horizontal, 96° vertical
- Passthrough : Couleur 18 PPD
- Tracking : Inside-out 6DoF + hand/eye tracking`
  },
  'creality-ender-5-neo': {
    description: `-	Imprimante 3D FDM 220×220×250mm avec auto-nivellement,
-	Plateau chauffant et double extrusion,
-	Vitesse optimisée et connectivité USB/SD/Wi-Fi,
-	Plateau flexible magnétique PEI.`,
    specs: `🧩 Spécifications matérielles
- Volume : 220×220×250 mm
- Vitesse : 250 mm/s max
- Précision : ±0.1 mm
- Buse : 0.4mm (0.2/0.6/0.8 compatible)
- Plateau : Magnétique PEI double face, 110°C
- Nivellement : CR Touch auto 25 points
- Extrudeur : Sprite Direct Drive
- Connectivité : USB, SD, Wi-Fi`
  },
  'creality-ender-3-v3': {
    description: `-	Imprimante 3D populaire avec volume 220×220×250mm,
-	Direct Drive et double axe Z,
-	Auto-nivellement et vitesse 600mm/s,
-	Structure métallique stable.`,
    specs: `🧩 Spécifications matérielles
- Volume : 220×220×250 mm
- Vitesse : 600 mm/s max, 300 standard
- Précision : ±0.1 mm
- Buse : 0.4mm haute température
- Plateau : Carborundum magnétique, 100°C
- Nivellement : CR Touch automatique
- Extrudeur : Direct Drive Sprite
- Structure : Aluminium double Z`
  },
  'creality-halot-mage-s-14k': {
    description: `Imprimante résine 14K (13320×5120px) avec écran mono LCD 10.1", vitesse Dynax+ 150mm/h, purification d'air et précision 16.8µm pour figurines.

- Résolution 14K (13320×5120 pixels)
- Écran mono LCD 10.1" (16.8µm XY)
- Vitesse Dynax+ jusqu'à 150 mm/h
- Volume 228×128×230 mm
- Purification air intégrée`,
    specs: `🧩 Spécifications matérielles
- Écran : Mono LCD 10.1" 14K (13320×5120)
- Résolution XY : 16.8 µm
- Volume : 228×128×230 mm
- Vitesse : 150 mm/h (Dynax+)
- Source : LED matrix UV 405nm
- Nivellement : Auto Z-axis
- Filtre : HEPA + charbon actif`
  },
  'dji-mavic-4-pro': {
    description: `-	Drone pliable avec capteur Hasselblad 4/3 20 MP,
-	Vidéo 8K/30fps et autonomie 45 min,
-	Détection d'obstacles et transmission O4 15 km,
-	Pour cinéastes.`,
    specs: `🧩 Spécifications matérielles
- Capteur : Hasselblad 4/3" 20 MP
- Vidéo : 8K/30fps, 5.1K/60fps, 4K/120fps 10-bit
- Photo : 20 MP RAW, bracketing HDR
- Stabilisation : Gimbal 3 axes
- Transmission : O4 15 km, 1080p/60fps
- Autonomie : 45 min vol
- Détection : Vision omnidirectionnelle + LiDAR`
  },
  'skydio-x10': {
    description: `-	Drone autonome avec IA d'évitement,
-	Dual 48 MP RGB + thermique et vidéo 4K HDR/60fps,
-	Autonomie 40 min et résistance IP54,
-	Pour missions pro.`,
    specs: `🧩 Spécifications matérielles
- Caméras : 48 MP RGB + FLIR Boson thermique
- Vidéo : 4K 60fps HDR 10-bit
- IA : Autonomy Engine 2.0, 6× caméras navigation
- Transmission : 10 km HD
- Autonomie : 40 min
- Résistance : IP54, vent 44 km/h
- Poids : 1850g`
  },
  'dji-air-3s': {
    description: `-	Drone polyvalent avec double capteur 50 MP + 48 MP,
-	Vidéo 4K/60fps HDR et mode vertical,
-	Autonomie 45 min et détection LiDAR,
-	Pour créateurs.`,
    specs: `🧩 Spécifications matérielles
- Caméras : 50 MP 1" CMOS + 48 MP téléobjectif 3× 1/1.3"
- Vidéo : 4K/60fps HDR 10-bit D-Log M
- Photo : 50 MP RAW
- LiDAR : Forward-facing pour vol nuit
- Transmission : O4 20 km
- Autonomie : 45 min
- Détection : Omnidirectionnelle`
  },
  'parrot-anafi-usa': {
    description: `-	Drone professionnel avec triple capteur RGB + télé + FLIR thermique,
-	Zoom ×32 et vidéo 4K HDR,
-	Autonomie 32 min et chiffrement AES 512 bits,
-	Pour missions critiques.`,
    specs: `🧩 Spécifications matérielles
- Caméras : RGB 21 MP + téléobjectif 16 MP + FLIR Boson 320
- Zoom : ×32 hybride (3× optique + numérique)
- Vidéo : 4K HDR, photo 21 MP
- Sécurité : AES 256/512 bits, FIPS 140-2
- Autonomie : 32 min
- Résistance : IP53, vent 50 km/h
- Certification : Blue sUAS USA`
  },
  'dji-mini-5-pro': {
    description: `-	Drone ultra-léger 249g avec capteur 1" 20 MP,
-	Vidéo 5.3K/30fps HDR et détection LiDAR,
-	Autonomie 38 min et portée 18 km,
-	Sans enregistrement EU/US.`,
    specs: `🧩 Spécifications matérielles
- Capteur : 1" CMOS 20 MP
- Vidéo : 5.3K/30fps, 4K/60fps HDR 10-bit
- Photo : 20 MP RAW
- LiDAR : Forward + backward
- Transmission : O4 18 km
- Autonomie : 38 min
- Poids : 249g (sub-250g)`
  },
  'autel-nano-plus': {
    description: `-	Mini drone 249g avec capteur RYYB 50 MP,
-	Zoom ×16 et vidéo 4K/30fps HDR,
-	Stabilisation 3 axes et autonomie 28 min,
-	Pour voyage et vlog.`,
    specs: `🧩 Spécifications matérielles
- Capteur : RYYB 1/1.28" 50 MP
- Vidéo : 4K/30fps HDR 10-bit D-Log
- Photo : 50 MP RAW, zoom ×16
- Stabilisation : Gimbal 3 axes
- Transmission : 10 km HD
- Autonomie : 28 min
- Poids : 249g`
  },
  'autel-evo-max-5g': {
    description: `-	Drone compact 249g avec capteur CMOS 1" 20 MP,
-	Vidéo 5.3K/30fps et LiDAR,
-	Transmission 5G et autonomie 38 min,
-	Portée 10 km pour pros mobiles.`,
    specs: `🧩 Spécifications matérielles
- Capteur : 1" CMOS 20 MP
- Vidéo : 5.3K/30fps 10-bit HDR
- Photo : 20 MP RAW
- LiDAR : Binocular forward/backward
- Transmission : 5G + dual-band 10 km
- Autonomie : 38 min
- Poids : 249g`
  },
  'apple-watch-series-9': {
    description: `-	Montre connectée avec puce S9 SiP,
-	Écran OLED 2" always-on et double tap gestuel,
-	Capteurs santé (ECG, SpO2) et autonomie 18h,
-	watchOS 10.`,
    specs: `🧩 Spécifications matérielles
- Puce : S9 SiP 64-bit dual-core
- Écran : OLED LTPO 2" 484×396 always-on 2000 nits
- Capteurs : ECG, SpO2, température peau, accéléromètre, gyroscope
- GPS : Dual-frequency L1+L5
- Autonomie : 18h, 36h mode économie
- Résistance : 50m (5 ATM), IP6X
- OS : watchOS 10`
  },
  'apple-watch-series-10': {
    description: `-	Montre connectée ultra fine avec écran Retina 2.1" 2000 nits,
-	S10 SiP et capteurs santé avancés,
-	Détection apnée sommeil et autonomie 18h,
-	watchOS 11.`,
    specs: `🧩 Spécifications matérielles
- Puce : S10 SiP 64-bit neural engine
- Écran : OLED LTPO 2.1" 502×410 always-on 2000 nits
- Capteurs : ECG, SpO2, température, apnée sommeil
- GPS : Dual-frequency L1+L5 précision
- Autonomie : 18h, 36h mode économie
- Résistance : 50m (5 ATM), IP6X
- OS : watchOS 11`
  },
  'honor-200-pro': {
    description: `-	Smartphone avec Snapdragon 8s Gen 3,
-	Écran OLED 6.78" 120Hz et triple capteur 50 MP,
-	Batterie 5200 mAh et charge 100W,
-	MagicOS 8.0 (Android 14).`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon 8s Gen 3 (4nm)
- RAM : 12 Go LPDDR5X
- Stockage : 512 Go UFS 4.0
- Écran : OLED 6.78" 2700×1224 LTPO 120Hz
- Caméras : 50 MP IMX906 + 50 MP téléobjectif 2.5× + 12 MP ultra-wide
- Batterie : 5200 mAh, charge 100W
- OS : MagicOS 8.0 (Android 14)`
  },
  'playstation-5-slim': {
    description: `-	Console next-gen compacte avec AMD Ryzen Zen 2 8 cœurs,
-	GPU RDNA 2 ray tracing et SSD 1 To ultra-rapide,
-	4K HDR 120fps et design 30% plus fin,
-	Performances gaming exceptionnelles.`,
    specs: `🧩 Spécifications matérielles
- CPU : AMD Zen 2 8C/16T 3.5 GHz (variable)
- GPU : AMD RDNA 2 36 CU 10.28 TFLOPS, ray tracing
- RAM : 16 Go GDDR6 (448 Go/s)
- Stockage : SSD 1 To NVMe (5.5 Go/s)
- Optique : 4K UHD Blu-ray (modèle Digital sans lecteur)
- Sortie : HDMI 2.1 4K 120fps, HDR, VRR
- Dimensions : 30% plus compact vs PS5`
  },
  'samsung-galaxy-tab-s10-fe': {
    description: `⦁	Tablette 10.9" AMOLED avec Snapdragon 8 Gen 2,
⦁	8 Go RAM et 256 Go avec S Pen inclus,
⦁	Batterie 12h et One UI 7,
⦁	Mode DeX pour productivité.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon 8 Gen 2 (4nm)
- RAM : 8 Go LPDDR5X
- Stockage : 256 Go + microSD jusqu'à 1 To
- Écran : 10.9" Super AMOLED 2560×1600 120Hz
- Batterie : 10090 mAh, charge 45W
- S Pen : Inclus, latence 9ms
- OS : One UI 7 (Android 15), mode DeX`
  },
  'microsoft-surface-pro-x-2025': {
    description: `⦁	Tablette hybride Windows ARM avec Microsoft SQ4,
⦁	Écran PixelSense 13" 120 Hz et 16 Go RAM,
⦁	512 Go SSD et Slim Pen 3,
⦁	Autonomie optimisée.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Microsoft SQ4 (Snapdragon X Elite custom)
- RAM : 16 Go LPDDR5X
- Stockage : SSD 512 Go NVMe
- Écran : 13" PixelSense Flow 2880×1920 120Hz tactile
- Caméras : Windows Hello IR, 10 MP arrière
- Autonomie : 15h
- Connectivité : 5G, Wi-Fi 7, Bluetooth 5.3, USB4`
  },
  'xbox-series-x': {
    description: `⦁	Console 4K avec AMD Zen 2 8 cœurs 3.8 GHz,
⦁	GPU RDNA 2 12 TFLOPS et SSD 1 To NVMe,
⦁	Ray tracing et Quick Resume,
⦁	Rétrocompatibilité Xbox.`,
    specs: `🧩 Spécifications matérielles
- CPU : AMD Zen 2 8C/16T 3.8 GHz (3.6 SMT)
- GPU : AMD RDNA 2 52 CU 12 TFLOPS, ray tracing, VRS
- RAM : 16 Go GDDR6 (10+6 split 560+336 Go/s)
- Stockage : SSD 1 To NVMe custom (2.4 Go/s)
- Optique : 4K UHD Blu-ray
- Sortie : HDMI 2.1 4K 120fps, VRR, ALLM
- Rétrocompat : Xbox One/360/Original`
  },
  'nintendo-switch-2-pro': {
    description: `⦁	Console hybride avec Tegra X2 custom,
⦁	Écran OLED 7.5" 1080p/4K docké et 12 Go RAM,
⦁	256 Go et Joy-Con 2 retour haptique HD,
⦁	Wi-Fi 6E.`,
    specs: `🧩 Spécifications matérielles
- CPU : NVIDIA Tegra X2 custom 8C ARM A78
- GPU : 1024 CUDA cores, DLSS 2.0, ray tracing
- RAM : 12 Go LPDDR5
- Stockage : 256 Go UFS 3.1 + microSD
- Écran : 7.5" OLED 1920×1080 portable, 4K docké
- Joy-Con : HD Rumble retour haptique
- Connectivité : Wi-Fi 6E, Bluetooth 5.2`
  },
  'drone-x-pro-2025': {
    description: `⦁	Drone pliable avec caméra HD 1080p,
⦁	Stabilisation 3 axes et mode panoramique/slow motion,
⦁	Capteur gravité et design compact,
⦁	Contrôle intuitif.`,
    specs: `🧩 Spécifications matérielles
- Caméra : 1080p 30fps stabilisée
- Stabilisation : Gimbal 3 axes
- Capteurs : Gravité, baromètre, optique
- Transmission : 2.4 GHz 300m
- Autonomie : 15 min
- Poids : 280g pliable
- Modes : Panorama, Orbit, Follow Me, Waypoint`
  },
  'google-pixel-10': {
    description: `⦁	Smartphone Google avec Tensor G5,
⦁	Écran AMOLED 6.3" QHD+ LTPO 144 Hz,
⦁	Triple capteur IA optimisé et 7 ans de MAJ Android,
⦁	Traduction instantanée.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Google Tensor G5 (3nm)
- RAM : 12 Go LPDDR5X
- Stockage : 256 Go UFS 4.0
- Écran : AMOLED 6.3" 3120×1440 LTPO 144Hz
- Caméras : 50 MP + 50 MP téléobjectif 5× + 48 MP ultra-wide
- Batterie : 4700 mAh, charge 30W
- OS : Android 16, 7 ans MAJ`
  },
  'redmagic-astra': {
    description: `⦁	Tablette gaming avec écran AMOLED 144 Hz,
⦁	Refroidissement actif intégré et processeur gaming,
⦁	Son DTS:X Ultra et compatibilité stylet RedMagic Pen,
⦁	16 Go RAM et 512 Go UFS 4.0.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon 8 Gen 3 Leading (overclocké)
- RAM : 16 Go LPDDR5X
- Stockage : 512 Go UFS 4.0
- Écran : 12.1" AMOLED 2800×1840 144Hz
- Refroidissement : ICE 13 ventilateur actif + vapor chamber
- Audio : Quad speakers DTS:X Ultra
- Batterie : 10100 mAh, charge 80W`
  },
  'beyerdynamic-amiron-100': {
    description: `⦁	Casque circum-aural Tesla avec ANC adaptative,
⦁	Codec aptX Lossless et autonomie 45h,
⦁	Impédance 32Ω et réponse 5-40 kHz,
⦁	Fabrication allemande premium.`,
    specs: `🧩 Spécifications matérielles
- Transducteurs : Tesla 40mm (5-40 000 Hz)
- ANC : Hybrid adaptive
- Codecs : aptX Lossless, aptX Adaptive, AAC, SBC
- Bluetooth : 5.3, multipoint 2 appareils
- Autonomie : 45h ANC on
- Impédance : 32Ω
- Fabrication : Allemagne`
  },
  'freebox-ultra': {
    description: `⦁	Box internet fibre Wi-Fi 7 tri-bande avec débit 8 Gbit/s,
⦁	NAS 1 To et Player 4K Dolby Atmos,
⦁	280 chaînes TV et domotique Matter/Zigbee,
⦁	FreeOS 5.0.`,
    specs: `🧩 Spécifications matérielles
- Wi-Fi : 7 tri-bande BE19000 (2.4+5+6 GHz)
- Débit : 8 Gbit/s fibre symétrique
- Ports : 10 GbE, 4× 2.5 GbE, USB 3.2
- NAS : 1 To intégré
- Player : Android TV 13, 4K HDR Dolby Vision/Atmos
- Domotique : Matter, Zigbee, Thread
- OS : FreeOS 5.0`
  },
  'oculus-quest-2': {
    description: `⦁	Casque VR standalone avec Snapdragon XR2,
⦁	Écran LCD 1832×1920 par œil et 6 Go RAM,
⦁	Suivi inside-out et contrôleurs Touch,
⦁	Bibliothèque Quest.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon XR2 (7nm)
- Écrans : Dual LCD 1832×1920/œil 90Hz
- RAM : 6 Go LPDDR4X
- Stockage : 128 Go ou 256 Go
- FOV : 97° horizontal
- Audio : Spatial intégré
- Tracking : Inside-out 6DoF, 4 caméras`
  },
  'lenovo-yoga-tab-15': {
    description: `⦁	Tablette grand format 15" avec béquille intégrée,
⦁	Processeur puissant et son JBL,
⦁	Stylet compatible et autonomie longue durée,
⦁	Mode tente/support.`,
    specs: `🧩 Spécifications matérielles
- Processeur : Snapdragon 870 (7nm)
- RAM : 8 Go LPDDR5
- Stockage : 256 Go UFS 3.1 + microSD
- Écran : 15.6" IPS 2560×1440 anti-reflet
- Audio : Quad JBL speakers Dolby Atmos
- Batterie : 12 000 mAh, charge 45W
- Béquille : Intégrée 0-180°`
  },
  'apple-vison-pro': {
    description: `⦁	Casque spatial computing avec double puce M2 + R1,
⦁	Écrans micro-OLED 23 Mpts et 12 caméras/5 capteurs,
⦁	Suivi yeux/mains et visionOS,
⦁	Pour réalité mixte pro.`,
    specs: `🧩 Spécifications matérielles
- Processeurs : M2 (8C CPU + 10C GPU) + R1 real-time
- Écrans : Dual micro-OLED 23 Mpts total (11.5M/œil)
- Capteurs : 12 caméras, 5 capteurs, 6 micros, LiDAR
- RAM : 16 Go unifiée
- Stockage : 256/512 Go/1 To
- Audio : Spatial Audio pods
- OS : visionOS`
  },
  'steelseries-arctis-nova-pro': {
    description: `⦁	Casque gaming premium avec drivers haute résolution 40mm,
⦁	DAC GameDAC Gen 2 et ANC,
⦁	Double connexion sans fil et écran OLED,
⦁	Son spatial 360°.`,
    specs: `🧩 Spécifications matérielles
- Drivers : 40mm high-fidelity néodyme
- DAC : ESS Sabre GameDAC Gen 2 96kHz/24bit
- ANC : Active hybrid
- Connexion : 2.4 GHz + Bluetooth 5.0 simultané
- Autonomie : 44h (22h×2 batteries hot-swap)
- Écran : OLED sur GameDAC
- Spatial : 360° Tempest 3D Audio`
  },
  'apple-vision-pro': {
    description: `⦁	Casque spatial computing avec double puce M2 + R1,
⦁	Écrans micro-OLED 23 Mpts et 12 caméras/5 capteurs,
⦁	Suivi yeux/mains et visionOS,
⦁	Pour réalité mixte pro.`,
    specs: `🧩 Spécifications matérielles
- Processeurs : M2 (8C CPU + 10C GPU) + R1 real-time
- Écrans : Dual micro-OLED 23 Mpts total (11.5M/œil)
- Capteurs : 12 caméras, 5 capteurs, 6 micros, LiDAR
- RAM : 16 Go unifiée
- Stockage : 256/512 Go/1 To
- Audio : Spatial Audio pods
- OS : visionOS`
  },
  'razer-blackwidow-v4-pro': {
    description: `⦁	Clavier mécanique full-size avec switches Razer Gen-3,
⦁	Molette tactile RGB et écran OLED,
⦁	Touches macro dédiées et polling 8000Hz,
⦁	Éclairage Chroma premium.`,
    specs: `🧩 Spécifications matérielles
- Format : 100% (104 touches + 8 macro)
- Switches : Razer Mechanical Gen-3 hot-swappable
- Rétroéclairage : Chroma RGB 16.8M par touche
- Écran : OLED 128×40
- Molette : Tactile RGB multifonction
- Polling : 8000Hz HyperSpeed/filaire
- Connexion : 2.4 GHz + Bluetooth + USB-C`
  }
};

async function run() {
  try {
    console.log('✅ Connecté à PostgreSQL\n');

    let updated = 0;
    for (const [productName, data] of Object.entries(productData)) {
      // Mettre à jour description ET spécifications
      const result = await pool.query(`
        UPDATE produits 
        SET donnees_fiche = ARRAY[
          '📝 Description détaillée
' || $1,
          donnees_fiche[2],  -- Prix
          $2,  -- Spécifications (nouvelle)
          donnees_fiche[4],  -- Section catégorie spécifique
          donnees_fiche[5],  -- Connectivité
          donnees_fiche[6],  -- Expérience
          donnees_fiche[7],  -- Autonomie/Thermique
          donnees_fiche[8],  -- Garantie
          donnees_fiche[9]   -- Contenu
        ]
        WHERE nom = $3
        RETURNING id, nom
      `, [data.description, data.specs, productName]);
      
      if (result.rowCount > 0) {
        updated++;
        console.log(`✅ ${result.rows[0].id} - ${result.rows[0].nom}`);
      }
    }
    
    console.log(`\n✅ ${updated} produits mis à jour (descriptions + spécifications) !`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

run();
