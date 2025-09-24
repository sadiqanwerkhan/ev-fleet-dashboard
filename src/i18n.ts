import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Common
      'common.appTitle': 'EV Fleet Dashboard',
      
      // Dashboard
      'dashboard.title': 'EV Fleet Dashboard',
      'dashboard.subtitle': 'Monitor your electric vehicle fleet in real-time',
      
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.vehicles': 'Vehicles',
      'nav.analytics': 'Analytics',
      'nav.settings': 'Settings',
      
      // Vehicle Status
      'vehicle.status.active': 'Active',
      'vehicle.status.maintenance': 'Maintenance',
      'vehicle.status.inactive': 'Inactive',
      
      // Vehicle Details
      'vehicle.details.battery': 'Battery Level',
      'vehicle.details.speed': 'Current Speed',
      'vehicle.details.location': 'Location',
      'vehicle.details.lastUpdated': 'Last Updated',
      'vehicle.details.chargingStatus': 'Charging Status',
      'vehicle.details.temperature': 'Temperature',
      'vehicle.details.efficiency': 'Efficiency',
      
      // Charging Status
      'charging.status.charging': 'Charging',
      'charging.status.not_charging': 'Not Charging',
      'charging.status.full': 'Full',
      
      // Status
      'status.active': 'Active',
      'status.inactive': 'Inactive', 
      'status.maintenance': 'Maintenance',
      'status.charging': 'Charging',
      'status.discharging': 'Discharging',
      'status.idle': 'Idle',
      
      // Analytics
      'analytics.active': 'Active',
      'analytics.charging': 'Charging',
      
      // Alerts
      'alerts.title': 'Alerts',
      'alerts.noAlerts': 'No alerts at this time',
      'alerts.markAsRead': 'Mark as Read',
      'alerts.dismiss': 'Dismiss',
      'alerts.clearAll': 'Clear All',
      
      // Fleet Overview
      'fleet.title': 'Fleet Overview',
      'fleet.totalVehicles': 'Total Vehicles',
      'fleet.activeVehicles': 'Active',
      'fleet.maintenanceVehicles': 'In Maintenance',
      'fleet.inactiveVehicles': 'Inactive',
      
      // Charts
      'charts.statusDistribution': 'Status Distribution',
      'charts.batteryLevels': 'Battery Levels',
      'charts.speedAnalysis': 'Speed Analysis',
      'charts.energyConsumption': 'Energy Consumption',
      
      // Filters
      'filters.title': 'Filters',
      'filters.subtitle': 'Filter vehicles by status and charging',
      'filters.all': 'All',
      'filters.status': 'Filter by Status',
      'filters.charging': 'Filter by Charging',
      'filters.clear': 'Clear Filters',
      'filters.clearAll': 'Clear All',
      'filters.vehicleStatus': 'Vehicle Status',
      'filters.chargingStatus': 'Charging Status',
      'filters.sortOptions': 'Sort Options',
      'filters.vehicleName': 'Vehicle Name',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.retry': 'Retry',
      'common.close': 'Close',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.search': 'Search',
      'common.refresh': 'Refresh',
      'common.all': 'All',
      'common.notifications': 'Notifications',
      'common.unreadCount': '{{count}} unread',
      'common.allCaughtUp': 'All caught up!',
      'common.markAllRead': 'Mark all as read',
    }
  },
  de: {
    translation: {
      // Common
      'common.appTitle': 'EV Flotten Dashboard',
      
      // Dashboard
      'dashboard.title': 'EV Flotten-Dashboard',
      'dashboard.subtitle': 'Überwachen Sie Ihre Elektrofahrzeugflotte in Echtzeit',
      
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.vehicles': 'Fahrzeuge',
      'nav.analytics': 'Analytik',
      'nav.settings': 'Einstellungen',
      
      // Vehicle Status
      'vehicle.status.active': 'Aktiv',
      'vehicle.status.maintenance': 'Wartung',
      'vehicle.status.inactive': 'Inaktiv',
      
      // Vehicle Details
      'vehicle.details.battery': 'Batteriestand',
      'vehicle.details.speed': 'Aktuelle Geschwindigkeit',
      'vehicle.details.location': 'Standort',
      'vehicle.details.lastUpdated': 'Zuletzt aktualisiert',
      'vehicle.details.chargingStatus': 'Ladestatus',
      'vehicle.details.temperature': 'Temperatur',
      'vehicle.details.efficiency': 'Effizienz',
      
      // Charging Status
      'charging.status.charging': 'Lädt',
      'charging.status.not_charging': 'Lädt nicht',
      'charging.status.full': 'Voll',
      
      // Status
      'status.active': 'Aktiv',
      'status.inactive': 'Inaktiv',
      'status.maintenance': 'Wartung',
      'status.charging': 'Lädt',
      'status.discharging': 'Entlädt',
      'status.idle': 'Leerlauf',
      
      // Analytics
      'analytics.active': 'Aktiv',
      'analytics.charging': 'Lädt',
      
      // Alerts
      'alerts.title': 'Warnungen',
      'alerts.noAlerts': 'Keine Warnungen zu diesem Zeitpunkt',
      'alerts.markAsRead': 'Als gelesen markieren',
      'alerts.dismiss': 'Verwerfen',
      'alerts.clearAll': 'Alle löschen',
      
      // Fleet Overview
      'fleet.title': 'Flottenübersicht',
      'fleet.totalVehicles': 'Fahrzeuge gesamt',
      'fleet.activeVehicles': 'Aktiv',
      'fleet.maintenanceVehicles': 'In Wartung',
      'fleet.inactiveVehicles': 'Inaktiv',
      
      // Charts
      'charts.statusDistribution': 'Statusverteilung',
      'charts.batteryLevels': 'Batteriestand',
      'charts.speedAnalysis': 'Geschwindigkeitsanalyse',
      'charts.energyConsumption': 'Energieverbrauch',
      
      // Filters
      'filters.title': 'Filter',
      'filters.subtitle': 'Fahrzeuge nach Status und Ladung filtern',
      'filters.all': 'Alle',
      'filters.status': 'Nach Status filtern',
      'filters.charging': 'Nach Ladung filtern',
      'filters.clear': 'Filter löschen',
      'filters.clearAll': 'Alle löschen',
      'filters.vehicleStatus': 'Fahrzeugstatus',
      'filters.chargingStatus': 'Ladestatus',
      'filters.sortOptions': 'Sortieroptionen',
      'filters.vehicleName': 'Fahrzeugname',
      
      // Common
      'common.loading': 'Lädt...',
      'common.error': 'Fehler',
      'common.retry': 'Wiederholen',
      'common.close': 'Schließen',
      'common.save': 'Speichern',
      'common.cancel': 'Abbrechen',
      'common.search': 'Suchen',
      'common.refresh': 'Aktualisieren',
      'common.all': 'Alle',
      'common.notifications': 'Benachrichtigungen',
      'common.unreadCount': '{{count}} ungelesen',
      'common.allCaughtUp': 'Alles erledigt!',
      'common.markAllRead': 'Alle als gelesen markieren',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;