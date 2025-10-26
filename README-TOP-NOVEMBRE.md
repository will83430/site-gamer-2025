# Top Novembre 2025 — instructions

Ce dépôt contient une petite fonctionnalité pour marquer des produits comme "Top du mois" (Novembre 2025) et une mise en avant front (bannière + badges).

Fichiers ajoutés / modifiés

- `sql/top-novembre.sql` : script SQL (backup + réinitialisation + activation sélection + vérification)
- `scripts/set-top-novembre.js` : script Node (GET `/api/produits`, puis PUT pour activer/désactiver `top_du_mois`)
- `frontend/public/top-du-mois.html` : bannière "Top Novembre 2025" ajoutée
- `frontend/public/assets/js/top-du-mois.js` : badges "Top • Nov." ajoutés et logique d'affichage

Prérequis

- PostgreSQL accessible (base `postgres` par défaut dans `serverOK.js`)
- Serveur Node.js (le serveur Express dans `serverOK.js`) en cours d'exécution
- Node 18+ recommandé pour exécuter `scripts/set-top-novembre.js` (utilise fetch global). Si Node < 18, installer `node-fetch`.

1) Vérifier la sélection et modifier si nécessaire

La sélection par défaut se trouve dans :

- `sql/top-novembre.sql` (liste dans la clause `WHERE nom IN (...)`)
- `scripts/set-top-novembre.js` (const `selection = [...]`)

Modifie ces listes si tu veux ajouter/supprimer des produits.

2) Sauvegarde (recommandé)

Exécute dans pgAdmin (Query Tool) ou via psql :

```sql
CREATE TABLE IF NOT EXISTS produits_backup_novembre AS
SELECT * FROM produits;
```

3) Appliquer le SQL (option A)

Ouvre `sql/top-novembre.sql` et exécute dans pgAdmin (Query Tool). Le script :
- réinitialise `top_du_mois` à FALSE
- active les produits listés
- affiche les produits marqués

3b) Appliquer via le script Node (option B)

Assure-toi que le serveur Node est démarré (ex : `node serverOK.js`). Ensuite :

PowerShell (Windows) :

```powershell
# depuis la racine du repo
node .\scripts\set-top-novembre.js
```

Notes :
- Le script fait GET `/api/produits`, désactive tous les flags, puis active la sélection.
- Si ton serveur n'est pas sur `http://localhost:3000`, définis la variable d'environnement `API_BASE` :

```powershell
$env:API_BASE = 'http://mon-serveur:3000'
node .\scripts\set-top-novembre.js
```

4) Vérification

Dans pgAdmin (Query Tool) :

```sql
SELECT id, nom, categorie, prix, top_du_mois
FROM produits
WHERE top_du_mois = TRUE
ORDER BY categorie, nom;
```

Ouvre la page `http://localhost:3000/top-du-mois.html` et vérifie la bannière et les badges sur les catégories.

5) Rollback

Si tu veux revenir à l'état précédent :

```sql
-- Restaurer depuis la table backup
TRUNCATE TABLE produits;
INSERT INTO produits SELECT * FROM produits_backup_novembre;
```

6) Personnalisation

- Pour changer la sélection : édite `scripts/set-top-novembre.js` et/ou `sql/top-novembre.sql`.
- Pour changer l'étiquette (ex: mois), modifie `frontend/public/top-du-mois.html` (bannière) et `assets/js/top-du-mois.js` (texte du badge `Top • Nov.`).
- Pour trier l'API avec les produits `top_du_mois` en tête, modifie la requête dans `serverOK.js` :

```js
query += ` ORDER BY top_du_mois DESC, categorie, nom`;
```

7) Support / limites

- Le script PUT `/api/produits/:id` remplace l'ensemble des champs listés. Le script actuel lit les objets GET et renvoie les mêmes champs avec `top_du_mois` modifié.
- Si tu utilises des champs supplémentaires non listés, adapte le script.

Si tu veux, je peux :
- committer ces fichiers sur une branche `feature/top-novembre` et ouvrir une PR,
- ajouter un test automatisé (vérifie que `top_du_mois` correspond aux slugs),
- ou créer un rollback automatique plus sûr (fichier dump SQL).

---
Fait par le pipeline d'aide au déploiement — dis-moi si tu veux que j'ajoute la PR ou un commit final.
