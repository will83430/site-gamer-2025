const fs = require('fs');
const path = require('path');

const toDelete = [
  'arbo.txt',
  'export_produits_actuels.json',
  'produits_propres.json',
  'fiches_for_ai.json.js',
  '.cache'
];

toDelete.forEach(item => {
  const target = path.join('.', item);
  if (fs.existsSync(target)) {
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`Dossier supprimé : ${item}`);
    } else {
      fs.unlinkSync(target);
      console.log(`Fichier supprimé : ${item}`);
    }
  }
});

console.log('Nettoyage terminé !');