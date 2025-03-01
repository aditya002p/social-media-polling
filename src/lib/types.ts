/**
 * Application-wide TypeScript type definitions
 */
import { ReactNode } from "react";
import {
  POLL_TYPES,
  OPINION_TYPES,
  USER_ROLES,
  NOTIFICATION_TYPES,
} from "./constants";

// Common Types
export type ID = string;
export type Timestamp = string; // ISO format timestamp

// Auth Types
export interface User {
  id: ID;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  role: keyof typeof USER_ROLES;
  verified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  followersCount: number;
  followingCount: number;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Timestamp;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  firstName?: string;
  lastName?: string;
}

// Poll Types
export type PollType = keyof typeof POLL_TYPES;

export interface PollOption {
  id: ID;
  text: string;
  imageUrl?: string;
  count: number;
  percentage: number;
}

export interface Poll {
  id: ID;
  title: string;
  description?: string;
  type: PollType;
  options: PollOption[];
  createdBy: User;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt?: Timestamp;
  totalVotes: number;
  isPrivate: boolean;
  allowComments: boolean;
  featured: boolean;
  categories: string[];
  tags: string[];
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  userVoted?: ID; // Option ID the current user voted for
}

export interface CreatePollData {
  title: string;
  description?: string;
  type: PollType;
  options: { text: string; imageUrl?: string }[];
  expiresAt?: Timestamp;
  isPrivate: boolean;
  allowComments: boolean;
  categories?: string[];
  tags?: string[];
}

export interface VoteData {
  pollId: ID;
  optionId: ID;
}

// Opinion Types
export type OpinionType = keyof typeof OPINION_TYPES;

export interface Opinion {
  id: ID;
  title: string;
  content: string;
  type: OpinionType;
  createdBy: User;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  mediaUrls?: string[];
  linkUrl?: string;
  isPrivate: boolean;
  allowComments: boolean;
  categories: string[];
  tags: string[];
  reactionsCount: {
    like: number;
    love: number;
    agree: number;
    disagree: number;
    insightful: number;
  };
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  userReaction?: string; // Current user's reaction
}

export interface CreateOpinionData {
  title: string;
  content: string;
  type: OpinionType;
  mediaUrls?: string[];
  linkUrl?: string;
  isPrivate: boolean;
  allowComments: boolean;
  categories?: string[];
  tags?: string[];
}

export interface ReactionData {
  opinionId: ID;
  reaction: string;
}

// Comment Types
export interface Comment {
  id: ID;
  content: string;
  createdBy: User;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  parentId?: ID; // For replies
  reactionCounts: {
    like: number;
    dislike: number;
  };
  repliesCount: number;
  userReaction?: string; // Current user's reaction
}

export interface CreateCommentData {
  content: string;
  parentId?: ID; // For replies
  targetType: "poll" | "opinion" | "forum_thread";
  targetId: ID;
}

// Forum Types
export interface Forum {
  id: ID;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  threadsCount: number;
  postsCount: number;
  lastActivity?: Timestamp;
  categories: string[];
  isPrivate: boolean;
  moderators: User[];
}

export interface ForumThread {
  id: ID;
  title: string;
  content: string;
  createdBy: User;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  forum: Forum;
  postsCount: number;
  viewsCount: number;
  isPinned: boolean;
  isLocked: boolean;
  lastPostAt?: Timestamp;
  lastPostBy?: User;
  tags: string[];
}

// Group Types
export interface Group {
  id: ID;
  name: string;
  description: string;
  imageUrl?: string;
  coverUrl?: string;
  createdBy: User;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  membersCount: number;
  isPrivate: boolean;
  isSecret: boolean;
  categories: string[];
  adminUsers: User[];
  lastActivity?: Timestamp;
}

export interface GroupMember {
  id: ID;
  user: User;
  group: Group;
  role: "admin" | "moderator" | "member";
  joinedAt: Timestamp;
}

// Notification Types
export type NotificationType = keyof typeof NOTIFICATION_TYPES;

export interface Notification {
  id: ID;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  sourceId?: ID; // ID of the object that triggered the notification
  sourceType?: string; // Type of the object that triggered the notification
  sourceUser?: User; // User who triggered the notification
  targetUrl?: string; // URL to navigate to on click
}

// Analytics Types
export interface AnalyticsPeriod {
  startDate: Timestamp;
  endDate: Timestamp;
  label: string;
}

export interface AnalyticsDataPoint {
  date: Timestamp;
  value: number;
  label?: string;
}

export interface AnalyticsBreakdown {
  label: string;
  value: number;
  percentage: number;
}

export interface UserActivityData {
  registrations: AnalyticsDataPoint[];
  activeUsers: AnalyticsDataPoint[];
  retention: AnalyticsDataPoint[];
  engagementRate: AnalyticsDataPoint[];
}

