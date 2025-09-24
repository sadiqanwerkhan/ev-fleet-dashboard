import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';
import type { Alert } from '../../types/alerts';
import clsx from 'clsx';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  unreadCount: number;
  onMarkAsRead: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onMarkAllAsRead: () => void;
  onClearDismissed: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  alerts,
  unreadCount,
  onMarkAsRead,
  onDismissAlert,
  onMarkAllAsRead,
  onClearDismissed,
}) => {
  const { t } = useTranslation();
  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'info';
    }
  };

  const getSeverityColor = useMemo(() => (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default: return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  }, []);

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'low_battery': return 'battery';
      case 'high_temperature': return 'temperature';
      case 'maintenance_due': return 'car';
      case 'charging_error': return 'charging';
      case 'speed_limit': return 'speed';
      default: return 'info';
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    // Sort by: unread first, then by severity, then by timestamp (newest first)
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const aSeverity = severityOrder[a.severity];
    const bSeverity = severityOrder[b.severity];
    if (aSeverity !== bSeverity) return aSeverity - bSeverity;
    
    return b.timestamp - a.timestamp;
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" 
          onClick={onClose} 
        />
      )}
      
      {/* Notification Panel */}
      <div className={clsx(
        "fixed top-0 right-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Icon name="warning" size="md" className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('common.notifications')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount > 0 ? t('common.unreadCount', { count: unreadCount }) : t('common.allCaughtUp')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                  title={t('common.markAllRead', { defaultValue: 'Mark all as read' })}
                >
                  <Icon name="check" size="sm" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title={t('common.close')}
              >
                <Icon name="close" size="sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <Icon name="check" size="xl" className="text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('common.allCaughtUp')}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">No new notifications</p>
            </div>
          ) : (
            sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={clsx(
                  "p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md",
                  "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600",
                  !alert.isRead && "ring-2 ring-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10"
                )}
                onClick={() => !alert.isRead && onMarkAsRead(alert.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={clsx(
                          "w-8 h-8 rounded-lg flex items-center justify-center border",
                          getSeverityColor(alert.severity)
                        )}>
                          <Icon name={getTypeIcon(alert.type)} size="sm" />
                        </div>
                        <div className={clsx(
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          getSeverityColor(alert.severity)
                        )}>
                          <Icon name={getSeverityIcon(alert.severity)} size="sm" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{alert.vehicleName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatTime(alert.timestamp)}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{alert.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-3">
                    {!alert.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(alert.id);
                        }}
                        className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                        title="Mark as read"
                      >
                        <Icon name="check" size="sm" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDismissAlert(alert.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                      title="Dismiss"
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {sortedAlerts.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <button
              onClick={onClearDismissed}
              className="w-full px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 font-medium"
            >
              Clear dismissed alerts
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationCenter;
