/**
 * HIGH-TECH 2026 - Theme Toggle System
 * Gère le mode sombre/clair avec persistance localStorage
 */

(function() {
    'use strict';

    const THEME_KEY = 'hightech2026-theme';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';

    // Variables CSS pour le thème clair
    const lightThemeVars = {
        '--bg-primary': '#f5f5f7',
        '--bg-secondary': '#ffffff',
        '--bg-elevated': '#ffffff',
        '--bg-card': '#ffffff',
        '--text-primary': '#1d1d1f',
        '--text-secondary': '#6e6e73',
        '--text-muted': '#86868b',
        '--border-color': '#d2d2d7',
        '--header-bg': 'rgba(255, 255, 255, 0.9)',
        '--card-bg': '#ffffff',
        '--input-bg': '#f5f5f7',
        '--footer-bg': '#1d1d1f'
    };

    // Variables CSS pour le thème sombre (défaut)
    const darkThemeVars = {
        '--bg-primary': '#0a0a0f',
        '--bg-secondary': '#12121a',
        '--bg-elevated': '#1a1a24',
        '--bg-card': '#16161e',
        '--text-primary': '#ffffff',
        '--text-secondary': '#a0a0b0',
        '--text-muted': '#6a6a7a',
        '--border-color': 'rgba(255, 255, 255, 0.1)',
        '--header-bg': 'rgba(10, 10, 15, 0.95)',
        '--card-bg': '#16161e',
        '--input-bg': '#1a1a24',
        '--footer-bg': '#0a0a0f'
    };

    function applyTheme(theme) {
        const vars = theme === LIGHT_THEME ? lightThemeVars : darkThemeVars;
        const root = document.documentElement;

        Object.entries(vars).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);

        updateToggleIcon(theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    function updateToggleIcon(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.innerHTML = theme === LIGHT_THEME ? '🌙' : '☀️';
            toggleBtn.title = theme === LIGHT_THEME ? 'Mode sombre' : 'Mode clair';
            toggleBtn.setAttribute('aria-label', theme === LIGHT_THEME ? 'Activer le mode sombre' : 'Activer le mode clair');
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem(THEME_KEY) || DARK_THEME;
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        applyTheme(newTheme);
    }

    function getCurrentTheme() {
        return localStorage.getItem(THEME_KEY) || DARK_THEME;
    }

    function createToggleButton() {
        if (document.getElementById('theme-toggle')) return;

        const btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.className = 'theme-toggle-btn';
        btn.innerHTML = getCurrentTheme() === LIGHT_THEME ? '🌙' : '☀️';
        btn.title = getCurrentTheme() === LIGHT_THEME ? 'Mode sombre' : 'Mode clair';
        btn.setAttribute('aria-label', 'Changer le thème');
        btn.onclick = toggleTheme;

        // Chercher le header pour y insérer le bouton
        const navContainer = document.querySelector('.nav-container');
        const navLinks = document.querySelector('.nav-links');

        if (navContainer) {
            // Style pour intégration dans le header
            Object.assign(btn.style, {
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid var(--border-color, rgba(255,255,255,0.2))',
                background: 'transparent',
                color: 'var(--text-primary, #fff)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                marginLeft: '1rem'
            });

            btn.onmouseenter = () => {
                btn.style.transform = 'scale(1.1)';
                btn.style.borderColor = '#d4ff00';
                btn.style.background = 'rgba(212, 255, 0, 0.1)';
            };
            btn.onmouseleave = () => {
                btn.style.transform = 'scale(1)';
                btn.style.borderColor = 'var(--border-color, rgba(255,255,255,0.2))';
                btn.style.background = 'transparent';
            };

            // Insérer dans nav-links pour rester groupé à droite
            if (navLinks) {
                navLinks.appendChild(btn);
            } else {
                navContainer.appendChild(btn);
            }
        } else {
            // Fallback: position fixe en haut à droite
            Object.assign(btn.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                border: '2px solid var(--border-color, rgba(255,255,255,0.2))',
                background: 'var(--bg-elevated, #1a1a24)',
                color: 'var(--text-primary, #fff)',
                fontSize: '1.3rem',
                cursor: 'pointer',
                zIndex: '9998',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            });

            btn.onmouseenter = () => {
                btn.style.transform = 'scale(1.1)';
                btn.style.borderColor = '#d4ff00';
            };
            btn.onmouseleave = () => {
                btn.style.transform = 'scale(1)';
                btn.style.borderColor = 'var(--border-color, rgba(255,255,255,0.2))';
            };

            document.body.appendChild(btn);
        }
    }

    function init() {
        const savedTheme = localStorage.getItem(THEME_KEY) || DARK_THEME;
        applyTheme(savedTheme);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createToggleButton);
        } else {
            createToggleButton();
        }
    }

    // API globale
    window.ThemeToggle = {
        toggle: toggleTheme,
        apply: applyTheme,
        getCurrent: getCurrentTheme,
        DARK: DARK_THEME,
        LIGHT: LIGHT_THEME
    };

    init();
})();
