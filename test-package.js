// Quick test to ensure the package exports work correctly
const package = require('./lib/index.js');

console.log('Available exports:');
console.log(Object.keys(package));

console.log('\nChart types:');
console.log(package.CHART_TYPES);

console.log('\nIntervals:');
console.log(package.INTERVALS.slice(0, 5)); // Show first 5

console.log('\nTime ranges:');
console.log(package.TIME_RANGES);

console.log('\nPackage test completed successfully!');