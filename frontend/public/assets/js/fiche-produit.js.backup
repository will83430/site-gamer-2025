// assets/js/fiche-produit.js - Connexion des fiches HTML individuelles à PostgreSQL

// Configuration API
const API_URL = (() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = '3000';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    
    return `${protocol}//${hostname}:${port}/api`;
})();

// Fonction principale pour charger les données du produit depuis PostgreSQL
async function chargerDonneesProduit() {
    // Récupérer le nom du produit depuis le titre H1 de la page
    const h1Element = document.querySelector("h1");
    if (!h1Element) {
        console.error("Pas de titre H1 trouvé sur la page");
        return;
    }
    
    const nomProduit = h1Element.textContent.trim();
    console.log(`📄 Chargement des données pour: ${nomProduit}`);
    
    try {
        // Charger TOUS les produits depuis PostgreSQL
        const response = await fetch(`${API_URL}/produits`);
        const data = await response.json();
        
        if (data.success && data.data) {
            // Trouver le produit correspondant par nom
            const produit = data.data.find(p => 
                p.nom && p.nom.toLowerCase() === nomProduit.toLowerCase()
            );
            
            if (produit) {
                console.log("✅ Produit trouvé dans PostgreSQL:", produit);
                afficherDonneesProduit(produit);
            } else {
                console.warn(`⚠️ Produit "${nomProduit}" non trouvé dans PostgreSQL`);
                afficherContenuParDefaut();
            }
        } else {
            console.error("❌ Erreur lors du chargement des données");
            afficherContenuParDefaut();
        }
    } catch (error) {
        console.error("❌ Erreur de connexion à PostgreSQL:", error);
        console.log("💡 Assurez-vous que le serveur est lancé: node server.js");
        afficherContenuParDefaut();
    }
}

// Fonction pour afficher les données du produit
function afficherDonneesProduit(produit) {
    // 1. Badge top du mois
    const badgeContainer = document.getElementById("badge-top-mois");
    if (badgeContainer && produit.top_du_mois) {
        badgeContainer.innerHTML = `
            <div style="background: linear-gradient(45deg, #ffd700, #ffed4e); 
                        padding: 10px; 
                        margin-bottom: 20px; 
                        text-align: center; 
                        border-radius: 8px;
                        font-weight: bold;
                        box-shadow: 0 3px 10px rgba(255, 215, 0, 0.3);">
                ⭐ Ce produit est en vedette ce mois-ci !
            </div>
        `;
    }
    
    // 2. Description
    const descriptionElement = document.querySelector(".description");
    if (descriptionElement && produit.description) {
        descriptionElement.textContent = produit.description;
    }
    
    // 3. Image principale - CORRECTION POUR LE SLASH
const imgElement = document.querySelector(".gallery img");
if (imgElement) {
    // Récupérer l'image selon la priorité
    let imageSource = produit.image_url || produit.image_data || produit.image || '';
    
    console.log('🔍 Image brute depuis PostgreSQL:', imageSource);
    
    if (imageSource) {
        // Si c'est du base64, l'utiliser directement
        if (imageSource.startsWith('data:image/')) {
            console.log('🖼️ Image base64 détectée');
        }
        // Si c'est une URL complète HTTP, l'utiliser directement
        else if (imageSource.startsWith('http')) {
            console.log('🖼️ URL complète détectée');
        }
        // Sinon, c'est un chemin à traiter
        else {
            // ÉTAPE 1: Supprimer le "/" au début s'il existe
            if (imageSource.startsWith('/')) {
                imageSource = imageSource.substring(1);
                console.log('🔧 Slash supprimé:', imageSource);
            }
            
            // ÉTAPE 2: S'assurer que ça commence par "assets/images/"
            if (!imageSource.startsWith('assets/images/')) {
                imageSource = 'assets/images/' + imageSource;
                console.log('🔧 Chemin assets ajouté:', imageSource);
            }
            
            // ÉTAPE 3: Ajouter le chemin relatif pour les fiches (../../)
            imageSource = '../../' + imageSource;
            
            console.log('🖼️ Chemin final pour fiche:', imageSource);
        }
        
        // Appliquer l'image
        imgElement.src = imageSource;
        imgElement.alt = produit.nom;
        console.log('✅ Image mise à jour:', imageSource);
        
        // Gestion d'erreur de chargement
        imgElement.onerror = function() {
            console.warn('⚠️ Erreur chargement, fallback vers placeholder');
            this.src = '../../assets/images/placeholder.png';
        };
    } else {
        // Aucune image trouvée
        imageSource = '../../assets/images/placeholder.png';
        imgElement.src = imageSource;
        console.log('⚠️ Aucune image, placeholder utilisé');
    }
}
    
    // 4. Contenu principal (données de fiche)
    const contentDiv = document.getElementById("product-content");
    if (contentDiv) {
        contentDiv.innerHTML = "";
        
        // Si on a des données de fiche
        if (produit.donnees_fiche && produit.donnees_fiche.length > 0) {
            // Les données de fiche sont dans l'ordre défini dans l'admin
            const sections = [
                { emoji: "📝", titre: "Description détaillée", index: 0 },
                { emoji: "💰", titre: "Prix", index: 1 },
                { emoji: "🧩", titre: "Spécifications", index: 2 }
            ];
            
            // Ajouter les sections spécifiques selon la catégorie
            const sectionsParCategorie = {
                'DRONE': [
                    { emoji: "🎥", titre: "Fonctions vidéo", index: 3 }
                ],
                'CONSOLE': [
                    { emoji: "🖥️", titre: "Écran et affichage", index: 3 },
                    { emoji: "🕹️", titre: "Contrôleurs", index: 4 }
                ],
                'TABLETTE': [
                    { emoji: "🖥️", titre: "Écran et affichage", index: 3 },
                    { emoji: "🖊️", titre: "Accessoires", index: 4 }
                ],
                'SMARTPHONE': [
                    { emoji: "📸", titre: "Appareil photo", index: 3 }
                ],
                'PC GAMING': [
                    { emoji: "🎮", titre: "Fonctions gaming", index: 3 }
                ],
                'SERVEUR': [
                    { emoji: "🖥️", titre: "Performances", index: 3 }
                ],
                'CASQUE AUDIO': [
                    { emoji: "🎧", titre: "Fonctions audio", index: 3 }
                ],
                'MONTRE CONNECTE': [
                    { emoji: "⌚", titre: "Sport et santé", index: 3 }
                ],
                'CASQUE VR': [
                    { emoji: "🥽", titre: "Réalité virtuelle", index: 3 }
                ]
            };
            
            // Ajouter les sections spécifiques de la catégorie
            if (produit.categorie && sectionsParCategorie[produit.categorie]) {
                sections.push(...sectionsParCategorie[produit.categorie]);
            }
            
            // Ajouter les sections finales communes
            sections.push(
                { emoji: "🌐", titre: "Connectivité", index: sections.length },
                { emoji: "🎮", titre: "Expérience utilisateur", index: sections.length + 1 }
            );
            
            // Créer les paragraphes
            sections.forEach(section => {
                if (produit.donnees_fiche[section.index]) {
                    const p = document.createElement("p");
                    p.innerHTML = produit.donnees_fiche[section.index]
                        .replace(/\\n/g, "<br>")
                        .replace(/\n/g, "<br>");
                    contentDiv.appendChild(p);
                }
            });
        }
        
        // Ajouter le prix s'il existe et n'est pas déjà dans donnees_fiche
        if (produit.prix && !contentDiv.innerHTML.includes(produit.prix)) {
            const prixP = document.createElement("p");
            prixP.innerHTML = `<strong>💰 Prix :</strong> ${produit.prix}`;
            contentDiv.insertBefore(prixP, contentDiv.firstChild);
        }
        
        // SUPPRIMÉ : Les fonctionnalités avancées ne sont plus affichées
        // Si tu veux les réactiver plus tard, décommente le code ci-dessous :
        /*
        if (produit.fonctionnalites_avancees && produit.fonctionnalites_avancees.length > 0) {
            const featuresDiv = document.createElement("div");
            featuresDiv.innerHTML = `
                <h3 style="margin-top: 30px; color: #667eea;">✨ Fonctionnalités principales</h3>
                <ul style="line-height: 1.8;">
                    ${produit.fonctionnalites_avancees.map(f => `<li>${f}</li>`).join('')}
                </ul>
            `;
            contentDiv.appendChild(featuresDiv);
        }
        */
        
        // Si le contenu est toujours vide, afficher le contenu par défaut
        if (contentDiv.innerHTML === "") {
            afficherContenuParDefaut();
        }
    }
}

