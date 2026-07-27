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
                width: `${width}px`,
                height: `${height}px`,
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
     * @private
     */
    getTouchEvent(touchEvent) {
        const touch = touchEvent.touches[0];
        return {
            clientX: touch.clientX,
            clientY: touch.clientY,
            preventDefault: () => touchEvent.preventDefault(),
        };
    }
    
    /**
     * Start dragging window
     * @private
     */
    startDrag(e) {
        if (e.target.closest('.window-controls')) return;
        
        this.isDragging = true;
        const rect = this.element.getBoundingClientRect();
        this.dragOffsetX = e.clientX - rect.left;
        this.dragOffsetY = e.clientY - rect.top;
        this.element.classList.add('dragging');
    }
    
    /**
     * Drag window
     * @private
     */
    drag(e) {
        if (!this.isDragging) return;
        
        const x = e.clientX - this.dragOffsetX;
        const y = e.clientY - this.dragOffsetY;
        
        const maxX = window.innerWidth - this.element.offsetWidth;
        const maxY = window.innerHeight - CONFIG.TASKBAR_HEIGHT - this.element.offsetHeight;
        
        this.element.style.left = clamp(x, 0, maxX) + 'px';
        this.element.style.top = clamp(y, 0, maxY) + 'px';
    }
    
    /**
     * Stop dragging
     * @private
     */
    stopDrag() {
        if (this.isDragging) {
            this.isDragging = false;
            this.element.classList.remove('dragging');
            this.savePosition();
        }
    }
    
    /**
     * Start resizing
     * @private
     */
    startResize(e) {
        this.isResizing = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.element.classList.add('resizing');
    }
    
    /**
     * Resize window
     * @private
     */
    resize(e) {
        if (!this.isResizing) return;
        
        const deltaX = e.clientX - this.lastX;
        const deltaY = e.clientY - this.lastY;
        
        let newWidth = this.element.offsetWidth + deltaX;
        let newHeight = this.element.offsetHeight + deltaY;
        
        newWidth = clamp(newWidth, CONFIG.WINDOW_MIN_WIDTH, window.innerWidth);
        newHeight = clamp(newHeight, CONFIG.WINDOW_MIN_HEIGHT, window.innerHeight - CONFIG.TASKBAR_HEIGHT);
        
        this.element.style.width = newWidth + 'px';
        this.element.style.height = newHeight + 'px';
        
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        
        window.dispatchEvent(new CustomEvent('window-resized', { detail: { windowId: this.id } }));
    }
    
    /**
     * Stop resizing
     * @private
     */
    stopResize() {
        if (this.isResizing) {
            this.isResizing = false;
            this.element.classList.remove('resizing');
            this.savePosition();
        }
    }
    
    /**
     * Focus window
     */
    focus() {
        document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
        this.element.classList.add('active');
        this.element.style.zIndex = ++Desktop.maxZIndex;
    }
    
    /**
     * Minimize window
     */
    minimize() {
        this.isMinimized = true;
        this.element.style.display = 'none';
        Taskbar.updateWindowIndicators();
    }
    
    /**
     * Restore minimized window
     */
    restore() {
        this.isMinimized = false;
        this.element.style.display = 'flex';
        this.focus();
        Taskbar.updateWindowIndicators();
    }
    
    /**
     * Maximize/restore window
     */
    maximize() {
        if (this.element.classList.contains('maximized')) {
            this.element.classList.remove('maximized');
            this.restorePosition();
        } else {
            this.element.classList.add('maximized');
            this.element.style.left = '0';
            this.element.style.top = '0';
            this.element.style.width = window.innerWidth + 'px';
            this.element.style.height = (window.innerHeight - CONFIG.TASKBAR_HEIGHT) + 'px';
        }
    }
    
    /**
     * Save window position
     */
    savePosition() {
        const state = Storage.get(CONFIG.STORAGE_KEYS.WINDOWS_STATE, {});
        state[this.id] = {
            left: this.element.style.left,
            top: this.element.style.top,
            width: this.element.style.width,
            height: this.element.style.height,
        };
        Storage.set(CONFIG.STORAGE_KEYS.WINDOWS_STATE, state);
    }
    
    /**
     * Restore window position
     */
    restorePosition() {
        const state = Storage.get(CONFIG.STORAGE_KEYS.WINDOWS_STATE, {})[this.id];
        if (state) {
            Object.assign(this.element.style, state);
        }
    }
    
    /**
     * Close window
     */
    close() {
        this.element.remove();
        Desktop.windows = Desktop.windows.filter(w => w.id !== this.id);
        Taskbar.updateWindowIndicators();
        window.dispatchEvent(new CustomEvent('window-closed', { detail: { appId: this.app.id } }));
    }
    
    /**
     * Get window content element
     */
    getContent() {
        return this.element.querySelector('.window-content');
    }
}

class DesktopManager {
    constructor() {
        this.windows = [];
        this.maxZIndex = CONFIG.Z_INDEX.WINDOW;
        this.desktopArea = null;
        this.init();
    }
    
    /**
     * Initialize desktop
     */
    init() {
        this.desktopArea = document.getElementById('desktop-area');
        this.setupClockUpdate();
        this.loadWindows();
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    /**
     * Update system clock
     * @private
     */
    setupClockUpdate() {
        const updateClock = () => {
            const now = new Date();
            const timeEl = document.getElementById('clock-time');
            const dateEl = document.getElementById('clock-date');
            
            if (timeEl) {
                timeEl.textContent = formatTime(now);
            }
            if (dateEl) {
                dateEl.textContent = formatDate(now);
            }
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }
    
    /**
     * Open app window
     */
    openWindow(app) {
        const existingWindow = this.windows.find(w => w.app.id === app.id);
        
        if (existingWindow) {
            if (existingWindow.isMinimized) {
                existingWindow.restore();
            } else {
                existingWindow.focus();
            }
            return existingWindow;
        }
        
        const window = new DesktopWindow(app);
        this.desktopArea.appendChild(window.element);
        window.focus();
        this.windows.push(window);
        
        Taskbar.updateWindowIndicators();
        return window;
    }
    
    /**
     * Close app window
     */
    closeWindow(appId) {
        const window = this.windows.find(w => w.app.id === appId);
        if (window) {
            window.close();
        }
    }
    
    /**
     * Load persisted windows
     * @private
     */
    loadWindows() {
        // Windows will be restored when apps are launched
    }
    
    /**
     * Handle window resize
     * @private
     */
    onWindowResize() {
        this.windows.forEach(window => {
            if (!window.element.classList.contains('maximized')) {
                const maxX = window.innerWidth - window.element.offsetWidth;
                const maxY = window.innerHeight - CONFIG.TASKBAR_HEIGHT - window.element.offsetHeight;
                
                const left = Math.min(parseInt(window.element.style.left), maxX);
                const top = Math.min(parseInt(window.element.style.top), maxY);
                
                window.element.style.left = left + 'px';
                window.element.style.top = top + 'px';
            } else {
                window.element.style.width = window.innerWidth + 'px';
                window.element.style.height = (window.innerHeight - CONFIG.TASKBAR_HEIGHT) + 'px';
            }
        });
    }
}

// Global desktop manager
const Desktop = new DesktopManager();
