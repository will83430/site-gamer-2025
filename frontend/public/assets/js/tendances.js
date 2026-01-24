const API_HOST = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
  ? 'http://localhost:3000'
  : 'http://192.168.1.235:3000'; // Mets ici l’IP de ton PC

class TendancesDataManager {
    // === ACTUALITÉS ===
    async updateNews() {
        console.log('🔄 Mise à jour des actualités...');
        try {
            const newsData = await this.fetchGamingNews();
            const actualitesGrid = document.querySelector('.actualites-grid');
            if (actualitesGrid && newsData) {
                actualitesGrid.innerHTML = this.generateNewsHTML(newsData);
                console.log('✅ Actualités mises à jour !');
            }
        } catch (error) {
            console.error('❌ Erreur actualités:', error);
        }
    }

    generateNewsHTML(newsData) {
         console.log('🟢 Données reçues pour generateNewsHTML:', newsData);
        return newsData.map((news, index) => {
            // Créer le lien vers la fiche détaillée si disponible
            const detailLink = news.lien ? `/${news.lien}` : '#';
            const hasLink = Boolean(news.lien);
            
            return `
            <article class="actualite-card ${index === 0 ? 'featured' : ''}" ${hasLink ? `onclick="window.location.href='${detailLink}'" style="cursor: pointer;"` : ''}>
                ${news.video_url
                ? `<div class="card-video">
                        <iframe width="100%" height="200" src="${news.video_url}?enablejsapi=1&origin=${window.location.origin}" 
                            title="${news.titre}" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen></iframe>
                        ${news.hot ? '<span class="badge hot">🔥 HOT</span>' : ''}
                   </div>`
                : `<div class="card-image">
                        <img src="assets/images/${news.image}" alt="${news.titre}" 
                             onerror="this.src='assets/images/placeholder.png'">
                        ${news.hot ? '<span class="badge hot">🔥 HOT</span>' : ''}
                   </div>`
            }
                <div class="card-content">
                    <span class="date">${news.date}</span>
                    <h3>${news.titre}</h3>
                    <p>${news.description}</p>
                    <div class="tags">
                        ${news.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ${hasLink ? '<span class="read-more">➜ Lire la suite</span>' : ''}
                </div>
            </article>
        `;
        }).join('');
    }

    // === TECHNOLOGIES ===
    async updateTechProgress() {
        console.log('🔄 Mise à jour des technologies...');
        try {
            const techData = await this.fetchTechData();
            const techGrid = document.querySelector('.tech-grid');
            if (techGrid && techData) {
                techGrid.innerHTML = techData.map(tech => `
                    <div class="tech-card">
                        <div class="tech-icon">${this.getIconEmoji(tech.icone)}</div>
                        <h3>${tech.nom}</h3>
                        <div class="progress-bar">
                            <div class="progress" style="width: 0%"></div>
                        </div>
                        <p><strong>Adoption: ${tech.taux_adoption}%</strong></p>
                        <p>${tech.description}</p>
                    </div>
                `).join('');
                // Animation des barres après génération du HTML
                this.animateProgressBars(techData);
            }
            console.log('✅ Technologies mises à jour !');
        } catch (error) {
            console.error('❌ Erreur technologies:', error);
        }
    }

    animateProgressBars(techData) {
        const bars = document.querySelectorAll('.tech-card .progress');
        bars.forEach((bar, i) => {
            setTimeout(() => {
                bar.style.transition = 'width 1s ease';
                bar.style.width = techData[i]?.taux_adoption + '%' || '0%';
            }, 100 + i * 200);
        });
    }

    // === MARCHÉ ===
    async updateMarketStats() {
        console.log('🔄 Mise à jour du marché...');
        try {
            const marketData = await this.fetchMarketData();
            const marketGrid = document.querySelector('.marche-grid');
            if (marketGrid && marketData) {
                marketGrid.innerHTML = marketData.map(stat => {
                    // Utilise l'icône de la BDD ou une icône par défaut
                    const icon = this.getIconEmoji(stat.icone) || '💰';

                    return `
                        <div class="stat-card">
                            <div class="stat-icon">${icon}</div>
                            <div class="stat-value">${stat.valeur}</div>
                            <div class="stat-label">${stat.label}</div>
                            <div class="stat-trend ${stat.tendance}">${stat.tendance === 'up' ? '+12.3% vs 2024' : stat.tendance === 'down' ? '-5.2% vs 2024' : 'Stable'}</div>
                        </div>
                    `;
                }).join('');
            }
            console.log('✅ Marché mis à jour !');
        } catch (error) {
            console.error('❌ Erreur marché:', error);
        }
    }