// Fonction pour afficher le contenu par défaut
function afficherContenuParDefaut() {
    const contentDiv = document.getElementById("product-content");
    if (contentDiv) {
        contentDiv.innerHTML = `
            <p style="color: #666; font-style: italic;">
                ℹ️ Les informations détaillées de ce produit ne sont pas encore disponibles dans la base de données.
            </p>
            <p>💰 <strong>Prix :</strong> À définir</p>
            <p>🧩 <strong>Spécifications :</strong> À remplir</p>
            <p>🌐 <strong>Fonctionnalités :</strong> À remplir</p>
            <p>🎮 <strong>Expérience :</strong> À remplir</p>
        `;
    }
}

// Fonction pour initialiser le lightbox
function initLightbox() {
    const gallery = document.querySelector(".gallery img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    
    if (gallery && lightbox && lightboxImg) {
        gallery.addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImg.src = gallery.src;
        });
        
        lightbox.addEventListener("click", () => {
            lightbox.style.display = "none";
        });
    }
}

// Vérifier la connexion au serveur
async function verifierConnexion() {
    try {
        const response = await fetch(`${API_URL}/test`);
        const data = await response.json();
        
        if (data.success) {
            console.log("✅ Connexion PostgreSQL établie");
            return true;
        }
    } catch (error) {
        console.error("❌ Serveur PostgreSQL non accessible");
        console.log("💡 Lancez le serveur: node server.js");
        return false;
    }
}

// Lancer le chargement au démarrage
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Initialisation de la fiche produit");
    
    // Vérifier la connexion
    const connected = await verifierConnexion();
    
    if (connected) {
        // Charger les données du produit
        await chargerDonneesProduit();
    } else {
        // Afficher un message d'erreur
        const contentDiv = document.getElementById("product-content");
        if (contentDiv) {
            contentDiv.innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    ⚠️ <strong>Erreur de connexion</strong><br>
                    Impossible de se connecter à la base de données PostgreSQL.<br>
                    Assurez-vous que le serveur est lancé avec: <code>node server.js</code>
                </div>
            ` + contentDiv.innerHTML;
        }
    }
    
    // Initialiser le lightbox
    initLightbox();
});

// Export pour utilisation globale si nécessaire
window.ficheProduit = {
    chargerDonneesProduit,
    afficherDonneesProduit,
    verifierConnexion
};