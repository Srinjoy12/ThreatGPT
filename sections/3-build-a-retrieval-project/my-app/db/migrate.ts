import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { Sql } from "postgres";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    console.log(`Retrying... (${retries} attempts remaining)`);
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (MAX_RETRIES - retries + 1)));
    return retryWithBackoff(fn, retries - 1);
  }
}

async function main() {
  console.log("Running migration...");
  let sql: Sql | undefined;
  
  try {
    // Create connection with retry logic and more resilient settings
    sql = await retryWithBackoff(async () => {
      console.log("Attempting to connect to database...");
      return postgres(process.env.DATABASE_URL || "", { 
        max: 5,
        connect_timeout: 60,
        idle_timeout: 60,
        max_lifetime: 60 * 30,
        ssl: 'require',
        connection: {
          application_name: 'migration-script'
        }
      });
    });

    if (!sql) {
      throw new Error("Failed to establish database connection");
    }

    // After this point, we know sql is defined
    const sqlClient = sql;
    const db = drizzle(sqlClient);

    // Enable pgvector extension
    await retryWithBackoff(async () => {
      console.log("Creating vector extension...");
      await sqlClient`CREATE EXTENSION IF NOT EXISTS vector`;
    });
    
    // Drop existing table if it exists
    await retryWithBackoff(async () => {
      console.log("Dropping existing table if exists...");
      await sqlClient`DROP TABLE IF EXISTS documents`;
    });
    
    // Create the documents table with vector support
    await retryWithBackoff(async () => {
      console.log("Creating documents table...");
      await sqlClient`
        CREATE TABLE documents (
          id SERIAL PRIMARY KEY,
          content TEXT NOT NULL,
          embedding vector(256),
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `;
    });
    
    // Create HNSW index for vector similarity search
    await retryWithBackoff(async () => {
      console.log("Creating vector index...");
      await sqlClient`CREATE INDEX data_embedding_index ON documents USING hnsw (embedding vector_cosine_ops)`;
    });
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    if (sql) {
      await sql.end();
    }
  }
}

main().catch(console.error);