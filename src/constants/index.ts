// Application Constants
export const APP_CONFIG = {
  NAME: 'EV Fleet Dashboard',
  VERSION: '1.0.0',
  DESCRIPTION: 'Real-time electric vehicle fleet monitoring dashboard',
  AUTHOR: 'Sadiq Anwer Khan',
  REPOSITORY: 'https://github.com/sadiqanwerkhan/ev-fleet-dashboard',
} as const;

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Simulation Configuration
export const SIMULATION_CONFIG = {
  MIN_INTERVAL: 1000, // 1 second
  MAX_INTERVAL: 5000, // 5 seconds
  DEFAULT_INTERVAL: 3000, // 3 seconds
  MAX_VEHICLES: 100,
  DEFAULT_VEHICLE_COUNT: 10,
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 40.7128,
    lng: -74.0060,
  },
  DEFAULT_ZOOM: 11,
  MIN_ZOOM: 5,
  MAX_ZOOM: 18,
  CLUSTER_RADIUS: 50,
  MARKER_SIZE: 26,
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  STORAGE_KEY: 'ev-fleet-theme',
  DEFAULT_THEME: 'system',
  THEMES: ['light', 'dark', 'system'] as const,
  TRANSITION_DURATION: 300,
} as const;

// Layout Configuration
export const LAYOUT_CONFIG = {
  STORAGE_KEY: 'ev-fleet-layout',
  DEFAULT_BREAKPOINTS: {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
  },
  DEFAULT_COLS: {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
  },
  ROW_HEIGHT: 60,
  MARGIN: [16, 16],
} as const;

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  ENABLE_MONITORING: import.meta.env.MODE === 'development',
  LOG_LEVEL: 'info',
  MAX_METRICS_HISTORY: 100,
  MEMORY_CHECK_INTERVAL: 30000, // 30 seconds
  RENDER_THRESHOLD: 16, // 60fps
} as const;

// Vehicle Configuration
export const VEHICLE_CONFIG = {
  MODELS: [
    'Tesla Model S',
    'BMW iX',
    'Audi e-tron',
    'Mercedes EQS',
    'Rivian R1T',
    'Ford F-150 Lightning',
    'Volvo XC40',
    'Nissan Leaf',
    'Hyundai Ioniq 5',
    'Lucid Air',
  ] as const,
  
  STATUSES: ['active', 'inactive', 'maintenance'] as const,
  CHARGING_STATUSES: ['charging', 'discharging', 'idle'] as const,
  
  TELEMETRY_RANGES: {
    SPEED: { min: 0, max: 120 },
    BATTERY_LEVEL: { min: 0, max: 100 },
    TEMPERATURE: { min: 10, max: 70 },
    TIRE_PRESSURE: { min: 25, max: 45 },
    MOTOR_EFFICIENCY: { min: 70, max: 100 },
    ODOMETER: { min: 10000, max: 60000 },
    ENERGY_CONSUMPTION: { min: 15, max: 30 },
    VOLTAGE: { min: 350, max: 450 },
    CURRENT: { min: 50, max: 250 },
  },
} as const;

// Filter Configuration
export const FILTER_CONFIG = {
  STORAGE_KEY: 'ev-fleet-filters',
  DEBOUNCE_DELAY: 300,
  MAX_FILTERS: 10,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  LOADING_ERROR: 'Failed to load data. Please try again.',
  SIMULATION_ERROR: 'Simulation failed to start. Please refresh the page.',
  MAP_ERROR: 'Failed to load map. Please check your connection.',
  THEME_ERROR: 'Failed to apply theme. Using default theme.',
  STORAGE_ERROR: 'Failed to save preferences. Data will not persist.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please refresh the page.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SIMULATION_STARTED: 'Simulation started successfully',
  SIMULATION_STOPPED: 'Simulation stopped successfully',
  THEME_CHANGED: 'Theme changed successfully',
  FILTERS_APPLIED: 'Filters applied successfully',
  LAYOUT_SAVED: 'Layout saved successfully',
  DATA_UPDATED: 'Data updated successfully',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'ev-fleet-theme',
  LAYOUT: 'ev-fleet-layout',
  FILTERS: 'ev-fleet-filters',
  SIMULATION_STATE: 'ev-fleet-simulation',
  USER_PREFERENCES: 'ev-fleet-preferences',
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1280,
} as const;

// Z-Index Values
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;
