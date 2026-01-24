/**
 * Migration initiale - Documentation du schéma existant
 * Cette migration ne fait rien car la DB existe déjà
 * Elle sert de point de départ pour les futures migrations
 */

exports.up = function(knex) {
  // Le schéma existe déjà - cette migration est documentaire
  console.log('✅ Migration initiale: Schéma existant documenté');
  return Promise.resolve();
};

exports.down = function(knex) {
  // Pas de rollback pour la migration initiale
  console.log('⚠️  Rollback migration initiale: Aucune action');
  return Promise.resolve();
};

/*
 * SCHÉMA EXISTANT DOCUMENTÉ:
 *
 * Table: produits
 * - id (VARCHAR PRIMARY KEY)
 * - nom (VARCHAR(255))
 * - categorie (VARCHAR(100))
 * - description (TEXT)
 * - image (VARCHAR(255))
 * - lien (VARCHAR(500))
 * - prix (VARCHAR(50))
 * - top_du_mois (BOOLEAN)
 * - titre_affiche (VARCHAR(255))
 * - fonctionnalites_avancees (TEXT[])
 * - donnees_fiche (JSONB)
 * - created_at (TIMESTAMP)
 * - updated_at (TIMESTAMP)
 *
 * Table: categories
 * - id (SERIAL PRIMARY KEY)
 * - nom (VARCHAR(100))
 * - slug (VARCHAR(100))
 * - description (TEXT)
 * - created_at (TIMESTAMP)
 *
 * Table: actualites
 * - id (SERIAL PRIMARY KEY)
 * - categorie (VARCHAR(100))
 * - titre (VARCHAR(255))
 * - description (TEXT)
 * - image (VARCHAR(255))
 * - video_url (VARCHAR(500))
 * - date_publication (TIMESTAMP)
 * - tags (TEXT[])
 * - hot (BOOLEAN)
 * - ordre (INTEGER)
 * - categorie_id (INTEGER)
 * - lien (VARCHAR(255))
 * - created_at (TIMESTAMP)
 *
 * Table: actualites_sections
 * - id (SERIAL PRIMARY KEY)
 * - actualite_id (INTEGER REFERENCES actualites)
 * - titre (VARCHAR(255))
 * - contenu (TEXT)
 * - ordre (INTEGER)
 * - created_at (TIMESTAMP)
 *
 * Table: technologies
 * - id (SERIAL PRIMARY KEY)
 * - categorie (VARCHAR(100))
 * - nom (VARCHAR(255))
 * - description (TEXT)
 * - impact (VARCHAR(50))
 * - maturite (VARCHAR(50))
 * - date_emergence (DATE)
 * - tags (TEXT[])
 * - ordre (INTEGER)
 * - created_at (TIMESTAMP)
 *
 * Table: marche
 * - id (SERIAL PRIMARY KEY)
 * - categorie (VARCHAR(100))
 * - region (VARCHAR(100))
 * - valeur_2024 (NUMERIC)
 * - valeur_2025 (NUMERIC)
 * - croissance (NUMERIC)
 * - tendance (VARCHAR(50))
 * - ordre (INTEGER)
 * - created_at (TIMESTAMP)
 *
 * Table: insights
 * - id (SERIAL PRIMARY KEY)
 * - categorie (VARCHAR(100))
 * - titre (VARCHAR(255))
 * - description (TEXT)
 * - importance (VARCHAR(50))
 * - ordre (INTEGER)
 * - created_at (TIMESTAMP)
 *
 * Table: predictions
 * - id (SERIAL PRIMARY KEY)
 * - categorie (VARCHAR(100))
 * - annee (INTEGER)
 * - titre (VARCHAR(255))
 * - description (TEXT)
 * - probabilite (VARCHAR(50))
 * - impact (VARCHAR(50))
 * - ordre (INTEGER)
 * - created_at (TIMESTAMP)
 */
