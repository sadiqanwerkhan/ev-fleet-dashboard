import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { updateAllVehicleTelemetry, setSimulationStatus } from '../store/vehicleSlice';
import VehicleCard from './VehicleCard';
import FleetOverview from './FleetOverview';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { vehicles, isSimulating } = useSelector((state: RootState) => state.vehicles);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isSimulating) {
      intervalId = setInterval(() => {
        dispatch(updateAllVehicleTelemetry());
      }, Math.random() * 4000 + 1000); // Random interval between 1-5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSimulating, dispatch]);

  const toggleSimulation = () => {
    dispatch(setSimulationStatus(!isSimulating));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">⚡ EV Fleet Dashboard</h1>
          <div className="header-controls">
            <button 
              className={`simulation-toggle ${isSimulating ? 'active' : ''}`}
              onClick={toggleSimulation}
            >
              {isSimulating ? '⏸️ Pause Simulation' : '▶️ Start Simulation'}
            </button>
            <div className="status-indicator-header">
              <div className={`indicator ${isSimulating ? 'active' : 'inactive'}`}></div>
              <span>{isSimulating ? 'Live Data' : 'Paused'}</span>
            </div>
          </div>
        </div>
      </header>

      <FleetOverview vehicles={vehicles} />

      <div className="vehicles-grid">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

