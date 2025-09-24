import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Vehicle, VehicleState, VehicleUpdatePayload } from '../types';
import { generateRandomTelemetry } from '../utils';

const generateInitialVehicles = (): Vehicle[] => {
  const vehicles: Vehicle[] = [];
  const models = ['Tesla Model S', 'BMW iX', 'Audi e-tron', 'Mercedes EQS', 'Rivian R1T', 'Ford F-150 Lightning', 'Volvo XC40', 'Nissan Leaf', 'Hyundai Ioniq 5', 'Lucid Air'];
  
  for (let i = 1; i <= 10; i++) {
    vehicles.push({
      id: `EV-${i.toString().padStart(3, '0')}`,
      name: `Fleet Vehicle ${i}`,
      model: models[i - 1],
      status: Math.random() > 0.8 ? 'maintenance' : Math.random() > 0.1 ? 'active' : 'inactive',
      telemetry: generateRandomTelemetry(),
      lastUpdated: new Date().toISOString(),
    });
  }
  
  return vehicles;
};

const initialVehicles = generateInitialVehicles();

const initialState: VehicleState = {
  vehicles: initialVehicles,
  isSimulating: false,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    updateVehicleTelemetry: (state, action: PayloadAction<VehicleUpdatePayload>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.vehicleId);
      if (vehicle) {
        vehicle.telemetry = { ...vehicle.telemetry, ...action.payload.telemetry };
        vehicle.lastUpdated = new Date().toISOString();
      }
    },
    updateAllVehicleTelemetry: (state) => {
      state.vehicles.forEach(vehicle => {
        if (vehicle.status === 'active') {
          vehicle.telemetry = generateRandomTelemetry();
          vehicle.lastUpdated = new Date().toISOString();
        }
      });
    },
    setSimulationStatus: (state, action: PayloadAction<boolean>) => {
      state.isSimulating = action.payload;
    },
    updateVehicleStatus: (state, action: PayloadAction<{ vehicleId: string; status: Vehicle['status'] }>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.vehicleId);
      if (vehicle) {
        vehicle.status = action.payload.status;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
});

export const { 
  updateVehicleTelemetry, 
  updateAllVehicleTelemetry, 
  setSimulationStatus, 
  updateVehicleStatus,
  setError,
  clearError
} = vehicleSlice.actions;

export default vehicleSlice.reducer;

