import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PerformanceMetrics, PerformanceConfig } from '../types';

const defaultConfig: PerformanceConfig = {
  enableMonitoring: true,
  logLevel: 'info',
  maxHistorySize: 100,
};

export const usePerformanceMonitor = (config: Partial<PerformanceConfig> = {}) => {
  const finalConfig = React.useMemo(() => ({ ...defaultConfig, ...config }), [config]);
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const renderStartTime = useRef<number>(0);
  const componentMounts = useRef<number>(0);

  const logPerformance = useCallback((componentName: string, renderTime: number) => {
    if (!finalConfig.enableMonitoring) return;

    const newMetric: PerformanceMetrics = {
      renderTime,
      componentMounts: componentMounts.current,
      memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0,
      lastUpdate: new Date().toISOString(),
    };

    setMetrics(prev => {
      const updated = [...prev, newMetric];
      return updated.slice(-finalConfig.maxHistorySize);
    });

    // Performance logging disabled for production
  }, [finalConfig]);

  const startRenderTimer = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderTimer = useCallback((componentName: string) => {
    const renderTime = performance.now() - renderStartTime.current;
    logPerformance(componentName, renderTime);
  }, [logPerformance]);

  const trackComponentMount = useCallback(() => {
    componentMounts.current += 1;
  }, []);

  const getAverageRenderTime = useCallback(() => {
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, metric) => sum + metric.renderTime, 0);
    return total / metrics.length;
  }, [metrics]);

  const getMemoryUsage = useCallback(() => {
    return (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0;
  }, []);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
  }, []);

  // Monitor memory usage periodically
  useEffect(() => {
    if (!finalConfig.enableMonitoring) return;

    const interval = setInterval(() => {
      // Memory monitoring disabled for production
    }, 30000);

    return () => clearInterval(interval);
  }, [finalConfig.enableMonitoring, finalConfig.logLevel, getMemoryUsage]);

  return {
    metrics,
    startRenderTimer,
    endRenderTimer,
    trackComponentMount,
    getAverageRenderTime,
    getMemoryUsage,
    clearMetrics,
  };
};

export const withPerformanceMonitor = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> => {
  return React.memo((props: P) => {
    const { startRenderTimer, endRenderTimer, trackComponentMount } = usePerformanceMonitor();

    useEffect(() => {
      trackComponentMount();
      startRenderTimer();
    }, [trackComponentMount, startRenderTimer]);

    useEffect(() => {
      endRenderTimer(componentName);
    }, [endRenderTimer]);

    return React.createElement(Component, props);
  });
};
