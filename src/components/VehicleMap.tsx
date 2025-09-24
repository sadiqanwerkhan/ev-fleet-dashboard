import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vehicle } from '../types';
import Icon from './ui/Icon';
import { useTheme } from '../hooks/useTheme';
import styles from '../styles/VehicleMap.module.css';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface VehicleMapProps {
  vehicles: Vehicle[];
  className?: string;
}

const VehicleMap: React.FC<VehicleMapProps> = ({ vehicles, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const { isDarkMode } = useTheme();

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const createCustomIcon = (status: Vehicle['status']) => {
    const iconClass = status === 'active' ? styles.markerActive :
                     status === 'maintenance' ? styles.markerMaintenance :
                     styles.markerInactive;
    
    return L.divIcon({
      className: `${styles.customMarker} ${iconClass}`,
      html: '<div></div>',
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
  };

  const createPopupContent = (vehicle: Vehicle) => {
    const statusClass = vehicle.status === 'active' ? styles.popupValueActive :
                       vehicle.status === 'maintenance' ? styles.popupValueMaintenance :
                       styles.popupValueInactive;
    
    return `
      <div class="${styles.popup}">
        <h3 class="${styles.popupTitle}">${vehicle.name}</h3>
        <p class="${styles.popupModel}">${vehicle.model}</p>
        <p class="${styles.popupId}">ID: ${vehicle.id}</p>
        <div class="${styles.popupGrid}">
          <div class="${styles.popupMetric}">
            <span class="${styles.popupLabel}">Speed:</span>
            <strong class="${styles.popupValue}">${vehicle.telemetry.speed} km/h</strong>
          </div>
          <div class="${styles.popupMetric}">
            <span class="${styles.popupLabel}">Battery:</span>
            <strong class="${styles.popupValue}">${vehicle.telemetry.batteryLevel}%</strong>
          </div>
          <div class="${styles.popupMetric}">
            <span class="${styles.popupLabel}">Status:</span>
            <strong class="${styles.popupValue} ${statusClass}">${vehicle.status.toUpperCase()}</strong>
          </div>
          <div class="${styles.popupMetric}">
            <span class="${styles.popupLabel}">Charging:</span>
            <strong class="${styles.popupValue}">${vehicle.telemetry.chargingStatus}</strong>
          </div>
        </div>
        <p class="${styles.popupFooter}">
          Last updated: ${new Date(vehicle.lastUpdated).toLocaleTimeString()}
        </p>
      </div>
    `;
  };

  useEffect(() => {
    if (!mapRef.current) return;


    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [40.7128, -74.0060], // NYC coordinates
      zoom: 11,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isDarkMode, vehicles.length]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    clearMarkers();

    // Add markers for each vehicle
    vehicles.forEach(vehicle => {
      if (!vehicle.telemetry?.location) {
        return;
      }
      
      const { lat, lng } = vehicle.telemetry.location;
      const customIcon = createCustomIcon(vehicle.status);
      const popupContent = createPopupContent(vehicle);

      const marker = L.marker([lat, lng], { icon: customIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(popupContent);

      markersRef.current.push(marker);
    });

    // Fit map to show all vehicles if there are any
    if (vehicles.length > 0 && markersRef.current.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [vehicles, vehicles.length]);

  const legendItems = [
    { status: 'Active', dotClass: styles.legendDotActive },
    { status: 'Maintenance', dotClass: styles.legendDotMaintenance },
    { status: 'Inactive', dotClass: styles.legendDotInactive },
  ];

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.header}>
        <div className="flex items-center justify-between">
          <h3 className={styles.title}>
            <Icon name="car" size="md" /> 
            Vehicle Locations
          </h3>
          <div className={styles.legend}>
            {legendItems.map((item) => (
              <div key={item.status} className={styles.legendItem}>
                <div className={`${styles.legendDot} ${item.dotClass}`}></div>
                <span className={styles.legendText}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.mapContainer}>
        <div ref={mapRef} className="h-full w-full"></div>
      </div>
    </div>
  );
};

export default VehicleMap;
