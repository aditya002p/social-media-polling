import {
  formatISO,
  subDays,
  subWeeks,
  subMonths,
  parseISO,
  format,
} from "date-fns";
import { fetchClient } from "../api/fetchClient";
import { endpoints } from "../api/endpoints";

/**
 * Time period for trend analysis
 */
export enum TrendPeriod {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  QUARTER = "quarter",
  YEAR = "year",
}

/**
 * Trend metric types
 */
export enum TrendMetric {
  // User metrics
  USER_SIGNUPS = "user_signups",
  USER_LOGINS = "user_logins",
  ACTIVE_USERS = "active_users",

  // Content metrics
  POLLS_CREATED = "polls_created",
  POLL_VOTES = "poll_votes",
  OPINIONS_CREATED = "opinions_created",
  COMMENTS_CREATED = "comments_created",

  // Engagement metrics
  AVERAGE_SESSION_DURATION = "average_session_duration",
  PAGES_PER_SESSION = "pages_per_session",
  BOUNCE_RATE = "bounce_rate",

  // Interaction metrics
  LIKES = "likes",
  SHARES = "shares",

  // Group metrics
  GROUPS_CREATED = "groups_created",
  GROUP_JOINS = "group_joins",

  // Traffic metrics
  TOTAL_PAGEVIEWS = "total_pageviews",
  UNIQUE_VISITORS = "unique_visitors",
}

/**
 * Interface for trend data point
 */
export interface TrendDataPoint {
  date: string;
  value: number;
}

/**
 * Interface for trend data
 */
export interface TrendData {
  metric: TrendMetric;
  data: TrendDataPoint[];
  previousPeriodData?: TrendDataPoint[];
  total: number;
  previousTotal?: number;
  percentageChange?: number;
}

/**
 * Interface for trend comparison
 */
export interface TrendComparison {
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  isPositive: boolean;
}

/**
 * Get start date based on trend period
 * @param period The trend period
 * @returns ISO date string
 */
export const getStartDateForPeriod = (period: TrendPeriod): string => {
  const now = new Date();

  switch (period) {
    case TrendPeriod.DAY:
      return formatISO(subDays(now, 1));
    case TrendPeriod.WEEK:
      return formatISO(subWeeks(now, 1));
    case TrendPeriod.MONTH:
      return formatISO(subMonths(now, 1));
    case TrendPeriod.QUARTER:
      return formatISO(subMonths(now, 3));
    case TrendPeriod.YEAR:
      return formatISO(subMonths(now, 12));
    default:
      return formatISO(subWeeks(now, 1));
  }
};

/**
 * Get previous period date range
 * @param period The trend period
 * @returns Object with start and end dates for the previous period
 */
export const getPreviousPeriodRange = (
  period: TrendPeriod
): { start: string; end: string } => {
  const now = new Date();
  let start: Date;
  let end: Date;

  switch (period) {
    case TrendPeriod.DAY:
      start = subDays(now, 2);
      end = subDays(now, 1);
      break;
    case TrendPeriod.WEEK:
      start = subWeeks(now, 2);
      end = subWeeks(now, 1);
      break;
    case TrendPeriod.MONTH:
      start = subMonths(now, 2);
      end = subMonths(now, 1);
      break;
    case TrendPeriod.QUARTER:
      start = subMonths(now, 6);
      end = subMonths(now, 3);
      break;
    case TrendPeriod.YEAR:
      start = subMonths(now, 24);
      end = subMonths(now, 12);
      break;
    default:
      start = subWeeks(now, 2);
      end = subWeeks(now, 1);
  }

  return {
    start: formatISO(start),
    end: formatISO(end),
  };
};

/**
 * Format date for display based on trend period
 * @param dateString ISO date string
 * @param period The trend period
 * @returns Formatted date string
 */
