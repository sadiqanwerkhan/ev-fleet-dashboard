import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useSimulation } from '../hooks';
import ErrorBoundary from './ui/ErrorBoundary';
import Spinner from './ui/Spinner';

// Lazy load the main layout component with higher priority
const OptimizedDashboardLayout = lazy(() => 
  import(/* webpackChunkName: "dashboard-layout" */ './layouts/OptimizedDashboardLayout')
);

const Dashboard: React.FC = () => {
  const { isSimulating, toggleSimulation } = useSimulation();
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure hydration is complete before showing heavy components
  useEffect(() => {
    setIsHydrated(true);
    
    // Preload critical components for better LCP
    import('./layouts/OptimizedDashboardLayout');
  }, []);

  // Show minimal loading state immediately for better perceived performance
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="h-16 bg-white/95 dark:bg-gray-800/95 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EV Fleet Dashboard
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center justify-center pt-20">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="h-16 bg-white/95 dark:bg-gray-800/95 border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EV Fleet Dashboard
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center justify-center pt-20">
            <Spinner size="lg" />
          </div>
        </div>
      }>
        <OptimizedDashboardLayout 
          isSimulating={isSimulating}
          onToggleSimulation={toggleSimulation}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Dashboard;

