// Script pour télécharger les images des actualités camera
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'images');

// URLs d'images gratuites haute qualité (Unsplash)
const images = [
  {
    name: 'sony-a7-v.jpg',
    url: 'https://images.unsplash.com/photo-1606980702360-8c6a27273f6e?w=1200&q=80', // Sony camera
    description: 'Sony A7 V camera'
  },
  {
    name: 'canon-eos-r6-mark-ii.jpg',
    url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1200&q=80', // Canon camera
    description: 'Canon EOS R6 Mark II'
  },
  {
    name: 'insta360-x5.jpg',
    url: 'https://images.unsplash.com/photo-1635514569146-9a9607ecf303?w=1200&q=80', // 360 camera
    description: 'Insta360 X5 360° camera'
  },
  {
    name: 'capteur-200mp.jpg',
    url: 'https://images.unsplash.com/photo-1606682960163-1e95f5e4c8e5?w=1200&q=80', // Camera sensor
    description: 'Capteur 200MP'
  },
  {
    name: 'zoom-10x.jpg',
    url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200&q=80', // Lens zoom
    description: 'Zoom optique 10x'
  },
  {
    name: 'ia-photo.jpg',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80', // AI technology
    description: 'IA génération photo'
  }
];

// Créer le dossier si nécessaire
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Fonction pour télécharger une image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imageDir, filename);
    
    // Vérifier si le fichier existe déjà
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${filename} existe déjà`);
      resolve();
      return;
    }
    
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    console.log(`⬇️  Téléchargement de ${filename}...`);
    
    protocol.get(url, (response) => {
      // Suivre les redirections
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Erreur HTTP ${response.statusCode} pour ${filename}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ ${filename} téléchargé avec succès`);
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

// Télécharger toutes les images
async function downloadAll() {
  console.log('🚀 Téléchargement des images camera...\n');
  console.log(`📂 Dossier cible: ${imageDir}\n`);
  
  for (const img of images) {
    try {
      await downloadImage(img.url, img.name);
    } catch (error) {
      console.error(`❌ Erreur pour ${img.name}:`, error.message);
    }
  }
  
  console.log('\n✅ Téléchargement terminé !');
  console.log(`\n📍 Images sauvegardées dans:\n   ${imageDir}`);
}

downloadAll();
