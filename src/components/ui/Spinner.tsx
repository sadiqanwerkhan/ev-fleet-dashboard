import React, { memo } from 'react';
import clsx from 'clsx';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = memo(({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div 
      className={clsx(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400',
        sizeClasses[size],
        className
      )} 
      role="status" 
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
});

Spinner.displayName = 'Spinner';

export default Spinner;
