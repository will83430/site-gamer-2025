const API_URL = "http://localhost:3000/api";
let produitsSelectionnes = [];
let categorieActuelle = "";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  categorieActuelle = urlParams.get("categorie") || "";
  if (categorieActuelle) {
    chargerProduitsCategorieDepuisBDD(categorieActuelle);
  } else {
    afficherToutesCategoriesDepuisBDD();
  }
  setupEventListeners();
});

async function chargerProduitsCategorieDepuisBDD(categorie) {
  try {
    const titreElement = document.getElementById("titre-categorie");
    const descElement = document.getElementById("desc-cat");
    titreElement.textContent = formatCategorieName(categorie);

    const descriptions = {
      DRONE: "Découvrez notre gamme de drones professionnels et de loisir",
      CONSOLE: "Les dernières consoles de jeux vidéo",
      TABLETTE: "Tablettes tactiles pour tous les usages",
      SMARTPHONE: "Smartphones dernière génération",
      "PC GAMING": "PC gaming haute performance",
      SERVEUR: "Serveurs professionnels et solutions d'hébergement",
      "CASQUE AUDIO": "Casques audio haute qualité",
      "MONTRE CONNECTE": "Montres connectées et trackers d'activité",
    };
    descElement.textContent =
      descriptions[categorie] || `Produits de la catégorie ${categorie}`;

    const response = await fetch(`${API_URL}/produits`);
    const data = await response.json();
    if (data.success) {
      const produitsFiltres = data.data.filter(
        (p) => p.categorie === categorie
      );
      afficherProduits(produitsFiltres);
    } else {
      throw new Error(data.error || "Erreur lors du chargement");
    }
  } catch (error) {
    console.error(error);
    afficherErreur(
      "Impossible de charger les produits depuis la base de données"
    );
  }
}

async function afficherToutesCategoriesDepuisBDD() {
  try {
    document.getElementById("titre-categorie").textContent =
      "Toutes les catégories";
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    if (data.success && data.stats.categories_detail) {
      afficherCategoriesDisponibles(data.stats.categories_detail);
    } else {
      const produitsResponse = await fetch(`${API_URL}/produits`);
      const produitsData = await produitsResponse.json();
      if (produitsData.success) {
        const categories = [
          ...new Set(
            produitsData.data.map((p) => p.categorie).filter((c) => c)
          ),
        ];
        afficherListeCategories(categories);
      }
    }
  } catch (error) {
    console.error(error);
    afficherErreur("Impossible de charger les catégories");
  }
}

function afficherProduits(produits) {
  const zonefiches = document.getElementById("zone-fiches");
  if (!produits || produits.length === 0) {
    zonefiches.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p>Aucun produit trouvé dans cette catégorie</p>
                <a href="index.html" class="btn">Retour à l'accueil</a>
            </div>
        `;
    return;
  }
  zonefiches.innerHTML = produits
    .map((produit) => {
      let imageUrl =
        produit.image_url || produit.image || produit.image_data || "";
      if (!imageUrl) imageUrl = "assets/images/placeholder.png";
      let ficheUrl = "#";
      if (produit.lien) {
        ficheUrl = produit.lien.startsWith("http")
          ? produit.lien
          : `http://localhost:3000/${produit.lien}`;
      }
      return `
            <div class="fiche-produit" data-id="${produit.id}">
                ${
                  produit.top_du_mois
                    ? '<span class="vedette-badge" style="position: absolute; top: 5px; right: 2px; background: #f7e376ff; color: #6c3a83ff;">⭐ Top du mois</span>'
                    : ""
                }
                <input type="checkbox" class="produit-checkbox" data-id="${
                  produit.id
                }" data-nom="${produit.nom}">
                <img src="${imageUrl}" alt="${
        produit.nom
      }" onerror="this.src='assets/images/placeholder.png'">
                <div class="overlay-text-produit">${produit.nom}</div>
                <p class="info">${
                  produit.description || "Description non disponible"
                }</p>
                <p class="info" style="color: #667eea; font-weight: bold;">${
                  produit.prix || "Prix non communiqué"
                }</p>
                ${
                  produit.fonctionnalites_avancees &&
                  produit.fonctionnalites_avancees.length > 0
                    ? `
                    <ul style="text-align: left; padding-left: 20px; margin: 10px 0;">
                        ${produit.fonctionnalites_avancees
                          .slice(0, 3)
                          .map(
                            (f) => `<li style="font-size: 0.9em;">✓ ${f}</li>`
                          )
                          .join("")}
                    </ul>
                `
                    : ""
                }
                ${
                  ficheUrl !== "#"
                    ? `
                    <a href="${ficheUrl}" target="_blank" class="btn btn-details">Voir la fiche</a>
                `
                    : `
                    <button class="btn btn-details" onclick="afficherDetailsModal(${produit.id})">Voir détails</button>
                `
                }
            </div>
        `;
    })
    .join("");
  setupComparisonCheckboxes();
}

