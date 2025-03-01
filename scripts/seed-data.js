import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function seedDatabase() {
  console.log("Seeding database...");

  // Sample user data
  await supabase.from("users").insert([
    {
      email: "user1@example.com",
      username: "user1",
      full_name: "User One",
      is_verified: true,
    },
    {
      email: "user2@example.com",
      username: "user2",
      full_name: "User Two",
      is_verified: false,
    },
  ]);

  console.log("Data seeding complete! ✅");
}

seedDatabase().catch(console.error);
s;
