# Top Décembre 2025 — instructions

Ce dossier et ces scripts facilitent la mise à jour de la sélection "Top du mois" pour Décembre 2025.

Fichiers ajoutés :
- `sql/top-decembre.sql` : script SQL pour sauvegarder la table et mettre à jour les flags `top_du_mois`.
- `scripts/set-top-decembre.js` : script Node qui utilise l'API pour désactiver tous les flags et activer la sélection Décembre.

Procédure recommandée :
1. Vérifier la sélection des `nom` dans `sql/top-decembre.sql` et `scripts/set-top-decembre.js`.
2. Si vous préférez appliquer directement via la base de données, exécuter `sql/top-decembre.sql` sur la BD (psql).
3. Sinon, démarrer le serveur et exécuter `node scripts/set-top-decembre.js` (assurez-vous que `API_BASE` pointe vers votre serveur local si nécessaire).
4. Mettre à jour manuellement les fiches générées si vous voulez que les pages statiques reflètent immédiatement la sélection (ou utilisez `/api/generate-fiche/:id`).

Remarque : la sélection par défaut dans ces fichiers reprend la sélection de Novembre. Modifiez-la selon vos choix pour Décembre.
