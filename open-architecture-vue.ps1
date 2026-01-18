# Script PowerShell pour ouvrir le diagramme d'architecture Vue.js
# Usage: .\open-architecture-vue.ps1

Write-Host "🎮 Ouverture du diagramme d'architecture Vue.js..." -ForegroundColor Green
Write-Host ""

$htmlPath = Join-Path $PSScriptRoot "wiki\project-connections-vue.html"

if (Test-Path $htmlPath) {
    Write-Host "📄 Fichier trouvé: $htmlPath" -ForegroundColor Cyan
    Write-Host "🌐 Ouverture dans le navigateur par défaut..." -ForegroundColor Yellow
    Start-Process $htmlPath
    Write-Host ""
    Write-Host "✅ Diagramme ouvert avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Instructions:" -ForegroundColor Magenta
    Write-Host "  - Cliquez sur 'Vue.js' pour voir uniquement l'architecture Vue" -ForegroundColor White
    Write-Host "  - Survolez un nœud pour voir ses connexions" -ForegroundColor White
    Write-Host "  - Cliquez sur un nœud pour verrouiller la vue" -ForegroundColor White
    Write-Host "  - Explorez les différentes couches avec les boutons de filtre" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Erreur: Fichier non trouvé à $htmlPath" -ForegroundColor Red
    Write-Host "Vérifiez que vous êtes dans le bon dossier." -ForegroundColor Yellow
    exit 1
}
