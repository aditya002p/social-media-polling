import { execSync } from "child_process";

console.log("Starting deployment...");

// Run migrations before deploying
console.log("Running database migrations...");
execSync("psql -U $DB_USER -d $DB_NAME -f migrations/migrations.sql", {
  stdio: "inherit",
});

// Deploy to Vercel
console.log("Deploying to Vercel...");
execSync("vercel --prod", { stdio: "inherit" });

console.log("Deployment complete! 🚀");
