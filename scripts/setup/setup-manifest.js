// setup-manifest.js
const fs = require("fs");
const path = require("path");

// Dossier public
const publicDir = path.join(__dirname, "public");
const iconsDir = path.join(publicDir, "assets/images/icons");

// Création des dossiers si besoin
fs.mkdirSync(iconsDir, { recursive: true });

// Contenu minimal du manifest
const manifest = {
  name: "Gamer2025",
  short_name: "Gamer2025",
  start_url: ".",
  display: "standalone",
  background_color: "#667eea",
  theme_color: "#667eea",
  description: "Site gamer 2025 sur mobile",
  icons: [
    {
      src: "assets/images/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "assets/images/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png"
    }
  ]
};

// Écriture du manifest.json
fs.writeFileSync(
  path.join(publicDir, "manifest.json"),
  JSON.stringify(manifest, null, 2),
  "utf-8"
);

console.log("✅ manifest.json créé dans /public");
console.log("👉 Place tes icônes dans :", iconsDir);