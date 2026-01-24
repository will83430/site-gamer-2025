-- Migration: Announcements + Site Stats
-- Exécuter ce script pour créer les tables

-- Table des annonces/bannières dynamiques
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    icone VARCHAR(50) DEFAULT '🚀',
    lien VARCHAR(500),
    bouton_texte VARCHAR(100) DEFAULT 'En savoir plus →',
    type VARCHAR(50) DEFAULT 'info', -- info, promo, urgent, nouveau
    actif BOOLEAN DEFAULT true,
    ordre INTEGER DEFAULT 0,
    date_debut TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_fin TIMESTAMP, -- null = pas de fin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des statistiques du site
CREATE TABLE IF NOT EXISTS site_stats (
    id SERIAL PRIMARY KEY,
    cle VARCHAR(100) NOT NULL UNIQUE,
    valeur BIGINT DEFAULT 0,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insérer les stats initiales
INSERT INTO site_stats (cle, valeur, description) VALUES
    ('visites_total', 0, 'Nombre total de visites'),
    ('visites_jour', 0, 'Visites aujourd''hui'),
    ('derniere_visite', 0, 'Timestamp dernière visite')
ON CONFLICT (cle) DO NOTHING;

-- Insérer une annonce exemple
INSERT INTO announcements (titre, description, icone, lien, bouton_texte, type, actif, ordre) VALUES
    ('Nouveauté : Samsung Galaxy S26 Ultra disponible !',
     'Découvrez notre test complet du flagship avec IA révolutionnaire et photo 200MP',
     '🚀',
     '/fiches/smartphone/samsung-galaxy-s26-ultra.html',
     'Lire l''article →',
     'nouveau',
     true,
     1)
ON CONFLICT DO NOTHING;

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_announcements_actif ON announcements(actif);
CREATE INDEX IF NOT EXISTS idx_announcements_ordre ON announcements(ordre);
CREATE INDEX IF NOT EXISTS idx_site_stats_cle ON site_stats(cle);
