// Main exports for the react-advanced-trading-chart package
export { PriceChart, PriceChartBase } from '../PriceChart';
export { default as TradingChart } from '../TradingChart';
export { default as TopBar } from '../TopBar';
export { default as LeftSidebar } from '../LeftSidebar';
export { default as FooterBar } from '../FooterBar';
export { default as OHLCTooltip } from '../OHLCTooltip';
export { useMarketData } from '../useMarketData';

// Utility exports
export { 
  transformDataToInterval, 
  canTransformData, 
  getTransformationError 
} from '../utils/dataTransformation';
export { filterDataByRange } from '../utils/intervalUtils';

// CSS styles (users will need to import this manually)
// Note: Import '../styles.css' directly in your React app

// Chart types enum for easier usage
export const CHART_TYPES = {
  CANDLES: 'candles',
  BARS: 'bars',
  HOLLOW: 'hollow',
  VOLUME: 'volume',
  LINE: 'line',
  LINE_MARKERS: 'lineMarkers',
  STEP: 'step',
  AREA: 'area',
  HLC_AREA: 'hlcArea',
  BASELINE: 'baseline',
  COLUMNS: 'columns',
  HIGH_LOW: 'highLow',
  HEIKIN_ASHI: 'heikinAshi',
  RENKO: 'renko',
  KAGI: 'kagi',
  POINT_FIGURE: 'pointFigure',
  LINE_BREAK: 'lineBreak',
  RANGE: 'range'
};

// Interval options for easier usage
export const INTERVALS = [
  { full: "1 second", short: "1s" },
  { full: "5 seconds", short: "5s" },
  { full: "10 seconds", short: "10s" },
  { full: "15 seconds", short: "15s" },
  { full: "30 seconds", short: "30s" },
  { full: "1 minute", short: "1m" },
  { full: "2 minutes", short: "2m" },
  { full: "3 minutes", short: "3m" },
  { full: "5 minutes", short: "5m" },
  { full: "10 minutes", short: "10m" },
  { full: "15 minutes", short: "15m" },
  { full: "30 minutes", short: "30m" },
  { full: "1 hour", short: "1h" },
  { full: "2 hours", short: "2h" },
  { full: "3 hours", short: "3h" },
  { full: "4 hours", short: "4h" },
  { full: "6 hours", short: "6h" },
  { full: "8 hours", short: "8h" },
  { full: "12 hours", short: "12h" },
  { full: "1 day", short: "1d" },
  { full: "3 days", short: "3d" },
  { full: "1 week", short: "1w" },
  { full: "1 month", short: "1M" }
];

// Time ranges for easier usage
export const TIME_RANGES = [
  "1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"
];