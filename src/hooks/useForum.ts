import { useState, useCallback } from "react";
import {
  Forum,
  Thread,
  ForumCreateData,
  ThreadCreateData,
  ThreadUpdateData,
} from "@/types/forum";
import { supabase } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

export const useForum = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [forum, setForum] = useState<Forum | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all forums
  const fetchForums = useCallback(async (filter?: any) => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("forums").select("*");

      // Apply filters if provided
      if (filter?.category) {
        query = query.eq("category", filter.category);
      }

      if (filter?.status) {
        query = query.eq("status", filter.status);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      setForums(data as Forum[]);
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to fetch forums: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single forum by ID
  const fetchForumById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("forums")
        .select("*, users(id, username, avatar_url)")
        .eq("id", id)
        .single();

      if (error) throw error;

      setForum(data as Forum);
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to fetch forum: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new forum
  const createForum = useCallback(async (forumData: ForumCreateData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("forums")
        .insert([forumData])
        .select()
        .single();

      if (error) throw error;

      setForums((prev) => [data as Forum, ...prev]);
      toast.success("Forum created successfully");
      return data;
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to create forum: ${e.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch threads for a specific forum
  const fetchThreads = useCallback(
    async ({
      forumId,
      page = 1,
      perPage = 10,
      sortBy = "recent",
    }: {
      forumId: string;
      page?: number;
      perPage?: number;
      sortBy?: "recent" | "popular" | "active";
    }) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("threads")
          .select(
            "*, users(id, username, avatar_url), forums(id, title), latest_reply:replies(created_at), reply_count:replies(count)"
          )
          .eq("forum_id", forumId);

        // Apply sorting
        switch (sortBy) {
          case "popular":
            query = query.order("views", { ascending: false });
            break;
          case "active":
            query = query.order("latest_activity", { ascending: false });
            break;
          case "recent":
          default:
            query = query.order("created_at", { ascending: false });
            break;
        }

        // Apply pagination
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;
        query = query.range(from, to);

        const { data, error } = await query;

        if (error) throw error;

        setThreads(data as Thread[]);
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to fetch threads: ${e.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch a single thread by ID
  const fetchThreadById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("threads")
        .select("*, users(id, username, avatar_url), forums(id, title)")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from("threads")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", id);

      setThread(data as Thread);
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to fetch thread: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new thread
  const createThread = useCallback(async (threadData: ThreadCreateData) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("threads")
        .insert([
          {
            ...threadData,
            user_id: supabase.auth.user()?.id,
            views: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setThreads((prev) => [data as Thread, ...prev]);
      toast.success("Thread created successfully");
      return data;
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to create thread: ${e.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing thread
  const updateThread = useCallback(
    async (id: string, threadData: ThreadUpdateData) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("threads")
          .update(threadData)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        setThreads((prev) =>
          prev.map((t) => (t.id === id ? (data as Thread) : t))
        );
        if (thread?.id === id) {
          setThread(data as Thread);
        }

        toast.success("Thread updated successfully");
        return data;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to update thread: ${e.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [thread]
  );

  // Delete a thread
  const deleteThread = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);

      try {
        const { error } = await supabase.from("threads").delete().eq("id", id);

        if (error) throw error;

        setThreads((prev) => prev.filter((t) => t.id !== id));
        if (thread?.id === id) {
          setThread(null);
        }

        toast.success("Thread deleted successfully");
        return true;
      } catch (e: any) {
        setError(e.message);
        toast.error(`Failed to delete thread: ${e.message}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [thread]
  );

  // Subscribe/unsubscribe to a forum
  const toggleForumSubscription = useCallback(async (forumId: string) => {
    setLoading(true);
    setError(null);

    try {
      const userId = supabase.auth.user()?.id;
      if (!userId) throw new Error("User not authenticated");

      // Check if already subscribed
      const { data: existingSub, error: fetchError } = await supabase
        .from("forum_subscriptions")
        .select("*")
        .eq("forum_id", forumId)
        .eq("user_id", userId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is the error code for "no rows returned" - this is expected if no subscription exists
        throw fetchError;
      }

      let result;

      if (existingSub) {
        // Unsubscribe
        const { error } = await supabase
          .from("forum_subscriptions")
          .delete()
          .eq("id", existingSub.id);

        if (error) throw error;

        toast.success("Unsubscribed from forum");
        result = null;
      } else {
        // Subscribe
        const { data, error } = await supabase
          .from("forum_subscriptions")
          .insert([
            {
              forum_id: forumId,
              user_id: userId,
            },
          ])
          .select();

        if (error) throw error;

        toast.success("Subscribed to forum");
        result = data;
      }

      return result;
    } catch (e: any) {
      setError(e.message);
      toast.error(`Failed to update subscription: ${e.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    forums,
    forum,
    threads,
    thread,
    loading,
    error,
    fetchForums,
    fetchForumById,
    createForum,
    fetchThreads,
    fetchThreadById,
    createThread,
    updateThread,
    deleteThread,
    toggleForumSubscription,
  };
};

export default useForum;
