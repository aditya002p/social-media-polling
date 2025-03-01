import { useState, useEffect, useCallback } from "react";
import { Opinion, CreateOpinionData, UpdateOpinionData } from "@/types/opinion";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export const useOpinion = () => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [opinion, setOpinion] = useState<Opinion | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all opinions
  const fetchOpinions = useCallback(async (filter?: any) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("opinions").select("*");

      // Apply filters if provided
      if (filter?.userId) {
        query = query.eq("user_id", filter.userId);
      }

      if (filter?.pollId) {
        query = query.eq("poll_id", filter.pollId);
      }

      if (filter?.status) {
        query = query.eq("status", filter.status);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      setOpinions(data as Opinion[]);
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to fetch opinions: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single opinion by ID
  const fetchOpinionById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("opinions")
        .select("*, users(id, username, avatar_url), polls(id, title)")
        .eq("id", id)
        .single();

      if (error) throw error;

      setOpinion(data as Opinion);
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to fetch opinion: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new opinion
  const createOpinion = useCallback(async (opinionData: CreateOpinionData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("opinions")
        .insert([opinionData])
        .select()
        .single();

      if (error) throw error;

      setOpinions((prev) => [data as Opinion, ...prev]);
      toast.success("Opinion created successfully");
      return data;
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to create opinion: ${e.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing opinion
  const updateOpinion = useCallback(
    async (id: string, opinionData: UpdateOpinionData) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("opinions")
          .update(opinionData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        setOpinions((prev) =>
          prev.map((o) => (o.id === id ? (data as Opinion) : o))
        );
        if (opinion?.id === id) {
          setOpinion(data as Opinion);
        }

        toast.success("Opinion updated successfully");
        return data;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to update opinion: ${e.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [opinion]
  );

  // Delete an opinion
  const deleteOpinion = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const { error } = await supabase.from("opinions").delete().eq("id", id);

        if (error) throw error;

        setOpinions((prev) => prev.filter((o) => o.id !== id));
        if (opinion?.id === id) {
          setOpinion(null);
        }

        toast.success("Opinion deleted successfully");
        return true;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to delete opinion: ${e.message}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [opinion]
  );

  // React to an opinion (like, dislike, etc.)
  const reactToOpinion = useCallback(
    async (opinionId: string, reaction: string) => {
      setLoading(true);
      setError(null);

      try {
        // First check if user already reacted
        const { data: existingReaction, error: fetchError } = await supabase
          .from("opinion_reactions")
          .select("*")
          .eq("opinion_id", opinionId)
          .eq("user_id", supabase.auth.user()?.id);

        if (fetchError) throw fetchError;

        let result;

        if (existingReaction && existingReaction.length > 0) {
          // User already reacted, update the reaction
          const { data, error } = await supabase
            .from("opinion_reactions")
            .update({ reaction_type: reaction })
            .eq("id", existingReaction[0].id)
            .select();

          if (error) throw error;
          result = data;
        } else {
          // New reaction
          const { data, error } = await supabase
            .from("opinion_reactions")
            .insert([
              {
                opinion_id: opinionId,
                user_id: supabase.auth.user()?.id,
                reaction_type: reaction,
              },
            ])
            .select();

          if (error) throw error;
          result = data;
        }

        // Refresh the opinion to get updated reaction counts
        await fetchOpinionById(opinionId);

        return result;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to react to opinion: ${e.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [fetchOpinionById]
  );

  return {
    opinions,
    opinion,
    loading,
    error,
    fetchOpinions,
    fetchOpinionById,
    createOpinion,
    updateOpinion,
    deleteOpinion,
    reactToOpinion,
  };
};

export default useOpinion;
