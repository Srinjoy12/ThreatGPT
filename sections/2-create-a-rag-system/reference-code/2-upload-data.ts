import { generateEmbeddings } from "./1-generate-embeddings";
import { db } from "./db";
import { factsTable } from "./db/schema/facts-schema";

// Takes an array of documents with content and name, generates embeddings, and stores in database
export async function uploadData(docs: { content: string; name: string }[]) {
  // Generate vector embeddings for all document content
  const embeddings = await generateEmbeddings(docs.map((doc) => doc.content));

  // Insert documents and their embeddings into the database
  await db.insert(factsTable).values(
    embeddings.map((embedding, index) => ({
      embedding,
      name: docs[index].name,
      content: docs[index].content
    }))
  );
}

// UNCOMMENT TO TEST, THEN COMMENT AGAIN
// async function main() {
//   await uploadData(MOCK_DATA);
// }

// main();
