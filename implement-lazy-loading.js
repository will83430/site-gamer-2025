// implement-lazy-loading.js
// Script pour implémenter le lazy loading des images

const fs = require('fs');
const path = require('path');

// 1. Créer le script lazy loading
const lazyLoadingScript = `// lazy-loading.js - Script de lazy loading optimisé
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si IntersectionObserver est supporté
    if (!('IntersectionObserver' in window)) {
        // Fallback pour navigateurs anciens - charger toutes les images
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Charger l'image
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
                img.classList.add('loaded');
                
                // Arrêter d'observer cette image
                observer.unobserve(img);
            }
        });
    }, {
        // Charger l'image 50px avant qu'elle soit visible
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Observer toutes les images lazy
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});`;

// 2. CSS pour les transitions
const lazyLoadingCSS = `/* Lazy loading styles */
img.lazy {
    opacity: 0.3;
    transition: opacity 0.3s ease;
    background-color: #f0f0f0;
}

img.loaded {
    opacity: 1;
}

/* Placeholder pendant le chargement */
img[data-src] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3EChargement...%3C/text%3E%3C/svg%3E");
    background-size: cover;
    background-position: center;
}`;

function implementLazyLoading() {
    try {
        console.log('🔧 Implémentation du lazy loading...\n');

        // Créer le fichier JavaScript
        const jsPath = 'frontend/public/assets/js/lazy-loading.js';
        fs.writeFileSync(jsPath, lazyLoadingScript);
        console.log('✅ Script lazy-loading.js créé');

        // Ajouter le CSS au fichier styles.css
        const cssPath = 'frontend/public/assets/css/styles.css';
        if (fs.existsSync(cssPath)) {
            let cssContent = fs.readFileSync(cssPath, 'utf8');
            
            // Vérifier si le CSS lazy loading existe déjà
            if (!cssContent.includes('img.lazy')) {
                cssContent += '\n\n/* LAZY LOADING STYLES */\n' + lazyLoadingCSS;
                fs.writeFileSync(cssPath, cssContent);
                console.log('✅ CSS lazy loading ajouté à styles.css');
                
                // Régénérer le fichier minifié si terser est disponible
                try {
                    const { execSync } = require('child_process');
                    execSync(`terser ${cssPath} -o frontend/public/assets/css/styles.min.css`, { stdio: 'inherit' });
                    console.log('✅ styles.min.css régénéré');
                } catch (error) {
                    console.log('⚠️ Minification CSS manuelle nécessaire');
                }
            } else {
                console.log('⚪ CSS lazy loading déjà présent');
            }
        }

        // Modifier les fichiers HTML pour inclure le script
        addScriptToHtmlFiles();
        
        // Modifier la logique de génération d'images dans fiches.js
        modifyFichesJS();

        console.log('\n🎯 Test:');
        console.log('1. Ouvre la page fiches dans le navigateur');
        console.log('2. Ouvre les DevTools (F12) > Network');
        console.log('3. Rafraîchis la page');
        console.log('4. Tu devrais voir que les images se chargent au scroll');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

function addScriptToHtmlFiles() {
    const htmlFiles = [
        'frontend/public/pages/fiches.html',
        'frontend/public/index.html'
    ];

    htmlFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Vérifier si le script existe déjà
            if (!content.includes('lazy-loading.js')) {
                // Ajouter avant la fermeture du body
                content = content.replace('</body>', '    <script src="../assets/js/lazy-loading.js"></script>\n</body>');
                fs.writeFileSync(filePath, content);
                console.log(`✅ Script lazy loading ajouté à ${filePath}`);
            } else {
                console.log(`⚪ Script déjà présent dans ${filePath}`);
            }
        }
    });
}

function modifyFichesJS() {
    const fichesJsPath = 'frontend/public/assets/js/fiches.js';
    
    if (!fs.existsSync(fichesJsPath)) {
        console.log('⚠️ fiches.js non trouvé - modification manuelle nécessaire');
        return;
    }

    let content = fs.readFileSync(fichesJsPath, 'utf8');
    
    // Sauvegarder l'original
    fs.writeFileSync(fichesJsPath + '.backup', content);
    
    // Remplacer src= par data-src= et ajouter la classe lazy
    const originalPattern = /<img src="\$\{imageUrl\}"/g;
    const lazyPattern = '<img data-src="${imageUrl}" src="" class="lazy"';
    
    if (originalPattern.test(content)) {
        content = content.replace(originalPattern, lazyPattern);
        fs.writeFileSync(fichesJsPath, content);
        console.log('✅ fiches.js modifié pour lazy loading');
        
        // Régénérer le .min.js
        try {
            const { execSync } = require('child_process');
            execSync(`terser ${fichesJsPath} -o frontend/public/assets/js/fiches.min.js`, { stdio: 'inherit' });
            console.log('✅ fiches.min.js régénéré');
        } catch (error) {
            console.log('⚠️ Minification JS manuelle nécessaire');
        }
    } else {
        console.log('⚪ Pattern img src non trouvé dans fiches.js');
        console.log('💡 Modification manuelle nécessaire - remplacer src= par data-src= et ajouter class="lazy"');
    }
}

implementLazyLoading();