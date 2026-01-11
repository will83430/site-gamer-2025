const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '../../');
const frontendPublicDir = path.resolve(__dirname, '../../frontend/public');

// Couleurs pour le terminal
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

function fixAllLinks() {
    console.log(`${colors.cyan}${colors.bold}🔧 Correction automatique des liens cassés${colors.reset}\n`);
    
    let fixedFiles = 0;
    let totalFixes = 0;
    
    // 1. Corriger les liens javascript:history.back() dans tous les fichiers
    console.log(`${colors.yellow}1. Correction des liens JavaScript history.back()${colors.reset}`);
    
    function fixJavaScriptLinks(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !['node_modules', '.git', 'coverage'].includes(item)) {
                fixJavaScriptLinks(fullPath);
            } else if (item.endsWith('.html')) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    
                    // Remplacer les href="javascript:history.back()" par onclick="history.back(); return false;" href="#"
                    const originalContent = content;
                    const fixedContent = content.replace(
                        /href="javascript:history\.back\(\)"/g,
                        'href="#" onclick="history.back(); return false;"'
                    );
                    
                    if (originalContent !== fixedContent) {
                        fs.writeFileSync(fullPath, fixedContent, 'utf-8');
                        fixedFiles++;
                        totalFixes++;
                        console.log(`  ${colors.green}✅ Fixé: ${path.relative(baseDir, fullPath)}${colors.reset}`);
                    }
                } catch (error) {
                    console.log(`  ${colors.red}❌ Erreur: ${path.relative(baseDir, fullPath)} - ${error.message}${colors.reset}`);
                }
            }
        }
    }
    
    fixJavaScriptLinks(baseDir);
    
    // 2. Corriger le fichier architecture-flow-modular.html
    console.log(`\n${colors.yellow}2. Correction des liens CSS spécifiques${colors.reset}`);
    
    const archFiles = [
        path.join(baseDir, 'wiki', 'architecture-flow-modular.html'),
        path.join(frontendPublicDir, 'wiki', 'architecture-flow-modular.html')
    ];
    
    archFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const fixedContent = content.replace(
                    'href="wiki/architecture-flow-modular.css"',
                    'href="architecture-flow-modular.css"'
                );
                
                if (content !== fixedContent) {
                    fs.writeFileSync(filePath, fixedContent, 'utf-8');
                    totalFixes++;
                    console.log(`  ${colors.green}✅ Fixé CSS: ${path.relative(baseDir, filePath)}${colors.reset}`);
                }
            } catch (error) {
                console.log(`  ${colors.red}❌ Erreur CSS: ${path.relative(baseDir, filePath)} - ${error.message}${colors.reset}`);
            }
        }
    });
    
    // 3. Créer les fichiers manquants essentiels
    console.log(`\n${colors.yellow}3. Création des fichiers manquants${colors.reset}`);
    
    // Vérifier si index.html existe dans fiches/drone/
    const droneIndexPath = path.join(baseDir, 'fiches', 'drone', 'index.html');
    if (!fs.existsSync(droneIndexPath)) {
        const indexContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Drones - Redirection</title>
    <link rel="stylesheet" href="../../assets/css/styles.min.css">
</head>
<body>
    <div class="container">
        <h1>Redirection automatique...</h1>
        <p>Vous allez être redirigé vers la page principale des drones.</p>
        <script>
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 2000);
        </script>
    </div>
</body>
</html>`;
        
        try {
            fs.writeFileSync(droneIndexPath, indexContent, 'utf-8');
            totalFixes++;
            console.log(`  ${colors.green}✅ Créé: ${path.relative(baseDir, droneIndexPath)}${colors.reset}`);
        } catch (error) {
            console.log(`  ${colors.red}❌ Erreur création: ${error.message}${colors.reset}`);
        }
    }
    
    // 4. Corriger les liens relatifs problématiques dans getting-started.html
    console.log(`\n${colors.yellow}4. Correction des liens relatifs${colors.reset}`);
    
    const gettingStartedFiles = [
        path.join(baseDir, 'wiki', 'getting-started.html'),
        path.join(frontendPublicDir, 'wiki', 'getting-started.html')
    ];
    
    gettingStartedFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                let content = fs.readFileSync(filePath, 'utf-8');
                const originalContent = content;
                
                // Corriger les liens relatifs
                content = content.replace(
                    'href="../project-details.html"',
                    'href="project-details.html"'
                );
                content = content.replace(
                    'href="../project-connections.html"',
                    'href="project-connections.html"'
                );
                content = content.replace(
                    'href="index.html"',
                    'href="../../index.html"'
                );
                
                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf-8');
                    totalFixes++;
                    console.log(`  ${colors.green}✅ Fixé liens relatifs: ${path.relative(baseDir, filePath)}${colors.reset}`);
                }
            } catch (error) {
                console.log(`  ${colors.red}❌ Erreur liens relatifs: ${path.relative(baseDir, filePath)} - ${error.message}${colors.reset}`);
            }
        }
    });
    
    // 5. Corriger les templates avec ${product.lien} dans frontend.html
    console.log(`\n${colors.yellow}5. Correction des variables de template${colors.reset}`);
    
    const frontendFiles = [
        path.join(baseDir, 'wiki', 'frontend.html'),
        path.join(frontendPublicDir, 'wiki', 'frontend.html')
    ];
    
    frontendFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                let content = fs.readFileSync(filePath, 'utf-8');
                const originalContent = content;
                
                // Remplacer la variable non résolue par un exemple
                content = content.replace(
                    'href="${product.lien}"',
                    'href="/fiches/exemple-produit.html"'
                );
                
                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf-8');
                    totalFixes++;
                    console.log(`  ${colors.green}✅ Fixé template: ${path.relative(baseDir, filePath)}${colors.reset}`);
                }
            } catch (error) {
                console.log(`  ${colors.red}❌ Erreur template: ${path.relative(baseDir, filePath)} - ${error.message}${colors.reset}`);
            }
        }
    });
    
    // Rapport final
    console.log(`\n${colors.bold}${colors.cyan}📊 RAPPORT DE CORRECTION${colors.reset}`);
    console.log(`${colors.green}Fichiers corrigés : ${fixedFiles}${colors.reset}`);
    console.log(`${colors.green}Corrections totales : ${totalFixes}${colors.reset}`);
    
    if (totalFixes > 0) {
        console.log(`\n${colors.green}${colors.bold}🎉 Corrections appliquées avec succès !${colors.reset}`);
        console.log(`${colors.yellow}💡 Relancez verify-all-links.js pour voir les améliorations${colors.reset}`);
    } else {
        console.log(`\n${colors.yellow}ℹ️ Aucune correction nécessaire${colors.reset}`);
    }
}

// Exécuter les corrections
fixAllLinks();