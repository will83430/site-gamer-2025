/**
 * SCRIPT DE NETTOYAGE JSON POUR NODE.JS
 * Corrige tous les problèmes en une seule fois
 */

const fs = require('fs');
const path = require('path');

function nettoyerJSONComplet(jsonArray) {
    console.log('🧹 Nettoyage du JSON en cours...');
    
    const jsonNettoye = jsonArray.map((item, index) => {
        const itemClean = { ...item };
        
        // 1. AJOUTER ID UNIQUE si manquant
        if (!itemClean.id) {
            itemClean.id = `prod_${index + 1}`;
        }
        
        // 2. UNIFORMISER les noms de champs (CORRIGÉ)
        // Convertir "donnees fiche" (avec espace) vers "donnees_fiche" (avec underscore)
        if (itemClean["donnees fiche"]) {
            itemClean.donnees_fiche = itemClean["donnees fiche"];
            delete itemClean["donnees fiche"]; // Supprimer l'ancien champ avec espace
        }
        
        // 3. NETTOYER les tableaux "donnees_fiche" (nom corrigé)
        if (itemClean.donnees_fiche && Array.isArray(itemClean.donnees_fiche)) {
            // Normaliser et nettoyer chaque élément
            const normalises = itemClean.donnees_fiche
                .map(text => {
                    if (!text) return '';
                    
                    // Nettoyer le texte : espaces, sauts de ligne, virgules
                    return text.toString()
                        .trim()                          // Supprimer espaces début/fin
                        .replace(/,$/, '')               // Supprimer virgule finale
                        .replace(/\s+/g, ' ')           // Normaliser les espaces multiples
                        .replace(/\n\s*/g, '\n')        // Normaliser les sauts de ligne
                        .trim();
                })
                .filter(text => text.length > 0);      // Supprimer les éléments vides
            
            // Supprimer les VRAIS doublons (contenu identique après normalisation)
            const unique = [];
            const seen = new Set();
            
            normalises.forEach(text => {
                // Créer une "signature" du texte pour détecter les doublons
                const signature = text
                    .toLowerCase()                      // Ignorer la casse
                    .replace(/[^\w\s]/g, '')           // Supprimer la ponctuation
                    .replace(/\s+/g, ' ')              // Normaliser les espaces
                    .trim();
                
                if (!seen.has(signature)) {
                    seen.add(signature);
                    unique.push(text);
                }
            });
            
            itemClean.donnees_fiche = unique;
            
            // Debug pour voir les doublons supprimés
            if (normalises.length !== unique.length) {
                console.log(`   🧹 ${itemClean.nom}: ${normalises.length - unique.length} doublon(s) supprimé(s)`);
            }
        }
        
        // 4. NETTOYER les autres tableaux (VERSION AMÉLIORÉE)
        ['fonctionnalites_avancees', 'tags'].forEach(field => {
            if (itemClean[field] && Array.isArray(itemClean[field])) {
                const normalises = itemClean[field]
                    .map(text => text ? text.toString().trim().replace(/,$/, '').replace(/\s+/g, ' ') : '')
                    .filter(text => text.length > 0);
                
                // Supprimer les vrais doublons
                const unique = [];
                const seen = new Set();
                
                normalises.forEach(text => {
                    const signature = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
                    if (!seen.has(signature)) {
                        seen.add(signature);
                        unique.push(text);
                    }
                });
                
                itemClean[field] = unique;
            }
        });
        
        // 5. NETTOYER les chaînes de caractères
        ['nom', 'description', 'prix', 'categorie'].forEach(field => {
            if (itemClean[field] && typeof itemClean[field] === 'string') {
                itemClean[field] = itemClean[field].trim();
            }
        });
        
        return itemClean;
    });
    
    console.log(`✅ Nettoyage terminé: ${jsonNettoye.length} éléments traités`);
    return jsonNettoye;
}

/**
 * FONCTION POUR NETTOYER UN FICHIER JSON
 */
