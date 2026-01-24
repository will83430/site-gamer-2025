// stats.js

// Vérifie que l'id est du type prod_X (X = 1 à 99999)
function isValidProdId(id) {
    if (typeof id !== "string") return false;
    const m = /^prod_(\d{1,5})$/.exec(id);
    if (!m) return false;
    const n = parseInt(m[1], 10);
    return n >= 1 && n <= 99999;
}

// Fonction principale pour mettre à jour les stats
function updateStats(jsonUrl) {
    fetch(jsonUrl)
        .then(res => res.json())
        .then(data => {
            const produits = Array.isArray(data) ? data : data.produits;

            // Produits totaux
            const validIds = produits
                .map(p => p.id)
                .filter(Boolean)
                .filter(isValidProdId);
            document.getElementById("total-products").textContent =
                new Set(validIds).size;

            // Catégories uniques
            const categories = produits
                .map(p => p.categorie)
                .filter(Boolean);
            document.getElementById("total-categories").textContent =
                new Set(categories).size;

            // Top du mois
            const featuredCount = produits.filter(p => p.top_du_mois === true).length;
            document.getElementById("featured-products").textContent = featuredCount;
        })
        .catch(err => console.error("Erreur JSON :", err));
}