// Script pour mettre à jour tous les scripts avec la config centralisée
const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');
const files = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.js'));

let updated = 0;
let skipped = 0;

const oldPatterns = [
  // Pattern 1: new Client with hardcoded config
  {
    search: /const\s+{\s*Client\s*}\s*=\s*require\('pg'\);\s*const\s+client\s*=\s*new\s+Client\(\{[^}]*user:\s*'postgres'[^}]*password:\s*'Wilfried!1985'[^}]*\}\);/gs,
    replace: "const pool = require('../backend/config/database');"
  },
  // Pattern 2: new Pool with hardcoded config
  {
    search: /const\s+{\s*Pool\s*}\s*=\s*require\('pg'\);\s*const\s+pool\s*=\s*new\s+Pool\(\{[^}]*user:\s*'postgres'[^}]*password:\s*'Wilfried!1985'[^}]*\}\);/gs,
    replace: "const pool = require('../backend/config/database');"
  },
  // Pattern 3: Client seul
  {
    search: /const\s+client\s*=\s*new\s+Client\(\{[^}]*user:\s*'postgres'[^}]*password:\s*'Wilfried!1985'[^}]*\}\);/gs,
    replace: "const pool = require('../backend/config/database');"
  }
];

files.forEach(file => {
  const filePath = path.join(scriptsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Vérifier si le fichier a déjà été mis à jour
  if (content.includes("require('../backend/config/database')")) {
    console.log(`⏭️  ${file} - Déjà à jour`);
    skipped++;
    return;
  }
  
  // Vérifier si le fichier utilise fetch/API au lieu de connexion directe
  if (!content.includes('new Client') && !content.includes('new Pool')) {
    console.log(`⏭️  ${file} - N'utilise pas de connexion DB directe`);
    skipped++;
    return;
  }
  
  let modified = false;
  
  // Appliquer les remplacements
  oldPatterns.forEach(pattern => {
    if (pattern.search.test(content)) {
      content = content.replace(pattern.search, pattern.replace);
      modified = true;
    }
  });
  
  // Remplacer les imports pg restants
  if (content.includes("require('pg')")) {
    content = content.replace(/const\s+{\s*(?:Client|Pool)\s*}\s*=\s*require\('pg'\);?\s*/g, '');
    modified = true;
  }
  
  // Remplacer client.connect() par rien (pool se connecte auto)
  if (content.includes('client.connect()')) {
    content = content.replace(/await\s+client\.connect\(\);?\s*/g, '');
    modified = true;
  }
  
  // Remplacer client. par pool.
  if (content.includes('client.')) {
    content = content.replace(/\bclient\./g, 'pool.');
    modified = true;
  }
  
  // Remplacer client) par pool)
  if (content.includes('client)')) {
    content = content.replace(/\bclient\)/g, 'pool)');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} - Mis à jour`);
    updated++;
  } else {
    console.log(`⚠️  ${file} - Patterns non détectés`);
    skipped++;
  }
});

console.log(`\n📊 Résultat:`);
console.log(`   ✅ Mis à jour: ${updated}`);
console.log(`   ⏭️  Ignorés: ${skipped}`);
console.log(`   📁 Total: ${files.length}`);
