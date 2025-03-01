import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Initialize the Supabase admin client with service role key
// This client has bypass RLS permissions - use with caution!
// These values should be set in your .env.local file (not exposed to the client)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseServiceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

// Create a Supabase client with admin privileges
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Admin-only utilities

// Create a new user
export const createUser = async (
  email: string,
  password: string,
  userData: any
) => {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: userData,
  });

  if (error) {
    console.error("Error creating user:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
};

// Delete a user
export const deleteUser = async (userId: string) => {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
};

// Update user role
export const updateUserRole = async (userId: string, role: string) => {
  // First get the user data to maintain existing metadata
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.getUserById(userId);

  if (userError) {
    console.error("Error getting user:", userError.message);
    return { success: false, error: userError };
  }

  // Update the user with the new role
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    {
      app_metadata: { ...userData.user.app_metadata, role },
    }
  );

  if (error) {
    console.error("Error updating user role:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
};
