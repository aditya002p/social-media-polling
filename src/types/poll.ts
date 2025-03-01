/**
 * Types for polls and related data
 */
import { Database, Tables, Views } from "./supabase";

// Base Poll type from the database
export type Poll = Tables<"polls">;
export type PollOption = Tables<"poll_options">;
export type Vote = Tables<"votes">;
export type PollResult = Views<"poll_results">;
export type TrendingPoll = Views<"trending_polls">;

// Extended Poll type with related data
export interface PollWithOptions extends Poll {
  options: PollOption[];
  creator?: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  category?: {
    id: string;
    name: string;
    color: string | null;
  } | null;
  vote_count: number;
  comment_count: number;
}

// Poll with full result data
export interface PollWithResults extends PollWithOptions {
  results: PollResult[];
  user_vote?: string | null; // ID of the option the user voted for, if any
  analytics?: PollAnalytics;
}

// Poll creation/update payload
export interface PollFormData {
  title: string;
  description?: string | null;
  options: {
    id?: string;
    text: string;
    image_url?: string | null;
    color?: string | null;
    position: number;
  }[];
  expires_at?: Date | null;
  is_public: boolean;
  allow_comments: boolean;
  category_id?: string | null;
  tags?: string[] | null;
}

// Vote submission payload
export interface VoteSubmission {
  poll_id: string;
  option_id: string;
}

// Poll analytics data
export interface PollAnalytics {
  total_votes: number;
  unique_voters: number;
  vote_history: {
    date: string;
    count: number;
  }[];
  demographics?: {
    age?: {
      [key: string]: number;
    };
    gender?: {
      [key: string]: number;
    };
    location?: {
      [key: string]: number;
    };
  };
}

// Poll filters for queries
export interface PollFilters {
  category_id?: string;
  tags?: string[];
  created_by?: string;
  is_featured?: boolean;
  is_closed?: boolean;
  search?: string;
  sort_by?: "newest" | "popular" | "ending_soon" | "most_votes";
  limit?: number;
  offset?: number;
}

// Poll statistics
export interface PollStatistics {
  total_polls: number;
  total_votes: number;
  active_polls: number;
  polls_created_today: number;
  votes_cast_today: number;
  trending_categories: {
    id: string;
    name: string;
    poll_count: number;
  }[];
}
