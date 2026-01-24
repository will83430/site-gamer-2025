const CACHE_NAME = 'gamer2025-cache-v2';
const filesToCache = [
  '/index.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  "/fiches.html",
          "/Gestion des produits et génération automatique.html",
          "/index.html",
          "/offline.html",
          "/top-du-mois.html",
          "fiche.html",
          "/assets/css/style.css",
          "/assets/css/styles.css",
          "/assets/css/styles.min.css",
          "/assets/images/apple-ipad-pro-m4.png",
          "/assets/images/apple-watch-series-10.png",
          "/assets/images/apple-watch-series-9.png",
          "/assets/images/asus-rog-ally-x.png",
          "/assets/images/asus-rog-strix-g18-2.png",
          "/assets/images/asus-rog-strix-g18.png",
          "/assets/images/autel-evo-max-5g.png",
          "/assets/images/autel-nano-plus.png",
          "/assets/images/banniere-pied.png",
          "/assets/images/beyerdynamic-amiron-100.png",
          "/assets/images/bose-quietcomfort-45.png",
          "/assets/images/box-internet.png",
          "/assets/images/camera.png",
          "/assets/images/canon-eos-r6-mark-ii.png",
          "/assets/images/capteurs-et-objets-c.png",
          "/assets/images/casque-audio.png",
          "/assets/images/casque-vr.png",
          "/assets/images/console.png",
          "/assets/images/corsair-one-i500.png",
          "/assets/images/creality-ender-3-v3.png",
          "/assets/images/creality-ender-5-neo.png",
          "/assets/images/creality-halot-mage-s-14k.png",
          "/assets/images/dell-poweredge-r760.png",
          "/assets/images/dell-poweredge-r960.png",
          "/assets/images/dji-air-3s.png",
          "/assets/images/dji-mavic-4-pro.png",
          "/assets/images/dji-mini-5-pro.png",
          "/assets/images/drone-dji-air-3.png",
          "/assets/images/drone-dji-phantom-pro.png",
          "/assets/images/drone-skytech-aero-drone.png",
          "/assets/images/drone-surrounded-by-.png",
          "/assets/images/drone-x-pro-2025.png",
          "/assets/images/drone.png",
          "/assets/images/ecran-tv.png",
          "/assets/images/epson-eh-ls12000b.png",
          "/assets/images/etoile-blanche.png",
          "/assets/images/freebox-ultra.png",
          "/assets/images/galaxy-tab-s10-fe-1.png",
          "/assets/images/galaxy-tab-s10-fe-de.png",
          "/assets/images/galaxy-tab-s10-fe.png",
          "/assets/images/gaming.png",
          "/assets/images/garmin-fenix-8.png",
          "/assets/images/google-pixel-10.png",
          "/assets/images/hkmlc-smart-board-explorer-elite-dual-75.png",
          "/assets/images/honor-200-pro.png",
          "/assets/images/honor-220-pro-2.png",
          "/assets/images/honor-220-pro-3.png",
          "/assets/images/honor-220-pro-4.png",
          "/assets/images/honor-220-pro-5.png",
          "/assets/images/honor-220-pro-6.png",
          "/assets/images/honor-220-pro.png",
          "/assets/images/imprimante-3d.png",
          "/assets/images/insta360-x5.png",
          "/assets/images/lg-oled65-g3.png",
          "/assets/images/lg-oled65-g5.png",
          "/assets/images/logitech-mx-master-4s.png",
          "/assets/images/logo-blanc.png",
          "/assets/images/logo-dokk-blanc.png",
          "/assets/images/meta-quest-3.png",
          "/assets/images/microsoft-surface-pro-x-2025.png",
          "/assets/images/montre-connectee.png",
          "/assets/images/nintendo-switch-2-pro.png",
          "/assets/images/parrot-anafi-usa.png",
          "/assets/images/pc-gaming.png",
          "/assets/images/peripheriques.png",
          "/assets/images/placeholder.png",
          "/assets/images/playstation-5-slim.png",
          "/assets/images/redmagic-astra.png",
          "/assets/images/samsung-flip-pro-2025.png",
          "/assets/images/samsung-galaxy-s25-ultra.png",
          "/assets/images/samsung-galaxy-tab-s10-fe.png",
          "/assets/images/serveur.png",
          "/assets/images/skydio-x10.png",
          "/assets/images/smartphone-surrounde2.png",
          "/assets/images/smartphone.png",
          "/assets/images/sony-fx.png",
          "/assets/images/sony-wh-1000xm5.png",
          "/assets/images/steelseries-apex-pro-tkl-gen-3.png",
          "/assets/images/tableau-interactif.png",
          "/assets/images/tablette.png",
          "/assets/images/ultra-sombre.png",
          "/assets/images/ultra-sombre2.png",
          "/assets/images/un-logo-au-centre.png",
          "/assets/images/un-logo-sombre-ent.png",
          "/assets/images/un-r-seau-connect-a.png",
          "/assets/images/un-smartphone-centr-.png",
          "/assets/images/valerion-vision-master-pro-2.png",
          "/assets/images/vibox-pc-2.png",
          "/assets/images/vibox-pc-3.png",
          "/assets/images/vibox-x-215-sg.png",
          "/assets/images/vibox-x.png",
          "/assets/images/video-projecteur.png",
          "/assets/images/xbox-series-x.png",
          "/assets/js/admin-functions.js",
          "/assets/js/admin-postgres.js",
          "/assets/js/cache-manager.js",
          "/assets/js/fiche-produit.js",
          "/assets/js/fiche-produit.min.js",
          "/assets/js/fiches.js",
          "/assets/js/fiches.min.js",
          "/assets/js/home.js",
          "/assets/js/lazy-loading.js",
          "/assets/js/stats.js",
          "/assets/js/sw.js",
          "/assets/js/top-du-mois.js",
          "/assets/js/utils.js",
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache les fichiers un par un pour éviter l'erreur si un fichier n'existe pas
      return Promise.allSettled(
        filesToCache.map(url => 
          cache.add(url).catch(err => {
            console.warn(`Impossible de mettre en cache: ${url}`, err);
            return Promise.resolve(); // Continue même si un fichier échoue
          })
        )
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(res => {
        // Cache dynamique pour tout ce qui n'est pas déjà en cache
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resClone);
        });
        return res;
      }).catch(() => caches.match('/offline.html'));
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});
