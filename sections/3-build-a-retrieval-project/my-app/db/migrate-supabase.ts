import { createClient } from '@supabase/supabase-js';
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

// You'll need to add your Supabase URL and anon key to your .env.local file
const SUPABASE_URL = 'https://zrntfvknpahhixbhwsyj.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
  console.error("Error: SUPABASE_ANON_KEY not found in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log("Running migration...");
  
  try {
    // Enable pgvector extension
    console.log("Creating vector extension...");
    const { error: vectorError } = await supabase.rpc('create_vector_extension');
    if (vectorError) {
      console.log("Vector extension might already exist, continuing...");
    }

    // Drop existing table if it exists
    console.log("Dropping existing table if exists...");
    const { error: dropError } = await supabase.rpc('drop_documents_table');
    if (dropError) {
      console.log("No table to drop, continuing...");
    }

    // Create the documents table
    console.log("Creating documents table...");
    const { error: createError } = await supabase.rpc('create_documents_table');
    if (createError) {
      console.log("Table might already exist, continuing...");
    }

    // Create vector index
    console.log("Creating vector index...");
    const { error: indexError } = await supabase.rpc('create_vector_index');
    if (indexError) {
      console.log("Index might already exist, continuing...");
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main().catch(console.error); 