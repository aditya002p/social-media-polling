/**
 * Types for users and authentication
 */
import { Tables } from "./supabase";

// Base User type from the database
export type User = Tables<"users">;

// User profile with additional data
export interface UserProfile extends User {
  poll_count: number;
  opinion_count: number;
  follower_count: number;
  following_count: number;
  groups: {
    id: string;
    name: string;
    role: "member" | "moderator" | "admin";
  }[];
  badges?: UserBadge[];
}

// User for authentication contexts
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: "user" | "moderator" | "admin";
  is_verified: boolean;
}

// User registration data
export interface UserRegistration {
  email: string;
  password: string;
  username: string;
  full_name?: string;
}

// User login credentials
export interface UserCredentials {
  email: string;
  password: string;
}

// User profile update payload
export interface UserProfileUpdate {
  username?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
}

// User settings
export interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  privacy: {
    show_votes: boolean;
    show_opinions: boolean;
    profile_visibility: "public" | "followers" | "private";
  };
  theme: "light" | "dark" | "system";
  language: string;
}

// User activity
export interface UserActivity {
  polls_created: number;
  opinions_created: number;
  comments_made: number;
  votes_cast: number;
  last_active: string;
  recent_polls: {
    id: string;
    title: string;
    created_at: string;
  }[];
  recent_opinions: {
    id: string;
    title: string;
    created_at: string;
  }[];
}

// User achievement/badge
export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

// User search filters
export interface UserSearchFilters {
  search?: string;
  role?: "user" | "moderator" | "admin";
  sort_by?: "username" | "joined" | "activity";
  limit?: number;
  offset?: number;
}

// User moderation actions
export type ModerationAction =
  | { type: "warn"; message: string }
  | { type: "restrict"; duration: number; features: string[] }
  | { type: "ban"; duration: number | "permanent"; reason: string }
  | { type: "unban" };
