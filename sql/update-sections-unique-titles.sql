-- Script pour générer des titres de sections uniques par article
-- Chaque article aura des titres différents basés sur sa catégorie et son contenu

-- Supprimer les sections existantes pour les recréer avec des titres uniques
DELETE FROM actualites_sections;

-- =====================================================
-- PC GAMING (categorie_id = 1)
-- =====================================================

-- Article 101: NVIDIA RTX 5090
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(101, '🔥 Architecture Blackwell révolutionnaire', 'L''architecture Blackwell de NVIDIA représente un bond technologique majeur. Avec 21 760 cœurs CUDA et 680 cœurs Tensor de 5ème génération, la RTX 5090 offre des performances de ray tracing multipliées par deux par rapport à la génération précédente. Le DLSS 4.0 introduit la génération de frames neuronale, permettant de multiplier par 8 les images affichées.', 1),
(101, '📊 Spécifications techniques détaillées', '**Mémoire** : 32GB de GDDR7 à 28 Gbps sur bus 512-bit pour une bande passante de 1.8 TB/s. **Ray Tracing** : Unités RT de 4ème génération avec support complet du Path Tracing en temps réel. **IA** : 1 400 TOPS de puissance IA pour DLSS 4.0 et génération de contenu.', 2),
(101, '🎯 Benchmarks et tests pratiques', 'Cette carte graphique redéfinit les standards du gaming 4K et 8K. Les benchmarks montrent des gains de 90% à 120% selon les jeux avec ray tracing activé. Le prix de 1 999$ positionne la RTX 5090 comme un produit premium, mais justifié par les performances brutes.', 3),
(101, '📅 Disponibilité et approvisionnement', 'La RTX 5090 sera disponible le 30 janvier 2026. Les premières précommandes affichent déjà complet chez la plupart des distributeurs. NVIDIA a assuré que la production serait suffisante pour éviter les pénuries de la génération précédente.', 4);

-- Article 102: AMD Radeon RX 9900 XT
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(102, '🔴 L''architecture RDNA 4 en détail', 'AMD frappe fort avec la Radeon RX 9900 XT, première carte du constructeur à véritablement rivaliser avec les GeForce RTX au sommet. Basée sur l''architecture RDNA 4, elle embarque 96 compute units et 16GB de GDDR7. Les performances en rasterisation dépassent même la RTX 5090 de 5 à 10% selon les jeux.', 1),
(102, '⚡ Comparatif FSR 4.0 vs DLSS 4.0', 'Le FSR 4.0 d''AMD intègre enfin la génération de frames par IA, rattrapant son retard sur NVIDIA. Les tests montrent une qualité d''image équivalente au DLSS dans la plupart des scénarios. L''avantage AMD : pas besoin de cœurs Tensor dédiés.', 2),
(102, '💰 Stratégie tarifaire agressive', 'Le prix de 1 499$ positionne la RX 9900 XT 500$ sous la RTX 5090. AMD mise sur un rapport performance/prix imbattable pour séduire les joueurs exigeants mais sensibles au budget. Cette stratégie pourrait enfin permettre au constructeur de regagner des parts de marché significatives.', 3),
(102, '🌡️ Consommation et efficacité énergétique', 'Avec une consommation de 420W contre 600W pour la RTX 5090, AMD démontre une meilleure efficacité énergétique. Le nouveau process 4nm de TSMC permet ces gains substantiels tout en maintenant des fréquences boost élevées.', 4);

-- Article 103: Intel Arc B770
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(103, '💙 Intel s''impose dans le milieu de gamme', 'Avec la série Arc Battlemage, Intel prouve que son engagement dans le GPU gaming est sérieux. L''Arc B770 surprend par ses performances solides en milieu de gamme : équivalent RTX 4070 Ti en rasterisation pour seulement 499$. Une proposition de valeur exceptionnelle.', 1),
(103, '🔧 Architecture Xe2-HPG décortiquée', 'L''architecture Xe2-HPG apporte +60% de performances par watt vs la génération précédente. Les 32 cœurs Xe offrent une puissance de calcul impressionnante pour le segment. Intel a enfin résolu les problèmes de drivers qui plombaient la première génération Arc.', 2),
(103, '🎮 Compatibilité et support logiciel', 'Le support des technologies modernes est complet : DirectX 12 Ultimate, Vulkan 1.3, ray tracing hardware. XeSS 2.0 rivalise désormais avec FSR et DLSS en qualité d''upscaling. Intel promet des mises à jour driver mensuelles.', 3),
(103, '📈 Impact sur le marché GPU', 'L''arrivée d''Intel comme troisième acteur crédible est une excellente nouvelle pour les consommateurs. La concurrence accrue force NVIDIA et AMD à ajuster leurs prix. Le duopole historique est enfin challengé.', 4);

