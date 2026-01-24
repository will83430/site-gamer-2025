# 🐳 Guide Docker - Site Gamer 2025

Ce guide explique comment utiliser Docker pour développer et déployer le projet **Site Gamer 2025**.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Commandes utiles](#commandes-utiles)
- [Architecture](#architecture)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Prérequis

### 1. Installer Docker Desktop

**Windows** :
1. Téléchargez Docker Desktop : https://www.docker.com/products/docker-desktop/
2. Installez le fichier téléchargé
3. Redémarrez votre PC si demandé
4. Lancez Docker Desktop (icône baleine dans la barre des tâches)

**Vérification** :
```bash
docker --version
docker-compose --version
```

Vous devriez voir :
```
Docker version 24.x.x
Docker Compose version v2.x.x
```

---

## 🚀 Installation

### 1. Cloner le projet (si pas déjà fait)

```bash
git clone <url-du-repo>
cd site-gamer-2025
```

### 2. Créer le fichier .env

Copiez le fichier d'exemple et personnalisez-le :

```bash
copy .env.example .env
```

**Important** : Modifiez le mot de passe PostgreSQL dans `.env` :

```env
DB_PASSWORD=votre_mot_de_passe_securise
```

### 3. Démarrer tous les services

**Première fois (build + démarrage)** :
```bash
docker-compose up -d --build
```

L'option `-d` = détaché (tourne en arrière-plan)

**Ensuite (sans rebuild)** :
```bash
docker-compose up -d
```

### 4. Vérifier que tout fonctionne

```bash
docker-compose ps
```

Vous devriez voir :

```
NAME                   STATUS    PORTS
gamer-2025-app         Up        0.0.0.0:3000->3000/tcp
gamer-2025-db          Up        0.0.0.0:5432->5432/tcp
gamer-2025-redis       Up        0.0.0.0:6379->6379/tcp
gamer-2025-adminer     Up        0.0.0.0:8080->8080/tcp
```

### 5. Accéder à l'application

- **Application** : http://localhost:3000
- **Adminer (interface PostgreSQL)** : http://localhost:8080
  - Système : `PostgreSQL`
  - Serveur : `db`
  - Utilisateur : `postgres`
  - Mot de passe : (celui dans votre `.env`)
  - Base : `gamer_2025`

---

## 📖 Utilisation quotidienne

### Démarrer les services

```bash
docker-compose up -d
```

### Arrêter les services

```bash
docker-compose down
```

### Arrêter ET supprimer les données (reset complet)

⚠️ **ATTENTION** : Cela supprime toutes les données de la base !

```bash
docker-compose down -v
```

### Voir les logs en temps réel

**Tous les services** :
```bash
docker-compose logs -f
```

**Un service spécifique** :
```bash
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis
```

### Redémarrer un service

```bash
docker-compose restart app
```

### Rebuilder après modification du code

```bash
docker-compose up -d --build
```

---

## 🛠️ Commandes utiles

### Exécuter une commande dans le conteneur

**Ouvrir un shell dans le conteneur app** :
```bash
docker-compose exec app sh
```

**Exécuter une migration Knex** :
```bash
docker-compose exec app npm run db:migrate
```

**Installer un nouveau package** :
```bash
docker-compose exec app npm install <package-name>
```

### Base de données

**Se connecter à PostgreSQL** :
```bash
docker-compose exec db psql -U postgres -d gamer_2025
```

**Dump de la base (backup)** :
```bash
docker-compose exec db pg_dump -U postgres gamer_2025 > backup.sql
```

**Restaurer depuis un dump** :
```bash
docker-compose exec -T db psql -U postgres gamer_2025 < backup.sql
```

**Exécuter un script SQL** :
```bash
docker-compose exec -T db psql -U postgres gamer_2025 < sql/mon_script.sql
```

### Redis

**Accéder au CLI Redis** :
```bash
docker-compose exec redis redis-cli
```

**Vider le cache Redis** :
```bash
docker-compose exec redis redis-cli FLUSHALL
```

### Voir l'utilisation des ressources

```bash
docker stats
```

### Nettoyer Docker (libérer de l'espace)

**Supprimer images inutilisées** :
```bash
docker image prune -a
```

**Nettoyer tout (images, conteneurs, volumes non utilisés)** :
```bash
docker system prune -a --volumes
```

---

## 🏗️ Architecture

### Services Docker

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   gamer-2025-app │  │   gamer-2025-db  │                │
│  │   Node.js 18     │──│   PostgreSQL 15  │                │
│  │   Port: 3000     │  │   Port: 5432     │                │
│  └──────────────────┘  └──────────────────┘                │
│           │                      │                            │
│           └──────────┬───────────┘                           │
│                      │                                        │
│           ┌──────────▼──────────┐                           │
│           │  gamer-2025-redis   │                           │
│           │  Redis 7            │                           │
│           │  Port: 6379         │                           │
│           └─────────────────────┘                           │
│                                                               │
│           ┌─────────────────────┐                           │
│           │ gamer-2025-adminer  │                           │
│           │ Interface Web DB    │                           │
│           │ Port: 8080          │                           │
│           └─────────────────────┘                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Volumes (données persistantes)

- **postgres_data** : Données PostgreSQL (survit à `docker-compose down`)
- **redis_data** : Données Redis
- **./fiches** : Fiches HTML générées (synchronisé avec l'hôte)
- **./logs** : Logs de l'application (synchronisé avec l'hôte)
- **./frontend/public/assets/images** : Images (synchronisé avec l'hôte)

### Réseau

Tous les conteneurs communiquent via le réseau `gamer_2025_network`.

**Noms d'hôtes internes** :
- `app` → Application Node.js
- `db` → PostgreSQL
- `redis` → Redis
- `adminer` → Interface Adminer

---

## 🐛 Troubleshooting

### Le port 3000 est déjà utilisé

**Solution** : Arrêter l'application locale ou changer le port dans `docker-compose.yml` :

```yaml
services:
  app:
    ports:
      - "3001:3000"  # Utiliser 3001 au lieu de 3000
```

### L'application ne démarre pas

**Voir les logs** :
```bash
docker-compose logs app
```

**Vérifier les variables d'environnement** :
```bash
docker-compose exec app env | grep DB_
```

### Erreur de connexion PostgreSQL

**Vérifier que la DB est ready** :
```bash
docker-compose exec db pg_isready -U postgres
```

**Se connecter manuellement** :
```bash
docker-compose exec db psql -U postgres -d gamer_2025
```

### Redis ne répond pas

**Vérifier le statut** :
```bash
docker-compose exec redis redis-cli ping
```

Devrait retourner : `PONG`

### Les changements de code ne sont pas pris en compte

**Redémarrer avec rebuild** :
```bash
docker-compose up -d --build
```

**Ou juste redémarrer le conteneur** :
```bash
docker-compose restart app
```

### Docker Desktop est lent

**Sur Windows** :
1. Ouvrir Docker Desktop
2. Settings → Resources
3. Augmenter CPU et RAM alloués (min 4GB RAM recommandé)

### Nettoyer complètement et recommencer

```bash
# 1. Arrêter et supprimer tout
docker-compose down -v

# 2. Supprimer les images
docker rmi gamer-2025-app

# 3. Rebuild from scratch
docker-compose up -d --build
```

---

## 🔄 Workflow de développement recommandé

### Développement local avec hot-reload

Le `docker-compose.yml` monte le code source en volume, donc :

1. Modifier le code sur votre PC
2. Les changements sont automatiquement reflétés dans le conteneur
3. Redémarrer le conteneur si nécessaire :
   ```bash
   docker-compose restart app
   ```

### Tester en mode production

```bash
# Build avec optimisations
NODE_ENV=production docker-compose up -d --build

# Tester
curl http://localhost:3000/api/test
```

### Migrations de base de données

```bash
# Créer une migration
docker-compose exec app npm run db:migrate:make nom_migration

# Appliquer les migrations
docker-compose exec app npm run db:migrate

# Rollback
docker-compose exec app npm run db:rollback
```

---

## 📦 Déploiement en production

### Option 1 : Docker Compose (serveur simple)

```bash
# Sur le serveur
git pull
docker-compose -f docker-compose.prod.yml up -d --build
```

### Option 2 : Docker Hub + Pull

```bash
# Local : Push l'image
docker tag gamer-2025-app:latest username/gamer-2025:latest
docker push username/gamer-2025:latest

# Serveur : Pull et run
docker pull username/gamer-2025:latest
docker-compose up -d
```

### Option 3 : Kubernetes (pour scale)

Créer des manifests K8s (Deployment, Service, ConfigMap, Secret).

---

## ✅ Checklist avant commit

- [ ] `.env` n'est PAS commité (déjà dans `.gitignore`)
- [ ] `.dockerignore` est à jour
- [ ] `docker-compose.yml` utilise des variables d'env (pas de secrets hardcodés)
- [ ] Les volumes pour `fiches/` et `logs/` sont bien montés
- [ ] Le healthcheck PostgreSQL fonctionne
- [ ] Le port 3000 est accessible

---

## 📚 Ressources

- **Docker Documentation** : https://docs.docker.com/
- **Docker Compose Reference** : https://docs.docker.com/compose/compose-file/
- **PostgreSQL Docker** : https://hub.docker.com/_/postgres
- **Redis Docker** : https://hub.docker.com/_/redis
- **Node.js Best Practices** : https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md

---

## 🎉 Avantages de Docker

✅ **Environnement identique** : Dev = Staging = Prod
✅ **Démarrage rapide** : 1 commande pour tout installer
✅ **Isolation complète** : Pas de conflit avec d'autres projets
✅ **Facile à partager** : Nouveau dev opérationnel en 5 minutes
✅ **Portabilité** : Fonctionne sur Windows, Mac, Linux
✅ **Scalabilité** : Facile d'ajouter des réplicas

---

**Document créé le 2026-01-13**

Pour toute question : consulter la [documentation officielle Docker](https://docs.docker.com/) ou le fichier [ANALYSE-ARCHITECTURE-COMPLETE.md](ANALYSE-ARCHITECTURE-COMPLETE.md).
