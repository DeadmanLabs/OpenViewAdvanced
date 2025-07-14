import React, { useState, useEffect } from "react";
import { calculateCandleCount, isValidCombination, getInvalidMessage } from "./utils/intervalUtils";

const FooterBar = React.memo(({ 
  selectedInterval = { full: "1 day", short: "1D" }, 
  selectedRange = "All",
  onAxisSettingChange,
  onRangeChange 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [axisSettings, setAxisSettings] = useState({
    auto: true,
    log: false,
    percent: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dateRanges = ["1D", "5D", "1M", "3M", "6M", "YTD", "1Y", "5Y", "All"];

  const handleRangeClick = (range) => {
    const intervalValue = selectedInterval?.full || selectedInterval;
    if (!isValidCombination(intervalValue, range)) {
      alert(getInvalidMessage(intervalValue, range));
      return;
    }
    
    if (onRangeChange) {
      onRangeChange(range);
    }
  };

  const handleAxisSetting = (setting) => {
    const newSettings = { ...axisSettings };
    
    if (setting === "auto") {
      newSettings.auto = !axisSettings.auto;
    } else if (setting === "log") {
      newSettings.log = !axisSettings.log;
      // Log and percent are mutually exclusive
      if (newSettings.log) newSettings.percent = false;
    } else if (setting === "percent") {
      newSettings.percent = !axisSettings.percent;
      // Log and percent are mutually exclusive
      if (newSettings.percent) newSettings.log = false;
    }
    
    setAxisSettings(newSettings);
    if (onAxisSettingChange) {
      onAxisSettingChange(setting, newSettings);
    }
  };

  const getCandleCount = (range) => {
    const intervalValue = selectedInterval?.full || selectedInterval;
    const count = calculateCandleCount(intervalValue, range);
    return count;
  };

  const isRangeDisabled = (range) => {
    const intervalValue = selectedInterval?.full || selectedInterval;
    return !isValidCombination(intervalValue, range);
  };

  const handleButtonClick = (action) => {
    alert(`${action} not implemented`);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + " UTC";
  };

  return (
    <div className="footer-bar">
      <div className="footer-left">
        {dateRanges.map(range => (
          <button
            key={range}
            className={`range-button ${selectedRange === range ? 'active' : ''} ${isRangeDisabled(range) ? 'disabled' : ''}`}
            onClick={() => handleRangeClick(range)}
            disabled={isRangeDisabled(range)}
            title={isRangeDisabled(range) ? getInvalidMessage(selectedInterval?.full || selectedInterval, range) : `${getCandleCount(range)} candles`}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="footer-center">
        <div className="tradingview-watermark">
          <img src="/TradingViewIcons/Network.svg" alt="TradingView" width="18" height="18" />
          <span>TradingView</span>
        </div>
      </div>

      <div className="footer-right">
        <div className="axis-settings">
          <button
            className={`axis-button ${axisSettings.auto ? 'active' : ''}`}
            onClick={() => handleAxisSetting("auto")}
            title="Auto (fits data to screen)"
          >
            Auto
          </button>
          <button
            className={`axis-button ${axisSettings.log ? 'active' : ''}`}
            onClick={() => handleAxisSetting("log")}
            title="Log Scale"
          >
            Log
          </button>
          <button
            className={`axis-button ${axisSettings.percent ? 'active' : ''}`}
            onClick={() => handleAxisSetting("percent")}
            title="Percentage"
          >
            %
          </button>
        </div>

        <div className="footer-divider" />

        <button 
          className="footer-icon-btn"
          onClick={() => handleButtonClick("screenshot")}
          title="Take a snapshot"
        >
          <img src="/TradingViewIcons/Camera.svg" alt="Screenshot" width="18" height="18" />
        </button>

        <button 
          className="footer-icon-btn"
          onClick={() => handleButtonClick("settings")}
          title="Settings"
        >
          <img src="/TradingViewIcons/Nut.svg" alt="Settings" width="18" height="18" />
        </button>

        <div className="footer-divider" />

        <div className="current-time">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
});

export default FooterBar;