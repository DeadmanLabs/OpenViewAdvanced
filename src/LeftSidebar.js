import React, { useState, useEffect, useRef } from "react";

const LeftSidebar = React.memo(() => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeTool, setActiveTool] = useState("cursor");
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tools = [
    { id: "cursor", icon: "CrossLine", label: "Cross Cursor" },
    { id: "trend", icon: "TrendLine", label: "Trend Line Tools", hasSubmenu: true },
    { id: "fibonacci", icon: "Fibbinoci", label: "Fibonacci Tools", hasSubmenu: true },
    { id: "patterns", icon: "TrianglePattern", label: "Patterns", hasSubmenu: true },
    { id: "forecast", icon: "Forecast", label: "Forecast Tools", hasSubmenu: true },
    { id: "measure", icon: "Ruler", label: "Measure Tools", hasSubmenu: true },
    { id: "annotation", icon: "Text", label: "Annotation Tools", hasSubmenu: true },
    { id: "icons", icon: "FlagMark", label: "Icons", hasSubmenu: true },
    { id: "volume", icon: "VolumeCandles", label: "Volume Profile Tools", hasSubmenu: true },
    { id: "search", icon: "Search", label: "Search" },
    { id: "magnet", icon: "Magnet", label: "Magnet Mode" },
    { id: "drawing-lock", icon: "Unlock", label: "Drawing Lock" },
    { id: "hide-drawings", icon: "EyePaint", label: "Hide All Drawings" },
    { id: "remove-drawings", icon: "Trash", label: "Remove All Drawings" }
  ];

  const trendTools = [
    { category: "LINES", items: [
      { id: "trendLine", icon: "TrendLine", label: "Trend Line" },
      { id: "ray", icon: "Ray", label: "Ray" },
      { id: "infoLine", icon: "InfoLine", label: "Info Line" },
      { id: "extendedLine", icon: "ExtendedLine", label: "Extended Line" },
      { id: "trendAngle", icon: "TrendAngle", label: "Trend Angle" },
      { id: "horizontalLine", icon: "HorizontalLine", label: "Horizontal Line" },
      { id: "horizontalRay", icon: "HorizontalRay", label: "Horizontal Ray" },
      { id: "verticalLine", icon: "VerticalLine", label: "Vertical Line" },
      { id: "crossLine", icon: "CrossLine", label: "Cross Line" }
    ]},
    { category: "CHANNELS", items: [
      { id: "parallelChannel", icon: "ParallelChannel", label: "Parallel Channel" },
      { id: "regressionTrend", icon: "RegressionTrend", label: "Regression Trend" },
      { id: "flatTopBottom", icon: "FlatTopBottom", label: "Flat Top/Bottom" },
      { id: "disjointChannel", icon: "DisjointChannel", label: "Disjoint Channel" }
    ]},
    { category: "PITCHFORKS", items: [
      { id: "pitchfork", icon: "Pitchfork", label: "Pitchfork" },
      { id: "schiffPitchfork", icon: "SchiffPitchfork", label: "Schiff Pitchfork" },
      { id: "modifiedSchiff", icon: "ModifiedSchiffPitchfork", label: "Modified Schiff Pitchfork" },
      { id: "insidePitchfork", icon: "InsidePitchfork", label: "Inside Pitchfork" }
    ]}
  ];

  const fibonacciTools = [
    { id: "fibRetracement", icon: "Fibbinoci", label: "Fib Retracement" },
    { id: "fibExtension", icon: "Trend-BasedFibExtension", label: "Trend-Based Fib Extension" },
    { id: "fibSpeedFan", icon: "FibSpeedResistanceFan", label: "Fib Speed Resistance Fan" },
    { id: "fibTimezone", icon: "FibTimeZone", label: "Fib Timezone" },
    { id: "fibCircles", icon: "FibCircles", label: "Fib Circles" },
    { id: "fibSpiral", icon: "FibSpiral", label: "Fib Spiral" },
    { id: "fibChannel", icon: "FibChannel", label: "Fib Channel" },
    { id: "fibWedge", icon: "FibWedge", label: "Fib Wedge" }
  ];

  const drawingTools = [
    { category: "BRUSHES", items: [
      { id: "brush", icon: "Brush", label: "Brush" },
      { id: "highlighter", icon: "Highlighter", label: "Highlighter" }
    ]},
    { category: "ARROWS", items: [
      { id: "arrowMarker", icon: "ArrowMarker", label: "Arrow Marker" },
      { id: "arrow", icon: "Arrow", label: "Arrow" },
      { id: "arrowUp", icon: "ArrowMarkUp", label: "Arrow Mark Up" },
      { id: "arrowDown", icon: "ArrowMarkDown", label: "Arrow Mark Down" }
    ]},
    { category: "SHAPES", items: [
      { id: "rectangle", icon: "Rectangle", label: "Rectangle" },
      { id: "rotatedRectangle", icon: "RotatedRectangle", label: "Rotated Rectangle" },
      { id: "path", icon: "Path", label: "Path" },
      { id: "circle", icon: "Circle", label: "Circle" },
      { id: "ellipse", icon: "Ellipse", label: "Ellipse" },
      { id: "polyline", icon: "Polyline", label: "Polyline" },
      { id: "triangle", icon: "Triangle", label: "Triangle" },
      { id: "arc", icon: "Arc", label: "Arc" },
      { id: "curve", icon: "Curve", label: "Curve" }
    ]}
  ];

  const handleToolClick = (tool) => {
    if (tool.hasSubmenu) {
      setActiveMenu(activeMenu === tool.id ? null : tool.id);
    } else {
      setActiveTool(tool.id);
      setActiveMenu(null);
      if (!["cursor", "magnet", "drawing-lock", "hide-drawings", "remove-drawings", "search"].includes(tool.id)) {
        alert(`${tool.label} tool not implemented`);
      }
    }
  };

  const handleSubtoolClick = (subtool) => {
    setActiveTool(subtool.id);
    setActiveMenu(null);
    alert(`${subtool.label} not implemented`);
  };

  const renderSubmenu = () => {
    switch (activeMenu) {
      case "trend":
        return (
          <div className="submenu">
            {trendTools.map(category => (
              <div key={category.category} className="submenu-category">
                <div className="submenu-category-header">{category.category}</div>
                {category.items.map(item => (
                  <button
                    key={item.id}
                    className={`submenu-item ${activeTool === item.id ? 'active' : ''}`}
                    onClick={() => handleSubtoolClick(item)}
                  >
                    <img 
                      src={`/TradingViewIcons/${item.icon}.svg`} 
                      alt={item.label} 
                      width="20" 
                      height="20"
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      case "fibonacci":
        return (
          <div className="submenu">
            {fibonacciTools.map(item => (
              <button
                key={item.id}
                className={`submenu-item ${activeTool === item.id ? 'active' : ''}`}
                onClick={() => handleSubtoolClick(item)}
              >
                <img 
                  src={`/TradingViewIcons/${item.icon}.svg`} 
                  alt={item.label} 
                  width="16" 
                  height="16"
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        );
      case "annotation":
        return (
          <div className="submenu">
            {drawingTools.map(category => (
              <div key={category.category} className="submenu-category">
                <div className="submenu-category-header">{category.category}</div>
                {category.items.map(item => (
                  <button
                    key={item.id}
                    className={`submenu-item ${activeTool === item.id ? 'active' : ''}`}
                    onClick={() => handleSubtoolClick(item)}
                  >
                    <img 
                      src={`/TradingViewIcons/${item.icon}.svg`} 
                      alt={item.label} 
                      width="20" 
                      height="20"
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="left-sidebar" ref={sidebarRef}>
      <div className="sidebar-tools">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`sidebar-tool ${activeTool === tool.id || activeMenu === tool.id ? 'active' : ''}`}
            onClick={() => handleToolClick(tool)}
            title={tool.label}
          >
            <img 
              src={`/TradingViewIcons/${tool.icon}.svg`} 
              alt={tool.label} 
              width="24" 
              height="24"
            />
            {tool.hasSubmenu && (
              <span className="submenu-indicator">▸</span>
            )}
          </button>
        ))}
      </div>
      {activeMenu && renderSubmenu()}
    </div>
  );
});

export default LeftSidebar;