import React, { memo, Suspense, lazy, useEffect, useMemo, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { useVehicleFilters, useVehicleSorting, useAlerts } from '../../hooks';
import Card from '../widgets/Card';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import ErrorBoundary from '../ui/ErrorBoundary';
import Spinner from '../ui/Spinner';
import NotificationBell from '../ui/NotificationBell';
import NotificationCenter from '../ui/NotificationCenter';
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy, rectSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

// Lazy load heavy components with chunk names and preloading
const VehicleMap = lazy(() => 
  import(/* webpackChunkName: "vehicle-map" */ '../VehicleMap')
);
const EnhancedFleetOverview = lazy(() => 
  import(/* webpackChunkName: "fleet-overview" */ '../EnhancedFleetOverview')
);
const VehicleFilters = lazy(() => 
  import(/* webpackChunkName: "vehicle-filters" */ '../features/VehicleFilters')
);
const VehicleCard = lazy(() => 
  import(/* webpackChunkName: "vehicle-card" */ '../features/VehicleCard')
);

interface OptimizedDashboardLayoutProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

const OptimizedDashboardLayout: React.FC<OptimizedDashboardLayoutProps> = memo(({ 
  isSimulating, 
  onToggleSimulation 
}) => {
  const { t, i18n } = useTranslation();
  const { toggleTheme } = useTheme();
  const vehicles = useSelector((state: RootState) => state.vehicles.vehicles);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Optimize DnD sensors for better performance
  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { distance: 8, delay: 100 } // Reduce accidental drags
    })
  );

  // Preload heavy components after initial render
  useEffect(() => {
    const preloadComponents = () => {
      // Preload critical below-the-fold components
      import('../VehicleMap');
      import('../features/VehicleFilters');
      import('../features/VehicleCard');
      
      // Delay loading of heavy analytics component
      setTimeout(() => {
        import('../EnhancedFleetOverview');
      }, 1000);
    };

    if (isInitialLoad) {
      setIsInitialLoad(false);
      // Use requestIdleCallback for non-critical preloading
      if ('requestIdleCallback' in window) {
        requestIdleCallback(preloadComponents);
      } else {
        setTimeout(preloadComponents, 100);
      }
    }
  }, [isInitialLoad]);
  const defaultOrder = useMemo(() => ['filters', 'vehicles', 'overview'] as const, []);
  const [leftOrder, setLeftOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('leftPanelOrder');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          return parsed;
        }
      } catch {
        // Ignore parsing errors
      }
    }
    return [...defaultOrder];
  });
  useEffect(() => {
    localStorage.setItem('leftPanelOrder', JSON.stringify(leftOrder));
  }, [leftOrder]);
  
  const {
    filters,
    filteredVehicles,
    filterCounts,
    setStatusFilter,
    setChargingFilter,
    clearFilters,
  } = useVehicleFilters(vehicles);

  const {
    sortState,
    sortedVehicles,
    setSortOption,
    toggleSortOrder,
  } = useVehicleSorting(filteredVehicles);


  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Alert system
  const {
    alerts,
    unreadCount,
    criticalCount,
    markAsRead,
    dismissAlert,
    markAllAsRead,
    clearDismissed,
  } = useAlerts(vehicles);

  // Online/Offline banner
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Vehicle cards drag-and-drop within the grid
  const [vehicleOrder, setVehicleOrder] = useState<string[]>([]);
  useEffect(() => {
    const ids = sortedVehicles.map((v) => String(v.id));
    const stored = localStorage.getItem('vehicleCardOrder');
    let nextOrder: string[] = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          nextOrder = parsed.filter((id: unknown) => typeof id === 'string' && ids.includes(id));
        }
      } catch {
        // Ignore parsing errors
      }
    }
    ids.forEach((id) => { if (!nextOrder.includes(id)) nextOrder.push(id); });
    setVehicleOrder(nextOrder);
  }, [sortedVehicles]);
  useEffect(() => {
    if (vehicleOrder.length) {
      localStorage.setItem('vehicleCardOrder', JSON.stringify(vehicleOrder));
    }
  }, [vehicleOrder]);

  const onVehicleDragStart = (e: DragStartEvent) => setActiveVehicleId(String(e.active.id));
  const onVehicleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) { setActiveVehicleId(null); return; }
    const oldIndex = vehicleOrder.indexOf(String(active.id));
    const newIndex = vehicleOrder.indexOf(String(over.id));
    if (oldIndex !== -1 && newIndex !== -1) {
      setVehicleOrder((items) => arrayMove(items, oldIndex, newIndex));
    }
    setActiveVehicleId(null);
  };

  const vehicleById = useMemo(() => {
    const map = new Map<string, typeof sortedVehicles[number]>();
    sortedVehicles.forEach((v) => map.set(String(v.id), v));
    return map;
  }, [sortedVehicles]);

  const containerRef = useRef<HTMLDivElement>(null);

  const SortableVehicleItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
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

  const renderSectionById = (sectionId: string) => {
    if (sectionId === 'filters') {
      return (
        <section className="relative z-20">
          <ErrorBoundary>
            <Suspense fallback={<Card><Spinner /></Card>}>
              <VehicleFilters
                filters={filters}
                sortState={sortState}
                filterCounts={filterCounts}
                onStatusFilterChange={setStatusFilter}
                onChargingFilterChange={setChargingFilter}
                onSortOptionChange={setSortOption}
                onSortOrderToggle={toggleSortOrder}
                onClearFilters={clearFilters}
              />
            </Suspense>
          </ErrorBoundary>
        </section>
      );
    }
    if (sectionId === 'vehicles') {
      return (
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-colors duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Vehicle Details ({sortedVehicles.length})
            </h2>
          </div>
          <div 
            ref={containerRef}
            className="p-6 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {sortedVehicles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No vehicles found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onVehicleDragStart}
                onDragEnd={onVehicleDragEnd}
                modifiers={[restrictToParentElement]}
                autoScroll
              >
                <SortableContext items={vehicleOrder} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                    {/* Render all vehicles - remove virtual scrolling that was causing visibility issues */}
                    {vehicleOrder
                      .filter((id) => vehicleById.has(id))
                      .map((id) => {
                        const vehicle = vehicleById.get(id);
                        if (!vehicle) return null;
                        
                        return (
                          <SortableVehicleItem key={id} id={id}>
                            <ErrorBoundary>
                              <Suspense fallback={<Card className="p-4 h-72"><Spinner /></Card>}>
                                <VehicleCard vehicle={vehicle} activeFilters={filters} />
                              </Suspense>
                            </ErrorBoundary>
                          </SortableVehicleItem>
                        );
                      })}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeVehicleId && vehicleById.has(activeVehicleId) ? (
                    <div style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))' }}>
                      <Card className="p-0">
                        <Suspense fallback={<Card className="p-4 h-72"><Spinner /></Card>}>
                          <VehicleCard vehicle={vehicleById.get(activeVehicleId)!} activeFilters={filters} />
                        </Suspense>
                      </Card>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </section>
      );
    }
    return (
      <section>
        <ErrorBoundary>
          <Suspense fallback={<Card><Spinner /></Card>}>
            <EnhancedFleetOverview vehicles={vehicles} />
          </Suspense>
        </ErrorBoundary>
      </section>
    );
  };

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };
  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = leftOrder.indexOf(String(active.id));
    const newIndex = leftOrder.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    setLeftOrder((items) => arrayMove(items, oldIndex, newIndex));
    setActiveId(null);
  };
  const onDragCancel = () => setActiveId(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 w-full transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={clearFilters}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 cursor-pointer bg-transparent border-none p-0 m-0"
            >
              {t('common.appTitle')}
            </button>
            <div className="flex items-center space-x-3">
              <Button
                variant={isSimulating ? 'success' : 'secondary'}
                onClick={onToggleSimulation}
                size="sm"
                className="shadow-sm ring-1 ring-blue-300/50 dark:ring-blue-700/40 transition-all duration-200 hover:shadow-md hover:-translate-y-px"
              >
                <Icon name={isSimulating ? 'pause' : 'play'} className="mr-2 inline-flex items-center" />
                {isSimulating ? 'Pause' : 'Start'} Simulation
              </Button>
              
              <NotificationBell
                unreadCount={unreadCount}
                criticalCount={criticalCount}
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                isOpen={isNotificationOpen}
              />
              
              <Button
                variant="secondary"
                onClick={toggleTheme}
                size="sm"
                className="shadow-sm ring-1 ring-gray-300/60 dark:ring-gray-600/60 transition-all duration-200 hover:shadow-md hover:-translate-y-px"
              >
                <Icon name="sun" className="text-gray-700 dark:text-gray-200 inline-flex items-center dark:hidden" />
                <Icon name="moon" className="text-gray-700 dark:text-gray-200 inline-flex items-center hidden dark:inline" />
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="shadow-sm ring-1 ring-gray-300/60 dark:ring-gray-600/60 transition-all duration-200 hover:shadow-md hover:-translate-y-px"
                onClick={() => i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de')}
                title={i18n.language === 'de' ? 'Switch to English' : 'Auf Deutsch umschalten'}
              >
                {i18n.language === 'de' ? 'EN' : 'DE'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isOffline && (
        <div className="w-full bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300" role="status" aria-live="polite">
          <div className="px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 text-sm">
            <Icon name="warning" className="text-orange-500 dark:text-orange-400" />
            <span className="flex-1">{t('common.offlineBanner')}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Column - Analytics and Controls */}
        <div className="w-[calc(100%-700px)] h-[calc(100vh-4rem)] overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-8" style={{ touchAction: 'none' }}>
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            autoScroll
          >
            <SortableContext items={leftOrder} strategy={verticalListSortingStrategy}>
              {leftOrder.map((sectionId) => (
                <SortableItem key={sectionId} id={sectionId}>
                  {renderSectionById(sectionId)}
                </SortableItem>
              ))}
            </SortableContext>
            <DragOverlay dropAnimation={{ duration: 180, easing: 'ease-out' }}>
              {activeId ? (
                <div style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.15))' }}>
                  {renderSectionById(activeId)}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Right Column - Map */}
        <div className="w-[700px] h-[calc(100vh-4rem)] sticky top-16 overflow-hidden scrollbar-hide">
          <ErrorBoundary>
            <Suspense fallback={<div className="h-full flex items-center justify-center"><Spinner /></div>}>
              <VehicleMap vehicles={vehicles} className="h-full" />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        alerts={alerts}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onDismissAlert={dismissAlert}
        onMarkAllAsRead={markAllAsRead}
        onClearDismissed={clearDismissed}
      />
    </div>
  );
});

OptimizedDashboardLayout.displayName = 'OptimizedDashboardLayout';

export default OptimizedDashboardLayout;
