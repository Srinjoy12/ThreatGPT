import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const sql = postgres(process.env.DATABASE_URL || "", { max: 1 });
const db = drizzle(sql);

async function main() {
  console.log("Running migration...");
  
  try {
    // Enable pgvector extension
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    
    // Drop existing table if it exists
    await sql`DROP TABLE IF EXISTS documents`;
    
    // Create the documents table with vector support
    await sql`
      CREATE TABLE documents (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        embedding vector(256),
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create HNSW index for vector similarity search
    await sql`CREATE INDEX data_embedding_index ON documents USING hnsw (embedding vector_cosine_ops)`;
    
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  
  await sql.end();
}

main();