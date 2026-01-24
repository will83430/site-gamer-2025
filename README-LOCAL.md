# 🖥️ Guide de Développement LOCAL - Site Gamer 2025

Ce guide explique comment développer **Site Gamer 2025** en local sur Windows, **SANS Docker**.

---

## ✅ Configuration actuelle

Votre environnement est déjà configuré et fonctionnel :

- ✅ **PostgreSQL 17.6** installé nativement sur Windows
- ✅ **Node.js 18+** installé
- ✅ **Base de données** `gamer_2025` créée
- ✅ **Fichier .env** configuré pour localhost

---

## 🚀 Démarrage rapide

### Méthode 1 : Script automatique (RECOMMANDÉ)

Double-cliquez sur le fichier :

```
start-local.bat
```

C'est tout ! Le serveur démarre sur http://localhost:3000

### Méthode 2 : Commande manuelle

```bash
npm start
```

### Méthode 3 : Mode développement avec auto-restart

```bash
npm run dev
```

---

## 📋 Workflow quotidien

### 1. Démarrer la journée

```bash
# 1. Vérifier que PostgreSQL tourne
pg_isready -U postgres

# 2. Démarrer l'app
npm start

# Ou utiliser le script
start-local.bat
```

### 2. Pendant le développement

- Modifiez votre code
- Si vous utilisez `npm run dev` (nodemon), les changements sont automatiques
- Sinon, redémarrez avec `Ctrl+C` puis `npm start`

### 3. Tester l'API

```bash
# Test simple
curl http://localhost:3000/api/test

# Ou ouvrir dans le navigateur
http://localhost:3000
```

---

## 🗄️ Gestion PostgreSQL

### Accéder à la base

```bash
# Via psql (ligne de commande)
psql -U postgres -d gamer_2025

# Via pgAdmin (interface graphique)
# Ouvrir pgAdmin depuis le menu Démarrer
```

### Commandes SQL utiles

```sql
-- Lister les tables
\dt

-- Voir les produits
SELECT * FROM produits LIMIT 10;

-- Compter les produits
SELECT COUNT(*) FROM produits;

-- Voir les catégories
SELECT * FROM categories;
```

### Backup de la base

```bash
# Créer un backup
pg_dump -U postgres gamer_2025 > backup_gamer_2025.sql

# Restaurer depuis un backup
psql -U postgres gamer_2025 < backup_gamer_2025.sql
```

---

## 🔧 Commandes NPM disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur en production |
| `npm run dev` | Mode développement avec auto-restart (nodemon) |
| `npm test` | Lance les tests Jest |
| `npm run build:css` | Minifie les CSS |
| `npm run build:js` | Minifie les JS |
| `npm run build:all` | Minifie CSS + JS |
| `npm run db:migrate` | Applique les migrations Knex |
| `npm run db:rollback` | Annule la dernière migration |

---

## 🛠️ Dépannage

### Le serveur ne démarre pas

**1. Vérifier PostgreSQL**
```bash
pg_isready -U postgres
```

Si erreur :
- Ouvrir le menu Démarrer
- Chercher "Services"
- Trouver "postgresql-x64-17"
- Clic droit → Démarrer

**2. Vérifier le port 3000**
```bash
netstat -ano | findstr :3000
```

Si occupé, tuer le processus :
```bash
taskkill /PID <numéro_pid> /F
```

**3. Vérifier .env**
- Fichier `.env` existe ?
- `DB_HOST=localhost` (PAS "db")
- `DB_PASSWORD` correct ?

### Erreur de connexion PostgreSQL