export const formatDateForTrend = (
  dateString: string,
  period: TrendPeriod
): string => {
  const date = parseISO(dateString);

  switch (period) {
    case TrendPeriod.DAY:
      return format(date, "HH:mm");
    case TrendPeriod.WEEK:
      return format(date, "EEE");
    case TrendPeriod.MONTH:
      return format(date, "MMM d");
    case TrendPeriod.QUARTER:
      return format(date, "MMM yyyy");
    case TrendPeriod.YEAR:
      return format(date, "MMM yyyy");
    default:
      return format(date, "MMM d");
  }
};

/**
 * Fetch trend data for a specific metric
 * @param metric The trend metric
 * @param period The trend period
 * @param filters Optional filters
 * @returns Promise with trend data
 */
export const fetchTrendData = async (
  metric: TrendMetric,
  period: TrendPeriod = TrendPeriod.WEEK,
  filters: Record<string, any> = {}
): Promise<TrendData> => {
  const startDate = getStartDateForPeriod(period);
  const endDate = formatISO(new Date());

  const { start: previousStart, end: previousEnd } =
    getPreviousPeriodRange(period);

  const params = new URLSearchParams({
    metric,
    period,
    startDate,
    endDate,
    previousStartDate: previousStart,
    previousEndDate: previousEnd,
    ...filters,
  });

  const url = `${endpoints.analytics.trends}?${params.toString()}`;
  const response = await fetchClient(url);
  return response.data;
};

/**
 * Calculate trend comparison between two periods
 * @param currentValue The current period value
 * @param previousValue The previous period value
 * @returns Trend comparison data
 */
export const calculateTrendComparison = (
  currentValue: number,
  previousValue: number
): TrendComparison => {
  let percentageChange = 0;

  if (previousValue > 0) {
    percentageChange = ((currentValue - previousValue) / previousValue) * 100;
  } else if (currentValue > 0) {
    percentageChange = 100; // If previous was 0 and current is positive, that's a 100% increase
  }

  return {
    currentValue,
    previousValue,
    percentageChange,
    isPositive: percentageChange >= 0,
  };
};

/**
 * Get top trending items (polls, opinions, etc.)
 * @param itemType The type of items to get
 * @param period The trend period
 * @param limit The maximum number of items to return
 * @returns Promise with top trending items
 */
export const getTopTrendingItems = async (
  itemType: "polls" | "opinions" | "forums" | "groups",
  period: TrendPeriod = TrendPeriod.WEEK,
  limit: number = 10
): Promise<any[]> => {
  const startDate = getStartDateForPeriod(period);

  const params = new URLSearchParams({
    type: itemType,
    period,
    startDate,
    limit: limit.toString(),
  });

  const url = `${endpoints.analytics.trending}?${params.toString()}`;
  const response = await fetchClient(url);
  return response.data;
};

/**
 * Detect anomalies in trend data
 * @param data Array of trend data points
 * @param sensitivityFactor Factor to determine anomaly threshold (default: 2)
 * @returns Data points with anomaly indicators
 */
export const detectAnomalies = (
  data: TrendDataPoint[],
  sensitivityFactor: number = 2
): (TrendDataPoint & { isAnomaly?: boolean })[] => {
  if (data.length < 3) return data;

  // Calculate mean and standard deviation
  const values = data.map((point) => point.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const variance =
    squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  // Threshold for anomaly detection
  const threshold = stdDev * sensitivityFactor;

  // Mark anomalies
  return data.map((point) => ({
    ...point,
    isAnomaly: Math.abs(point.value - mean) > threshold,
  }));
};

/**
 * Smooth trend data using moving average
 * @param data Array of trend data points
 * @param windowSize Window size for moving average
 * @returns Smoothed data points
 */
export const smoothTrendData = (
  data: TrendDataPoint[],
  windowSize: number = 3
): TrendDataPoint[] => {
  if (data.length < windowSize) return data;

  const result: TrendDataPoint[] = [];

  for (let i = 0; i < data.length; i++) {
    let sum = 0;
    let count = 0;

    // Calculate window boundaries
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length - 1, i + Math.floor(windowSize / 2));

    // Sum values within window
    for (let j = start; j <= end; j++) {
      sum += data[j].value;
      count++;
    }

    // Calculate moving average
    result.push({
      date: data[i].date,
      value: sum / count,
    });
  }

  return result;
};
