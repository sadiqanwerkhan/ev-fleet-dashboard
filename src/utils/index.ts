import type { Vehicle, TelemetryData, Coordinates } from '../types';

// Date utilities
export const formatTimestamp = (timestamp: string): string => {
  const now = new Date();
  const updated = new Date(timestamp);
  const diffMs = now.getTime() - updated.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  return `${Math.floor(diffSeconds / 3600)}h ago`;
};

export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  });
};

// Vehicle utilities
export const generateRandomTelemetry = (): TelemetryData => ({
  speed: Math.floor(Math.random() * 120), // 0-120 km/h
  batteryLevel: Math.floor(Math.random() * 100), // 0-100%
  temperature: Math.floor(Math.random() * 60) + 10, // 10-70°C
  tirePressure: Math.floor(Math.random() * 20) + 25, // 25-45 PSI
  motorEfficiency: Math.floor(Math.random() * 30) + 70, // 70-100%
  regenerativeBraking: Math.random() > 0.7,
  location: {
    lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Around NYC
    lng: -74.0060 + (Math.random() - 0.5) * 0.1,
  },
  odometer: Math.floor(Math.random() * 50000) + 10000, // 10k-60k km
  energyConsumption: Math.floor(Math.random() * 15) + 15, // 15-30 kWh/100km
  chargingStatus: ['charging', 'discharging', 'idle'][Math.floor(Math.random() * 3)] as 'charging' | 'discharging' | 'idle',
  voltage: Math.floor(Math.random() * 100) + 350, // 350-450V
  current: Math.floor(Math.random() * 200) + 50, // 50-250A
});

export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const getVehicleStatusColor = (status: Vehicle['status']): string => {
  switch (status) {
    case 'active': return '#10B981';
    case 'inactive': return '#6B7280';
    case 'maintenance': return '#F59E0B';
    default: return '#6B7280';
  }
};

export const getChargingStatusIcon = (status: string): string => {
  switch (status) {
    case 'charging': return '🔋';
    case 'discharging': return '⚡';
    case 'idle': return '⏸️';
    default: return '❓';
  }
};

// Performance utilities
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidCoordinate = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Storage utilities
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
};

export const safeJsonStringify = (obj: unknown): string => {
  try {
    return JSON.stringify(obj);
  } catch {
    return '{}';
  }
};

// Array utilities
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Error handling utilities
export const createError = (message: string, code?: string): Error => {
  const error = new Error(message);
  if (code) {
    (error as Error & { code: string }).code = code;
  }
  return error;
};

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  fallback: T
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    return fallback;
  }
};
