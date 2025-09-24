import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { updateAllVehicleTelemetry, setSimulationStatus } from '../store/vehicleSlice';
import { SIMULATION_CONFIG } from '../constants';

export interface UseSimulationReturn {
  isSimulating: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  toggleSimulation: () => void;
  simulationInterval: number;
  setSimulationInterval: (interval: number) => void;
  error: string | null;
  clearError: () => void;
}

const useSimulation = (): UseSimulationReturn => {
  const dispatch = useDispatch();
  const { isSimulating } = useSelector((state: RootState) => state.vehicles);
  const [simulationInterval, setSimulationInterval] = useState(SIMULATION_CONFIG.DEFAULT_INTERVAL);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const startSimulation = useCallback(() => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      dispatch(setSimulationStatus(true));
      
      intervalRef.current = window.setInterval(() => {
        dispatch(updateAllVehicleTelemetry());
      }, simulationInterval);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start simulation');
    }
  }, [dispatch, simulationInterval]);

  const stopSimulation = useCallback(() => {
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      dispatch(setSimulationStatus(false));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop simulation');
    }
  }, [dispatch]);

  const toggleSimulation = useCallback(() => {
    if (isSimulating) {
      stopSimulation();
    } else {
      startSimulation();
    }
  }, [isSimulating, startSimulation, stopSimulation]);

  const handleSetSimulationInterval = useCallback((interval: number) => {
    const clampedInterval = Math.max(
      SIMULATION_CONFIG.MIN_INTERVAL,
      Math.min(SIMULATION_CONFIG.MAX_INTERVAL, interval)
    );
    
    setSimulationInterval(clampedInterval as typeof SIMULATION_CONFIG.DEFAULT_INTERVAL);
    
    // Restart simulation with new interval if currently running
    if (isSimulating) {
      stopSimulation();
      setTimeout(() => {
        startSimulation();
      }, 100);
    }
  }, [isSimulating, startSimulation, stopSimulation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-start simulation if it was running before
  useEffect(() => {
    if (isSimulating && !intervalRef.current) {
      startSimulation();
    }
  }, [isSimulating, startSimulation]);

  return {
    isSimulating,
    startSimulation,
    stopSimulation,
    toggleSimulation,
    simulationInterval,
    setSimulationInterval: handleSetSimulationInterval,
    error,
    clearError,
  };
};

export default useSimulation;
