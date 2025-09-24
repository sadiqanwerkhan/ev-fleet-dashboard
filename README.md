# EV Fleet Dashboard

A comprehensive real-time dashboard for monitoring and managing electric vehicle fleets with advanced analytics, interactive mapping, and customizable layouts.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com/sadiqanwerkhan/ev-fleet-dashboard)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.9.0-purple)](https://redux-toolkit.js.org/)

## Overview

This dashboard provides fleet managers with real-time insights into their electric vehicle operations. Built with modern web technologies, it offers comprehensive monitoring capabilities including vehicle tracking, performance analytics, and operational controls.

## Features

### Fleet Analytics
- Real-time fleet statistics and key performance indicators
- Interactive data visualizations including battery levels, speed distribution, and energy consumption
- Performance metrics tracking with average battery levels and fleet efficiency calculations
- Comprehensive charts and graphs using Recharts library

### Vehicle Mapping
- Real-time vehicle location tracking with Leaflet-based interactive maps
- Status-based marker system with color-coded indicators for vehicle states
- Detailed vehicle information popups on marker interaction
- Theme-aware map tiles supporting both light and dark modes
- Responsive design optimized for various screen sizes

### Dashboard Customization
- Drag-and-drop panel management using react-grid-layout
- Responsive grid system adapting to desktop, tablet, and mobile viewports
- Persistent layout preferences stored in localStorage
- Resizable and repositionable dashboard components

### Theme Management
- Seamless dark and light mode switching
- Automatic system preference detection
- Persistent theme settings across browser sessions
- Comprehensive styling optimizations for both themes

### Data Filtering and Sorting
- Multi-criteria filtering by vehicle status and charging state
- Real-time filter count updates for each category
- Flexible sorting options by name, battery level, speed, distance, or status
- Visual sort order indicators with ascending/descending toggle
- One-click filter reset functionality

### Vehicle Monitoring
- Comprehensive telemetry display including speed, battery, temperature, and tire pressure
- Motor efficiency and regenerative braking status
- Real-time charging status monitoring (charging/discharging/idle)
- Energy consumption metrics with voltage and current readings
- GPS coordinates and odometer tracking
- Data freshness indicators with last updated timestamps

### Real-time Data Simulation
- Configurable data simulation with start/pause controls
- Realistic vehicle data generation for testing and demonstration
- Dynamic vehicle status management
- Performance-optimized updates without UI lag

## Technology Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **State Management**: Redux Toolkit with React-Redux
- **Mapping**: Leaflet with React-Leaflet integration
- **Data Visualization**: Recharts for interactive charts
- **Layout Management**: React-Grid-Layout for drag-and-drop functionality
- **Styling**: CSS3 with modern features including Grid, Flexbox, and backdrop-filter
- **Build Tool**: Vite for optimized development and production builds

## Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Setup Instructions

```bash
# Clone the repository
git clone https://github.com/sadiqanwerkhan/ev-fleet-dashboard.git
cd ev-fleet-dashboard

# Install project dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

## Getting Started

1. **Launch the Application**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:5173](http://localhost:5173) in your browser

2. **Initialize Data Simulation**
   - Click "Start Simulation" in the header controls
   - Observe real-time data updates across all dashboard components

3. **Explore Dashboard Features**
   - Toggle between light and dark modes using the theme button
   - Apply filters to view specific vehicle subsets
   - Sort vehicles by various criteria
   - Rearrange dashboard panels by dragging and resizing
   - Click map markers to view detailed vehicle information

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx              # Main dashboard container
│   ├── SimpleDashboardLayout.tsx  # Layout management component
│   ├── EnhancedFleetOverview.tsx  # Analytics and chart components
│   ├── VehicleMap.tsx            # Interactive mapping component
│   ├── VehicleCard.tsx           # Individual vehicle display
│   ├── VehicleFilters.tsx        # Filtering and sorting controls
│   └── FleetOverview.tsx         # Legacy overview component
├── contexts/
│   └── ThemeContext.tsx          # Dark mode context provider
├── store/
│   ├── index.ts                  # Redux store configuration
│   └── vehicleSlice.ts           # Vehicle state management slice
├── App.tsx                       # Root application component
├── App.css                       # Global styles and theme definitions
└── main.tsx                      # Application entry point
```

## Configuration

### Theme Customization
Modify the CSS custom properties in `src/App.css` to customize the application's visual appearance:

```css
/* Light theme configuration */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --card-background: rgba(255, 255, 255, 0.95);
}

/* Dark theme overrides */
.dark {
  --primary-gradient: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  --card-background: rgba(30, 30, 46, 0.95);
}
```

### Layout Configuration
Adjust the default grid layouts in `src/components/SimpleDashboardLayout.tsx`:

```typescript
const defaultLayouts = {
  lg: [
    { i: 'overview', x: 0, y: 0, w: 12, h: 8 },
    { i: 'map', x: 0, y: 8, w: 8, h: 6 },
    { i: 'controls', x: 8, y: 8, w: 4, h: 6 },
  ]
};
```

## Data Models

### Vehicle Interface
```typescript
interface Vehicle {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'inactive' | 'maintenance';
  telemetry: {
    speed: number;           // kilometers per hour
    batteryLevel: number;   // percentage (0-100)
    temperature: number;     // celsius
    tirePressure: number;    // PSI
    motorEfficiency: number; // percentage
    regenerativeBraking: boolean;
    location: { lat: number; lng: number };
    odometer: number;       // kilometers
    energyConsumption: number; // kWh per 100km
    chargingStatus: 'charging' | 'discharging' | 'idle';
    voltage: number;        // volts
    current: number;        // amperes
  };
  lastUpdated: string;      // ISO 8601 timestamp
}
```

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Create an optimized production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Browser Compatibility

- Chrome 90 and above
- Firefox 88 and above
- Safari 14 and above
- Edge 90 and above

## Performance Optimizations

- **Component Optimization**: React.memo and useCallback hooks for efficient rendering
- **State Management**: Redux Toolkit with Immer for immutable state updates
- **Code Splitting**: Lazy loading and dynamic imports for optimal bundle sizes
- **Asset Optimization**: Compressed images and optimized map tiles
- **Memory Management**: Proper cleanup of intervals and event listeners

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Implement proper error boundaries
- Use semantic HTML elements

### Testing
- Write unit tests for utility functions
- Implement integration tests for component interactions
- Use React Testing Library for component testing

## Contributing

1. Fork the repository on GitHub
2. Create a feature branch from the main branch
3. Make your changes and ensure all tests pass
4. Commit your changes with descriptive commit messages
5. Push your branch to your fork
6. Submit a pull request with a detailed description of your changes

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for complete details.

## Dependencies

- [React](https://reactjs.org/) - User interface library
- [Leaflet](https://leafletjs.com/) - Interactive map library
- [Recharts](https://recharts.org/) - Data visualization library
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management library
- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) - Drag-and-drop layout library

## Support

For technical support or feature requests, please open an issue on the GitHub repository or contact the development team.

---

Built for modern electric vehicle fleet management operations.