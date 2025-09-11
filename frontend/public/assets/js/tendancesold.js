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
                    this.animateProgressUpdate(bar, techData[index].progress);
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
            const statValues = document.querySelectorAll('.stat-value');

            statValues.forEach((stat, index) => {
                if (marketData[index]) {
                    this.animateStatUpdate(stat, marketData[index].value);
                }
            });

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
                    this.animateProbabilityUpdate(prob, predictionsData[index].probability);
                }
            });

            console.log('✅ Prédictions mises à jour !');
        } catch (error) {
            console.error('❌ Erreur prédictions:', error);
        }
    }

    // === MÉTHODES DE DONNÉES ===

    async fetchGamingNews() {
        const now = new Date();
        const path = window.location.pathname;

        if (path.includes('drone')) {
            // Actualités drones fixes
            const topics = [
                {
                    title: "DJI FPV 2 : La Révolution du Vol Immersif",
                    description: "Le nouveau DJI FPV 2 offre une expérience de vol ultra-immersive avec une caméra 8K et une portée record.",
                    video: "https://www.youtube.com/embed/rXZ47PwevE0", // <-- AJOUTE CETTE LIGNE
                    tags: ["FPV", "DJI", "8K"],
                    hot: true
                },
                {
                    title: "Livraison par Drone : Amazon étend son service",
                    description: "Amazon annonce l’expansion de la livraison par drone dans 10 nouveaux pays, promettant des délais record.",
                    image: "assets/images/drone-livraison.jpg",
                    tags: ["Livraison", "Amazon"]
                },
                {
                    title: "IA embarquée : Les drones deviennent autonomes",
                    description: "Les nouveaux drones intègrent des IA capables d’éviter les obstacles et de filmer de façon intelligente.",
                    image: "assets/images/drone-ia.jpg",
                    tags: ["IA", "Autonomie"]
                },
                {
                    title: "Courses de Drones : Le FPV explose en popularité",
                    description: "Les compétitions de drones FPV attirent de plus en plus de pilotes et de spectateurs à travers le monde.",
                    image: "assets/images/drone-course.jpg",
                    tags: ["Course", "FPV"]
                }
            ];

            return topics.map((topic, index) => ({
                id: Date.now() + index,
                title: topic.title,
                description: topic.description,
                image: topic.image,
                video: topic.video, // <-- AJOUTE CETTE LIGNE
                date: (() => {
                    const d = new Date(now - (index * 3600000));
                    const options = { day: 'numeric', month: 'long', year: 'numeric' };
                    const str = d.toLocaleDateString('fr-FR', options);
                    return str.replace(/ ([a-z])/, (m, l) => ' ' + l.toUpperCase());
                })(),
                tags: topic.tags,
                hot: topic.hot || false
            }));
        }
        if (path.includes('smartphone')) {
            // Actualités smartphone fixes
            const topics = [
                {
                    title: "Galaxy Z Fold 6 : Le pliable devient la norme",
                    description: "Samsung dévoile son nouveau smartphone pliable avec écran 8 pouces et autonomie record.",
                    image: "assets/images/smartphone-fold.jpg",
                    tags: ["Pliable", "Samsung", "8 pouces"],
                    hot: true
                },
                {
                    title: "iPhone 17 Pro : L’IA au cœur de l’expérience",
                    description: "Apple intègre une puce IA dédiée pour la photo, la sécurité et la gestion de l’énergie.",
                    image: "assets/images/iphone-17.jpg",
                    tags: ["Apple", "IA"]
                },
                {
                    title: "Xiaomi HyperCharge : 100% en 5 minutes",
                    description: "Xiaomi lance la recharge la plus rapide du marché, 100% en 5 minutes chrono.",
                    image: "assets/images/xiaomi-hypercharge.jpg",
                    tags: ["Xiaomi", "Batterie"]
                },
                {
                    title: "Google Pixel 9 : Android 15 et photo boostée",
                    description: "Le Pixel 9 mise sur l’IA et un nouveau capteur photo pour séduire les créateurs de contenu.",
                    image: "assets/images/google-pixel-9.jpg",
                    tags: ["Google", "Photo"]
                }
            ];
            return topics.map((topic, index) => ({
                id: Date.now() + index,
                title: topic.title,
                description: topic.description,
                image: topic.image,
                date: (() => {
                    const d = new Date(now - (index * 3600000));
                    const options = { day: 'numeric', month: 'long', year: 'numeric' };
                    const str = d.toLocaleDateString('fr-FR', options);
                    return str.replace(/ ([a-z])/, (m, l) => ' ' + l.toUpperCase());
                })(),
                tags: topic.tags,
                hot: topic.hot || false
            }));
        }

        // Par défaut : gaming
        // Actualités gaming fixes
        const topics = [
            {
                title: "NVIDIA RTX 5090 : Performances Révolutionnaires",
                description: "La nouvelle RTX 5090 pulvérise tous les records avec 50% de performance en plus.",
                image: "assets/images/rtx-5070.jpeg",
                tags: ["GPU", "NVIDIA", "RTX"],
                hot: true
            },
            {
                title: "AMD Zen 6 : Architecture Révolutionnaire",
                description: "Les processeurs Zen 6 arrivent avec une efficacité énergétique record.",
                image: "assets/images/amd-ryzen-series-9000.jpeg",
                tags: ["CPU", "AMD"]
            },
            {
                title: "Intel Arc B-Series : Nouvelle Génération",
                description: "Intel lance la série Arc B avec des performances solides pour concurrencer AMD et NVIDIA.",
                image: "assets/images/intel-arc.jpg",
                tags: ["GPU", "Intel"]
            },
            {
                title: "DDR6 RAM : Vitesse Inédite",
                description: "La DDR6 promet des vitesses de transfert jamais vues pour booster les PC gaming.",
                image: "assets/images/ddr6.jpg",
                tags: ["Memory", "DDR6"]
            },
            {
                title: "PCIe 6.0 : Doublement de la Bande Passante",
                description: "Le PCIe 6.0 double la bande passante pour des transferts ultra-rapides.",
                image: "assets/images/Pcie6.png",
                tags: ["Standard", "PCIe"]
            }
        ];

        return topics.map((topic, index) => ({
            id: Date.now() + index,
            title: topic.title,
            description: topic.description,
            image: topic.image, // <-- ici, pour la vidéo, c'est undefined
            date: (() => {
                const d = new Date(now - (index * 3600000));
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                const str = d.toLocaleDateString('fr-FR', options);
                return str.replace(/ ([a-z])/, (m, l) => ' ' + l.toUpperCase());
            })(),
            tags: topic.tags,
            hot: topic.hot || false
        }));
    }

    async fetchTechData() {
        // Simulation évolution technologique
        return [
            { progress: Math.min(100, 75 + Math.random() * 10) }, // Gaming 8K
            { progress: Math.min(100, 90 + Math.random() * 5) },  // IA Gaming
            { progress: Math.min(100, 60 + Math.random() * 15) }, // Cloud Gaming
            { progress: Math.min(100, 45 + Math.random() * 20) }, // VR/AR
            { progress: Math.min(100, 30 + Math.random() * 25) }, // SSD Quantique
            { progress: Math.min(100, 85 + Math.random() * 8) }   // Ray Tracing
        ];
    }

    async fetchMarketData() {
        // Simulation données marché
        const base = [287.2, 3.4, 1.8, 2.1];
        const suffixes = ['B€', 'B', 'B', 'B'];

        return base.map((value, index) => ({
            value: `${(value + Math.random() * (value * 0.1)).toFixed(1)}${suffixes[index]}`
        }));
    }

    async fetchPredictionsData() {
        // Simulation nouvelles probabilités
        return [
            { probability: Math.min(95, 85 + Math.random() * 8) },  // 2026
            { probability: Math.min(85, 78 + Math.random() * 6) },  // 2027
            { probability: Math.min(80, 72 + Math.random() * 7) },  // 2028
            { probability: Math.min(75, 65 + Math.random() * 9) },  // 2029
            { probability: Math.min(60, 45 + Math.random() * 12) }  // 2030
        ];
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
                            <img src="${news.image}" alt="${news.title}" 
                                 onerror="this.src='assets/images/placeholder.png'">
                            ${news.hot ? '<span class="badge hot">🔥 HOT</span>' : ''}
                       </div>`
            }
                <div class="card-content">
                    <span class="date">${news.date}</span>
                    <h3>${news.title}</h3>
                    <p>${news.description}</p>
                    <div class="tags">
                        ${news.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </article>
        `).join('');
    }

    animateProgressUpdate(progressBar, newWidth) {
        progressBar.style.transition = 'width 1s ease';
        progressBar.style.width = `${newWidth.toFixed(0)}%`;

        // Mettre à jour le texte
        const card = progressBar.closest('.tech-card');
        const adoptionText = card.querySelector('p strong');
        if (adoptionText) {
            adoptionText.textContent = `Adoption: ${newWidth.toFixed(0)}%`;
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
            element.textContent = `Probabilité: ${newProbability.toFixed(0)}%`;
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
