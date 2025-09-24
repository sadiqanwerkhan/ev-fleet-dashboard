import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Vehicle, VehicleStatus, ChargingStatus, FilterState as GlobalFilterState } from '../types';
import useDebounce from './useDebounce';

export type FilterStatus = 'all' | 'active' | 'inactive' | 'maintenance';
export type ChargingFilter = 'all' | 'charging' | 'discharging' | 'idle';

export type FilterState = GlobalFilterState;

export interface FilterCounts {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  charging: number;
  discharging: number;
  idle: number;
}

const useVehicleFilters = (vehicles: Vehicle[]) => {
  // Initialize filters from URL parameters
  const getInitialFilters = (): FilterState => {
    const urlParams = new URLSearchParams(window.location.search);
    const parseList = (value: string | null): string[] => {
      if (!value) return [];
      return value.split(',').map(v => v.trim()).filter(Boolean);
    };
    return {
      status: parseList(urlParams.get('status')) as VehicleStatus[],
      charging: parseList(urlParams.get('charging')) as ChargingStatus[],
    };
  };

  const [filters, setFilters] = useState<FilterState>(getInitialFilters);
  const [pendingFilters, setPendingFilters] = useState<FilterState>(getInitialFilters);
  
  // Debounce filter changes to improve performance
  const debouncedFilters = useDebounce(pendingFilters, 150);
  const updateTimeoutRef = useRef<number | undefined>(undefined);

  // Update URL when filters change (debounced)
  const updateURL = useCallback((newFilters: FilterState) => {
    // Clear any pending timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    // Use requestIdleCallback for non-critical URL updates
    updateTimeoutRef.current = window.setTimeout(() => {
      const urlParams = new URLSearchParams();
      if (newFilters.status.length > 0) {
        urlParams.set('status', newFilters.status.join(','));
      }
      if (newFilters.charging.length > 0) {
        urlParams.set('charging', newFilters.charging.join(','));
      }

      const newUrl = urlParams.toString() 
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;
      
      window.history.pushState({}, '', newUrl);
    }, 300);
  }, []);

  // Apply debounced filters
  useEffect(() => {
    setFilters(debouncedFilters);
    updateURL(debouncedFilters);
  }, [debouncedFilters, updateURL]);

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      setFilters(getInitialFilters());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const statusMatch = filters.status.length === 0 || filters.status.includes(vehicle.status);
      const chargingMatch = filters.charging.length === 0 || filters.charging.includes(vehicle.telemetry.chargingStatus);
      return statusMatch && chargingMatch;
    });
  }, [vehicles, filters]);

  const filterCounts = useMemo((): FilterCounts => {
    return {
      total: vehicles.length,
      active: vehicles.filter(v => v.status === 'active').length,
      inactive: vehicles.filter(v => v.status === 'inactive').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
      charging: vehicles.filter(v => v.telemetry.chargingStatus === 'charging').length,
      discharging: vehicles.filter(v => v.telemetry.chargingStatus === 'discharging').length,
      idle: vehicles.filter(v => v.telemetry.chargingStatus === 'idle').length,
    };
  }, [vehicles]);

  const setStatusFilter = useCallback((status: FilterStatus) => {
    // Use pending filters for immediate UI updates
    setPendingFilters(current => {
      let nextStatuses: VehicleStatus[] = current.status;
      if (status === 'all') {
        nextStatuses = [];
      } else {
        const exists = nextStatuses.includes(status as VehicleStatus);
        nextStatuses = exists
          ? nextStatuses.filter(s => s !== status)
          : [...nextStatuses, status as VehicleStatus];
      }
      return { ...current, status: nextStatuses };
    });
  }, []);

  const setChargingFilter = useCallback((charging: ChargingFilter) => {
    setPendingFilters(current => {
      let nextCharging: ChargingStatus[] = current.charging;
      if (charging === 'all') {
        nextCharging = [];
      } else {
        const exists = nextCharging.includes(charging as ChargingStatus);
        nextCharging = exists
          ? nextCharging.filter(c => c !== (charging as ChargingStatus))
          : [...nextCharging, charging as ChargingStatus];
      }
      return { ...current, charging: nextCharging };
    });
  }, []);

  const clearFilters = useCallback(() => {
    const newFilters = { status: [] as VehicleStatus[], charging: [] as ChargingStatus[] };
    setPendingFilters(newFilters);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    filters: pendingFilters, // Use pending filters for immediate UI feedback
    filteredVehicles,
    filterCounts,
    setStatusFilter,
    setChargingFilter,
    clearFilters,
  };
};

export default useVehicleFilters;
