import { useMemo, useState, useEffect, useCallback } from 'react';
import type { Vehicle } from '../types';
import type { Alert, AlertThresholds } from '../types/alerts';
import { DEFAULT_THRESHOLDS } from '../types/alerts';

export const useAlerts = (vehicles: Vehicle[]) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [thresholds] = useState<AlertThresholds>(DEFAULT_THRESHOLDS);

  // Generate alerts based on vehicle data
  const generateAlerts = useCallback((vehicles: Vehicle[]): Alert[] => {
    const newAlerts: Alert[] = [];
    const now = Date.now();

    vehicles.forEach((vehicle) => {
      const baseId = `${vehicle.id}_${now}`;

      // Low battery alert
      if (vehicle.telemetry.batteryLevel <= thresholds.lowBattery) {
        const severity = vehicle.telemetry.batteryLevel <= 10 ? 'critical' : 
                        vehicle.telemetry.batteryLevel <= 15 ? 'high' : 'medium';
        newAlerts.push({
          id: `${baseId}_battery`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'low_battery',
          severity,
          title: 'Low Battery Warning',
          message: `Battery level at ${vehicle.telemetry.batteryLevel}%. Charging recommended.`,
          timestamp: now,
          isRead: false,
          isDismissed: false,
        });
      }

      // High temperature alert
      if (vehicle.telemetry.temperature >= thresholds.highTemperature) {
        const severity = vehicle.telemetry.temperature >= 55 ? 'critical' :
                        vehicle.telemetry.temperature >= 50 ? 'high' : 'medium';
        newAlerts.push({
          id: `${baseId}_temp`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'high_temperature',
          severity,
          title: 'High Temperature Alert',
          message: `Temperature at ${vehicle.telemetry.temperature}°C. System may overheat.`,
          timestamp: now,
          isRead: false,
          isDismissed: false,
        });
      }

      // Maintenance due alert
      if (vehicle.telemetry.odometer >= thresholds.maintenanceDue) {
        newAlerts.push({
          id: `${baseId}_maintenance`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'maintenance_due',
          severity: 'medium',
          title: 'Maintenance Required',
          message: `Vehicle has traveled ${Math.round(vehicle.telemetry.odometer / 1000)}km. Schedule maintenance.`,
          timestamp: now,
          isRead: false,
          isDismissed: false,
        });
      }

      // Charging error for vehicles that should be charging
      if (vehicle.telemetry.chargingStatus === 'idle' && 
          vehicle.telemetry.batteryLevel <= 30 && 
          vehicle.status === 'inactive') {
        newAlerts.push({
          id: `${baseId}_charging`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'charging_error',
          severity: 'high',
          title: 'Charging Issue',
          message: `Vehicle idle with ${vehicle.telemetry.batteryLevel}% battery. Check charging connection.`,
          timestamp: now,
          isRead: false,
          isDismissed: false,
        });
      }

      // Speed limit alert for active vehicles
      if (vehicle.status === 'active' && vehicle.telemetry.speed > thresholds.speedLimit) {
        newAlerts.push({
          id: `${baseId}_speed`,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          type: 'speed_limit',
          severity: 'high',
          title: 'Speed Limit Exceeded',
          message: `Vehicle traveling at ${vehicle.telemetry.speed} km/h. Speed limit: ${thresholds.speedLimit} km/h.`,
          timestamp: now,
          isRead: false,
          isDismissed: false,
        });
      }
    });

    return newAlerts;
  }, [thresholds]);

  // Update alerts when vehicles change
  useEffect(() => {
    const newAlerts = generateAlerts(vehicles);
    
    // Merge with existing alerts, avoiding duplicates
    setAlerts(prevAlerts => {
      const existingIds = new Set(prevAlerts.map(a => a.id));
      const uniqueNewAlerts = newAlerts.filter(alert => !existingIds.has(alert.id));
      
      // Keep only recent alerts (last 24 hours) and non-dismissed
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      const recentAlerts = prevAlerts.filter(alert => 
        alert.timestamp > cutoff && !alert.isDismissed
      );
      
      return [...recentAlerts, ...uniqueNewAlerts];
    });
  }, [vehicles, generateAlerts]);

  // Alert management functions
  const markAsRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isDismissed: true } : alert
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  }, []);

  const clearDismissed = useCallback(() => {
    setAlerts(prev => prev.filter(alert => !alert.isDismissed));
  }, []);

  // Computed values
  const activeAlerts = useMemo(() => 
    alerts.filter(alert => !alert.isDismissed), [alerts]
  );

  const unreadCount = useMemo(() => 
    activeAlerts.filter(alert => !alert.isRead).length, [activeAlerts]
  );

  const criticalCount = useMemo(() => 
    activeAlerts.filter(alert => alert.severity === 'critical').length, [activeAlerts]
  );

  const alertsByVehicle = useMemo(() => {
    const grouped: Record<string, Alert[]> = {};
    activeAlerts.forEach(alert => {
      if (!grouped[alert.vehicleId]) {
        grouped[alert.vehicleId] = [];
      }
      grouped[alert.vehicleId].push(alert);
    });
    return grouped;
  }, [activeAlerts]);

  return {
    alerts: activeAlerts,
    unreadCount,
    criticalCount,
    alertsByVehicle,
    markAsRead,
    dismissAlert,
    markAllAsRead,
    clearDismissed,
    thresholds,
  };
};
