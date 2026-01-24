// AJOUTEZ dans script.js ou créez theme-toggle.js

class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Récupérer le thème sauvegardé ou défaut
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Event listener pour le toggle
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTheme());
        }
        
        // Animation d'entrée
        setTimeout(() => {
            document.body.style.transition = 'all 0.3s ease';
        }, 100);
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', theme);
        
        // Animation du toggle
        this.animateToggle();
    }

    toggleTheme() {
        const isDark = document.body.classList.contains('dark-theme');
        this.setTheme(isDark ? 'light' : 'dark');
        
        // Effet visuel de transition
        this.flashTransition();
    }

    animateToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                toggleBtn.style.transform = 'scale(1)';
            }, 150);
        }
    }

    flashTransition() {
        // Petit effet flash lors du changement
        document.body.style.transition = 'none';
        document.body.style.filter = 'brightness(1.1)';
        
        setTimeout(() => {
            document.body.style.transition = 'all 0.3s ease';
            document.body.style.filter = 'brightness(1)';
        }, 100);
    }
}

// Initialiser le gestionnaire de thème
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});

// Version courte si vous préférez
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    toggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
}

// Appelez cette fonction si vous préférez la version simple
// document.addEventListener('DOMContentLoaded', initThemeToggle);