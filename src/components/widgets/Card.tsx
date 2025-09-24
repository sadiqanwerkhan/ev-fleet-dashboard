import React, { memo } from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const Card: React.FC<CardProps> = memo(({ 
  children, 
  className, 
  padding = 'md',
  hover = false 
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-200 shadow-sm bg-white/95 border-gray-200 dark:bg-gray-800/95 dark:border-gray-700';

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div className={clsx(
      baseClasses,
      paddingClasses[padding],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
