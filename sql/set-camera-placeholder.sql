SET client_encoding = 'UTF8';
BEGIN;
UPDATE actualites SET image = 'placeholder.png', video = NULL WHERE categorie_id = 10;
COMMIT;
SELECT id, titre, image, video FROM actualites WHERE categorie_id = 10;
