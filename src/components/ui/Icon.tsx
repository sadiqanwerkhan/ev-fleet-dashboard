import React, { memo } from 'react';

export interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = memo(({ name, size = 'md', className = '', onClick }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const classes = `${sizeClasses[size]} ${className} ${onClick ? 'cursor-pointer' : ''}`;

  const commonProps = {
    className: classes,
    onClick,
    role: onClick ? 'button' as const : undefined,
    tabIndex: onClick ? 0 : undefined,
    fill: 'none',
    stroke: 'currentColor',
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
  };

  const renderIcon = () => {
    switch (name) {
      // Navigation / Arrows
      case 'arrow-up':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7 7 7M12 3v18"/></svg>
        );
      case 'arrow-down':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7-7-7M12 3v18"/></svg>
        );
      case 'arrow-left':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7M3 12h18"/></svg>
        );
      case 'arrow-right':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M3 12h18"/></svg>
        );
      case 'chevron-up':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
        );
      case 'chevron-down':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
        );
      case 'menu':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
        );
      case 'close':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        );

      // Status
      case 'check':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
        );
      case 'warning':
        return (
          <svg {...commonProps} fill="currentColor" stroke="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path fill="#fff" d="M12 9v4m0 4h.01"/></svg>
        );
      case 'error':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        );
      case 'info':
        return (
          <svg {...commonProps}><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8h.01M11 12h2v4h-2z"/></svg>
        );

      // Theme
      case 'sun':
        return (
          <svg {...commonProps}><circle cx="12" cy="12" r="4"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        );
      case 'moon':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12.41A8 8 0 1111.59 4 6 6 0 0020 12.41z"/></svg>
        );

      // Vehicles / Telemetry
      case 'car':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13l2-5a3 3 0 012.82-2h8.36A3 3 0 0119 8l2 5v5a1 1 0 01-1 1h-1a2 2 0 01-4 0H9a2 2 0 01-4 0H4a1 1 0 01-1-1v-5z"/></svg>
        );
      case 'battery':
        return (
          <svg {...commonProps}><rect x="3" y="7" width="14" height="10" rx="2"/><rect x="17" y="10" width="3" height="4"/></svg>
        );
      case 'speed':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a9 9 0 100 18 9 9 0 000-18zm0 0v6m0 0l3 3"/></svg>
        );
      case 'temperature':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14a4 4 0 108 0V5a3 3 0 10-6 0v9a4 4 0 01-2 3.46"/></svg>
        );
      case 'tire':
        return (
          <svg {...commonProps}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
        );
      case 'motor':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9h10l2 3-2 3H4l-2-3 2-3zM20 12h2"/></svg>
        );
      case 'charging':
        return (
          <svg {...commonProps} fill="currentColor" stroke="none"><path d="M11 2L3 14h6v8l8-12h-6z"/></svg>
        );
      case 'location':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z"/><circle cx="12" cy="11" r="3"/></svg>
        );
      case 'odometer':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12a7 7 0 1114 0 7 7 0 01-14 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l3-3"/></svg>
        );
      case 'voltage':
        return (
          <svg {...commonProps} fill="currentColor" stroke="none"><path d="M11 2L3 14h6v8l8-12h-6z"/></svg>
        );
      case 'current':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h8M12 6v12m0-6h8"/></svg>
        );

      // Controls
      case 'play':
        return (
          <svg {...commonProps} fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>
        );
      case 'pause':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 5h2v14h-2zM14 5h2v14h-2z"/></svg>
        );
      case 'stop':
        return (
          <svg {...commonProps}><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
        );
      case 'reset':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6M20 4l-6 6M4 20l6-6"/></svg>
        );

      // Analytics / UI
      case 'chart':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19h16M7 10v6M12 6v10M17 13v3"/></svg>
        );
      case 'stats':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 19h16M6 17V9m4 8V5m4 12v-6m4 6V7"/></svg>
        );
      case 'filter':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h18l-7 8v6l-4-2v-4L3 5z"/></svg>
        );
      case 'sort':
        return (
          <svg {...commonProps}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7h12M8 12h8M10 17h4"/></svg>
        );

      default:
        return (
          <svg {...commonProps}><circle cx="12" cy="12" r="10"/></svg>
        );
    }
  };

  return renderIcon();
});

Icon.displayName = 'Icon';

export default Icon;
