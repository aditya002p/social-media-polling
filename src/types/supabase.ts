/**
 * Types for Supabase database schema
 * This file defines TypeScript types that mirror the Supabase database structure
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          location: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
          last_seen: string | null;
          role: "user" | "moderator" | "admin";
          is_verified: boolean;
          is_banned: boolean;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
          last_seen?: string | null;
          role?: "user" | "moderator" | "admin";
          is_verified?: boolean;
          is_banned?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          location?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
          last_seen?: string | null;
          role?: "user" | "moderator" | "admin";
          is_verified?: boolean;
          is_banned?: boolean;
        };
      };
      polls: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
          is_public: boolean;
          is_featured: boolean;
          is_closed: boolean;
          allow_comments: boolean;
          view_count: number;
          vote_count: number;
          category_id: string | null;
          tags: string[] | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
          is_public?: boolean;
          is_featured?: boolean;
          is_closed?: boolean;
          allow_comments?: boolean;
          view_count?: number;
          vote_count?: number;
          category_id?: string | null;
          tags?: string[] | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          expires_at?: string | null;
          is_public?: boolean;
          is_featured?: boolean;
          is_closed?: boolean;
          allow_comments?: boolean;
          view_count?: number;
          vote_count?: number;
          category_id?: string | null;
          tags?: string[] | null;
        };
      };
      poll_options: {
        Row: {
          id: string;
          poll_id: string;
          text: string;
          image_url: string | null;
          color: string | null;
          created_at: string;
          position: number;
          vote_count: number;
        };
        Insert: {
          id?: string;
          poll_id: string;
          text: string;
          image_url?: string | null;
          color?: string | null;
          created_at?: string;
          position?: number;
          vote_count?: number;
        };
        Update: {
          id?: string;
          poll_id?: string;
          text?: string;
          image_url?: string | null;
          color?: string | null;
          created_at?: string;
          position?: number;
          vote_count?: number;
        };
      };
      votes: {
        Row: {
          id: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          created_at: string;
          ip_address: string | null;
          device_info: Json | null;
        };
        Insert: {
          id?: string;
          poll_id: string;
          option_id: string;
          user_id: string;
          created_at?: string;
          ip_address?: string | null;
          device_info?: Json | null;
        };
        Update: {
          id?: string;
          poll_id?: string;
          option_id?: string;
          user_id?: string;
          created_at?: string;
          ip_address?: string | null;
          device_info?: Json | null;
        };
      };
      opinions: {
        Row: {
          id: string;
          title: string;
          content: string;
          created_by: string;
          created_at: string;
          updated_at: string;
          is_public: boolean;
          is_featured: boolean;
          view_count: number;
          like_count: number;
          dislike_count: number;
          category_id: string | null;
          tags: string[] | null;
          poll_id: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          is_featured?: boolean;
          view_count?: number;
          like_count?: number;
          dislike_count?: number;
          category_id?: string | null;
          tags?: string[] | null;
          poll_id?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          is_featured?: boolean;
          view_count?: number;
          like_count?: number;
          dislike_count?: number;
          category_id?: string | null;
          tags?: string[] | null;
          poll_id?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          content: string;
          created_by: string;
          created_at: string;
          updated_at: string;
          parent_id: string | null;
          target_type: "poll" | "opinion" | "forum_thread";
          target_id: string;
          is_hidden: boolean;
          like_count: number;
          dislike_count: number;
        };
        Insert: {
          id?: string;
          content: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string | null;
          target_type: "poll" | "opinion" | "forum_thread";
          target_id: string;
          is_hidden?: boolean;
          like_count?: number;
          dislike_count?: number;
        };
        Update: {
          id?: string;
          content?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          parent_id?: string | null;
          target_type?: "poll" | "opinion" | "forum_thread";
          target_id?: string;
          is_hidden?: boolean;
          like_count?: number;
          dislike_count?: number;
        };
      };
      forums: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
          created_by: string;
          is_public: boolean;
          is_featured: boolean;
          thread_count: number;
          post_count: number;
          category_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by: string;
          is_public?: boolean;
          is_featured?: boolean;
          thread_count?: number;
          post_count?: number;
          category_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string;
          is_public?: boolean;
          is_featured?: boolean;
          thread_count?: number;
          post_count?: number;
          category_id?: string | null;
        };
      };
      forum_threads: {
        Row: {
          id: string;
          forum_id: string;
          title: string;
          content: string;
          created_by: string;
          created_at: string;
          updated_at: string;
          is_pinned: boolean;
          is_locked: boolean;
          view_count: number;
          post_count: number;
          last_post_at: string | null;
          last_post_by: string | null;
        };
        Insert: {
          id?: string;
          forum_id: string;
          title: string;
          content: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          post_count?: number;
          last_post_at?: string | null;
          last_post_by?: string | null;
        };
        Update: {
          id?: string;
          forum_id?: string;
          title?: string;
          content?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          is_pinned?: boolean;
          is_locked?: boolean;
          view_count?: number;
          post_count?: number;
          last_post_at?: string | null;
          last_post_by?: string | null;
        };
      };
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          is_public: boolean;
          is_featured: boolean;
          member_count: number;
          avatar_url: string | null;
          cover_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          is_featured?: boolean;
          member_count?: number;
          avatar_url?: string | null;
          cover_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
          is_public?: boolean;
          is_featured?: boolean;
          member_count?: number;
          avatar_url?: string | null;
          cover_url?: string | null;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: "member" | "moderator" | "admin";
          joined_at: string;
          invited_by: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: "member" | "moderator" | "admin";
          joined_at?: string;
          invited_by?: string | null;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: "member" | "moderator" | "admin";
          joined_at?: string;
          invited_by?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type:
            | "poll_vote"
            | "comment"
            | "mention"
            | "follow"
            | "like"
            | "group_invite"
            | "system";
          title: string;
          content: string | null;
          is_read: boolean;
          created_at: string;
          target_type:
            | "poll"
            | "opinion"
            | "comment"
            | "profile"
            | "group"
            | "forum_thread"
            | null;
          target_id: string | null;
          actor_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type:
            | "poll_vote"
            | "comment"
            | "mention"
            | "follow"
            | "like"
            | "group_invite"
            | "system";
          title: string;
          content?: string | null;
          is_read?: boolean;
          created_at?: string;
          target_type?:
            | "poll"
            | "opinion"
            | "comment"
            | "profile"
            | "group"
            | "forum_thread"
            | null;
          target_id?: string | null;
          actor_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?:
            | "poll_vote"
            | "comment"
            | "mention"
            | "follow"
            | "like"
            | "group_invite"
            | "system";
          title?: string;
          content?: string | null;
          is_read?: boolean;
          created_at?: string;
          target_type?:
            | "poll"
            | "opinion"
            | "comment"
            | "profile"
            | "group"
            | "forum_thread"
            | null;
          target_id?: string | null;
          actor_id?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          created_at: string;
          color: string | null;
          icon: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          created_at?: string;
          color?: string | null;
          icon?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_id?: string | null;
          created_at?: string;
          color?: string | null;
          icon?: string | null;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          event_data: Json;
          user_id: string | null;
          session_id: string | null;
          created_at: string;
          ip_address: string | null;
          device_info: Json | null;
        };
        Insert: {
          id?: string;
          event_type: string;
          event_data: Json;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
          ip_address?: string | null;
          device_info?: Json | null;
        };
        Update: {
          id?: string;
          event_type?: string;
          event_data?: Json;
          user_id?: string | null;
          session_id?: string | null;
          created_at?: string;
          ip_address?: string | null;
          device_info?: Json | null;
        };
      };
    };
    Views: {
      poll_results: {
        Row: {
          poll_id: string;
          option_id: string;
          option_text: string;
          vote_count: number;
          percentage: number;
          total_votes: number;
        };
      };
      trending_polls: {
        Row: {
          id: string;
          title: string;
          created_by: string;
          username: string;
          vote_count: number;
          comment_count: number;
          created_at: string;
          score: number;
        };
      };
      user_activity: {
        Row: {
          user_id: string;
          username: string;
          polls_created: number;
          opinions_created: number;
          comments_made: number;
          votes_cast: number;
          last_active: string;
        };
      };
    };
    Functions: {
      search_polls: {
        Args: {
          search_term: string;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          created_by: string;
          username: string;
          vote_count: number;
          created_at: string;
        }[];
      };
      get_poll_analytics: {
        Args: {
          poll_id: string;
        };
        Returns: {
          total_votes: number;
          unique_voters: number;
          vote_history: Json;
          demographic_data: Json;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

export type FunctionResult<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T]["Returns"];
export type FunctionArgs<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T]["Args"];
