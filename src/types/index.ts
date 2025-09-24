// Core Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TelemetryData {
  speed: number; // km/h
  batteryLevel: number; // percentage (0-100)
  temperature: number; // celsius
  tirePressure: number; // PSI
  motorEfficiency: number; // percentage
  regenerativeBraking: boolean;
  location: Coordinates;
  odometer: number; // km
  energyConsumption: number; // kWh/100km
  chargingStatus: ChargingStatus;
  voltage: number; // volts
  current: number; // amps
}

export type VehicleStatus = 'active' | 'inactive' | 'maintenance';
export type ChargingStatus = 'charging' | 'discharging' | 'idle';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  status: VehicleStatus;
  telemetry: TelemetryData;
  lastUpdated: string; // ISO timestamp
}

// State Management Types
export interface VehicleState {
  vehicles: Vehicle[];
  isSimulating: boolean;
  error?: string;
  lastUpdate?: string;
}

export interface RootState {
  vehicles: VehicleState;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Filter and Sort Types
export type FilterStatus = 'all' | VehicleStatus;
export type ChargingFilter = 'all' | ChargingStatus;
export type SortOption = 'name' | 'battery' | 'speed' | 'odometer' | 'status';
export type SortOrder = 'asc' | 'desc';

// Multi-select filters: empty arrays mean "all"
export interface FilterState {
  status: VehicleStatus[];
  charging: ChargingStatus[];
}

export interface SortState {
  option: SortOption;
  order: SortOrder;
}

export interface FilterCounts {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  charging: number;
  discharging: number;
  idle: number;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface VehicleUpdatePayload {
  vehicleId: string;
  telemetry: Partial<TelemetryData>;
}

// Performance Types
export interface PerformanceMetrics {
  renderTime: number;
  componentMounts: number;
  memoryUsage: number;
  lastUpdate: string;
}

export interface PerformanceConfig {
  enableMonitoring: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  maxHistorySize: number;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Event Types
export interface VehicleEvent {
  type: 'status_change' | 'telemetry_update' | 'error';
  vehicleId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface DashboardEvent {
  type: 'simulation_start' | 'simulation_stop' | 'theme_change' | 'filter_change';
  timestamp: string;
  data: Record<string, unknown>;
}

// Configuration Types
export interface DashboardConfig {
  refreshInterval: number;
  maxVehicles: number;
  enableRealTimeUpdates: boolean;
  defaultTheme: 'light' | 'dark' | 'system';
  mapConfig: {
    defaultZoom: number;
    center: Coordinates;
    enableClustering: boolean;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  component?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

// Alert Types
export * from './alerts';