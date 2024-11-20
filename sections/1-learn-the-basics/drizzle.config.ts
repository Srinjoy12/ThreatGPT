import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "./sections/1-learn-the-basics/.env.local" });

console.log(process.env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  schema: "./sections/1-learn-the-basics/db/schema",
  out: "./sections/1-learn-the-basics/db/migrations"
});
