@echo off
REM Script de démarrage en MODE PRODUCTION (local)
REM Site Gamer 2025

echo.
echo ========================================
echo   SITE GAMER 2025 - Mode PRODUCTION
echo ========================================
echo.

REM Vérifier PostgreSQL
echo [1/4] Verification PostgreSQL...
pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] PostgreSQL n'est pas demarre!
    pause
    exit /b 1
)
echo [OK] PostgreSQL actif

REM Copier le bon fichier .env
echo [2/4] Configuration production...
copy /Y .env.production .env >nul 2>&1
echo [OK] Configuration production chargee

REM Build des assets
echo [3/4] Build des assets (CSS/JS)...
call npm run build:all
echo [OK] Assets minifies

REM Démarrer
echo [4/4] Demarrage en mode PRODUCTION...
echo.
echo ========================================
echo   http://localhost:3000
echo   Ctrl+C pour arreter
echo ========================================
echo.

set NODE_ENV=production
npm start
