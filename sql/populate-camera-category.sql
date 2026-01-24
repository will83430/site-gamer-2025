-- Remplir correctement la catégorie camera (id=10) avec des donnees completes
SET client_encoding = 'UTF8';
BEGIN;

-- 1. Nettoyer les donnees par defaut
DELETE FROM predictions WHERE categorie_id = 10;
DELETE FROM marche WHERE categorie_id = 10;
DELETE FROM technologies WHERE categorie_id = 10;

-- 2. Ajouter les PREDICTIONS pour camera (2026-2030)
INSERT INTO predictions (annee, titre, description, icone, probabilite, categorie_id) VALUES
  (2026, 'Capteurs 200MP standard', 'Les capteurs de 200MP deviennent la norme sur les téléphones haut de gamme.', 'eye', 75, 10),
  (2027, 'Zoom optique 10x', 'Le zoom optique sans perte atteint 10x sur les smartphones premium.', 'zoom', 60, 10),
  (2028, 'IA génération photo', 'L''IA génère automatiquement les meilleures compositions et retouches.', 'brain', 70, 10),
  (2029, 'Capture vidéo 8K 60fps', 'La vidéo 8K en 60fps devient accessible sur les appareils grand public.', '8k', 55, 10),
  (2030, 'Capteurs holographiques', 'Les premiers capteurs holographiques permettent la capture 3D native.', 'hologram', 35, 10);

-- 3. Ajouter le MARCHE pour camera
INSERT INTO marche (label, valeur, tendance, icone, categorie_id) VALUES
  ('Marché mondial des caméras 2025', '12.8B€', 'up', 'money', 10),
  ('Caméras professionnelles vendues', '2.1M', 'up', 'camera', 10),
  ('Caméras mirrorless', '62%', 'up', 'phone', 10),
  ('Caméras DSLR', '38%', 'down', 'camera', 10),
  ('Accessoires photo', '4.2B€', 'up', 'trophy', 10),
  ('Leader du marché', 'Sony', 'stable', 'trophy', 10);

-- 4. Ajouter les TECHNOLOGIES pour camera
INSERT INTO technologies (nom, description, icone, taux_adoption, categorie_id) VALUES
  ('Capteur full-frame', 'Capteurs 35mm pour une qualité d''image supérieure.', 'chip', 85, 10),
  ('Autofocus intelligent', 'Suivi oculaire et détection d''objets par IA.', 'eye', 80, 10),
  ('Stabilisation optique', 'OIS pour réduire le bougé et améliorer les vidéos.', 'droplet', 75, 10),
  ('Enregistrement RAW', 'Capture en format RAW pour plus de contrôle en post-production.', 'file', 70, 10);

COMMIT;

-- Verifier les donnees
SELECT 'predictions' as section, COUNT(*) as rows FROM predictions WHERE categorie_id = 10
UNION ALL
SELECT 'marche', COUNT(*) FROM marche WHERE categorie_id = 10
UNION ALL
SELECT 'technologies', COUNT(*) FROM technologies WHERE categorie_id = 10;
