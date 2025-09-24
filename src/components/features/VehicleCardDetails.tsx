import React, { memo, useMemo } from 'react';
import type { Vehicle } from '../../types';
import Icon from '../ui/Icon';

interface VehicleCardDetailsProps {
  vehicle: Vehicle;
  chargingConfig: {
    icon: string;
    color: string;
  };
}

const VehicleCardDetails: React.FC<VehicleCardDetailsProps> = memo(({ vehicle, chargingConfig }) => {
  const detailedItems = useMemo(() => [
    { icon: 'temperature', label: 'Temperature', value: `${vehicle.telemetry.temperature}°C` },
    { icon: 'tire', label: 'Tire Pressure', value: `${vehicle.telemetry.tirePressure} PSI` },
    { icon: 'motor', label: 'Motor Efficiency', value: `${vehicle.telemetry.motorEfficiency}%` },
    { icon: chargingConfig.icon, label: 'Charging Status', value: vehicle.telemetry.chargingStatus },
    { icon: 'check', label: 'Regen Brake', value: vehicle.telemetry.regenerativeBraking ? 'ON' : 'OFF' },
    { icon: 'chart', label: 'Energy Consumption', value: `${vehicle.telemetry.energyConsumption} kWh/100km` },
    { icon: 'odometer', label: 'Odometer', value: `${vehicle.telemetry.odometer.toLocaleString()} km` },
    { icon: 'voltage', label: 'Voltage', value: `${vehicle.telemetry.voltage} V` },
    { icon: 'current', label: 'Current', value: `${vehicle.telemetry.current} A` },
    { icon: 'location', label: 'Location', value: `${vehicle.telemetry.location.lat.toFixed(4)}, ${vehicle.telemetry.location.lng.toFixed(4)}` },
  ], [vehicle.telemetry, chargingConfig.icon]);

  const getIconColor = useMemo(() => (iconName: string) => {
    switch (iconName) {
      case 'temperature': return 'text-red-500';
      case 'tire': return 'text-gray-600';
      case 'motor': return 'text-purple-500';
      case 'charging': return 'text-green-500';
      case 'battery': return 'text-red-500';
      case 'pause': return 'text-gray-500';
      case 'check': return 'text-green-500';
      case 'chart': return 'text-orange-500';
      case 'odometer': return 'text-indigo-500';
      case 'voltage': return 'text-yellow-500';
      case 'current': return 'text-cyan-500';
      case 'location': return 'text-pink-500';
      default: return 'text-gray-500';
    }
  }, []);

  const formatLastUpdated = useMemo(() => {
    const now = new Date();
    const updated = new Date(vehicle.lastUpdated);
    const diffMs = now.getTime() - updated.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  }, [vehicle.lastUpdated]);

  return (
    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-2 gap-3">
        {detailedItems.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border transition-all duration-200 hover:shadow-sm bg-gray-50 border-gray-200 hover:bg-white dark:bg-gray-800/30 dark:border-gray-600"
          >
            <div className="flex items-center space-x-2">
              <Icon name={item.icon} size="sm" className={getIconColor(item.icon)} />
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Last Updated */}
      <div className="text-center pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last updated: {formatLastUpdated}
        </p>
      </div>
    </div>
  );
});

VehicleCardDetails.displayName = 'VehicleCardDetails';

export default VehicleCardDetails;
