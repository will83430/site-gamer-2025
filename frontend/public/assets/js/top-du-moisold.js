// ====================================
// SCRIPT POUR LA PAGE TOP DU MOIS
// ====================================

(async function () {
  console.log('🚀 Initialisation de la page Top du Mois');

  try {
    // Charger les données JSON
    const response = await fetch('data/equipements.json');
    const data = await response.json();

    // Extraire les catégories marquées "top_du_mois"
    const categoriesVedettes = data
      .filter(item => item.top_du_mois === true)
      .map(item => item.categorie.trim().toUpperCase());

    console.log('⭐ Catégories vedettes:', categoriesVedettes);

    // Ajouter les badges vedettes avec animation
    addVedetteBadges(categoriesVedettes);

    // Initialiser les interactions (si tu as d'autres fonctions)
    if (typeof initializeInteractions === 'function') {
      initializeInteractions();
    }

    console.log('✅ Page Top du Mois initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    if (typeof uiManager !== 'undefined' && uiManager.showToast) {
      uiManager.showToast('Erreur lors du chargement des données', 'error');
    }
  }
})();

// ====================================
// GESTION DES BADGES VEDETTES
// ====================================

function addVedetteBadges(categoriesVedettes) {
  const images = document.querySelectorAll(".bloc img");
  let badgesCount = 0;

  images.forEach(img => {
    const categoryName = img.alt.trim().toUpperCase();

    if (categoriesVedettes.includes(categoryName)) {
      const bloc = img.closest(".bloc");
      if (bloc && !bloc.querySelector('.vedette-badge')) {
        addBadgeToBloc(bloc, badgesCount * 100); // Délai échelonné
        badgesCount++;
      }
    }
  });

  console.log(`✨ ${badgesCount} badges vedettes ajoutés`);
}

function addBadgeToBloc(bloc, delay = 0) {
  bloc.style.position = "relative";

  const badge = document.createElement("div");
  badge.className = "vedette-badge";
  badge.innerHTML = `<span style="color: #6a00b3;">⭐ Vedette du Mois</span>`;

  badge.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    background: #f9e79f;
    padding: 5px 10px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 0.85em;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 10;
    opacity: 0;
    transform: translateY(-10px) scale(0.8);
    transition: all 0.6s ease;
  `;

  bloc.appendChild(badge);

  setTimeout(() => {
    badge.style.opacity = "1";
    badge.style.transform = "translateY(0) scale(1)";
  }, delay);

  bloc.addEventListener('mouseenter', () => {
    badge.style.transform = "translateY(0) scale(1.1)";
  });

  bloc.addEventListener('mouseleave', () => {
    badge.style.transform = "translateY(0) scale(1)";
  });
}


// ====================================
// INTERACTIONS DE LA PAGE
// ====================================

function initializeInteractions() {
    // Animation au scroll des sections
    initScrollAnimations();
    
    // Amélioration du hover des cartes
    enhanceCardHover();
    
    // Gestion des clics sur les catégories
    handleCategoryClicks();
    
    // Optimisation des images lazy loading
    initLazyLoading();
}

// Animation au scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                // Ne plus observer une fois animé
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer les sections et cartes
    document.querySelectorAll('.category-section, .bloc').forEach(element => {
        observer.observe(element);
    });
}

// Amélioration du hover des cartes
function enhanceCardHover() {
    const cards = document.querySelectorAll('.category-card');
    
    cards.forEach(card => {
        const bloc = card.querySelector('.bloc');
        if (!bloc) return;
        
        // Effet de profondeur au hover
        card.addEventListener('mouseenter', (e) => {
            bloc.style.transform = 'translateY(-8px) scale(1.02)';
            bloc.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
            
            // Effet sur l'image
            const img = bloc.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', (e) => {
            bloc.style.transform = 'translateY(0) scale(1)';
            bloc.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            
            // Reset de l'image
            const img = bloc.querySelector('img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
        
        // Effet de clic
        card.addEventListener('mousedown', () => {
            bloc.style.transform = 'translateY(-4px) scale(0.98)';
        });
        
        card.addEventListener('mouseup', () => {
            bloc.style.transform = 'translateY(-8px) scale(1.02)';
        });
    });
}

// Gestion des clics sur les catégories avec feedback
function handleCategoryClicks() {
    const categoryLinks = document.querySelectorAll('.category-card');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Effet visuel de clic
            const bloc = this.querySelector('.bloc');
            if (bloc) {
                bloc.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    bloc.style.transform = '';
                }, 150);
            }
            
            // Feedback utilisateur
            const categoryName = this.dataset.category || 
                               this.querySelector('img')?.alt || 
                               'cette catégorie';
            
            uiManager.showToast(`Chargement de ${categoryName}...`, 'info', 2000);
            
            // Optionnel: Analytics ou tracking
            console.log(`🔍 Clic sur catégorie: ${categoryName}`);
        });
    });
}

// Lazy loading optimisé
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Gestion des erreurs d'image
                    img.addEventListener('error', function() {
                        const fallbackText = this.alt || 'Image';
                        utils.handleImageError(this, fallbackText);
                    });
                    
                    // Effet de fondu lors du chargement
                    img.addEventListener('load', function() {
                        this.style.opacity = '0';
                        this.style.transition = 'opacity 0.3s ease';
                        setTimeout(() => {
                            this.style.opacity = '1';
                        }, 50);
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        // Observer toutes les images
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ====================================
// UTILITAIRES SPÉCIFIQUES À LA PAGE
// ====================================

// Fonction pour précharger les images importantes
function preloadCriticalImages() {
    const criticalImages = [
        'assets/images/gaming.png',
        'assets/images/banniere-pied.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Fonction pour gérer le retour en haut de page
function addScrollToTop() {
    let scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollToTopBtn);
    }
    
    // Affichage conditionnel du bouton
    const toggleScrollToTop = utils.debounce(() => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'scale(1)';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'scale(0)';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleScrollToTop);
    
    // Action du clic
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ====================================
// INITIALISATION FINALE
// ====================================

// Précharger les images critiques
preloadCriticalImages();

// Ajouter le bouton scroll to top
addScrollToTop();

// Message de debug pour le développement
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🛠️ Mode développement détecté');
    console.log('📊 Performance:', {
        imagesLazy: document.querySelectorAll('img[loading="lazy"]').length,
        categoryCards: document.querySelectorAll('.category-card').length,
        memoryUsage: navigator.memory ? `${Math.round(navigator.memory.usedJSHeapSize / 1048576)}MB` : 'N/A'
    });
}