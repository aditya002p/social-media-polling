import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function setupDatabase() {
  console.log("Running database migrations...");
  const migrations = fs.readFileSync(
    path.join(__dirname, "../migrations/migrations.sql"),
    "utf8"
  );
  await supabase.rpc("sql", { query: migrations });

  console.log("Seeding initial data...");
  const seedData = fs.readFileSync(
    path.join(__dirname, "../migrations/seed.sql"),
    "utf8"
  );
  await supabase.rpc("sql", { query: seedData });

  console.log("Setup complete! ✅");
}

setupDatabase().catch(console.error);
