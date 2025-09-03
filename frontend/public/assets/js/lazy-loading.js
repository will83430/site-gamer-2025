// lazy-loading.js - Script de lazy loading optimisé
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si IntersectionObserver est supporté
    if (!('IntersectionObserver' in window)) {
        // Fallback pour navigateurs anciens - charger toutes les images
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
        return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Charger l'image
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.remove('lazy');
                img.classList.add('loaded');
                
                // Arrêter d'observer cette image
                observer.unobserve(img);
            }
        });
    }, {
        // Charger l'image 50px avant qu'elle soit visible
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    // Observer toutes les images lazy
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
});