-- Article 104: AMD Ryzen 9 9950X3D
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(104, '🧊 La magie du V-Cache 3D expliquée', 'AMD repousse les limites avec le Ryzen 9 9950X3D : 24 cœurs Zen 5 cadencés jusqu''à 5.8 GHz, surmontés de 192MB de V-Cache 3D. Cette combinaison unique offre +35% de performances gaming vs le 7950X3D tout en conservant d''excellentes capacités multi-thread.', 1),
(104, '🎮 Domination absolue en gaming', 'Les benchmarks gaming sont sans appel : le 9950X3D écrase la concurrence Intel. Les jeux gourmands en cache comme Flight Simulator, Cities Skylines 2 et Starfield montrent des gains de 40 à 60%. Le 1% low FPS est également amélioré de 50%.', 2),
(104, '💻 Productivité et création de contenu', 'Contrairement aux précédents modèles X3D, le 9950X3D maintient d''excellentes performances en productivité. Le rendu 3D, la compilation et le streaming ne souffrent pas de la présence du V-Cache. Un CPU vraiment polyvalent.', 3),
(104, '🔌 Plateforme AM5 et écosystème', 'Compatible avec les cartes mères AM5 existantes via mise à jour BIOS. Le support DDR5-6400+ et PCIe 5.0 assure une plateforme pérenne. AMD garantit le support AM5 jusqu''en 2027 minimum.', 4);

-- Article 105: SSD PCIe 6.0
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(105, '⚡ Débits stratosphériques : 20 Go/s', 'Les premiers SSD PCIe 6.0 débarquent avec des débits hallucinants : 20 Go/s en lecture séquentielle et 18 Go/s en écriture. Le contrôleur Phison E31T exploite les 4 lignes PCIe 6.0 pour offrir 2.5x les performances des meilleurs PCIe 5.0 actuels.', 1),
(105, '🎮 DirectStorage 2.0 et gaming next-gen', 'Avec DirectStorage 2.0, les jeux chargent les textures 8K et assets directement vers le GPU. Les temps de chargement deviennent imperceptibles. Les open worlds peuvent streamer des environnements massifs sans stuttering.', 2),
(105, '💾 Capacités et endurance', 'Capacités de 2TB à 8TB disponibles au lancement. La NAND 3D TLC de dernière génération offre 3000 TBW d''endurance pour le modèle 4TB. Les contrôleurs intègrent 4GB de cache DRAM pour des performances constantes.', 3),
(105, '❄️ Gestion thermique innovante', 'La technologie de refroidissement passive suffit grâce à l''efficacité énergétique du PCIe 6.0 : seulement 0.5W par Go/s. Les heatsinks inclus maintiennent des températures sous contrôle même en charge soutenue.', 4);

-- Article 106: Windows 12 Gaming Edition
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(106, '🖥️ Un OS conçu pour les gamers', 'Microsoft officialise Windows 12 Gaming Edition, version optimisée du système d''exploitation prévue pour juin 2026. Suppression de 40% des processus d''arrière-plan et nouvelle API DirectX 13 pour des performances gaming brutes maximisées.', 1),
(106, '🚀 Mode Ultra Performance décrypté', 'Le Mode Ultra Performance réserve 100% des ressources aux jeux en cours. Services non-essentiels suspendus, RAM pré-allouée, scheduler CPU optimisé. Microsoft promet +15% de FPS moyens vs Windows 11.', 2),
(106, '🤖 IA intégrée au niveau système', 'L''upscaling IA au niveau système fonctionne avec tous les jeux, même anciens. L''assistant gaming Copilot suggère des optimisations en temps réel. La génération automatique de shaders réduit le stuttering des nouveaux jeux.', 3),
(106, '🔄 Migration et compatibilité', 'Mise à niveau gratuite depuis Windows 11 pour les PC gaming. Tous les jeux existants restent compatibles. Les drivers graphiques sont optimisés conjointement avec NVIDIA, AMD et Intel.', 4);

-- =====================================================
-- CONSOLE (categorie_id = 4)
-- =====================================================

