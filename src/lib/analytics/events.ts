import { getCookie, setCookie } from "cookies-next";
import { v4 as uuidv4 } from "uuid";
import { gtag } from "./gtag";

/**
 * Event types for analytics
 */
export enum EventType {
  // User events
  USER_SIGN_UP = "user_sign_up",
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",
  USER_PROFILE_UPDATE = "user_profile_update",
  USER_SETTINGS_UPDATE = "user_settings_update",

  // Poll events
  POLL_VIEW = "poll_view",
  POLL_CREATE = "poll_create",
  POLL_EDIT = "poll_edit",
  POLL_DELETE = "poll_delete",
  POLL_VOTE = "poll_vote",
  POLL_SHARE = "poll_share",

  // Opinion events
  OPINION_VIEW = "opinion_view",
  OPINION_CREATE = "opinion_create",
  OPINION_EDIT = "opinion_edit",
  OPINION_DELETE = "opinion_delete",
  OPINION_LIKE = "opinion_like",
  OPINION_DISLIKE = "opinion_dislike",
  OPINION_SHARE = "opinion_share",

  // Comment events
  COMMENT_CREATE = "comment_create",
  COMMENT_EDIT = "comment_edit",
  COMMENT_DELETE = "comment_delete",
  COMMENT_LIKE = "comment_like",

  // Forum events
  FORUM_VIEW = "forum_view",
  FORUM_CREATE = "forum_create",
  THREAD_CREATE = "thread_create",

  // Group events
  GROUP_VIEW = "group_view",
  GROUP_CREATE = "group_create",
  GROUP_JOIN = "group_join",
  GROUP_LEAVE = "group_leave",

  // Search events
  SEARCH_PERFORM = "search_perform",
  SEARCH_FILTER_CHANGE = "search_filter_change",

  // Navigation events
  PAGE_VIEW = "page_view",
  FEATURE_USE = "feature_use",

  // Engagement events
  NOTIFICATION_CLICK = "notification_click",
  EXTERNAL_LINK_CLICK = "external_link_click",
}

/**
 * Interface for event properties
 */
export interface EventProperties {
  [key: string]: any;
}

/**
 * Get or create a session ID for tracking
 */
export const getSessionId = (): string => {
  const existingSessionId = getCookie("session_id") as string | undefined;

  if (existingSessionId) {
    return existingSessionId;
  }

  const newSessionId = uuidv4();
  setCookie("session_id", newSessionId, { maxAge: 60 * 60 * 24 }); // 24 hours
  return newSessionId;
};

/**
 * Track an event
 * @param eventType The type of event to track
 * @param properties Additional properties for the event
 * @param userId Optional user ID
 */
export const trackEvent = (
  eventType: EventType,
  properties: EventProperties = {},
  userId?: string
): void => {
  const sessionId = getSessionId();
  const timestamp = new Date().toISOString();

  // Common event data
  const eventData = {
    event_type: eventType,
    event_properties: properties,
    timestamp,
    session_id: sessionId,
    user_id: userId || "anonymous",
    url: typeof window !== "undefined" ? window.location.href : "",
    referrer: typeof document !== "undefined" ? document.referrer : "",
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
  };

  // Log event to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Event:", eventData);
  }

  // Send to Google Analytics
  gtag("event", eventType, {
    ...properties,
    session_id: sessionId,
    user_id: userId || undefined,
  });

  // Send to our analytics API
  if (typeof fetch !== "undefined") {
    fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
      credentials: "include",
    }).catch((error) => {
      console.error("Failed to send event to analytics API:", error);
    });
  }
};

/**
 * Track a page view
 * @param pageName The name of the page
 * @param userId Optional user ID
 */
export const trackPageView = (pageName: string, userId?: string): void => {
  trackEvent(EventType.PAGE_VIEW, { page_name: pageName }, userId);
};

/**
 * Track a feature use
 * @param featureName The name of the feature
 * @param details Additional details about the feature use
 * @param userId Optional user ID
 */
export const trackFeatureUse = (
  featureName: string,
  details: Record<string, any> = {},
  userId?: string
): void => {
  trackEvent(
    EventType.FEATURE_USE,
    {
      feature_name: featureName,
      ...details,
    },
    userId
  );
};

/**
 * Identify a user for analytics
 * @param userId The user ID
 * @param userProperties Additional user properties
 */
export const identifyUser = (
  userId: string,
  userProperties: Record<string, any> = {}
): void => {
  if (typeof fetch !== "undefined") {
    fetch("/api/analytics/identify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        user_properties: userProperties,
        timestamp: new Date().toISOString(),
      }),
      credentials: "include",
    }).catch((error) => {
      console.error("Failed to identify user for analytics:", error);
    });
  }
};
