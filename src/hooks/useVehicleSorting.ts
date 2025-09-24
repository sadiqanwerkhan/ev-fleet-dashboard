import { useState, useMemo, useCallback } from 'react';
import type { Vehicle } from '../types';

export type SortOption = 'name' | 'battery' | 'speed' | 'odometer' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortState {
  option: SortOption;
  order: SortOrder;
}

const useVehicleSorting = (vehicles: Vehicle[]) => {
  const [sortState, setSortState] = useState<SortState>({
    option: 'name',
    order: 'asc',
  });

  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortState.option) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'battery':
          aValue = a.telemetry.batteryLevel;
          bValue = b.telemetry.batteryLevel;
          break;
        case 'speed':
          aValue = a.telemetry.speed;
          bValue = b.telemetry.speed;
          break;
        case 'odometer':
          aValue = a.telemetry.odometer;
          bValue = b.telemetry.odometer;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (sortState.order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [vehicles, sortState]);

  const setSortOption = useCallback((option: SortOption) => {
    setSortState(prev => ({ ...prev, option }));
  }, []);

  const setSortOrder = useCallback((order: SortOrder) => {
    setSortState(prev => ({ ...prev, order }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortState(prev => ({ 
      ...prev, 
      order: prev.order === 'asc' ? 'desc' : 'asc' 
    }));
  }, []);

  return {
    sortState,
    sortedVehicles,
    setSortOption,
    setSortOrder,
    toggleSortOrder,
  };
};

export default useVehicleSorting;
