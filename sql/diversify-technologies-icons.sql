-- Diversifier les icones de la table technologies en remplacant les "sparkle" redondants
BEGIN;

-- Batteries et énergie
UPDATE technologies SET icone = 'battery' WHERE id IN (2);
UPDATE technologies SET icone = 'leaf' WHERE id IN (44);

-- Écrans et affichage
UPDATE technologies SET icone = 'fold' WHERE id IN (12);
UPDATE technologies SET icone = 'eye' WHERE id IN (52, 74);
UPDATE technologies SET icone = 'monitor' WHERE id IN (56);

-- Sécurité et biométrie
UPDATE technologies SET icone = 'shield' WHERE id IN (14, 49);

-- Drones et capteurs
UPDATE technologies SET icone = 'eye' WHERE id IN (25);
UPDATE technologies SET icone = 'network' WHERE id IN (27);

-- Son et audio
UPDATE technologies SET icone = 'sound-wave' WHERE id IN (39, 40);

-- Santé
UPDATE technologies SET icone = 'heartbeat' WHERE id IN (42);

-- Stockage et chip
UPDATE technologies SET icone = 'chip' WHERE id IN (43, 47);

-- Connectivité
UPDATE technologies SET icone = 'zap' WHERE id IN (48);
UPDATE technologies SET icone = 'signal' WHERE id IN (61);

-- Domotique
UPDATE technologies SET icone = 'home' WHERE id IN (50);

-- Refroidissement
UPDATE technologies SET icone = 'droplet' WHERE id IN (45);

-- Virtualisation
UPDATE technologies SET icone = 'cube' WHERE id IN (46);

-- VR/Immersion
UPDATE technologies SET icone = 'eye' WHERE id IN (26);

-- Imprimantes 3D
UPDATE technologies SET icone = 'refresh' WHERE id IN (60);

-- Claviers/Périphériques
UPDATE technologies SET icone = 'keyboard' WHERE id IN (65);
UPDATE technologies SET icone = 'mouse' WHERE id IN (63);
UPDATE technologies SET icone = 'zap' WHERE id IN (66);

-- Tableaux interactifs
UPDATE technologies SET icone = 'pen' WHERE id IN (67);
UPDATE technologies SET icone = 'hand' WHERE id IN (68);
UPDATE technologies SET icone = 'bluetooth' WHERE id IN (70);

-- Projecteurs
UPDATE technologies SET icone = 'refresh' WHERE id IN (72);
UPDATE technologies SET icone = 'signal' WHERE id IN (73);

COMMIT;

-- Verifier le resultat
SELECT icone, COUNT(*) as nb FROM technologies GROUP BY icone ORDER BY nb DESC;
