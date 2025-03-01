/**
 * Logging utility for application-wide logging
 */

// Log levels
enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

// Configure log level based on environment
const getCurrentLogLevel = (): LogLevel => {
  const env = process.env.NODE_ENV || "development";
  const configuredLevel = process.env.LOG_LEVEL?.toUpperCase();

  if (configuredLevel && Object.keys(LogLevel).includes(configuredLevel)) {
    return LogLevel[configuredLevel as keyof typeof LogLevel];
  }

  // Default log levels based on environment
  if (env === "production") return LogLevel.ERROR;
  if (env === "test") return LogLevel.WARN;
  return LogLevel.DEBUG; // Development gets all logs
};

const LOG_LEVEL = getCurrentLogLevel();

// Helper to format logs consistently
const formatLog = (level: string, message: string, meta?: any): string => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

/**
 * Logger class to handle all application logging
 */
class Logger {
  /**
   * Log an error message
   */
  error(message: string, meta?: any): void {
    if (LOG_LEVEL >= LogLevel.ERROR) {
      const formattedMessage = formatLog("ERROR", message, meta);
      console.error(formattedMessage);

      // In production, you might want to send errors to a monitoring service
      if (!isBrowser && process.env.NODE_ENV === "production") {
        // Example: Send to error monitoring service
        // errorMonitoringService.captureError(message, meta);
      }
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, meta?: any): void {
    if (LOG_LEVEL >= LogLevel.WARN) {
      const formattedMessage = formatLog("WARN", message, meta);
      console.warn(formattedMessage);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, meta?: any): void {
    if (LOG_LEVEL >= LogLevel.INFO) {
      const formattedMessage = formatLog("INFO", message, meta);
      console.info(formattedMessage);
    }
  }

  /**
   * Log a debug message
   */
  debug(message: string, meta?: any): void {
    if (LOG_LEVEL >= LogLevel.DEBUG) {
      const formattedMessage = formatLog("DEBUG", message, meta);
      console.debug(formattedMessage);
    }
  }

  /**
   * Log API request details
   */
  logApiRequest(method: string, url: string, data?: any): void {
    this.debug(`API Request: ${method} ${url}`, { data });
  }

  /**
   * Log API response details
   */
  logApiResponse(
    method: string,
    url: string,
    status: number,
    data?: any,
    duration?: number
  ): void {
    const meta = { status, duration, data };

    if (status >= 400) {
      this.error(`API Response: ${method} ${url}`, meta);
    } else {
      this.debug(`API Response: ${method} ${url}`, meta);
    }
  }

  /**
   * Log a user action
   */
  logUserAction(userId: string, action: string, details?: any): void {
    this.info(`User Action: [${userId}] ${action}`, details);
  }

  /**
   * Log performance metrics
   */
  logPerformance(operation: string, durationMs: number, meta?: any): void {
    this.debug(`Performance: ${operation} took ${durationMs}ms`, meta);

    // Report slow operations as warnings
    if (durationMs > 1000) {
      this.warn(`Slow operation: ${operation} took ${durationMs}ms`, meta);
    }
  }

  /**
   * Create a grouped log for related operations
   */
  group(name: string): () => void {
    if (LOG_LEVEL >= LogLevel.DEBUG) {
      console.group(name);
      const startTime = performance.now();

      return () => {
        const duration = performance.now() - startTime;
        this.debug(`${name} completed`, { durationMs: duration });
        console.groupEnd();
      };
    }

    return () => {}; // No-op if logging is disabled
  }
}

// Create and export a singleton logger instance
const logger = new Logger();
export default logger;
