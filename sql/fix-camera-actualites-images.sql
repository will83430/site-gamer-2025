-- Corriger les images des actualités camera avec les vrais fichiers
SET client_encoding = 'UTF8';
BEGIN;

UPDATE actualites SET image = 'canon-eos-r6-mark-iii.jpg' WHERE id = 67 AND categorie_id = 10;
UPDATE actualites SET image = 'canon-eos-r6-mark-ii.jpg' WHERE id = 68 AND categorie_id = 10;
UPDATE actualites SET image = 'insta360.jpg' WHERE id = 69 AND categorie_id = 10;
UPDATE actualites SET image = 'samsung-qdoled-2025.jpg' WHERE id = 70 AND categorie_id = 10;
UPDATE actualites SET image = 'canon-eos-r6-mark-iii.jpg' WHERE id = 71 AND categorie_id = 10;
UPDATE actualites SET image = 'ia-photo.jpg' WHERE id = 72 AND categorie_id = 10;

COMMIT;

SELECT id, titre, image FROM actualites WHERE categorie_id = 10 ORDER BY id;
