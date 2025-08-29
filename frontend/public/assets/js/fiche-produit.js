// assets/js/fiche-produit.js - VERSION PROPRE ET SIMPLE
// Remplace complètement votre ancien fichier

const API_URL = 'http://localhost:3000/api';

// FONCTION PRINCIPALE - Une seule fonction qui fait tout
async function chargerDonneesProduit() {
    console.log('🔄 Chargement des données produit...');
    
    // 1. Récupérer automatiquement le nom du produit
    const nomProduit = document.querySelector('h1')?.textContent?.trim() || 
                       window.location.pathname.split('/').pop().replace('.html', '');
    
    console.log(`📄 Produit recherché: ${nomProduit}`);
    
    try {
        // 2. Charger UNIQUEMENT depuis PostgreSQL
        const response = await fetch(`${API_URL}/produits`);
        const data = await response.json();
        
        if (data.success && data.data) {
            // 3. Trouver le produit par nom exact
            const produit = data.data.find(p => 
                p.nom && p.nom.toLowerCase() === nomProduit.toLowerCase()
            );
            
            if (produit) {
                console.log('✅ Produit trouvé:', produit);
                afficherDonneesProduit(produit);
            } else {
                console.warn(`⚠️ Produit "${nomProduit}" non trouvé dans la base`);
                afficherErreurProduit(`Produit "${nomProduit}" non trouvé`);
            }
        } else {
            console.error('❌ Erreur API:', data.message);
            afficherErreurProduit('Erreur de chargement des données');
        }
    } catch (error) {
        console.error('❌ Erreur connexion:', error);
        afficherErreurProduit('Erreur de connexion à la base de données');
    }
}

// FONCTION D'AFFICHAGE - Affiche les données du produit
function afficherDonneesProduit(produit) {
    console.log('🎨 Affichage des données...');
    
    // 1. Badge top du mois
    if (produit.top_du_mois) {
        const badge = document.getElementById('badge-top-mois');
        if (badge) {
            badge.innerHTML = `
                <div style="background: linear-gradient(45deg, #ffd700, #ffed4e); 
                            padding: 10px; margin-bottom: 20px; text-align: center; 
                            border-radius: 8px; font-weight: bold;">
                    ⭐ Ce produit est en vedette ce mois-ci !
                </div>
            `;
        }
    }
    
    // 2. Description
    const description = document.querySelector('.description');
    if (description && produit.description) {
        description.textContent = produit.description;
    }
    
    // 3. Image
    const img = document.querySelector('.gallery img, .img-centree');
    if (img && (produit.image_data || produit.image)) {
        img.src = produit.image_data || produit.image;
        img.onerror = () => img.src = '../../assets/images/placeholder.png';
    }
    
    // 4. Contenu principal (sections organisées)
    const contentDiv = document.getElementById('product-content');
    if (contentDiv && produit.donnees_fiche && produit.donnees_fiche.length > 0) {
        let html = '';
        
        // Sections selon la catégorie
        const sections = getSectionsParCategorie(produit.categorie);
        
        sections.forEach(section => {
            if (produit.donnees_fiche[section.index] && produit.donnees_fiche[section.index].trim()) {
                html += `
                    <div style="margin: 15px 0;">
                        <p>${produit.donnees_fiche[section.index].replace(/\\n/g, '<br>').replace(/\n/g, '<br>')}</p>
                    </div>
                `;
            }
        });
        
        contentDiv.innerHTML = html || '<p>Informations détaillées à venir...</p>';
    }
    
    // 5. Prix séparé si pas dans donnees_fiche
    if (produit.prix && !produit.donnees_fiche?.some(d => d.includes('€'))) {
        const contentDiv = document.getElementById('product-content');
        if (contentDiv) {
            contentDiv.innerHTML = `<p><strong>💰 Prix :</strong> ${produit.prix}</p>` + contentDiv.innerHTML;
        }
    }
}

// FONCTION UTILITAIRE - Sections par catégorie
function getSectionsParCategorie(categorie) {
    const sectionsBase = [
        { index: 0, titre: "Description" },
        { index: 1, titre: "Prix" },
        { index: 2, titre: "Spécifications" }
    ];
    
    const sectionsSpecifiques = {
        'CONSOLE': [
            { index: 3, titre: "Écran et affichage" },
            { index: 4, titre: "Contrôleurs" }
        ],
        'TABLETTE': [
            { index: 3, titre: "Écran et affichage" },
            { index: 4, titre: "Accessoires" }
        ],
        'DRONE': [
            { index: 3, titre: "Fonctions vidéo" }
        ],
        'SMARTPHONE': [
            { index: 3, titre: "Appareil photo" }
        ],
        'PC GAMING': [
            { index: 3, titre: "Fonctions gaming" }
        ],
        'CASQUE AUDIO': [
            { index: 3, titre: "Fonctions audio" }
        ]
    };
    
    const sections = [...sectionsBase];
    if (sectionsSpecifiques[categorie]) {
        sections.push(...sectionsSpecifiques[categorie]);
    }
    
    // Sections finales communes
    sections.push(
        { index: sections.length, titre: "Connectivité" },
        { index: sections.length + 1, titre: "Expérience utilisateur" }
    );
    
    return sections;
}

// FONCTION D'ERREUR - Affiche les erreurs
function afficherErreurProduit(message) {
    const contentDiv = document.getElementById('product-content');
    if (contentDiv) {
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #666;">
                <p>❌ ${message}</p>
                <p>Vérifiez que :</p>
                <ul style="text-align: left; margin: 10px 0;">
                    <li>Le serveur Node.js est lancé (node server.js)</li>
                    <li>PostgreSQL est démarré</li>
                    <li>Le produit existe dans la base de données</li>
                </ul>
            </div>
        `;
    }
}

// AUTO-LANCEMENT au chargement de la page
document.addEventListener('DOMContentLoaded', chargerDonneesProduit);