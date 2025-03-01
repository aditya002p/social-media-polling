/**
 * Types for opinions and related data
 */
import { Tables } from "./supabase";

// Base Opinion type from the database
export type Opinion = Tables<"opinions">;

// Extended Opinion type with related data
export interface OpinionWithDetails extends Opinion {
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
  comment_count: number;
  user_reaction?: "like" | "dislike" | null;
  poll?: {
    id: string;
    title: string;
  } | null;
}

// Opinion creation/update payload
export interface OpinionFormData {
  title: string;
  content: string;
  is_public: boolean;
  category_id?: string | null;
  tags?: string[] | null;
  poll_id?: string | null;
}

// Opinion reaction submission payload
export interface OpinionReaction {
  opinion_id: string;
  reaction_type: "like" | "dislike" | null; // null to remove reaction
}

// Opinion filters for queries
export interface OpinionFilters {
  category_id?: string;
  tags?: string[];
  created_by?: string;
  is_featured?: boolean;
  poll_id?: string;
  search?: string;
  sort_by?: "newest" | "popular" | "most_liked" | "most_discussed";
  limit?: number;
  offset?: number;
}

// Opinion statistics
export interface OpinionStatistics {
  total_opinions: number;
  total_likes: number;
  total_dislikes: number;
  opinions_created_today: number;
  trending_topics: {
    tag: string;
    count: number;
  }[];
  most_active_authors: {
    user_id: string;
    username: string;
    opinion_count: number;
    total_likes: number;
  }[];
}
