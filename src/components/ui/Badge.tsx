import React, { memo } from 'react';
import clsx from 'clsx';

export interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = memo(({ 
  variant = 'primary', 
  size = 'md', 
  children,
  className 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    primary: 'bg-blue-500 dark:bg-blue-600 text-white',
    secondary: 'bg-gray-500 dark:bg-gray-600 text-white',
    success: 'bg-green-500 dark:bg-green-600 text-white',
    warning: 'bg-yellow-500 dark:bg-yellow-600 text-white',
    danger: 'bg-red-500 dark:bg-red-600 text-white',
    neutral: 'bg-gray-400 dark:bg-gray-500 text-white',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  return (
    <span className={clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    )}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;