import React from 'react';
import type { Vehicle } from '../store/vehicleSlice';

interface FleetOverviewProps {
  vehicles: Vehicle[];
}

const FleetOverview: React.FC<FleetOverviewProps> = ({ vehicles }) => {
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const inactiveVehicles = vehicles.filter(v => v.status === 'inactive').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  
  const averageBattery = Math.round(
    vehicles.reduce((sum, v) => sum + v.telemetry.batteryLevel, 0) / vehicles.length
  );
  
  const averageSpeed = Math.round(
    vehicles.filter(v => v.status === 'active').reduce((sum, v) => sum + v.telemetry.speed, 0) / 
    Math.max(activeVehicles, 1)
  );
  
  const totalOdometer = vehicles.reduce((sum, v) => sum + v.telemetry.odometer, 0);
  
  const chargingVehicles = vehicles.filter(v => v.telemetry.chargingStatus === 'charging').length;

  return (
    <div className="fleet-overview">
      <h2 className="overview-title">Fleet Overview</h2>
      
      <div className="overview-stats">
        <div className="stat-card primary">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <div className="stat-value">{vehicles.length}</div>
            <div className="stat-label">Total Vehicles</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{activeVehicles}</div>
            <div className="stat-label">Active</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <div className="stat-value">{maintenanceVehicles}</div>
            <div className="stat-label">Maintenance</div>
          </div>
        </div>

        <div className="stat-card inactive">
          <div className="stat-icon">⏹️</div>
          <div className="stat-content">
            <div className="stat-value">{inactiveVehicles}</div>
            <div className="stat-label">Inactive</div>
          </div>
        </div>

        <div className="stat-card battery">
          <div className="stat-icon">🔋</div>
          <div className="stat-content">
            <div className="stat-value">{averageBattery}%</div>
            <div className="stat-label">Avg Battery</div>
          </div>
        </div>

        <div className="stat-card speed">
          <div className="stat-icon">🏃</div>
          <div className="stat-content">
            <div className="stat-value">{averageSpeed}</div>
            <div className="stat-label">Avg Speed (km/h)</div>
          </div>
        </div>

        <div className="stat-card distance">
          <div className="stat-icon">🗺️</div>
          <div className="stat-content">
            <div className="stat-value">{Math.round(totalOdometer / 1000)}K</div>
            <div className="stat-label">Total Distance (km)</div>
          </div>
        </div>

        <div className="stat-card charging">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{chargingVehicles}</div>
            <div className="stat-label">Charging</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FleetOverview;

