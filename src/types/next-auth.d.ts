import "next-auth";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Role } from "./user";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: Role;
    };
    supabaseAccessToken?: string;
    expires: string;
  }

  interface User extends SupabaseUser {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    image?: string;
    role: Role;
    supabaseAccessToken?: string;
  }
}
