import React, { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FilterState, SortState, FilterCounts } from '../../types';
import Icon from '../ui/Icon';
import clsx from 'clsx';

interface VehicleFiltersProps {
  filters: FilterState;
  sortState: SortState;
  filterCounts: FilterCounts;
  onStatusFilterChange: (status: 'all' | 'active' | 'inactive' | 'maintenance') => void;
  onChargingFilterChange: (charging: 'all' | 'charging' | 'discharging' | 'idle') => void;
  onSortOptionChange: (option: SortState['option']) => void;
  onSortOrderToggle: () => void;
  onClearFilters: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = memo(({
  filters,
  sortState,
  filterCounts,
  onStatusFilterChange,
  onChargingFilterChange,
  onSortOptionChange,
  onSortOrderToggle,
  onClearFilters,
}) => {
  const { t } = useTranslation();
  const statusButtons = useMemo(() => [
    { key: 'all' as const, label: t('common.all'), count: filterCounts.total },
    { key: 'active' as const, label: t('analytics.active'), count: filterCounts.active },
    { key: 'inactive' as const, label: t('status.inactive'), count: filterCounts.inactive },
    { key: 'maintenance' as const, label: t('status.maintenance'), count: filterCounts.maintenance },
  ], [filterCounts, t]);

  const chargingButtons = useMemo(() => [
    { key: 'all' as const, label: t('common.all'), count: filterCounts.total },
    { key: 'charging' as const, label: t('analytics.charging'), count: filterCounts.charging },
    { key: 'discharging' as const, label: t('status.discharging'), count: filterCounts.discharging },
    { key: 'idle' as const, label: t('status.idle'), count: filterCounts.idle },
  ], [filterCounts, t]);

  return (
    <div className="relative overflow-hidden rounded-2xl transition-all duration-300 shadow-lg z-20 bg-gradient-to-br from-white to-gray-50 border border-gray-200 dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
      {/* Header with Gradient Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500" />

      <div className="p-6">
        {/* Modern Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Icon name="filter" size="md" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">{t('filters.title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('filters.subtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClearFilters}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 dark:border-red-800"
          >
            {t('filters.clearAll')}
          </button>
        </div>

        <div className="space-y-6">
          {/* Status Filter Section */}
          <div className="p-4 rounded-xl border bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <label className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t('filters.vehicleStatus')}</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusButtons.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => onStatusFilterChange(key)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border',
                    (key === 'all' && filters.status.length === 0) || (key !== 'all' && filters.status.includes(key as 'active' | 'inactive' | 'maintenance'))
                      ? 'bg-green-500 text-white border-green-500 shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600'
                  )}
                >
                  {label} <span className="ml-1 opacity-75">({count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Charging Status Filter Section */}
          <div className="p-4 rounded-xl border bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <label className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t('filters.chargingStatus')}</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {chargingButtons.map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => onChargingFilterChange(key)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 border',
                    (key === 'all' && filters.charging.length === 0) || (key !== 'all' && filters.charging.includes(key as 'charging' | 'discharging' | 'idle'))
                      ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600'
                  )}
                >
                  {label} <span className="ml-1 opacity-75">({count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Controls Section */}
          <div className="p-4 rounded-xl border relative z-30 bg-white border-gray-200 dark:bg-gray-800/50 dark:border-gray-600">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <label className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">{t('filters.sortOptions')}</label>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <select
                  className="w-full px-4 py-3 rounded-xl border appearance-none cursor-pointer transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 relative z-40 bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={sortState.option}
                  onChange={(e) => onSortOptionChange(e.target.value as SortState['option'])}
                >
                  <option value="name">{t('filters.vehicleName')}</option>
                  <option value="battery">{t('filters.batteryLevel')}</option>
                  <option value="speed">{t('filters.speed')}</option>
                  <option value="odometer">{t('filters.distance')}</option>
                  <option value="status">{t('filters.status')}</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
                  <Icon name="arrow-down" size="sm" />
                </div>
              </div>

              <button
                onClick={onSortOrderToggle}
                className="px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:border-gray-600"
              >
                <Icon name={sortState.order === 'asc' ? 'arrow-up' : 'arrow-down'} size="md" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

VehicleFilters.displayName = 'VehicleFilters';

export default VehicleFilters;
