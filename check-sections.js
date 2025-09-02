const fs = require('fs');
const path = require('path');

const requiredSections = [
    'description',
    'prix',
    'specifications',
    'fonctionnalites',
    'usage'
];

function checkFicheSections(content) {
    const sections = {};
    let currentSection = null;

    // Analyse le contenu ligne par ligne
    content.split('\n').forEach(line => {
        // Détecte les sections par les titres avec emoji
        const sectionMatch = line.match(/^[#\s]*[🌐💰🧩🎮📝]\s*(.*?)[:|\s]/);
        if (sectionMatch) {
            currentSection = sectionMatch[1].toLowerCase();
            sections[currentSection] = true;
        }
    });

    return {
        hasAllSections: requiredSections.every(section => sections[section]),
        missingSections: requiredSections.filter(section => !sections[section])
    };
}

const fichesDir = path.join(__dirname, 'frontend', 'public', 'fiches');

console.log('🔍 Vérification des sections dans les fiches...\n');

fs.readdirSync(fichesDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
        const content = fs.readFileSync(path.join(fichesDir, file), 'utf8');
        const result = checkFicheSections(content);
        
        console.log(`📄 ${file}`);
        if (result.hasAllSections) {
            console.log('✅ Toutes les sections sont présentes\n');
        } else {
            console.log('❌ Sections manquantes :');
            result.missingSections.forEach(section => {
                console.log(`   - ${section}`);
            });
            console.log('');
        }
    });