// Base API URL
export const API_BASE = "/api";

// Auth endpoints
export const AUTH = {
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
  LOGOUT: `${API_BASE}/auth/logout`,
  FORGOT_PASSWORD: `${API_BASE}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  VERIFY_EMAIL: `${API_BASE}/auth/verify-email`,
  ME: `${API_BASE}/auth/me`,
};

// User endpoints
export const USERS = {
  BASE: `${API_BASE}/users`,
  GET_USER: (id: string) => `${API_BASE}/users/${id}`,
  UPDATE_USER: (id: string) => `${API_BASE}/users/${id}`,
  DELETE_USER: (id: string) => `${API_BASE}/users/${id}`,
  FOLLOW_USER: (id: string) => `${API_BASE}/users/${id}/follow`,
  UNFOLLOW_USER: (id: string) => `${API_BASE}/users/${id}/unfollow`,
  FOLLOWERS: (id: string) => `${API_BASE}/users/${id}/followers`,
  FOLLOWING: (id: string) => `${API_BASE}/users/${id}/following`,
};

// Poll endpoints
export const POLLS = {
  BASE: `${API_BASE}/polls`,
  CREATE: `${API_BASE}/polls`,
  GET_POLL: (id: string) => `${API_BASE}/polls/${id}`,
  UPDATE_POLL: (id: string) => `${API_BASE}/polls/${id}`,
  DELETE_POLL: (id: string) => `${API_BASE}/polls/${id}`,
  VOTE: (id: string) => `${API_BASE}/polls/${id}/vote`,
  RESULTS: (id: string) => `${API_BASE}/polls/${id}/results`,
  TRENDING: `${API_BASE}/polls/trending`,
  BY_USER: (userId: string) => `${API_BASE}/polls/user/${userId}`,
  BY_TAG: (tag: string) => `${API_BASE}/polls/tag/${tag}`,
};

// Opinion endpoints
export const OPINIONS = {
  BASE: `${API_BASE}/opinions`,
  CREATE: `${API_BASE}/opinions`,
  GET_OPINION: (id: string) => `${API_BASE}/opinions/${id}`,
  UPDATE_OPINION: (id: string) => `${API_BASE}/opinions/${id}`,
  DELETE_OPINION: (id: string) => `${API_BASE}/opinions/${id}`,
  LIKE: (id: string) => `${API_BASE}/opinions/${id}/like`,
  UNLIKE: (id: string) => `${API_BASE}/opinions/${id}/unlike`,
  BY_USER: (userId: string) => `${API_BASE}/opinions/user/${userId}`,
  BY_POLL: (pollId: string) => `${API_BASE}/opinions/poll/${pollId}`,
  TRENDING: `${API_BASE}/opinions/trending`,
};

// Comment endpoints
export const COMMENTS = {
  BASE: `${API_BASE}/comments`,
  CREATE: `${API_BASE}/comments`,
  GET_COMMENT: (id: string) => `${API_BASE}/comments/${id}`,
  UPDATE_COMMENT: (id: string) => `${API_BASE}/comments/${id}`,
  DELETE_COMMENT: (id: string) => `${API_BASE}/comments/${id}`,
  LIKE: (id: string) => `${API_BASE}/comments/${id}/like`,
  UNLIKE: (id: string) => `${API_BASE}/comments/${id}/unlike`,
  BY_POLL: (pollId: string) => `${API_BASE}/comments/poll/${pollId}`,
  BY_OPINION: (opinionId: string) =>
    `${API_BASE}/comments/opinion/${opinionId}`,
};

// Forum endpoints
export const FORUMS = {
  BASE: `${API_BASE}/forums`,
  CREATE: `${API_BASE}/forums`,
  GET_FORUM: (id: string) => `${API_BASE}/forums/${id}`,
  UPDATE_FORUM: (id: string) => `${API_BASE}/forums/${id}`,
  DELETE_FORUM: (id: string) => `${API_BASE}/forums/${id}`,
  THREADS: (forumId: string) => `${API_BASE}/forums/${forumId}/threads`,
  CREATE_THREAD: (forumId: string) => `${API_BASE}/forums/${forumId}/threads`,
  GET_THREAD: (forumId: string, threadId: string) =>
    `${API_BASE}/forums/${forumId}/threads/${threadId}`,
};

// Group endpoints
export const GROUPS = {
  BASE: `${API_BASE}/groups`,
  CREATE: `${API_BASE}/groups`,
  GET_GROUP: (id: string) => `${API_BASE}/groups/${id}`,
  UPDATE_GROUP: (id: string) => `${API_BASE}/groups/${id}`,
  DELETE_GROUP: (id: string) => `${API_BASE}/groups/${id}`,
  JOIN: (id: string) => `${API_BASE}/groups/${id}/join`,
  LEAVE: (id: string) => `${API_BASE}/groups/${id}/leave`,
  MEMBERS: (id: string) => `${API_BASE}/groups/${id}/members`,
  ADD_MEMBER: (id: string, userId: string) =>
    `${API_BASE}/groups/${id}/members/${userId}`,
  REMOVE_MEMBER: (id: string, userId: string) =>
    `${API_BASE}/groups/${id}/members/${userId}`,
  POLLS: (id: string) => `${API_BASE}/groups/${id}/polls`,
};

// Notification endpoints
export const NOTIFICATIONS = {
  BASE: `${API_BASE}/notifications`,
  GET_ALL: `${API_BASE}/notifications`,
  MARK_READ: (id: string) => `${API_BASE}/notifications/${id}/read`,
  MARK_ALL_READ: `${API_BASE}/notifications/read-all`,
  DELETE: (id: string) => `${API_BASE}/notifications/${id}`,
};

// Admin endpoints
export const ADMIN = {
  BASE: `${API_BASE}/admin`,
  DASHBOARD: `${API_BASE}/admin/dashboard`,
  USERS: `${API_BASE}/admin/users`,
  POLLS: `${API_BASE}/admin/polls`,
  OPINIONS: `${API_BASE}/admin/opinions`,
  COMMENTS: `${API_BASE}/admin/comments`,
  FORUMS: `${API_BASE}/admin/forums`,
  GROUPS: `${API_BASE}/admin/groups`,
  MODERATION: `${API_BASE}/admin/moderation`,
  SETTINGS: `${API_BASE}/admin/settings`,
};

// Analytics endpoints
export const ANALYTICS = {
  BASE: `${API_BASE}/analytics`,
  OVERVIEW: `${API_BASE}/analytics/overview`,
  USERS: `${API_BASE}/analytics/users`,
  POLLS: `${API_BASE}/analytics/polls`,
  OPINIONS: `${API_BASE}/analytics/opinions`,
  ENGAGEMENT: `${API_BASE}/analytics/engagement`,
  TRENDS: `${API_BASE}/analytics/trends`,
  REPORTS: `${API_BASE}/analytics/reports`,
  EXPORT: `${API_BASE}/analytics/export`,
};

// Search endpoints
export const SEARCH = {
  BASE: `${API_BASE}/search`,
  POLLS: `${API_BASE}/search/polls`,
  OPINIONS: `${API_BASE}/search/opinions`,
  USERS: `${API_BASE}/search/users`,
  FORUMS: `${API_BASE}/search/forums`,
  GROUPS: `${API_BASE}/search/groups`,
  ALL: `${API_BASE}/search/all`,
};
