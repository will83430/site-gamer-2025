class TendancesManager {
    constructor() {
        this.currentSection = 'actualites';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAnimations();
        this.loadLatestData();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section-tendances');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.getAttribute('data-section');
                this.switchSection(targetSection);
                
                // Update active button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    switchSection(sectionName) {
        const sections = document.querySelectorAll('.section-tendances');
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section with animation
        setTimeout(() => {
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                this.currentSection = sectionName;
                
                // Special animations for each section
                this.animateSection(sectionName);
            }
        }, 150);
    }

    animateSection(sectionName) {
        switch(sectionName) {
            case 'technologies':
                this.animateProgressBars();
                break;
            case 'marche':
                this.animateStats();
                break;
            case 'predictions':
                this.animateTimeline();
                break;
        }
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('#technologies .progress');
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            }, index * 200);
        });
    }

    animateStats() {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach((stat, index) => {
            setTimeout(() => {
                const finalValue = stat.textContent;
                const isNumber = !isNaN(parseFloat(finalValue));
                
                if (isNumber) {
                    this.countUpAnimation(stat, parseFloat(finalValue));
                } else {
                    stat.style.opacity = '0';
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'scale(1.1)';
                        setTimeout(() => {
                            stat.style.transform = 'scale(1)';
                        }, 200);
                    }, 100);
                }
            }, index * 300);
        });
    }

    countUpAnimation(element, target) {
        const originalText = element.textContent;
        const suffix = originalText.replace(/[\d.,]/g, '');
        const numTarget = parseFloat(originalText.replace(/[^\d.,]/g, ''));
        
        let current = 0;
        const increment = numTarget / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numTarget) {
                current = numTarget;
                clearInterval(timer);
            }
            
            element.textContent = current.toFixed(1) + suffix;
        }, 50);
    }

    animateTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-50px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.6s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100);
            }, index * 200);
        });
    }

    setupAnimations() {
        // Intersection Observer pour les animations au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observer tous les éléments animables
        const animatableElements = document.querySelectorAll('.actualite-card, .tech-card, .stat-card, .timeline-item');
        animatableElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    loadLatestData() {
        // Simulation de chargement de données en temps réel
        console.log('🔥 Tendances Gaming chargées !');
        
        // Mise à jour des dates
        this.updateDates();
        
        // Animation d'entrée
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    updateDates() {
        const dateElements = document.querySelectorAll('.date');
        const today = new Date();
        
        dateElements.forEach((el, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - index * 2);
            el.textContent = date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new TendancesManager();
});

// Fonctions utilitaires
function shareArticle(title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'Découvrez les dernières tendances gaming !',
            url: window.location.href
        });
    } else {
        // Fallback pour navigateurs non compatibles
        navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
    }
}

// Easter egg
let konamiCode = [];
const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konami.length) {
        konamiCode.shift();
    }
    if (JSON.stringify(konamiCode) === JSON.stringify(konami)) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 4000);
    }
});