Vérifier vos credentials dans `.env` :

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=gamer_2025
```

Tester manuellement :
```bash
psql -U postgres -d gamer_2025
```

### Port 3000 déjà utilisé

Changer le port dans `.env` :
```env
PORT=3001
```

---

## 📊 Migrations de base de données

### Créer une migration

```bash
npm run db:migrate:make nom_de_la_migration
```

Exemple :
```bash
npm run db:migrate:make add_new_column_to_products
```

### Appliquer les migrations

```bash
npm run db:migrate
```

### Rollback (annuler)

```bash
npm run db:rollback
```

---

## 🧪 Tests

### Lancer tous les tests

```bash
npm test
```

### Tests avec couverture

```bash
npm run test:coverage
```

### Tests en mode watch (pendant le dev)

```bash
npm test -- --watch
```

---

## 📁 Structure du projet

```
site-gamer-2025/
├── backend/               # Code serveur
│   ├── config/           # Config DB, logger
│   ├── middleware/       # Validators, errorHandler
│   ├── routes/           # Routes API modulaires
│   ├── utils/            # Helpers, generators
│   └── database/         # Migrations Knex
│
├── frontend/             # Code client
│   └── public/
│       ├── assets/       # CSS, JS, images
│       └── *.html        # Pages HTML
│
├── fiches/               # Fiches HTML générées
├── logs/                 # Logs Winston
├── scripts/              # Scripts maintenance
├── sql/                  # Scripts SQL
├── tests/                # Tests Jest
│
├── server.js             # Point d'entrée
├── package.json          # Dépendances
├── .env                  # Config locale (GITIGNORED)
├── .env.example          # Template config
│
└── start-local.bat       # Script démarrage rapide
```

---

## 🎯 Avantages du développement local

✅ **Performance** : PostgreSQL natif = plus rapide que Docker
✅ **Simplicité** : Pas de virtualisation, pas de WSL2
✅ **Outils** : Utiliser pgAdmin, DBeaver, etc. directement
✅ **Debugging** : Plus facile à débugger qu'un conteneur
✅ **Ressources** : Moins de RAM/CPU utilisés

---

## 🐳 Et Docker ?

Les fichiers Docker sont toujours dans le projet :
- `Dockerfile`
- `docker-compose.yml`
- `README-DOCKER.md`

**Quand les utiliser ?**
- Déploiement sur serveur Linux
- CI/CD (GitHub Actions)
- Partage avec d'autres développeurs
- Si vous changez de machine avec Docker fonctionnel

Ils ne gênent pas votre développement local et sont prêts pour le futur ! 📦

---

## 🔐 Sécurité en développement

### Fichier .env (JAMAIS commiter !)

Votre `.env` contient des secrets, il est dans `.gitignore` :

```bash
# Vérifier qu'il n'est pas tracké
git status

# .env ne doit PAS apparaître
```

### Changer le mot de passe PostgreSQL

```bash
# Se connecter à psql
psql -U postgres

# Changer le mot de passe
ALTER USER postgres WITH PASSWORD 'nouveau_mot_de_passe';

# Quitter
\q
```

Puis mettre à jour `.env` avec le nouveau mot de passe.

---

## 📈 Monitoring en développement

### Voir les logs en temps réel

```bash
# Logs Winston (fichiers)
tail -f logs/combined.log
tail -f logs/error.log

# Ou sur Windows
type logs\combined.log
```

### Logs HTTP (Morgan)

Les logs HTTP apparaissent directement dans la console quand vous lancez `npm start`.

---

## 🚀 Prêt pour la production ?

Quand vous serez prêt à déployer :

1. **Sur un serveur Linux** : Utilisez Docker (tout est prêt dans `docker-compose.yml`)
2. **Sur un VPS** : Installez PostgreSQL + Node.js + PM2
3. **Sur Heroku/Railway** : Utilisez le Procfile (à créer)

---

## 📞 Ressources utiles

- **PostgreSQL Documentation** : https://www.postgresql.org/docs/
- **Node.js Best Practices** : https://github.com/goldbergyoni/nodebestpractices
- **Express.js Guide** : https://expressjs.com/
- **Winston Logger** : https://github.com/winstonjs/winston

---

**Document créé le 2026-01-13**

Bon développement ! 🚀
