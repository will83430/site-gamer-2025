-- Script de correction des incohérences dans la base de données
-- Exécuter avec: psql -U postgres -d gamer_2025 -f scripts/fix-database-inconsistencies.sql

-- 1️⃣ Standardiser les catégories en MAJUSCULES
UPDATE produits SET categorie = 'SMARTPHONE' WHERE categorie = 'smartphone';
UPDATE produits SET categorie = 'TABLETTE' WHERE categorie = 'tablette';
UPDATE produits SET categorie = 'CONSOLE' WHERE categorie = 'console';
UPDATE produits SET categorie = 'DRONE' WHERE categorie = 'drone';
UPDATE produits SET categorie = 'CASQUE VR' WHERE categorie = 'casque-vr';
UPDATE produits SET categorie = 'PC GAMING' WHERE categorie = 'pc-gaming';
UPDATE produits SET categorie = 'MONTRE CONNECTEE' WHERE categorie = 'montre-connectee';
UPDATE produits SET categorie = 'CASQUE AUDIO' WHERE categorie = 'casque-audio';
UPDATE produits SET categorie = 'ECRAN TV' WHERE categorie = 'ecran-tv';
UPDATE produits SET categorie = 'IMPRIMANTE 3D' WHERE categorie = 'imprimante-3d';
UPDATE produits SET categorie = 'PERIPHERIQUES' WHERE categorie = 'peripheriques';

-- 2️⃣ Standardiser les chemins d'images (enlever /assets/images/ si présent)
UPDATE produits SET image = REPLACE(image, '/assets/images/', '') WHERE image LIKE '/assets/images/%';

-- 3️⃣ Corriger les liens HTTP externes vers les fiches locales
UPDATE produits SET lien = 'fiches/smartphone/xiaomi-15-ultra.html' WHERE lien = 'https://www.mi.com';
UPDATE produits SET lien = 'fiches/console/lenovo-legion-go-s.html' WHERE lien = 'https://www.lenovo.com/legion';
UPDATE produits SET lien = 'fiches/drone/dji-neo-2.html' WHERE lien = 'https://www.dji.com';
UPDATE produits SET lien = 'fiches/casque-vr/meta-quest-3s.html' WHERE lien = 'https://www.meta.com/quest';
UPDATE produits SET lien = 'fiches/pc-gaming/msi-titan-18-hx.html' WHERE lien = 'https://www.msi.com';
UPDATE produits SET lien = 'fiches/tablette/oneplus-pad-2.html' WHERE lien = 'https://www.oneplus.com';
UPDATE produits SET lien = 'fiches/montre-connectee/huawei-watch-gt-5-pro.html' WHERE lien = 'https://consumer.huawei.com';
UPDATE produits SET lien = 'fiches/casque-audio/sennheiser-momentum-5.html' WHERE lien = 'https://www.sennheiser.com';
UPDATE produits SET lien = 'fiches/ecran-tv/samsung-qn900d-neo-qled-8k.html' WHERE lien = 'https://www.samsung.com';
UPDATE produits SET lien = 'fiches/camera/sony-a7-v.html' WHERE lien = 'https://www.sony.com';
UPDATE produits SET lien = 'fiches/imprimante-3d/bambu-lab-x1-carbon-combo.html' WHERE lien = 'https://www.bambulab.com';
UPDATE produits SET lien = 'fiches/peripheriques/razer-blackwidow-v4-pro-75-.html' WHERE lien = 'https://www.razer.com';

-- 4️⃣ Corriger les noms de fichiers avec espaces/majuscules
UPDATE produits SET lien = 'fiches/video-projecteur/valerion-vision-master-pro-2.html' WHERE lien = 'fiches/video-projecteur/Valerion Vision Master Pro 2.html';
UPDATE produits SET lien = 'fiches/video-projecteur/epson-eh-ls12000b.html' WHERE lien = 'fiches/video-projecteur/Epson EH-LS12000B.html';

-- 5️⃣ Corriger les erreurs de noms dans les liens existants (si il y en a)
UPDATE produits SET lien = 'fiches/casque-vr/apple-vision-pro.html' WHERE lien = 'fiches/casque-vr/apple-vison-pro.html';

-- 6️⃣ Vérification finale - afficher les données corrigées
SELECT 
    categorie,
    image,
    lien,
    COUNT(*) as count
FROM produits 
GROUP BY categorie, image, lien
ORDER BY categorie, lien;

-- 7️⃣ Statistiques finales
SELECT 
    'Total produits' as stat,
    COUNT(*) as valeur
FROM produits
UNION ALL
SELECT 
    'Catégories distinctes' as stat,
    COUNT(DISTINCT categorie) as valeur
FROM produits
UNION ALL
SELECT 
    'Liens HTTP externes restants' as stat,
    COUNT(*) as valeur
FROM produits 
WHERE lien LIKE 'http%'
UNION ALL
SELECT 
    'Images avec chemin complet' as stat,
    COUNT(*) as valeur
FROM produits 
WHERE image LIKE '/assets/images/%';