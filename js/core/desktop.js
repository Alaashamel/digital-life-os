/* ============================================================
   Digital Life OS - Desktop Engine
   Window management, dragging, resizing, and lifecycle
   ============================================================ */

class DesktopWindow {
    constructor(app) {
        this.app = app;
        this.id = generateID('window');
        this.element = null;
        this.isMinimized = false;
        this.isDragging = false;
        this.isResizing = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.zIndex = CONFIG.Z_INDEX.WINDOW;
        this.create();
    }
    
    /**
     * Create window element
     */
    create() {
        const { id, name, icon, width, height } = this.app;
        
        this.element = createElement('div', {
            class: 'window',
            id: this.id,
            'data-app-id': id,
            style: {
                width: `${width}px`,\n                height: `${height}px`,
                left: `${Math.random() * (window.innerWidth - width)}px`,
                top: `${Math.random() * (window.innerHeight - CONFIG.TASKBAR_HEIGHT - height)}px`,
                zIndex: this.zIndex,
            },
        });
        
        this.element.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <span class="window-icon">${icon}</span>
                    <span>${name}</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn minimize" title="Minimize">−</button>
                    <button class="window-btn maximize" title="Maximize">□</button>
                    <button class="window-btn close" title="Close">✕</button>
                </div>
            </div>
            <div class="window-content" id="content-${this.id}"></div>
            <div class="resize-handle"></div>
        `;
        
        this.setupEventListeners();
        this.restorePosition();
    }
    
    /**
     * Setup event listeners
     * @private
     */
    setupEventListeners() {
        const header = this.element.querySelector('.window-header');
        const minimizeBtn = this.element.querySelector('.window-btn.minimize');
        const maximizeBtn = this.element.querySelector('.window-btn.maximize');
        const closeBtn = this.element.querySelector('.window-btn.close');
        const resizeHandle = this.element.querySelector('.resize-handle');
        
        // Dragging
        header.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        
        // Resizing
        resizeHandle.addEventListener('mousedown', (e) => this.startResize(e));
        document.addEventListener('mousemove', (e) => this.resize(e));
        document.addEventListener('mouseup', () => this.stopResize());
        
        // Window controls
        minimizeBtn.addEventListener('click', () => this.minimize());
        maximizeBtn.addEventListener('click', () => this.maximize());
        closeBtn.addEventListener('click', () => this.close());
        
        // Focus
        this.element.addEventListener('mousedown', () => this.focus());
        
        // Touch support
        header.addEventListener('touchstart', (e) => this.startDrag(this.getTouchEvent(e)));
        document.addEventListener('touchmove', (e) => this.drag(this.getTouchEvent(e)));
        document.addEventListener('touchend', () => this.stopDrag());
    }
    
    /**
     * Convert touch event to mouse-like event
     * @private\n     */\n    getTouchEvent(touchEvent) {\n        const touch = touchEvent.touches[0];\n        return {\n            clientX: touch.clientX,\n            clientY: touch.clientY,\n            preventDefault: () => touchEvent.preventDefault(),\n        };\n    }\n    \n    /**\n     * Start dragging window\n     * @private\n     */\n    startDrag(e) {\n        if (e.target.closest('.window-controls')) return;\n        \n        this.isDragging = true;\n        const rect = this.element.getBoundingClientRect();\n        this.dragOffsetX = e.clientX - rect.left;\n        this.dragOffsetY = e.clientY - rect.top;\n        this.element.classList.add('dragging');\n    }\n    \n    /**\n     * Drag window\n     * @private\n     */\n    drag(e) {\n        if (!this.isDragging) return;\n        \n        const x = e.clientX - this.dragOffsetX;\n        const y = e.clientY - this.dragOffsetY;\n        \n        const maxX = window.innerWidth - this.element.offsetWidth;\n        const maxY = window.innerHeight - CONFIG.TASKBAR_HEIGHT - this.element.offsetHeight;\n        \n        this.element.style.left = clamp(x, 0, maxX) + 'px';\n        this.element.style.top = clamp(y, 0, maxY) + 'px';\n    }\n    \n    /**\n     * Stop dragging\n     * @private\n     */\n    stopDrag() {\n        if (this.isDragging) {\n            this.isDragging = false;\n            this.element.classList.remove('dragging');\n            this.savePosition();\n        }\n    }\n    \n    /**\n     * Start resizing\n     * @private\n     */\n    startResize(e) {\n        this.isResizing = true;\n        this.lastX = e.clientX;\n        this.lastY = e.clientY;\n        this.element.classList.add('resizing');\n    }\n    \n    /**\n     * Resize window\n     * @private\n     */\n    resize(e) {\n        if (!this.isResizing) return;\n        \n        const deltaX = e.clientX - this.lastX;\n        const deltaY = e.clientY - this.lastY;\n        \n        let newWidth = this.element.offsetWidth + deltaX;\n        let newHeight = this.element.offsetHeight + deltaY;\n        \n        newWidth = clamp(newWidth, CONFIG.WINDOW_MIN_WIDTH, window.innerWidth);\n        newHeight = clamp(newHeight, CONFIG.WINDOW_MIN_HEIGHT, window.innerHeight - CONFIG.TASKBAR_HEIGHT);\n        \n        this.element.style.width = newWidth + 'px';\n        this.element.style.height = newHeight + 'px';\n        \n        this.lastX = e.clientX;\n        this.lastY = e.clientY;\n        \n        window.dispatchEvent(new CustomEvent('window-resized', { detail: { windowId: this.id } }));\n    }\n    \n    /**\n     * Stop resizing\n     * @private\n     */\n    stopResize() {\n        if (this.isResizing) {\n            this.isResizing = false;\n            this.element.classList.remove('resizing');\n            this.savePosition();\n        }\n    }\n    \n    /**\n     * Focus window\n     */\n    focus() {\n        document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));\n        this.element.classList.add('active');\n        this.element.style.zIndex = ++Desktop.maxZIndex;\n    }\n    \n    /**\n     * Minimize window\n     */\n    minimize() {\n        this.isMinimized = true;\n        this.element.style.display = 'none';\n        Taskbar.updateWindowIndicators();\n    }\n    \n    /**\n     * Restore minimized window\n     */\n    restore() {\n        this.isMinimized = false;\n        this.element.style.display = 'flex';\n        this.focus();\n        Taskbar.updateWindowIndicators();\n    }\n    \n    /**\n     * Maximize/restore window\n     */\n    maximize() {\n        if (this.element.classList.contains('maximized')) {\n            this.element.classList.remove('maximized');\n            this.restorePosition();\n        } else {\n            this.element.classList.add('maximized');\n            this.element.style.left = '0';\n            this.element.style.top = '0';\n            this.element.style.width = window.innerWidth + 'px';\n            this.element.style.height = (window.innerHeight - CONFIG.TASKBAR_HEIGHT) + 'px';\n        }\n    }\n    \n    /**\n     * Save window position\n     */\n    savePosition() {\n        const state = Storage.get(CONFIG.STORAGE_KEYS.WINDOWS_STATE, {});\n        state[this.id] = {\n            left: this.element.style.left,\n            top: this.element.style.top,\n            width: this.element.style.width,\n            height: this.element.style.height,\n        };\n        Storage.set(CONFIG.STORAGE_KEYS.WINDOWS_STATE, state);\n    }\n    \n    /**\n     * Restore window position\n     */\n    restorePosition() {\n        const state = Storage.get(CONFIG.STORAGE_KEYS.WINDOWS_STATE, {})[this.id];\n        if (state) {\n            Object.assign(this.element.style, state);\n        }\n    }\n    \n    /**\n     * Close window\n     */\n    close() {\n        this.element.remove();\n        Desktop.windows = Desktop.windows.filter(w => w.id !== this.id);\n        Taskbar.updateWindowIndicators();\n        window.dispatchEvent(new CustomEvent('window-closed', { detail: { appId: this.app.id } }));\n    }\n    \n    /**\n     * Get window content element\n     */\n    getContent() {\n        return this.element.querySelector('.window-content');\n    }\n}\n\nclass DesktopManager {\n    constructor() {\n        this.windows = [];\n        this.maxZIndex = CONFIG.Z_INDEX.WINDOW;\n        this.desktopArea = null;\n        this.init();\n    }\n    \n    /**\n     * Initialize desktop\n     */\n    init() {\n        this.desktopArea = document.getElementById('desktop-area');\n        this.setupClockUpdate();\n        this.loadWindows();\n        window.addEventListener('resize', () => this.onWindowResize());\n    }\n    \n    /**\n     * Update system clock\n     * @private\n     */\n    setupClockUpdate() {\n        const updateClock = () => {\n            const now = new Date();\n            const timeEl = document.getElementById('clock-time');\n            const dateEl = document.getElementById('clock-date');\n            \n            if (timeEl) {\n                timeEl.textContent = formatTime(now);\n            }\n            if (dateEl) {\n                dateEl.textContent = formatDate(now);\n            }\n        };\n        \n        updateClock();\n        setInterval(updateClock, 1000);\n    }\n    \n    /**\n     * Open app window\n     */\n    openWindow(app) {\n        const existingWindow = this.windows.find(w => w.app.id === app.id);\n        \n        if (existingWindow) {\n            if (existingWindow.isMinimized) {\n                existingWindow.restore();\n            } else {\n                existingWindow.focus();\n            }\n            return existingWindow;\n        }\n        \n        const window = new DesktopWindow(app);\n        this.desktopArea.appendChild(window.element);\n        window.focus();\n        this.windows.push(window);\n        \n        Taskbar.updateWindowIndicators();\n        return window;\n    }\n    \n    /**\n     * Close app window\n     */\n    closeWindow(appId) {\n        const window = this.windows.find(w => w.app.id === appId);\n        if (window) {\n            window.close();\n        }\n    }\n    \n    /**\n     * Load persisted windows\n     * @private\n     */\n    loadWindows() {\n        // Windows will be restored when apps are launched\n    }\n    \n    /**\n     * Handle window resize\n     * @private\n     */\n    onWindowResize() {\n        this.windows.forEach(window => {\n            if (!window.element.classList.contains('maximized')) {\n                const maxX = window.innerWidth - window.element.offsetWidth;\n                const maxY = window.innerHeight - CONFIG.TASKBAR_HEIGHT - window.element.offsetHeight;\n                \n                const left = Math.min(parseInt(window.element.style.left), maxX);\n                const top = Math.min(parseInt(window.element.style.top), maxY);\n                \n                window.element.style.left = left + 'px';\n                window.element.style.top = top + 'px';\n            } else {\n                window.element.style.width = window.innerWidth + 'px';\n                window.element.style.height = (window.innerHeight - CONFIG.TASKBAR_HEIGHT) + 'px';\n            }\n        });\n    }\n}\n\n// Global desktop manager\nconst Desktop = new DesktopManager();
