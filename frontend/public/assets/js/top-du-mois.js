// assets/js/top-du-mois.js — Logique de la page top-du-mois.html

// =========================
// Configuration API
// =========================
const API_URL = (() => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = "3000";
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:3000/api";
  }
  return `${protocol}//${hostname}:${port}/api`;
})();

// =========================
/* État global */
// =========================
let produitsParCategorie = {};
let categoriesAvecTop = new Set();

// =========================
/* Bootstrap */
// =========================
document.addEventListener("DOMContentLoaded", async () => {
  afficherDateMois();
  await chargerProduitsDepuisBDD();
  mettreAJourBadgesVedettes();
  configurerLiensCategories();
  verifierConnexionServeur();
  injecterAnimationsGlobales();
});

// Rafraîchissement périodique (30 s)
setInterval(async () => {
  await chargerProduitsDepuisBDD();
  mettreAJourBadgesVedettes();
}, 30000);

// =========================
/* Afficher la date du mois */
// =========================
function afficherDateMois() {
  const dateElement = document.getElementById("date-mois");
  if (!dateElement) return;
  const mois = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  dateElement.textContent = `📅 ${mois.charAt(0).toUpperCase() + mois.slice(1)}`;
}

// =========================
/* Charger les produits depuis l'API */
// =========================
async function chargerProduitsDepuisBDD() {
  try {
    const response = await fetch(`${API_URL}/produits`);
    const data = await response.json();

    if (data?.success && Array.isArray(data.data)) {
      produitsParCategorie = {};
      categoriesAvecTop = new Set();

      data.data.forEach((produit) => {
        const cat = produit?.categorie;
        if (!cat) return;

        if (!produitsParCategorie[cat]) {
          produitsParCategorie[cat] = [];
        }
        produitsParCategorie[cat].push(produit);

        if (produit.top_du_mois) {
          categoriesAvecTop.add(cat);
        }
      });
    } else {
      console.warn("⚠️ Aucun produit trouvé dans la base");
    }
  } catch (error) {
    console.error("❌ Erreur lors du chargement des produits:", error);
    afficherNotification("Impossible de charger les produits. Vérifiez que le serveur est lancé.", "error");
  }
}

// =========================
/* Mettre à jour les badges vedettes */
// =========================
function mettreAJourBadgesVedettes() {
  const cards = document.querySelectorAll(".category-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const categorie = card.dataset.category;
    if (!categorie) return;
    if (!categoriesAvecTop.has(categorie)) return;

    const overlayText = card.querySelector(".overlay-text");
    if (overlayText && !overlayText.querySelector(".vedette-badge")) {
      const badge = document.createElement("span");
      badge.className = "vedette-badge";
      badge.innerHTML = "⭐ TOP";
      badge.style.cssText = `
        background: linear-gradient(45deg, #ff6b6b, #ffd700);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
        display: inline-block;
        margin-left: 8px;
        animation: pulse 2s infinite;
      `;
      overlayText.appendChild(badge);
    }

    const bloc = card.querySelector(".bloc");
    if (bloc) {
      bloc.style.border = "3px solid #ffd700";
      bloc.style.boxShadow = "0 0 20px rgba(255, 215, 0, 0.5)";

      if (!card.querySelector(".badge-top-month")) {
        const badgeTop = document.createElement("div");
        badgeTop.className = "badge-top-month";
        badgeTop.textContent = "Top • Jan.";
        badgeTop.style.cssText = `
          position: absolute;
          top: 8px;
          left: 8px;
          background: linear-gradient(90deg,#f093fb,#667eea);
          color: white;
          padding: 6px 10px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 12px;
          box-shadow: 0 6px 18px rgba(102,126,234,0.18);
        `;
        bloc.appendChild(badgeTop);
      }
    }
  });
}

