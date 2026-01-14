-- Sections pour TOUS les articles tendances (71 articles restants)
-- Format: 4 sections par article avec titres emoji + contenu détaillé

-- ==============================================
-- CONSOLE (7 articles - IDs: 15, 16, 35, 36, 85, 87, 88)
-- ==============================================

-- Article 15: PlayStation 6 : Premières infos officielles
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(15, '🎮 Une nouvelle génération en approche',
E'Sony lève le voile sur la PlayStation 6 lors d''une conférence exclusive. La console promet une puissance graphique 4x supérieure à la PS5, avec support natif de la 8K 120fps et du ray tracing path tracing complet. L''architecture AMD custom intègre un GPU RDNA 5 avec 72 CU et un CPU Zen 6 à 16 cœurs.',
1),
(15, '⚡ Technologies révolutionnaires',
E'**Stockage** : SSD PCIe 6.0 de 4TB atteignant 18 Go/s en lecture\n\n**Mémoire** : 32GB de GDDR7 unifiée pour CPU/GPU\n\n**Upscaling** : PlayStation Super Resolution 2.0 avec génération de frames IA',
2),
(15, '🌐 Écosystème et services',
E'La PS6 mise sur l''intégration cloud avec PlayStation Plus Premium offrant le streaming 8K sans latence. Rétrocompatibilité totale avec PS4/PS5 et amélioration automatique des anciens jeux. Le nouveau PS VR 3 sans fil sera disponible au lancement pour une expérience immersive totale.',
3),
(15, '📅 Sortie et prix',
E'Lancement prévu pour novembre 2027 à 599$ (version standard) et 499$ (version digitale). Les précommandes ouvriront en juin 2027. Sony promet un stock suffisant pour éviter les pénuries qui ont marqué le lancement de la PS5.',
4);

-- Article 16: Xbox Next : Microsoft mise sur le cloud
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(16, '☁️ Le cloud au cœur de la stratégie',
E'Microsoft repense entièrement l''expérience Xbox avec la Next génération. La console hybride fonctionne en mode local puissant OU en streaming cloud selon les besoins. Cette approche révolutionnaire permet de jouer aux mêmes titres en qualité maximale partout : console, PC, mobile, TV connectée.',
1),
(16, '🚀 Puissance et flexibilité',
E'**Mode Local** : Performances équivalentes à la PS6 avec GPU custom AMD\n\n**Mode Cloud** : Accès à des serveurs Azure avec 100+ TFLOPS de puissance GPU\n\n**Smart Delivery 2.0** : Téléchargement intelligent selon connexion et stockage',
2),
(16, '🎯 Game Pass intégré',
E'L''abonnement Game Pass Ultimate inclus 3 mois à l''achat. Catalogue de 500+ jeux jouables instantanément via cloud. Les nouveaux exclusifs Microsoft (Halo Infinity, Fable 5, Perfect Dark) sortent day one dans le service. Possibilité d''acheter les jeux pour les conserver hors ligne.',
3),
(16, '💰 Accessibilité maximale',
E'Prix de lancement compétitif à 399$ grâce au modèle hybride. Option location mensuelle 24.99$/mois incluant console + Game Pass Ultimate. Sortie prévue septembre 2027. Microsoft vise 50 millions d''utilisateurs actifs dès la première année.',
4);

-- Article 35: Nintendo Switch 2 : la révolution portable continue
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(35, '🎮 Évolution majeure du concept',
E'Nintendo dévoile la Switch 2 qui conserve l''ADN hybride tout en multipliant les performances par 5. Écran OLED 8 pouces 120Hz, processeur NVIDIA Tegra custom avec architecture Ada Lovelace, et support du DLSS 3.5. Le mode dock atteint désormais la puissance d''une Xbox Series S.',
1),
(35, '⚡ Caractéristiques techniques',
E'**Écran** : OLED 8" HDR 1080p 120Hz avec VRR\n\n**Performances** : 1080p 60fps portable, 4K 60fps docké avec DLSS\n\n**Autonomie** : 6-9h selon utilisation grâce batterie 7000mAh',
2),
(35, '🎯 Catalogue et rétrocompat',
E'Tous les jeux Switch compatibles avec amélioration automatique des performances. Les nouveaux titres exploitent pleinement la puissance : Zelda Tears 2 en 4K60, Mario Kart 9 avec ray tracing, Metroid Prime 5 en graphismes photoréalistes. Nintendo promet 15 exclusifs majeurs la première année.',
3),
(35, '💎 Prix et disponibilité',
E'La Switch 2 sortira en mars 2027 à 449$ (modèle standard) et 399$ (modèle Lite portable uniquement). Les Joy-Con 2 améliorés intègrent retour haptique avancé et détection de pression. Nintendo vise 20 millions d''unités vendues la première année.',
4);

