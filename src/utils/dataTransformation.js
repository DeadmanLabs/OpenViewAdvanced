// Data transformation utilities for different timeframes

// Parse interval string to get numeric value and unit
const parseInterval = (intervalStr) => {
  const interval = intervalStr?.full || intervalStr;
  if (!interval || typeof interval !== 'string') return null;
  
  const matches = interval.match(/^(\d+)\s*(\w+)$/);
  if (!matches) return null;
  
  const [, value, unit] = matches;
  return {
    value: parseInt(value),
    unit: unit.toLowerCase()
  };
};

// Convert time units to minutes for comparison
const getMinutesFromUnit = (value, unit) => {
  switch (unit) {
    case 'second':
    case 'seconds':
      return value / 60;
    case 'minute':
    case 'minutes':
      return value;
    case 'hour':
    case 'hours':
      return value * 60;
    case 'day':
    case 'days':
      return value * 1440; // 24 * 60
    case 'week':
    case 'weeks':
      return value * 10080; // 7 * 24 * 60
    case 'month':
    case 'months':
      return value * 43200; // 30 * 24 * 60 (approximate)
    default:
      return null;
  }
};

// Check if transformation is possible
export const canTransformData = (rawDataInterval, targetInterval) => {
  // For ticks and ranges, we can't transform without knowing the actual tick/range data
  if (targetInterval.includes('tick') || targetInterval.includes('range')) {
    return false;
  }
  
  const rawParsed = parseInterval(rawDataInterval);
  const targetParsed = parseInterval(targetInterval);
  
  if (!rawParsed || !targetParsed) return false;
  
  const rawMinutes = getMinutesFromUnit(rawParsed.value, rawParsed.unit);
  const targetMinutes = getMinutesFromUnit(targetParsed.value, targetParsed.unit);
  
  if (!rawMinutes || !targetMinutes) return false;
  
  // Can only aggregate to larger timeframes
  return targetMinutes >= rawMinutes && targetMinutes % rawMinutes === 0;
};

// Aggregate OHLC data for a time period
const aggregateCandles = (candles) => {
  if (!candles || candles.length === 0) return null;
  
  const firstCandle = candles[0];
  const lastCandle = candles[candles.length - 1];
  
  let high = firstCandle.high;
  let low = firstCandle.low;
  let volume = 0;
  
  for (const candle of candles) {
    if (candle.high > high) high = candle.high;
    if (candle.low < low) low = candle.low;
    volume += candle.volume;
  }
  
  return {
    date: firstCandle.date,
    open: firstCandle.open,
    high,
    low,
    close: lastCandle.close,
    volume
  };
};

// Transform data to target interval
export const transformDataToInterval = (rawData, targetInterval) => {
  if (!rawData || rawData.length === 0) return rawData;
  
  // If target interval is not parseable (like ticks/ranges), return original data
  const targetParsed = parseInterval(targetInterval);
  if (!targetParsed) return rawData;
  
  const targetMinutes = getMinutesFromUnit(targetParsed.value, targetParsed.unit);
  if (!targetMinutes) return rawData;
  
  // For sub-minute intervals, we can't transform from minute data
  if (targetMinutes < 1) {
    throw new Error(`Cannot transform to ${targetInterval}: target interval is smaller than source data resolution`);
  }
  
  const result = [];
  let currentGroup = [];
  let groupStartTime = null;
  
  for (const dataPoint of rawData) {
    const dataTime = new Date(dataPoint.date);
    
    // Calculate the time bucket this data point belongs to
    let bucketStart;
    
    if (targetParsed.unit.includes('minute')) {
      // For minute intervals, align to minute boundaries
      bucketStart = new Date(dataTime);
      const minutes = Math.floor(dataTime.getMinutes() / targetParsed.value) * targetParsed.value;
      bucketStart.setMinutes(minutes, 0, 0);
    } else if (targetParsed.unit.includes('hour')) {
      // For hour intervals, align to hour boundaries
      bucketStart = new Date(dataTime);
      const hours = Math.floor(dataTime.getHours() / targetParsed.value) * targetParsed.value;
      bucketStart.setHours(hours, 0, 0, 0);
    } else if (targetParsed.unit.includes('day')) {
      // For day intervals, align to day boundaries
      bucketStart = new Date(dataTime);
      bucketStart.setHours(0, 0, 0, 0);
      if (targetParsed.value > 1) {
        const daysSinceEpoch = Math.floor(bucketStart.getTime() / (1000 * 60 * 60 * 24));
        const alignedDays = Math.floor(daysSinceEpoch / targetParsed.value) * targetParsed.value;
        bucketStart = new Date(alignedDays * 1000 * 60 * 60 * 24);
      }
    } else if (targetParsed.unit.includes('week')) {
      // For week intervals, align to week boundaries (Monday)
      bucketStart = new Date(dataTime);
      const dayOfWeek = (bucketStart.getDay() + 6) % 7; // Make Monday = 0
      bucketStart.setDate(bucketStart.getDate() - dayOfWeek);
      bucketStart.setHours(0, 0, 0, 0);
    } else if (targetParsed.unit.includes('month')) {
      // For month intervals, align to month boundaries
      bucketStart = new Date(dataTime.getFullYear(), dataTime.getMonth(), 1);
      if (targetParsed.value > 1) {
        const monthsAligned = Math.floor(bucketStart.getMonth() / targetParsed.value) * targetParsed.value;
        bucketStart.setMonth(monthsAligned);
      }
    } else {
      // Fallback: use the original data point time
      bucketStart = dataTime;
    }
    
    // If we're starting a new group or this point belongs to a different bucket
    if (groupStartTime === null || bucketStart.getTime() !== groupStartTime.getTime()) {
      // Process the previous group if it exists
      if (currentGroup.length > 0) {
        const aggregated = aggregateCandles(currentGroup);
        if (aggregated) {
          result.push(aggregated);
        }
      }
      
      // Start a new group
      currentGroup = [dataPoint];
      groupStartTime = bucketStart;
    } else {
      // Add to current group
      currentGroup.push(dataPoint);
    }
  }
  
  // Process the final group
  if (currentGroup.length > 0) {
    const aggregated = aggregateCandles(currentGroup);
    if (aggregated) {
      result.push(aggregated);
    }
  }
  
  return result;
};

export const getTransformationError = (rawDataInterval, targetInterval) => {
  if (targetInterval.includes('tick')) {
    return `Cannot transform to tick-based intervals. Tick data requires specialized market data.`;
  }
  
  if (targetInterval.includes('range')) {
    return `Cannot transform to range-based intervals. Range data requires specialized market data.`;
  }
  
  const rawParsed = parseInterval(rawDataInterval);
  const targetParsed = parseInterval(targetInterval);
  
  if (!rawParsed || !targetParsed) {
    return `Invalid interval format.`;
  }
  
  const rawMinutes = getMinutesFromUnit(rawParsed.value, rawParsed.unit);
  const targetMinutes = getMinutesFromUnit(targetParsed.value, targetParsed.unit);
  
  if (!rawMinutes || !targetMinutes) {
    return `Unsupported time unit.`;
  }
  
  if (targetMinutes < rawMinutes) {
    return `Cannot transform from ${rawDataInterval} to ${targetInterval}: target interval is smaller than source data resolution.`;
  }
  
  if (targetMinutes % rawMinutes !== 0) {
    return `Cannot transform from ${rawDataInterval} to ${targetInterval}: intervals are not evenly divisible.`;
  }
  
  return null;
};