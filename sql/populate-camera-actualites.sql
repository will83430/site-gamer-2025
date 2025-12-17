-- Actualités pour la catégorie camera (id=10)
SET client_encoding = 'UTF8';
BEGIN;

-- Supprimer les anciennes actualités camera
DELETE FROM actualites WHERE categorie_id = 10;

-- Ajouter 6 actualités récentes pour camera
INSERT INTO actualites (titre, description, image, video, date_publication, tags, hot, categorie_id) VALUES
  (
    'Sony A7 V : La Révolution du Full-Frame',
    'Sony dévoile l''A7 V avec un capteur 61MP révolutionnaire, autofocus IA ultra-rapide et vidéo 8K. Un bond technologique majeur pour les photographes professionnels.',
    'sony-a7-v.jpg',
    NULL,
    '2025-12-10',
    '{Sony,Full-Frame,Mirrorless,8K}',
    true,
    10
  ),
  (
    'Canon EOS R6 Mark II : Performances Sportives',
    'Le nouveau Canon R6 Mark II repousse les limites avec 40fps en RAW, tracking IA pour les sports et wildlife. La référence pour l''action.',
    'canon-eos-r6-mark-ii.jpg',
    NULL,
    '2025-12-05',
    '{Canon,Sports,Autofocus,RAW}',
    true,
    10
  ),
  (
    'Insta360 X5 : Capture 360° en 12K',
    'La caméra 360° la plus avancée du marché avec capture 12K, stabilisation FlowState 2.0 et édition IA. L''avenir de la création immersive.',
    'insta360-x5.jpg',
    'https://www.youtube.com/watch?v=example360',
    '2025-11-28',
    '{Insta360,360°,12K,Stabilisation}',
    true,
    10
  ),
  (
    'Capteurs 200MP : La Nouvelle Norme en 2026',
    'Les capteurs 200MP s''imposent comme le nouveau standard des smartphones premium. Samsung et Sony en tête de course pour 2026.',
    'capteur-200mp.jpg',
    NULL,
    '2025-11-20',
    '{Capteurs,200MP,Smartphone,Innovation}',
    false,
    10
  ),
  (
    'Zoom Optique 10x Sans Perte : Percée Technologique',
    'Les nouvelles optiques périscopes permettent un zoom 10x sans perte de qualité. Une révolution pour la photographie mobile.',
    'zoom-10x.jpg',
    'https://www.youtube.com/watch?v=examplezoom',
    '2025-11-15',
    '{Zoom,Optique,Smartphone,Périscope}',
    false,
    10
  ),
  (
    'IA Générative Photo : L''Avenir de la Retouche',
    'L''intelligence artificielle génère désormais automatiquement les meilleures compositions et retouches. Adobe et Google en première ligne.',
    'ia-photo.jpg',
    NULL,
    '2025-11-10',
    '{IA,Retouche,Adobe,Google}',
    false,
    10
  );

COMMIT;

-- Vérifier les données
SELECT 
  id, 
  titre, 
  LEFT(description, 50) as description,
  image,
  video,
  date_publication,
  hot,
  categorie_id 
FROM actualites 
WHERE categorie_id = 10
ORDER BY date_publication DESC;