export interface ContentActivityData {
  pollsCreated: AnalyticsDataPoint[];
  votesSubmitted: AnalyticsDataPoint[];
  opinionsShared: AnalyticsDataPoint[];
  commentsPosted: AnalyticsDataPoint[];
}

export interface TrendData {
  trendingPolls: Poll[];
  trendingOpinions: Opinion[];
  trendingTags: AnalyticsBreakdown[];
  trendingCategories: AnalyticsBreakdown[];
}

// UI Component Types
export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "link" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export interface CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: ReactNode;
  footer?: ReactNode;
  closeOnOverlayClick?: boolean;
}

export interface InputProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  className?: string;
}

// Pagination and Filtering
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface FilterParams {
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  category?: string | string[];
  tag?: string | string[];
  timeframe?: "day" | "week" | "month" | "year" | "all";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Record<string, any>;
}

// Search Types
export interface SearchParams extends PaginationParams, FilterParams {
  query: string;
  type?: "all" | "polls" | "opinions" | "users" | "forums" | "groups";
}

export interface SearchResult {
  id: ID;
  type: "poll" | "opinion" | "user" | "forum" | "group";
  title: string;
  description?: string;
  imageUrl?: string;
  createdAt: Timestamp;
  createdBy?: User;
  relevanceScore: number;
}

export interface SearchResults {
  query: string;
  results: SearchResult[];
  totalCount: number;
  categories: {
    polls: number;
    opinions: number;
    users: number;
    forums: number;
    groups: number;
  };
}

// Export Types
export interface ExportParams {
  type: "polls" | "opinions" | "users" | "comments" | "analytics";
  format: "csv" | "json" | "pdf" | "excel";
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  filters?: Record<string, any>;
}

export interface ExportResult {
  id: ID;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  format: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  status: "processing" | "completed" | "failed";
  errorMessage?: string;
}

// Webhook Types
export interface Webhook {
  id: ID;
  url: string;
  events: string[];
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastTriggeredAt?: Timestamp;
  secret: string;
  description?: string;
}

export interface WebhookEvent {
  id: ID;
  webhookId: ID;
  event: string;
  payload: any;
  status: "success" | "failed";
  statusCode?: number;
  createdAt: Timestamp;
  responseTime?: number;
  errorMessage?: string;
}

// Report Types
export interface Report {
  id: ID;
  type: "poll" | "opinion" | "comment" | "user" | "forum" | "group";
  targetId: ID;
  reason: string;
  details?: string;
  reportedBy: User;
  createdAt: Timestamp;
  status: "pending" | "reviewed" | "actioned" | "dismissed";
  reviewedBy?: User;
  reviewedAt?: Timestamp;
  actionTaken?: string;
}

// Moderation Types
export interface ModerationAction {
  id: ID;
  targetType: "poll" | "opinion" | "comment" | "user" | "forum" | "group";
  targetId: ID;
  action: "remove" | "hide" | "warn" | "ban" | "restrict";
  reason: string;
  duration?: number; // Duration in seconds for temporary actions
  moderatedBy: User;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  appealStatus?: "none" | "pending" | "approved" | "rejected";
  appealReason?: string;
}

// Settings Types
export interface UserSettings {
  id: ID;
  userId: ID;
  theme: "light" | "dark" | "system";
  language: string;
  emailNotifications: {
    pollResponses: boolean;
    comments: boolean;
    mentions: boolean;
    follows: boolean;
    groupInvites: boolean;
    systemUpdates: boolean;
  };
  pushNotifications: {
    pollResponses: boolean;
    comments: boolean;
    mentions: boolean;
    follows: boolean;
    groupInvites: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private" | "followers";
    showActivity: boolean;
    allowTagging: boolean;
    allowMentions: boolean;
  };
  updatedAt: Timestamp;
}

export interface SystemSettings {
  id: ID;
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  featuredPolls: ID[];
  featuredOpinions: ID[];
  contentModeration: {
    enableAutoModeration: boolean;
    profanityFilter: boolean;
    toxicityThreshold: number;
    requireApproval: boolean;
  };
  registration: {
    allowRegistration: boolean;
    requireEmailVerification: boolean;
    allowSocialLogin: boolean;
  };
  analytics: {
    enableTracking: boolean;
    googleAnalyticsId?: string;
    privacyMode: boolean;
  };
  updatedAt: Timestamp;
  updatedBy: User;
}

// Error Handling Types
export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "RATE_LIMITED"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "GATEWAY_TIMEOUT";

export interface AppError extends Error {
  code: ErrorCode;
  status: number;
  details?: any;
}
