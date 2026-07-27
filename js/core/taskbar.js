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
        dateEl.textContent = date;\n    }\n    \n    /**\n     * Create app launcher icons\n     */\n    createAppIcons() {\n        CONFIG.APPS.forEach(app => {\n            const icon = document.createElement('button');\n            icon.className = 'app-icon';\n            icon.dataset.appId = app.id;\n            icon.title = app.name;\n            icon.innerHTML = app.icon;\n            \n            icon.addEventListener('click', () => this.launchApp(app));\n            this.launcher.appendChild(icon);\n        });\n    }\n    \n    /**\n     * Launch application\n     */\n    launchApp(app) {\n        const existingWindow = Desktop.windows.find(w => w.app.id === app.id);\n        if (existingWindow) {\n            existingWindow.focus();\n            if (existingWindow.isMinimized) existingWindow.restore();\n            return;\n        }\n        \n        const window = Desktop.createWindow(app.name, {\n            width: app.width,\n            height: app.height,\n            app: app,\n        });\n        \n        // Initialize the appropriate app\n        switch(app.id) {\n            case 'notes':\n                if (typeof NotesApp !== 'undefined' && NotesApp.init) {\n                    NotesApp.init(window);\n                }\n                break;\n            case 'music':\n                if (typeof MusicApp !== 'undefined' && MusicApp.init) {\n                    MusicApp.init(window);\n                }\n                break;\n            case 'calendar':\n                if (typeof CalendarApp !== 'undefined' && CalendarApp.init) {\n                    CalendarApp.init(window);\n                }\n                break;\n            case 'chatbot':\n                if (typeof ChatbotApp !== 'undefined' && ChatbotApp.init) {\n                    ChatbotApp.init(window);\n                }\n                break;\n            case 'weather':\n                if (typeof WeatherApp !== 'undefined' && WeatherApp.init) {\n                    WeatherApp.init(window);\n                }\n                break;\n            case 'games':\n                if (typeof GamesApp !== 'undefined' && GamesApp.init) {\n                    GamesApp.init(window);\n                }\n                break;\n        }\n        \n        this.updateWindowIndicators();\n    }\n    \n    /**\n     * Update window indicators in taskbar\n     */\n    updateWindowIndicators() {\n        this.windowsContainer.innerHTML = '';\n        \n        Desktop.windows.forEach(window => {\n            const indicator = document.createElement('button');\n            indicator.className = `window-indicator ${!window.isMinimized ? 'active' : ''}`;\n            indicator.dataset.windowId = window.id;\n            indicator.textContent = window.title;\n            \n            indicator.addEventListener('click', () => {\n                if (window.isMinimized) {\n                    window.maximize();\n                    window.isMinimized = false;\n                } else {\n                    window.minimize();\n                }\n                this.updateWindowIndicators();\n            });\n            \n            this.windowsContainer.appendChild(indicator);\n        });\n    }\n    \n    /**\n     * Setup event listeners\n     * @private\n     */\n    setupEventListeners() {\n        // Settings button\n        const settingsBtn = document.getElementById('settings-btn');\n        if (settingsBtn) {\n            settingsBtn.addEventListener('click', () => this.openSettings());\n        }\n        \n        // Theme toggle\n        const themeBtn = document.getElementById('theme-toggle');\n        if (themeBtn) {\n            themeBtn.addEventListener('click', () => Theme.toggleTheme());\n        }\n    }\n    \n    /**\n     * Open settings\n     */\n    openSettings() {\n        const settingsApp = {\n            id: 'settings',\n            name: 'Settings',\n            icon: '⚙️',\n            width: 500,\n            height: 600,\n        };\n        \n        const existingWindow = Desktop.windows.find(w => w.app.id === 'settings');\n        if (existingWindow) {\n            existingWindow.focus();\n            if (existingWindow.isMinimized) existingWindow.restore();\n        } else {\n            const window = Desktop.createWindow('Settings', {\n                width: 500,\n                height: 600,\n                app: settingsApp,\n            });\n            \n            if (typeof SettingsApp !== 'undefined' && SettingsApp.init) {\n                SettingsApp.init(window);\n            }\n            \n            this.updateWindowIndicators();\n        }\n    }\n}\n\n// Global taskbar manager\nconst Taskbar = new TaskbarManager();
