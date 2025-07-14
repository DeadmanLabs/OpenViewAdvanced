// Convert intervals to minutes for calculation
const intervalToMinutes = {
  // Ticks - not time-based, return null
  "1 tick": null,
  "10 ticks": null,
  "100 ticks": null,
  "1000 ticks": null,
  
  // Seconds
  "1 second": 1/60,
  "5 seconds": 5/60,
  "10 seconds": 10/60,
  "15 seconds": 15/60,
  "30 seconds": 30/60,
  "45 seconds": 45/60,
  
  // Minutes
  "1 minute": 1,
  "2 minutes": 2,
  "3 minutes": 3,
  "5 minutes": 5,
  "10 minutes": 10,
  "15 minutes": 15,
  "30 minutes": 30,
  "45 minutes": 45,
  
  // Hours
  "1 hour": 60,
  "2 hours": 120,
  "3 hours": 180,
  "4 hours": 240,
  
  // Days
  "1 day": 1440,
  "1 week": 10080,
  "1 month": 43200, // 30 days
  "3 months": 129600, // 90 days
  "6 months": 259200, // 180 days
  "12 months": 525600 // 365 days
};

// Convert ranges to minutes for calculation
const rangeToMinutes = {
  "1D": 1440,
  "5D": 7200,
  "1M": 43200, // 30 days
  "3M": 129600, // 90 days
  "6M": 259200, // 180 days
  "YTD": null, // Variable based on current date
  "1Y": 525600, // 365 days
  "5Y": 2628000, // 5 * 365 days
  "All": null // Depends on data
};

// Convert ranges to days for tick/range calculations
const rangeToDays = {
  "1D": 1,
  "5D": 5,
  "1M": 30,
  "3M": 90,
  "6M": 180,
  "YTD": null,
  "1Y": 365,
  "5Y": 1825,
  "All": null
};

export const calculateCandleCount = (interval, range) => {
  // Handle tick-based intervals
  if (interval.includes("tick")) {
    const days = rangeToDays[range];
    if (!days) return null;
    
    // Assume 1000 ticks per day for calculation (this varies by market)
    const ticksPerDay = 1000;
    const totalTicks = days * ticksPerDay;
    
    const tickValue = parseInt(interval.split(" ")[0]);
    return Math.floor(totalTicks / tickValue);
  }
  
  // Handle range-based intervals
  if (interval.includes("range")) {
    const days = rangeToDays[range];
    if (!days) return null;
    
    // Assume 100 ranges per day for calculation
    const rangesPerDay = 100;
    const totalRanges = days * rangesPerDay;
    
    const rangeValue = parseInt(interval.split(" ")[0]);
    return Math.floor(totalRanges / rangeValue);
  }
  
  // Handle time-based intervals
  const intervalMinutes = intervalToMinutes[interval];
  const rangeMinutes = rangeToMinutes[range];
  
  if (!intervalMinutes || !rangeMinutes) return null;
  
  return Math.floor(rangeMinutes / intervalMinutes);
};

export const isValidCombination = (interval, range) => {
  // Handle special cases
  if (range === "YTD" || range === "All") return true;
  if (interval.includes("tick") || interval.includes("range")) return true;
  
  const intervalMinutes = intervalToMinutes[interval];
  const rangeMinutes = rangeToMinutes[range];
  
  if (!intervalMinutes || !rangeMinutes) return false;
  
  // Invalid if interval is larger than the range
  return intervalMinutes <= rangeMinutes;
};

export const getInvalidMessage = (interval, range) => {
  return `Invalid combination: ${interval} interval cannot be used with ${range} range. The interval is larger than the time range.`;
};

export const filterDataByRange = (data, range) => {
  if (!data || data.length === 0) return data;
  
  const now = new Date();
  const endDate = data[data.length - 1].date;
  let startDate;
  
  switch (range) {
    case "1D":
      startDate = new Date(endDate.getTime() - (24 * 60 * 60 * 1000));
      break;
    case "5D":
      startDate = new Date(endDate.getTime() - (5 * 24 * 60 * 60 * 1000));
      break;
    case "1M":
      startDate = new Date(endDate.getTime() - (30 * 24 * 60 * 60 * 1000));
      break;
    case "3M":
      startDate = new Date(endDate.getTime() - (90 * 24 * 60 * 60 * 1000));
      break;
    case "6M":
      startDate = new Date(endDate.getTime() - (180 * 24 * 60 * 60 * 1000));
      break;
    case "YTD":
      startDate = new Date(endDate.getFullYear(), 0, 1);
      break;
    case "1Y":
      startDate = new Date(endDate.getTime() - (365 * 24 * 60 * 60 * 1000));
      break;
    case "5Y":
      startDate = new Date(endDate.getTime() - (5 * 365 * 24 * 60 * 60 * 1000));
      break;
    case "All":
    default:
      return data;
  }
  
  return data.filter(item => item.date >= startDate);
};