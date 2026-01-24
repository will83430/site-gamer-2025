-- Migration des icones de la table technologies vers des noms courts
BEGIN;

-- Mise a jour par categories et types communs
-- Categorie 1: PC Gaming
UPDATE technologies SET icone = 'cpu' WHERE nom LIKE '%Ray Tracing%' OR nom LIKE '%RTX%';
UPDATE technologies SET icone = 'brain' WHERE nom LIKE '%IA%' OR nom LIKE '%AI%';
UPDATE technologies SET icone = 'zap' WHERE nom LIKE '%DLSS%' OR nom LIKE '%FSR%';
UPDATE technologies SET icone = 'monitor' WHERE nom LIKE '%4K%' OR nom LIKE '%8K%';
UPDATE technologies SET icone = 'refresh' WHERE nom LIKE '%Hz%';

-- Categorie 2: Drones
UPDATE technologies SET icone = 'camera' WHERE nom LIKE '%Camera%' OR nom LIKE '%photo%';
UPDATE technologies SET icone = 'battery' WHERE nom LIKE '%Autonomie%' OR nom LIKE '%batterie%';
UPDATE technologies SET icone = 'wind' WHERE nom LIKE '%vent%' OR nom LIKE '%stabilisation%';
UPDATE technologies SET icone = 'satellite' WHERE nom LIKE '%GPS%' OR nom LIKE '%satellite%';
UPDATE technologies SET icone = 'eye' WHERE nom LIKE '%vision%' OR nom LIKE '%detection%';

-- Categorie 3: Smartphones
UPDATE technologies SET icone = 'phone' WHERE nom LIKE '%5G%' OR nom LIKE '%6G%';
UPDATE technologies SET icone = 'camera' WHERE nom LIKE '%Photo%' OR nom LIKE '%Camera%';
UPDATE technologies SET icone = 'chip' WHERE nom LIKE '%Puce%' OR nom LIKE '%processeur%';
UPDATE technologies SET icone = 'battery' WHERE nom LIKE '%Charge%' OR nom LIKE '%batterie%';
UPDATE technologies SET icone = 'shield' WHERE nom LIKE '%securite%' OR nom LIKE '%protection%';

-- Categorie 4: Consoles
UPDATE technologies SET icone = 'gamepad' WHERE nom LIKE '%manette%' OR nom LIKE '%controller%';
UPDATE technologies SET icone = 'cloud' WHERE nom LIKE '%Cloud%' OR nom LIKE '%streaming%';
UPDATE technologies SET icone = 'vr-headset' WHERE nom LIKE '%VR%' OR nom LIKE '%realite%';

-- Categorie 5: Tablettes
UPDATE technologies SET icone = 'tablet' WHERE nom LIKE '%ecran%' OR nom LIKE '%display%';
UPDATE technologies SET icone = 'pen' WHERE nom LIKE '%stylet%' OR nom LIKE '%pencil%';

-- Categorie 6: Casques Audio
UPDATE technologies SET icone = 'headphones' WHERE nom LIKE '%audio%' OR nom LIKE '%son%';
UPDATE technologies SET icone = 'sound-wave' WHERE nom LIKE '%ANC%' OR nom LIKE '%reduction%';
UPDATE technologies SET icone = 'bluetooth' WHERE nom LIKE '%Bluetooth%' OR nom LIKE '%sans fil%';

-- Categorie 7: Montres connectees
UPDATE technologies SET icone = 'watch' WHERE nom LIKE '%ecran%';
UPDATE technologies SET icone = 'heartbeat' WHERE nom LIKE '%sante%' OR nom LIKE '%cardio%';
UPDATE technologies SET icone = 'battery' WHERE nom LIKE '%autonomie%';

-- Categorie 11: Casques VR
UPDATE technologies SET icone = 'vr-headset' WHERE nom LIKE '%resolution%' OR nom LIKE '%FOV%';
UPDATE technologies SET icone = 'hand' WHERE nom LIKE '%tracking%' OR nom LIKE '%suivi%';

-- Categorie 12: Ecrans TV
UPDATE technologies SET icone = 'tv' WHERE nom LIKE '%OLED%' OR nom LIKE '%QLED%';
UPDATE technologies SET icone = '8k' WHERE nom LIKE '%8K%';
UPDATE technologies SET icone = 'refresh' WHERE nom LIKE '%Hz%';

-- Categorie 13: Imprimantes 3D
UPDATE technologies SET icone = 'printer' WHERE nom LIKE '%impression%';
UPDATE technologies SET icone = 'droplet' WHERE nom LIKE '%resine%';

-- Par defaut si aucune correspondance ou encore des emojis
UPDATE technologies SET icone = 'sparkle' WHERE icone IS NULL;
UPDATE technologies SET icone = 'sparkle' WHERE LENGTH(icone) > 10;
UPDATE technologies SET icone = 'sparkle' WHERE icone ~ '[^\x00-\x7F]'; -- Caracteres non-ASCII

COMMIT;

-- Verifier le resultat
SELECT categorie_id, COUNT(*) as nb FROM technologies GROUP BY categorie_id ORDER BY categorie_id;
