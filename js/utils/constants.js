/* ============================================================
   Digital Life OS - Constants
   Global constants and configuration
   ============================================================ */

const CONFIG = {
    // App Configuration
    APP_NAME: 'Digital Life OS',
    APP_VERSION: '1.0.0',
    
    // Storage Keys
    STORAGE_KEYS: {
        THEME: 'dlos_theme',
        USER_SETTINGS: 'dlos_user_settings',
        WINDOWS_STATE: 'dlos_windows_state',
        NOTES: 'dlos_notes',
        CALENDAR_EVENTS: 'dlos_calendar_events',
        MUSIC_PLAYLIST: 'dlos_music_playlist',
        CHATBOT_HISTORY: 'dlos_chatbot_history',
        WEATHER_DATA: 'dlos_weather_data',
        GAME_SCORES: 'dlos_game_scores',
    },
    
    // Themes
    THEMES: ['dark', 'light', 'neon'],
    DEFAULT_THEME: 'dark',
    
    // Window Configuration
    WINDOW_MIN_WIDTH: 300,
    WINDOW_MIN_HEIGHT: 200,
    WINDOW_DEFAULT_WIDTH: 600,
    WINDOW_DEFAULT_HEIGHT: 400,
    
    // Taskbar Configuration
    TASKBAR_HEIGHT: 60,
    
    // Z-Index Configuration
    Z_INDEX: {
        TASKBAR: 1000,
        WINDOW: 100,
        WINDOW_ACTIVE: 200,
        NOTIFICATION: 2000,
        MODAL: 1500,
    },
    
    // Animation Durations (ms)
    ANIMATION: {
        FAST: 150,
        NORMAL: 300,
        SLOW: 500,
    },
    
    // Apps Configuration
    APPS: [
        {
            id: 'notes',
            name: 'Notes',
            icon: '📝',
            width: 600,
            height: 500,
        },
        {
            id: 'music',
            name: 'Music',
            icon: '🎵',
            width: 500,
            height: 600,
        },
        {
            id: 'calendar',
            name: 'Calendar',
            icon: '📅',
            width: 700,
            height: 550,
        },
        {
            id: 'chatbot',
            name: 'Chatbot',
            icon: '💬',
            width: 500,
            height: 600,
        },
        {
            id: 'weather',
            name: 'Weather',
            icon: '🌤️',
            width: 400,
            height: 500,
        },
        {
            id: 'games',
            name: 'Games',
            icon: '🎮',
            width: 600,
            height: 600,
        },
    ],
    
    // API Configuration
    WEATHER_API: {
        BASE_URL: 'https://api.openweathermap.org/data/2.5',
        ICON_URL: 'https://openweathermap.org/img/wn',
        TIMEOUT: 10000,
    },
    
    // Notification Configuration
    NOTIFICATION: {
        DURATION: 5000,
        MAX_VISIBLE: 5,
    },
};

// User Settings Defaults
const DEFAULT_USER_SETTINGS = {
    theme: CONFIG.DEFAULT_THEME,
    soundEnabled: true,
    notificationsEnabled: true,
    autoSave: true,
    autoSaveInterval: 30000, // 30 seconds
};

// Desktop Constants
const DESKTOP_CONSTANTS = {
    GRID_SIZE: 20, // For snapping
    SNAP_THRESHOLD: 50, // Pixels
};
