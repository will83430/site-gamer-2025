// check-remaining-issues.js
// Script pour trouver tous les problèmes restants

const fs = require('fs');
const path = require('path');
let totalIssues = 0;
let foundIssues = [];

// Fonction pour analyser un fichier HTML
function analyzeHtmlFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fileName = path.basename(filePath);
        
        // Chercher les références d'images avec espaces ou majuscules
        const imageMatches = content.match(/src="[^"]*\/([^"]*\.png)"/g);
        
        if (imageMatches) {
            imageMatches.forEach(match => {
                const imageName = match.match(/\/([^"]*\.png)"/)[1];
                
                // Vérifier si l'image a des espaces ou majuscules
                if (imageName.includes(' ') || imageName.match(/[A-Z]/)) {
                    foundIssues.push({
                        file: fileName,
                        folder: path.dirname(filePath).split(path.sep).pop(),
                        oldImage: imageName,
                        newImage: imageName.toLowerCase().replace(/[^a-z0-9.]/g, '-').replace(/-+/g, '-'),
                        fullPath: filePath
                    });
                    totalIssues++;
                }
            });
        }
        
        // Chercher les références de produits avec espaces dans le JavaScript
        const jsProductMatches = content.match(/"[^"]*"(?=\s*(?:non trouvé|recherché))/g);
        if (jsProductMatches) {
            jsProductMatches.forEach(match => {
                const productName = match.replace(/"/g, '');
                if (productName.includes(' ') || productName.match(/[A-Z]/)) {
                }
            });
        }
        
    } catch (error) {
        console.error(`❌ Erreur lecture ${filePath}:`, error.message);
    }
}

// Parcourir tous les dossiers
const fichesPath = path.join(__dirname, 'fiches');
const folders = [
    'drone', 'console', 'tablette', 'smartphone',
    'pc-gaming', 'casque-audio', 'montre-connecteee', 'serveur',
    'box-internet', 'camera', 'casque-vr', 'ecran-tv',
    'imprimante-3d', 'peripheriques', 'tableau-interactif', 'video-projecteur'
];

folders.forEach(folder => {
    const folderPath = path.join(fichesPath, folder);
    if (!fs.existsSync(folderPath)) return;
    const htmlFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.html') && !f.endsWith('.backup'));
    
    htmlFiles.forEach(file => {
        const filePath = path.join(folderPath, file);
        analyzeHtmlFile(filePath);
    });
});

// Afficher tous les problèmes trouvés
if (foundIssues.length > 0) {
    foundIssues.forEach(issue => {
    });
} else {
}