-- Article 36: Atari VCS Neo : le retour d'une légende
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(36, '🕹️ Atari revient dans le jeu',
E'La légendaire marque Atari fait un retour surprise avec la VCS Neo, console hybrid rétro-moderne. Architecture x86 moderne sous Linux custom, permettant de jouer aux classiques Atari remasterisés ET aux jeux PC modernes via Steam et Epic Games Store natifs.',
1),
(36, '🎨 Design emblématique modernisé',
E'**Esthétique** : Boîtier en bois véritable inspiré de l''Atari 2600\n\n**Puissance** : AMD Ryzen 7 + Radeon RX 7600 embarqués\n\n**Connectivité** : 4 ports USB, HDMI 2.1, Ethernet 10Gb, Wi-Fi 7',
2),
(36, '📚 Bibliothèque étendue',
E'100 classiques Atari remasterisés en 4K inclus (Asteroids, Centipede, Missile Command...). Compatibilité native avec Steam, Epic, GOG pour jouer à 50 000+ titres PC. Store Atari dédié proposant des jeux indés et rétro de toutes époques. Open source Linux permettant toute customisation.',
3),
(36, '🎯 Positionnement unique',
E'Prix de 599$ positionnant la VCS Neo comme console premium rétro-gaming ET PC gaming compact. Sortie juin 2026. Cible les nostalgiques ET les joueurs PC cherchant salon experience. Atari vise 2 millions d''unités vendues sur 3 ans.',
4);

-- Article 85: CES 2026 : Sony dévoile la PlayStation 5 Pro Slim
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(85, '🎮 Une PS5 Pro repensée',
E'Sony profite du CES 2026 pour présenter une version Slim de la PS5 Pro. Design 30% plus compact, consommation réduite de 20%, mais performances identiques. Le nouveau process 4nm du GPU AMD RDNA 3 permet ces gains d''efficacité sans sacrifier la puissance brute de 16.7 TFLOPS.',
1),
(85, '⚡ Améliorations techniques',
E'**Refroidissement** : Nouveau système à chambre à vapeur ultra-silencieux\n\n**Stockage** : SSD 2TB en standard (vs 1TB sur Pro originale)\n\n**Connectique** : Ajout d''un port USB-C frontal pour chargement manette',
2),
(85, '💰 Stratégie tarifaire',
E'Prix agressif de 549$ (vs 599$ de la Pro actuelle) pour dynamiser les ventes avant l''arrivée de la concurrence next-gen. La version Slim remplace la Pro standard dans la gamme. Bundle avec Spider-Man 3 proposé à 599$. Sony vise 8 millions d''unités vendues en 2026.',
3),
(85, '📅 Disponibilité immédiate',
E'Contrairement aux lancements précédents, la PS5 Pro Slim est disponible immédiatement après l''annonce. Stocks suffisants prévus dans tous les territoires. Trade-in program permettant de revendre son ancienne PS5 Pro avec 200$ de reprise. Garantie étendue à 3 ans offerte.',
4);

-- Article 87: Xbox Game Pass : 50 millions d'abonnés atteints
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(87, '📈 Un succès historique',
E'Microsoft annonce fièrement avoir franchi le cap des 50 millions d''abonnés Xbox Game Pass en janvier 2026. Le service représente désormais 40% du chiffre d''affaires gaming de Microsoft, validant la stratégie d''abonnement. Croissance de 35% sur un an malgré l''augmentation de prix de novembre 2025.',
1),
(87, '🎮 Catalogue enrichi',
E'**500+ jeux** disponibles incluant day one tous les exclusifs Microsoft\n\n**Cloud gaming** : Streaming 4K 60fps sur tous supports (console, PC, mobile, TV)\n\n**EA Play** et **Ubisoft+** inclus dans le tier Ultimate',
2),
(87, '💎 Nouvelles fonctionnalités 2026',
E'Lancement du "Game Pass Family" à 34.99$/mois pour 5 comptes. Programme "Game Pass Rewards" offrant des points échangeables contre DLC et extensions. Intégration Discord native avec partage d''écran. Tests de jeux avant achat avec transfert de sauvegarde garanti.',
3),
(87, '🚀 Objectif 100 millions',
E'Phil Spencer vise 100 millions d''abonnés d''ici 2028. Extension prévue dans 50 nouveaux pays en 2026. Partenariats avec Samsung et LG pour intégrer Game Pass dans les TV connectées. Le service devient la pierre angulaire de l''écosystème Xbox pour la prochaine décennie.',
4);

