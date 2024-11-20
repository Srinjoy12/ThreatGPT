import { cosineDistance, desc, sql } from "drizzle-orm";
import { generateEmbeddings } from "./2-generate-embeddings";
import { db } from "./db";
import { documentsTable } from "./db/schema/documents-schema";

export async function retrieveDocuments(query: string, limit = 3) {
  const embeddings = await generateEmbeddings([query]);

  const similarity = sql<number>`1 - (${cosineDistance(documentsTable.embedding, embeddings[0])})`;

  const documents = await db.query.documents.findMany({
    orderBy: desc(similarity),
    limit: limit
  });

  console.log(documents);

  return documents;
}

retrieveDocuments("Tell me about rhinos");
