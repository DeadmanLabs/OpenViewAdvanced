# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a React application that displays financial price charts with candlestick visualization and volume data. Built with `react-financial-charts` library for financial data visualization.

## Development Commands
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests with Jest in jsdom environment
- `npm run eject` - Eject from Create React App (use with caution)

## Architecture
The application follows a modular React component structure with a TradingView-style interface:

- **App.js**: Main application orchestrator
  - Manages global state for interval and chart type selection
  - Coordinates layout between TopBar, LeftSidebar, PriceChart, and FooterBar
  - Uses useMarketData hook to fetch market data

- **TopBar.js**: Top navigation and control bar
  - Interval selector with tick, second, minute, hour, and day options
  - Chart type selector (candlestick, line, area, etc.)
  - Undo/redo buttons
  - Indicators, Alert, and Replay buttons
  - Real-time price display (OHLC values)

- **LeftSidebar.js**: Drawing and analysis tools sidebar
  - Collapsible menus for different tool categories
  - Trend line tools (trend line, ray, horizontal/vertical lines, channels)
  - Fibonacci tools (retracement, extension, circles, etc.)
  - Pattern recognition tools
  - Drawing tools (shapes, arrows, brushes)
  - Measurement and annotation tools

- **FooterBar.js**: Bottom control bar
  - Date range quick selectors (1D, 5D, 1M, 3M, 6M, YTD, 1Y, 5Y, All)
  - Axis settings (Auto, Log scale, Percentage mode)
  - Screenshot and settings buttons
  - Real-time UTC clock

- **PriceChart.js**: Core financial chart component
  - Accepts data via props (array of OHLC objects)
  - Responsive to parent container dimensions
  - Displays candlestick price data with volume bars
  - Includes crosshair cursor, zoom functionality, and tooltips

- **Supporting Components**:
  - **useMarketData.js**: Custom hook for fetching market data
  - **OHLCTooltip.js**: Custom tooltip for OHLC data display
  - **ChartExample.js**: Example implementation

## Key Dependencies
- `react-financial-charts` (v2.0.1): Main charting library
- `d3-*` libraries: Data formatting and time parsing utilities
- `prop-types`: Runtime type checking

## Data Flow
1. Market data is fetched from external TSV files via `useMarketData` hook (in App.js)
2. Data is passed to PriceChart component via props
3. Chart components render candlestick and volume visualizations
4. User interactions are handled through chart controls and tooltips

## Using PriceChart Component
The PriceChart component expects data in the following format:
```javascript
const data = [
  {
    date: new Date("2024-01-01"),
    open: 100,
    high: 105,
    low: 98,
    close: 102,
    volume: 1000000
  },
  // ... more data points
];

// Usage
<PriceChart data={data} />
```

## Styling
Uses a consistent dark theme with predefined color scheme:
- Background: #191c27
- Gray elements: #383E55
- Light gray text: #9EAAC7
- Green/red for price movements: #26a69a / #ef5350

## File Structure
- `src/` - All React components and logic
- `public/` - Static HTML template
- `TradingViewIcons/` - SVG icon assets (trading indicators and tools)