-- Ajout de la colonne 'lien' à la table actualites
-- Cette colonne stockera le chemin vers les fiches tendances générées

-- Vérifier si la colonne existe déjà (pour éviter les erreurs)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'actualites' 
        AND column_name = 'lien'
    ) THEN
        ALTER TABLE actualites ADD COLUMN lien TEXT;
        RAISE NOTICE 'Colonne "lien" ajoutée à la table actualites';
    ELSE
        RAISE NOTICE 'Colonne "lien" existe déjà';
    END IF;
END $$;

-- Vérifier le résultat
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'actualites' 
AND column_name = 'lien';