-- Article 15: PlayStation 6
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(15, '🎮 L''architecture nouvelle génération', 'La PlayStation 6 apporte une révolution architecturale majeure avec un GPU AMD RDNA 4 custom de 20 TFLOPS. La rétrocompatibilité totale avec la PS5 garantit que votre bibliothèque fonctionnera sans modification. Le SSD ultra-rapide de nouvelle génération permet des temps de chargement quasi-instantanés.', 1),
(15, '📺 Performances graphiques 4K/8K', 'Les specifications annoncées montrent un bond de 80% en puissance GPU par rapport à la PS5. La résolution native 4K à 120fps devient le standard, avec support du 8K pour les titres compatibles. Le ray tracing temps réel avancé ouvre des possibilités graphiques jamais vues.', 2),
(15, '💿 Stockage révolutionnaire', 'Le nouveau SSD propriétaire offre des débits supérieurs à 15 GB/s. Les développeurs peuvent créer des mondes plus vastes et détaillés sans compromis. L''extension de stockage NVMe PCIe 5.0 est supportée nativement.', 3),
(15, '🎧 Audio 3D Tempest avancé', 'Le moteur audio Tempest 2.0 supporte jusqu''à 1000 sources sonores simultanées. L''audio spatial fonctionne avec n''importe quel casque. L''immersion sonore atteint un niveau jamais vu sur console.', 4);

-- Article 16: Xbox Next
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(16, '☁️ Le cloud gaming natif révolutionne tout', 'Microsoft révolutionne la distribution avec un cloud gaming natif directement intégré au système d''exploitation. Fini le téléchargement obligatoire : les jeux se lancent instantanément depuis le cloud. Cette stratégie positionne Xbox comme plateforme du futur.', 1),
(16, '🌐 Un écosystème véritablement sans frontières', 'Jouez sur n''importe quel appareil : console, PC, tablette, téléphone, TV. La progression et les achievements se synchronisent automatiquement entre tous vos appareils. Xbox Game Pass devient une plateforme universelle de divertissement.', 2),
(16, '💳 Stratégie d''abonnement agressive', 'Microsoft mise sur l''abonnement plutôt que sur la vente à l''unité. Le cloud gaming réduit les barrières matérielles : pas besoin d''une console puissante. Avec Game Pass Ultimate, accédez à des centaines de jeux instantanément pour 14.99€/mois.', 3),
(16, '🔧 Spécifications techniques impressionnantes', 'CPU custom AMD Zen 5 à 4.5 GHz, GPU RDNA 4 de 22 TFLOPS, 32GB de RAM GDDR7. La Xbox Next est aussi puissante en local qu''en cloud, offrant le meilleur des deux mondes selon votre connexion.', 4);

-- Article 35: Nintendo Switch 2
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(35, '🕹️ L''ADN hybride préservé et amélioré', 'Nintendo dévoile la Switch 2 qui conserve l''ADN hybride tout en multipliant les performances par 5. Le format portable/dock reste au cœur de l''expérience. La transition transparente entre modes est encore plus fluide.', 1),
(35, '📱 Écran OLED 8 pouces HDR', 'Le nouvel écran OLED 8 pouces offre une immersion meilleure en déplacement. Support HDR avec 1000 nits de luminosité crête. Les jeux haut de gamme tournent en 1080p 60fps en mode portable avec DLSS.', 2),
(35, '📶 Connectivité 5G intégrée', 'Le 5G intégré permet le streaming de jeux en nuage depuis n''importe où. Les jeux se téléchargent plus rapidement en déplacement. Le jeu en ligne bénéficie d''une latence ultra-faible grâce au 5G.', 3),
(35, '🎮 Rétrocompatibilité Switch garantie', 'Les cartouches Switch originales fonctionnent sur Switch 2. La bibliothèque de 3000+ jeux devient immédiatement disponible. Les utilisateurs Switch 1 adoptent sans crainte de perdre leurs jeux.', 4);

-- =====================================================
-- SMARTPHONE (categorie_id = 3)
-- =====================================================

