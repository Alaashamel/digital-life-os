/* ============================================================
   Digital Life OS - Notification System
   Display notifications and alerts to users
   ============================================================ */

class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxVisible = CONFIG.NOTIFICATION.MAX_VISIBLE;
        this.init();
    }
    
    /**
     * Initialize notification system
     */
    init() {
        this.container = document.getElementById('notifications');
        if (!this.container) {
            this.container = createElement('div', { id: 'notifications', class: 'notifications-container' });
            document.body.appendChild(this.container);
        }
        this.setupStyles();
    }
    
    /**
     * Setup notification styles dynamically
     * @private
     */
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .notifications-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: ${CONFIG.Z_INDEX.NOTIFICATION};
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 400px;
                pointer-events: none;
            }
            
            .notification {
                background: var(--bg-secondary);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 16px;
                display: flex;
                gap: 12px;
                box-shadow: var(--shadow-lg);
                animation: slideInRight 0.3s ease-in-out;
                pointer-events: auto;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification.notification-success {
                border-left: 4px solid var(--success-color);
                --notif-color: var(--success-color);
            }
            
            .notification.notification-error {
                border-left: 4px solid var(--error-color);
                --notif-color: var(--error-color);
            }
            
            .notification.notification-warning {
                border-left: 4px solid var(--warning-color);
                --notif-color: var(--warning-color);
            }
            
            .notification.notification-info {
                border-left: 4px solid var(--info-color);
                --notif-color: var(--info-color);
            }
            
            .notification-icon {
                min-width: 24px;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--notif-color);
                font-weight: bold;
                font-size: 18px;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-title {
                font-weight: 600;
                font-size: 14px;
                color: var(--text-primary);
                margin-bottom: 4px;
            }
            
            .notification-message {
                font-size: 13px;
                color: var(--text-secondary);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color var(--transition-fast);
            }
            
            .notification-close:hover {
                color: var(--text-primary);
            }
            
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @media (max-width: 480px) {
                .notifications-container {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Show a notification
     * @param {Object} options - Notification options
     * @returns {string} Notification ID
     */
    show(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = CONFIG.NOTIFICATION.DURATION,
        } = options;
        
        const id = generateID('notif');
        const notification = { id, type, title, message, duration };
        
        this.notifications.push(notification);
        this.render(id, notification);
        
        if (duration > 0) {
            setTimeout(() => this.remove(id), duration);
        }
        
        return id;
    }
    
    /**
     * Show success notification
     */
    success(title, message = '') {
        return this.show({ type: 'success', title, message, duration: CONFIG.NOTIFICATION.DURATION });
    }
    
    /**
     * Show error notification
     */
    error(title, message = '') {
        return this.show({ type: 'error', title, message, duration: CONFIG.NOTIFICATION.DURATION * 2 });
    }
    
    /**
     * Show warning notification
     */
    warning(title, message = '') {
        return this.show({ type: 'warning', title, message, duration: CONFIG.NOTIFICATION.DURATION });
    }
    
    /**
     * Show info notification
     */
    info(title, message = '') {
        return this.show({ type: 'info', title, message, duration: CONFIG.NOTIFICATION.DURATION });
    }
    
    /**
     * Render notification element
     * @private
     */
    render(id, notification) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '!',
            info: 'ℹ',
        };
        
        const element = createElement('div', {
            class: `notification notification-${notification.type}`,
            'data-id': id,
        });
        
        element.innerHTML = `
            <div class="notification-icon">${icons[notification.type]}</div>
            <div class="notification-content">
                ${notification.title ? `<div class="notification-title">${notification.title}</div>` : ''}
                ${notification.message ? `<div class="notification-message">${notification.message}</div>` : ''}
            </div>
            <button class="notification-close" data-id="${id}">×</button>
        `;
        
        element.querySelector('.notification-close').addEventListener('click', () => {
            this.remove(id);
        });
        
        this.container.appendChild(element);
        
        requestAnimationFrame(() => {
            element.classList.add('show');
        });
    }
    
    /**
     * Remove notification
     */
    remove(id) {
        const element = this.container.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.classList.remove('show');
            setTimeout(() => element.remove(), 300);
        }
        
        this.notifications = this.notifications.filter(n => n.id !== id);
    }
    
    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications.forEach(n => this.remove(n.id));
    }
}

// Global notification manager
const Notifications = new NotificationManager();
