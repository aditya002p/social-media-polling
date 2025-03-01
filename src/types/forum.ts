/**
 * Types for forums and discussion threads
 */
import { Tables } from "./supabase";

// Base Forum type from the database
export type Forum = Tables<"forums">;
export type ForumThread = Tables<"forum_threads">;

// Extended Forum type with additional data
export interface ForumWithDetails extends Forum {
  creator: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  category?: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  recent_threads?: {
    id: string;
    title: string;
    created_at: string;
    created_by: string;
    username: string;
    post_count: number;
  }[];
}

// Extended Thread type with additional data
export interface ThreadWithDetails extends ForumThread {
  creator: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  forum: {
    id: string;
    name: string;
  };
  last_post_user?: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
  is_followed?: boolean;
}

// Forum creation/update payload
export interface ForumFormData {
  name: string;
  description?: string | null;
  is_public: boolean;
  category_id?: string | null;
}

// Thread creation/update payload
export interface ThreadFormData {
  forum_id: string;
  title: string;
  content: string;
}

// Forum filters for queries
export interface ForumFilters {
  category_id?: string;
  created_by?: string;
  is_featured?: boolean;
  search?: string;
  sort_by?: "newest" | "popular" | "most_active";
  limit?: number;
  offset?: number;
}

// Thread filters for queries
export interface ThreadFilters {
  forum_id?: string;
  created_by?: string;
  is_pinned?: boolean;
  search?: string;
  sort_by?: "newest" | "last_activity" | "most_views" | "most_posts";
  limit?: number;
  offset?: number;
}

// Forum statistics
export interface ForumStatistics {
  total_forums: number;
  total_threads: number;
  total_posts: number;
  active_users: number;
  most_active_forums: {
    id: string;
    name: string;
    post_count: number;
    thread_count: number;
  }[];
  recent_activity: {
    thread_id: string;
    thread_title: string;
    forum_id: string;
    forum_name: string;
    last_post_at: string;
    last_post_by: string;
    username: string;
  }[];
}
