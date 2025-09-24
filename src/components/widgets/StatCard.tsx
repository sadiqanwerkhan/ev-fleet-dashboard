import React, { memo } from 'react';
import Card from './Card';
import Icon from '../ui/Icon';
import clsx from 'clsx';

export interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = memo(({ 
  icon, 
  value, 
  label, 
  trend = 'neutral',
  trendValue,
  className 
}) => {
  const trendClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <Card className={className} hover>
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Icon name={icon} size="lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
            {label}
          </p>
          {trendValue && (
            <p className={clsx('text-xs', trendClasses[trend])}>
              {trend === 'up' && '↗'} {trend === 'down' && '↘'} {trendValue}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
