import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  created_by: string;
  created_at: string;
  closes_at: string | null;
  is_anonymous: boolean;
  is_public: boolean;
  allow_comments: boolean;
  total_votes: number;
  category: string;
  tags: string[];
}

export interface PollOption {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
  percentage?: number;
}

export const usePoll = (pollId?: string) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch all polls (with pagination)
  const fetchPolls = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true);
    try {
      let query = supabase
        .from("polls")
        .select(
          "*, options(*), profiles:created_by(username, display_name, avatar_url)"
        )
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const formattedPolls = data.map(formatPollData);
      setPolls(formattedPolls);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Error fetching polls:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single poll by ID
  const fetchPoll = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("polls")
        .select(
          "*, options(*), profiles:created_by(username, display_name, avatar_url)"
        )
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      const formattedPoll = formatPollData(data);
      setPoll(formattedPoll);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
      console.error("Error fetching poll:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new poll
  const createPoll = async (
    pollData: Omit<Poll, "id" | "created_at" | "total_votes">
  ) => {
    if (!user) {
      throw new Error("You must be logged in to create a poll");
    }

    try {
      // Insert poll
      const { data: pollResult, error: pollError } = await supabase
        .from("polls")
        .insert([
          {
            title: pollData.title,
            description: pollData.description,
            created_by: user.id,
            closes_at: pollData.closes_at,
            is_anonymous: pollData.is_anonymous,
            is_public: pollData.is_public,
            allow_comments: pollData.allow_comments,
            category: pollData.category,
            tags: pollData.tags,
          },
        ])
        .select();

      if (pollError || !pollResult || pollResult.length === 0) {
        throw pollError || new Error("Failed to create poll");
      }

      const pollId = pollResult[0].id;

      // Insert options
      const optionsData = pollData.options.map((option) => ({
        poll_id: pollId,
        text: option.text,
        votes: 0,
      }));

      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsData);

      if (optionsError) {
        throw optionsError;
      }

      return { id: pollId };
    } catch (err) {
      console.error("Error creating poll:", err);
      throw err;
    }
  };

  // Vote on a poll
  const vote = async (pollId: string, optionId: string) => {
    if (!user) {
      throw new Error("You must be logged in to vote");
    }

    try {
      // Check if user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from("votes")
        .select("*")
        .eq("poll_id", pollId)
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        // Error other than "no rows returned"
        throw checkError;
      }

      if (existingVote) {
        throw new Error("You have already voted on this poll");
      }

      // Record the vote
      const { error: voteError } = await supabase.from("votes").insert([
        {
          poll_id: pollId,
          option_id: optionId,
          user_id: user.id,
        },
      ]);

      if (voteError) {
        throw voteError;
      }

      // Increment the option count
      const { error: updateError } = await supabase.rpc(
        "increment_option_vote",
        {
          option_id_param: optionId,
        }
      );

      if (updateError) {
        throw updateError;
      }

      // Increment the poll total count
      const { error: totalError } = await supabase.rpc("increment_poll_vote", {
        poll_id_param: pollId,
      });

      if (totalError) {
        throw totalError;
      }

      // Refetch the poll to get updated data
      if (poll) {
        await fetchPoll(pollId);
      }

      return true;
    } catch (err) {
      console.error("Error voting on poll:", err);
      throw err;
    }
  };

  // Delete a poll
  const deletePoll = async (pollId: string) => {
    if (!user) {
      throw new Error("You must be logged in to delete a poll");
    }

    try {
      // Check if user is the poll creator
      const { data: pollData, error: pollError } = await supabase
        .from("polls")
        .select("created_by")
        .eq("id", pollId)
        .single();

      if (pollError) {
        throw pollError;
      }

      if (pollData.created_by !== user.id) {
        throw new Error("You are not authorized to delete this poll");
      }

      // Delete the poll (cascade will handle options, votes, etc.)
      const { error: deleteError } = await supabase
        .from("polls")
        .delete()
        .eq("id", pollId);

      if (deleteError) {
        throw deleteError;
      }

      return true;
    } catch (err) {
      console.error("Error deleting poll:", err);
      throw err;
    }
  };

  // Helper function to format poll data
  const formatPollData = (data: any): Poll => {
    const options = data.options.map((option: any) => ({
      id: option.id,
      poll_id: option.poll_id,
      text: option.text,
      votes: option.votes,
      percentage:
        data.total_votes > 0
          ? Math.round((option.votes / data.total_votes) * 100)
          : 0,
    }));

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      options: options,
      created_by: data.created_by,
      created_at: data.created_at,
      closes_at: data.closes_at,
      is_anonymous: data.is_anonymous,
      is_public: data.is_public,
      allow_comments: data.allow_comments,
      total_votes: data.total_votes,
      category: data.category,
      tags: data.tags,
    };
  };

  // Load poll data if pollId is provided
  useEffect(() => {
    if (pollId) {
      fetchPoll(pollId);
    }
  }, [pollId]);

  return {
    polls,
    poll,
    loading,
    error,
    fetchPolls,
    fetchPoll,
    createPoll,
    vote,
    deletePoll,
  };
};
