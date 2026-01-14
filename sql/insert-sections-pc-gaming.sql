-- Sections pour les articles PC Gaming

-- Article 102: AMD Radeon RX 9900 XT rivalise enfin avec NVIDIA
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(102, '🎮 La réponse d''AMD à NVIDIA', 
E'AMD frappe fort avec la Radeon RX 9900 XT, première carte du constructeur à véritablement rivaliser avec les GeForce RTX au sommet. Basée sur l''architecture RDNA 4, elle embarque 96 compute units et 16GB de GDDR7. Les performances en rasterisation dépassent même la RTX 5090 de 5 à 10% selon les jeux, tandis que le ray tracing accuse encore un léger retard de 15%.',
1),
(102, '⚡ Performances et technologies',
E'**Ray Tracing** : Nouvelle génération d''unités RT avec performances doublées vs RDNA 3\n\n**FSR 4.0** : L''upscaling d''AMD intègre enfin la génération de frames par IA\n\n**Efficacité** : Consommation de 420W contre 600W pour la RTX 5090',
2),
(102, '💰 Positionnement stratégique',
E'Le prix de 1 499$ positionne la RX 9900 XT 500$ sous la RTX 5090. AMD mise sur un rapport performance/prix imbattable pour séduire les joueurs exigeants mais sensibles au budget. Cette stratégie pourrait enfin permettre au constructeur de regagner des parts de marché significatives sur le segment premium.',
3),
(102, '📊 Disponibilité et impact',
E'La carte sera disponible dès le 15 février 2026. Les stocks annoncés sont conséquents, AMD ayant retenu les leçons des lancements précédents. Cette génération marque un tournant : AMD redevient un concurrent crédible face à NVIDIA sur tous les segments, y compris le haut de gamme gaming.',
4);

-- Article 103: Intel Arc B770 : la surprise du CES
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(103, '🚀 Intel entre dans la course',
E'Avec la série Arc Battlemage, Intel prouve que son engagement dans le GPU gaming est sérieux. L''Arc B770 surprend par ses performances solides en milieu de gamme : équivalent RTX 4070 Ti en rasterisation pour 499$. L''architecture Xe2-HPG apporte +60% de performances par watt vs la génération précédente.',
1),
(103, '🎯 Technologies embarquées',
E'**XeSS 2.0** : Upscaling IA amélioré comparable au DLSS 3.5\n\n**Ray Tracing** : Unités RT de 2e génération enfin performantes\n\n**XMX Cores** : 256 cœurs dédiés à l''IA pour l''upscaling et la génération de frames',
2),
(103, '💡 Atouts pour les créateurs',
E'Intel mise sur la polyvalence : les encodeurs AV1 intégrés surpassent la concurrence, avec support du 8K 60fps. Les 16GB de VRAM en font une carte idéale pour le montage vidéo et le rendu 3D léger. Les pilotes ont énormément progressé, avec compatibilité native de 98% des jeux récents.',
3),
(103, '🌟 Une troisième voie crédible',
E'Disponible en mars 2026, l''Arc B770 offre une alternative sérieuse au duopole NVIDIA/AMD. Intel prouve sa capacité à innover et à proposer un rapport qualité/prix compétitif. La vraie bataille se jouera sur la stabilité logicielle et le support long terme.',
4);

