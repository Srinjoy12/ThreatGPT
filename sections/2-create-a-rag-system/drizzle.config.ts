import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  schema: "./sections/2-create-a-rag-system/db/schema",
  out: "./sections/2-create-a-rag-system/db/migrations"
});
