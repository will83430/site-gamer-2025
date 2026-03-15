#!/bin/bash

VPS="ubuntu@162.19.230.51"
LOCAL_DIR="/home/will/site-gamer-2025/"
DB_NAME="gamer_2025"
DB_USER="postgres"
DB_PASS="MBsrtfgpg!30"
DUMP_FILE="/tmp/gamer_export.sql"

echo "==================================="
echo "  DEPLOY — guidehightech.org"
echo "==================================="

# Demande si on sync aussi la BDD
read -p "Synchroniser aussi la base de données ? (o/N) " sync_db

echo ""
echo "▶ Synchronisation des fichiers..."
rsync -av --delete \
  --exclude='node_modules/' \
  --exclude='logs/' \
  --exclude='*.dump' \
  --exclude='.git/' \
  --exclude='.env' \
  "$LOCAL_DIR" "$VPS:/home/ubuntu/app/" \
  | grep -E "^(frontend|backend|server|package)" | head -20

if [ "$sync_db" = "o" ] || [ "$sync_db" = "O" ]; then
  echo ""
  echo "▶ Export de la base de données locale (sans site_stats)..."
  PGPASSWORD="$DB_PASS" pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" \
    --no-owner --no-acl --inserts \
    --exclude-table-data=site_stats \
    -f "$DUMP_FILE"
  echo "  Export OK — $(du -sh $DUMP_FILE | cut -f1)"

  echo ""
  echo "▶ Transfert vers le VPS..."
  scp "$DUMP_FILE" "$VPS:/tmp/"

  echo ""
  echo "▶ Import sur le VPS..."
  ssh "$VPS" "
    pm2 stop site-gamer --silent
    sudo -u postgres psql -d $DB_NAME -f /tmp/gamer_export.sql > /dev/null 2>&1
    sudo -u postgres psql -d $DB_NAME -c 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO siteuser; GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO siteuser;' > /dev/null 2>&1
    pm2 start site-gamer --silent
    echo 'Import BDD OK'
  "
else
  echo ""
  echo "▶ Redémarrage de l'application..."
  ssh "$VPS" "pm2 restart site-gamer --silent && echo 'App redémarrée'"
fi

echo ""
echo "✅ Deploy terminé — https://guidehightech.org"
echo "==================================="
