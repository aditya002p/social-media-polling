import {
  format,
  formatDistanceToNow,
  formatRelative,
  isBefore,
  isAfter,
  isSameDay,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

/**
 * Format a date in standard format
 * @param date The date to format
 * @param formatPattern Optional format pattern
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  formatPattern: string = "MMM d, yyyy"
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(dateObj, formatPattern);
};

/**
 * Format a date with time
 * @param date The date to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: Date | string | number): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(dateObj, "MMM d, yyyy h:mm a");
};

/**
 * Format date relative to now (e.g. "5 minutes ago")
 * @param date The date to format
 * @param addSuffix Whether to add a suffix
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: Date | string | number,
  addSuffix: boolean = true
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  return formatDistanceToNow(dateObj, { addSuffix });
};

/**
 * Format date relative to another date
 * @param date The date to format
 * @param baseDate The base date to relate to
 * @returns Relative date string
 */
export const formatRelativeToDate = (
  date: Date | string | number,
  baseDate: Date | string | number = new Date()
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  const baseDateObj =
    typeof baseDate === "string" ? parseISO(baseDate) : new Date(baseDate);

  return formatRelative(dateObj, baseDateObj);
};

/**
 * Check if a date is before another date
 * @param date The date to check
 * @param compareDate The date to compare against
 * @returns Whether date is before compareDate
 */
export const isDateBefore = (
  date: Date | string | number,
  compareDate: Date | string | number = new Date()
): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  const compareDateObj =
    typeof compareDate === "string"
      ? parseISO(compareDate)
      : new Date(compareDate);

  return isBefore(dateObj, compareDateObj);
};

/**
 * Check if a date is after another date
 * @param date The date to check
 * @param compareDate The date to compare against
 * @returns Whether date is after compareDate
 */
export const isDateAfter = (
  date: Date | string | number,
  compareDate: Date | string | number = new Date()
): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  const compareDateObj =
    typeof compareDate === "string"
      ? parseISO(compareDate)
      : new Date(compareDate);

  return isAfter(dateObj, compareDateObj);
};

/**
 * Check if two dates are the same day
 * @param dateA First date
 * @param dateB Second date
 * @returns Whether dates are the same day
 */
export const isSameDate = (
  dateA: Date | string | number,
  dateB: Date | string | number
): boolean => {
  const dateObjA =
    typeof dateA === "string" ? parseISO(dateA) : new Date(dateA);
  const dateObjB =
    typeof dateB === "string" ? parseISO(dateB) : new Date(dateB);

  return isSameDay(dateObjA, dateObjB);
};

/**
 * Get a readable time ago string with appropriate units
 * @param date The date to format
 * @returns Human-readable time ago string
 */
export const getTimeAgo = (date: Date | string | number): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  const now = new Date();

  const diffMinutes = differenceInMinutes(now, dateObj);
  const diffHours = differenceInHours(now, dateObj);
  const diffDays = differenceInDays(now, dateObj);

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Format a date range
 * @param startDate The start date
 * @param endDate The end date
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: Date | string | number,
  endDate: Date | string | number
): string => {
  const startDateObj =
    typeof startDate === "string" ? parseISO(startDate) : new Date(startDate);
  const endDateObj =
    typeof endDate === "string" ? parseISO(endDate) : new Date(endDate);

  if (isSameDay(startDateObj, endDateObj)) {
    return `${formatDate(startDateObj)}`;
  }

  return `${formatDate(startDateObj)} - ${formatDate(endDateObj)}`;
};

/**
 * Get future date by adding days, weeks, or months
 * @param date Base date
 * @param value Amount to add
 * @param unit Unit (days, weeks, months)
 * @returns Future date
 */
export const getFutureDate = (
  date: Date | string | number = new Date(),
  value: number,
  unit: "days" | "weeks" | "months"
): Date => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  switch (unit) {
    case "days":
      return addDays(dateObj, value);
    case "weeks":
      return addWeeks(dateObj, value);
    case "months":
      return addMonths(dateObj, value);
    default:
      return addDays(dateObj, value);
  }
};

/**
 * Get past date by subtracting days, weeks, or months
 * @param date Base date
 * @param value Amount to subtract
 * @param unit Unit (days, weeks, months)
 * @returns Past date
 */
export const getPastDate = (
  date: Date | string | number = new Date(),
  value: number,
  unit: "days" | "weeks" | "months"
): Date => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);

  switch (unit) {
    case "days":
      return subDays(dateObj, value);
    case "weeks":
      return subWeeks(dateObj, value);
    case "months":
      return subMonths(dateObj, value);
    default:
      return subDays(dateObj, value);
  }
};

/**
 * Check if a date is expired
 * @param expiryDate The expiry date to check
 * @returns Whether the date is expired
 */
export const isExpired = (expiryDate: Date | string | number): boolean => {
  const expiryDateObj =
    typeof expiryDate === "string"
      ? parseISO(expiryDate)
      : new Date(expiryDate);
  const now = new Date();

  return isDateBefore(expiryDateObj, now);
};

/**
 * Calculate time remaining until a date
 * @param targetDate The target date
 * @returns Human-readable time remaining
 */
export const getTimeRemaining = (
  targetDate: Date | string | number
): string => {
  const targetDateObj =
    typeof targetDate === "string"
      ? parseISO(targetDate)
      : new Date(targetDate);
  const now = new Date();

  if (isDateBefore(targetDateObj, now)) {
    return "Expired";
  }

  const diffDays = differenceInDays(targetDateObj, now);
  const diffHours = differenceInHours(targetDateObj, now) % 24;
  const diffMinutes = differenceInMinutes(targetDateObj, now) % 60;

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h remaining`;
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m remaining`;
  } else {
    return `${diffMinutes}m remaining`;
  }
};
