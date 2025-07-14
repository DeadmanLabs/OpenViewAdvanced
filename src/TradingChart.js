import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { PriceChart } from "./PriceChart";
import { filterDataByRange } from "./utils/intervalUtils";
import { transformDataToInterval, canTransformData, getTransformationError } from "./utils/dataTransformation";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import FooterBar from "./FooterBar";

// Memoized chart container to prevent re-renders when menu state changes
const MemoizedChartContainer = React.memo(({ data, loaded, axisSettings, error, chartType }) => (
  <div className="chart-container">
    {error ? (
      <div className="error-message">
        <h3>Data Transformation Error</h3>
        <p>{error}</p>
        <p>Please select a different interval or check your data source.</p>
      </div>
    ) : loaded && data ? (
      <PriceChart data={data} axisSettings={axisSettings} chartType={chartType} />
    ) : loaded && !data ? (
      <div className="error-message">
        <p>No data available for the selected time range and interval.</p>
      </div>
    ) : (
      <div className="loading-message">
        Loading market data...
      </div>
    )}
  </div>
));

const TradingChart = ({ 
  data: rawData, 
  dataInterval = "1 minute",
  symbolName = "SYMBOL",
  symbolIcon = "📈",
  defaultInterval = { full: "1 minute", short: "1m" },
  defaultChartType = "candles",
  defaultRange = "All",
  showTopBar = true,
  showLeftSidebar = true,
  showFooterBar = true,
  onIntervalChange,
  onChartTypeChange,
  onRangeChange,
  onAxisSettingChange,
  className = ""
}) => {
  const [selectedInterval, setSelectedInterval] = useState(defaultInterval);
  const [selectedChartType, setSelectedChartType] = useState(defaultChartType);
  const [axisSettings, setAxisSettings] = useState({
    auto: true,
    log: false,
    percent: false
  });
  const [selectedRange, setSelectedRange] = useState(defaultRange);
  const [transformationError, setTransformationError] = useState(null);

  // Transform and filter data based on selected interval and range
  const processedData = useMemo(() => {
    if (!rawData) return null;

    try {
      setTransformationError(null);
      
      // First, check if transformation is possible
      const targetInterval = selectedInterval?.full || selectedInterval;
      if (!canTransformData(dataInterval, targetInterval)) {
        const error = getTransformationError(dataInterval, targetInterval);
        setTransformationError(error);
        return null;
      }

      // Transform data to selected interval
      let transformedData;
      try {
        transformedData = transformDataToInterval(rawData, targetInterval);
      } catch (error) {
        setTransformationError(error.message);
        return null;
      }

      // Then filter by selected range
      return filterDataByRange(transformedData, selectedRange);
    } catch (error) {
      console.error("Data processing error:", error);
      setTransformationError("Failed to process data");
      return null;
    }
  }, [rawData, selectedInterval, selectedRange, dataInterval]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleIntervalChange = useCallback((interval) => {
    setSelectedInterval(interval);
    if (onIntervalChange) {
      onIntervalChange(interval);
    }
  }, [onIntervalChange]);

  const handleChartTypeChange = useCallback((chartType) => {
    setSelectedChartType(chartType);
    if (onChartTypeChange) {
      onChartTypeChange(chartType);
    }
  }, [onChartTypeChange]);

  const handleAxisSettingChange = useCallback((setting, newSettings) => {
    setAxisSettings(newSettings);
    if (onAxisSettingChange) {
      onAxisSettingChange(setting, newSettings);
    }
  }, [onAxisSettingChange]);

  const handleRangeChange = useCallback((range) => {
    setSelectedRange(range);
    if (onRangeChange) {
      onRangeChange(range);
    }
  }, [onRangeChange]);

  return (
    <div className={`app-container ${className}`}>
      {showTopBar && (
        <TopBar 
          selectedInterval={selectedInterval}
          selectedChartType={selectedChartType}
          symbolName={symbolName}
          symbolIcon={symbolIcon}
          onIntervalChange={handleIntervalChange}
          onChartTypeChange={handleChartTypeChange}
        />
      )}
      
      <div className="app-content">
        {showLeftSidebar && <LeftSidebar />}
        <MemoizedChartContainer 
          data={transformationError ? null : processedData} 
          loaded={true} 
          axisSettings={axisSettings}
          error={transformationError}
          chartType={selectedChartType}
        />
      </div>
      
      {showFooterBar && (
        <FooterBar 
          selectedInterval={selectedInterval}
          selectedRange={selectedRange}
          onAxisSettingChange={handleAxisSettingChange}
          onRangeChange={handleRangeChange}
        />
      )}
    </div>
  );
};

TradingChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.instanceOf(Date).isRequired,
      open: PropTypes.number.isRequired,
      high: PropTypes.number.isRequired,
      low: PropTypes.number.isRequired,
      close: PropTypes.number.isRequired,
      volume: PropTypes.number.isRequired
    })
  ).isRequired,
  dataInterval: PropTypes.string,
  symbolName: PropTypes.string,
  symbolIcon: PropTypes.string,
  defaultInterval: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      full: PropTypes.string.isRequired,
      short: PropTypes.string.isRequired
    })
  ]),
  defaultChartType: PropTypes.string,
  defaultRange: PropTypes.string,
  showTopBar: PropTypes.bool,
  showLeftSidebar: PropTypes.bool,
  showFooterBar: PropTypes.bool,
  onIntervalChange: PropTypes.func,
  onChartTypeChange: PropTypes.func,
  onRangeChange: PropTypes.func,
  onAxisSettingChange: PropTypes.func,
  className: PropTypes.string
};

export default TradingChart;