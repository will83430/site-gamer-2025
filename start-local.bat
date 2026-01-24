@echo off
REM Script de démarrage rapide pour développement local
REM Site Gamer 2025

echo.
echo ========================================
echo   SITE GAMER 2025 - Demarrage Local
echo ========================================
echo.

REM Vérifier que PostgreSQL tourne
echo [1/3] Verification PostgreSQL...
pg_isready -U postgres >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] PostgreSQL n'est pas demarre!
    echo Demarrez PostgreSQL depuis le menu Demarrer
    pause
    exit /b 1
)
echo [OK] PostgreSQL est actif

REM Vérifier que .env existe
echo [2/3] Verification fichier .env...
if not exist ".env" (
    echo [ERREUR] Fichier .env manquant!
    echo Copiez .env.example vers .env
    pause
    exit /b 1
)
echo [OK] Fichier .env trouve

REM Démarrer l'application
echo [3/3] Demarrage de l'application...
echo.
echo ========================================
echo   Serveur : http://localhost:3000
echo   Ctrl+C pour arreter
echo ========================================
echo.

npm start
