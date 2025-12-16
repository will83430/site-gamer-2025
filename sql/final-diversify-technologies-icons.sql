-- Finir la diversification des derniers "sparkle"
BEGIN;

UPDATE technologies SET icone = 'zap' WHERE id = 7;      -- Recharge ultra-rapide
UPDATE technologies SET icone = 'quantum' WHERE id = 10; -- SSD Quantique
UPDATE technologies SET icone = 'chip' WHERE id = 34;    -- SSD ultra-rapide
UPDATE technologies SET icone = 'cpu' WHERE id = 35;     -- Ray tracing temps réel
UPDATE technologies SET icone = 'pen' WHERE id = 37;     -- Stylet intelligent
UPDATE technologies SET icone = 'hand' WHERE id = 53;    -- Retour haptique avancé
UPDATE technologies SET icone = 'signal' WHERE id = 54;  -- Wi-Fi 7 intégré
UPDATE technologies SET icone = 'eye' WHERE id = 58;     -- Dolby Vision IQ
UPDATE technologies SET icone = 'printer' WHERE id = 59; -- Impression multi-matériaux
UPDATE technologies SET icone = 'eye' WHERE id = 64;     -- Capteurs optiques avancés

COMMIT;

-- Verifier le resultat final
SELECT icone, COUNT(*) as nb FROM technologies GROUP BY icone ORDER BY nb DESC;
