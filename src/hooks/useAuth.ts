import { useContext, createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    userData: any
  ) => Promise<{ error: any; user: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  getUserInfo: (userId: string) => any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersCache, setUsersCache] = useState<Record<string, any>>({});

  useEffect(() => {
    // Set up session listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (!error && data.user) {
      // Create user profile in profiles table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          username: userData.username,
          display_name: userData.displayName,
          avatar_url: null,
          bio: "",
          created_at: new Date(),
        },
      ]);

      return { error: profileError, user: data.user };
    }

    return { error, user: data.user };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updateProfile = async (data: any) => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    // Update auth metadata
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        displayName: data.displayName,
      },
    });

    if (authError) {
      return { error: authError };
    }

    // Update profile in profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: data.username,
        display_name: data.displayName,
        avatar_url: data.avatarUrl,
        bio: data.bio,
        updated_at: new Date(),
      })
      .eq("id", user.id);

    return { error: profileError };
  };

  const getUserInfo = async (userId: string) => {
    // Check cache first
    if (usersCache[userId]) {
      return usersCache[userId];
    }

    // Fetch from database
    const { data, error } = await supabase
      .from("profiles")
      .select("*, badges(*)")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    // Format the user data
    const userData = {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      online: data.online_status === "online",
      badges: data.badges || [],
    };

    // Update cache
    setUsersCache((prev) => ({ ...prev, [userId]: userData }));

    return userData;
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    getUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
