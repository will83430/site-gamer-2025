-- Table pour les pages Wiki
CREATE TABLE IF NOT EXISTS wiki_pages (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    contenu TEXT,
    description VARCHAR(500),
    icone VARCHAR(10) DEFAULT '📄',
    categorie VARCHAR(100) DEFAULT 'general',
    ordre INTEGER DEFAULT 0,
    actif BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_wiki_pages_slug ON wiki_pages(slug);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_categorie ON wiki_pages(categorie);
CREATE INDEX IF NOT EXISTS idx_wiki_pages_actif ON wiki_pages(actif);

-- Données initiales basées sur le wiki existant
INSERT INTO wiki_pages (titre, slug, contenu, description, icone, categorie, ordre, actif) VALUES
('Accueil Wiki', 'index', '<h2>Bienvenue sur le Wiki HIGH-TECH 2026</h2><p>Documentation technique du projet.</p>', 'Page d''accueil du wiki', '🏠', 'general', 1, true),
('Guide de démarrage', 'getting-started', '<h2>Guide de démarrage</h2><p>Comment démarrer avec le projet.</p>', 'Guide pour bien commencer', '🚀', 'getting-started', 2, true),
('Installation', 'installation', '<h2>Installation</h2><p>Instructions d''installation du projet.</p>', 'Guide d''installation', '📦', 'getting-started', 3, true),
('Référence API', 'api-reference', '<h2>Référence API</h2><p>Documentation des endpoints API.</p>', 'Documentation API complète', '🔌', 'api', 4, true),
('Base de données', 'database', '<h2>Base de données</h2><p>Structure et schéma de la base de données.</p>', 'Documentation BDD', '🗄️', 'api', 5, true),
('Frontend', 'frontend', '<h2>Frontend</h2><p>Architecture et composants frontend.</p>', 'Documentation frontend', '🎨', 'frontend', 6, true),
('Scripts', 'scripts', '<h2>Scripts</h2><p>Scripts utilitaires du projet.</p>', 'Documentation des scripts', '⚙️', 'tools', 7, true),
('Tests', 'tests', '<h2>Tests</h2><p>Guide des tests et qualité.</p>', 'Documentation des tests', '🧪', 'tools', 8, true),
('Déploiement', 'deployment', '<h2>Déploiement</h2><p>Guide de déploiement en production.</p>', 'Guide de déploiement', '🚢', 'deployment', 9, true),
('Dépannage', 'troubleshooting', '<h2>Dépannage</h2><p>Solutions aux problèmes courants.</p>', 'Guide de dépannage', '🔧', 'support', 10, true),
('Bonnes pratiques', 'best-practices', '<h2>Bonnes pratiques</h2><p>Conventions et bonnes pratiques du projet.</p>', 'Guide des bonnes pratiques', '✅', 'support', 11, true),
('Glossaire', 'glossary', '<h2>Glossaire</h2><p>Définitions des termes techniques.</p>', 'Glossaire technique', '📖', 'support', 12, true),
('Workflows', 'workflows', '<h2>Workflows</h2><p>Processus et workflows du projet.</p>', 'Documentation des workflows', '🔄', 'tools', 13, true),
('Changelog', 'changelog', '<h2>Changelog</h2><p>Historique des modifications.</p>', 'Journal des modifications', '📋', 'general', 14, true),
('Détails du projet', 'project-details', '<h2>Détails du projet</h2><p>Informations détaillées sur le projet.</p>', 'Détails techniques', '📊', 'general', 15, true)
ON CONFLICT (slug) DO NOTHING;

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_wiki_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wiki_pages_updated_at ON wiki_pages;
CREATE TRIGGER wiki_pages_updated_at
    BEFORE UPDATE ON wiki_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_wiki_pages_updated_at();
