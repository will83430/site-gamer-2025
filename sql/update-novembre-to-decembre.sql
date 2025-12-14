-- Script de mise à jour : Novembre → Décembre
-- Date: 14 décembre 2025

BEGIN;

-- Mettre à jour tous les textes contenant "novembre" ou "Novembre" dans la table produits
UPDATE produits 
SET description = REPLACE(REPLACE(description, 'novembre', 'décembre'), 'Novembre', 'Décembre')
WHERE description ILIKE '%novembre%';

UPDATE produits 
SET titre_affiche = REPLACE(REPLACE(titre_affiche, 'novembre', 'décembre'), 'Novembre', 'Décembre')
WHERE titre_affiche ILIKE '%novembre%';

-- Mettre à jour les tableaux text[] pour donnees_fiche et fonctionnalites_avancees
-- Convertir en texte, remplacer, puis reconvertir en tableau
UPDATE produits 
SET donnees_fiche = string_to_array(
    REPLACE(REPLACE(array_to_string(donnees_fiche, '||', ''), 'novembre', 'décembre'), 'Novembre', 'Décembre'),
    '||'
)
WHERE array_to_string(donnees_fiche, '||', '') ILIKE '%novembre%';

UPDATE produits 
SET fonctionnalites_avancees = string_to_array(
    REPLACE(REPLACE(array_to_string(fonctionnalites_avancees, '||', ''), 'novembre', 'décembre'), 'Novembre', 'Décembre'),
    '||'
)
WHERE array_to_string(fonctionnalites_avancees, '||', '') ILIKE '%novembre%';

-- Note: Les tables de tendances (actualites, technologies, etc.) seront mises à jour si nécessaire
-- Pour l'instant, on se concentre sur la table produits qui contient les données principales

COMMIT;

-- Afficher un résumé
SELECT 
    'produits' as table_name,
    COUNT(*) as rows_with_decembre
FROM produits 
WHERE description ILIKE '%décembre%' 
   OR titre_affiche ILIKE '%décembre%'
   OR donnees_fiche::text ILIKE '%décembre%'
   OR fonctionnalites_avancees::text ILIKE '%décembre%';