/**
 * Met en place les listeners d'événement sur les boutons de la page
 *
 * Les boutons concernés sont :
 * - le bouton de retour (situé en haut à gauche de la page)
 * - le bouton de comparaison (situé en bas de la page)
 */
function setupEventListeners() {
  const btnRetour = document.getElementById("btn-retour");
  if (btnRetour) {
    btnRetour.addEventListener("click", () => {
      if (categorieActuelle) {
        window.location.href = "top-du-mois.html";
      } else {
        window.history.back();
      }
    });
  }
  const btnComparer = document.getElementById("btn-comparer");
  if (btnComparer) {
    btnComparer.addEventListener("click", comparerProduits);
  }
}

function setupComparisonCheckboxes() {
  document.querySelectorAll(".produit-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const produitId = e.target.dataset.id;
      const produitNom = e.target.dataset.nom;
      if (e.target.checked) {
        produitsSelectionnes.push({ id: produitId, nom: produitNom });
      } else {
        produitsSelectionnes = produitsSelectionnes.filter(
          (p) => p.id !== produitId
        );
      }
      document.getElementById("btn-comparer").style.display =
        produitsSelectionnes.length >= 2 ? "block" : "none";
    });
  });
}

async function comparerProduits() {
  if (produitsSelectionnes.length < 2) {
    alert("Veuillez sélectionner au moins 2 produits à comparer");
    return;
  }
  try {
    const zoneComparaison = document.getElementById("zone-comparaison");
    const comparaisonContent = document.getElementById("comparaison-content");
    comparaisonContent.innerHTML = "";

    const produitsDetails = await Promise.all(
      produitsSelectionnes.map(async (p) => {
        const response = await fetch(`${API_URL}/produits/${p.id}`);
        const data = await response.json();
        return data.success ? data.data : null;
      })
    );
    const produitsValides = produitsDetails.filter((p) => p !== null);
    if (produitsValides.length === 0) {
      alert("Impossible de charger les produits pour la comparaison");
      return;
    }

    comparaisonContent.innerHTML = `
          <div class="comparaison-grid">
            ${produitsValides
              .map(
                (p) => `
              <div class="fiche-comparaison">
                <img src="${
                  p.image || p.image_data || "assets/images/placeholder.png"
                }" alt="${p.nom || "Produit"}">
                <h4>${p.nom || "Sans nom"}</h4>
                <p class="info"><strong>Prix:</strong> ${p.prix || "N/C"}</p>
                <p class="info"><strong>Catégorie:</strong> ${
                  p.categorie || "N/C"
                }</p>
                <p class="info">${
                  p.description || "Description non disponible"
                }</p>
                ${
                  p.top_du_mois
                    ? '<p class="vedette-badge">⭐ Top du mois</p>'
                    : ""
                }
                ${
                  Array.isArray(p.fonctionnalites_avancees) &&
                  p.fonctionnalites_avancees.length
                    ? `<ul class="fonctionnalites">
                      ${p.fonctionnalites_avancees
                        .slice(0, 5)
                        .map((f) => `<li>${f}</li>`)
                        .join("")}
                    </ul>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>
 <div>
      <button class="btn"
        style="display:block;margin:20px auto;padding:12px 25px;
         background-color:var(--primary-color);color:white;
         border:none;border-radius:var(--border-radius);cursor:pointer;
         font-size:1rem;font-weight:600;text-align:center;
         transition:var(--transition);box-shadow:var(--box-shadow);"

        onclick="fermerComparaison()">
        Fermer la comparaison
      </button>
    </div>

    </div>

        `;

    // Afficher la zone de comparaison
    zoneComparaison.classList.remove("hidden");

    // Scroller vers la comparaison
    zoneComparaison.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Erreur lors de la comparaison:", error);
    alert("Erreur lors de la comparaison des produits");
  }
}

