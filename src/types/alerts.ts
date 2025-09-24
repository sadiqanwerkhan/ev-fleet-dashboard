export interface Alert {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'low_battery' | 'high_temperature' | 'maintenance_due' | 'charging_error' | 'speed_limit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  isDismissed: boolean;
}

export interface AlertThresholds {
  lowBattery: number;
  highTemperature: number;
  maintenanceDue: number; // km
  speedLimit: number; // km/h
}

export const DEFAULT_THRESHOLDS: AlertThresholds = {
  lowBattery: 20, // %
  highTemperature: 45, // °C
  maintenanceDue: 50000, // km
  speedLimit: 120, // km/h
};