    // === INSIGHTS ===
    async updateInsights() {
        console.log('🔄 Mise à jour des insights...');
        try {
            const insightsData = await this.fetchInsightsData();
            const insightsGrid = document.querySelector('.insights-grid');
            if (insightsGrid && insightsData) {
                insightsGrid.innerHTML = insightsData.map(insight => `
                    <div class="insight-item">
                        <span class="insight-icon">${insight.icone}</span>
                        <div>
                            <h4>${insight.titre}</h4>
                            <p>${insight.description}</p>
                        </div>
                    </div>
                `).join('');
            }
            console.log('✅ Insights mis à jour !');
        } catch (error) {
            console.error('❌ Erreur insights:', error);
        }
    }

    // === PRÉDICTIONS ===
    getIconEmoji(iconName) {
        const iconMap = {
            // Icônes prédictions
            'drone': '🚁',
            'package': '📦',
            'network': '🌐',
            'camera': '📷',
            'satellite': '🛰️',
            '8k': '📺',
            'brain': '🧠',
            'phone-fold': '📱',
            'battery': '🔋',
            'cloud': '☁️',
            'vr-headset': '🥽',
            'quantum': '⚛️',
            '6g': '📡',
            'gamepad': '🎮',
            'tablet': '📱',
            'fold': '📋',
            'leaf': '🌿',
            'translate': '🌍',
            'sound-wave': '🎵',
            '3d': '🎭',
            'heartbeat': '💓',
            'fingerprint': '👆',
            'hologram': '✨',
            'droplet': '💧',
            'cube': '🧊',
            'box': '📦',
            'zap': '⚡',
            'book': '📚',
            'tv': '📺',
            'eye': '👁️',
            'printer': '🖨️',
            'metal': '🔩',
            'recycle': '♻️',
            'chip': '💾',
            'keyboard': '⌨️',
            'mouse': '🖱️',
            'sparkle': '✨',
            'hand': '🤚',
            'mic': '🎤',
            // Icônes marché
            'money': '💰',
            'building': '🏢',
            'home': '🏠',
            'phone': '📱',
            'laptop': '💻',
            'apple': '🍏',
            'android': '🤖',
            'signal': '📶',
            'trophy': '🏆',
            'flag': '🏁',
            'wheat': '🌾',
            'list': '📋',
            'watch': '⌚',
            'headphones': '🎧',
            'server': '🖥️',
            'link': '🔗',
            'globe': '🌍',
            'france': '🇫🇷',
            'euro': '💶',
            'meta': '🅼',
            'lg': '🅻',
            'creality': '🅲',
            'chart': '📊',
            'school': '🏫',
            'dollar': '💸',
            // Icônes technologies
            'cpu': '🖥️',
            'monitor': '🖥️',
            'refresh': '🔄',
            'wind': '💨',
            'shield': '🛡️',
            'pen': '✏️',
            'bluetooth': '📶',
            '4k': '📺'
        };
        return iconMap[iconName] || '🔮';
    }

    async updatePredictions() {
        console.log('🔄 Mise à jour des prédictions...');
        try {
            const predictionsData = await this.fetchPredictionsData();
            const timeline = document.querySelector('.predictions-timeline');
            if (timeline && predictionsData) {
                timeline.innerHTML = predictionsData.map(pred => `
                    <div class="timeline-item">
                        <span class="timeline-year">${pred.annee}</span>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <span class="timeline-icon">${this.getIconEmoji(pred.icone)}</span>
                                <h3>${pred.titre}</h3>
                            </div>
                            <p>${pred.description}</p>
                            <div class="probability">Probabilité: ${pred.probabilite}%</div>
                        </div>
                    </div>
                `).join('');
            }
            console.log('✅ Prédictions mises à jour !');
        } catch (error) {
            console.error('❌ Erreur prédictions:', error);
        }
    }

