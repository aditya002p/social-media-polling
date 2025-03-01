/**
 * Types for user groups and memberships
 */
import { Tables } from "./supabase";

// Base Group type from the database
export type Group = Tables<"groups">;
export type GroupMember = Tables<"group_members">;

// Extended Group type with additional data
export interface GroupWithDetails extends Group {
  creator: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  user_role?: "member" | "moderator" | "admin" | null;
  polls_count: number;
  latest_polls?: {
    id: string;
    title: string;
    created_at: string;
    vote_count: number;
  }[];
  popular_members?: {
    id: string;
    username: string;
    avatar_url: string | null;
    role: "member" | "moderator" | "admin";
  }[];
}

// Extended Member type with user details
export interface MemberWithDetails extends GroupMember {
  user: {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
  invited_by_user?: {
    id: string;
    username: string;
    avatar_url: string | null;
  } | null;
}

// Group creation/update payload
export interface GroupFormData {
  name: string;
  description?: string | null;
  is_public: boolean;
  avatar_url?: string | null;
  cover_url?: string | null;
}

// Group membership actions
export interface GroupMemberAction {
  group_id: string;
  user_id: string;
  action: "invite" | "approve" | "decline" | "remove" | "promote" | "demote";
  role?: "member" | "moderator" | "admin";
}

// Group join request
export interface GroupJoinRequest {
  group_id: string;
  message?: string;
}

// Group filters for queries
export interface GroupFilters {
  created_by?: string;
  member_id?: string;
  is_featured?: boolean;
  is_public?: boolean;
  search?: string;
  sort_by?: "newest" | "popular" | "most_active";
  limit?: number;
  offset?: number;
}

// Group member filters for queries
export interface MemberFilters {
  group_id: string;
  role?: "member" | "moderator" | "admin";
  search?: string;
  sort_by?: "joined" | "alphabetical" | "role";
  limit?: number;
  offset?: number;
}

// Group statistics
export interface GroupStatistics {
  total_groups: number;
  total_members: number;
  public_groups: number;
  private_groups: number;
  most_active_groups: {
    id: string;
    name: string;
    member_count: number;
    poll_count: number;
  }[];
  recent_groups: {
    id: string;
    name: string;
    created_at: string;
    member_count: number;
  }[];
}
