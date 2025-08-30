// admin-functions.js - Fonctions pour l'admin
// À placer dans frontend/public/assets/js/admin-functions.js

// Fonction pour générer la fiche HTML avec sections améliorées
async function generateFicheHTML(productId) {
    try {
        const response = await fetch(`${API_URL}/produits/${productId}`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Produit non trouvé');
        }
        
        const product = data.data;
        
        // Nettoyer le chemin d'image
        let imageClean = product.image_data || product.image || '';
        if (imageClean.startsWith('/')) {
            imageClean = imageClean.substring(1);
        }
        
        // Template de base amélioré
        let html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>${product.nom} - Fiche Produit</title>
    <link rel="stylesheet" href="../../assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Manrope&family=Montserrat&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="assets/js/admin-functions.js"></script>
</head>
<body>
    <div class="entete">
        <img src="../../assets/images/gaming.png" alt="Gaming">
        <a href="javascript:history.back()">← Retour</a>
    </div>

    <h1>${product.nom}</h1>`;

        // Badge top du mois
        if (product.top_du_mois) {
            html += `
    <div style="background:#ffde59;padding:8px;margin-bottom:10px;text-align:center;border-radius:8px;">
        ⭐ Ce produit est en vedette ce mois-ci !
    </div>`;
        }

        html += `
    <p class="description">${product.description || ''}</p>

    <div class="gallery">
        <img src="../../${imageClean}" alt="${product.nom}" class="img-centree" onerror="this.src='../../assets/images/placeholder.png'">
    </div>

    <div id="product-content">`;

        // Générer les sections selon la catégorie
        if (product.donnees_fiche && product.donnees_fiche.length > 0) {
            const sections = generateSectionsByCategory(product.categorie, product.donnees_fiche);
            html += sections;
        } else {
            html += '<p>Informations détaillées à venir...</p>';
        }

        html += `
    </div>

    <script>
        console.log('Fiche générée pour: ${product.nom}');
        
        // Fonction pour afficher des détails supplémentaires
        function toggleDetails(section) {
            const element = document.getElementById(section);
            if (element) {
                element.style.display = element.style.display === 'none' ? 'block' : 'none';
            }
        }
    </script>
</body>
</html>`;

        return html;
        
    } catch (error) {
        console.error('Erreur génération fiche:', error);
        throw error;
    }
}

// Fonction pour générer les sections selon la catégorie
function generateSectionsByCategory(categorie, donneesF = []) {
    const sectionsMap = {
        'DRONE': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "🎥 Fonctions vidéo et photo", index: 3 },
            { titre: "🌐 Connectivité", index: 4 },
            { titre: "🎮 Expérience utilisateur", index: 5 }
        ],
        'CONSOLE': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "🖥️ Écran et affichage", index: 3 },
            { titre: "🕹️ Contrôleurs et interaction", index: 4 },
            { titre: "🌐 Connectivité", index: 5 },
            { titre: "🎮 Expérience de jeu", index: 6 }
        ],
        'TABLETTE': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "🖥️ Écran et affichage", index: 3 },
            { titre: "🖊️ Accessoires et interaction", index: 4 },
            { titre: "🌐 Connectivité", index: 5 },
            { titre: "🎮 Applications et usages", index: 6 }
        ],
        'SMARTPHONE': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "📸 Appareil photo", index: 3 },
            { titre: "🌐 Connectivité", index: 4 },
            { titre: "🎮 Expérience utilisateur", index: 5 }
        ],
        'PC GAMING': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "🎮 Performances gaming", index: 3 },
            { titre: "🌐 Connectivité", index: 4 },
            { titre: "🎮 Expérience utilisateur", index: 5 }
        ],
        'SERVEUR': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "🖥️ Performances et virtualisation", index: 3 },
            { titre: "🌐 Connectivité réseau", index: 4 },
            { titre: "🎮 Gestion et monitoring", index: 5 }
        ],
        'CASQUE AUDIO': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "🎧 Fonctions audio", index: 3 },
            { titre: "🌐 Connectivité", index: 4 },
            { titre: "🎮 Confort et utilisation", index: 5 }
        ],
        'MONTRE CONNECTE': [
            { titre: "📝 Description détaillée", index: 0 },
            { titre: "💰 Prix et disponibilité", index: 1 },
            { titre: "🧩 Spécifications techniques", index: 2 },
            { titre: "⌚ Fonctions sport et santé", index: 3 },
            { titre: "🌐 Connectivité", index: 4 },
            { titre: "🎮 Applications et autonomie", index: 5 }
        ]
    };

    // Sections par défaut si catégorie non reconnue
    const defaultSections = [
        { titre: "📝 Description détaillée", index: 0 },
        { titre: "💰 Prix et disponibilité", index: 1 },
        { titre: "🧩 Spécifications techniques", index: 2 },
        { titre: "🌐 Connectivité", index: 3 },
        { titre: "🎮 Expérience utilisateur", index: 4 }
    ];

    const sections = sectionsMap[categorie] || defaultSections;
    
    let htmlSections = '';
    
    sections.forEach(section => {
    if (donneesF[section.index] && 
        donneesF[section.index].trim() !== '' && 
        donneesF[section.index].trim().length > 0) {
        
        // Extraire juste le contenu (enlever "📝 Titre\n")
        let contenu = donneesF[section.index];
        if (contenu.includes('\n')) {
            contenu = contenu.split('\n').slice(1).join('\n'); // Vire la première ligne
        }
        
        // Ne rien afficher si le contenu réel est vide
        if (contenu.trim().length > 0) {
            htmlSections += `
        <div class="section-fiche" style="margin: 20px 0; padding: 15px; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-bottom: 10px;">${section.titre}</h3>
            <p style="line-height: 1.6;">${contenu.replace(/\n/g, '<br>')}</p>
        </div>`;
        }
    }
});

    return htmlSections || '<p>Informations détaillées à venir...</p>';
}

// Fonction pour sauvegarder la fiche dans le bon dossier
async function saveFicheToFolder(html, categorie, fileName) {
    // Déterminer le dossier selon la catégorie
    const folderMap = {
        'SMARTPHONE': 'smartphone',
        'TABLETTE': 'tablette', 
        'PC GAMING': 'pc-gaming',
        'CONSOLE': 'console',
        'CASQUE AUDIO': 'casque-audio',
        'MONTRE CONNECTE': 'montre-connectee',
        'DRONE': 'drone',
        'SERVEUR': 'serveur'
    };
    
    const folderName = folderMap[categorie] || categorie.toLowerCase().replace(/\s+/g, '-');
    const fullPath = `fiches/${folderName}/${fileName}`;
    
    // Téléchargement automatique
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`Fiche sauvegardée: ${fullPath}`);
}

