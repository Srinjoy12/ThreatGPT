"use server";

import { db } from "@/db";
import { sql } from "drizzle-orm";
import { generateEmbeddings } from "../generate/generate-embedding";

// Retrieves relevant documents from the database based on semantic similarity to input text
export async function retrieveDocuments(input: string, options: { limit?: number; minSimilarity?: number } = {}) {
  
  const { limit = 10, minSimilarity = 0.3 } = options;

  
  const docCount = await db.execute(sql`SELECT COUNT(*) as count FROM documents`);
  console.log("Total documents in database:", docCount[0].count);

  if (docCount[0].count === 0) {
    console.log("No documents found in the database");
    return [];
  }

  
  const embeddings = await generateEmbeddings([input]);
  
  
  const embeddingArray = `[${embeddings[0].join(',')}]`;

  
  const documents = await db.execute(sql`
    SELECT content, 1 - (embedding <-> ${embeddingArray}::vector) as similarity
    FROM documents
    WHERE 1 - (embedding <-> ${embeddingArray}::vector) > ${minSimilarity}
    ORDER BY similarity DESC
    LIMIT ${limit};
  `);

  return documents.map(doc => ({
    content: doc.content as string,
    similarity: doc.similarity as number
  }));
}
