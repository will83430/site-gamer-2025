// Script pour la page d'accueil
document.addEventListener('DOMContentLoaded', function() {
    // Affiche "Bienvenue en Juillet 2025"
    const mois = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    
    const maintenant = new Date();
    const texte = `✨ Bienvenue en ${mois[maintenant.getMonth()]} ${maintenant.getFullYear()}`;
    
    const dateElement = document.getElementById("date-mois");
    if (dateElement) {
        dateElement.textContent = texte;
    }

    // Gestion du scroll fluide pour les liens internes
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optimisation des vidéos pour mobile
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Ajout de l'attribut playsinline pour iOS
        video.setAttribute('playsinline', '');
        
        // Gestion des erreurs de chargement
        video.addEventListener('error', function() {
            // Optionnel: remplacer par une image de fallback
        });

        // Pause vidéo quand elle n'est pas visible (économie de batterie)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => console.log('Erreur lecture vidéo:', e));
                } else {
                    video.pause();
                }
            });
        });
        
        observer.observe(video);
    });

    // Animation d'apparition au scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('h1, p, video, .cta');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
    };

    // Écoute du scroll
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Exécute une première fois au chargement
});