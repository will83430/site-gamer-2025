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

// Fonction pour extraire tous les liens href des fichiers HTML
function extractHrefs(htmlContent) {
    const hrefRegex = /href\s*=\s*["']([^"'#]+)["']/g;
    const matches = [];
    let match;
    
    while ((match = hrefRegex.exec(htmlContent)) !== null) {
        const href = match[1];
        // Exclure les URLs externes et les emails
        if (!href.startsWith('http') && !href.startsWith('mailto:') && href !== '/') {
            matches.push(href);
        }
    }
    
    return matches;
}

// Fonction pour normaliser un chemin relatif vers un chemin absolu
function resolvePath(relativePath, baseFilePath) {
    const baseDirPath = path.dirname(baseFilePath);
    
    // Si le chemin commence par /, c'est relatif au dossier frontend/public
    if (relativePath.startsWith('/')) {
        return path.resolve(frontendPublicDir, relativePath.substring(1));
    }
    
    // Sinon c'est relatif au fichier actuel
    return path.resolve(baseDirPath, relativePath);
}

// Fonction pour scanner récursivement tous les fichiers HTML
function scanHtmlFiles(directory) {
    const htmlFiles = [];
    
    function scan(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Exclure certains dossiers
                if (!['node_modules', '.git', 'coverage'].includes(item)) {
                    scan(fullPath);
                }
            } else if (item.endsWith('.html')) {
                htmlFiles.push(fullPath);
            }
        }
    }
    
    scan(directory);
    return htmlFiles;
}

// Fonction principale
function verifyAllLinks() {
    console.log(`${colors.cyan}${colors.bold}🔍 Vérification de tous les liens dans les fichiers HTML${colors.reset}\n`);
    
    const htmlFiles = scanHtmlFiles(baseDir);
    let totalLinks = 0;
    let brokenLinks = 0;
    let missingFiles = [];
    
    htmlFiles.forEach(htmlFile => {
        const relativePath = path.relative(baseDir, htmlFile);
        console.log(`${colors.cyan}📄 Analyse : ${relativePath}${colors.reset}`);
        
        try {
            const content = fs.readFileSync(htmlFile, 'utf-8');
            const hrefs = extractHrefs(content);
            
            hrefs.forEach(href => {
                totalLinks++;
                const targetPath = resolvePath(href, htmlFile);
                
                // Ignorer les paramètres de requête pour la vérification
                const cleanPath = targetPath.split('?')[0];
                
                if (!fs.existsSync(cleanPath)) {
                    brokenLinks++;
                    missingFiles.push({
                        sourceFile: relativePath,
                        link: href,
                        targetPath: path.relative(baseDir, cleanPath)
                    });
                    console.log(`  ${colors.red}❌ ${href} → ${path.relative(baseDir, cleanPath)}${colors.reset}`);
                } else {
                    console.log(`  ${colors.green}✅ ${href}${colors.reset}`);
                }
            });
            
        } catch (error) {
            console.log(`  ${colors.red}❌ Erreur de lecture : ${error.message}${colors.reset}`);
        }
        
        console.log('');
    });
    
    // Rapport final
    console.log(`${colors.bold}${colors.cyan}📊 RAPPORT FINAL${colors.reset}`);
    console.log(`${colors.cyan}Fichiers HTML analysés : ${htmlFiles.length}${colors.reset}`);
    console.log(`${colors.cyan}Liens totaux vérifiés : ${totalLinks}${colors.reset}`);
    console.log(`${colors.green}Liens valides : ${totalLinks - brokenLinks}${colors.reset}`);
    console.log(`${colors.red}Liens cassés : ${brokenLinks}${colors.reset}\n`);
    
    if (missingFiles.length > 0) {
        console.log(`${colors.red}${colors.bold}🚨 FICHIERS MANQUANTS :${colors.reset}`);
        missingFiles.forEach(missing => {
            console.log(`${colors.yellow}Source : ${missing.sourceFile}${colors.reset}`);
            console.log(`${colors.red}Lien : ${missing.link}${colors.reset}`);
            console.log(`${colors.red}Cible : ${missing.targetPath}${colors.reset}\n`);
        });
        
        console.log(`${colors.yellow}${colors.bold}💡 ACTIONS RECOMMANDÉES :${colors.reset}`);
        
        // Analyser les types de fichiers manquants
        const missingByType = {};
        missingFiles.forEach(missing => {
            const ext = path.extname(missing.targetPath) || 'sans-extension';
            if (!missingByType[ext]) {
                missingByType[ext] = [];
            }
            missingByType[ext].push(missing);
        });
        
        Object.keys(missingByType).forEach(ext => {
            console.log(`${colors.cyan}Fichiers ${ext} manquants : ${missingByType[ext].length}${colors.reset}`);
            missingByType[ext].forEach(missing => {
                console.log(`  - ${missing.targetPath}`);
            });
        });
        
    } else {
        console.log(`${colors.green}${colors.bold}🎉 Tous les liens sont valides !${colors.reset}`);
    }
}

// Exécuter la vérification
verifyAllLinks();