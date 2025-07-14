import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { scaleLinear, scaleLog } from "d3-scale";
import { curveStepAfter } from "d3-shape";
import {
  discontinuousTimeScaleProviderBuilder,
  Chart,
  ChartCanvas,
  BarSeries,
  CandlestickSeries,
  OHLCSeries,
  LineSeries,
  AreaSeries,
  AreaOnlySeries,
  ScatterSeries,
  CircleMarker,
  StraightLine,
  RenkoSeries,
  KagiSeries,
  PointAndFigureSeries,
  heikinAshi,
  renko,
  kagi,
  pointAndFigure,
  lastVisibleItemBasedZoomAnchor,
  XAxis,
  YAxis,
  CrossHairCursor,
  EdgeIndicator,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  withDeviceRatio,
  withSize
} from "react-financial-charts";
import OHLCTooltip from "./OHLCTooltip";

const axisStyles = {
  strokeStyle: "#383E55", // Color.GRAY
  strokeWidth: 2,
  tickLabelFill: "#9EAAC7", // Color.LIGHT_GRAY
  tickStrokeStyle: "#383E55",
  gridLinesStrokeStyle: "rgba(56, 62, 85, 0.5)" // Color.GRAY w Opacity
};

const coordinateStyles = {
  fill: "#383E55",
  textFill: "#FFFFFF"
};

const zoomButtonStyles = {
  fill: "#383E55",
  fillOpacity: 0.75,
  strokeWidth: 0,
  textFill: "#9EAAC7"
};

const crossHairStyles = {
  strokeStyle: "#9EAAC7"
};

// Default green/red colors for candlesticks
const openCloseColor = (d) => (d.close > d.open ? "#26a69a" : "#ef5350");

// yExtentsCalculator: used from updating price series
// https://github.com/react-financial/react-financial-charts/blob/main/packages/stories/src/features/updating/BasicLineSeries.tsx#L55
const yExtentsCalculator = ({ plotData }) => {
  let min;
  let max;
  for (const { low, high } of plotData) {
    if (min === undefined) min = low;
    if (max === undefined) max = high;
    if (low !== undefined && min > low) min = low;
    if (high !== undefined && max < high) max = high;
  }
  if (min === undefined) min = 0;
  if (max === undefined) max = 0;

  const padding = (max - min) * 0.1;
  return [min - padding, max + padding * 2];
};

