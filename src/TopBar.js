import React, { useState, useEffect, useRef } from "react";

const TopBar = React.memo(({ 
  selectedInterval = "1D", 
  selectedChartType = "candles",
  symbolName = "BTCUSD",
  symbolIcon = "🟠",
  onIntervalChange,
  onChartTypeChange,
  onUndo,
  onRedo
}) => {
  const [showIntervalMenu, setShowIntervalMenu] = useState(false);
  const [showChartTypeMenu, setShowChartTypeMenu] = useState(false);
  const intervalRef = useRef(null);
  const chartTypeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (intervalRef.current && !intervalRef.current.contains(event.target)) {
        setShowIntervalMenu(false);
      }
      if (chartTypeRef.current && !chartTypeRef.current.contains(event.target)) {
        setShowChartTypeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const intervals = {
    "TICKS": [
      { full: "1 tick", short: "1t" },
      { full: "10 ticks", short: "10t" },
      { full: "100 ticks", short: "100t" },
      { full: "1000 ticks", short: "1000t" }
    ],
    "SECONDS": [
      { full: "1 second", short: "1s" },
      { full: "5 seconds", short: "5s" },
      { full: "10 seconds", short: "10s" },
      { full: "15 seconds", short: "15s" },
      { full: "30 seconds", short: "30s" },
      { full: "45 seconds", short: "45s" }
    ],
    "MINUTES": [
      { full: "1 minute", short: "1m" },
      { full: "2 minutes", short: "2m" },
      { full: "3 minutes", short: "3m" },
      { full: "5 minutes", short: "5m" },
      { full: "10 minutes", short: "10m" },
      { full: "15 minutes", short: "15m" },
      { full: "30 minutes", short: "30m" },
      { full: "45 minutes", short: "45m" }
    ],
    "HOURS": [
      { full: "1 hour", short: "1H" },
      { full: "2 hours", short: "2H" },
      { full: "3 hours", short: "3H" },
      { full: "4 hours", short: "4H" }
    ],
    "DAYS": [
      { full: "1 day", short: "1D" },
      { full: "1 week", short: "1W" },
      { full: "1 month", short: "1M" },
      { full: "3 months", short: "3M" },
      { full: "6 months", short: "6M" },
      { full: "12 months", short: "12M" }
    ],
    "RANGES": [
      { full: "1 range", short: "1R" },
      { full: "10 ranges", short: "10R" },
      { full: "100 ranges", short: "100R" },
      { full: "1000 ranges", short: "1000R" }
    ]
  };

  const chartTypes = [
    { id: "bars", label: "Bars", icon: "Bars" },
    { id: "candles", label: "Candles", icon: "Candlestick" },
    { id: "hollow", label: "Hollow candles", icon: "HollowCandles" },
    { id: "volume", label: "Volume candles", icon: "VolumeCandles" },
    { type: "separator" },
    { id: "line", label: "Line", icon: "Lines" },
    { id: "lineMarkers", label: "Line with markers", icon: "LineMarkers" },
    { id: "step", label: "Step line", icon: "StepLine" },
    { type: "separator" },
    { id: "area", label: "Area", icon: "Area" },
    { id: "hlcArea", label: "HLC area", icon: "HLCArea" },
    { id: "baseline", label: "Baseline", icon: "Baseline" },
    { type: "separator" },
    { id: "columns", label: "Columns", icon: "Columns" },
    { id: "highLow", label: "High-low", icon: "HighLow" },
    { type: "separator" },
    { id: "volumeFootprint", label: "Volume footprint", icon: "VolumeFootprint" },
    { id: "timePriceOpportunity", label: "Time Price Opportunity", icon: "TimePriceOpportunity" },
    { id: "sessionVolume", label: "Session volume profile", icon: "SessionVolumeProfile" },
    { type: "separator" },
    { id: "heikinAshi", label: "Heikin Ashi", icon: "HeikinAshi" },
    { id: "renko", label: "Renko", icon: "Renko" },
    { id: "lineBreak", label: "Line break", icon: "LineBreak" },
    { id: "kagi", label: "Kagi", icon: "Kagi" },
    { id: "pointFigure", label: "Point & figure", icon: "PointAndFigure" },
    { id: "range", label: "Range", icon: "Range" }
  ];

  const handleIntervalClick = (intervalObj) => {
    setShowIntervalMenu(false);
    if (onIntervalChange) {
      onIntervalChange(intervalObj);
    } else {
      alert(`Interval change to ${intervalObj.full} not implemented`);
    }
  };

  // Helper function to get the short form for display
  const getSelectedIntervalShort = () => {
    if (typeof selectedInterval === 'string') {
      // Handle legacy format, find the matching interval
      for (const category of Object.values(intervals)) {
        for (const interval of category) {
          if (interval.full === selectedInterval) {
            return interval.short;
          }
        }
      }
      return selectedInterval; // fallback
    }
    return selectedInterval?.short || selectedInterval;
  };

  const handleChartTypeClick = (type) => {
    setShowChartTypeMenu(false);
    if (onChartTypeChange) {
      onChartTypeChange(type.id);
    } else {
      alert(`Chart type change to ${type.label} not implemented`);
    }
  };

  const handleButtonClick = (action) => {
    switch(action) {
      case "undo":
        if (onUndo) onUndo();
        else alert("Undo not implemented");
        break;
      case "redo":
        if (onRedo) onRedo();
        else alert("Redo not implemented");
        break;
      case "indicators":
        alert("Indicators not implemented");
        break;
      case "alert":
        alert("Alert not implemented");
        break;
      case "replay":
        alert("Replay not implemented");
        break;
      default:
        alert(`${action} not implemented`);
    }
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-symbol">
          <span className="symbol-icon">{symbolIcon}</span>
          <span className="symbol-name">{symbolName}</span>
        </div>

        <div className="topbar-divider" />

        <div className="interval-selector" ref={intervalRef}>
          <button 
            className="interval-button"
            onClick={() => setShowIntervalMenu(!showIntervalMenu)}
          >
            {getSelectedIntervalShort()}
          </button>
          {showIntervalMenu && (
            <div className="interval-menu">
              {Object.entries(intervals).map(([category, items]) => (
                <div key={category} className="interval-category">
                  <div className="interval-category-header">{category}</div>
                  {items.map(intervalObj => (
                    <button
                      key={intervalObj.full}
                      className={`interval-item ${
                        (selectedInterval?.full || selectedInterval) === intervalObj.full ? 'active' : ''
                      }`}
                      onClick={() => handleIntervalClick(intervalObj)}
                    >
                      {intervalObj.full}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="topbar-divider" />

        <div className="chart-type-selector" ref={chartTypeRef}>
          <button 
            className="chart-type-button"
            onClick={() => setShowChartTypeMenu(!showChartTypeMenu)}
          >
            <img 
              src={`/TradingViewIcons/${chartTypes.find(t => t.id === selectedChartType)?.icon || 'Candlestick'}.svg`} 
              alt="Chart type" 
              width="24" 
              height="24"
            />
          </button>
          {showChartTypeMenu && (
            <div className="chart-type-menu">
              {chartTypes.map((type, index) => (
                type.type === "separator" ? (
                  <div key={`separator-${index}`} className="chart-type-separator" />
                ) : (
                  <button
                    key={type.id}
                    className={`chart-type-item ${type.id === selectedChartType ? 'active' : ''}`}
                    onClick={() => handleChartTypeClick(type)}
                  >
                    <img 
                      src={`/TradingViewIcons/${type.icon}.svg`} 
                      alt={type.label} 
                      width="24" 
                      height="24"
                    />
                    <span>{type.label}</span>
                  </button>
                )
              ))}
            </div>
          )}
        </div>

        <div className="topbar-divider" />

        <button 
          className="topbar-icon-btn"
          onClick={() => handleButtonClick("indicators")}
          title="Indicators"
        >
          <img src="/TradingViewIcons/Indicator.svg" alt="Indicators" width="24" height="24" />
          <span className="btn-label">Indicators</span>
        </button>

        <div className="topbar-divider" />

        <button 
          className="topbar-icon-btn"
          onClick={() => handleButtonClick("alert")}
          title="Alert"
        >
          <img src="/TradingViewIcons/Target.svg" alt="Alert" width="24" height="24" />
          <span className="btn-label">Alert</span>
        </button>

        <button 
          className="topbar-icon-btn"
          onClick={() => handleButtonClick("replay")}
          title="Replay"
        >
          <img src="/TradingViewIcons/Rewind.svg" alt="Replay" width="24" height="24" />
          <span className="btn-label">Replay</span>
        </button>

        <div className="topbar-divider" />

        <button 
          className="topbar-icon-btn"
          onClick={() => handleButtonClick("undo")}
          title="Undo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M6 12h10a4 4 0 0 1 0 8M6 12l3-3M6 12l3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          className="topbar-icon-btn"
          onClick={() => handleButtonClick("redo")}
          title="Redo"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M18 12H8a4 4 0 0 0 0 8M18 12l-3-3M18 12l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="topbar-right">
        <div className="price-info">
          <span className="price-open">O 117,485.1</span>
          <span className="price-high">H 119,519.8</span>
          <span className="price-low">L 117,278.6</span>
          <span className="price-close">C 119,419.4</span>
          <span className="price-change positive">+1,966.6 (+1.67%)</span>
        </div>
      </div>
    </div>
  );
});

export default TopBar;