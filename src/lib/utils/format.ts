/**
 * Utility functions for formatting data
 */
import { format, formatDistance, formatRelative } from "date-fns";
import { DATE_FORMATS } from "../constants";

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

/**
 * Format a number with commas for thousands
 */
export const formatNumber = (
  number: number,
  locale: string = "en-US",
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(number);
};

/**
 * Format a percentage
 */
export const formatPercent = (
  value: number,
  decimalPlaces: number = 1,
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value / 100);
};

/**
 * Format a date with the specified format
 */
export const formatDate = (
  date: Date | number | string,
  formatString: string = DATE_FORMATS.DEFAULT
): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  return format(dateObj, formatString);
};

/**
 * Format a date as a relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (
  date: Date | number | string,
  baseDate: Date | number = new Date()
): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  return formatDistance(dateObj, baseDate, { addSuffix: true });
};

/**
 * Format a date relative to the current time in a conversational way
 */
export const formatRelativeDatetime = (
  date: Date | number | string,
  baseDate: Date | number = new Date()
): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";

  return formatRelative(dateObj, baseDate);
};

/**
 * Format a file size in bytes to a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Format a phone number to a standard format
 */
export const formatPhoneNumber = (
  phoneNumber: string,
  countryCode: string = "US"
): string => {
  try {
    // Remove non-numeric characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Format based on country code
    switch (countryCode) {
      case "US":
        // Format as (XXX) XXX-XXXX
        if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(
            3,
            6
          )}-${cleaned.slice(6)}`;
        }
        break;
      // Add more country formats as needed
    }

    // Return original if no formatting applied
    return phoneNumber;
  } catch (error) {
    return phoneNumber;
  }
};

/**
 * Format a duration in milliseconds to human-readable format
 */
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds < 0) return "0s";

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Format a list of items into a comma-separated string with "and" before the last item
 */
export const formatList = (
  items: string[],
  conjunction: string = "and"
): string => {
  if (!items || items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(", ");

  return `${otherItems}, ${conjunction} ${lastItem}`;
};

/**
 * Format text as a slug (URL-friendly string)
 */
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

/**
 * Format a name as initials
 */
export const formatInitials = (name: string): string => {
  if (!name) return "";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
