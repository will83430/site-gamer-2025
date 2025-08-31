// check-naming.js - Script de vérification complète
// Utilisation: node check-naming.js

const fs = require('fs');
const path = require('path');
let totalErrors = 0;
let totalWarnings = 0;

// 1. VÉRIFIER LA STRUCTURE DES DOSSIERS
const expectedFolders = [
    'drone', 'console', 'tablette', 'smartphone',
    'pc-gaming', 'casque-audio', 'montre-connecteee', 'serveur'
];

const fichesPath = path.join(__dirname, 'fiches');
if (fs.existsSync(fichesPath)) {
    const folders = fs.readdirSync(fichesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    expectedFolders.forEach(folder => {
        if (folders.includes(folder)) {
        } else {
            totalErrors++;
        }
    });
    
    // Dossiers inattendus
    folders.forEach(folder => {
        if (!expectedFolders.includes(folder)) {
            totalWarnings++;
        }
    });
} else {
    totalErrors++;
}

// 2. VÉRIFIER LES IMAGES PRODUITS
const imagesPath = path.join(__dirname, 'frontend/public/assets/images');
if (fs.existsSync(imagesPath)) {
    const images = fs.readdirSync(imagesPath)
        .filter(file => file.match(/\.(png|jpg|jpeg|gif|webp)$/i));
    
    if (images.length === 0) {
        totalWarnings++;
    } else {
        images.forEach(image => {
            const hasSpaces = image.includes(' ');
            const hasUppercase = image.match(/[A-Z]/);
            const hasSpecialChars = image.match(/[^a-z0-9.\-]/);
            
            if (hasSpaces || hasUppercase || hasSpecialChars) {
                if (hasSpaces) console.log(`   → Contient des espaces`);
                if (hasUppercase) console.log(`   → Contient des majuscules`);
                if (hasSpecialChars) console.log(`   → Contient des caractères spéciaux`);
                totalErrors++;
            } else {
            }
        });
    }
} else {
    totalErrors++;
}

// 3. VÉRIFIER LES FICHIERS JAVASCRIPT
const jsFiles = [
    'frontend/public/assets/js/fiches.js',
    'frontend/public/assets/js/admin-functions.js',
    'frontend/public/assets/js/fiche-produit.js'
];

jsFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Chercher les variables snake_case (problématiques)
        const snakeCaseVars = content.match(/\b[a-z]+_[a-z_]+\b/g);
        if (snakeCaseVars) {
            const uniqueVars = [...new Set(snakeCaseVars)];
            uniqueVars.forEach(variable => {
                const camelCase = variable.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
            });
            totalWarnings++;
        } else {
        }
    } else {
        totalErrors++;
    }
});

// 4. VÉRIFIER LE MAPPING CATÉGORIES
const adminFunctionsPath = path.join(__dirname, 'frontend/public/assets/js/admin-functions.js');
if (fs.existsSync(adminFunctionsPath)) {
    const content = fs.readFileSync(adminFunctionsPath, 'utf8');
    
    // Extraire le folderMap
    const folderMapMatch = content.match(/const folderMap = \{([^}]+)\}/s);
    if (folderMapMatch) {
        // Vérifier chaque mapping
        const mapContent = folderMapMatch[1];
        const mappings = mapContent.match(/'[^']+': '[^']+'/g);
        
        if (mappings) {
            mappings.forEach(mapping => {
                const [dbName, folderName] = mapping.replace(/'/g, '').split(': ');
                const expectedPath = path.join(fichesPath, folderName);
                
                if (fs.existsSync(expectedPath)) {
                } else {
                    totalErrors++;
                }
            });
        }
    } else {
        totalWarnings++;
    }
} else {
    totalErrors++;
}

// 5. VÉRIFIER LES FICHIERS HTML DE FICHES
expectedFolders.forEach(folder => {
    const folderPath = path.join(fichesPath, folder);
    if (fs.existsSync(folderPath)) {
        const htmlFiles = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.html'));
        
        if (htmlFiles.length === 0) {
            totalWarnings++;
        } else {
            // Vérifier le nommage des fichiers HTML
            htmlFiles.forEach(file => {
                const hasSpaces = file.includes(' ');
                const hasUppercase = file.match(/[A-Z]/);
                
                if (hasSpaces || hasUppercase) {
                    totalErrors++;
                } else {
                }
            });
        }
    }
});

// RÉSUMÉ FINAL
if (totalErrors === 0 && totalWarnings === 0) {
} else {
    if (totalErrors > 0) {
    }
}
