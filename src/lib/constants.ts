/**
 * Application constants
 */

// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
  },
  POLLS: {
    BASE: "/api/polls",
    BY_ID: (id: string) => `/api/polls/${id}`,
    VOTE: (id: string) => `/api/polls/${id}/vote`,
    COMMENTS: (id: string) => `/api/polls/${id}/comments`,
    FEATURED: "/api/polls/featured",
    TRENDING: "/api/polls/trending",
  },
  OPINIONS: {
    BASE: "/api/opinions",
    BY_ID: (id: string) => `/api/opinions/${id}`,
    REACTIONS: (id: string) => `/api/opinions/${id}/reactions`,
    COMMENTS: (id: string) => `/api/opinions/${id}/comments`,
  },
  COMMENTS: {
    BASE: "/api/comments",
    BY_ID: (id: string) => `/api/comments/${id}`,
    REPLIES: (id: string) => `/api/comments/${id}/replies`,
  },
  USERS: {
    BASE: "/api/users",
    BY_ID: (id: string) => `/api/users/${id}`,
    PROFILE: (username: string) => `/api/users/profile/${username}`,
    FOLLOW: (id: string) => `/api/users/${id}/follow`,
    POLLS: (id: string) => `/api/users/${id}/polls`,
    OPINIONS: (id: string) => `/api/users/${id}/opinions`,
  },
  FORUMS: {
    BASE: "/api/forums",
    BY_ID: (id: string) => `/api/forums/${id}`,
    THREADS: (id: string) => `/api/forums/${id}/threads`,
  },
  GROUPS: {
    BASE: "/api/groups",
    BY_ID: (id: string) => `/api/groups/${id}`,
    MEMBERS: (id: string) => `/api/groups/${id}/members`,
    JOIN: (id: string) => `/api/groups/${id}/join`,
    LEAVE: (id: string) => `/api/groups/${id}/leave`,
  },
  NOTIFICATIONS: {
    BASE: "/api/notifications",
    MARK_READ: "/api/notifications/mark-read",
    SETTINGS: "/api/notifications/settings",
  },
  ANALYTICS: {
    BASE: "/api/analytics",
    TRENDS: "/api/analytics/trends",
    USER_ACTIVITY: "/api/analytics/user-activity",
    REPORTS: "/api/analytics/reports",
  },
  ADMIN: {
    BASE: "/api/admin",
    USERS: "/api/admin/users",
    POLLS: "/api/admin/polls",
    OPINIONS: "/api/admin/opinions",
    MODERATION: "/api/admin/moderation",
    ANALYTICS: "/api/admin/analytics",
    SETTINGS: "/api/admin/settings",
  },
  SEARCH: "/api/search",
};

// App Routes
export const APP_ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
  },
  DASHBOARD: {
    BASE: "/dashboard",
    PROFILE: "/profile",
    SETTINGS: "/settings",
  },
  ADMIN: {
    BASE: "/admin",
    POLLS: "/admin/polls-management",
    USERS: "/admin/users-management",
    MODERATION: "/admin/moderation",
    ANALYTICS: "/admin/analytics",
    SETTINGS: "/admin/settings",
  },
  POLLS: {
    BASE: "/polls",
    CREATE: "/polls/create",
    DETAIL: (id: string) => `/polls/${id}`,
    EDIT: (id: string) => `/polls/${id}/edit`,
  },
  OPINIONS: {
    BASE: "/opinions",
    CREATE: "/opinions/create",
    DETAIL: (id: string) => `/opinions/${id}`,
  },
  FORUMS: {
    BASE: "/forums",
    DETAIL: (id: string) => `/forums/${id}`,
    THREAD: (forumId: string, threadId: string) =>
      `/forums/${forumId}/threads/${threadId}`,
  },
  GROUPS: {
    BASE: "/groups",
    CREATE: "/groups/create",
    DETAIL: (id: string) => `/groups/${id}`,
  },
  ANALYTICS: {
    TRENDS: "/trends",
    REPORTS: "/reports",
    EXPORTS: "/exports",
  },
  SEARCH: "/search",
  NOTIFICATIONS: "/notifications",
  TRENDING: "/trending",
  ABOUT: "/about",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  HELP: "/help",
};

