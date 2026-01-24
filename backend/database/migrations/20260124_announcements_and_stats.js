/**
 * Migration: Announcements + Site Stats
 * - Table announcements pour les bannières dynamiques
 * - Table site_stats pour les statistiques du site (visites, etc.)
 */

exports.up = function(knex) {
  return knex.schema
    // Table des annonces/bannières
    .createTable('announcements', table => {
      table.increments('id').primary();
      table.string('titre', 255).notNullable();
      table.text('description');
      table.string('icone', 50).defaultTo('🚀'); // Emoji ou classe d'icône
      table.string('lien', 500); // URL du bouton
      table.string('bouton_texte', 100).defaultTo('En savoir plus →');
      table.string('type', 50).defaultTo('info'); // info, promo, urgent, nouveau
      table.boolean('actif').defaultTo(true);
      table.integer('ordre').defaultTo(0);
      table.timestamp('date_debut').defaultTo(knex.fn.now());
      table.timestamp('date_fin'); // null = pas de fin
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // Table des statistiques du site
    .createTable('site_stats', table => {
      table.increments('id').primary();
      table.string('cle', 100).notNullable().unique(); // ex: 'visites_total', 'visites_jour'
      table.bigInteger('valeur').defaultTo(0);
      table.text('description');
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // Insérer les stats initiales
    .then(() => {
      return knex('site_stats').insert([
        { cle: 'visites_total', valeur: 0, description: 'Nombre total de visites' },
        { cle: 'visites_jour', valeur: 0, description: 'Visites aujourd\'hui' },
        { cle: 'derniere_visite', valeur: 0, description: 'Timestamp dernière visite' }
      ]);
    })
    // Insérer une annonce exemple
    .then(() => {
      return knex('announcements').insert([
        {
          titre: 'Nouveauté : Samsung Galaxy S26 Ultra disponible !',
          description: 'Découvrez notre test complet du flagship avec IA révolutionnaire et photo 200MP',
          icone: '🚀',
          lien: '/fiches/smartphone/samsung-galaxy-s26-ultra.html',
          bouton_texte: 'Lire l\'article →',
          type: 'nouveau',
          actif: true,
          ordre: 1
        }
      ]);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('announcements')
    .dropTableIfExists('site_stats');
};
