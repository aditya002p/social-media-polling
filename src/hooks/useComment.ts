import { useState, useEffect, useCallback } from "react";
import { Comment, CreateCommentData, UpdateCommentData } from "@/types/comment";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export const useComment = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments for a specific content (poll, opinion, etc.)
  const fetchComments = useCallback(
    async ({
      contentType,
      contentId,
      parentId = null,
      page = 1,
      perPage = 10,
    }: {
      contentType: "poll" | "opinion" | "forum" | "thread";
      contentId: string;
      parentId?: string | null;
      page?: number;
      perPage?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("comments")
          .select(
            "*, users(id, username, avatar_url), parent:parent_id(id), replies:comments!parent_id(id)"
          )
          .eq("content_type", contentType)
          .eq("content_id", contentId)
          .order("created_at", { ascending: false });

        // If parentId is null, fetch top-level comments, otherwise fetch replies
        if (parentId === null) {
          query = query.is("parent_id", null);
        } else {
          query = query.eq("parent_id", parentId);
        }

        // Apply pagination
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;
        query = query.range(from, to);

        const { data, error } = await query;

        if (error) throw error;

        setComments(data as Comment[]);
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to fetch comments: ${e.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Create a new comment
  const createComment = useCallback(async (commentData: CreateCommentData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert([commentData])
        .select("*, users(id, username, avatar_url)")
        .single();

      if (error) throw error;

      setComments((prev) => [data as Comment, ...prev]);
      toast.success("Comment posted successfully");
      return data;
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to post comment: ${e.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing comment
  const updateComment = useCallback(
    async (id: string, commentData: UpdateCommentData) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("comments")
          .update(commentData)
          .eq("id", id)
          .select("*, users(id, username, avatar_url)")
          .single();

        if (error) throw error;

        setComments((prev) =>
          prev.map((c) => (c.id === id ? (data as Comment) : c))
        );
        toast.success("Comment updated successfully");
        return data;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to update comment: ${e.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a comment
  const deleteComment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("comments").delete().eq("id", id);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success("Comment deleted successfully");
      return true;
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to delete comment: ${e.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // React to a comment (like, dislike)
  const reactToComment = useCallback(
    async (commentId: string, reaction: "like" | "dislike") => {
      setLoading(true);
      setError(null);

      try {
        const userId = supabase.auth.user()?.id;
        if (!userId) throw new Error("User not authenticated");

        // Check if user already reacted
        const { data: existingReaction, error: fetchError } = await supabase
          .from("comment_reactions")
          .select("*")
          .eq("comment_id", commentId)
          .eq("user_id", userId)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 is the error code for "no rows returned" - this is expected if no reaction exists
          throw fetchError;
        }

        let result;

        if (existingReaction) {
          // If same reaction, remove it (toggle off)
          if (existingReaction.reaction_type === reaction) {
            const { error } = await supabase
              .from("comment_reactions")
              .delete()
              .eq("id", existingReaction.id);

            if (error) throw error;
          } else {
            // Change reaction type
            const { data, error } = await supabase
              .from("comment_reactions")
              .update({ reaction_type: reaction })
              .eq("id", existingReaction.id)
              .select();

            if (error) throw error;
            result = data;
          }
        } else {
          // Create new reaction
          const { data, error } = await supabase
            .from("comment_reactions")
            .insert([
              {
                comment_id: commentId,
                user_id: userId,
                reaction_type: reaction,
              },
            ])
            .select();

          if (error) throw error;
          result = data;
        }

        // Refresh comments to update reaction counts
        // For simplicity we'll re-fetch the current page of comments
        // In a production app, you might want to just update the specific comment

        return result;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to react to comment: ${e.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Report a comment
  const reportComment = useCallback(
    async (commentId: string, reason: string) => {
      setLoading(true);
      setError(null);

      try {
        const userId = supabase.auth.user()?.id;
        if (!userId) throw new Error("User not authenticated");

        const { data, error } = await supabase
          .from("comment_reports")
          .insert([
            {
              comment_id: commentId,
              user_id: userId,
              reason: reason,
            },
          ])
          .select();

        if (error) throw error;

        toast.success("Comment reported successfully");
        return data;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to report comment: ${e.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    comments,
    loading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
    reactToComment,
    reportComment,
  };
};

export default useComment;
