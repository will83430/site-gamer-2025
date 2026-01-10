-- Migration : Ajout de la colonne ordre pour gérer l'ordre d'affichage
-- Date : 2026-01-06

-- 1. Actualités
ALTER TABLE actualites ADD COLUMN IF NOT EXISTS ordre INTEGER;

-- Initialiser avec des valeurs séquentielles basées sur date_publication DESC
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY categorie_id ORDER BY date_publication DESC, id DESC) as rn
  FROM actualites
)
UPDATE actualites 
SET ordre = numbered.rn
FROM numbered
WHERE actualites.id = numbered.id;

-- 2. Technologies
ALTER TABLE technologies ADD COLUMN IF NOT EXISTS ordre INTEGER;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY categorie_id ORDER BY id ASC) as rn
  FROM technologies
)
UPDATE technologies 
SET ordre = numbered.rn
FROM numbered
WHERE technologies.id = numbered.id;

-- 3. Marché
ALTER TABLE marche ADD COLUMN IF NOT EXISTS ordre INTEGER;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY categorie_id ORDER BY id ASC) as rn
  FROM marche
)
UPDATE marche 
SET ordre = numbered.rn
FROM numbered
WHERE marche.id = numbered.id;

-- 4. Insights
ALTER TABLE insights ADD COLUMN IF NOT EXISTS ordre INTEGER;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY categorie_id ORDER BY id ASC) as rn
  FROM insights
)
UPDATE insights 
SET ordre = numbered.rn
FROM numbered
WHERE insights.id = numbered.id;

-- 5. Prédictions
ALTER TABLE predictions ADD COLUMN IF NOT EXISTS ordre INTEGER;

WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY categorie_id ORDER BY annee ASC, id ASC) as rn
  FROM predictions
)
UPDATE predictions 
SET ordre = numbered.rn
FROM numbered
WHERE predictions.id = numbered.id;

-- Vérification
SELECT 'actualites' as table_name, COUNT(*) as total, MIN(ordre) as min_ordre, MAX(ordre) as max_ordre FROM actualites
UNION ALL
SELECT 'technologies', COUNT(*), MIN(ordre), MAX(ordre) FROM technologies
UNION ALL
SELECT 'marche', COUNT(*), MIN(ordre), MAX(ordre) FROM marche
UNION ALL
SELECT 'insights', COUNT(*), MIN(ordre), MAX(ordre) FROM insights
UNION ALL
SELECT 'predictions', COUNT(*), MIN(ordre), MAX(ordre) FROM predictions;
