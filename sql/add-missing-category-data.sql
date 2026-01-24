-- Ajouter des predictions pour toutes les categories manquantes
INSERT INTO predictions (annee, titre, description, icone, probabilite, categorie_id) 
SELECT 2026, 'Innovation technique', 'Nouvelles technologies révolutionnaires à venir.', 'sparkle', 50, 10
WHERE NOT EXISTS (SELECT 1 FROM predictions WHERE categorie_id = 10);

-- Ajouter marche pour category 10
INSERT INTO marche (label, valeur, tendance, icone, categorie_id)
SELECT 'Marché en croissance', '2B€', 'up', 'money', 10
WHERE NOT EXISTS (SELECT 1 FROM marche WHERE categorie_id = 10);

-- Ajouter technologies pour category 10
INSERT INTO technologies (nom, description, icone, taux_adoption, categorie_id)
SELECT 'Technologies avancées', 'Nouvelles technologies émergentes.', 'sparkle', 50, 10
WHERE NOT EXISTS (SELECT 1 FROM technologies WHERE categorie_id = 10);

-- Vérifier les données complètes
SELECT 'predictions' as table_name, COUNT(*) as total_rows FROM predictions
UNION ALL
SELECT 'marche', COUNT(*) FROM marche
UNION ALL
SELECT 'technologies', COUNT(*) FROM technologies;
