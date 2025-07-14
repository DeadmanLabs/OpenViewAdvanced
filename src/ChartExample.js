import React from "react";
import { PriceChart } from "./PriceChart";

// Example component showing how to use PriceChart with custom data
const ChartExample = () => {
  // Example: Generate sample data
  const generateSampleData = () => {
    const data = [];
    const baseDate = new Date(2024, 0, 1);
    let lastClose = 100;

    for (let i = 0; i < 100; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      
      const volatility = 0.02;
      const change = (Math.random() - 0.5) * volatility * lastClose;
      const close = lastClose + change;
      const high = close + Math.random() * 2;
      const low = close - Math.random() * 2;
      const open = lastClose;
      const volume = Math.floor(Math.random() * 1000000) + 100000;

      data.push({
        date,
        open,
        high: Math.max(open, close, high),
        low: Math.min(open, close, low),
        close,
        volume
      });

      lastClose = close;
    }

    return data;
  };

  const sampleData = generateSampleData();

  return (
    <div style={{ width: "100%", height: "600px" }}>
      <PriceChart data={sampleData} />
    </div>
  );
};

export default ChartExample;