-- Table pour les sections détaillées des articles de tendances
CREATE TABLE IF NOT EXISTS actualites_sections (
    id SERIAL PRIMARY KEY,
    actualite_id INTEGER NOT NULL REFERENCES actualites(id) ON DELETE CASCADE,
    titre VARCHAR(200) NOT NULL,
    contenu TEXT NOT NULL,
    ordre INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_actualites_sections_actualite_id ON actualites_sections(actualite_id);
CREATE INDEX IF NOT EXISTS idx_actualites_sections_ordre ON actualites_sections(actualite_id, ordre);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_actualites_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualites_sections_updated_at
    BEFORE UPDATE ON actualites_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_actualites_sections_updated_at();

-- Données d'exemple pour l'article NVIDIA RTX 5090
INSERT INTO actualites_sections (actualite_id, titre, contenu, ordre) VALUES
((SELECT id FROM actualites WHERE titre = 'NVIDIA RTX 5090 : 2x plus rapide que la 4090'), 
 '🎮 Caractéristiques principales', 
 'L''architecture Blackwell de NVIDIA représente un bond technologique majeur. Avec 21 760 cœurs CUDA et 680 cœurs Tensor de 5ème génération, la RTX 5090 offre des performances de ray tracing multipliées par deux par rapport à la génération précédente. Le DLSS 4.0 introduit la génération de frames neuronale, permettant de multiplier par 8 les images affichées.', 
 1),
((SELECT id FROM actualites WHERE titre = 'NVIDIA RTX 5090 : 2x plus rapide que la 4090'), 
 'Points forts', 
 '**Performances** : 32GB de GDDR7 à 28 Gbps sur bus 512-bit pour une bande passante de 1.8 TB/s\n\n**Ray Tracing** : Unités RT de 4ème génération avec support complet du Path Tracing en temps réel\n\n**IA** : 1 400 TOPS de puissance IA pour DLSS 4.0 et génération de contenu', 
 2),
((SELECT id FROM actualites WHERE titre = 'NVIDIA RTX 5090 : 2x plus rapide que la 4090'), 
 '💡 Impact sur le marché', 
 'Cette carte graphique redéfinit les standards du gaming 4K et 8K. Les benchmarks montrent des gains de 90% à 120% selon les jeux avec ray tracing activé. Le prix de 1 999$ positionne la RTX 5090 comme un produit premium, mais justifié par les performances. AMD et Intel devront réagir rapidement pour rester compétitifs sur le segment haut de gamme.', 
 3),
((SELECT id FROM actualites WHERE titre = 'NVIDIA RTX 5090 : 2x plus rapide que la 4090'), 
 '📊 Perspectives et disponibilité', 
 'La RTX 5090 sera disponible le 30 janvier 2026. Les premières précommandes affichent déjà complet chez la plupart des distributeurs. NVIDIA a assuré que la production serait suffisante pour éviter les pénuries de la génération précédente. Cette carte s''impose comme la référence absolue pour le gaming haute performance et la création de contenu en 2026.', 
 4);
