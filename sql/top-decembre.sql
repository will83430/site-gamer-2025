-- top-decembre.sql
-- Sauvegarde rapide puis activation de la sélection "Top de Décembre"

-- 1) Sauvegarde rapide (table temporaire)
CREATE TABLE IF NOT EXISTS produits_backup_decembre AS
SELECT * FROM produits;

-- 2) Réinitialiser tous les flags top_du_mois
BEGIN;
UPDATE produits SET top_du_mois = FALSE;

-- 3) Mettre en avant la sélection recommandée pour Décembre
-- Adapte les noms ('nom' champ) si nécessaire
UPDATE produits
SET top_du_mois = TRUE
WHERE nom IN (
  'sony-wh-1000xm5',
  'garmin-fenix-8',
  'google-pixel-10',
  'asus-rog-strix-g18',
  'asus-rog-ally-x',
  'dji-mini-5-pro',
  'creality-halot-mage-s-14k',
  'lg-oled65-g5',
  'epson-eh-ls12000b',
  'dell-poweredge-r760',
  'steelseries-apex-pro-tkl-gen-3',
  'corsair-one-i500'
);

COMMIT;

-- 4) Vérification
SELECT id, nom, categorie, prix, top_du_mois
FROM produits
WHERE top_du_mois = TRUE
ORDER BY categorie, nom;