// =========================
/* Configurer liens + compteur */
// =========================
function configurerLiensCategories() {
  const cards = document.querySelectorAll(".category-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const categorie = card.dataset.category;
    if (!categorie) return;

    // Si c'est un <a>, on met le href. Sinon, on ne force pas.
    if (typeof card.href !== "undefined") {
      card.href = `fiches.html?categorie=${encodeURIComponent(categorie)}`;
    } else {
      card.setAttribute("data-target-url", `fiches.html?categorie=${encodeURIComponent(categorie)}`);
    }

    const produitsCount = produitsParCategorie[categorie]?.length || 0;
    const topCount = produitsParCategorie[categorie]?.filter((p) => p.top_du_mois).length || 0;
    const bloc = card.querySelector(".bloc");

    if (bloc && produitsCount > 0 && !bloc.querySelector(".product-count")) {
      const countBadge = document.createElement("div");
      countBadge.className = "product-count";
      countBadge.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: bold;
      `;
      if (topCount > 0) {
        countBadge.innerHTML = `${produitsCount} produits<br><span style="color: #ffd700;">⭐ ${topCount} TOP</span>`;
      } else {
        countBadge.textContent = `${produitsCount} produits`;
      }
      bloc.appendChild(countBadge);
    }

    // Aperçu au survol
    card.addEventListener("mouseenter", function () {
      if (produitsParCategorie[categorie]?.length) {
        afficherApercu(categorie, this);
      }
    });

    card.addEventListener("mouseleave", function () {
      masquerApercu();
    });
  });
}

// =========================
/* Aperçu des produits au survol */
// =========================
function afficherApercu(categorie, element) {
  masquerApercu();

  const produits = produitsParCategorie[categorie];
  if (!produits || !produits.length) return;

  const apercu = document.createElement("div");
  apercu.id = "apercu-produits";
  apercu.className = "apercu-produits";
  apercu.style.cssText = `
    position: absolute;
    background: rgba(0, 0, 0, 0.95);
    color: white;
    padding: 15px;
    border-radius: 10px;
    z-index: 1000;
    min-width: 250px;
    max-width: 350px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    animation: fadeIn 0.3s ease;
  `;

  const topProduits = produits.filter((p) => p.top_du_mois).slice(0, 3);
  const autresProduits = produits.filter((p) => !p.top_du_mois).slice(0, 2);

  let contenuHTML = `<h4 style="margin: 0 0 10px 0; color: #ffd700;">📦 ${categorie}</h4>`;

  if (topProduits.length) {
    contenuHTML += '<div style="margin-bottom: 10px;"><strong style="color: #ffd700;">⭐ Top du mois:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
    topProduits.forEach((p) => {
      contenuHTML += `<li style="margin: 3px 0;">${p.nom} ${p.prix ? "- " + p.prix : ""}</li>`;
    });
    contenuHTML += "</ul></div>";
  }

  if (autresProduits.length) {
    contenuHTML += '<div><strong>Autres produits:</strong><ul style="margin: 5px 0; padding-left: 20px;">';
    autresProduits.forEach((p) => {
      contenuHTML += `<li style="margin: 3px 0;">${p.nom}</li>`;
    });
    contenuHTML += "</ul></div>";
  }

  contenuHTML += `<div style="margin-top: 10px; font-size: 12px; color: #aaa;">Cliquez pour voir tous les ${produits.length} produits →</div>`;
  apercu.innerHTML = contenuHTML;

 const rect = element.getBoundingClientRect();
const scrollTop = window.scrollY || document.documentElement.scrollTop;
const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

apercu.style.left = scrollLeft + rect.right + 10 + "px";
apercu.style.top = scrollTop + rect.top + "px";

  document.body.appendChild(apercu);

  const apercuRect = apercu.getBoundingClientRect();
  if (scrollLeft + apercuRect.right > window.innerWidth) {
  apercu.style.left = scrollLeft + rect.left - apercuRect.width - 10 + "px";
}
}

// =========================
/* Masquer l'aperçu */
// =========================
function masquerApercu() {
  const apercu = document.getElementById("apercu-produits");
  if (apercu) apercu.remove();
}

// =========================
/* Notifications */
// =========================
function afficherNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  `;

  const styles = {
    success: "background: linear-gradient(45deg, #28a745, #20c997);",
    error: "background: linear-gradient(45deg, #dc3545, #c82333);",
    info: "background: linear-gradient(45deg, #17a2b8, #138496);",
    warning: "background: linear-gradient(45deg, #ffc107, #e0a800);",
  };

  notification.style.cssText += styles[type] || styles["info"];
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// =========================
/* Animations globales (CSS-in-JS) */
// =========================
function injecterAnimationsGlobales() {
  if (document.getElementById("animations-globales")) return;
  const style = document.createElement("style");
  style.id = "animations-globales";
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}

// =========================
/* Vérifier la connexion serveur */
// =========================
async function verifierConnexionServeur() {
  try {
    const response = await fetch(`${API_URL}/test`);
    const data = await response.json();
    if (data?.success) {
      afficherNotification("Connexion au serveur réussie!", "success");
      return true;
    }
    throw new Error("Réponse invalide");
  } catch (error) {
    console.error("❌ Serveur non accessible:", error);
    afficherNotification("⚠️ Le serveur n'est pas lancé. Lancez: node server.js", "error");
    return false;
  }
}

// =========================
/* Export debug (facultatif) */
// =========================
window.topDuMois = {
  API_URL,
  produitsParCategorie,
  categoriesAvecTop,
  chargerProduitsDepuisBDD,
  afficherNotification,
  afficherApercu,
  masquerApercu,
};