// Fermer la comparaison
function fermerComparaison() {
  const zoneComparaison = document.getElementById("zone-comparaison");
  zoneComparaison.classList.add("hidden");

  // Décocher toutes les checkboxes
  document
    .querySelectorAll(".produit-checkbox")
    .forEach((cb) => (cb.checked = false));
  produitsSelectionnes = [];

  // Masquer le bouton de comparaison
  const btnComparer = document.getElementById("btn-comparer");
  if (btnComparer) {
    btnComparer.style.display = "none";
  }
}

// Afficher les détails dans une modal (si pas de fiche)
async function afficherDetailsModal(produitId) {
  try {
    const response = await fetch(`${API_URL}/produits/${produitId}`);
    const data = await response.json();

    if (data.success && data.data) {
      const produit = data.data;

      // Créer une modal simple
      const modal = document.createElement("div");
      modal.className = "modal-overlay";
      modal.innerHTML = `
                <div class="modal-content">
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                    <h2>${produit.nom}</h2>
                    
                    ${
                      produit.image || produit.image_data
                        ? `
                        <img src="${
                          produit.image || produit.image_data
                        }" alt="${
                            produit.nom
                          }" style="max-width: 100%; margin: 20px 0;">
                    `
                        : ""
                    }
                    
                    <p><strong>Catégorie:</strong> ${produit.categorie}</p>
                    <p><strong>Prix:</strong> ${
                      produit.prix || "Non communiqué"
                    }</p>
                    <p><strong>Description:</strong> ${
                      produit.description || "Non disponible"
                    }</p>
                    
                    ${
                      produit.fonctionnalites_avancees &&
                      produit.fonctionnalites_avancees.length > 0
                        ? `
                        <h3>Fonctionnalités:</h3>
                        <ul>
                            ${produit.fonctionnalites_avancees
                              .map((f) => `<li>${f}</li>`)
                              .join("")}
                        </ul>
                    `
                        : ""
                    }
                    
                    ${
                      produit.donnees_fiche && produit.donnees_fiche.length > 0
                        ? `
                        <h3>Informations détaillées:</h3>
                        ${produit.donnees_fiche
                          .map((info) => `<p>${info}</p>`)
                          .join("")}
                    `
                        : ""
                    }
                </div>
            `;

      document.body.appendChild(modal);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des détails:", error);
    alert("Impossible de charger les détails du produit");
  }
}

// Fonctions utilitaires
function formatCategorieName(categorie) {
  const noms = {
    DRONE: "Drones",
    CONSOLE: "Consoles de Jeux",
    TABLETTE: "Tablettes",
    SMARTPHONE: "Smartphones",
    "PC GAMING": "PC Gaming",
    SERVEUR: "Serveurs",
    "CASQUE AUDIO": "Casques Audio",
    "MONTRE CONNECTE": "Montres Connectées",
  };
  return noms[categorie] || categorie;
}

function getCategorieIcon(categorie) {
  const icons = {
    DRONE: "🚁",
    CONSOLE: "🎮",
    TABLETTE: "📱",
    SMARTPHONE: "📱",
    "PC GAMING": "💻",
    SERVEUR: "🖥️",
    "CASQUE AUDIO": "🎧",
    "MONTRE CONNECTE": "⌚",
  };
  return icons[categorie] || "📦";
}

function afficherErreur(message) {
  const zonefiches = document.getElementById("zone-fiches");
  zonefiches.innerHTML = `
        <div class="message-erreur">
            <p>❌ ${message}</p>
            <a href="index.html" class="btn">Retour à l'accueil</a>
        </div>
    `;
}
