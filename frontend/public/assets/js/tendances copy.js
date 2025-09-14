class TendancesDataManager {
    constructor() {
        this.apiEndpoints = {
            news: 'https://api.exemple.com/gaming-news',
            market: 'https://api.exemple.com/market-data',
            tech: 'https://api.exemple.com/tech-trends'
        };
    }

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

    async updateTechProgress() {
        console.log('🔄 Mise à jour des technologies...');

        try {
            const techData = await this.fetchTechData();
            const progressBars = document.querySelectorAll('#technologies .progress');

            progressBars.forEach((bar, index) => {
                if (techData[index]) {
                    this.animateProgressUpdate(bar, techData[index].taux_adoption);
                }
            });

            console.log('✅ Technologies mises à jour !');
        } catch (error) {
            console.error('❌ Erreur technologies:', error);
        }
    }

    async updateMarketStats() {
        console.log('🔄 Mise à jour du marché...');

        try {
            const marketData = await this.fetchMarketData();
            const marketGrid = document.querySelector('.marche-grid');
            if (marketGrid && marketData) {
                marketGrid.innerHTML = marketData.map(stat => `
                    <div class="stat-card">
                        <span class="stat-label">${stat.label}</span>
                        <span class="stat-value">${stat.valeur}</span>
                        <span class="stat-tendance ${stat.tendance}">${stat.tendance === 'up' ? '▲' : stat.tendance === 'down' ? '▼' : ''}</span>
                    </div>
                `).join('');
            }
            console.log('✅ Marché mis à jour !');
        } catch (error) {
            console.error('❌ Erreur marché:', error);
        }
    }

    async updatePredictions() {
        console.log('🔄 Mise à jour des prédictions...');

        try {
            const predictionsData = await this.fetchPredictionsData();
            const probabilityElements = document.querySelectorAll('.probability');

            probabilityElements.forEach((prob, index) => {
                if (predictionsData[index]) {
                    this.animateProbabilityUpdate(prob, predictionsData[index].probabilite);
                }
            });

            console.log('✅ Prédictions mises à jour !');
        } catch (error) {
            console.error('❌ Erreur prédictions:', error);
        }
    }

    // === MÉTHODES DE DONNÉES ===

    async fetchGamingNews() {
        const path = window.location.pathname;
const match = path.match(/tendances-([a-z\-]+)\.html/);
let categorie = match ? match[1] : 'gaming';
        if (path.includes('drone')) categorie = 'drone';
        if (path.includes('smartphone')) categorie = 'smartphone';
        if (path.includes('console')) categorie = 'console';

        const res = await fetch(`http://localhost:3000/api/${categorie}/actualites`);
        const data = await res.json();
        // Adapter le format si besoin (ex: transformer tags de string à array si nécessaire)
        return data.map(news => ({
            ...news,
            tags: Array.isArray(news.tags) ? news.tags : (news.tags ? news.tags.replace(/[{}"]/g, '').split(',') : []),
            date: new Date(news.date_publication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
            hot: news.hot
        }));
    }

    async fetchTechData() {
        const path = window.location.pathname;
        let categorie = 'gaming';
        if (path.includes('drone')) categorie = 'drone';
        if (path.includes('smartphone')) categorie = 'smartphone';
        if (path.includes('console')) categorie = 'console';

        const res = await fetch(`http://localhost:3000/api/${categorie}/technologies`);
        return await res.json();
    }

    async fetchMarketData() {
        const path = window.location.pathname;
        let categorie = 'gaming';
        if (path.includes('drone')) categorie = 'drone';
        if (path.includes('smartphone')) categorie = 'smartphone';
        if (path.includes('console')) categorie = 'console';

        const res = await fetch(`http://localhost:3000/api/${categorie}/marche`);
        return await res.json();
    }

    async fetchInsightsData() {
        const path = window.location.pathname;
        let categorie = 'gaming';
        if (path.includes('drone')) categorie = 'drone';
        if (path.includes('smartphone')) categorie = 'smartphone';
        if (path.includes('console')) categorie = 'console';

        const res = await fetch(`http://localhost:3000/api/${categorie}/insights`);
        return await res.json();
    }

    async fetchPredictionsData() {
        const path = window.location.pathname;
        let categorie = 'gaming';
        if (path.includes('drone')) categorie = 'drone';
        if (path.includes('smartphone')) categorie = 'smartphone';
        if (path.includes('console')) categorie = 'console';

        const res = await fetch(`http://localhost:3000/api/${categorie}/predictions`);
        return await res.json();
    }

    // === MÉTHODES UTILITAIRES ===

    getImageForTopic(topic, index) {
        // Mapper chaque topic à son image spécifique
        const imageMap = {
            "NVIDIA RTX 5090": 'assets/images/rtx-5070.jpeg',
            "NVIDIA RTX 5000": 'assets/images/rtx-5070.jpeg',
            "AMD Zen 6": 'assets/images/amd-ryzen-series-9000.jpeg',
            "AMD Zen 5": 'assets/images/amd-ryzen-series-9000.jpeg',
            "Intel Arc B-Series": 'assets/images/intel-arc.jpg', // Nouvelle image à ajouter
            "DDR6 RAM": 'assets/images/ddr6.jpg',
            "DDR6": 'assets/images/ddr6.jpg',
            "PCIe 6.0": 'assets/images/Pcie6.png'
        };

        // Chercher l'image par le titre du topic
        return imageMap[topic.title] || 'assets/images/placeholder.png';
    }

    getRandomAdjective() {
        const adjectives = [
            "Performances Révolutionnaires",
            "Innovation Majeure",
            "Nouvelle Génération",
            "Avancée Spectaculaire",
            "Technologie Disruptive",
            "Évolution Majeure",
            "Breakthrough Technologique"
        ];
        return adjectives[Math.floor(Math.random() * adjectives.length)];
    }

    getRandomFeature() {
        const features = [
            "qui Change la Donne",
            "pour les Gamers",
            "Ultra-Performante",
            "du Futur",
            "Révolutionnaire",
            "Inédite",
            "Game-Changing"
        ];
        return features[Math.floor(Math.random() * features.length)];
    }

    generateDescription(topic) {
        const descriptions = {
            GPU: `La nouvelle ${topic.title} révolutionne le gaming avec des performances inédites et une efficacité énergétique exceptionnelle.`,
            CPU: `Les processeurs ${topic.title} offrent des performances de calcul extraordinaires pour le gaming et la création de contenu.`,
            Memory: `La technologie ${topic.title} promet des vitesses de transfert ultra-rapides pour éliminer les goulots d'étranglement.`,
            Standard: `Le standard ${topic.title} double la bande passante pour des transferts de données à la vitesse de l'éclair.`
        };
        return descriptions[topic.category] || `${topic.title} apporte des innovations majeures au monde du gaming.`;
    }

    // === MÉTHODES D'ANIMATION ===

    generateNewsHTML(newsData) {
        return newsData.map((news, index) => `
            <article class="actualite-card ${index === 0 ? 'featured' : ''}">
                ${news.video
                ? `<div class="card-video">
                            <iframe width="100%" height="200" src="${news.video}" 
                                title="${news.title}" frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowfullscreen></iframe>
                            ${news.hot ? '<span class="badge hot">🔥 HOT</span>' : ''}
                       </div>`
                : `<div class="card-image">
                            <img src="assets/images/${news.image}" alt="${news.title}" 
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
                </div>
            </article>
        `).join('');
    }

    animateProgressUpdate(progressBar, taux) {
        progressBar.style.transition = 'width 1s ease';
        const value = (typeof taux === 'number' && !isNaN(taux)) ? taux : 0;
        progressBar.style.width = value + '%';

        // Mettre à jour le texte
        const card = progressBar.closest('.tech-card');
        const adoptionText = card ? card.querySelector('p strong') : null;
        if (adoptionText) {
            adoptionText.textContent = `Adoption: ${value.toFixed(0)}%`;
        }
    }

    animateStatUpdate(element, newValue) {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0.5';

        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1.1)';
            element.style.opacity = '1';

            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }, 300);
    }

    animateProbabilityUpdate(element, newProbability) {
        element.style.transform = 'scale(0.9)';
        element.style.opacity = '0.6';

        setTimeout(() => {
            const value = (typeof newProbability === 'number' && !isNaN(newProbability)) ? newProbability : 0;
            element.textContent = `probabilite: ${value.toFixed(0)}%`;
            element.style.transform = 'scale(1.05)';
            element.style.opacity = '1';

            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }, 300);
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
        this.setupAnimations();
        this.loadLatestData();
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section-tendances');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.getAttribute('data-section');

                // NOUVEAU : Mettre à jour les données avant d'afficher
                this.updateSectionData(targetSection);

                this.switchSection(targetSection);

                // Update active button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // NOUVELLE FONCTION : Mise à jour par section
    async updateSectionData(sectionName) {
        // Afficher un loader
        this.showSectionLoader(sectionName);

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
                    console.log('📊 Marché mis à jour !');
                    break;

                case 'predictions':
                    await this.dataManager.updatePredictions();
                    console.log('🔮 Prédictions mises à jour !');
                    break;
            }

            // Notification de succès
            this.showUpdateSuccess(sectionName);

        } catch (error) {
            console.log('❌ Erreur mise à jour:', error);
            this.showUpdateError(sectionName);
        } finally {
            // Masquer le loader
            this.hideSectionLoader(sectionName);
        }
    }

    showSectionLoader(sectionName) {
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            // Ajouter un overlay de chargement
            const loader = document.createElement('div');
            loader.className = 'section-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="spinner"></div>
                    <p>🔄 Mise à jour en cours...</p>
                </div>
            `;
            loader.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255,255,255,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
                border-radius: 15px;
            `;

            targetSection.style.position = 'relative';
            targetSection.appendChild(loader);
        }
    }

    hideSectionLoader(sectionName) {
        const targetSection = document.getElementById(sectionName);
        const loader = targetSection?.querySelector('.section-loader');
        if (loader) {
            loader.remove();
        }
    }

    showUpdateSuccess(sectionName) {
        this.showNotification(`✅ ${this.getSectionName(sectionName)} mis à jour !`, 'success');
    }

    showUpdateError(sectionName) {
        this.showNotification(`❌ Erreur mise à jour ${this.getSectionName(sectionName)}`, 'error');
    }

    getSectionName(sectionName) {
        const names = {
            'actualites': 'Actualités',
            'technologies': 'Technologies',
            'marche': 'Marché',
            'predictions': 'Prédictions'
        };
        return names[sectionName] || sectionName;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `update-notification ${type}`;
        notification.textContent = message;

        const colors = {
            success: 'linear-gradient(135deg, #10b981, #059669)',
            error: 'linear-gradient(135deg, #ef4444, #dc2626)',
            info: 'linear-gradient(135deg, #667eea, #764ba2)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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
        switch (sectionName) {
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
        console.log('🔥 Tendances chargées !');

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

// Instanciation et initialisation du manager
window.tendancesManager = new TendancesManager();

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation Tendances...');
    try {
        tendancesManager.dataManager.updateNews(); // <-- AJOUTE CETTE LIGNE
        console.log('✅ TendancesManager initialisé !');
    } catch (error) {
        console.error('❌ Erreur initialisation:', error);
    }
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
