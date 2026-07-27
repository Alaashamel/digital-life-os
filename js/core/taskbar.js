/* ============================================================
   Digital Life OS - Taskbar Module
   App launcher and window management
   ============================================================ */

class TaskbarManager {
    constructor() {
        this.launcher = null;
        this.windowsContainer = null;
        this.init();
    }
    
    /**
     * Initialize taskbar
     */
    init() {
        this.launcher = document.getElementById('app-launcher');
        this.windowsContainer = document.getElementById('taskbar-windows');
        this.createAppIcons();
        this.setupEventListeners();
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }
    
    /**
     * Update system clock
     */
    updateClock() {
        const timeEl = document.getElementById('clock-time');
        const dateEl = document.getElementById('clock-date');
        
        if (!timeEl || !dateEl) return;
        
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
        const date = now.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        timeEl.textContent = time;
        dateEl.textContent = date;
    }
    
    /**
     * Create app launcher icons
     */
    createAppIcons() {
        CONFIG.APPS.forEach(app => {
            const icon = document.createElement('button');
            icon.className = 'app-icon';
            icon.dataset.appId = app.id;
            icon.title = app.name;
            icon.innerHTML = app.icon;
            
            icon.addEventListener('click', () => this.launchApp(app));
            this.launcher.appendChild(icon);
        });
    }
    
    /**
     * Launch application
     */
    launchApp(app) {
        const existingWindow = Desktop.windows.find(w => w.app.id === app.id);
        if (existingWindow) {
            existingWindow.focus();
            if (existingWindow.isMinimized) existingWindow.restore();
            return;
        }
        
const window = Desktop.openWindow(app);
        
        // Initialize the appropriate app
        switch(app.id) {
            case 'notes':
                if (typeof NotesApp !== 'undefined' && NotesApp.init) {
                    NotesApp.init(window);
                }
                break;
            case 'music':
                if (typeof MusicApp !== 'undefined' && MusicApp.init) {
                    MusicApp.init(window);
                }
                break;
            case 'calendar':
                if (typeof CalendarApp !== 'undefined' && CalendarApp.init) {
                    CalendarApp.init(window);
                }
                break;
            case 'chatbot':
                if (typeof ChatbotApp !== 'undefined' && ChatbotApp.init) {
                    ChatbotApp.init(window);
                }
                break;
            case 'weather':
                if (typeof WeatherApp !== 'undefined' && WeatherApp.init) {
                    WeatherApp.init(window);
                }
                break;
            case 'games':
                if (typeof GamesApp !== 'undefined' && GamesApp.init) {
                    GamesApp.init(window);
                }
                break;
        }
        
        this.updateWindowIndicators();
    }
    
    /**
     * Update window indicators in taskbar
     */
    updateWindowIndicators() {
        this.windowsContainer.innerHTML = '';
        
        Desktop.windows.forEach(window => {
            const indicator = document.createElement('button');
            indicator.className = `window-indicator ${!window.isMinimized ? 'active' : ''}`;
            indicator.dataset.windowId = window.id;
            indicator.textContent = window.title;
            
            indicator.addEventListener('click', () => {
                if (window.isMinimized) {
                    window.maximize();
                    window.isMinimized = false;
                } else {
                    window.minimize();
                }
                this.updateWindowIndicators();
            });
            
            this.windowsContainer.appendChild(indicator);
        });
    }
    
    /**
     * Setup event listeners
     * @private
     */
    setupEventListeners() {
        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.openSettings());
        }
        
        // Theme toggle
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => Theme.toggleTheme());
        }
    }
    
    /**
     * Open settings
     */
    openSettings() {
        const settingsApp = {
            id: 'settings',
            name: 'Settings',
            icon: '⚙️',
            width: 500,
            height: 600,
        };
        
        const existingWindow = Desktop.windows.find(w => w.app.id === 'settings');
        if (existingWindow) {
            existingWindow.focus();
            if (existingWindow.isMinimized) existingWindow.restore();
        } else {
const window = Desktop.openWindow(settingsApp);
            
            if (typeof SettingsApp !== 'undefined' && SettingsApp.init) {
                SettingsApp.init(window);
            }
            
            this.updateWindowIndicators();
        }
    }
}

// Global taskbar manager
const Taskbar = new TaskbarManager();