-- Article 104: AMD Ryzen 9 9950X3D : 24 cœurs + V-Cache 3D
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(104, '🔥 Le CPU gaming ultime',
E'AMD repousse les limites avec le Ryzen 9 9950X3D : 24 cœurs Zen 5 (16P + 8E) cadencés jusqu''à 5.7 GHz, surmontés de 192MB de V-Cache 3D. Cette combinaison unique offre +35% de performances gaming vs le 7950X3D tout en conservant d''excellentes capacités multi-thread pour la création de contenu.',
1),
(104, '⚡ Performances record',
E'**Gaming 1440p** : +25% vs Intel Core Ultra 9 285K, +40% vs 7950X3D\n\n**1% Low FPS** : +50% grâce au V-Cache, expérience ultra-fluide garantie\n\n**Productivité** : Performances égales au 9950X en multi-thread malgré le V-Cache',
2),
(104, '🎮 Technologies de pointe',
E'La technologie V-Cache 3D empile 64MB de cache L3 supplémentaire sur chaque CCD, réduisant drastiquement la latence mémoire. AMD a résolu les problèmes de dissipation thermique avec un nouveau système de contact optimisé. Le TDP reste à 170W malgré la puissance brute.',
3),
(104, '💎 Le choix des enthusiasts',
E'Prévu pour avril 2026 au prix de 799$, le 9950X3D s''impose comme LE processeur pour les joueurs qui ne veulent aucun compromis. Compatible AM5, il s''installe sur les cartes mères existantes avec simple mise à jour BIOS. AMD domine le marché gaming CPU avec 65% de parts de marché.',
4);

-- Article 105: SSD PCIe 6.0 : 20 Go/s en lecture
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(105, '⚡ La révolution du stockage',
E'Les premiers SSD PCIe 6.0 débarquent avec des débits hallucinants : 20 Go/s en lecture séquentielle et 18 Go/s en écriture. Phison dévoile son contrôleur E31T qui exploite les 4 lignes PCIe 6.0 (128 GT/s) pour offrir 2.5x les performances des meilleurs PCIe 5.0 actuels.',
1),
(105, '🎯 Impact sur le gaming',
E'**Chargements** : Textures 8K et assets DirectStorage chargés instantanément\n\n**DirectStorage 2.0** : Décompression GPU avec 40% de gain de performance\n\n**Smart Access Storage** : Technologie AMD pour accès direct GPU aux données SSD',
2),
(105, '🔧 Spécifications techniques',
E'Capacités de 2TB à 8TB disponibles au lancement, avec NAND 3D TLC de dernière génération. Les contrôleurs intègrent 4GB de cache DRAM et 16GB de SLC cache dynamique. La technologie de refroidissement passive suffit grâce à l''efficacité énergétique du PCIe 6.0 : 0.5W par Go/s.',
3),
(105, '🚀 Démocratisation progressive',
E'Les premiers modèles arrivent en mai 2026 à partir de 349$ pour 2TB. Les cartes mères AM5 et LGA1851 de nouvelle génération supporteront nativement le PCIe 6.0. D''ici fin 2026, ces SSD deviendront la norme pour les configs haut de gamme, rendant obsolète le PCIe 4.0.',
4);

-- Article 106: Windows 12 Gaming Edition annoncé
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
(106, '🎮 Un Windows taillé pour le jeu',
E'Microsoft officialise Windows 12 Gaming Edition, version optimisée du système d''exploitation prévue pour juin 2026. Suppression de 40% des processus d''arrière-plan, nouvelle API DirectX 13, et intégration native de l''upscaling IA au niveau système. L''objectif : +15% de performances gaming moyennes vs Windows 11.',
1),
(106, '⚡ Optimisations majeures',
E'**Game Mode 2.0** : Allocation dynamique des ressources CPU/GPU par IA prédictive\n\n**DirectX 13** : Ray tracing path tracing full hardware, overhead réduit de 30%\n\n**Auto HDR+** : Calibration automatique et amélioration IA des jeux SDR',
2),
(106, '🔧 Interface Xbox Game Bar 3.0',
E'La nouvelle Game Bar fusionne avec l''écosystème Xbox : accès instant au Game Pass, capture vidéo AV1 sans perte de FPS, Discord natif, et monitoring avancé. Le mode Handheld optimise l''affichage et les contrôles pour Steam Deck et ROG Ally. L''interface s''adapte automatiquement au type d''appareil.',
3),
(106, '💰 Tarification et migration',
E'Windows 12 Gaming Edition sera proposé à 149$ en licence standalone. Mise à jour gratuite pour les détenteurs de Windows 11 Pro jusqu''au 31 décembre 2026. La version standard de Windows 12 sortira en septembre 2026 à 129$. Microsoft mise tout sur les gamers pour booster l''adoption.',
4);
