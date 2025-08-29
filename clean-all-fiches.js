// clean-all-fiches.js
// Script Node.js pour nettoyer automatiquement toutes vos fiches

const fs = require('fs');
const path = require('path');

// Liste de vos produits avec leurs dossiers
const produits = [
    // CONSOLES
    { nom: 'PSPS', dossier: 'console' },
    { nom: 'Nintendo Switch 2 Pro', dossier: 'console' },
    { nom: 'PlayStation 5 Slim', dossier: 'console' },
    { nom: 'Xbox Series X', dossier: 'console' },
    { nom: 'Asus ROG Ally X', dossier: 'console' },
    
    // DRONES
    { nom: 'DJI Air 3S', dossier: 'drone' },
    { nom: 'DJI Mavic 4 Pro', dossier: 'drone' },
    { nom: 'DJI Mini 5 Pro', dossier: 'drone' },
    { nom: 'Drone X-Pro 2025', dossier: 'drone' },
    { nom: 'Autel EVO Max 5G', dossier: 'drone' },
    { nom: 'Autel Nano+', dossier: 'drone' },
    { nom: 'Parrot Anafi USA', dossier: 'drone' },
    { nom: 'Skydio X10', dossier: 'drone' },
    
    // TABLETTES
    { nom: 'Apple iPad Pro M4', dossier: 'tablette' },
    { nom: 'Microsoft Surface Pro X 2025', dossier: 'tablette' },
    { nom: 'Samsung Galaxy Tab S10 FE', dossier: 'tablette' },
    { nom: 'Redmagic Astra', dossier: 'tablette' },
    
    // SMARTPHONES
    { nom: 'Google Pixel 10', dossier: 'smartphone' },
    { nom: 'Samsung Galaxy S25 Ultra', dossier: 'smartphone' },
    { nom: 'HONOR 200 Pro', dossier: 'smartphone' },
    
    // PC GAMING
    { nom: 'Asus ROG Strix G18', dossier: 'pc-gaming' },
    { nom: 'Corsair One i500', dossier: 'pc-gaming' },
    { nom: 'Vibox X-215 SG', dossier: 'pc-gaming' },
    
    // CASQUES AUDIO
    { nom: 'Sony WH-1000XM5', dossier: 'casque-audio' },
    { nom: 'Bose QuietComfort 45', dossier: 'casque-audio' },
    { nom: 'Beyerdynamic Amiron 100', dossier: 'casque-audio' },
    
    // MONTRES
    { nom: 'Apple Watch Series 10', dossier: 'montre-connectee' },
    { nom: 'Apple Watch Series 9', dossier: 'montre-connectee' },
    { nom: 'Garmin Fénix 8', dossier: 'montre-connectee' },
    
    // SERVEURS
    { nom: 'Dell PowerEdge R760', dossier: 'serveur' },
    { nom: 'Dell PowerEdge R960', dossier: 'serveur' }
];

// Template HTML propre
const generateCleanHTML = (produit) => {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${produit.nom} - Fiche Produit</title>
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope&family=Montserrat&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div class="entete">
        <img src="../../assets/images/gaming.png" alt="Gaming">
        <a href="javascript:history.back()">← Retour</a>
    </div>

    <h1>${produit.nom}</h1>
    
    <div id="badge-top-mois"></div>

    <p class="description">Chargement de la description...</p>

    <div class="gallery">
        <img src="../../assets/images/${produit.nom}.png" alt="${produit.nom}" class="img-centree" onerror="this.src='../../assets/images/placeholder.png'">
    </div>
    
    <div class="lightbox" id="lightbox">
        <img id="lightbox-img" src="" alt="Zoom">
    </div>

    <div id="product-content">
        <p style="text-align: center; color: #666;">
            <span style="display: inline-block; width: 20px; height: 20px; border: 3px solid #ddd; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></span>
            Chargement des données...
        </p>
    </div>

    <style>
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>

    <footer class="footer">
        <img src="../../assets/images/banniere-pied.png" alt="Bannière" class="footer-banner">
        <div class="footer-links">
            <div class="footer-item">
                <img src="../../assets/images/logo-blanc.png" alt="Accueil" class="footer-icon">
                <a href="../../index.html">Accueil</a>
            </div>
            <div class="footer-item">
                <img src="../../assets/images/logo-dokk-blanc.png" alt="Multibloc" class="footer-icon">
                <a href="../../pages/fiches.html">Vitrine</a>
            </div>
        </div>
    </footer>

    <script src="../../assets/js/utils.js"></script>
    <script src="../../assets/js/fiche-produit.js"></script>
    
</body>
</html>`;
};

// Fonction pour nettoyer toutes les fiches
function cleanAllFiches() {
    console.log('🧹 Début du nettoyage des fiches...');
    
    let processed = 0;
    let errors = 0;
    
    produits.forEach(produit => {
        try {
            const filePath = path.join(__dirname, 'fiches', produit.dossier, `${produit.nom}.html`);
            const backupPath = path.join(__dirname, 'fiches', produit.dossier, `${produit.nom}.html.backup`);
            
            // Créer sauvegarde si le fichier existe
            if (fs.existsSync(filePath)) {
                fs.copyFileSync(filePath, backupPath);
                console.log(`💾 Sauvegarde créée: ${produit.nom}.html.backup`);
            }
            
            // Générer le nouveau HTML propre
            const cleanHTML = generateCleanHTML(produit);
            
            // Créer le dossier s'il n'existe pas
            const dirPath = path.join(__dirname, 'fiches', produit.dossier);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            // Écrire le fichier propre
            fs.writeFileSync(filePath, cleanHTML, 'utf8');
            
            console.log(`✅ Nettoyé: ${produit.dossier}/${produit.nom}.html`);
            processed++;
            
        } catch (error) {
            console.error(`❌ Erreur pour ${produit.nom}:`, error.message);
            errors++;
        }
    });
    
    console.log(`\n🎉 Nettoyage terminé !`);
    console.log(`✅ Fichiers traités: ${processed}`);
    console.log(`❌ Erreurs: ${errors}`);
    console.log(`💾 Sauvegardes créées: ${processed} fichiers .backup`);
}

// Lancer le nettoyage
cleanAllFiches();