import React from 'react';
import type { Vehicle } from '../store/vehicleSlice';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const getStatusColor = (status: Vehicle['status']) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      case 'maintenance': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getChargingStatusIcon = (status: string) => {
    switch (status) {
      case 'charging': return '🔋';
      case 'discharging': return '⚡';
      case 'idle': return '⏸️';
      default: return '❓';
    }
  };

  const formatLastUpdated = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now.getTime() - updated.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    return `${Math.floor(diffSeconds / 3600)}h ago`;
  };

  return (
    <div className="vehicle-card">
      <div className="vehicle-header">
        <div className="vehicle-info">
          <h3 className="vehicle-name">{vehicle.name}</h3>
          <p className="vehicle-model">{vehicle.model}</p>
          <p className="vehicle-id">ID: {vehicle.id}</p>
        </div>
        <div className="vehicle-status">
          <div 
            className="status-indicator" 
            style={{ backgroundColor: getStatusColor(vehicle.status) }}
          ></div>
          <span className="status-text">{vehicle.status.toUpperCase()}</span>
        </div>
      </div>

      <div className="telemetry-grid">
        <div className="telemetry-item primary">
          <div className="telemetry-icon">🏃</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.speed}</span>
            <span className="telemetry-unit">km/h</span>
          </div>
          <span className="telemetry-label">Speed</span>
        </div>

        <div className="telemetry-item primary">
          <div className="telemetry-icon">🔋</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.batteryLevel}</span>
            <span className="telemetry-unit">%</span>
          </div>
          <span className="telemetry-label">Battery</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">🌡️</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.temperature}</span>
            <span className="telemetry-unit">°C</span>
          </div>
          <span className="telemetry-label">Temp</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">🛞</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.tirePressure}</span>
            <span className="telemetry-unit">PSI</span>
          </div>
          <span className="telemetry-label">Tire Pressure</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">⚙️</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.motorEfficiency}</span>
            <span className="telemetry-unit">%</span>
          </div>
          <span className="telemetry-label">Motor Eff</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">{getChargingStatusIcon(vehicle.telemetry.chargingStatus)}</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.chargingStatus}</span>
          </div>
          <span className="telemetry-label">Charging</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">🔄</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.regenerativeBraking ? 'ON' : 'OFF'}</span>
          </div>
          <span className="telemetry-label">Regen Brake</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">📊</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.energyConsumption}</span>
            <span className="telemetry-unit">kWh/100km</span>
          </div>
          <span className="telemetry-label">Energy</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">🗺️</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.odometer.toLocaleString()}</span>
            <span className="telemetry-unit">km</span>
          </div>
          <span className="telemetry-label">Odometer</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">⚡</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.voltage}</span>
            <span className="telemetry-unit">V</span>
          </div>
          <span className="telemetry-label">Voltage</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">🔌</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.current}</span>
            <span className="telemetry-unit">A</span>
          </div>
          <span className="telemetry-label">Current</span>
        </div>

        <div className="telemetry-item">
          <div className="telemetry-icon">📍</div>
          <div className="telemetry-data">
            <span className="telemetry-value">{vehicle.telemetry.location.lat.toFixed(4)}</span>
            <span className="telemetry-unit">, {vehicle.telemetry.location.lng.toFixed(4)}</span>
          </div>
          <span className="telemetry-label">Location</span>
        </div>
      </div>

      <div className="vehicle-footer">
        <span className="last-updated">
          Last updated: {formatLastUpdated(vehicle.lastUpdated)}
        </span>
      </div>
    </div>
  );
};

export default VehicleCard;

