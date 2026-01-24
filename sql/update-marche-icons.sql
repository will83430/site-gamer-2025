-- Migration des icones de la table marche vers des noms courts
BEGIN;

-- Mise a jour par ID pour eviter les problemes d'encodage emojis
UPDATE marche SET icone = 'money' WHERE id IN (1, 5, 7, 22, 38, 43, 47, 51, 55);
UPDATE marche SET icone = 'drone' WHERE id = 2;
UPDATE marche SET icone = 'building' WHERE id = 3;
UPDATE marche SET icone = 'home' WHERE id = 4;
UPDATE marche SET icone = 'gamepad' WHERE id IN (6, 33, 34, 35);
UPDATE marche SET icone = 'phone' WHERE id IN (8, 39, 46);
UPDATE marche SET icone = 'laptop' WHERE id = 11;
UPDATE marche SET icone = 'phone' WHERE id = 12;
UPDATE marche SET icone = 'apple' WHERE id IN (20, 42, 45, 50);
UPDATE marche SET icone = 'android' WHERE id IN (23, 41);
UPDATE marche SET icone = 'signal' WHERE id IN (25, 58);
UPDATE marche SET icone = 'money' WHERE id = 26;
UPDATE marche SET icone = 'trophy' WHERE id IN (27, 49, 53, 57);
UPDATE marche SET icone = 'tv' WHERE id = 28;
UPDATE marche SET icone = 'vr-headset' WHERE id = 29;
UPDATE marche SET icone = 'package' WHERE id IN (30, 56);
UPDATE marche SET icone = 'flag' WHERE id = 31;
UPDATE marche SET icone = 'wheat' WHERE id = 32;
UPDATE marche SET icone = 'cloud' WHERE id = 36;
UPDATE marche SET icone = 'list' WHERE id = 37;
UPDATE marche SET icone = 'apple' WHERE id = 40;
UPDATE marche SET icone = 'watch' WHERE id = 44;
UPDATE marche SET icone = 'headphones' WHERE id = 48;
UPDATE marche SET icone = 'server' WHERE id = 52;
UPDATE marche SET icone = 'link' WHERE id = 54;
UPDATE marche SET icone = 'globe' WHERE id IN (59, 63, 67, 71, 75, 79);
UPDATE marche SET icone = 'france' WHERE id IN (60, 66, 70, 74, 78, 82);
UPDATE marche SET icone = 'euro' WHERE id IN (61, 64, 68);
UPDATE marche SET icone = 'meta' WHERE id = 62;
UPDATE marche SET icone = 'lg' WHERE id = 65;
UPDATE marche SET icone = 'creality' WHERE id = 69;
UPDATE marche SET icone = 'mouse' WHERE id = 73;
UPDATE marche SET icone = 'chart' WHERE id IN (77, 81);
UPDATE marche SET icone = 'school' WHERE id = 78;
UPDATE marche SET icone = 'dollar' WHERE id IN (72, 76, 80);
UPDATE marche SET icone = 'money' WHERE id = 19;

COMMIT;

-- Verifier le resultat
SELECT COUNT(*), icone FROM marche GROUP BY icone ORDER BY icone;