-- Articles smartphones génériques (si existants)
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📱 Design et ergonomie repensés',
E'Ce nouveau smartphone propose un design résolument moderne avec des finitions premium. L''écran bord-à-bord maximise l''immersion visuelle. La prise en main reste excellente malgré la grande diagonale.',
1
FROM actualites a
WHERE a.categorie_id = 3
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📸 Système photo révolutionnaire',
E'Le module photo principal utilise un capteur de nouvelle génération. Les algorithmes IA améliorent chaque cliché en temps réel. Les photos de nuit rivalisent avec les conditions de lumière du jour.',
2
FROM actualites a
WHERE a.categorie_id = 3
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '⚡ Performances et autonomie',
E'Le processeur nouvelle génération offre 40% de performances supplémentaires. La batterie de grande capacité assure 2 jours d''autonomie. La charge rapide permet 50% en seulement 15 minutes.',
3
FROM actualites a
WHERE a.categorie_id = 3
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- CASQUE-VR (categorie_id = 11)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🥽 Immersion visuelle sans précédent',
E'Les écrans micro-OLED offrent une densité de pixels jamais vue. Le champ de vision élargi élimine l''effet de tunnel. La clarté optique permet de lire du texte fin sans effort.',
1
FROM actualites a
WHERE a.categorie_id = 11
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎯 Tracking précision millimétrique',
E'Le tracking inside-out utilise des algorithmes IA avancés. Pas besoin de stations externes : tout est intégré au casque. Les contrôleurs offrent une précision millimétrique pour les interactions fines.',
2
FROM actualites a
WHERE a.categorie_id = 11
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎮 Écosystème et contenus',
E'La bibliothèque de jeux et applications VR s''enrichit chaque semaine. Les expériences sociales en réalité virtuelle connectent des millions d''utilisateurs. Le support des applications de productivité transforme le travail.',
3
FROM actualites a
WHERE a.categorie_id = 11
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- CASQUE-AUDIO (categorie_id = 6)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🔇 Réduction de bruit nouvelle génération',
E'Les algorithmes de suppression active du bruit atteignent des niveaux record. Le système détecte et annule plus de 99% du bruit ambiant. Le silence obtenu permet une concentration totale.',
1
FROM actualites a
WHERE a.categorie_id = 6
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎵 Signature sonore audiophile',
E'Les transducteurs de nouvelle génération offrent une réponse en fréquence étendue. Les graves sont profonds sans être envahissants. Les médiums vocaux ressortent avec une clarté exceptionnelle.',
2
FROM actualites a
WHERE a.categorie_id = 6
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🔋 Autonomie marathon',
E'L''autonomie atteint des records avec plusieurs jours d''écoute continue. La charge rapide offre des heures d''écoute en quelques minutes. Le mode économie d''énergie prolonge encore la durée de vie.',
3
FROM actualites a
WHERE a.categorie_id = 6
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- MONTRE-CONNECTEE (categorie_id = 7)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '❤️ Suivi santé avancé',
E'Les capteurs biométriques nouvelle génération surveillent en continu les constantes vitales. La détection des anomalies cardiaques peut sauver des vies. Le suivi du sommeil analyse chaque phase de repos.',
1
FROM actualites a
WHERE a.categorie_id = 7
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🏃 Performances sportives',
E'Le GPS multi-bande offre un tracking précis même en conditions difficiles. Plus de 100 modes sportifs couvrent toutes les activités. Les métriques avancées aident à optimiser l''entraînement.',
2
FROM actualites a
WHERE a.categorie_id = 7
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📱 Connectivité et notifications',
E'La synchronisation avec le smartphone est instantanée et transparente. Les notifications s''affichent avec un aperçu lisible. Les réponses rapides permettent d''interagir sans sortir le téléphone.',
3
FROM actualites a
WHERE a.categorie_id = 7
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- SERVEUR (categorie_id = 8)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '⚙️ Puissance de calcul datacenter',
E'L''architecture multi-processeur permet de gérer des charges de travail massives. Les cœurs optimisés pour le cloud offrent une efficacité remarquable. La virtualisation atteint des niveaux de densité inédits.',
1
FROM actualites a
WHERE a.categorie_id = 8
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🔒 Sécurité et redondance',
E'Les systèmes de redondance garantissent une disponibilité maximale. Les composants hot-swap permettent la maintenance sans interruption. La sécurité matérielle protège contre les attaques sophistiquées.',
2
FROM actualites a
WHERE a.categorie_id = 8
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '💾 Stockage et mémoire extensibles',
E'Les configurations de stockage s''adaptent à tous les besoins. La mémoire ECC garantit l''intégrité des données critiques. Les contrôleurs RAID offrent performance et protection.',
3
FROM actualites a
WHERE a.categorie_id = 8
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- BOX-INTERNET (categorie_id = 9)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🚀 Vitesse fibre démentielle',
E'Les débits fibre atteignent des sommets avec cette nouvelle génération. Le téléchargement de fichiers volumineux devient instantané. Le streaming 8K multi-appareils ne pose aucun problème.',
1
FROM actualites a
WHERE a.categorie_id = 9
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📡 WiFi 7 tri-bande',
E'Le WiFi 7 offre des débits théoriques de 30 Gbps. La latence ultra-faible révolutionne le cloud gaming à domicile. La couverture améliorée élimine les zones mortes.',
2
FROM actualites a
WHERE a.categorie_id = 9
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🏠 Domotique et services',
E'L''intégration des protocoles domotiques simplifie la maison connectée. Les services de divertissement sont accessibles directement. La sécurité réseau protège tous les appareils du foyer.',
3
FROM actualites a
WHERE a.categorie_id = 9
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- CAMERA (categorie_id = 10)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📷 Capteur et optique de pointe',
E'Le capteur nouvelle génération capture plus de lumière et de détails. La plage dynamique étendue préserve les hautes lumières et les ombres. L''optique optimisée minimise les aberrations.',
1
FROM actualites a
WHERE a.categorie_id = 10
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎬 Vidéo professionnelle',
E'L''enregistrement 8K interne ouvre de nouvelles possibilités créatives. Les profils colorimétriques log offrent une flexibilité en post-production. La stabilisation optique élimine les tremblements.',
2
FROM actualites a
WHERE a.categorie_id = 10
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎯 Autofocus intelligent',
E'La détection des sujets par IA suit les yeux avec une précision remarquable. Le tracking prédictif anticipe les mouvements. Même les sujets rapides restent parfaitement nets.',
3
FROM actualites a
WHERE a.categorie_id = 10
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- ECRAN-TV (categorie_id = 12)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📺 Qualité d''image époustouflante',
E'La technologie d''affichage de nouvelle génération offre des noirs parfaits et des couleurs éclatantes. La luminosité HDR atteint des pics impressionnants. Chaque image est un spectacle visuel.',
1
FROM actualites a
WHERE a.categorie_id = 12
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎮 Mode gaming optimisé',
E'La latence d''entrée minimale garantit une réactivité parfaite pour le gaming. Le taux de rafraîchissement élevé assure une fluidité exemplaire. Les technologies VRR éliminent le tearing.',
2
FROM actualites a
WHERE a.categorie_id = 12
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🔊 Son et smart TV',
E'Le système audio intégré offre une expérience immersive sans barre de son. L''interface smart TV donne accès à toutes les plateformes de streaming. La reconnaissance vocale simplifie la navigation.',
3
FROM actualites a
WHERE a.categorie_id = 12
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- IMPRIMANTE-3D (categorie_id = 13)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '⚡ Vitesse d''impression record',
E'La nouvelle génération d''imprimantes atteint des vitesses jamais vues. Les temps d''impression se divisent par deux ou plus. La productivité des makers explose.',
1
FROM actualites a
WHERE a.categorie_id = 13
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎯 Précision dimensionnelle',
E'Le système de nivellement automatique garantit une première couche parfaite. La précision XY atteint des résolutions submillimétriques. Les détails fins se reproduisent fidèlement.',
2
FROM actualites a
WHERE a.categorie_id = 13
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🌐 Connectivité et monitoring',
E'Le WiFi intégré permet les uploads depuis n''importe quel appareil. Les caméras surveillent l''impression en temps réel. Les notifications alertent en cas de problème.',
3
FROM actualites a
WHERE a.categorie_id = 13
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- PERIPHERIQUES (categorie_id = 14)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '⌨️ Ergonomie et confort',
E'Le design ergonomique réduit la fatigue lors des longues sessions. Les matériaux premium offrent une sensation agréable au toucher. Chaque détail est pensé pour le confort.',
1
FROM actualites a
WHERE a.categorie_id = 14
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎯 Précision professionnelle',
E'Les capteurs de nouvelle génération offrent un tracking ultra-précis. La personnalisation des paramètres s''adapte à chaque usage. Les performances satisfont les professionnels les plus exigeants.',
2
FROM actualites a
WHERE a.categorie_id = 14
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🔋 Sans-fil et autonomie',
E'La connectivité sans fil offre une liberté totale de mouvement. L''autonomie exceptionnelle permet des jours d''utilisation. La charge rapide garantit de ne jamais rester à court.',
3
FROM actualites a
WHERE a.categorie_id = 14
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- DRONE (categorie_id = 2)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🚁 Stabilité et maniabilité',
E'Le système de stabilisation avancé garantit des images fluides même par vent fort. Les capteurs d''obstacles à 360° assurent une sécurité maximale. Le pilotage devient accessible à tous.',
1
FROM actualites a
WHERE a.categorie_id = 2
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📹 Caméra aérienne professionnelle',
E'Le capteur de grande taille capture des images d''une qualité remarquable. L''enregistrement 6K offre une flexibilité en post-production. Les profils colorimétriques pro satisfont les exigences cinéma.',
2
FROM actualites a
WHERE a.categorie_id = 2
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🔋 Autonomie et portée',
E'L''autonomie de vol atteint des durées record pour cette catégorie. La portée de transmission HD permet des vols étendus. Le retour automatique garantit la récupération du drone.',
3
FROM actualites a
WHERE a.categorie_id = 2
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- TABLETTE (categorie_id = 5)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📱 Écran immersif',
E'La dalle de nouvelle génération offre des couleurs précises et une fluidité exemplaire. Le format optimisé convient parfaitement à la productivité et au divertissement. La luminosité élevée assure une lisibilité en toutes conditions.',
1
FROM actualites a
WHERE a.categorie_id = 5
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '✏️ Stylet et créativité',
E'Le stylet offre une latence imperceptible pour une écriture naturelle. La sensibilité à la pression permet des nuances dans les traits. Les créatifs trouvent un outil puissant pour leur art.',
2
FROM actualites a
WHERE a.categorie_id = 5
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '💻 Productivité mobile',
E'Le mode bureau transforme la tablette en véritable ordinateur. La connectivité étendue permet de brancher tous les périphériques. L''autonomie permet une journée complète de travail.',
3
FROM actualites a
WHERE a.categorie_id = 5
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- TABLEAU-INTERACTIF (categorie_id = 15)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎓 Collaboration pédagogique',
E'L''écran géant interactif transforme les réunions et les cours. Le multitouch permet à plusieurs personnes d''interagir simultanément. L''engagement des participants augmente significativement.',
1
FROM actualites a
WHERE a.categorie_id = 15
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '✍️ Annotation et partage',
E'Les outils d''annotation permettent de marquer n''importe quel contenu. Le partage en temps réel connecte les participants distants. Les sessions sont enregistrées pour révision ultérieure.',
2
FROM actualites a
WHERE a.categorie_id = 15
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🔌 Connectivité entreprise',
E'L''intégration avec les suites bureautiques est transparente. La visioconférence fonctionne nativement avec les plateformes courantes. La gestion centralisée simplifie le déploiement.',
3
FROM actualites a
WHERE a.categorie_id = 15
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- =====================================================
-- VIDEO-PROJECTEUR (categorie_id = 16)
-- =====================================================

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '🎬 Qualité cinéma à domicile',
E'La technologie de projection offre des images d''une qualité exceptionnelle. Le contraste élevé et les couleurs précises rivalisent avec les salles de cinéma. L''expérience home cinema atteint un nouveau niveau.',
1
FROM actualites a
WHERE a.categorie_id = 16
AND NOT EXISTS (SELECT 1 FROM actualites_sections s WHERE s.actualite_id = a.id);

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '💡 Luminosité et polyvalence',
E'La luminosité élevée permet une utilisation même en environnement éclairé. Les corrections automatiques s''adaptent à toutes les surfaces. La mise au point et le keystone sont ajustés automatiquement.',
2
FROM actualites a
WHERE a.categorie_id = 16
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 1;

INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre)
SELECT a.id, '📱 Smart et connecté',
E'Le système smart intégré donne accès aux applications de streaming. La connectivité sans fil simplifie les présentations. L''audio intégré offre une solution tout-en-un.',
3
FROM actualites a
WHERE a.categorie_id = 16
AND (SELECT COUNT(*) FROM actualites_sections s WHERE s.actualite_id = a.id) = 2;

-- Vérification finale
SELECT c.nom as categorie, COUNT(s.id) as nb_sections
FROM actualites a
LEFT JOIN categories c ON a.categorie_id = c.id
LEFT JOIN actualites_sections s ON a.id = s.actualite_id
GROUP BY c.nom
ORDER BY c.nom;
