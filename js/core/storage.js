/* ============================================================
   Digital Life OS - Storage Module
   localStorage abstraction and management
   ============================================================ */

class StorageManager {
    constructor() {
        this.prefix = 'dlos_';
        this.listeners = {};
    }
    
    /**
     * Set a value in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store (will be JSON stringified)
     */
    set(key, value) {
        try {
            const fullKey = this.prefix + key;
            const jsonValue = JSON.stringify(value);
            localStorage.setItem(fullKey, jsonValue);
            this.notifyListeners(key, value);
        } catch (error) {
            console.error(`Storage Error - Set: ${key}`, error);
            throw new Error(`Failed to save ${key}`);
        }
    }
    
    /**
     * Get a value from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Retrieved value
     */
    get(key, defaultValue = null) {
        try {
            const fullKey = this.prefix + key;
            const value = localStorage.getItem(fullKey);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error(`Storage Error - Get: ${key}`, error);
            return defaultValue;
        }
    }
    
    /**
     * Check if a key exists
     * @param {string} key - Storage key
     * @returns {boolean} True if exists
     */
    has(key) {
        const fullKey = this.prefix + key;
        return localStorage.getItem(fullKey) !== null;
    }
    
    /**
     * Remove a value from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
        try {
            const fullKey = this.prefix + key;
            localStorage.removeItem(fullKey);
            this.notifyListeners(key, null);
        } catch (error) {
            console.error(`Storage Error - Remove: ${key}`, error);
        }
    }
    
    /**
     * Clear all app data from localStorage
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Storage Error - Clear', error);
        }
    }
    
    /**
     * Get all stored data
     * @returns {Object} All stored data
     */
    getAll() {
        const data = {};
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                const cleanKey = key.replace(this.prefix, '');
                try {
                    data[cleanKey] = JSON.parse(localStorage.getItem(key));
                } catch {
                    data[cleanKey] = localStorage.getItem(key);
                }
            }
        });
        
        return data;
    }
    
    /**
     * Export all data as JSON
     * @returns {string} JSON string of all data
     */
    export() {
        return JSON.stringify(this.getAll(), null, 2);
    }
    
    /**
     * Import data from JSON
     * @param {string} jsonData - JSON string to import
     */
    import(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            Object.entries(data).forEach(([key, value]) => {
                this.set(key, value);
            });
        } catch (error) {
            console.error('Storage Error - Import', error);
            throw new Error('Invalid import data');
        }
    }
    
    /**
     * Watch for changes on a key
     * @param {string} key - Key to watch
     * @param {Function} callback - Callback on change
     * @returns {Function} Function to unwatch
     */
    watch(key, callback) {
        if (!this.listeners[key]) {
            this.listeners[key] = [];
        }
        
        this.listeners[key].push(callback);
        
        return () => {
            this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
        };
    }
    
    /**
     * Notify listeners of changes
     * @private
     */
    notifyListeners(key, value) {
        if (this.listeners[key]) {
            this.listeners[key].forEach(callback => {
                try {
                    callback(value);
                } catch (error) {
                    console.error(`Storage listener error for ${key}`, error);
                }
            });
        }
    }
    
    /**
     * Get storage size in bytes
     * @returns {number} Approximate size
     */
    getSize() {
        let size = 0;
        const keys = Object.keys(localStorage);
        
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                size += key.length + localStorage.getItem(key).length;
            }
        });
        
        return size;
    }
    
    /**
     * Increment a numeric value
     * @param {string} key - Storage key
     * @param {number} increment - Amount to increment
     * @returns {number} New value
     */
    increment(key, increment = 1) {
        const current = this.get(key, 0);
        const newValue = current + increment;
        this.set(key, newValue);
        return newValue;
    }
    
    /**
     * Add an item to an array in storage
     * @param {string} key - Storage key
     * @param {*} item - Item to add
     */
    addToArray(key, item) {
        const array = this.get(key, []);
        if (Array.isArray(array)) {
            array.push(item);
            this.set(key, array);
        }
    }
    
    /**
     * Remove an item from an array in storage
     * @param {string} key - Storage key
     * @param {number} index - Index to remove
     */
    removeFromArray(key, index) {
        const array = this.get(key, []);
        if (Array.isArray(array) && index >= 0 && index < array.length) {
            array.splice(index, 1);
            this.set(key, array);
        }
    }
}

// Global storage instance
const Storage = new StorageManager();