    // === FETCH DATA ===
    async fetchGamingNews() {
        const path = window.location.pathname;
        const fullUrl = window.location.href;
        
        console.log('🌍 URL complète:', fullUrl);
        console.log('📍 Pathname:', path);
        
        // Plusieurs patterns possibles
        let match = path.match(/tendances-([a-z\-]+)\.html/);
        if (!match) {
            // Essayer avec le chemin complet frontend/public
            match = path.match(/frontend\/public\/tendances-([a-z\-]+)\.html/);
        }
        if (!match) {
            // Essayer juste le nom de fichier à la fin
            match = path.match(/([a-z\-]+)\.html$/);
            if (match && match[1].startsWith('tendances-')) {
                match[1] = match[1].replace('tendances-', '');
            } else {
                match = null;
            }
        }
        
        let categorie = match ? match[1] : 'gaming';
        
        // Force imprimante-3d si on est sur cette page
        if (fullUrl.includes('imprimante-3d') || path.includes('imprimante-3d')) {
            categorie = 'imprimante-3d';
        }
        
        console.log('🔍 Match result:', match);
        console.log('🔍 Catégorie détectée:', categorie);
        console.log('🌐 URL API:', `${API_HOST}/api/${categorie}/actualites`);
        
        try {
            const res = await fetch(`${API_HOST}/api/${categorie}/actualites`);
            console.log('📡 Status Response:', res.status);
            
            if (!res.ok) {
                console.error('❌ Erreur HTTP:', res.status, res.statusText);
                return [];
            }
            
            const data = await res.json();
            console.log('📊 Données API reçues:', data);
            
            if (!Array.isArray(data)) {
                console.warn('⚠️ Les données ne sont pas un tableau:', data);
                return [];
            }
            
            return data.map(news => ({
                ...news,
                tags: Array.isArray(news.tags) ? news.tags : (news.tags ? news.tags.replace(/[{}"]/g, '').split(',') : []),
                date: new Date(news.date_publication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                hot: news.hot
            }));
        } catch (error) {
            console.error('❌ Erreur fetch actualités:', error);
            return [];
        }
    }

    async fetchTechData() {
        const path = window.location.pathname;
        const fullUrl = window.location.href;
        
        let match = path.match(/tendances-([a-z\-]+)\.html/);
        if (!match) match = path.match(/frontend\/public\/tendances-([a-z\-]+)\.html/);
        if (!match) {
            match = path.match(/([a-z\-]+)\.html$/);
            if (match && match[1].startsWith('tendances-')) {
                match[1] = match[1].replace('tendances-', '');
            } else {
                match = null;
            }
        }
        
        let categorie = match ? match[1] : 'gaming';
        if (fullUrl.includes('imprimante-3d') || path.includes('imprimante-3d')) {
            categorie = 'imprimante-3d';
        }
        
        console.log('🔍 Fetching technologies pour:', categorie);
        
        try {
            const res = await fetch(`${API_HOST}/api/${categorie}/technologies`);
            if (!res.ok) {
                console.error('❌ Erreur HTTP technologies:', res.status);
                return [];
            }
            const data = await res.json();
            console.log('📊 Technologies reçues:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Erreur fetch technologies:', error);
            return [];
        }
    }

    async fetchMarketData() {
        const path = window.location.pathname;
        const fullUrl = window.location.href;
        
        let match = path.match(/tendances-([a-z\-]+)\.html/);
        if (!match) match = path.match(/frontend\/public\/tendances-([a-z\-]+)\.html/);
        if (!match) {
            match = path.match(/([a-z\-]+)\.html$/);
            if (match && match[1].startsWith('tendances-')) {
                match[1] = match[1].replace('tendances-', '');
            } else {
                match = null;
            }
        }
        
        let categorie = match ? match[1] : 'gaming';
        if (fullUrl.includes('imprimante-3d') || path.includes('imprimante-3d')) {
            categorie = 'imprimante-3d';
        }
        
        console.log('🔍 Fetching marché pour:', categorie);
        
        try {
            const res = await fetch(`${API_HOST}/api/${categorie}/marche`);
            if (!res.ok) {
                console.error('❌ Erreur HTTP marché:', res.status);
                return [];
            }
            const data = await res.json();
            console.log('📊 Marché reçu:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Erreur fetch marché:', error);
            return [];
        }
    }

    async fetchInsightsData() {
        const path = window.location.pathname;
        const fullUrl = window.location.href;
        
        let match = path.match(/tendances-([a-z\-]+)\.html/);
        if (!match) match = path.match(/frontend\/public\/tendances-([a-z\-]+)\.html/);
        if (!match) {
            match = path.match(/([a-z\-]+)\.html$/);
            if (match && match[1].startsWith('tendances-')) {
                match[1] = match[1].replace('tendances-', '');
            } else {
                match = null;
            }
        }
        
        let categorie = match ? match[1] : 'gaming';
        if (fullUrl.includes('imprimante-3d') || path.includes('imprimante-3d')) {
            categorie = 'imprimante-3d';
        }
        
        console.log('🔍 Fetching insights pour:', categorie);
        
        try {
            const res = await fetch(`${API_HOST}/api/${categorie}/insights`);
            if (!res.ok) {
                console.error('❌ Erreur HTTP insights:', res.status);
                return [];
            }
            const data = await res.json();
            console.log('📊 Insights reçus:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Erreur fetch insights:', error);
            return [];
        }
    }

    async fetchPredictionsData() {
        const path = window.location.pathname;
        const fullUrl = window.location.href;
        
        let match = path.match(/tendances-([a-z\-]+)\.html/);
        if (!match) match = path.match(/frontend\/public\/tendances-([a-z\-]+)\.html/);
        if (!match) {
            match = path.match(/([a-z\-]+)\.html$/);
            if (match && match[1].startsWith('tendances-')) {
                match[1] = match[1].replace('tendances-', '');
            } else {
                match = null;
            }
        }
        
        let categorie = match ? match[1] : 'gaming';
        if (fullUrl.includes('imprimante-3d') || path.includes('imprimante-3d')) {
            categorie = 'imprimante-3d';
        }
        
        console.log('🔍 Fetching prédictions pour:', categorie);
        
        try {
            const res = await fetch(`${API_HOST}/api/${categorie}/predictions`);
            if (!res.ok) {
                console.error('❌ Erreur HTTP prédictions:', res.status);
                return [];
            }
            const data = await res.json();
            console.log('📊 Prédictions reçues:', data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('❌ Erreur fetch prédictions:', error);
            return [];
        }
    }
}

class TendancesManager {
    constructor() {
        this.currentSection = 'actualites';
        this.dataManager = new TendancesDataManager();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadLatestData();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.getAttribute('data-section');
                this.updateSectionData(targetSection);
                this.switchSection(targetSection);
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
        // Affiche la section active au chargement
        this.updateSectionData(this.currentSection);
    }

    async updateSectionData(sectionName) {
        try {
            switch (sectionName) {
                case 'actualites':
                    await this.dataManager.updateNews();
                    console.log('📰 Actualités mises à jour !');
                    break;
                case 'technologies':
                    await this.dataManager.updateTechProgress();
                    console.log('⚡ Technologies mises à jour !');
                    break;
                case 'marche':
                    await this.dataManager.updateMarketStats();
                    await this.dataManager.updateInsights();
                    console.log('📊 Marché mis à jour !');
                    break;
                case 'predictions':
                    await this.dataManager.updatePredictions();
                    console.log('🔮 Prédictions mises à jour !');
                    break;
            }
        } catch (error) {
            console.error('❌ Erreur mise à jour:', error);
        }
    }

    switchSection(sectionName) {
        const sections = document.querySelectorAll('.section-tendances');
        sections.forEach(section => section.classList.remove('active'));
        setTimeout(() => {
            const targetSection = document.getElementById(sectionName);
            if (targetSection) {
                targetSection.classList.add('active');
                this.currentSection = sectionName;
            }
        }, 150);
    }

    loadLatestData() {
        console.log('🔥 Tendances chargées !');
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }
}

// Instanciation et initialisation du manager
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Tendances...');
    try {
        window.tendancesManager = new TendancesManager();
        console.log('✅ TendancesManager initialisé !');
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
    }

    // --- Ajouter dynamiquement un bouton 'Retour' à la suite des boutons de navigation ---
    try {
        const nav = document.querySelector('.tendances-nav');
        if (nav && !document.getElementById('btn-retour')) {
            const retour = document.createElement('button');
            retour.type = 'button';
            retour.id = 'btn-retour';
            retour.className = 'nav-back';
            retour.title = 'Retour';
            retour.innerHTML = '← Retour';
            retour.addEventListener('click', () => window.history.back());
            nav.appendChild(retour);
        }
    } catch (e) {
        console.warn('Impossible d\'ajouter le bouton Retour dynamiquement:', e);
    }
});

function debugLog(msg) {
  const el = document.getElementById('debug');
  if (el) el.innerHTML += `<div>${msg}</div>`;
}