-- Article 88: Steam Deck OLED Pro confirmé pour février 2026
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(88, '🎮 La console portable ultime',
E'Valve officialise le Steam Deck OLED Pro après des mois de rumeurs. Écran OLED HDR 8 pouces 90Hz, CPU AMD Ryzen Z2 Extreme, GPU RDNA 3.5 avec 12 CU, 32GB de RAM LPDDR5X. Performances 2.5x supérieures au modèle actuel, permettant de jouer en natif 1080p 60fps à la plupart des AAA.',
1),
(88, '⚡ Innovations techniques',
E'**Écran** : OLED HDR 8" 1200p 90Hz VRR avec 1000 nits\n\n**Batterie** : 65Wh permettant 4-7h d''autonomie selon charge GPU\n\n**Refroidissement** : Système à chambre à vapeur inspiré du Steam Deck OLED',
2),
(88, '🔧 Compatibilité Steam OS 3.5',
E'Nouvelle version de Steam OS basée sur Arch Linux avec compatibilité Proton améliorée à 95% du catalogue Steam. Interface repensée optimisée pour écran 8 pouces. Support FSR 3.0 et XeSS natif au niveau système. Dock Pro vendu séparément avec GPU externe RTX 5060 intégré.',
3),
(88, '💰 Prix et sortie',
E'Trois versions : 512GB à 649$, 1TB à 749$, 2TB à 849$. Précommandes ouvertes le 1er février, sortie le 28 février 2026. Valve garantit stock suffisant contrairement au lancement original. Steam Deck LCD 256GB maintenu à 399$ comme entrée de gamme.',
4);

-- ==============================================
-- SMARTPHONE (6 articles - à identifier via requête)
-- ==============================================

-- Pour les smartphones, je vais créer du contenu générique premium
-- Article générique smartphone 1
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '📱 Design et innovation',
E'Ce nouveau smartphone repousse les limites du design mobile avec un écran borderless incurvé sur 4 côtés. Le châssis en titane aérospatial ultra-résistant protège les composants premium. La finition céramique nano-texturée offre une prise en main exceptionnelle et une résistance aux rayures inégalée.',
1
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id)
LIMIT 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '📸 Photographie révolutionnaire',
E'**Capteur principal** : 200MP avec stabilisation optique sur 6 axes\n\n**Téléobjectif** : Zoom optique 10x, numérique 100x assisté par IA\n\n**Mode Nuit** : Technologie de fusion multi-images pour photos parfaites en basse lumière',
2
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id)
LIMIT 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '⚡ Performances ultimes',
E'Le processeur nouvelle génération offre 40% de performances brutes supplémentaires tout en consommant 25% d''énergie en moins. Les 16GB de RAM LPDDR5X garantissent un multitâche fluide avec 20+ applications en arrière-plan. Le stockage UFS 4.0 de 512GB atteint 4 Go/s en lecture.',
3
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id)
LIMIT 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '🔋 Autonomie record',
E'Batterie 5500mAh avec technologie silicium-carbone permettant une journée complète d''utilisation intensive. Charge rapide 120W atteignant 100% en 18 minutes. Charge sans fil 50W et charge inversée 15W pour dépanner d''autres appareils. Garantie 1000 cycles à 80% de capacité.',
4
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id)
LIMIT 1;

-- Répéter pour les 5 autres smartphones avec variations
-- Smartphone 2
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '🌟 Excellence à tous les niveaux',
E'Ce flagship redéfinit les standards premium avec son écran LTPO AMOLED 2K 144Hz adaptatif. La luminosité de 3000 nits permet une lisibilité parfaite en plein soleil. La certification IP69 assure une protection maximale contre eau, poussière et chocs jusqu''à 2 mètres.',
1
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND a.id NOT IN (SELECT actualite_id FROM actualites_sections)
LIMIT 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '🎯 IA omniprésente',
E'**Assistant vocal** : Nouvelle IA conversationnelle comprenant le contexte et les nuances\n\n**Traduction** : Temps réel dans 100+ langues avec synchronisation labiale vidéo\n\n**Productivité** : Résumés automatiques, prise de notes intelligente, transcription instantanée',
2
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND a.id NOT IN (SELECT actualite_id FROM actualites_sections)
LIMIT 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '🔐 Sécurité renforcée',
E'Triple authentification biométrique : lecteur d''empreintes ultrasonique sous écran, reconnaissance faciale 3D, et scan d''iris. Enclave sécurisée dédiée pour données bancaires et médicales. Chiffrement matériel de bout en bout pour toutes les communications. Certification bancaire EAL6+.',
3
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND a.id NOT IN (SELECT actualite_id FROM actualites_sections)
LIMIT 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) 
SELECT a.id, '📡 Connectivité 5G+',
E'Modem 5G Advanced supportant des débits jusqu''à 10 Gbps en download. Wi-Fi 7 tri-bande pour connexions ultra-stables. Bluetooth 5.4 LE Audio pour qualité audio lossless sans fil. Support satellite pour messages d''urgence en zone blanche. Positionnement ultra-précis via GPS dual-band.',
4
FROM actualites a 
JOIN categories c ON a.categorie_id = c.id 
WHERE c.nom = 'smartphone' 
AND a.id NOT IN (SELECT actualite_id FROM actualites_sections)
LIMIT 1;

-- Continuer le pattern pour les 4 derniers smartphones...
-- (Code similaire répété 4 fois avec variations de contenu)

-- ==============================================
-- SCRIPT COMPLET TROP LONG - UTILISONS UNE APPROCHE PLUS INTELLIGENTE
-- ==============================================

-- Je vais créer un script qui génère des sections adaptées à chaque catégorie
-- en utilisant des templates intelligents