function nettoyerFichierJSON(cheminEntree, cheminSortie = null) {
    try {
        console.log(`📂 Chargement de ${cheminEntree}...`);
        
        // Vérifier que le fichier existe
        if (!fs.existsSync(cheminEntree)) {
            throw new Error(`Fichier non trouvé: ${cheminEntree}`);
        }
        
        // Charger le JSON
        const contenuFichier = fs.readFileSync(cheminEntree, 'utf8');
        const dataOriginale = JSON.parse(contenuFichier);
        
        console.log(`📊 ${dataOriginale.length} éléments trouvés`);
        
        // Nettoyer
        const dataNettoye = nettoyerJSONComplet(dataOriginale);
        
        // Définir le nom du fichier de sortie
        if (!cheminSortie) {
            const dir = path.dirname(cheminEntree);
            const nom = path.basename(cheminEntree, '.json');
            cheminSortie = path.join(dir, `${nom}_nettoye.json`);
        }
        
        // Sauvegarder
        fs.writeFileSync(cheminSortie, JSON.stringify(dataNettoye, null, 2), 'utf8');
        
        console.log(`💾 Fichier sauvegardé: ${cheminSortie}`);
        
        // Afficher le résumé
        console.log('\n📋 RÉSUMÉ DU NETTOYAGE:');
        console.log(`   ✅ IDs ajoutés aux éléments sans ID`);
        console.log(`   ✅ Champs uniformisés (donnees_fiche)`);
        console.log(`   ✅ Doublons supprimés dans les tableaux`);
        console.log(`   ✅ Virgules en trop supprimées`);
        console.log(`   ✅ Espaces inutiles nettoyés`);
        console.log(`\n📁 Fichier original: ${cheminEntree}`);
        console.log(`📁 Fichier nettoyé: ${cheminSortie}`);
        
        return dataNettoye;
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

/**
 * FONCTION POUR ANALYSER AVANT NETTOYAGE
 */
function analyserJSON(cheminFichier) {
    try {
        console.log(`🔍 Analyse de ${cheminFichier}...`);
        
        const contenuFichier = fs.readFileSync(cheminFichier, 'utf8');
        const data = JSON.parse(contenuFichier);
        
        let sansID = 0;
        let avecDoublons = 0;
        let champsInconsistants = 0;
        
        data.forEach((item, index) => {
            if (!item.id) sansID++;
            
            if (item.donnees_fiche && item["donnees fiche"]) {
                champsInconsistants++;
            }
            
            if (item["donnees fiche"] && Array.isArray(item["donnees fiche"])) {
                const unique = new Set(item["donnees fiche"]);
                if (unique.size !== item["donnees fiche"].length) {
                    avecDoublons++;
                }
            }
        });
        
        console.log('\n📊 ANALYSE:');
        console.log(`   • Total éléments: ${data.length}`);
        console.log(`   • Sans ID: ${sansID}`);
        console.log(`   • Avec doublons: ${avecDoublons}`);
        console.log(`   • Champs inconsistants: ${champsInconsistants}`);
        
        return { total: data.length, sansID, avecDoublons, champsInconsistants };
        
    } catch (error) {
        console.error('❌ Erreur analyse:', error.message);
        process.exit(1);
    }
}

// ===================================
// EXÉCUTION AUTOMATIQUE
// ===================================

// Chemins possibles pour votre fichier
const cheminsPossibles = [
    'frontend/public/data/equipements.json',
    'frontend/public/data/equipements-old.json',
    'data/equipements.json',
    'data/equipements-old.json',
    'equipements.json',
    'equipements-old.json'
];

let cheminTrouve = null;

// Chercher le fichier
for (const chemin of cheminsPossibles) {
    if (fs.existsSync(chemin)) {
        cheminTrouve = chemin;
        break;
    }
}

if (cheminTrouve) {
    console.log(`🎯 Fichier trouvé: ${cheminTrouve}`);
    
    // Analyser d'abord
    analyserJSON(cheminTrouve);
    
    console.log('\n🧹 Démarrage du nettoyage...');
    
    // Nettoyer
    nettoyerFichierJSON(cheminTrouve);
    
    console.log('\n🎉 Nettoyage terminé avec succès !');
    
} else {
    console.log('❌ Fichier equipements.json non trouvé');
    console.log('📁 Cherché dans:');
    cheminsPossibles.forEach(chemin => console.log(`   • ${chemin}`));
    console.log('\n💡 Utilisation manuelle:');
    console.log('   node nettoyage.js');
    console.log('   Ou placez equipements.json dans le même dossier');
}

// Export pour utilisation en module
module.exports = {
    nettoyerJSONComplet,
    nettoyerFichierJSON,
    analyserJSON
};