const FinancialChart = React.memo(({
  data: initialData,
  dateTimeFormat,
  height,
  margin,
  priceDisplayFormat,
  ratio,
  width,
  axisSettings = { auto: true, log: false, percent: false },
  chartType = "candles"
}) => {
  const [resetCount, setResetCount] = useState(0);

  if (!initialData || initialData.length === 0 || !height || !ratio || !width) return null;

  // Transform data for advanced chart types that require data transformation
  const transformedData = useMemo(() => {
    try {
      switch (chartType) {
        case "heikinAshi":
          // Use the calculator directly - it returns the transformed OHLC data
          const haCalculator = heikinAshi();
          return haCalculator(initialData);
        
        case "renko":
          const renkoCalculator = renko()
            .options({ boxSize: 1.0, sourcePath: "close" });
          return renkoCalculator(initialData);
        
        case "kagi":
          const kagiCalculator = kagi()
            .options({ reverseType: "ATR", windowSize: 14, reverseValue: 2 });
          return kagiCalculator(initialData);
        
        case "pointFigure":
          try {
            // Simplified P&F settings to avoid complex calculations
            const pfCalculator = pointAndFigure()
              .options({ 
                boxSize: 1.0, 
                reverseType: "fixed", 
                reverseValue: 3,
                sourcePath: "close" 
              });
            const pfData = pfCalculator(initialData);
            console.log("P&F Data structure:", pfData?.slice(0, 2)); // Debug log
            return pfData;
          } catch (error) {
            console.warn("Point & Figure transformation failed:", error);
            return initialData; // Fallback to original data
          }
        
        default:
          return initialData;
      }
    } catch (error) {
      console.warn("Data transformation failed for", chartType, error);
      return initialData; // Fallback to original data
    }
  }, [initialData, chartType]);

  const timeDisplayFormat = timeFormat(dateTimeFormat);
  const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d) => d.date
  );
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
    transformedData
  );

  // Create custom Y scale based on axis settings
  const yScale = useMemo(() => {
    if (axisSettings.log) {
      return scaleLog();
    }
    return scaleLinear();
  }, [axisSettings.log]);

  // Custom yExtents calculator for percentage mode
  const customYExtentsCalculator = useMemo(() => {
    if (axisSettings.percent && data.length > 0) {
      const firstPrice = data[0].close;
      return ({ plotData }) => {
        let min = 0;
        let max = 0;
        for (const item of plotData) {
          const percentChange = ((item.close - firstPrice) / firstPrice) * 100;
          if (min > percentChange) min = percentChange;
          if (max < percentChange) max = percentChange;
        }
        const padding = Math.abs(max - min) * 0.1;
        return [min - padding, max + padding];
      };
    }
    return yExtentsCalculator;
  }, [axisSettings.percent, data]);

  // Custom format for percentage mode
  const customPriceFormat = useMemo(() => {
    if (axisSettings.percent) {
      return format("+.2f");
    }
    return priceDisplayFormat;
  }, [axisSettings.percent, priceDisplayFormat]);

  const min = xAccessor(data[Math.max(0, data.length - parseInt(width / 5))]);
  const max = xAccessor(data[data.length - 1]);
  const xExtents = [min, max + 1];

  const gridHeight = height - margin.top - margin.bottom;
  const barChartHeight = gridHeight / 5;
  const barChartOrigin = (_, h) => [0, h - barChartHeight];

  // Function to render the appropriate chart series based on chartType
  const renderPriceSeries = () => {
    switch (chartType) {
      case "bars":
        return <OHLCSeries stroke={openCloseColor} strokeWidth={1} />;
      case "candles":
        return <CandlestickSeries />;
      case "hollow":
        return (
          <CandlestickSeries
            fill={(d) => d.close > d.open ? "transparent" : openCloseColor(d)}
            stroke={openCloseColor}
            candleStrokeWidth={1}
          />
        );
      case "volume":
        return (
          <CandlestickSeries
            fill={(d) => {
              const maxVolume = Math.max(...initialData.map(item => item.volume));
              const volumeOpacity = Math.min(0.8, Math.max(0.1, d.volume / maxVolume));
              const baseColor = d.close > d.open ? "#26a69a" : "#ef5350";
              return `${baseColor}${Math.round(volumeOpacity * 255).toString(16).padStart(2, '0')}`;
            }}
            stroke={openCloseColor}
            candleStrokeWidth={0.5}
          />
        );
      case "line":
        return (
          <LineSeries 
            yAccessor={(d) => d.close} 
            strokeStyle="#26a69a" 
            strokeWidth={2}
          />
        );
      case "lineMarkers":
        return (
          <>
            <LineSeries 
              yAccessor={(d) => d.close} 
              strokeStyle="#26a69a" 
              strokeWidth={2}
            />
            <ScatterSeries 
              yAccessor={(d) => d.close}
              marker={CircleMarker}
              markerProps={{
                r: 3,
                fillStyle: "#26a69a",
                strokeStyle: "#26a69a",
                strokeWidth: 1
              }}
            />
          </>
        );
      case "step":
        return (
          <LineSeries 
            yAccessor={(d) => d.close} 
            strokeStyle="#26a69a" 
            strokeWidth={2}
            curve={curveStepAfter}
          />
        );
      case "area":
        return (
          <AreaSeries 
            yAccessor={(d) => d.close} 
            strokeStyle="#26a69a" 
            strokeWidth={2}
            fillStyle="rgba(38, 166, 154, 0.2)"
          />
        );
      case "hlcArea":
        return (
          <>
            <AreaOnlySeries 
              yAccessor={(d) => d.high}
              base={(yScale, d) => yScale(d.low)}
              fillStyle="rgba(38, 166, 154, 0.1)"
            />
            <LineSeries 
              yAccessor={(d) => d.close} 
              strokeStyle="#26a69a" 
              strokeWidth={2}
            />
          </>
        );
      case "baseline":
        return (
          <AreaSeries 
            yAccessor={(d) => d.close}
            baseAt={(yScale) => {
              // Calculate baseline as first close price in the data
              const firstClose = initialData[0]?.close || 0;
              return yScale(firstClose);
            }}
            strokeStyle={(d) => d.close >= initialData[0]?.close ? "#26a69a" : "#ef5350"}
            strokeWidth={2}
            fillStyle={(d) => d.close >= initialData[0]?.close 
              ? "rgba(38, 166, 154, 0.2)" 
              : "rgba(239, 83, 80, 0.2)"
            }
          />
        );
      case "columns":
        return (
          <BarSeries 
            yAccessor={(d) => d.close}
            fillStyle={(d) => d.close >= initialData[0]?.close ? "#26a69a" : "#ef5350"}
            strokeStyle={(d) => d.close >= initialData[0]?.close ? "#26a69a" : "#ef5350"}
          />
        );
      case "highLow":
        return (
          <>
            {/* High-Low lines using modified OHLCSeries approach */}
            <OHLCSeries 
              strokeWidth={1}
              stroke={(d) => "#9EAAC7"}
              yAccessor={(d) => ({ 
                open: d.high, 
                high: d.high, 
                low: d.low, 
                close: d.high 
              })}
            />
            {/* Close price markers */}
            <ScatterSeries 
              yAccessor={(d) => d.close}
              marker={CircleMarker}
              markerProps={{
                r: 3,
                fillStyle: (d) => d.close >= initialData[0]?.close ? "#26a69a" : "#ef5350",
                strokeStyle: (d) => d.close >= initialData[0]?.close ? "#26a69a" : "#ef5350",
                strokeWidth: 1
              }}
            />
          </>
        );
      case "heikinAshi":
        return (
          <CandlestickSeries 
            fill={(d) => d.close > d.open ? "#26a69a" : "#ef5350"}
            stroke={(d) => d.close > d.open ? "#26a69a" : "#ef5350"}
          />
        );
      case "renko":
        return (
          <RenkoSeries 
            fill={{
              up: "#26a69a",
              down: "#ef5350",
              partial: "rgba(38, 166, 154, 0.3)"
            }}
            stroke={{
              up: "#26a69a",
              down: "#ef5350"
            }}
          />
        );
      case "kagi":
        return (
          <KagiSeries 
            stroke={{
              yang: "#26a69a",
              yin: "#ef5350"
            }}
            strokeWidth={2}
            currentValueStroke="#9EAAC7"
          />
        );
      case "pointFigure":
        // Check if data has the required structure for Point & Figure
        if (data && data.length > 0 && data[0].boxes) {
          return (
            <PointAndFigureSeries 
              fill={{
                up: "#26a69a",
                down: "#ef5350"
              }}
              stroke={{
                up: "#26a69a",
                down: "#ef5350"
              }}
              strokeWidth={1}
            />
          );
        } else {
          // Fallback to candlesticks if P&F data structure is invalid
          return (
            <CandlestickSeries 
              fill={(d) => d.close > d.open ? "#26a69a" : "#ef5350"}
              stroke={(d) => d.close > d.open ? "#26a69a" : "#ef5350"}
            />
          );
        }
      case "lineBreak":
        return (
          <CandlestickSeries 
            fill={(d) => d.close > d.open ? "#26a69a" : "#ef5350"}
            stroke={(d) => d.close > d.open ? "#26a69a" : "#ef5350"}
            candleStrokeWidth={1}
          />
        );
      case "range":
        return (
          <BarSeries 
            yAccessor={(d) => d.close}
            fillStyle={(d) => d.close >= initialData[0]?.close ? "#26a69a" : "#ef5350"}
            strokeStyle={(d) => d.close >= initialData[0]?.close ? "#26a69a" : "#ef5350"}
          />
        );
      default:
        return <CandlestickSeries />;
    }
  };

  // ChartCanvas is drawn from top to bottom
  return (
    <ChartCanvas
      height={height}
      ratio={ratio}
      width={width}
      margin={margin}
      seriesName={`Chart ${resetCount}`}
      data={data}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
      zoomAnchor={lastVisibleItemBasedZoomAnchor}
    >
      {/* Volume Chart */}
      <Chart
        id={1}
        height={barChartHeight}
        origin={barChartOrigin}
        yExtents={(d) => d.volume}
      >
        <BarSeries
          fillStyle={(d) =>
            d.close > d.open
              ? "rgba(38, 166, 154, 0.3)"
              : "rgba(239, 83, 80, 0.3)"
          }
          yAccessor={(d) => d.volume}
        />
      </Chart>

      {/* Price Chart */}
      <Chart 
        id={2} 
        yExtentsCalculator={customYExtentsCalculator}
        yScale={yScale}
      >
        <XAxis {...axisStyles} showGridLines />
        <MouseCoordinateX
          displayFormat={timeDisplayFormat}
          {...coordinateStyles}
        />
        <YAxis 
          {...axisStyles} 
          showGridLines 
          tickFormat={customPriceFormat}
        />
        <MouseCoordinateY
          rectWidth={margin.right}
          displayFormat={customPriceFormat}
          {...coordinateStyles}
        />

        {/* YAxis close price highlight */}
        <EdgeIndicator
          itemType="last"
          rectWidth={margin.right}
          fill={openCloseColor}
          lineStroke={openCloseColor}
          displayFormat={customPriceFormat}
          yAccessor={(d) => d.close}
        />

        {renderPriceSeries()}
        <OHLCTooltip
          origin={[8, 16]}
          textFill={openCloseColor}
          className="react-no-select"
        />
        <ZoomButtons
          onReset={() => setResetCount(resetCount + 1)}
          {...zoomButtonStyles}
        />
      </Chart>
      <CrossHairCursor {...crossHairStyles} />
    </ChartCanvas>
  );
});

FinancialChart.propTypes = {
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
  dateTimeFormat: PropTypes.string,
  height: PropTypes.number,
  margin: PropTypes.object,
  priceDisplayFormat: PropTypes.func,
  ratio: PropTypes.number,
  width: PropTypes.number,
  axisSettings: PropTypes.shape({
    auto: PropTypes.bool,
    log: PropTypes.bool,
    percent: PropTypes.bool
  }),
  chartType: PropTypes.string
};

FinancialChart.defaultProps = {
  dateTimeFormat: "%d %b '%y \xa0 %H:%M",
  height: 0,
  margin: { left: 0, right: 48, top: 0, bottom: 24 },
  priceDisplayFormat: format(".2f"),
  ratio: 0,
  width: 0
};

// Export the raw component for custom sizing
export const PriceChartBase = FinancialChart;

// Export the auto-sized version that fills parent container
export const PriceChart = withSize({ style: { width: "100%", height: "100%" } })(
  withDeviceRatio()(FinancialChart)
);
