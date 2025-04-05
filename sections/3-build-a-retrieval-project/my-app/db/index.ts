import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { documentsTable } from "./schema/document-schema";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const dbSchema = {
  // Tables
  documents: documentsTable
};

function initializeDb(url: string) {
  const client = postgres(url, { 
    max: 10, // Increased connection pool size
    connect_timeout: 30, // 30 second connection timeout
    idle_timeout: 30, // 30 second idle timeout
    max_lifetime: 60 * 30, // 30 minutes max lifetime
    ssl: 'require', // Force SSL
    prepare: false,
    connection: {
      application_name: 'rag-application'
    }
  });
  return drizzle(client, { schema: dbSchema });
}

export const db = initializeDb(databaseUrl);