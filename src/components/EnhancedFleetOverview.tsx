import React, { useEffect, useState, Suspense, lazy } from 'react';
import Icon from './ui/Icon';
import type { Vehicle } from '../types';
import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';

// Lazy load chart components
const StatusChart = lazy(() => import('./charts/StatusChart'));
const BatteryChart = lazy(() => import('./charts/BatteryChart'));
const SpeedChart = lazy(() => import('./charts/SpeedChart'));
const EnergyChart = lazy(() => import('./charts/EnergyChart'));

interface EnhancedFleetOverviewProps {
  vehicles: Vehicle[];
}

const EnhancedFleetOverview: React.FC<EnhancedFleetOverviewProps> = ({ vehicles }) => {
  const [shouldLoadCharts, setShouldLoadCharts] = useState(false);

  // Safety check for vehicles prop
  const safeVehicles = (() => {
    if (!Array.isArray(vehicles)) {
      return [];
    }
    return vehicles;
  })();

  // Calculate fleet stats
  const fleetStats = (() => {
    if (!safeVehicles || safeVehicles.length === 0) {
      return {
        activeVehicles: 0,
        inactiveVehicles: 0,
        maintenanceVehicles: 0,
        chargingVehicles: 0,
        averageBattery: 0,
        averageSpeed: 0,
        totalOdometer: 0,
      };
    }

    let activeVehicles = 0;
    let inactiveVehicles = 0;
    let maintenanceVehicles = 0;
    let chargingVehicles = 0;
    let totalBattery = 0;
    let totalSpeed = 0;
    let activeCount = 0;
    let totalOdometer = 0;

    // Process vehicles in chunks to avoid blocking the main thread
    safeVehicles.forEach(vehicle => {
      if (!vehicle || !vehicle.telemetry) return;

      switch (vehicle.status) {
        case 'active':
          activeVehicles++;
          totalSpeed += vehicle.telemetry.speed || 0;
          activeCount++;
          break;
        case 'inactive':
          inactiveVehicles++;
          break;
        case 'maintenance':
          maintenanceVehicles++;
          break;
      }

      if (vehicle.telemetry.chargingStatus === 'charging') {
        chargingVehicles++;
      }

      totalBattery += vehicle.telemetry.batteryLevel || 0;
      totalOdometer += vehicle.telemetry.odometer || 0;
    });
    
    return {
      activeVehicles,
      inactiveVehicles,
      maintenanceVehicles,
      chargingVehicles,
      averageBattery: safeVehicles.length > 0 ? Math.round(totalBattery / safeVehicles.length) : 0,
      averageSpeed: activeCount > 0 ? Math.round(totalSpeed / activeCount) : 0,
      totalOdometer,
    };
  })();

  const chartData = (() => {
    if (!safeVehicles || safeVehicles.length === 0) {
      return {
        statusData: [
          { name: 'Active', value: 0, color: '#10B981' },
          { name: 'Maintenance', value: 0, color: '#F59E0B' },
          { name: 'Inactive', value: 0, color: '#6B7280' },
        ],
        batteryData: [],
        speedData: [],
        energyConsumptionData: [],
      };
    }

    const statusData = [
      { name: 'Active', value: fleetStats.activeVehicles, color: '#10B981' },
      { name: 'Maintenance', value: fleetStats.maintenanceVehicles, color: '#F59E0B' },
      { name: 'Inactive', value: fleetStats.inactiveVehicles, color: '#6B7280' },
    ];

    const batteryData = safeVehicles
      .filter(vehicle => vehicle && vehicle.telemetry && vehicle.name)
      .map(vehicle => ({
        name: vehicle.name.split(' ')[2] || vehicle.id, // Extract vehicle number or fallback to ID
        battery: vehicle.telemetry.batteryLevel || 0,
        status: vehicle.status,
      }));

    const speedData = safeVehicles
      .filter(v => v && v.status === 'active' && v.telemetry && v.name)
      .map(vehicle => ({
        name: vehicle.name.split(' ')[2] || vehicle.id,
        speed: vehicle.telemetry.speed || 0,
      }));

    const energyConsumptionData = safeVehicles
      .filter(vehicle => vehicle && vehicle.telemetry && vehicle.name)
      .map(vehicle => ({
        name: vehicle.name.split(' ')[2] || vehicle.id,
        consumption: vehicle.telemetry.energyConsumption || 0,
      }));

    return { statusData, batteryData, speedData, energyConsumptionData };
  })();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const defaultMetricIds = ['total','active','avg','charging'] as const;
  const defaultChartIds = ['status','battery','speed','energy'] as const;
  const [metricOrder, setMetricOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('fleetMetricOrder');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed)) return parsed; 
      } catch {
        // Ignore parsing errors
      }
    }
    return [...defaultMetricIds];
  });
  const [chartOrder, setChartOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('fleetChartOrder');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved); 
        if (Array.isArray(parsed)) return parsed; 
      } catch {
        // Ignore parsing errors
      }
    }
    return [...defaultChartIds];
  });
  useEffect(() => { localStorage.setItem('fleetMetricOrder', JSON.stringify(metricOrder)); }, [metricOrder]);
  useEffect(() => { localStorage.setItem('fleetChartOrder', JSON.stringify(chartOrder)); }, [chartOrder]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const translate = transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined;
    const style: React.CSSProperties = {
      transform: translate,
      transition: transition || 'transform 200ms ease',
      willChange: 'transform',
      visibility: isDragging ? 'hidden' : 'visible',
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  };

  const renderMetricById = (id: string) => {
    switch (id) {
      case 'total':
        return (
          <div className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400"><Icon name="car" size="md" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{vehicles.length}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vehicles</div>
            </div>
          </div>
        );
      case 'active':
        return (
          <div className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400"><Icon name="check" size="md" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{fleetStats.activeVehicles}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</div>
            </div>
          </div>
        );
      case 'avg':
        return (
          <div className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-400"><Icon name="battery" size="md" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{fleetStats.averageBattery}%</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Battery</div>
            </div>
          </div>
        );
      default: // 'charging'
        return (
          <div className="rounded-xl p-6 border transition-all duration-200 hover:shadow-lg bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 bg-yellow-100 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-400"><Icon name="charging" size="md" /></div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{fleetStats.chargingVehicles}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Charging</div>
            </div>
          </div>
        );
    }
  };

  // Lazy load charts after metrics are visible
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoadCharts(true);
    }, 500); // Delay chart loading to prioritize metrics
    
    return () => clearTimeout(timer);
  }, []);

  const renderChartPlaceholder = (title: string) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="h-[250px] bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
      </div>
    </div>
  );

  const renderChartById = (id: string) => {
    if (!shouldLoadCharts) {
      const titles = {
        status: 'Vehicle Status Distribution',
        battery: 'Battery Levels by Vehicle',
        speed: 'Active Vehicle Speeds',
        energy: 'Energy Consumption (kWh/100km)',
      };
      return renderChartPlaceholder(titles[id as keyof typeof titles] || 'Chart');
    }

    try {
      const chartProps = { data: chartData };
      
      switch (id) {
        case 'status':
          return (
            <Suspense fallback={renderChartPlaceholder('Vehicle Status Distribution')}>
              <StatusChart {...chartProps} />
            </Suspense>
          );
        case 'battery':
          return (
            <Suspense fallback={renderChartPlaceholder('Battery Levels by Vehicle')}>
              <BatteryChart {...chartProps} />
            </Suspense>
          );
        case 'speed':
          return (
            <Suspense fallback={renderChartPlaceholder('Active Vehicle Speeds')}>
              <SpeedChart {...chartProps} />
            </Suspense>
          );
        case 'energy':
          return (
            <Suspense fallback={renderChartPlaceholder('Energy Consumption')}>
              <EnergyChart {...chartProps} />
            </Suspense>
          );
        default:
          return renderChartPlaceholder('Chart');
      }
    } catch (error) {
      return renderChartPlaceholder('Chart Error');
    }
  };

  const onMetricDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const onMetricDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) { 
      setActiveId(null); 
      return; 
    }
    setMetricOrder((items) => {
      const oldIndex = items.indexOf(String(active.id));
      const newIndex = items.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(items, oldIndex, newIndex);
      }
      return items;
    });
    setActiveId(null);
  };

  const onChartDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  const onChartDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) { 
      setActiveId(null); 
      return; 
    }
    setChartOrder((items) => {
      const oldIndex = items.indexOf(String(active.id));
      const newIndex = items.indexOf(String(over.id));
      if (oldIndex !== -1 && newIndex !== -1) {
        return arrayMove(items, oldIndex, newIndex);
      }
      return items;
    });
    setActiveId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white mb-6">
        <Icon name="chart" size="md" />
        Fleet Analytics Dashboard
      </h2>
      
      {/* Key Metrics */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onMetricDragStart} onDragEnd={onMetricDragEnd} modifiers={[restrictToParentElement]} autoScroll>
        <SortableContext items={metricOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricOrder.map((id) => (
              <SortableItem key={id} id={id}>{renderMetricById(id)}</SortableItem>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>{activeId && defaultMetricIds.includes(activeId as typeof defaultMetricIds[number]) ? renderMetricById(activeId) : null}</DragOverlay>
      </DndContext>

      {/* Charts Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onChartDragStart} onDragEnd={onChartDragEnd} modifiers={[restrictToParentElement]} autoScroll>
        <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {chartOrder.map((id) => (
              <SortableItem key={id} id={id}>{renderChartById(id)}</SortableItem>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>{activeId && defaultChartIds.includes(activeId as typeof defaultChartIds[number]) ? renderChartById(activeId) : null}</DragOverlay>
      </DndContext>

      {/* Additional Stats */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Speed:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{fleetStats.averageSpeed} km/h</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Distance:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(fleetStats.totalOdometer / 1000)}K km</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Maintenance Required:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{fleetStats.maintenanceVehicles} vehicles</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Fleet Efficiency:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{Math.round((fleetStats.activeVehicles / safeVehicles.length) * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFleetOverview;
