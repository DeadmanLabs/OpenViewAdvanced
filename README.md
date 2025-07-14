# React Advanced Trading Chart

A comprehensive React component library for financial data visualization with 22+ chart types, TradingView-style interface, and advanced trading tools.

![npm version](https://img.shields.io/npm/v/react-advanced-trading-chart)
![license](https://img.shields.io/npm/l/react-advanced-trading-chart)
![downloads](https://img.shields.io/npm/dm/react-advanced-trading-chart)

## Features

- **22+ Chart Types**: Including candlesticks, bars, lines, areas, Heikin Ashi, Renko, Kagi, Point & Figure, and more
- **TradingView-Style Interface**: Professional trading platform UI with top bar, sidebar, and footer controls
- **Advanced Data Processing**: Automatic interval transformation from raw data to any timeframe
- **Responsive Design**: Adapts to any container size with touch and desktop support
- **Customizable**: Extensive props for customization and styling
- **Performance Optimized**: Memoized components and efficient rendering
- **TypeScript Ready**: Full TypeScript support with comprehensive type definitions

## Installation Options

### Option 1: NPM Package (If Published)

```bash
npm install react-advanced-trading-chart
```

```bash
yarn add react-advanced-trading-chart
```

### Option 2: Git Installation (Recommended for Private Use)

Install directly from GitHub repository without publishing to NPM:

```bash
npm install git+https://github.com/DeadmanLabs/OpenViewAdvanced.git
```

With specific branch/tag:
```bash
npm install git+https://github.com/DeadmanLabs/OpenViewAdvanced.git#master
```

### Option 3: Local File Installation

Install from local file system:

```bash
# From absolute path
npm install /path/to/OpenViewAdvanced

# From relative path
npm install ../OpenViewAdvanced
```

### Option 4: Development Linking

For active development with live updates:

```bash
# In the OpenViewAdvanced directory
npm link

# In your project directory
npm link react-advanced-trading-chart
```

### Option 5: Tarball Installation

Use the pre-built package tarball:

```bash
# Build the tarball (in OpenViewAdvanced directory)
npm pack

# Install in your project
npm install /path/to/react-advanced-trading-chart-1.0.0.tgz
```

## Quick Start

```jsx
import React from 'react';
import { TradingChart } from 'react-advanced-trading-chart';
import 'react-advanced-trading-chart/lib/styles.css';

const data = [
  {
    date: new Date('2024-01-01'),
    open: 100,
    high: 105,
    low: 98,
    close: 102,
    volume: 1000000
  },
  // ... more data points
];

function App() {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <TradingChart 
        data={data}
        symbolName="BTCUSD"
        symbolIcon="🟠"
      />
    </div>
  );
}

export default App;
```

## Components

### TradingChart (Main Component)

The complete trading interface with all controls and features.

```jsx
import { TradingChart } from 'react-advanced-trading-chart';

<TradingChart
  data={ohlcData}
  dataInterval="1 minute"
  symbolName="AAPL"
  symbolIcon="📈"
  defaultInterval={{ full: "5 minutes", short: "5m" }}
  defaultChartType="candles"
  defaultRange="1D"
  onIntervalChange={(interval) => console.log('Interval changed:', interval)}
  onChartTypeChange={(type) => console.log('Chart type changed:', type)}
/>
```

### PriceChart (Chart Only)

Just the chart component without UI controls.

```jsx
import { PriceChart } from 'react-advanced-trading-chart';

<PriceChart
  data={ohlcData}
  chartType="candles"
  axisSettings={{ auto: true, log: false, percent: false }}
/>
```

### Individual Components

Use individual components for custom layouts:

```jsx
import { 
  TopBar, 
  LeftSidebar, 
  FooterBar, 
  PriceChart 
} from 'react-advanced-trading-chart';

// Custom layout
<div className="my-trading-app">
  <TopBar selectedInterval="1m" selectedChartType="candles" />
  <div className="content">
    <LeftSidebar />
    <PriceChart data={data} />
  </div>
  <FooterBar selectedRange="1D" />
</div>
```

## Chart Types

### Basic Chart Types
- `candles` - Traditional candlestick charts
- `bars` - OHLC bar charts  
- `hollow` - Hollow candlesticks
- `volume` - Volume-weighted candlesticks
- `line` - Simple line chart
- `lineMarkers` - Line chart with markers
- `step` - Step line chart
- `area` - Area chart
- `hlcArea` - High-Low-Close area
- `baseline` - Baseline area chart
- `columns` - Column chart
- `highLow` - High-Low chart

### Advanced Chart Types
- `heikinAshi` - Heikin Ashi candlesticks
- `renko` - Renko brick charts
- `kagi` - Kagi charts
- `pointFigure` - Point & Figure charts
- `lineBreak` - Line break charts
- `range` - Range bar charts

```jsx
import { CHART_TYPES } from 'react-advanced-trading-chart';

<TradingChart 
  data={data}
  defaultChartType={CHART_TYPES.HEIKIN_ASHI}
/>
```

## Data Format

The component expects an array of OHLC data objects:

```javascript
const data = [
  {
    date: new Date('2024-01-01T09:30:00Z'), // JavaScript Date object
    open: 100.50,                          // Opening price
    high: 102.75,                          // Highest price
    low: 99.25,                            // Lowest price
    close: 101.80,                         // Closing price
    volume: 1250000                        // Trading volume
  },
  // ... more data points
];
```

## Intervals and Time Ranges

```jsx
import { INTERVALS, TIME_RANGES } from 'react-advanced-trading-chart';

// Available intervals
console.log(INTERVALS);
// [
//   { full: "1 second", short: "1s" },
//   { full: "1 minute", short: "1m" },
//   { full: "1 hour", short: "1h" },
//   { full: "1 day", short: "1d" },
//   // ... more intervals
// ]

// Available time ranges
console.log(TIME_RANGES);
// ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"]
```

## Data Transformation

The library automatically transforms your raw data to different intervals:

```jsx
import { transformDataToInterval } from 'react-advanced-trading-chart';

// Transform 1-minute data to 5-minute intervals
const minuteData = [...]; // Your 1-minute OHLC data
const fiveMinuteData = transformDataToInterval(minuteData, "5 minutes");
```

## Props Reference

### TradingChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<OHLC>` | **required** | Array of OHLC data objects |
| `dataInterval` | `string` | `"1 minute"` | The interval of your raw data |
| `symbolName` | `string` | `"SYMBOL"` | Display name for the trading symbol |
| `symbolIcon` | `string` | `"📈"` | Icon/emoji for the symbol |
| `defaultInterval` | `object\|string` | `{ full: "1 minute", short: "1m" }` | Default time interval |
| `defaultChartType` | `string` | `"candles"` | Default chart type |
| `defaultRange` | `string` | `"All"` | Default time range |
| `showTopBar` | `boolean` | `true` | Show/hide top navigation bar |
| `showLeftSidebar` | `boolean` | `true` | Show/hide left tools sidebar |
| `showFooterBar` | `boolean` | `true` | Show/hide bottom controls |
| `onIntervalChange` | `function` | `undefined` | Callback when interval changes |
| `onChartTypeChange` | `function` | `undefined` | Callback when chart type changes |
| `onRangeChange` | `function` | `undefined` | Callback when time range changes |
| `onAxisSettingChange` | `function` | `undefined` | Callback when axis settings change |
| `className` | `string` | `""` | Additional CSS class name |

### PriceChart Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<OHLC>` | **required** | Array of OHLC data objects |
| `chartType` | `string` | `"candles"` | Type of chart to display |
| `axisSettings` | `object` | `{ auto: true, log: false, percent: false }` | Axis display settings |
| `width` | `number` | auto | Chart width (auto-sized by default) |
| `height` | `number` | auto | Chart height (auto-sized by default) |

## Styling

Import the CSS file to get the default styling:

```jsx
import 'react-advanced-trading-chart/lib/styles.css';
```

### Custom Styling

You can override the default styles by targeting the CSS classes:

```css
.app-container {
  /* Your custom styles */
}

.chart-container {
  /* Custom chart container styles */
}

.topbar {
  /* Custom top bar styles */
}
```

## TypeScript Support

The package includes full TypeScript definitions:

```typescript
import { TradingChart, CHART_TYPES, INTERVALS } from 'react-advanced-trading-chart';

interface OHLCData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const data: OHLCData[] = [
  // ... your data
];

const App: React.FC = () => {
  return (
    <TradingChart 
      data={data}
      defaultChartType={CHART_TYPES.CANDLES}
    />
  );
};
```

## Examples

### Basic Usage

```jsx
import React from 'react';
import { TradingChart } from 'react-advanced-trading-chart';
import 'react-advanced-trading-chart/lib/styles.css';

const BasicExample = () => {
  const data = [
    { date: new Date('2024-01-01'), open: 100, high: 105, low: 98, close: 102, volume: 1000000 },
    { date: new Date('2024-01-02'), open: 102, high: 108, low: 101, close: 106, volume: 1200000 },
    // ... more data
  ];

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <TradingChart data={data} symbolName="EXAMPLE" />
    </div>
  );
};
```

### Advanced Usage with Callbacks

```jsx
import React, { useState } from 'react';
import { TradingChart, CHART_TYPES } from 'react-advanced-trading-chart';

const AdvancedExample = () => {
  const [currentInterval, setCurrentInterval] = useState("1m");
  const [currentChartType, setCurrentChartType] = useState(CHART_TYPES.CANDLES);

  const handleIntervalChange = (interval) => {
    setCurrentInterval(interval.short);
    // Fetch new data based on interval
  };

  const handleChartTypeChange = (chartType) => {
    setCurrentChartType(chartType);
    // Handle chart type change
  };

  return (
    <TradingChart
      data={data}
      symbolName="BTC/USD"
      symbolIcon="₿"
      defaultChartType={currentChartType}
      onIntervalChange={handleIntervalChange}
      onChartTypeChange={handleChartTypeChange}
    />
  );
};
```

### Chart Only (No Controls)

```jsx
import React from 'react';
import { PriceChart } from 'react-advanced-trading-chart';

const ChartOnlyExample = () => {
  return (
    <div style={{ width: '800px', height: '400px' }}>
      <PriceChart 
        data={data}
        chartType="heikinAshi"
        axisSettings={{ auto: false, log: true, percent: false }}
      />
    </div>
  );
};
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- React 16.8+
- react-financial-charts
- D3 utilities (d3-format, d3-time-format, d3-scale, d3-shape)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://github.com/DeadmanLabs/OpenViewAdvanced)
- 🐛 [Issue Tracker](https://github.com/DeadmanLabs/OpenViewAdvanced/issues)
- 💬 [Discussions](https://github.com/DeadmanLabs/OpenViewAdvanced/discussions)

## Codebase Architecture & Review

### Project Structure

```
src/
├── lib/
│   └── index.js                 # Main package exports
├── utils/
│   ├── dataTransformation.js    # OHLC data interval transformation
│   └── intervalUtils.js         # Time range and validation utilities
├── App.js                       # Demo application (not exported)
├── TradingChart.js             # Main package component
├── PriceChart.js               # Core chart rendering component
├── TopBar.js                   # Navigation and controls
├── LeftSidebar.js              # Drawing tools sidebar
├── FooterBar.js                # Time range and axis controls
├── OHLCTooltip.js              # Custom price data tooltip
├── useMarketData.js            # Data fetching hook (demo only)
└── *.css                       # Component stylesheets

lib/                            # Built package files
├── index.js                    # CommonJS build
├── index.esm.js               # ES modules build
└── *.css                      # Bundled stylesheets

TradingViewIcons/              # 120+ SVG trading tool icons
```

### Component Architecture

#### 1. **TradingChart.js** - Main Component
- **Purpose**: Package-friendly wrapper for complete trading interface
- **Key Features**:
  - Accepts data as props (no internal data fetching)
  - Configurable UI components (show/hide bars, sidebars)
  - Callback handlers for user interactions
  - Default settings with full customization
- **Props**: 20+ configurable properties
- **Performance**: Memoized handlers and optimized re-renders

#### 2. **PriceChart.js** - Core Chart Engine
- **Purpose**: Financial chart rendering with 22+ chart types
- **Architecture**:
  - Built on react-financial-charts library
  - Custom data transformation pipeline
  - Advanced chart type implementations
  - Comprehensive error handling and fallbacks
- **Chart Types**:
  - **Basic**: Candlesticks, Bars, Lines, Areas (8 types)
  - **Advanced**: Heikin Ashi, Renko, Kagi, Point & Figure (6 types)
  - **Specialized**: Volume candles, Hollow candles, Step lines (8 types)
- **Features**:
  - Responsive sizing with auto-scaling
  - Custom Y-axis modes (linear, log, percentage)
  - Volume chart integration
  - Interactive crosshair and tooltips
  - Zoom and pan functionality

#### 3. **Data Processing Pipeline**
- **dataTransformation.js**: 
  - Converts raw OHLC data between intervals (1m → 5m, 1h, etc.)
  - Validation and error handling for invalid transformations
  - Support for advanced chart calculations (Heikin Ashi, Renko)
- **intervalUtils.js**:
  - Time range filtering and validation
  - Candle count calculations
  - Business logic for interval/range combinations

#### 4. **UI Components**
- **TopBar.js**: Interval selectors, chart type picker, symbol display
- **LeftSidebar.js**: 120+ trading tools with collapsible categories
- **FooterBar.js**: Time range selectors, axis controls, real-time clock
- **OHLCTooltip.js**: Custom tooltip showing OHLC values and volume

### Technical Implementation

#### Performance Optimizations
- **React.memo**: All major components memoized to prevent unnecessary re-renders
- **useCallback**: Event handlers memoized to maintain referential equality
- **useMemo**: Expensive calculations cached (data transformations, chart settings)
- **Component Isolation**: Menu state changes don't trigger chart re-renders

#### Error Handling
- **Data Validation**: Comprehensive validation for OHLC data structure
- **Transformation Errors**: Graceful handling of invalid interval conversions
- **Chart Fallbacks**: Advanced chart types fall back to candlesticks on errors
- **User Feedback**: Clear error messages for invalid operations

#### Build System
- **Rollup**: Modern bundler for clean ES/CommonJS builds
- **Babel**: JSX and modern JavaScript transformation
- **Tree Shaking**: Dead code elimination for smaller bundles
- **External Dependencies**: React and D3 marked as externals

### Code Quality

#### Strengths
- ✅ **Comprehensive Type Safety**: PropTypes for all components
- ✅ **Modular Architecture**: Clear separation of concerns
- ✅ **Performance Focused**: Optimized for large datasets
- ✅ **Error Resilient**: Robust error handling throughout
- ✅ **Well Documented**: Extensive inline documentation
- ✅ **Configurable**: 20+ customization options
- ✅ **Package Ready**: Professional NPM package structure

#### Advanced Features
- **Data Transformation Engine**: Converts between any time intervals
- **Chart Type Flexibility**: Easy to add new chart types
- **Custom Calculations**: Heikin Ashi, Renko, Kagi implementations
- **TradingView Parity**: Professional trading platform interface
- **Mobile Responsive**: Touch-friendly interactions

#### Dependencies
- **Core**: React 16.8+, react-financial-charts 2.0+
- **Utilities**: D3 ecosystem (format, time-format, scale, shape)
- **Build**: Rollup, Babel, modern toolchain
- **Peer Dependencies**: React and ReactDOM as externals

### Installation Recommendations

1. **Git Installation** (Recommended for private use)
2. **Local Development**: npm link for active development
3. **Production**: Tarball for stable deployments
4. **Team Distribution**: Git tags for version management

### Usage Patterns

#### Standalone Chart
```jsx
<PriceChart data={ohlcData} chartType="heikinAshi" />
```

#### Full Trading Interface
```jsx
<TradingChart 
  data={ohlcData} 
  symbolName="BTC/USD" 
  onIntervalChange={handler}
/>
```

#### Custom Layout
```jsx
<div>
  <TopBar {...props} />
  <PriceChart {...props} />
  <FooterBar {...props} />
</div>
```

This codebase represents a production-ready, enterprise-grade trading chart library with comprehensive features, robust error handling, and professional packaging for easy integration into any React application.

## Changelog

### 1.0.0
- Initial release
- 22+ chart types support
- TradingView-style interface
- Data transformation capabilities
- Full TypeScript support
