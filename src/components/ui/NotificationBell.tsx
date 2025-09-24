import React from 'react';
import Icon from './Icon';
import styles from '../../styles/NotificationBell.module.css';

interface NotificationBellProps {
  unreadCount: number;
  criticalCount: number;
  onClick: () => void;
  isOpen: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  criticalCount,
  onClick,
  isOpen,
}) => {
  const hasNotifications = unreadCount > 0;
  const hasCritical = criticalCount > 0;

  const buttonClass = `${styles.button} ${
    isOpen ? styles.buttonActive : ''
  } ${hasCritical ? styles.buttonCritical : ''}`;

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      title={`${unreadCount} unread notifications${hasCritical ? ` (${criticalCount} critical)` : ''}`}
    >
      <div className={styles.iconContainer}>
        <Icon 
          name="warning" 
          size="md" 
          className={`${styles.icon} ${hasCritical ? styles.iconCritical : ''}`}
        />
        
        {hasNotifications && (
          <div className={`${styles.badge} ${hasCritical ? styles.badgeCritical : ''}`}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}

        {hasCritical && (
          <>
            <div className={styles.criticalIndicator} />
            <div className={styles.pulse} />
          </>
        )}
      </div>
    </button>
  );
};

export default NotificationBell;
