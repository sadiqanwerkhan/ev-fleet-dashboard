import React, { memo, useMemo, useState, useCallback, lazy, Suspense } from 'react';
import type { Vehicle, FilterState } from '../../types';
import Icon from '../ui/Icon';
import clsx from 'clsx';

// Lazy load detailed metrics for better performance
const DetailedMetrics = lazy(() => import('./VehicleCardDetails'));

interface VehicleCardProps {
  vehicle: Vehicle;
  activeFilters?: FilterState;
}

const VehicleCard: React.FC<VehicleCardProps> = memo(({ vehicle, activeFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldLoadDetails, setShouldLoadDetails] = useState(false);

  // Optimize expand/collapse with useCallback
  const handleToggleExpand = useCallback(() => {
    if (!isExpanded && !shouldLoadDetails) {
      setShouldLoadDetails(true); // Trigger lazy loading
    }
    setIsExpanded(!isExpanded);
  }, [isExpanded, shouldLoadDetails]);



  const chargingConfig = useMemo(() => {
    switch (vehicle.telemetry.chargingStatus) {
      case 'charging':
        return { icon: 'charging', color: 'text-green-500' };
      case 'discharging':
        return { icon: 'battery', color: 'text-red-500' };
      case 'idle':
        return { icon: 'pause', color: 'text-gray-500' };
      default:
        return { icon: 'info', color: 'text-gray-500' };
    }
  }, [vehicle.telemetry.chargingStatus]);

  // formatLastUpdated moved to VehicleCardDetails component

  const primaryItems = useMemo(() => {
    const speedItem = { icon: 'speed', label: 'Speed', value: `${vehicle.telemetry.speed} km/h` } as const;
    const batteryItem = { icon: 'battery', label: 'Battery', value: `${vehicle.telemetry.batteryLevel}%` } as const;
    const chargingItem = { icon: chargingConfig.icon, label: 'Charging', value: vehicle.telemetry.chargingStatus } as const;

    const hasChargingFilter = !!activeFilters && Array.isArray(activeFilters.charging) && activeFilters.charging.length > 0;
    if (hasChargingFilter) {
      // Show Charging alongside Speed when charging filter is active
      return [speedItem, chargingItem];
    }
    // Default: Speed + Battery
    return [speedItem, batteryItem];
  }, [vehicle.telemetry.speed, vehicle.telemetry.batteryLevel, vehicle.telemetry.chargingStatus, chargingConfig.icon, activeFilters]);

  // Removed detailed items - now handled by VehicleCardDetails component

  return (
    <div className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl h-fit bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 dark:shadow-xl">
      {/* Status Indicator Strip */}
      <div className={clsx(
        'h-1 w-full',
        vehicle.status === 'active' && 'bg-gradient-to-r from-green-400 to-green-600',
        vehicle.status === 'maintenance' && 'bg-gradient-to-r from-yellow-400 to-orange-500',
        vehicle.status === 'inactive' && 'bg-gradient-to-r from-gray-400 to-gray-600'
      )} />

      <div className="p-6 space-y-4">
        {/* Header with Modern Layout */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={clsx(
              'w-12 h-12 rounded-full flex items-center justify-center',
              vehicle.status === 'active' && 'bg-green-100 text-green-600',
              vehicle.status === 'maintenance' && 'bg-yellow-100 text-yellow-600',
              vehicle.status === 'inactive' && 'bg-gray-100 text-gray-600'
            )}>
              <Icon name="car" size="md" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {vehicle.name}
              </h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {vehicle.model}
              </p>
            </div>
          </div>

          <div className={clsx(
            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
            vehicle.status === 'active' && 'bg-green-100 text-green-700',
            vehicle.status === 'maintenance' && 'bg-yellow-100 text-yellow-700',
            vehicle.status === 'inactive' && 'bg-gray-100 text-gray-700'
          )}>
            {vehicle.status}
          </div>
        </div>

        {/* Primary Metrics with Modern Cards */}
        <div className="grid grid-cols-2 gap-4">
          {primaryItems.map((item, index) => (
            <div
              key={index}
              className="relative p-4 rounded-xl border transition-all duration-200 hover:shadow-md bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600 dark:hover:bg-gray-700/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className="text-base font-bold mt-1 text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
                <div className={clsx(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  item.icon === 'speed' && 'bg-green-100 text-green-600',
                  item.icon === 'battery' && 'bg-blue-100 text-blue-600',
                  item.icon === 'charging' && 'bg-green-100 text-green-600',
                  item.icon === 'pause' && 'bg-gray-100 text-gray-600'
                )}>
                  <Icon name={item.icon} size="md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Expand Button with Modern Styling */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleToggleExpand}
            className="px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Hide vehicle details' : 'Show vehicle details'}
          >
            <Icon 
              name={isExpanded ? 'arrow-up' : 'arrow-down'} 
              size="sm" 
              className="mr-2 inline-block" 
            />
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Detailed Metrics - Lazy Loaded */}
        {isExpanded && shouldLoadDetails && (
          <Suspense fallback={
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse h-16" />
                ))}
              </div>
            </div>
          }>
            <DetailedMetrics vehicle={vehicle} chargingConfig={chargingConfig} />
          </Suspense>
        )}
      </div>
    </div>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard;
