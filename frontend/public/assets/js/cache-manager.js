class CacheManager {
    constructor() {
        this.CACHE_VERSION = '1.0.0';
        this.CACHE_PREFIX = 'site-gamer-';
        this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
        
        // TTL différents par type de données
        this.TTL_CONFIG = {
            'produits': 10 * 60 * 1000,     // 10 minutes
            'categories': 30 * 60 * 1000,   // 30 minutes
            'stats': 2 * 60 * 1000,         // 2 minutes
            'search': 5 * 60 * 1000,        // 5 minutes
            'images': 24 * 60 * 60 * 1000   // 24 heures
        };
        
        this.init();
    }
    
    init() {
        // Nettoyer le cache au démarrage si nouvelle version
        const version = localStorage.getItem(this.CACHE_PREFIX + 'version');
        if (version !== this.CACHE_VERSION) {
            this.clearAll();
            localStorage.setItem(this.CACHE_PREFIX + 'version', this.CACHE_VERSION);
        }
        
        // Nettoyer les entrées expirées
        this.cleanExpired();
    }
    
    // Générer une clé de cache
    generateKey(type, identifier = '') {
        return `${this.CACHE_PREFIX}${type}${identifier ? '-' + identifier : ''}`;
    }
    
    // Sauvegarder en cache
    set(type, data, identifier = '', customTTL = null) {
        try {
            const key = this.generateKey(type, identifier);
            const ttl = customTTL || this.TTL_CONFIG[type] || this.DEFAULT_TTL;
            
            const cacheData = {
                data: data,
                timestamp: Date.now(),
                ttl: ttl,
                type: type
            };
            
            localStorage.setItem(key, JSON.stringify(cacheData));
            console.log(`💾 Cache SET: ${type} (TTL: ${ttl/1000}s)`);
            
            return true;
        } catch (error) {
            console.warn('⚠️ Cache storage failed:', error);
            // Si quota dépassé, nettoyer le cache
            if (error.name === 'QuotaExceededError') {
                this.clearOldest();
            }
            return false;
        }
    }
    
    // Récupérer du cache
    get(type, identifier = '') {
        try {
            const key = this.generateKey(type, identifier);
            const cached = localStorage.getItem(key);
            
            if (!cached) {
                console.log(`❌ Cache MISS: ${type}`);
                return null;
            }
            
            const cacheData = JSON.parse(cached);
            const age = Date.now() - cacheData.timestamp;
            
            // Vérifier expiration
            if (age > cacheData.ttl) {
                localStorage.removeItem(key);
                console.log(`⏰ Cache EXPIRED: ${type} (age: ${Math.round(age/1000)}s)`);
                return null;
            }
            
            console.log(`✅ Cache HIT: ${type} (age: ${Math.round(age/1000)}s)`);
            return cacheData.data;
            
        } catch (error) {
            console.warn('⚠️ Cache retrieval failed:', error);
            return null;
        }
    }
    
    // Invalider un cache spécifique
    invalidate(type, identifier = '') {
        const key = this.generateKey(type, identifier);
        localStorage.removeItem(key);
        console.log(`🗑️ Cache INVALIDATED: ${type}`);
    }
    
    // Nettoyer les entrées expirées
    cleanExpired() {
        const now = Date.now();
        let cleaned = 0;
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.CACHE_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    if (data.timestamp && (now - data.timestamp) > data.ttl) {
                        localStorage.removeItem(key);
                        cleaned++;
                    }
                } catch (e) {
                    localStorage.removeItem(key);
                    cleaned++;
                }
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cache cleaned: ${cleaned} expired entries`);
        }
    }
    
    // Nettoyer les plus anciennes entrées
    clearOldest() {
        const cacheEntries = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.CACHE_PREFIX)) {
                try {
                    const data = JSON.parse(localStorage.getItem(key));
                    cacheEntries.push({ key, timestamp: data.timestamp });
                } catch (e) {
                    localStorage.removeItem(key);
                }
            }
        }
        
        // Trier par ancienneté et supprimer les 25% plus anciens
        cacheEntries.sort((a, b) => a.timestamp - b.timestamp);
        const toRemove = Math.ceil(cacheEntries.length * 0.25);
        
        for (let i = 0; i < toRemove; i++) {
            localStorage.removeItem(cacheEntries[i].key);
        }
        
        console.log(`🗑️ Cleared ${toRemove} oldest cache entries`);
    }
    
    // Nettoyer tout le cache
    clearAll() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.CACHE_PREFIX)) {
                keys.push(key);
            }
        }
        
        keys.forEach(key => localStorage.removeItem(key));
        console.log(`🧹 Cleared all cache (${keys.length} entries)`);
    }
    
    // Statistiques du cache
    getStats() {
        let totalSize = 0;
        let entriesCount = 0;
        const typeStats = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.CACHE_PREFIX)) {
                const value = localStorage.getItem(key);
                totalSize += value.length;
                entriesCount++;
                
                try {
                    const data = JSON.parse(value);
                    const type = data.type || 'unknown';
                    typeStats[type] = (typeStats[type] || 0) + 1;
                } catch (e) {}
            }
        }
        
        return {
            totalSize: Math.round(totalSize / 1024), // KB
            entriesCount,
            typeStats,
            quotaUsed: Math.round((totalSize / (5 * 1024 * 1024)) * 100) // % of 5MB
        };
    }
}

// Instance globale
window.cacheManager = new CacheManager();