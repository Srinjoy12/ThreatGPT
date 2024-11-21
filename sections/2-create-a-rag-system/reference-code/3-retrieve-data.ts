import { and, cosineDistance, desc, gt, sql } from "drizzle-orm";
import { generateEmbeddings } from "./1-generate-embeddings";
import { db } from "./db";
import { factsTable } from "./db/schema/facts-schema";

// Retrieves relevant documents from the database based on semantic similarity to input text
export async function retrieveData(input: string, options: { limit?: number; minSimilarity?: number; name?: string | null } = {}) {
  // Set default options for result limit, minimum similarity threshold, and name filter
  const { limit = 10, minSimilarity = 0.3, name = null } = options;

  // Generate vector embedding for input text
  const embeddings = await generateEmbeddings([input]);
  // Calculate cosine similarity between input embedding and stored embeddings
  const similarity = sql<number>`1 - (${cosineDistance(factsTable.embedding, embeddings[0])})`;

  // Query database for relevant documents
  const documents = await db
    .select({
      name: factsTable.name,
      content: factsTable.content,
      similarity
    })
    .from(factsTable)
    // Filter by minimum similarity and optionally by case-insensitive name match
    .where(name ? and(gt(similarity, minSimilarity), sql`LOWER(${factsTable.name}) = LOWER(${name})`) : gt(similarity, minSimilarity))
    // Sort by highest similarity first
    .orderBy((t) => desc(t.similarity))
    // Limit number of results
    .limit(limit);

  return documents;
}

// UNCOMMENT TO TEST, THEN COMMENT AGAIN
// async function main() {
//   const documents = await retrieveData("Tell me about elephants");
//   console.log(documents);
// }

// main();