// Poll Types
export const POLL_TYPES = {
  MULTIPLE_CHOICE: "multiple_choice",
  SINGLE_CHOICE: "single_choice",
  RANKING: "ranking",
  OPEN_ENDED: "open_ended",
  SCALE: "scale",
  YES_NO: "yes_no",
};

// Opinion Types
export const OPINION_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  LINK: "link",
  POLL: "poll",
};

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  MODERATOR: "moderator",
  USER: "user",
  GUEST: "guest",
};

// Authentication Providers
export const AUTH_PROVIDERS = {
  EMAIL: "email",
  GOOGLE: "google",
  FACEBOOK: "facebook",
  TWITTER: "twitter",
  GITHUB: "github",
};

// Notification Types
export const NOTIFICATION_TYPES = {
  POLL_RESPONSE: "poll_response",
  COMMENT: "comment",
  MENTION: "mention",
  FOLLOW: "follow",
  GROUP_INVITE: "group_invite",
  POLL_FEATURED: "poll_featured",
  OPINION_REACTION: "opinion_reaction",
  SYSTEM: "system",
};

// Analytics Time Periods
export const ANALYTICS_PERIODS = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  QUARTER: "quarter",
  YEAR: "year",
  CUSTOM: "custom",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  VALIDATION_FAILED: "Validation failed. Please check your input.",
  RATE_LIMIT: "Too many requests. Please try again later.",
  DUPLICATE_ENTRY: "A resource with this information already exists.",
  INSUFFICIENT_PERMISSIONS: "You do not have sufficient permissions.",
  INVALID_CREDENTIALS: "Invalid credentials provided.",
};

// Validation Constants
export const VALIDATION = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 20,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_LOWERCASE: true,
    REQUIRE_UPPERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
  },
  POLL: {
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 200,
    DESCRIPTION_MAX_LENGTH: 1000,
    MIN_OPTIONS: 2,
    MAX_OPTIONS: 20,
  },
  OPINION: {
    TITLE_MIN_LENGTH: 5,
    TITLE_MAX_LENGTH: 200,
    CONTENT_MAX_LENGTH: 5000,
  },
  COMMENT: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 1000,
  },
};

// Dates
export const DATE_FORMATS = {
  DEFAULT: "MMMM d, yyyy",
  SHORT: "MMM d, yyyy",
  TIME: "h:mm a",
  DATETIME: "MMM d, yyyy h:mm a",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

// Local Storage Keys
export const LOCAL_STORAGE = {
  AUTH_TOKEN: "pollingsocial_auth_token",
  REFRESH_TOKEN: "pollingsocial_refresh_token",
  USER: "pollingsocial_user",
  THEME: "pollingsocial_theme",
  LANGUAGE: "pollingsocial_language",
  POLL_DRAFTS: "pollingsocial_poll_drafts",
  OPINION_DRAFTS: "pollingsocial_opinion_drafts",
};

// Theme
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

// Languages
export const LANGUAGES = {
  ENGLISH: "en",
  SPANISH: "es",
  FRENCH: "fr",
  GERMAN: "de",
  CHINESE: "zh",
  JAPANESE: "ja",
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm", "video/ogg"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Feature Flags
export const FEATURE_FLAGS = {
  FORUMS: true,
  GROUPS: true,
  OPINION_VIDEOS: true,
  ANALYTICS_EXPORT: true,
  ADVANCED_POLLS: true,
  OPINION_EDITOR: true,
};

// API Config
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.pollingsocial.com",
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  CACHE_TIME: 5 * 60 * 1000, // 5 minutes
};

// Social Media Platforms for Sharing
export const SOCIAL_PLATFORMS = {
  TWITTER: "twitter",
  FACEBOOK: "facebook",
  LINKEDIN: "linkedin",
  REDDIT: "reddit",
  WHATSAPP: "whatsapp",
  TELEGRAM: "telegram",
  EMAIL: "email",
};
