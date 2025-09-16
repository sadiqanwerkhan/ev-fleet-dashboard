import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TelemetryData {
  speed: number; // km/h
  batteryLevel: number; // percentage
  temperature: number; // celsius
  tirePressure: number; // PSI
  motorEfficiency: number; // percentage
  regenerativeBraking: boolean;
  location: { lat: number; lng: number };
  odometer: number; // km
  energyConsumption: number; // kWh/100km
  chargingStatus: 'charging' | 'discharging' | 'idle';
  voltage: number; // volts
  current: number; // amps
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'inactive' | 'maintenance';
  telemetry: TelemetryData;
  lastUpdated: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  isSimulating: boolean;
}

const generateRandomTelemetry = (): TelemetryData => ({
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

const initialState: VehicleState = {
  vehicles: generateInitialVehicles(),
  isSimulating: false,
};

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    updateVehicleTelemetry: (state, action: PayloadAction<{ vehicleId: string; telemetry: TelemetryData }>) => {
      const vehicle = state.vehicles.find(v => v.id === action.payload.vehicleId);
      if (vehicle) {
        vehicle.telemetry = action.payload.telemetry;
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
  },
});

export const { updateVehicleTelemetry, updateAllVehicleTelemetry, setSimulationStatus, updateVehicleStatus } = vehicleSlice.actions;
export default vehicleSlice.reducer;

