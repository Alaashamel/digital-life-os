/* ============================================================
   Digital Life OS - Main Application Init
   Application entry point and initialization
   ============================================================ */

class DigitalLifeOS {
    constructor() {
        this.version = CONFIG.APP_VERSION;
        this.isReady = false;
        this.startTime = Date.now();
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log(`🖥️  Digital Life OS v${this.version} - Initializing...`);
            
            // Load user settings
            await this.loadUserSettings();
            
            // Initialize systems
            this.initializeSystems();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Mark as ready
            this.isReady = true;
            window.dispatchEvent(new CustomEvent('app-ready'));
            
            const loadTime = Date.now() - this.startTime;
            console.log(`✓ Digital Life OS loaded in ${loadTime}ms`);
            
            // Show welcome notification
            this.showWelcome();
            
        } catch (error) {
            console.error('Failed to initialize Digital Life OS:', error);
            Notifications.error('Startup Error', 'Failed to initialize the application');
        }
    }
    
    /**
     * Load user settings
     * @private
     */
    async loadUserSettings() {
        const settings = Storage.get(CONFIG.STORAGE_KEYS.USER_SETTINGS);
        if (!settings) {
            Storage.set(CONFIG.STORAGE_KEYS.USER_SETTINGS, DEFAULT_USER_SETTINGS);
        }
    }
    
    /**
     * Initialize all systems
     * @private
     */
    initializeSystems() {
        // These managers initialize automatically
        // Storage - already initialized
        // Theme - will initialize on first access
        // Desktop - initializes automatically
        // Taskbar - initializes automatically
        // Notifications - initializes automatically
    }
    
    /**
     * Setup event listeners
     * @private
     */
    setupEventListeners() {
        // Handle theme changes
        window.addEventListener('theme-changed', (e) => {
            console.log(`Theme changed to: ${e.detail.theme}`);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        
        // Handle before unload
        window.addEventListener('beforeunload', () => {
            this.saveState();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    /**
     * Handle keyboard shortcuts
     * @private
     */
    handleKeyboard(e) {
        // Alt+Tab: cycle through windows
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            this.cycleWindows();
        }
        
        // Alt+F4: close active window
        if (e.altKey && e.key === 'F4') {
            e.preventDefault();
            this.closeActiveWindow();
        }
        
        // Ctrl+Alt+D: toggle theme
        if (e.ctrlKey && e.altKey && e.key === 'd') {
            e.preventDefault();
            Theme.toggleTheme();
        }
    }
    
    /**
     * Cycle through windows with Alt+Tab
     * @private
     */
    cycleWindows() {
        if (Desktop.windows.length === 0) return;
        
        const windows = Desktop.windows.filter(w => !w.isMinimized);
        if (windows.length === 0) return;
        
        const activeWindow = document.querySelector('.window.active');
        let nextIndex = 0;
        
        if (activeWindow) {
            const currentIndex = windows.findIndex(w => w.element === activeWindow);
            nextIndex = (currentIndex + 1) % windows.length;
        }
        
        windows[nextIndex].focus();
    }
    
    /**
     * Close active window
     * @private
     */
    closeActiveWindow() {
        const activeWindow = document.querySelector('.window.active');
        if (activeWindow) {
            const closeBtn = activeWindow.querySelector('.window-btn.close');
            if (closeBtn) closeBtn.click();
        }
    }
    
    /**
     * Handle window resize
     * @private
     */
    onWindowResize() {
        // Desktop manager handles this
    }
    
    /**
     * Save application state
     * @private
     */
    saveState() {
        // Save all window positions
        Desktop.windows.forEach(w => w.savePosition());
    }
    
    /**
     * Show welcome message
     * @private
     */
    showWelcome() {
        const isFirstRun = !Storage.has('app-initialized');
        
        if (isFirstRun) {
            Notifications.info(
                'Welcome to Digital Life OS',
                'Your personal operating system. Click app icons to get started!'
            );
            Storage.set('app-initialized', true);
        } else {
            // Show time-based greeting
            const hour = new Date().getHours();
            let greeting = 'Good morning';
            
            if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
            else if (hour >= 18) greeting = 'Good evening';
            
            Notifications.info(greeting, 'Welcome back to Digital Life OS');
        }
    }
    
    /**
     * Get application statistics
     */
    getStats() {
        return {
            version: this.version,
            isReady: this.isReady,
            windowsOpen: Desktop.windows.length,
            storageUsed: Storage.getSize(),
            currentTheme: Theme.getTheme(),
            uptime: Date.now() - this.startTime,
        };
    }
    
    /**
     * Get performance metrics
     */
    getPerformance() {
        if (!window.performance) return null;
        
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        return {
            pageLoadTime,
            domReadyTime: perfData.domContentLoadedEventEnd - perfData.navigationStart,
            resourceLoadTime: perfData.loadEventEnd - perfData.responseEnd,
        };
    }
}

// Initialize application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.App = new DigitalLifeOS();
        window.App.init();
    });
} else {
    window.App = new DigitalLifeOS();
    window.App.init();
}

// Make console functions available for debugging
window.getStats = () => window.App?.getStats();
window.getPerformance = () => window.App?.getPerformance();
