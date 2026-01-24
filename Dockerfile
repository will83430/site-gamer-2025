# Dockerfile pour Site Gamer 2025
# Multi-stage build pour optimiser la taille de l'image

# Étape 1 : Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm ci

# Copier le reste du code
COPY . .

# Build des assets (CSS/JS minifiés)
RUN npm run build:all || echo "Build assets skipped (scripts not found)"

# Étape 2 : Production
FROM node:18-alpine

WORKDIR /app

# Installer dumb-init pour gérer les signaux proprement
RUN apk add --no-cache dumb-init

# Copier seulement package.json pour les dépendances de production
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --production && npm cache clean --force

# Copier le code depuis le builder
COPY --from=builder /app .

# Créer les dossiers nécessaires
RUN mkdir -p logs fiches frontend/public/assets/images

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Utiliser l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 3000

# Variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=3000

# Utiliser dumb-init pour gérer les signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["node", "server.js"]
