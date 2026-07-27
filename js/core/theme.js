/* ============================================================
   Digital Life OS - Theme Manager
   Theme system and styling control
   ============================================================ */

class ThemeManager {
    constructor() {
        this.themes = CONFIG.THEMES;
        this.currentTheme = this.loadTheme();
        this.customThemes = Storage.get('custom_themes', {});
        this.init();
    }
    
    /**
     * Initialize theme manager
     */
    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
    }
    
    /**
     * Load theme from storage
     * @returns {string} Current theme
     */
    loadTheme() {
        const saved = Storage.get(CONFIG.STORAGE_KEYS.THEME);
        return saved || CONFIG.DEFAULT_THEME;
    }
    
    /**
     * Apply a theme
     * @param {string} theme - Theme name
     */
    applyTheme(theme) {
        if (!this.themes.includes(theme) && !this.customThemes[theme]) {
            console.warn(`Theme "${theme}" not found`);
            return;
        }
        
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        Storage.set(CONFIG.STORAGE_KEYS.THEME, theme);
        
        window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
    }
    
    /**
     * Get current theme
     * @returns {string} Current theme name
     */
    getTheme() {
        return this.currentTheme;
    }
    
    /**
     * Get available themes
     * @returns {Array} Array of theme names
     */
    getAvailableThemes() {
        return [...this.themes, ...Object.keys(this.customThemes)];
    }
    
    /**
     * Toggle between themes
     */
    toggleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
    }
    
    /**
     * Get CSS variable value
     * @param {string} varName - CSS variable name (without --)
     * @returns {string} CSS variable value
     */
    getCSSVariable(varName) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(`--${varName}`).trim();
    }
}

// Global theme manager instance
const Theme = new ThemeManager();
