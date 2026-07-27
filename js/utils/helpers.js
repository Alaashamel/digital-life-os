/* ============================================================
   Digital Life OS - Helper Functions
   Utility functions used throughout the application
   ============================================================ */

/**
 * Generate a unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
function generateID(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Debounce delay in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Throttle limit in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @param {string} format - Format string
 * @returns {string} Formatted date
 */
function formatDate(date, format = 'MMM DD, YYYY') {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const dayName = days[date.getDay()];
    
    return format
        .replace('YYYY', year)
        .replace('MMM', month)
        .replace('DD', day)
        .replace('DDD', dayName);
}

/**
 * Format time to readable string
 * @param {Date|number} time - Time as date or milliseconds
 * @param {boolean} use24Hour - Use 24-hour format
 * @returns {string} Formatted time
 */
function formatTime(time, use24Hour = false) {
    if (typeof time === 'number') {
        time = new Date(time);
    }
    
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    
    if (use24Hour) {
        return `${hours}:${minutes}:${seconds}`;
    }
    
    const hour12 = time.getHours() % 12 || 12;
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    return `${String(hour12).padStart(2, '0')}:${minutes} ${ampm}`;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}

/**
 * Create an element with attributes
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string} content - Element content
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'style') {
            Object.assign(element.style, value);
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else {
            element.setAttribute(key, value);
        }
    }
    
    if (content) {
        element.textContent = content;
    }
    
    return element;
}

/**
 * Get random value from array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code
 * @returns {Object} RGB object
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}

/**
 * Convert RGB to hex
 * @param {number} r - Red value
 * @param {number} g - Green value
 * @param {number} b - Blue value
 * @returns {string} Hex color code
 */
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if visible
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add event listener with automatic cleanup
 * @param {HTMLElement} element - Element to attach listener
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @returns {Function} Function to remove listener
 */
function onEvent(element, event, handler) {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
}

/**
 * Sleep/delay
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
