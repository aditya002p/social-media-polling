/**
 * Utility functions for array manipulation
 */

/**
 * Chunks an array into smaller arrays of the specified size
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (!array.length || size < 1) return [];

  const chunked: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }

  return chunked;
};

/**
 * Shuffles an array randomly (Fisher-Yates algorithm)
 */
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

/**
 * Returns only unique items from an array
 */
export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Groups array items by a specified key
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    result[groupKey] = result[groupKey] || [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Flattens a nested array to a single level
 */
export const flatten = <T>(array: (T | T[])[]): T[] => {
  return array.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item);
  }, [] as T[]);
};

/**
 * Returns the intersection of two arrays
 */
export const intersection = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter((item) => array2.includes(item));
};

/**
 * Returns the difference between two arrays (items in array1 that are not in array2)
 */
export const difference = <T>(array1: T[], array2: T[]): T[] => {
  return array1.filter((item) => !array2.includes(item));
};

/**
 * Sorts an array of objects by a specific property
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] => {
  const sorted = [...array].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });

  return direction === "desc" ? sorted.reverse() : sorted;
};

/**
 * Returns the last N elements from an array
 */
export const takeRight = <T>(array: T[], n: number = 1): T[] => {
  const len = array.length;
  if (n <= 0 || len === 0) return [];
  return array.slice(Math.max(len - n, 0));
};
