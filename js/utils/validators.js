/* ============================================================
   Digital Life OS - Input Validators
   Validation functions for user input
   ============================================================ */

const Validators = {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    email(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    url(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },
    
    /**
     * Validate hex color
     * @param {string} color - Color to validate
     * @returns {boolean} True if valid
     */
    hexColor(color) {
        return /^#(?:[0-9a-f]{3}){1,2}$/i.test(color);
    },
    
    /**
     * Validate password (minimum 8 chars, 1 uppercase, 1 number)
     * @param {string} password - Password to validate
     * @returns {boolean} True if valid
     */
    password(password) {
        return password.length >= 8 &&
               /[A-Z]/.test(password) &&
               /[0-9]/.test(password);
    },
    
    /**
     * Validate phone number
     * @param {string} phone - Phone to validate
     * @returns {boolean} True if valid
     */
    phone(phone) {
        return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
    },
    
    /**
     * Validate string length
     * @param {string} str - String to validate
     * @param {number} min - Minimum length
     * @param {number} max - Maximum length
     * @returns {boolean} True if valid
     */
    stringLength(str, min, max) {
        const length = str.length;
        return length >= min && length <= max;
    },
    
    /**
     * Validate number range
     * @param {number} num - Number to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} True if valid
     */
    numberRange(num, min, max) {
        return num >= min && num <= max;
    },
    
    /**
     * Validate required field (not empty)
     * @param {string} value - Value to validate
     * @returns {boolean} True if not empty
     */
    required(value) {
        return value != null && value.toString().trim().length > 0;
    },
    
    /**
     * Validate alphanumeric
     * @param {string} str - String to validate
     * @returns {boolean} True if valid
     */
    alphanumeric(str) {
        return /^[a-zA-Z0-9]*$/.test(str);
    },
    
    /**
     * Validate username (alphanumeric, underscore, hyphen)
     * @param {string} username - Username to validate
     * @returns {boolean} True if valid
     */
    username(username) {
        return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
    },
    
    /**
     * Validate IP address
     * @param {string} ip - IP to validate
     * @returns {boolean} True if valid
     */
    ipAddress(ip) {
        const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(ip);
    },
    
    /**
     * Validate date format (YYYY-MM-DD)
     * @param {string} dateStr - Date string to validate
     * @returns {boolean} True if valid
     */
    dateFormat(dateStr) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;
        
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date);
    },
    
    /**
     * Validate credit card number (Luhn algorithm)
     * @param {string} cardNumber - Card number to validate
     * @returns {boolean} True if valid
     */
    creditCard(cardNumber) {
        const digits = cardNumber.replace(/\D/g, '');
        if (digits.length < 13) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    },
    
    /**
     * Sanitize HTML input (prevent XSS)
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    /**
     * Validate all fields in an object
     * @param {Object} data - Data to validate
     * @param {Object} rules - Validation rules
     * @returns {Object} Errors object (empty if valid)
     */
    validateObject(data, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = data[field];
            
            if (rule.required && !this.required(value)) {
                errors[field] = `${field} is required`;
                continue;
            }
            
            if (rule.type === 'email' && !this.email(value)) {
                errors[field] = `Invalid ${field}`;
            } else if (rule.type === 'url' && !this.url(value)) {
                errors[field] = `Invalid ${field}`;
            } else if (rule.minLength && value.length < rule.minLength) {
                errors[field] = `${field} must be at least ${rule.minLength} characters`;
            } else if (rule.maxLength && value.length > rule.maxLength) {
                errors[field] = `${field} must be at most ${rule.maxLength} characters`;
            }
        }
        
        return errors;
    },
};
