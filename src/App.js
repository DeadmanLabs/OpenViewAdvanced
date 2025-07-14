import React, { useState, useMemo, useCallback } from "react";
import { PriceChart } from "./PriceChart";
import { useMarketData } from "./useMarketData";
import { filterDataByRange } from "./utils/intervalUtils";
import { transformDataToInterval, canTransformData, getTransformationError } from "./utils/dataTransformation";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import FooterBar from "./FooterBar";
import "./styles.css";

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

const App = () => {
  const { data: rawData, loaded } = useMarketData();
  const [selectedInterval, setSelectedInterval] = useState({ full: "1 minute", short: "1m" });
  const [selectedChartType, setSelectedChartType] = useState("candles");
  const [axisSettings, setAxisSettings] = useState({
    auto: true,
    log: false,
    percent: false
  });
  const [selectedRange, setSelectedRange] = useState("All");
  const [transformationError, setTransformationError] = useState(null);

  // Assume raw data is 1-minute intervals (this should come from your data source)
  const rawDataInterval = "1 minute";

  // Transform and filter data based on selected interval and range
  const processedData = useMemo(() => {
    if (!rawData) return null;

    try {
      setTransformationError(null);
      
      // First, check if transformation is possible
      const targetInterval = selectedInterval?.full || selectedInterval;
      if (!canTransformData(rawDataInterval, targetInterval)) {
        const error = getTransformationError(rawDataInterval, targetInterval);
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
  }, [rawData, selectedInterval, selectedRange, rawDataInterval]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleIntervalChange = useCallback((interval) => {
    setSelectedInterval(interval);
  }, []);

  const handleChartTypeChange = useCallback((chartType) => {
    setSelectedChartType(chartType);
  }, []);

  const handleAxisSettingChange = useCallback((setting, newSettings) => {
    setAxisSettings(newSettings);
    console.log(`Axis setting changed: ${setting}`, newSettings);
  }, []);

  const handleRangeChange = useCallback((range) => {
    setSelectedRange(range);
    console.log(`Range changed to: ${range}`);
  }, []);

  return (
    <div className="app-container">
      <TopBar 
        selectedInterval={selectedInterval}
        selectedChartType={selectedChartType}
        symbolName="BTCUSD"
        symbolIcon="🟠"
        onIntervalChange={handleIntervalChange}
        onChartTypeChange={handleChartTypeChange}
      />
      
      <div className="app-content">
        <LeftSidebar />
        <MemoizedChartContainer 
          data={transformationError ? null : processedData} 
          loaded={loaded} 
          axisSettings={axisSettings}
          error={transformationError}
          chartType={selectedChartType}
        />
      </div>
      
      <FooterBar 
        selectedInterval={selectedInterval}
        selectedRange={selectedRange}
        onAxisSettingChange={handleAxisSettingChange}
        onRangeChange={handleRangeChange}
      />
    </div>
  );
};

export default App;
