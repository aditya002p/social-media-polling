/**
 * Utility functions for mathematical operations
 */

/**
 * Calculate the percentage of a value relative to a total
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(1));
};

/**
 * Clamp a number between a minimum and maximum value
 */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

/**
 * Round a number to a specified number of decimal places
 */
export const roundToDecimals = (num: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

/**
 * Sum an array of numbers
 */
export const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, curr) => acc + curr, 0);
};

/**
 * Calculate the average of an array of numbers
 */
export const average = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
};

/**
 * Calculate the median of an array of numbers
 */
export const median = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;

  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
};

/**
 * Calculate the mode (most frequent value) of an array of numbers
 */
export const mode = (numbers: number[]): number[] => {
  if (numbers.length === 0) return [];

  const frequency: Record<number, number> = {};
  let maxFrequency = 0;

  numbers.forEach((num) => {
    frequency[num] = (frequency[num] || 0) + 1;
    maxFrequency = Math.max(maxFrequency, frequency[num]);
  });

  return Object.keys(frequency)
    .filter((num) => frequency[Number(num)] === maxFrequency)
    .map(Number);
};

/**
 * Calculate the standard deviation of an array of numbers
 */
export const standardDeviation = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;

  const avg = average(numbers);
  const squareDiffs = numbers.map((num) => Math.pow(num - avg, 2));
  const variance = sum(squareDiffs) / numbers.length;

  return Math.sqrt(variance);
};

/**
 * Generate a random integer between min and max (inclusive)
 */
export const randomInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
