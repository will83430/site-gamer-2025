-- Actualités Console Janvier 2026
-- Récupérer l'ID de la catégorie Console
DO $$
DECLARE
    console_id INTEGER;
    max_ordre INTEGER;
BEGIN
    -- Trouver l'ID de la catégorie Console
    SELECT id INTO console_id FROM categories WHERE LOWER(nom) = 'console';
    
    -- Trouver le max ordre actuel pour cette catégorie
    SELECT COALESCE(MAX(ordre), 0) INTO max_ordre FROM actualites WHERE categorie_id = console_id;
    
    -- Insérer les 4 nouvelles actualités
    INSERT INTO actualites (titre, description, image, date_publication, tags, categorie_id, ordre) VALUES
    (
        'CES 2026 : Sony dévoile la PlayStation 5 Pro Slim',
        'Sony surprend au CES 2026 avec une version compacte de la PS5 Pro, 30% plus petite tout en conservant les mêmes performances exceptionnelles.',
        'ps5-pro-slim-ces2026.jpg',
        '2026-01-07',
        '{Sony,PS5,CES 2026,Hardware}',
        console_id,
        max_ordre + 1
    ),
    (
        'Nintendo Switch 2 : Premières images officielles fuitent',
        'Des images prétendument officielles de la Switch 2 circulent en ligne, révélant un écran OLED 8 pouces et un dock magnétique révolutionnaire.',
        'nintendo-switch-2-leak.jpg',
        '2026-01-05',
        '{Nintendo,Switch 2,Leak,Rumeur}',
        console_id,
        max_ordre + 2
    ),
    (
        'Xbox Game Pass : 50 millions d''abonnés atteints',
        'Microsoft annonce avoir franchi le cap des 50 millions d''abonnés au Game Pass, consolidant sa position de leader du cloud gaming.',
        'xbox-game-pass-50m.jpg',
        '2026-01-06',
        '{Xbox,Game Pass,Cloud Gaming,Microsoft}',
        console_id,
        max_ordre + 3
    ),
    (
        'Steam Deck OLED Pro confirmé pour février 2026',
        'Valve officialise la sortie du Steam Deck OLED Pro avec processeur AMD Z2 Extreme et 32 Go de RAM pour un gaming PC portable ultime.',
        'steam-deck-oled-pro.jpg',
        '2026-01-08',
        '{Valve,Steam Deck,PC Portable,Gaming}',
        console_id,
        max_ordre + 4
    );
    
    RAISE NOTICE '✅ 4 actualités Console janvier 2026 ajoutées avec succès !';
END $$;

-- Vérification
SELECT id, titre, date_publication, ordre 
FROM actualites 
WHERE categorie_id = (SELECT id FROM categories WHERE LOWER(nom) = 'console')
ORDER BY ordre DESC 
LIMIT 4;
